// 백엔드 API 엔드포인트
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

// 감정 분석 함수
export const analyzeEmotion = async (diaryContent) => {
  try {
    const response = await fetch(`${API_URL}/api/analyze-emotion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: diaryContent })
    })

    if (!response.ok) {
      throw new Error('감정 분석에 실패했습니다.')
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error('Error analyzing emotion:', error)
    throw error
  }
}

// 맞춤형 조언 생성
export const generateAdvice = async (emotion, content) => {
  try {
    const response = await fetch(`${API_URL}/api/generate-advice`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ emotion, content })
    })

    if (!response.ok) {
      throw new Error('조언 생성에 실패했습니다.')
    }

    const result = await response.json()
    return result.advice
  } catch (error) {
    console.error('Error generating advice:', error)
    throw error
  }
}
