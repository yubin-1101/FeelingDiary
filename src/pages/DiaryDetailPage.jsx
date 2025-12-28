import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDiaryEntry, deleteDiaryEntry } from '../services/supabase'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, Trash2, ArrowLeft, Sparkles, Heart, Cloud, BookOpen, MessageCircle, Bot } from 'lucide-react'
import EmotionChatbot from '../components/EmotionChatbot'

export default function DiaryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showChatbot, setShowChatbot] = useState(false)

  useEffect(() => {
    loadEntry()
  }, [id])

  const loadEntry = async () => {
    try {
      const data = await getDiaryEntry(id)
      setEntry(data)
    } catch (error) {
      console.error('Error loading entry:', error)
      alert('일기를 불러오는데 실패했습니다.')
      navigate('/list')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('정말 이 일기를 삭제하시겠습니까?')) return

    try {
      await deleteDiaryEntry(id)
      alert('일기가 삭제되었습니다.')
      navigate('/list')
    } catch (error) {
      console.error('Error deleting entry:', error)
      alert('일기 삭제에 실패했습니다.')
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 gap-4">
        <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-2xl flex items-center justify-center shadow-lg animate-pulse-soft">
          <BookOpen className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-500">일기를 불러오는 중...</p>
      </div>
    )
  }

  if (!entry) return null

  const emotionStyles = {
    '행복': { gradient: 'from-sunshine-400 to-peach-400', bg: 'bg-sunshine-50', text: 'text-sunshine-600' },
    '슬픔': { gradient: 'from-sky-400 to-sky-500', bg: 'bg-sky-50', text: 'text-sky-600' },
    '분노': { gradient: 'from-rose-400 to-rose-500', bg: 'bg-rose-50', text: 'text-rose-600' },
    '불안': { gradient: 'from-peach-400 to-peach-500', bg: 'bg-peach-50', text: 'text-peach-600' },
    '평온': { gradient: 'from-mint-400 to-mint-500', bg: 'bg-mint-50', text: 'text-mint-600' },
  }

  const currentEmotion = emotionStyles[entry.emotion] || emotionStyles['평온']

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-lavender-100/40 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-rose-100/40 rounded-full blur-3xl" />
        <Cloud className="absolute top-20 right-10 w-12 h-12 text-sky-100 animate-float" />
        <Heart className="absolute bottom-40 left-5 w-8 h-8 text-rose-100 animate-float" style={{ animationDelay: '1s' }} />
      </div>

      {/* 뒤로가기 버튼 */}
      <button
        onClick={() => navigate('/list')}
        className="flex items-center gap-2 text-gray-500 hover:text-lavender-600 mb-6 group transition-colors animate-fade-in"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span>목록으로 돌아가기</span>
      </button>

      <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-soft p-8 md:p-10 border border-white/60 animate-slide-up">
        {/* 헤더 */}
        <div className="mb-8 pb-6 border-b border-gray-100">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-700 mb-3">
                {entry.title || '제목 없음'}
              </h1>
              <div className="flex items-center gap-2 text-gray-400">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">
                  {format(new Date(entry.created_at), 'yyyy년 M월 d일 (E) HH:mm', { locale: ko })}
                </span>
              </div>
            </div>
            <button
              onClick={handleDelete}
              className="flex items-center gap-1.5 text-gray-400 hover:text-rose-500 px-3 py-2 rounded-xl hover:bg-rose-50 transition-all duration-300"
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-sm">삭제</span>
            </button>
          </div>
        </div>

        {/* 일기 내용 */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-lavender-500" />
            <h2 className="text-lg font-semibold text-gray-600">일기</h2>
          </div>
          <div className="bg-gradient-to-br from-cream-50/50 to-white/50 rounded-2xl p-6 border border-cream-100">
            <p className="text-gray-600 whitespace-pre-wrap leading-relaxed text-lg">
              {entry.content}
            </p>
          </div>
        </div>

        {/* 감정 분석 */}
        <div 
          className="bg-gradient-to-br from-lavender-50/80 via-white/50 to-rose-50/80 rounded-2xl p-6 md:p-8 mb-6 border border-lavender-100/50 animate-fade-in"
          style={{ animationDelay: '0.2s' }}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-lg font-semibold text-gray-700">AI 감정 분석</h2>
          </div>

          {/* 주요 감정 */}
          <div className="mb-8">
            <span className={`inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${currentEmotion.gradient} shadow-lg`}>
              <Heart className="w-5 h-5" />
              주요 감정: {entry.emotion}
            </span>
          </div>

          {/* 감정 점수 */}
          {entry.emotion_score && (
            <div className="space-y-4">
              {Object.entries(entry.emotion_score).map(([emotion, score]) => {
                const emotionLabels = {
                  happiness: { label: '행복', color: 'from-sunshine-400 to-peach-400' },
                  sadness: { label: '슬픔', color: 'from-sky-400 to-sky-500' },
                  anger: { label: '분노', color: 'from-rose-400 to-rose-500' },
                  anxiety: { label: '불안', color: 'from-peach-400 to-peach-500' },
                  calm: { label: '평온', color: 'from-mint-400 to-mint-500' }
                }
                
                const current = emotionLabels[emotion] || { label: emotion, color: 'from-gray-400 to-gray-500' }
                
                return (
                  <div key={emotion}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium text-gray-600">
                        {current.label}
                      </span>
                      <span className="text-gray-500 font-semibold">{score}%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`bg-gradient-to-r ${current.color} h-3 rounded-full transition-all duration-700`}
                        style={{ width: `${score}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* AI 조언 */}
        {entry.ai_advice && (
          <div 
            className="bg-gradient-to-br from-sunshine-50/80 to-peach-50/80 rounded-2xl p-6 md:p-8 border border-sunshine-100/50 animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            <div className="flex items-start gap-4">
              <div className="text-3xl">💝</div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-700 mb-3">
                  AI의 따뜻한 조언
                </h2>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {entry.ai_advice}
                </p>
                
                {/* AI 코칭 챗봇 버튼 */}
                <button
                  onClick={() => setShowChatbot(true)}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-lavender-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  <Bot className="w-5 h-5" />
                  감정 코치와 대화하기
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 추가 정보 */}
        <div className="text-center py-6">
          <p className="text-gray-400 text-sm">
            🌸 오늘도 소중한 하루를 기록해주셔서 감사해요
          </p>
        </div>
      </div>

      {/* AI 감정 코칭 챗봇 */}
      <EmotionChatbot 
        currentEmotion={entry.emotion}
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
    </div>
  )
}
