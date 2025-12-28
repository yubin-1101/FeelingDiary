import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getDiaryEntries } from '../services/supabase'
import { format } from 'date-fns'
import { ko } from 'date-fns/locale'
import { Calendar, Smile, Frown, Meh, Heart, Wind, BookOpen, Sparkles, Cloud, PenLine } from 'lucide-react'

const emotionIcons = {
  '행복': { icon: Smile, color: 'text-sunshine-500', bg: 'bg-sunshine-50', border: 'border-sunshine-200' },
  '슬픔': { icon: Frown, color: 'text-sky-500', bg: 'bg-sky-50', border: 'border-sky-200' },
  '분노': { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-200' },
  '불안': { icon: Meh, color: 'text-peach-500', bg: 'bg-peach-50', border: 'border-peach-200' },
  '평온': { icon: Wind, color: 'text-mint-500', bg: 'bg-mint-50', border: 'border-mint-200' },
}

export default function DiaryListPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEntries()
  }, [])

  const loadEntries = async () => {
    try {
      const data = await getDiaryEntries()
      setEntries(data)
    } catch (error) {
      console.error('Error loading entries:', error)
    } finally {
      setLoading(false)
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

  if (entries.length === 0) {
    return (
      <div className="text-center py-20 relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <Cloud className="absolute top-10 right-1/4 w-12 h-12 text-sky-100 animate-float" />
          <Heart className="absolute bottom-20 left-1/4 w-8 h-8 text-rose-100 animate-float" style={{ animationDelay: '1s' }} />
          <Sparkles className="absolute top-20 left-1/3 w-6 h-6 text-sunshine-200 animate-pulse-soft" />
        </div>
        
        <div className="relative bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-soft p-10 max-w-md mx-auto border border-white/60 animate-fade-in">
          <div className="w-20 h-20 bg-gradient-to-br from-lavender-100 to-rose-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Calendar className="w-10 h-10 text-lavender-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            아직 작성된 일기가 없어요
          </h2>
          <p className="text-gray-500 mb-8">
            첫 일기를 작성하고 AI의 따뜻한 분석을 받아보세요! ✨
          </p>
          <Link 
            to="/write" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-lavender-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <PenLine className="w-5 h-5" />
            첫 일기 쓰기
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto relative">
      {/* 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 -right-20 w-40 h-40 bg-lavender-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-36 h-36 bg-rose-100/40 rounded-full blur-3xl" />
      </div>

      {/* 헤더 */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            나의 일기
          </h1>
        </div>
        <p className="text-gray-500 ml-13">
          총 <span className="font-semibold text-lavender-600">{entries.length}</span>개의 소중한 기록이 있어요 💝
        </p>
      </div>

      {/* 일기 목록 */}
      <div className="space-y-4">
        {entries.map((entry, index) => {
          const emotion = emotionIcons[entry.emotion] || emotionIcons['평온']
          const Icon = emotion.icon

          return (
            <Link
              key={entry.id}
              to={`/diary/${entry.id}`}
              className="group block bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft hover:shadow-lg hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-4">
                {/* 감정 아이콘 */}
                <div className={`${emotion.bg} ${emotion.border} border-2 p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${emotion.color}`} />
                </div>

                {/* 내용 */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-gray-700 mb-1 group-hover:text-lavender-600 transition-colors">
                    {entry.title || '제목 없음'}
                  </h3>

                  <p className="text-gray-500 text-sm line-clamp-2 mb-3 leading-relaxed">
                    {entry.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-sm">
                    <span className="flex items-center gap-1.5 text-gray-400">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(entry.created_at), 'yyyy년 M월 d일 (E)', { locale: ko })}
                    </span>
                    <span className={`${emotion.bg} ${emotion.color} ${emotion.border} border px-3 py-1 rounded-full text-xs font-medium`}>
                      {entry.emotion}
                    </span>
                  </div>
                </div>

                {/* 화살표 */}
                <div className="text-gray-300 group-hover:text-lavender-400 group-hover:translate-x-1 transition-all duration-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
