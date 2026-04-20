-- 대화 기록을 저장할 테이블
create table public.chat_history (
  id bigint generated always as identity primary key,
  created_at timestamp with time zone default now(),
  user_question text,
  ai_response text,
  user_id uuid default auth.uid() -- 로그인 기능을 붙이면 자동으로 유저 식별
);

-- 1. 채용 공고 및 기업 요구사항 저장
create table public.job_market_data (
  id bigint generated always as identity primary key,
  company_name text,
  job_title text,
  requirements text,      -- 채용 조건 (기술 스택 등)
  period text,            -- 채용 기간
  source_url text unique, -- 중복 저장 방지
  raw_content text,       -- AI 분석용 전체 텍스트
  created_at timestamp with time zone default now()
);

-- 2. 합격자 스펙 및 CV 데이터 (익명화)
create table public.career_benchmarks (
  id bigint generated always as identity primary key,
  target_company text,
  target_role text,
  spec_summary text,      -- 학벌, 자격증, 프로젝트 경험 등 요약
  cv_link text,           -- 참고할 수 있는 링크 (있는 경우)
  verified boolean default false
);
