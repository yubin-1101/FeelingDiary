import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { supabase, isConfigured } from './services/supabase'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import DiaryListPage from './pages/DiaryListPage'
import WriteDiaryPage from './pages/WriteDiaryPage'
import DiaryDetailPage from './pages/DiaryDetailPage'
import EmotionStatsPage from './pages/EmotionStatsPage'
import LoginPage from './pages/LoginPage'
import SetupPage from './pages/SetupPage'

function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  // 환경 변수 설정 확인
  if (!isConfigured()) {
    return <SetupPage />
  }

  useEffect(() => {
    // 세션 확인
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    // 세션 변경 감지
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  if (!session) {
    return <LoginPage />
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/list" element={<DiaryListPage />} />
          <Route path="/write" element={<WriteDiaryPage />} />
          <Route path="/diary/:id" element={<DiaryDetailPage />} />
          <Route path="/stats" element={<EmotionStatsPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App
