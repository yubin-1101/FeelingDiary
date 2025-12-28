import { useState, useEffect } from 'react'
import { getDiaryEntries } from '../services/supabase'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { TrendingUp, Smile, Calendar, Heart, Sparkles, Cloud, BarChart3, MessageCircle, Bot } from 'lucide-react'
import { Link } from 'react-router-dom'
import EmotionChatbot from '../components/EmotionChatbot'

export default function EmotionStatsPage() {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [showChatbot, setShowChatbot] = useState(false)

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
          <BarChart3 className="w-8 h-8 text-white" />
        </div>
        <p className="text-gray-500">통계를 불러오는 중...</p>
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
            <TrendingUp className="w-10 h-10 text-lavender-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            아직 통계를 확인할 수 없어요
          </h2>
          <p className="text-gray-500 mb-6">
            일기를 작성하면 감정 통계를 확인할 수 있어요! 📊
          </p>
          <Link 
            to="/write" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-lavender-500 to-rose-400 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-lavender-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            <Sparkles className="w-5 h-5" />
            일기 쓰러 가기
          </Link>
        </div>
      </div>
    )
  }

  // 감정별 분포 계산
  const emotionCounts = entries.reduce((acc, entry) => {
    acc[entry.emotion] = (acc[entry.emotion] || 0) + 1
    return acc
  }, {})

  const pieData = Object.entries(emotionCounts).map(([name, value]) => ({
    name,
    value
  }))

  const COLORS = {
    '행복': '#FBBF24',
    '슬픔': '#7DD3FC',
    '분노': '#FDA4AF',
    '불안': '#FDBA74',
    '평온': '#86EFAC'
  }

  // 최근 7개 일기의 감정 추세
  const recentEntries = entries.slice(0, 7).reverse()
  const trendData = recentEntries.map((entry, index) => ({
    date: `${index + 1}`,
    happiness: entry.emotion_score?.happiness || 0,
    sadness: entry.emotion_score?.sadness || 0,
    anger: entry.emotion_score?.anger || 0,
    anxiety: entry.emotion_score?.anxiety || 0,
    calm: entry.emotion_score?.calm || 0,
  }))

  // 평균 감정 점수 계산
  const avgEmotions = entries.reduce((acc, entry) => {
    if (entry.emotion_score) {
      Object.entries(entry.emotion_score).forEach(([key, value]) => {
        acc[key] = (acc[key] || 0) + value
      })
    }
    return acc
  }, {})

  Object.keys(avgEmotions).forEach(key => {
    avgEmotions[key] = Math.round(avgEmotions[key] / entries.length)
  })

  return (
    <div className="max-w-6xl mx-auto relative">
      {/* 배경 장식 */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-10 -right-20 w-48 h-48 bg-lavender-100/40 rounded-full blur-3xl" />
        <div className="absolute bottom-40 -left-20 w-40 h-40 bg-rose-100/40 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-10 w-32 h-32 bg-mint-100/40 rounded-full blur-3xl" />
      </div>

      {/* 헤더 */}
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-xl flex items-center justify-center shadow-lg">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-3xl font-bold" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            감정 통계
          </h1>
        </div>
        <p className="text-gray-500 ml-13">
          당신의 감정 패턴을 시각적으로 확인해보세요 📈
        </p>
      </div>

      {/* 요약 카드 */}
      <div className="grid md:grid-cols-3 gap-5 mb-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft animate-slide-up">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-2xl flex items-center justify-center shadow-lg shadow-lavender-200/50">
              <Calendar className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">총 일기 수</p>
              <p className="text-3xl font-bold" style={{ background: 'linear-gradient(to right, #7B5CE8, #9A7BFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {entries.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-sunshine-400 to-peach-400 rounded-2xl flex items-center justify-center shadow-lg shadow-peach-200/50">
              <Smile className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">가장 많은 감정</p>
              <p className="text-3xl font-bold" style={{ background: 'linear-gradient(to right, #FAAD14, #FF9A7B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {Object.entries(emotionCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-mint-400 to-mint-500 rounded-2xl flex items-center justify-center shadow-lg shadow-mint-200/50">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">평균 행복도</p>
              <p className="text-3xl font-bold" style={{ background: 'linear-gradient(to right, #2DC48E, #1FA876)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                {avgEmotions.happiness || 0}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 차트 */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* 감정 분포 파이 차트 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
            <span className="text-2xl">🎨</span> 감정 분포
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                innerRadius={40}
                fill="#8884d8"
                dataKey="value"
                strokeWidth={3}
                stroke="#fff"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name] || '#E5E7EB'} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px 15px'
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 평균 감정 점수 */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">📊</span> 평균 감정 점수
          </h2>
          <div className="space-y-5">
            {Object.entries(avgEmotions).map(([emotion, score]) => {
              const emotionLabels = {
                happiness: { label: '행복', color: 'from-sunshine-400 to-peach-400' },
                sadness: { label: '슬픔', color: 'from-sky-300 to-sky-400' },
                anger: { label: '분노', color: 'from-rose-300 to-rose-400' },
                anxiety: { label: '불안', color: 'from-peach-300 to-peach-400' },
                calm: { label: '평온', color: 'from-mint-300 to-mint-400' }
              }
              
              const current = emotionLabels[emotion] || { label: emotion, color: 'from-gray-300 to-gray-400' }
              
              return (
                <div key={emotion}>
                  <div className="flex justify-between mb-2">
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
        </div>
      </div>

      {/* 감정 추세 차트 */}
      {trendData.length > 0 && (
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-white/60 shadow-soft mt-6 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <h2 className="text-xl font-bold text-gray-700 mb-6 flex items-center gap-2">
            <span className="text-2xl">📈</span> 최근 감정 추세
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis 
                dataKey="date" 
                label={{ value: '일기 순서', position: 'insideBottom', offset: -5, fill: '#9CA3AF' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                label={{ value: '점수', angle: -90, position: 'insideLeft', fill: '#9CA3AF' }}
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  padding: '10px 15px'
                }}
              />
              <Legend />
              <Bar dataKey="happiness" name="행복" fill="#FBBF24" radius={[4, 4, 0, 0]} />
              <Bar dataKey="sadness" name="슬픔" fill="#7DD3FC" radius={[4, 4, 0, 0]} />
              <Bar dataKey="anger" name="분노" fill="#FDA4AF" radius={[4, 4, 0, 0]} />
              <Bar dataKey="anxiety" name="불안" fill="#FDBA74" radius={[4, 4, 0, 0]} />
              <Bar dataKey="calm" name="평온" fill="#86EFAC" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* AI 코칭 챗봇 접근 */}
      <div className="mt-12 text-center bg-gradient-to-br from-purple-50/80 to-pink-50/80 rounded-3xl p-8 border border-purple-100/50">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-200/50">
          <Bot className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold mb-3" style={{ background: 'linear-gradient(to right, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
          통계를 바탕으로 감정 코칭 받기
        </h3>
        <p className="text-gray-600 mb-6">
          당신의 감정 패턴을 분석한 결과를 AI와 함께 더 자세히 탐구해보세요
        </p>
        <button
          onClick={() => setShowChatbot(true)}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-3 px-6 rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
        >
          <MessageCircle className="w-5 h-5" />
          AI 코치와 상담하기
        </button>
      </div>

      {/* AI 감정 코칭 챗봇 */}
      <EmotionChatbot 
        currentEmotion={null}
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
    </div>
  )
}
