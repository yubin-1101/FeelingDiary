import fetch from 'node-fetch'

// Groq API 직접 호출 함수
async function callGroqAPI(messages) {
  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        max_tokens: 200,
        temperature: 0.8
      })
    })

    if (!response.ok) {
      console.error('Groq API Error:', response.status, await response.text())
      return null
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || null
  } catch (error) {
    console.error('Groq API Call Error:', error.message)
    return null
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
    const { message, emotion, userHistory, conversationContext } = body

    if (!message) {
      return new Response(
        JSON.stringify({ error: '메시지가 필요합니다.' }),
        { status: 400, headers }
      )
    }

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

    const currentPrompt = emotionPrompts[emotion] || emotionPrompts['평온']
    let aiResponse = ''

    // Groq API 호출 시도
    if (process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'your_groq_api_key_here') {
      try {
        const conversationHistory = conversationContext ? `이전 대화 맥락: ${conversationContext}\n\n` : ''
        const emotionContext = emotion ? `현재 사용자의 감정 상태: ${emotion}\n` : ''
        
        const systemMessage = `${currentPrompt.systemPrompt}\n\n다음 지침을 따라주세요:
        - 2-3문장으로 공감적이고 따뜻하게 응답하세요
        - 사용자의 감정을 인정하고 받아들여주세요
        - 구체적이고 실용적인 질문이나 제안을 포함하세요
        - 한국어로 자연스럽게 대화하세요
        - 전문적이지만 친근한 어조를 유지하세요`

        const userPrompt = `${conversationHistory}${emotionContext}사용자 메시지: "${message}"\n\n위 메시지에 공감적으로 응답해주세요.`

        const response = await callGroqAPI([
          { role: "system", content: systemMessage },
          { role: "user", content: userPrompt }
        ])

        if (response) {
          aiResponse = response
        }

      } catch (error) {
        console.log('Groq API 오류:', error.message)
      }
    }

    // Fallback: 템플릿 기반 응답
    if (!aiResponse || aiResponse.length < 10) {
      const templates = {
        '행복': `"${message.slice(0, 20)}..."라는 말씀을 들으니 정말 기쁘네요! 😊 이런 행복한 순간들이 더욱 소중하게 느껴집니다. 이 기분을 더 오래 간직할 수 있는 방법을 함께 생각해볼까요?`,
        '슬픔': `"${message.slice(0, 20)}..."라는 말씀에서 마음이 무거우신 게 느껴져요. 이런 감정을 느끼는 것도 자연스럽고 괜찮은 일이에요. 💙 지금 이 순간 가장 필요한 것이 무엇일까요?`,
        '분노': `"${message.slice(0, 20)}..."에서 화가 나신 상황이 느껴져요. 그런 감정을 느끼는 것은 자연스러운 일이에요. 💪 이 감정이 무엇을 말하려고 하는지 함께 생각해볼까요?`,
        '불안': `"${message.slice(0, 20)}..."라는 말씀에서 불안한 마음이 느껴져요. 지금 이 순간에 집중해보세요. 🌟 불안할 때는 당신이 통제할 수 있는 것들에 관심을 돌려보는 것이 도움이 돼요.`,
        '평온': `"${message.slice(0, 20)}..."라는 말씀에서 차분한 기운이 느껴져요. 😌 이런 평온한 상태를 소중히 여기시고, 무엇이 이런 기분을 만들어주었는지 기억해두세요.`
      }
      
      aiResponse = templates[emotion] || templates['평온']
    }

    return new Response(
      JSON.stringify({
        response: aiResponse,
        followUpQuestions: currentPrompt.questions,
        suggestions: getEmotionSuggestions(emotion),
        emotionalInsight: generateEmotionalInsight(emotion, message)
      }),
      { status: 200, headers }
    )
  } catch (error) {
    console.error('Error in emotion coach:', error)
    return new Response(
      JSON.stringify({ 
        error: '코칭 응답 생성 중 오류가 발생했습니다.',
        details: error.message 
      }),
      { status: 500, headers }
    )
  }
}
