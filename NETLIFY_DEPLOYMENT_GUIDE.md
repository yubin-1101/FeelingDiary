# Netlify 배포 가이드

## 📝 백엔드 변환 완료

기존 Express 서버가 **Netlify Functions**로 변환되었습니다.

### 변환된 구조
```
netlify/
├── functions/
│   ├── analyze-emotion.mjs      ✅ 감정 분석 API
│   ├── generate-advice.mjs      ✅ 조언 생성 API
│   ├── emotion-coach.mjs        ✅ AI 코칭 API
│   └── health.mjs               ✅ 헬스 체크 API
└── netlify.toml                 ✅ Netlify 설정
```

---

## 🚀 배포 단계

### 1️⃣ 로컬 테스트 (필수)

```bash
# Netlify CLI 설치
npm install -g netlify-cli

# 로컬 함수 테스트 (포트 3000/9000)
netlify dev

# 브라우저 확인
# http://localhost:3000  - 프론트엔드
# http://localhost:9000/.netlify/functions/health - API 테스트
```

### 2️⃣ 환경 변수 설정

**netlify.toml에 필요한 환경 변수 추가:**

```toml
[build]
  command = "npm run build"
  functions = "netlify/functions"
  publish = "dist"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200

# 환경 변수 (Netlify UI에서 설정 권장)
[context.production.environment]
  GROQ_API_KEY = "your_groq_api_key_here"
  HUGGING_FACE_API_KEY = "your_hugging_face_token_here"

[context.deploy-preview.environment]
  GROQ_API_KEY = "your_groq_api_key_here"
```

### 3️⃣ Netlify에 배포

#### A. GitHub 연결 (자동 배포)
1. GitHub에 코드 푸시
2. Netlify 가입 (https://app.netlify.com)
3. "New site from Git" 클릭
4. GitHub 저장소 선택
5. 빌드 설정 자동 감지됨

#### B. CLI로 배포
```bash
# 로그인
netlify login

# 배포
netlify deploy --prod

# 또는 GitHub으로 자동 배포 설정
```

---

## 📌 환경 변수 설정

**Netlify Dashboard에서:**

1. **Site Settings** → **Build & Deploy** → **Environment**
2. **Add environment variables** 클릭

필수 환경 변수:
- `GROQ_API_KEY` - Groq API 키 (무료, https://console.groq.com)
- `HUGGING_FACE_API_KEY` - Hugging Face 토큰 (선택사항)

---

## ✅ 배포 후 테스트

### API 엔드포인트 테스트

```bash
# 건강 체크
curl https://your-site.netlify.app/.netlify/functions/health

# 감정 분석 테스트
curl -X POST https://your-site.netlify.app/.netlify/functions/analyze-emotion \
  -H "Content-Type: application/json" \
  -d '{"content": "오늘 정말 행복한 하루였어"}'

# AI 코칭 테스트
curl -X POST https://your-site.netlify.app/.netlify/functions/emotion-coach \
  -H "Content-Type: application/json" \
  -d '{
    "message": "요즘 불안해", 
    "emotion": "불안",
    "conversationContext": ""
  }'
```

---

## 🎯 프론트엔드 API 호출 수정

### src/services/openai.js 또는 API 호출 코드에서:

```javascript
// 로컬 개발 시
const API_BASE = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:9000/.netlify/functions'
  : ''

// 감정 분석
const response = await fetch(`${API_BASE}/analyze-emotion`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: diaryContent })
})

// 또는 상대 경로로 (더 간단함)
const response = await fetch('/api/analyze-emotion', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content: diaryContent })
})
```

### 자동 리다이렉트 (이미 설정됨)
- 모든 `/api/*` 요청이 자동으로 `/.netlify/functions/:splat`로 리다이렉트됩니다.

---

## 🔧 문제 해결

### 1. 404 에러가 발생하는 경우
- netlify.toml이 프로젝트 루트에 있는지 확인
- 함수 파일이 `netlify/functions/` 폴더에 있는지 확인
- 함수명이 URL과 일치하는지 확인

### 2. 환경 변수가 로드되지 않는 경우
- Netlify Dashboard에서 다시 확인
- 환경 변수 이름이 정확한지 확인
- 배포 후 다시 빌드 필요할 수 있음

### 3. CORS 에러
- 함수에 이미 CORS 헤더가 포함됨 (자동 처리)
- 클라이언트에서 `/api` 경로 사용 확인

---

## 💡 추가 팁

### 스케일링
- Netlify Functions는 자동 스케일링됨
- 월 125,000 호출까지 무료 (충분함)

### 모니터링
- Netlify Dashboard에서 Function logs 확인
- **Functions** → **Logs** 메뉴에서 실시간 로그 확인

### 성능 최적화
- 현재 함수들은 빠른 응답 시간 (< 1초)
- 필요시 캐싱 추가 가능

---

## 📚 참고 자료

- [Netlify Functions 공식 문서](https://docs.netlify.com/functions/overview/)
- [Groq API 문서](https://console.groq.com/docs)
- [Hugging Face API](https://huggingface.co/docs)

---

## ✨ 요약

| 항목 | 상태 |
|------|------|
| 백엔드 → Netlify Functions 변환 | ✅ 완료 |
| 프론트엔드 빌드 설정 | ✅ 완료 |
| 환경 변수 설정 | ⚙️ 수동 (Netlify Dashboard) |
| 배포 | 🚀 준비 완료 |

**다음 단계: `netlify deploy --prod` 또는 GitHub 자동 연결**
