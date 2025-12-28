import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PenLine, List, BarChart3, Sparkles, Heart, Cloud, Star, Moon, MessageCircle, Bot } from 'lucide-react'
import EmotionChatbot from '../components/EmotionChatbot'

export default function HomePage() {
  const [showChatbot, setShowChatbot] = useState(false)
  return (
    <div className="relative space-y-12">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute top-20 left-10 w-32 h-32 bg-lavender-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-40 h-40 bg-peach-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-36 h-36 bg-mint-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-rose-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* 히어로 섹션 */}
      <section className="text-center py-16 relative">
        {/* 떠다니는 아이콘들 */}
        <div className="absolute inset-0 pointer-events-none">
          <Heart className="absolute top-4 left-1/4 w-6 h-6 text-rose-300 animate-float opacity-60" style={{ animationDelay: '0.5s' }} />
          <Star className="absolute top-12 right-1/4 w-5 h-5 text-sunshine-400 animate-pulse-soft" />
          <Cloud className="absolute bottom-20 left-16 w-8 h-8 text-sky-200 animate-float" style={{ animationDelay: '1.5s' }} />
          <Moon className="absolute top-8 right-16 w-6 h-6 text-lavender-300 animate-float" style={{ animationDelay: '2s' }} />
          <Sparkles className="absolute bottom-10 right-20 w-5 h-5 text-peach-400 animate-pulse-soft" style={{ animationDelay: '1s' }} />
        </div>

        <div className="animate-fade-in">
          <div className="inline-block mb-6">
            <span className="px-6 py-2 rounded-full text-sm font-medium border" style={{ background: 'linear-gradient(to right, #EDE5FF, #FFE4EA)', color: '#9A7BFF', borderColor: 'rgba(223, 209, 255, 0.5)' }}>
              ✨ AI 감정 분석 일기장
            </span>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight" style={{ background: 'linear-gradient(to right, #9A7BFF, #FF6B8A, #FF9A7B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            오늘의 감정을
            <br />
            기록해보세요
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            AI가 당신의 마음을 따뜻하게 읽어드려요 💭
            <br />
            <span className="text-lg text-gray-500">일상 속 감정의 패턴을 발견하고 더 나은 내일을 만들어보세요</span>
          </p>
          
          <Link 
            to="/write" 
            className="btn-primary inline-flex items-center space-x-3 text-lg px-8 py-4 animate-slide-up"
          >
            <PenLine className="w-5 h-5" />
            <span>지금 일기 쓰기</span>
            <Heart className="w-4 h-4 animate-pulse-soft" />
          </Link>
        </div>
      </section>

      {/* 기능 카드 */}
      <section className="grid md:grid-cols-3 gap-6 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Link 
          to="/write" 
          className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-soft hover:shadow-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-lavender-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-lavender-200/50">
              <PenLine className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-700">일기 작성</h3>
            <p className="text-gray-500 leading-relaxed">
              오늘의 이야기를 자유롭게 기록하고 AI의 따뜻한 분석을 받아보세요 📝
            </p>
          </div>
        </Link>

        <Link 
          to="/list" 
          className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-soft hover:shadow-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-rose-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-rose-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-rose-200/50">
              <List className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-700">일기 목록</h3>
            <p className="text-gray-500 leading-relaxed">
              지난 일기들을 되돌아보며 감정의 변화를 확인하세요 📚
            </p>
          </div>
        </Link>

        <Link 
          to="/stats" 
          className="group relative bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/50 shadow-soft hover:shadow-lg transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-mint-100 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 opacity-50" />
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-mint-400 to-mint-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg shadow-mint-200/50">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-700">감정 통계</h3>
            <p className="text-gray-500 leading-relaxed">
              시각화된 차트로 감정 패턴을 한눈에 파악하세요 📊
            </p>
          </div>
        </Link>
      </section>

      {/* AI 기능 소개 */}
      <section 
        className="relative bg-gradient-to-br from-lavender-50/80 via-white/50 to-rose-50/80 backdrop-blur-sm rounded-[2rem] p-8 md:p-10 border border-white/60 shadow-soft animate-slide-up overflow-hidden"
        style={{ animationDelay: '0.4s' }}
      >
        {/* 배경 장식 */}
        <div className="absolute top-4 right-4 w-24 h-24 bg-sunshine-200/30 rounded-full blur-2xl" />
        <div className="absolute bottom-4 left-4 w-20 h-20 bg-lavender-200/30 rounded-full blur-2xl" />
        
        <div className="relative flex flex-col md:flex-row items-start gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-sunshine-300 to-peach-400 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-peach-200/50 animate-float">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl md:text-3xl font-bold mb-5" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              AI 기반 감정 분석 ✨
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-4 border border-white/50">
                <span className="text-2xl">🎯</span>
                <div>
                  <p className="font-semibold text-gray-700">자동 감정 분석</p>
                  <p className="text-sm text-gray-500">OpenAI가 일기를 분석해요</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-4 border border-white/50">
                <span className="text-2xl">📊</span>
                <div>
                  <p className="font-semibold text-gray-700">감정 점수화</p>
                  <p className="text-sm text-gray-500">다양한 감정을 수치로 표현</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-4 border border-white/50">
                <span className="text-2xl">💝</span>
                <div>
                  <p className="font-semibold text-gray-700">맞춤형 조언</p>
                  <p className="text-sm text-gray-500">따뜻한 위로와 실용적 조언</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/60 rounded-2xl p-4 border border-white/50">
                <span className="text-2xl">📈</span>
                <div>
                  <p className="font-semibold text-gray-700">감정 추적</p>
                  <p className="text-sm text-gray-500">시간에 따른 변화 확인</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI 감정 코칭 섹션 */}
      <section className="bg-gradient-to-br from-violet-50/80 to-pink-50/80 rounded-3xl p-8 md:p-12 border border-violet-100/50 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl mb-6 shadow-lg shadow-purple-200/50 animate-float">
            <Bot className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold mb-4" style={{ background: 'linear-gradient(to right, #8B5CF6, #EC4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            🤖 AI 감정 코칭 파트너
          </h3>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            단순한 감정 분석을 넘어서, 이제 AI와 직접 대화하며 감정을 더 깊이 탐구해보세요
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="text-center p-6 bg-white/60 rounded-2xl border border-white/50">
            <span className="text-3xl block mb-3">💬</span>
            <h4 className="font-bold text-gray-700 mb-2">대화형 코칭</h4>
            <p className="text-sm text-gray-500">감정의 원인을 함께 파악하고 해결책을 찾아요</p>
          </div>
          <div className="text-center p-6 bg-white/60 rounded-2xl border border-white/50">
            <span className="text-3xl block mb-3">🎯</span>
            <h4 className="font-bold text-gray-700 mb-2">맞춤형 질문</h4>
            <p className="text-sm text-gray-500">당신의 감정 상태에 맞는 질문으로 대화를 이끌어요</p>
          </div>
          <div className="text-center p-6 bg-white/60 rounded-2xl border border-white/50">
            <span className="text-3xl block mb-3">💡</span>
            <h4 className="font-bold text-gray-700 mb-2">실용적 제안</h4>
            <p className="text-sm text-gray-500">지금 바로 시도해볼 수 있는 구체적인 방법을 제시해요</p>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setShowChatbot(true)}
            className="inline-flex items-center gap-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-purple-200/50 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 text-lg"
          >
            <MessageCircle className="w-6 h-6" />
            AI 코치와 대화 시작하기
            <Sparkles className="w-5 h-5 animate-pulse-soft" />
          </button>
          <p className="text-sm text-gray-500 mt-3">언제든지 마음이 힘들 때 찾아오세요 💜</p>
        </div>
      </section>

      {/* AI 감정 코칭 챗봇 */}
      <EmotionChatbot 
        currentEmotion={null}
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
      />
    </div>
  )
}
