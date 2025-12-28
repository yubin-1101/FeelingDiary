-- ============================================
-- 감정 일기장 (Emotion Diary) 데이터베이스 스키마
-- ============================================

-- ============================================
-- 1. 메인 테이블: diary_entries (일기 항목)
-- ============================================
create table if not exists public.diary_entries (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text,
  content text not null,
  emotion text,
  emotion_score jsonb,
  ai_advice text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 인덱스 생성 (성능 최적화)
create index if not exists idx_diary_entries_user_id on public.diary_entries(user_id);
create index if not exists idx_diary_entries_created_at on public.diary_entries(created_at desc);
create index if not exists idx_diary_entries_emotion on public.diary_entries(emotion);

-- Row Level Security 활성화
alter table public.diary_entries enable row level security;

-- ============================================
-- 2. RLS 정책 (Row Level Security)
-- ============================================

-- 사용자는 자신의 일기만 조회 가능
create policy if not exists "Users can view their own entries"
  on public.diary_entries
  for select
  using (auth.uid() = user_id);

-- 사용자는 자신의 일기만 삽입 가능
create policy if not exists "Users can insert their own entries"
  on public.diary_entries
  for insert
  with check (auth.uid() = user_id);

-- 사용자는 자신의 일기만 수정 가능
create policy if not exists "Users can update their own entries"
  on public.diary_entries
  for update
  using (auth.uid() = user_id);

-- 사용자는 자신의 일기만 삭제 가능
create policy if not exists "Users can delete their own entries"
  on public.diary_entries
  for delete
  using (auth.uid() = user_id);

-- ============================================
-- 3. 사용자 프로필 테이블 (선택사항)
-- ============================================
create table if not exists public.user_profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  bio text,
  preferred_emotion_theme text default 'light',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security 활성화
alter table public.user_profiles enable row level security;

-- 사용자는 자신의 프로필만 조회 가능
create policy if not exists "Users can view their own profile"
  on public.user_profiles
  for select
  using (auth.uid() = id);

-- 사용자는 자신의 프로필만 수정 가능
create policy if not exists "Users can update their own profile"
  on public.user_profiles
  for update
  using (auth.uid() = id);

-- 사용자는 자신의 프로필만 삽입 가능
create policy if not exists "Users can insert their own profile"
  on public.user_profiles
  for insert
  with check (auth.uid() = id);

-- ============================================
-- 4. 감정 통계 뷰 (집계용)
-- ============================================
create or replace view public.emotion_statistics as
select
  user_id,
  emotion,
  count(*) as count,
  count(*) * 100.0 / sum(count(*)) over (partition by user_id) as percentage,
  avg((emotion_score->>'happiness')::numeric) as avg_happiness,
  avg((emotion_score->>'sadness')::numeric) as avg_sadness,
  avg((emotion_score->>'anger')::numeric) as avg_anger,
  avg((emotion_score->>'anxiety')::numeric) as avg_anxiety,
  avg((emotion_score->>'calm')::numeric) as avg_calm
from public.diary_entries
where emotion is not null
group by user_id, emotion;

-- ============================================
-- 5. 일별 감정 요약 뷰
-- ============================================
create or replace view public.daily_emotion_summary as
select
  user_id,
  date(created_at at time zone 'UTC') as date,
  emotion,
  count(*) as entry_count,
  array_agg(id) as entry_ids,
  jsonb_agg(emotion_score) as emotion_scores
from public.diary_entries
group by user_id, date(created_at at time zone 'UTC'), emotion;

-- ============================================
-- 6. 사용자별 월간 통계 뷰
-- ============================================
create or replace view public.monthly_emotion_stats as
select
  user_id,
  date_trunc('month', created_at)::date as month,
  emotion,
  count(*) as total_entries,
  avg((emotion_score->>'happiness')::numeric) as avg_happiness,
  avg((emotion_score->>'sadness')::numeric) as avg_sadness,
  avg((emotion_score->>'anger')::numeric) as avg_anger,
  avg((emotion_score->>'anxiety')::numeric) as avg_anxiety,
  avg((emotion_score->>'calm')::numeric) as avg_calm
from public.diary_entries
where emotion is not null
group by user_id, date_trunc('month', created_at), emotion;

-- ============================================
-- 7. 함수: updated_at 자동 업데이트
-- ============================================
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- updated_at 트리거 (diary_entries)
create trigger if not exists update_diary_entries_updated_at
  before update on public.diary_entries
  for each row
  execute function public.update_updated_at_column();

-- updated_at 트리거 (user_profiles)
create trigger if not exists update_user_profiles_updated_at
  before update on public.user_profiles
  for each row
  execute function public.update_updated_at_column();

-- ============================================
-- 8. 함수: 사용자 프로필 자동 생성
-- ============================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql;

-- 새 사용자 가입 시 프로필 자동 생성
create trigger if not exists on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- ============================================
-- 9. 저장 프로시저: 감정 분석 통계 조회
-- ============================================
create or replace function public.get_user_emotion_stats(user_uuid uuid, days integer default 30)
returns table (
  emotion text,
  count bigint,
  percentage numeric,
  avg_happiness numeric,
  avg_sadness numeric,
  avg_anger numeric,
  avg_anxiety numeric,
  avg_calm numeric
) as $$
select
  de.emotion,
  count(*) as count,
  count(*) * 100.0 / sum(count(*)) over () as percentage,
  avg((de.emotion_score->>'happiness')::numeric) as avg_happiness,
  avg((de.emotion_score->>'sadness')::numeric) as avg_sadness,
  avg((de.emotion_score->>'anger')::numeric) as avg_anger,
  avg((de.emotion_score->>'anxiety')::numeric) as avg_anxiety,
  avg((de.emotion_score->>'calm')::numeric) as avg_calm
from public.diary_entries de
where de.user_id = user_uuid
  and de.created_at >= now() - (days || ' days')::interval
  and de.emotion is not null
group by de.emotion
order by count desc;
$$ language sql;

-- ============================================
-- 10. 저장 프로시저: 최근 일기 조회
-- ============================================
create or replace function public.get_recent_entries(user_uuid uuid, limit_count integer default 10)
returns table (
  id uuid,
  title text,
  content text,
  emotion text,
  emotion_score jsonb,
  ai_advice text,
  created_at timestamp with time zone
) as $$
select
  de.id,
  de.title,
  de.content,
  de.emotion,
  de.emotion_score,
  de.ai_advice,
  de.created_at
from public.diary_entries de
where de.user_id = user_uuid
order by de.created_at desc
limit limit_count;
$$ language sql;

-- ============================================
-- 11. 저장 프로시저: 감정별 일기 개수
-- ============================================
create or replace function public.get_emotion_count(user_uuid uuid)
returns table (
  emotion text,
  count bigint
) as $$
select
  de.emotion,
  count(*) as count
from public.diary_entries de
where de.user_id = user_uuid
  and de.emotion is not null
group by de.emotion
order by count desc;
$$ language sql;

-- ============================================
-- 12. 저장 프로시저: 감정 트렌드 (7일)
-- ============================================
create or replace function public.get_emotion_trend(user_uuid uuid)
returns table (
  date date,
  emotion text,
  count bigint
) as $$
select
  date(de.created_at at time zone 'UTC') as date,
  de.emotion,
  count(*) as count
from public.diary_entries de
where de.user_id = user_uuid
  and de.created_at >= now() - interval '7 days'
  and de.emotion is not null
group by date(de.created_at at time zone 'UTC'), de.emotion
order by date desc, emotion;
$$ language sql;

-- ============================================
-- 13. 권한 설정
-- ============================================
-- diary_entries 테이블 권한
grant select, insert, update, delete on public.diary_entries to authenticated;
grant select on public.diary_entries to anon;

-- user_profiles 테이블 권한
grant select, insert, update on public.user_profiles to authenticated;
grant select on public.user_profiles to anon;

-- 뷰 권한
grant select on public.emotion_statistics to authenticated;
grant select on public.daily_emotion_summary to authenticated;
grant select on public.monthly_emotion_stats to authenticated;

-- 함수 권한
grant execute on function public.get_user_emotion_stats to authenticated;
grant execute on function public.get_recent_entries to authenticated;
grant execute on function public.get_emotion_count to authenticated;
grant execute on function public.get_emotion_trend to authenticated;

-- ============================================
-- 14. 기본 데이터 (선택사항)
-- ============================================
-- 샘플 감정 카테고리 테이블 (참고용)
create table if not exists public.emotion_categories (
  id serial primary key,
  name text unique not null,
  description text,
  color text,
  icon text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

insert into public.emotion_categories (name, description, color, icon) values
  ('행복', '긍정적이고 기쁜 감정', '#F59E0B', '😊'),
  ('슬픔', '우울하고 신세한탄하는 감정', '#3B82F6', '😢'),
  ('분노', '화나고 짜증나는 감정', '#EF4444', '😠'),
  ('불안', '걱정되고 두려운 감정', '#F97316', '😰'),
  ('평온', '편안하고 차분한 감정', '#10B981', '😌')
on conflict (name) do nothing;

-- ============================================
-- 완료 메시지
-- ============================================
-- 모든 테이블, 뷰, 함수가 생성되었습니다!
-- 이제 애플리케이션에서 사용할 수 있습니다.
