import fetch from 'node-fetch'

const HF_API_KEY = process.env.HUGGING_FACE_API_KEY

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

export default async (req) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  }

  if (req.method === 'OPTIONS') {
    return new Response(JSON.stringify({}), { status: 200, headers })
  }

  try {
    const body = await req.json()
    const { content } = body

    if (!content) {
      return new Response(
        JSON.stringify({ error: '일기 내용이 필요합니다.' }),
        { status: 400, headers }
      )
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

        const response = await fetch(`https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english`, {
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

    return new Response(
      JSON.stringify({
        primary_emotion: primaryEmotion,
        emotion_intensity: Math.max(...Object.values(emotions)),
        emotions: emotions,
        summary: `당신의 감정 상태는 주로 ${primaryEmotion}입니다.${usesFallback ? ' (로컬 분석)' : ' (AI 분석)'}`,
        advice: adviceMap[primaryEmotion] || '당신의 감정을 소중히 여기고, 스스로를 잘 돌봐주세요.'
      }),
      { status: 200, headers }
    )
  } catch (error) {
    console.error('Error analyzing emotion:', error)
    return new Response(
      JSON.stringify({ 
        error: '감정 분석 중 오류가 발생했습니다.',
        details: error.message 
      }),
      { status: 500, headers }
    )
  }
}
