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
    const { emotion, content } = body

    if (!emotion || !content) {
      return new Response(
        JSON.stringify({ error: '감정과 내용이 필요합니다.' }),
        { status: 400, headers }
      )
    }

    // 미리 정의된 조언 반환
    const adviceMap = {
      '행복': '당신의 행복한 마음이 정말 멋집니다! 이 긍정적인 에너지를 유지하면서 주변 사람들과도 나누어보세요. 좋은 일들이 계속 일어날 거라고 믿으세요. 😊',
      '슬픔': '지금의 슬픈 감정을 있는 그대로 받아들여주세요. 시간은 최고의 치료자입니다. 혼자가 아니라는 걸 잊지 마시고, 필요하면 주변 사람들에게 도움을 청하는 것도 좋아요. 💙',
      '분노': '화가 나신 상황을 차분히 정리해보세요. 감정을 느끼는 것도 중요하지만, 그 감정을 어떻게 표현할지 생각해보는 것도 중요합니다. 깊게 숨을 쉬고 상황을 다시 바라봐보세요. 💪',
      '불안': '불안한 마음이 든다면, 지금 이 순간에 할 수 있는 작은 행동들을 찾아보세요. 계획을 세우고 한 걸음씩 나아가다 보면 불안감이 줄어들 것입니다. 당신은 충분히 할 수 있어요! 🌟',
      '평온': '마음의 평온함을 유지하려고 노력해주세요. 이 순간의 감정을 소중히 간직하고, 자신을 돌보는 시간을 가져보세요. 평온한 마음은 좋은 결정을 내리는 데 도움이 됩니다. 😌'
    }

    return new Response(
      JSON.stringify({ 
        advice: adviceMap[emotion] || '당신의 감정을 소중히 여기고, 현재의 순간을 받아들여주세요. 모든 감정은 의미가 있습니다. 💝'
      }),
      { status: 200, headers }
    )
  } catch (error) {
    console.error('Error generating advice:', error)
    return new Response(
      JSON.stringify({ 
        error: '조언 생성 중 오류가 발생했습니다.',
        details: error.message 
      }),
      { status: 500, headers }
    )
  }
}
