import { useState } from 'react'
import { supabase } from '../services/supabase'
import { BookHeart, Mail, Lock, Sparkles, Cloud, Heart, Stars } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        // 1. 사용자 생성
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`
          }
        })
        
        if (error) {
          throw new Error(error.message)
        }

        if (data?.user?.id) {
          // 2. 사용자 프로필 수동 생성
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: data.user.id,
                full_name: email.split('@')[0],
              }
            ])
          
          if (profileError) {
            console.warn('Profile creation warning:', profileError)
            // 프로필 생성 실패해도 계속 진행
          }

          setMessage('✅ 회원가입 성공! 로그인해주세요.')
          setEmail('')
          setPassword('')
          setIsSignUp(false)
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        
        if (error) {
          throw new Error(error.message)
        }
        
        if (data?.session) {
          setMessage('✅ 로그인 성공!')
        }
      }
    } catch (error) {
      console.error('Auth Error:', error)
      
      // 상세 오류 메시지
      if (error.message.includes('email_address_invalid')) {
        setMessage('❌ 유효하지 않은 이메일 주소입니다.')
      } else if (error.message.includes('password_too_short')) {
        setMessage('❌ 비밀번호는 최소 6자 이상이어야 합니다.')
      } else if (error.message.includes('User already registered')) {
        setMessage('❌ 이미 가입된 이메일입니다.')
      } else {
        setMessage(`❌ ${error.message || '오류가 발생했습니다.'}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 요소들 */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-lavender-200 rounded-full opacity-60 blur-3xl -top-20 -left-20 animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute w-72 h-72 bg-rose-200 rounded-full opacity-60 blur-3xl top-1/4 -right-10 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute w-64 h-64 bg-mint-200 rounded-full opacity-60 blur-3xl bottom-20 left-1/4 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute w-80 h-80 bg-sunshine-200 rounded-full opacity-60 blur-3xl -bottom-20 right-1/4 animate-float" style={{ animationDelay: '0.5s' }} />
      </div>

      <div className="card max-w-md w-full relative z-10 animate-slide-up">
        {/* 장식 아이콘들 */}
        <div className="absolute -top-6 -right-6">
          <div className="relative">
            <Cloud className="w-12 h-12 text-lavender-300 animate-float" />
            <Sparkles className="w-5 h-5 text-sunshine-400 absolute -bottom-1 -right-1 animate-pulse-soft" />
          </div>
        </div>
        <div className="absolute -bottom-4 -left-4">
          <Heart className="w-10 h-10 text-rose-300 animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="text-center mb-10">
          <div className="relative inline-block">
            <div className="w-24 h-24 bg-gradient-to-br from-lavender-200 to-rose-200 rounded-full flex items-center justify-center mx-auto mb-6 shadow-soft-lg">
              <BookHeart className="w-12 h-12 text-lavender-500" />
            </div>
            <Stars className="w-6 h-6 text-sunshine-400 absolute -top-2 -right-2 animate-pulse-soft" />
          </div>
          <h1 className="text-4xl font-bold mb-3" style={{ background: 'linear-gradient(to right, #9A7BFF, #FF6B8A, #FF9A7B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            감정 일기장
          </h1>
          <p className="text-gray-500 text-lg">
            ✨ AI와 함께하는 감정 추적 여정 ✨
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              이메일
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lavender-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field pl-12"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-600 mb-2">
              비밀번호
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-lavender-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field pl-12"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-2xl text-sm font-medium ${
              message.includes('성공') 
                ? 'bg-mint-100 text-mint-600 border border-mint-200' 
                : 'bg-rose-100 text-rose-600 border border-rose-200'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full text-lg py-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                처리 중...
              </span>
            ) : isSignUp ? '✨ 회원가입' : '💜 로그인'}
          </button>

          <div className="text-center pt-2">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-sm text-gray-500 hover:text-lavender-500 transition-colors font-medium"
            >
              {isSignUp ? '이미 계정이 있으신가요? 로그인' : '계정이 없으신가요? 회원가입'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
