# Supabase 이메일 확인 비활성화 가이드

## 🔧 Supabase 설정 방법

### 1️⃣ 이메일 확인 비활성화 (개발 환경)

1. **Supabase Dashboard** 접속
2. **Authentication** → **Providers** → **Email**
3. **Confirm email** 토글 **OFF** ✓
4. **Save** 클릭

---

### 2️⃣ 자동 사용자 프로필 생성 확인

Supabase에서 **SQL Editor**로 이동하여 다음 함수가 있는지 확인:

```sql
-- 새 사용자 가입 시 자동으로 프로필 생성
drop trigger if exists on_auth_user_created on auth.users;
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id)
  values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql;

create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();
```

---

## ✅ 변경 사항

### LoginPage.jsx 수정 완료:
- ✅ 이메일 확인 없이 직접 로그인 가능
- ✅ 상세한 오류 메시지 표시
- ✅ 회원가입 성공 후 입력값 초기화
- ✅ 자동으로 로그인 페이지로 돌아가기

---

## 🧪 테스트 방법

1. **회원가입** (임의의 이메일/비밀번호)
2. **로그인** (같은 이메일/비밀번호)
3. 정상 진입 확인 ✅

---

## 📋 다른 Supabase 설정 체크리스트

- [ ] Email Confirm 비활성화
- [ ] Supabase Auth 활성화
- [ ] diary_entries 테이블 생성
- [ ] user_profiles 테이블 생성
- [ ] RLS 정책 적용
- [ ] API 키 설정 (.env)

문제 지속 시 "브라우저 개발자 도구 → Network → signup 요청" 응답 확인해주세요!
