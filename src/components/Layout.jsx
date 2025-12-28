import { Link, useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { BookHeart, PenLine, BarChart3, List, LogOut, Sparkles, Cloud, Star } from 'lucide-react'

export default function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="bubble w-96 h-96 bg-lavender-200 -top-20 -left-20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="bubble w-72 h-72 bg-rose-200 top-1/4 -right-10 animate-float" style={{ animationDelay: '1s' }} />
        <div className="bubble w-64 h-64 bg-mint-200 bottom-20 left-1/4 animate-float" style={{ animationDelay: '2s' }} />
        <div className="bubble w-80 h-80 bg-sunshine-200 -bottom-20 right-1/4 animate-float" style={{ animationDelay: '0.5s' }} />
        <div className="bubble w-48 h-48 bg-peach-200 top-1/3 left-1/3 animate-float" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* 헤더 */}
      <header className="sticky top-4 z-50 mx-4 lg:mx-8">
        <div className="max-w-6xl mx-auto">
          <nav className="bg-white/70 backdrop-blur-xl rounded-full shadow-soft-lg px-6 py-3 border border-white/60">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <BookHeart className="w-9 h-9 text-lavender-500 group-hover:scale-110 transition-transform duration-300" />
                  <Sparkles className="w-4 h-4 text-sunshine-400 absolute -top-1 -right-1 animate-pulse-soft" />
                </div>
                <span className="text-xl font-bold" style={{ background: 'linear-gradient(to right, #9A7BFF, #FF6B8A, #FF9A7B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  감정 일기장
                </span>
              </Link>

              <div className="flex items-center gap-2">
                <Link
                  to="/write"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive('/write')
                      ? 'bg-lavender-100 text-lavender-600'
                      : 'text-gray-600 hover:bg-lavender-50 hover:text-lavender-600'
                  }`}
                >
                  <PenLine className="w-4 h-4" />
                  <span className="hidden sm:inline">일기 쓰기</span>
                </Link>
                
                <Link
                  to="/list"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive('/list')
                      ? 'bg-rose-100 text-rose-600'
                      : 'text-gray-600 hover:bg-rose-50 hover:text-rose-600'
                  }`}
                >
                  <List className="w-4 h-4" />
                  <span className="hidden sm:inline">일기 목록</span>
                </Link>
                
                <Link
                  to="/stats"
                  className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300 ${
                    isActive('/stats')
                      ? 'bg-mint-100 text-mint-600'
                      : 'text-gray-600 hover:bg-mint-50 hover:text-mint-600'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  <span className="hidden sm:inline">감정 통계</span>
                </Link>

                <div className="w-px h-6 bg-gray-200 mx-2" />

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 rounded-full text-gray-500 hover:bg-red-50 hover:text-red-500 transition-all duration-300"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </nav>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-fade-in">
          {children}
        </div>
      </main>

      {/* 푸터 */}
      <footer className="relative z-10 mt-20 pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white/40 backdrop-blur-md rounded-3xl p-6 text-center border border-white/60">
            <div className="flex items-center justify-center gap-2 text-gray-500">
              <Cloud className="w-5 h-5 text-lavender-400" />
              <span>Made with</span>
              <span className="text-rose-400 animate-pulse-soft">❤️</span>
              <span>and</span>
              <Star className="w-5 h-5 text-sunshine-400" />
              <span className="text-gray-400">© 2025 감정 일기장</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
