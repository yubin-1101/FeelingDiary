import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const isConfigured = () => {
  return supabaseUrl && 
         supabaseAnonKey && 
         supabaseUrl !== 'your_supabase_url' && 
         supabaseAnonKey !== 'your_supabase_anon_key' &&
         supabaseUrl.startsWith('http')
}

export const supabase = isConfigured() 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// 일기 항목 생성
export const createDiaryEntry = async (entry) => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('diary_entries')
    .insert([
      {
        user_id: user.id,
        title: entry.title,
        content: entry.content,
        emotion: entry.emotion,
        emotion_score: entry.emotion_score,
        ai_advice: entry.ai_advice,
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

// 일기 목록 조회
export const getDiaryEntries = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) throw new Error('User not authenticated')

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

// 특정 일기 조회
export const getDiaryEntry = async (id) => {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

// 일기 수정
export const updateDiaryEntry = async (id, updates) => {
  const { data, error } = await supabase
    .from('diary_entries')
    .update(updates)
    .eq('id', id)
    .select()

  if (error) throw error
  return data[0]
}

// 일기 삭제
export const deleteDiaryEntry = async (id) => {
  const { error } = await supabase
    .from('diary_entries')
    .delete()
    .eq('id', id)

  if (error) throw error
}
