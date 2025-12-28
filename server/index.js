import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import fetch from 'node-fetch'
import Groq from 'groq-sdk'

// 환경 변수 로드
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3001
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY

// Groq API 설정 (무료로 GPT급 AI 사용 가능)
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

// Hugging Face API 설정 (감정 분석용)
const HF_API_URL = 'https://api-inference.huggingface.co/models'
const EMOTION_MODEL = 'distilbert-base-uncased-finetuned-sst-2-english'

// 미들웨어
app.use(cors())
app.use(express.json())

// 헬스 체크
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' })
})

// 키워드 기반 감정 분석 (Fallback 함수)
function analyzeEmotionByKeywords(content) {
  const emotions = {
    happiness: 0,
    sadness: 0,
    anger: 0,
    anxiety: 0,
    calm: 0
  }

  const lowerContent = content.toLowerCase()
  
  // 키워드 기반 감정 분석
  if (lowerContent.match(/기쁨|행복|좋|즐거|신나|신기|멋|멋있|훌륭|최고/g)) emotions.happiness += 40
  if (lowerContent.match(/슬픔|슬프|우울|외로|아쉬|힘들|지침|피곤|우|울었/g)) emotions.sadness += 40
  if (lowerContent.match(/화|화나|짜증|분노|열받|황당|답답|화풀이|열|빡|황당/g)) emotions.anger += 40
  if (lowerContent.match(/불안|걱정|두렵|무서|긴장|스트레스|불편|불안|불편|근심/g)) emotions.anxiety += 40
  if (lowerContent.match(/평온|차분|평화|안정|편안|좋다|여유|고요|평온|침착/g)) emotions.calm += 40

  // 감정 정규화 (합계 100)
  const total = Object.values(emotions).reduce((a, b) => a + b, 0)
  if (total === 0) {
    emotions.calm = 100
  } else {
    Object.keys(emotions).forEach(key => {
      emotions[key] = Math.round((emotions[key] / total) * 100)
    })
  }

  return emotions
}

