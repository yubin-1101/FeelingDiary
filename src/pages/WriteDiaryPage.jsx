import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDiaryEntry } from '../services/supabase'
import { analyzeEmotion } from '../services/openai'
import { Loader, Sparkles, Heart, Cloud, PenLine, Feather, MessageCircle, Bot } from 'lucide-react'
import EmotionChatbot from '../components/EmotionChatbot'

export default function WriteDiaryPage() {
  const navigate = useNavigate()
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [analyzedEmotion, setAnalyzedEmotion] = useState(null)
  const [showChatbot, setShowChatbot] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!content.trim()) {
      alert('일기 내용을 입력해주세요.')
      return
    }

    setLoading(true)
    setAnalyzing(true)

    try {
      // OpenAI로 감정 분석
      const emotionAnalysis = await analyzeEmotion(content)
      
      // Supabase에 저장
      const entry = {
        title: title || '제목 없음',
        content: content,
        emotion: emotionAnalysis.primary_emotion,
        emotion_score: emotionAnalysis.emotions,
        ai_advice: emotionAnalysis.advice,
      }

      await createDiaryEntry(entry)
      
      setAnalyzedEmotion(emotionAnalysis.primary_emotion)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error:', error)
      alert('일기 저장 중 오류가 발생했습니다.')
    } finally {
      setLoading(false)
      setAnalyzing(false)
    }
  }

  return (
    <>
      <div className="max-w-4xl mx-auto relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-lavender-100/50 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-rose-100/50 rounded-full blur-3xl" />
          <Cloud className="absolute top-10 right-10 w-10 h-10 text-sky-200/50 animate-float" />
          <Heart className="absolute bottom-20 left-10 w-6 h-6 text-rose-200/50 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-soft p-8 md:p-10 border border-white/60 animate-fade-in">
        {/* 헤더 */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-2xl mb-4 shadow-lg shadow-lavender-200/50 animate-float">
            <Feather className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            오늘의 일기
          </h1>
          <p className="text-gray-500">
            오늘 하루는 어떠셨나요? 자유롭게 이야기해주세요 💭
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 제목 입력 */}
          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
              제목 (선택사항)
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 bg-white/80 border-2 border-lavender-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lavender-100 focus:border-lavender-300 transition-all duration-300 placeholder:text-gray-400"
              placeholder="✨ 오늘의 제목을 입력해주세요"
              disabled={loading}
            />
          </div>

          {/* 일기 내용 */}
          <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <label className="block text-sm font-medium text-gray-600 mb-2 ml-1">
              일기 내용 *
            </label>
            <div className="relative">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-5 py-4 bg-white/80 border-2 border-lavender-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-lavender-100 focus:border-lavender-300 transition-all duration-300 placeholder:text-gray-400 resize-none"
                rows="12"
                placeholder="오늘 있었던 일, 느낀 감정, 생각들을 자유롭게 작성해주세요... 🌸"
                disabled={loading}
                required
              />
              <div className="absolute bottom-4 right-4 flex items-center gap-2 text-sm text-gray-400">
                <PenLine className="w-4 h-4" />
                <span>{content.length} 자</span>
              </div>
            </div>
          </div>

          {/* AI 분석 중 표시 */}
          {analyzing && (
            <div className="bg-gradient-to-r from-lavender-50 to-rose-50 border-2 border-lavender-100 rounded-2xl p-5 flex items-center gap-4 animate-fade-in">
              <div className="w-12 h-12 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
                <Loader className="w-6 h-6 text-white animate-spin" />
              </div>
              <div>
                <p className="font-semibold text-lavender-700">AI가 감정을 분석하고 있어요... ✨</p>
                <p className="text-sm text-lavender-500">잠시만 기다려주세요</p>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-lavender-200/50 hover:shadow-xl hover:shadow-lavender-300/50 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>저장 중...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  <span>AI 분석 후 저장</span>
                  <Heart className="w-4 h-4 animate-pulse-soft" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => navigate('/')}
              disabled={loading}
              className="px-8 py-4 bg-white/80 border-2 border-gray-200 text-gray-600 font-semibold rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 disabled:opacity-50"
            >
              취소
            </button>
          </div>
        </form>

        {/* 팁 섹션 */}
        <div className="mt-8 p-5 bg-gradient-to-r from-sunshine-50 to-peach-50 rounded-2xl border border-sunshine-100 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="font-medium text-gray-700 mb-1">Tip</p>
              <p className="text-sm text-gray-600">
                솔직하고 구체적으로 작성할수록 더 정확한 감정 분석과 따뜻한 조언을 받을 수 있어요!
              </p>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* 저장 성공 모달 */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-fade-in">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">일기 저장 완료! 🎉</h3>
              <p className="text-gray-600 mb-6">
                {analyzedEmotion && `당신의 감정이 "${analyzedEmotion}"로 분석되었어요.`}
                <br />감정에 대해 더 이야기해보시겠어요?
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    setShowChatbot(true)
                  }}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Bot className="w-5 h-5" />
                  AI 코치와 대화하기
                  <MessageCircle className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    navigate('/list')
                  }}
                  className="w-full bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  일기 목록 보기
                </button>
                
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    setTitle('')
                    setContent('')
                    setAnalyzedEmotion(null)
                  }}
                  className="w-full bg-white border-2 border-gray-200 text-gray-600 font-semibold py-3 px-6 rounded-2xl hover:bg-gray-50 transition-all duration-300"
                >
                  새 일기 쓰기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI 감정 코칭 챗봇 */}
      <EmotionChatbot 
        currentEmotion={analyzedEmotion}
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
    </>
  )
}
