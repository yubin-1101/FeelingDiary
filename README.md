# 🌈 감정 일기장 (Emotion Diary)

AI 기반 감정 분석 및 추적 일기 애플리케이션

## 🚀 주요 기능

- ✍️ 일기 작성 및 저장
- 🤖 OpenAI를 활용한 자동 감정 분석
- 📊 감정 추적 및 시각화
- 💡 AI 기반 맞춤형 조언 제공
- 📅 날짜별 일기 조회

## 🛠️ 기술 스택

- **Frontend**: React + Vite
- **Backend**: Express.js + Node.js
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenAI GPT-3.5
- **Charts**: Recharts
- **Icons**: Lucide React

## 📦 설치 방법

1. 의존성 설치
```bash
npm install
```

2. 환경 변수 설정
`.env.example`을 `.env`로 복사하고 값을 입력하세요:
```bash
# Supabase 설정 (https://supabase.com)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# 백엔드 API URL
VITE_API_URL=http://localhost:3001

# OpenAI API Key (https://platform.openai.com/api-keys)
OPENAI_API_KEY=sk-proj-...
```

3. Supabase 테이블 생성
Supabase 대시보드에서 다음 SQL을 실행하세요:

```sql
create table diary_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text not null,
  emotion text,
  emotion_score jsonb,
  ai_advice text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS 활성화
alter table diary_entries enable row level security;

-- 정책 생성
create policy "Users can view their own entries"
  on diary_entries for select
  using (auth.uid() = user_id);

create policy "Users can insert their own entries"
  on diary_entries for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own entries"
  on diary_entries for update
  u
이 명령어는 프론트엔드(포트 3000)와 백엔드(포트 3001)를 동시에 실행합니다.

또는 개별 실행:
```bash
# 프론트엔드만
npm run client

# 백엔드만
npm run server
```sing (auth.uid() = user_id);
```
erver/
│   └── index.js             # Express 백엔드 서버
├── s
4. 개발 서버 실행
```bash
npm run dev
```

## 📁 프로젝트 구조

```
emotion-diary/
├── src/
│   ├── components/      # React 컴포넌트
│   ├── services/        # API 서비스 (Supabase, OpenAI)
│   ├── pages/           # 페이지 컴포넌트
│   ├── utils/           # 유틸리티 함수
│   ├── App.jsx          # 메인 앱
│   └── main.jsx         # 엔트리 포인트
├── public/              # 정적 파일
└── index.html           # HTML 템플릿
```

## 🎨 디자인 컨셉

깔끔하고 현대적인 UI/UX로 사용자의 감정을 부드럽게 표현합니다.