// 감정 분석 API (Hugging Face 사용, Fallback: 키워드 기반)
app.post('/api/analyze-emotion', async (req, res) => {
  try {
    const { content } = req.body

    if (!content) {
      return res.status(400).json({ error: '일기 내용이 필요합니다.' })
    }

    // 감정 분석 결과 객체
    let emotions = {}
    let usesFallback = false

    // Hugging Face API 토큰이 있으면 시도
    if (HF_API_KEY && HF_API_KEY !== 'your_hugging_face_token_here') {
      try {
        // 문장을 분할하여 분석 (긴 텍스트 처리)
        const sentences = content.match(/[^.!?]+[.!?]+/g) || [content]
        const mainSentences = sentences.slice(0, 5).map(s => s.trim()).join(' ')

        const response = await fetch(`${HF_API_URL}/${EMOTION_MODEL}`, {
          headers: { Authorization: `Bearer ${HF_API_KEY}` },
          method: 'POST',
          body: JSON.stringify({ inputs: mainSentences }),
        })

        if (response.ok) {
          const result = await response.json()
          const scores = result[0] || []
          
          emotions = {
            happiness: 0,
            sadness: 0,
            anger: 0,
            anxiety: 0,
            calm: 0
          }

          // Hugging Face 점수를 우리 감정 체계에 매핑
          scores.forEach(score => {
            if (score.label === 'POSITIVE') {
              emotions.happiness = Math.round(score.score * 100)
              emotions.calm = Math.round(score.score * 80)
            } else if (score.label === 'NEGATIVE') {
              emotions.sadness = Math.round(score.score * 100)
              emotions.anxiety = Math.round(score.score * 60)
              emotions.anger = Math.round(score.score * 40)
            }
          })

          // 합계를 100으로 정규화
          const total = Object.values(emotions).reduce((a, b) => a + b, 0) || 100
          Object.keys(emotions).forEach(key => {
            emotions[key] = Math.round((emotions[key] / total) * 100)
          })
        } else {
          console.log('Hugging Face API 호출 실패, Fallback 모드 사용')
          emotions = analyzeEmotionByKeywords(content)
          usesFallback = true
        }
      } catch (error) {
        console.log('Hugging Face API 오류:', error.message)
        emotions = analyzeEmotionByKeywords(content)
        usesFallback = true
      }
    } else {
      // API 토큰이 없으면 키워드 기반 분석 사용
      console.log('Hugging Face API 토큰 없음, 키워드 기반 분석 사용')
      emotions = analyzeEmotionByKeywords(content)
      usesFallback = true
    }

    // 주요 감정 결정
    const emotionNames = {
      happiness: '행복',
      sadness: '슬픔',
      anger: '분노',
      anxiety: '불안',
      calm: '평온'
    }

    const primaryEmotionKey = Object.entries(emotions).sort(([,a], [,b]) => b - a)[0][0]
    const primaryEmotion = emotionNames[primaryEmotionKey]

    const adviceMap = {
      '행복': '오늘 하루가 정말 좋으셨군요! 이런 행복한 감정을 소중히 간직하시고, 주변 사람들과도 나누어보세요. 행복한 기억들이 쌓여가면서 더욱 밝은 내일이 될 거예요. 💝',
      '슬픔': '슬픈 마음이 드시는군요. 지금의 감정을 있는 그대로 받아들이는 것도 중요해요. 시간이 지나면서 이 감정도 조금씩 가벼워질 것입니다. 혼자가 아니라는 것을 기억해주세요. 💙',
      '분노': '화가 나신 상황이 있으셨나봐요. 그런 감정을 느끼시는 것은 자연스러운 일입니다. 한 번 깊게 숨을 쉬고, 그 감정의 근원이 무엇인지 생각해보세요. 이해하고 받아들이는 것부터 시작입니다. 💪',
      '불안': '불안한 마음이 있으신 것 같네요. 걱정되시는 상황들이 있겠지만, 지금 이 순간에 할 수 있는 작은 것들부터 시작해보세요. 한 걸음씩 나아가다 보면 길이 보일 거예요. 🌟',
      '평온': '마음이 차분하고 편안하신 것 같습니다. 이런 평온한 상태를 유지하려고 노력해보세요. 자신을 돌보고, 좋아하는 것들을 하면서 이 기분을 지켜내시길 바랍니다. 😌'
    }

    res.json({
      primary_emotion: primaryEmotion,
      emotion_intensity: Math.max(...Object.values(emotions)),
      emotions: emotions,
      summary: `당신의 감정 상태는 주로 ${primaryEmotion}입니다.${usesFallback ? ' (로컬 분석)' : ' (AI 분석)'}`,
      advice: adviceMap[primaryEmotion] || '당신의 감정을 소중히 여기고, 스스로를 잘 돌봐주세요.'
    })
  } catch (error) {
    console.error('Error analyzing emotion:', error)
    res.status(500).json({ 
      error: '감정 분석 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// 맞춤형 조언 생성 API
app.post('/api/generate-advice', async (req, res) => {
  try {
    const { emotion, content } = req.body

    if (!emotion || !content) {
      return res.status(400).json({ error: '감정과 내용이 필요합니다.' })
    }

    // 개발 모드: 미리 정의된 조언 반환
    const isDemoMode = process.env.DEMO_MODE === 'true' || true

    if (isDemoMode) {
      const adviceMap = {
        '행복': '당신의 행복한 마음이 정말 멋집니다! 이 긍정적인 에너지를 유지하면서 주변 사람들과도 나누어보세요. 좋은 일들이 계속 일어날 거라고 믿으세요. 😊',
        '슬픔': '지금의 슬픈 감정을 있는 그대로 받아들여주세요. 시간은 최고의 치료자입니다. 혼자가 아니라는 걸 잊지 마시고, 필요하면 주변 사람들에게 도움을 청하는 것도 좋아요. 💙',
        '분노': '화가 나신 상황을 차분히 정리해보세요. 감정을 느끼는 것도 중요하지만, 그 감정을 어떻게 표현할지 생각해보는 것도 중요합니다. 깊게 숨을 쉬고 상황을 다시 바라봐보세요. 💪',
        '불안': '불안한 마음이 든다면, 지금 이 순간에 할 수 있는 작은 행동들을 찾아보세요. 계획을 세우고 한 걸음씩 나아가다 보면 불안감이 줄어들 것입니다. 당신은 충분히 할 수 있어요! 🌟',
        '평온': '마음의 평온함을 유지하려고 노력해주세요. 이 순간의 감정을 소중히 간직하고, 자신을 돌보는 시간을 가져보세요. 평온한 마음은 좋은 결정을 내리는 데 도움이 됩니다. 😌'
      }

      return res.json({ 
        advice: adviceMap[emotion] || '당신의 감정을 소중히 여기고, 현재의 순간을 받아들여주세요. 모든 감정은 의미가 있습니다. 💝'
      })
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "당신은 따뜻하고 공감적인 심리 상담사입니다. 사용자의 감정과 일기 내용을 바탕으로 위로와 조언을 제공하세요."
        },
        {
          role: "user",
          content: `현재 감정: ${emotion}\n일기 내용: ${content}\n\n위로와 조언을 2-3문장으로 해주세요.`
        }
      ],
      temperature: 0.8,
    })

    res.json({ advice: response.choices[0].message.content })
  } catch (error) {
    console.error('Error generating advice:', error)
    res.status(500).json({ 
      error: '조언 생성 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// AI 감정 코칭 챗봇 API
app.post('/api/emotion-coach', async (req, res) => {
  try {
    const { message, emotion, userHistory, conversationContext } = req.body

    if (!message) {
      return res.status(400).json({ error: '메시지가 필요합니다.' })
    }

    // 감정별 맞춤형 응답 생성
    const coachResponse = await generateCoachResponse({
      userMessage: message,
      currentEmotion: emotion,
      history: userHistory,
      context: conversationContext
    })

    res.json({
      response: coachResponse.message,
      followUpQuestions: coachResponse.questions,
      suggestions: coachResponse.suggestions,
      emotionalInsight: coachResponse.insight
    })
  } catch (error) {
    console.error('Error in emotion coach:', error)
    res.status(500).json({ 
      error: '코칭 응답 생성 중 오류가 발생했습니다.',
      details: error.message 
    })
  }
})

// AI 코칭 응답 생성 함수
async function generateCoachResponse({ userMessage, currentEmotion, history, context }) {
  console.log('OpenAI 심리 상담 AI 시작...')
  
  const emotionPrompts = {
    '행복': {
      systemPrompt: "당신은 따뜻하고 공감적인 심리 상담사입니다. 사용자의 행복한 감정을 더욱 강화하고 지속시킬 수 있도록 도와주세요. 긍정적인 에너지를 확장하는 방법을 제안하고, 행복한 순간을 더 깊이 탐구해보세요.",
      questions: [
        "이 행복한 기분을 만든 특별한 순간이 무엇인가요?",
        "이런 기분을 더 자주 느끼려면 어떻게 할 수 있을까요?",
        "오늘의 긍정적인 에너지를 어떻게 내일로 이어갈까요?"
      ]
    },
    '슬픔': {
      systemPrompt: "당신은 공감적이고 따뜻한 심리 상담사입니다. 사용자의 슬픔을 있는 그대로 받아들이며, 판단하지 않고 들어주세요. 희망과 회복의 길을 부드럽게 제시하되, 현재 감정을 충분히 인정하고 지지해주세요.",
      questions: [
        "지금 가장 힘든 부분이 무엇인지 더 이야기해주시겠어요?",
        "이런 상황에서 당신에게 가장 도움이 되는 것은 무엇인가요?",
        "과거에 비슷한 어려움을 어떻게 극복하셨나요?"
      ]
    },
    '분노': {
      systemPrompt: "당신은 감정 조절 전문가입니다. 사용자의 분노를 이해하고 받아들이며, 이 감정이 전달하는 메시지를 함께 탐구해보세요. 건설적인 표현 방법과 근본 원인 해결을 위한 실용적 조언을 제공하세요.",
      questions: [
        "이 상황에서 가장 화가 나는 부분이 정확히 무엇인가요?",
        "이 감정 뒤에 숨어있는 진짜 필요는 무엇일까요?",
        "상황을 개선하기 위해 할 수 있는 첫 번째 단계는 무엇일까요?"
      ]
    },
    '불안': {
      systemPrompt: "당신은 불안 완화 전문가입니다. 사용자의 불안을 이해하고, 현재 순간에 집중할 수 있도록 도우세요. 실용적이고 즉시 적용 가능한 대처 전략을 제공하며, 작은 단계로 나누어 접근하게 해주세요.",
      questions: [
        "지금 가장 걱정되는 것이 구체적으로 무엇인가요?",
        "이 걱정 중에서 당신이 통제할 수 있는 부분은 무엇인가요?",
        "마음이 조금 더 편해질 수 있는 작은 행동이 있을까요?"
      ]
    },
    '평온': {
      systemPrompt: "당신은 마음챙김과 자기 돌봄 전문가입니다. 사용자의 평온한 상태를 인정하고 격려하며, 이런 긍정적인 상태를 더 깊이 탐구하고 지속할 수 있는 방법을 함께 찾아보세요.",
      questions: [
        "이 평온한 상태를 만든 것이 무엇인가요?",
        "지금 이 순간에서 가장 감사한 것은 무엇인가요?",
        "이 기분을 지속하기 위해 어떤 습관을 만들고 싶나요?"
      ]
    }
  }

  const currentPrompt = emotionPrompts[currentEmotion] || emotionPrompts['평온']
  
  let aiResponse = ''
  
  // Groq API 호출 시도 (무료 + 빠름!)
  if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
    try {
      console.log('Groq API 호출 시도...')
      
      // 대화 컨텍스트 구성
      const conversationHistory = context ? `이전 대화 맥락: ${context}\n\n` : ''
      const emotionContext = currentEmotion ? `현재 사용자의 감정 상태: ${currentEmotion}\n` : ''
      
      const systemMessage = `${currentPrompt.systemPrompt}\n\n다음 지침을 따라주세요:
      - 2-3문장으로 공감적이고 따뜻하게 응답하세요
      - 사용자의 감정을 인정하고 받아들여주세요
      - 구체적이고 실용적인 질문이나 제안을 포함하세요
      - 한국어로 자연스럽게 대화하세요
      - 전문적이지만 친근한 어조를 유지하세요`

      const userPrompt = `${conversationHistory}${emotionContext}사용자 메시지: "${userMessage}"\n\n위 메시지에 공감적으로 응답해주세요.`

      const completion = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",  // 무료로 사용 가능한 강력한 모델
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt }
        ],
        max_tokens: 200,
        temperature: 0.8,
      })

      aiResponse = completion.choices[0].message.content.trim()
      console.log('Groq 응답 생성 성공:', aiResponse)

    } catch (error) {
      console.log('Groq API 오류:', error.message)
      // Groq 실패 시 지능형 템플릿 사용
    }
  } else {
    console.log('Groq API 키가 설정되지 않음 - 지능형 템플릿 모드 사용')
  }

  // Fallback: 템플릿 기반 응답 (OpenAI 실패 시)
  if (!aiResponse || aiResponse.length < 10) {
    console.log('AI 응답이 부족하여 개선된 템플릿 응답 사용')
    
    // 사용자 메시지 키워드 분석
    const messageKeywords = userMessage.toLowerCase()
    const hasPositiveWords = /(좋다|행복|기쁘다|즐겁다|만족|감사|웃음|사랑)/g.test(messageKeywords)
    const hasNegativeWords = /(힘들다|슬프다|우울|걱정|불안|화|스트레스|피곤)/g.test(messageKeywords)
    
    const templates = {
      '행복': [
        `"${userMessage.slice(0, 20)}..."라는 말씀을 들으니 정말 기쁘네요! 😊 이런 행복한 순간들이 더욱 소중하게 느껴집니다. ${hasPositiveWords ? '긍정적인 에너지가 전해져요!' : ''} 이 기분을 더 오래 간직할 수 있는 방법을 함께 생각해볼까요?`,
        `행복한 기분이 느껴져요! ${hasPositiveWords ? '긍정적인 표현들에서 진정한 기쁨이 느껴져요.' : ''} 이런 순간들을 더 자주 만들어가기 위해 무엇이 가장 도움이 될까요?`,
        `정말 밝은 에너지가 전해져요! 오늘의 이런 특별한 기분을 주변 사람들과도 나누시면 더욱 커질 거예요. 어떤 것이 이런 행복을 가져다 주었나요?`
      ],
      '슬픔': [
        `"${userMessage.slice(0, 20)}..."라는 말씀에서 마음이 무거우신 게 느껴져요. ${hasNegativeWords ? '힘든 감정들을 표현해주셔서 고맙습니다.' : ''} 이런 감정을 느끼는 것도 자연스럽고 괜찮은 일이에요. 💙 지금 이 순간 가장 필요한 것이 무엇일까요?`,
        `힘든 시간을 보내고 계시는군요. ${hasNegativeWords ? '어려운 감정을 솔직하게 나누어주셔서 감사해요.' : ''} 이런 감정들도 우리 삶의 일부이고, 시간이 지나면서 조금씩 나아질 거예요. 혼자가 아니라는 걸 기억해주세요.`,
        `지금 마음이 아프신 것 같아요. 슬픈 마음이 드실 때는 그 감정을 있는 그대로 받아들이는 것이 중요해요. 무리하지 마시고, 자신에게 조금 더 따뜻하게 대해주세요.`
      ],
      '분노': [
        `"${userMessage.slice(0, 20)}..."에서 화가 나신 상황이 느껴져요. ${hasNegativeWords ? '분노를 표현해주시는 것 자체가 용기있는 일이에요.' : ''} 그런 감정을 느끼는 것은 자연스러운 일이에요. 💪 이 감정이 무엇을 말하려고 하는지 함께 생각해볼까요?`,
        `분노는 때로 우리에게 중요한 것이 위협받고 있다는 신호일 수 있어요. 깊게 숨을 쉬시고, 이 상황을 다른 관점에서 바라볼 수도 있을 것 같아요. 지금 가장 중요하게 생각하시는 것이 무엇인가요?`,
        `화가 나는 감정 뒤에는 보통 다른 필요나 가치가 숨어있어요. 이 감정이 전달하려는 메시지에 귀 기울여보시면 어떨까요?`
      ],
      '불안': [
        `"${userMessage.slice(0, 20)}..."라는 말씀에서 불안한 마음이 느껴져요. ${hasNegativeWords ? '걱정을 표현해주셔서 고맙습니다.' : ''} 지금 이 순간에 집중해보세요. 🌟 불안할 때는 당신이 통제할 수 있는 것들에 관심을 돌려보는 것이 도움이 돼요.`,
        `걱정이 많으신 것 같아요. 하나씩 차근차근 정리해보면 생각보다 해결할 수 있는 것들이 많을 거예요. 지금 당장 할 수 있는 작은 것부터 시작해보는 건 어떨까요?`,
        `불안감이 클 때는 현재 순간으로 돌아오는 것이 중요해요. 깊게 숨을 쉬시고, 주변의 작은 것들에 관심을 기울여보세요. 당신은 충분히 잘하고 있어요.`
      ],
      '평온': [
        `"${userMessage.slice(0, 20)}..."라는 말씀에서 차분한 기운이 느껴져요. 😌 이런 평온한 상태를 소중히 여기시고, 무엇이 이런 기분을 만들어주었는지 기억해두세요.`,
        `지금의 안정된 기분이 정말 아름답게 느껴져요. ${hasPositiveWords ? '긍정적인 에너지가 평온함과 잘 어우러져 있네요.' : ''} 이런 순간들이 쌓여서 더 큰 행복이 되는 것 같아요. 현재를 충분히 만끽하세요.`,
        `평화로운 마음 상태시군요. 이 평온함 속에서 감사할 수 있는 것들을 떠올려보시면 어떨까요? 작은 것들도 충분히 의미 있어요.`
      ]
    }
    
    const emotionTemplates = templates[currentEmotion] || templates['평온']
    aiResponse = emotionTemplates[Math.floor(Math.random() * emotionTemplates.length)]
    
    console.log('템플릿 응답 선택:', aiResponse)
  }

  // 응답 객체 구성
  return {
    message: aiResponse,
    questions: currentPrompt.questions,
    suggestions: getEmotionSuggestions(currentEmotion),
    insight: generateEmotionalInsight(currentEmotion, userMessage)
  }
}

// 감정별 제안 생성
function getEmotionSuggestions(emotion) {
  const suggestionMap = {
    '행복': [
      "좋은 기분을 일기로 더 자세히 기록해보세요",
      "친구나 가족과 이 기쁨을 나눠보세요",
      "오늘의 긍정적인 순간들을 사진으로 남겨보세요"
    ],
    '슬픔': [
      "따뜻한 차 한 잔과 함께 휴식을 취해보세요",
      "좋아하는 음악을 들으며 감정을 정리해보세요",
      "신뢰하는 사람과 이야기를 나눠보세요"
    ],
    '분노': [
      "10까지 천천히 세어보세요",
      "산책이나 가벼운 운동을 해보세요",
      "상황을 글로 정리해서 객관적으로 바라보세요"
    ],
    '불안': [
      "4-7-8 호흡법을 시도해보세요 (4초 흡입, 7초 멈춤, 8초 내쉼)",
      "지금 할 수 있는 작은 일 하나부터 시작해보세요",
      "걱정 목록을 적고 통제 가능한 것들을 구분해보세요"
    ],
    '평온': [
      "현재 순간의 감각들을 의식적으로 느껴보세요",
      "감사한 것들을 3가지 떠올려보세요",
      "이 평온함을 유지하는 나만의 방법을 찾아보세요"
    ]
  }
  
  return suggestionMap[emotion] || suggestionMap['평온']
}

// 감정 인사이트 생성
function generateEmotionalInsight(emotion, message) {
  const insights = {
    '행복': "행복한 순간들을 의식적으로 기록하면 더 오래 기억할 수 있어요. 긍정적인 감정도 연습을 통해 강화될 수 있습니다.",
    '슬픔': "슬픔은 우리에게 무언가 중요한 것을 잃었거나 변화가 필요하다는 신호일 수 있어요. 이 감정을 통해 자신을 더 깊이 이해할 수 있습니다.",
    '분노': "분노는 종종 우리의 가치나 경계선이 침범당했을 때 나타나요. 이 감정이 알려주는 메시지에 귀 기울여보세요.",
    '불안': "불안은 우리가 미래를 준비하려는 자연스러운 반응이에요. 하지만 현재 순간에 집중하는 연습이 도움이 될 수 있습니다.",
    '평온': "평온한 상태는 마음의 균형이 잘 잡혀있다는 신호예요. 이런 순간들을 더 자주 만들어갈 수 있는 방법을 탐구해보세요."
  }
  
  return insights[emotion] || "모든 감정은 우리에게 소중한 정보를 전달해줍니다. 자신의 감정을 이해하고 받아들이는 것이 성장의 첫걸음이에요."
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`)
  console.log(`✅ Groq API Key: ${process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here' ? '설정됨' : '❌ 미설정 (템플릿 모드)'}`)
  console.log(`✅ Hugging Face API Key: ${HF_API_KEY ? '설정됨' : '❌ 미설정'}`)
})
