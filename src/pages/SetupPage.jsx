import { Settings, ExternalLink, Database, Key, Sparkles, Cloud, Heart, Star } from 'lucide-react'

export default function SetupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-40 h-40 bg-lavender-200/30 rounded-full blur-3xl animate-float" />
        <div className="absolute top-40 right-20 w-48 h-48 bg-peach-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-40 left-1/4 w-44 h-44 bg-mint-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-20 right-1/3 w-36 h-36 bg-rose-200/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '0.5s' }} />
        
        <Cloud className="absolute top-20 right-1/4 w-12 h-12 text-sky-200/40 animate-float" />
        <Heart className="absolute bottom-32 left-16 w-8 h-8 text-rose-200/40 animate-float" style={{ animationDelay: '1.5s' }} />
        <Star className="absolute top-32 left-1/4 w-6 h-6 text-sunshine-300/40 animate-pulse-soft" />
      </div>

      <div className="max-w-3xl w-full relative z-10">
        <div className="bg-white/70 backdrop-blur-sm rounded-[2rem] shadow-soft p-8 md:p-10 border border-white/60 animate-fade-in">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-lavender-400 to-rose-400 rounded-3xl mb-5 shadow-lg shadow-lavender-200/50 animate-float">
              <Settings className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3" style={{ background: 'linear-gradient(to right, #7B5CE8, #FF6B8A, #FF9A7B)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
              환경 설정이 필요해요 ✨
            </h1>
            <p className="text-gray-500">
              프로젝트를 실행하기 위해 API 키를 설정해주세요
            </p>
          </div>

          <div className="space-y-6">
            {/* Supabase 설정 */}
            <div className="bg-gradient-to-br from-mint-50/80 to-white/50 rounded-2xl p-6 border border-mint-100 animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-mint-400 to-mint-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-mint-200/50">
                  <Database className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">1. Supabase 설정</h3>
                  <ol className="space-y-3 text-gray-600 mb-5">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center text-mint-600 font-bold text-sm flex-shrink-0">1</span>
                      <div>
                        <a 
                          href="https://supabase.com" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-mint-600 hover:text-mint-700 font-medium inline-flex items-center"
                        >
                          supabase.com <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                        <span> 접속 → 프로젝트 생성 (무료)</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center text-mint-600 font-bold text-sm flex-shrink-0">2</span>
                      <span>Settings → API로 이동</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-mint-100 rounded-full flex items-center justify-center text-mint-600 font-bold text-sm flex-shrink-0">3</span>
                      <span><strong>Project URL</strong>과 <strong>anon public key</strong> 복사</span>
                    </li>
                  </ol>
                  <div className="bg-white/80 rounded-xl p-4 font-mono text-sm border border-mint-100">
                    <div className="text-gray-500 mb-1">VITE_SUPABASE_URL=<span className="text-mint-600">https://xxxxx.supabase.co</span></div>
                    <div className="text-gray-500">VITE_SUPABASE_ANON_KEY=<span className="text-mint-600">eyJhbGciOiJIUzI1...</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* OpenAI 설정 */}
            <div className="bg-gradient-to-br from-lavender-50/80 to-white/50 rounded-2xl p-6 border border-lavender-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-lavender-400 to-lavender-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-lavender-200/50">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">2. OpenAI API 설정</h3>
                  <ol className="space-y-3 text-gray-600 mb-5">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600 font-bold text-sm flex-shrink-0">1</span>
                      <div>
                        <a 
                          href="https://platform.openai.com/api-keys" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-lavender-600 hover:text-lavender-700 font-medium inline-flex items-center"
                        >
                          platform.openai.com/api-keys <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                        <span> 접속</span>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600 font-bold text-sm flex-shrink-0">2</span>
                      <span>"Create new secret key" 클릭</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-lavender-100 rounded-full flex items-center justify-center text-lavender-600 font-bold text-sm flex-shrink-0">3</span>
                      <span>생성된 API 키 복사 (다시 볼 수 없으니 주의!)</span>
                    </li>
                  </ol>
                  <div className="bg-white/80 rounded-xl p-4 font-mono text-sm border border-lavender-100">
                    <div className="text-gray-500">OPENAI_API_KEY=<span className="text-lavender-600">sk-proj-...</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* .env 파일 설정 */}
            <div className="bg-gradient-to-br from-sky-50/80 to-white/50 rounded-2xl p-6 border border-sky-100 animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-sky-400 to-sky-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-sky-200/50">
                  <Key className="w-7 h-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-700 mb-4">3. .env 파일 수정</h3>
                  <ol className="space-y-3 text-gray-600 mb-5">
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">1</span>
                      <span>프로젝트 루트의 <code className="bg-white px-2 py-1 rounded-lg border border-sky-100">.env</code> 파일 열기</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">2</span>
                      <span>위에서 복사한 값들을 붙여넣기</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-6 h-6 bg-sky-100 rounded-full flex items-center justify-center text-sky-600 font-bold text-sm flex-shrink-0">3</span>
                      <span>파일 저장 후 <strong className="text-sky-600">개발 서버 재시작</strong></span>
                    </li>
                  </ol>
                  <div className="bg-sunshine-50/80 border border-sunshine-200 rounded-xl p-4">
                    <p className="text-sm text-sunshine-700 flex items-start gap-2">
                      <span className="text-xl">⚠️</span>
                      <span><strong>중요:</strong> .env 파일을 수정한 후 반드시 개발 서버를 재시작해야 합니다!</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Supabase 데이터베이스 설정 */}
            <div className="bg-gradient-to-br from-peach-50/80 to-white/50 rounded-2xl p-6 border border-peach-100 animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <h3 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
                <span className="w-8 h-8 bg-gradient-to-br from-peach-400 to-rose-400 rounded-lg flex items-center justify-center text-white font-bold text-sm">4</span>
                Supabase 데이터베이스 테이블 생성
              </h3>
              <p className="text-gray-600 mb-4">
                Supabase Dashboard → <strong>SQL Editor</strong>에서 다음 SQL 실행:
              </p>
              <div className="bg-gray-900 text-gray-100 rounded-xl p-5 font-mono text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap">{`create table diary_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text not null,
  emotion text,
  emotion_score jsonb,
  ai_advice text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table diary_entries enable row level security;

create policy "Users can view their own entries"
  on diary_entries for select using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on diary_entries for insert with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on diary_entries for update using (auth.uid() = user_id);`}</pre>
              </div>
            </div>
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-3 text-sm text-gray-400 bg-white/50 px-5 py-3 rounded-full">
              <div className="w-2 h-2 bg-mint-400 rounded-full animate-pulse"></div>
              <span>설정 완료 후 이 페이지는 자동으로 사라집니다</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
