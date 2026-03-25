-- moodang.app 데이터베이스 스키마
-- Supabase (PostgreSQL) 기반

-- 1. 사용자 기본 정보
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE,
    nickname TEXT,
    birth_date DATE NOT NULL,
    birth_time TIME,
    birth_location TEXT,
    gender TEXT CHECK (gender IN ('M', 'F', 'N')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_active_at TIMESTAMP WITH TIME ZONE,
    subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
    total_readings INTEGER DEFAULT 0,
    referral_code TEXT UNIQUE,
    referred_by UUID REFERENCES users(id)
);

-- 2. 운세 분석 결과 저장
CREATE TABLE fortune_readings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    reading_type TEXT NOT NULL, -- 'daily', 'monthly', 'yearly', 'compatibility'
    saju_data JSONB NOT NULL, -- 사주 계산 결과
    vedic_data JSONB, -- Vedic Dasha 결과
    iching_data JSONB, -- 주역 결과
    numerology_data JSONB, -- (deprecated, 수비학 제거됨)
    face_analysis_data JSONB, -- 관상 분석 결과 (이미지 URL 포함)
    ai_interpretation TEXT NOT NULL, -- Gemini 해석 결과
    fortune_grade TEXT, -- SSS, SS, S, A, B, C
    fortune_type TEXT, -- 한자 1글자 유형
    celebrity_match TEXT, -- 매칭된 유명인
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE, -- 운세 유효기간
    is_premium BOOLEAN DEFAULT FALSE
);

-- 3. 사용자 피드백 및 정확도 추적
CREATE TABLE reading_feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reading_id UUID REFERENCES fortune_readings(id),
    user_id UUID REFERENCES users(id),
    accuracy_score INTEGER CHECK (accuracy_score BETWEEN 1 AND 5),
    category TEXT, -- 'love', 'career', 'money', 'health', 'general'
    feedback_text TEXT,
    actual_event TEXT, -- 실제 일어난 일
    predicted_event TEXT, -- 예측했던 일
    event_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. 개인화 AI 모델 데이터
CREATE TABLE user_patterns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    pattern_type TEXT NOT NULL, -- 'accuracy_by_category', 'behavioral', 'preferences'
    pattern_data JSONB NOT NULL, -- JSON 형태의 패턴 데이터
    confidence_score FLOAT, -- 패턴 신뢰도 (0-1)
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, pattern_type)
);

-- 5. 궁합 및 관계 분석
CREATE TABLE compatibility_analyses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user1_id UUID REFERENCES users(id),
    user2_id UUID REFERENCES users(id),
    relationship_type TEXT, -- 'romantic', 'friendship', 'business'
    compatibility_score INTEGER CHECK (compatibility_score BETWEEN 0 AND 100),
    analysis_result JSONB NOT NULL,
    ai_advice TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user1_id, user2_id, relationship_type)
);

-- 6. 바이럴 공유 추적
CREATE TABLE viral_shares (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    reading_id UUID REFERENCES fortune_readings(id),
    share_platform TEXT, -- 'instagram', 'kakao', 'facebook', 'twitter'
    share_type TEXT, -- 'result_card', 'grade', 'celebrity_match'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    click_count INTEGER DEFAULT 0
);

-- 7. 구독 및 결제 정보
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    plan_type TEXT NOT NULL,
    status TEXT CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    expires_at TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    amount INTEGER, -- 원 단위
    billing_cycle TEXT -- 'monthly', 'yearly', 'one_time'
);

-- 8. 집단 인사이트 (데이터 플라이휠의 핵심)
CREATE TABLE collective_insights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    insight_type TEXT NOT NULL, -- 'trend', 'correlation', 'prediction'
    category TEXT, -- 'career', 'love', 'money', 'health'
    time_period TEXT, -- '2024-Q1', '2024-03', etc.
    insight_data JSONB NOT NULL,
    confidence_score FLOAT,
    sample_size INTEGER, -- 인사이트 도출에 사용된 데이터 수
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_published BOOLEAN DEFAULT FALSE -- 프리미엄 콘텐츠로 공개 여부
);

-- 9. A/B 테스트 및 실험 추적
CREATE TABLE experiments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    experiment_name TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    variant TEXT, -- 'A', 'B', 'C' 등
    conversion_event TEXT, -- 'subscription', 'share', 'feedback'
    converted BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. 사용자 활동 로그 (행동 패턴 분석용)
CREATE TABLE user_activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    action_type TEXT NOT NULL, -- 'reading_request', 'share', 'feedback', 'subscription'
    page_path TEXT,
    session_duration INTEGER, -- 초 단위
    device_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 인덱스 생성 (성능 최적화)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_referral ON users(referral_code);
CREATE INDEX idx_fortune_readings_user ON fortune_readings(user_id);
CREATE INDEX idx_fortune_readings_created ON fortune_readings(created_at);
CREATE INDEX idx_feedback_reading ON reading_feedback(reading_id);
CREATE INDEX idx_feedback_user ON reading_feedback(user_id);
CREATE INDEX idx_patterns_user ON user_patterns(user_id);
CREATE INDEX idx_compatibility_users ON compatibility_analyses(user1_id, user2_id);
CREATE INDEX idx_shares_user ON viral_shares(user_id);
CREATE INDEX idx_shares_platform ON viral_shares(share_platform);
CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_insights_type ON collective_insights(insight_type, time_period);
CREATE INDEX idx_experiments_name ON experiments(experiment_name);
CREATE INDEX idx_activity_user ON user_activity_logs(user_id);
CREATE INDEX idx_activity_created ON user_activity_logs(created_at);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE fortune_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reading_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE compatibility_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE viral_shares ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;

-- 사용자는 자신의 데이터만 접근 가능
CREATE POLICY "Users can access their own data" ON users
    FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can access their own readings" ON fortune_readings
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can access their own feedback" ON reading_feedback
    FOR ALL USING (auth.uid() = user_id);

-- collective_insights는 공개 데이터 (읽기 전용)
CREATE POLICY "Anyone can read published insights" ON collective_insights
    FOR SELECT USING (is_published = true);