-- 🧠 Adaptive Learning Database Setup for Explain It
-- Run this SQL in your Supabase SQL Editor

-- 1. Create Learning Analytics Table
CREATE TABLE IF NOT EXISTS learning_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  subject TEXT NOT NULL,
  topic TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  performance INTEGER NOT NULL CHECK (performance >= 0 AND performance <= 100),
  time_spent INTEGER NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 1,
  correct_answers INTEGER NOT NULL DEFAULT 0,
  total_questions INTEGER NOT NULL DEFAULT 1,
  learning_velocity DECIMAL(5,2) NOT NULL DEFAULT 0.0,
  retention_rate INTEGER NOT NULL DEFAULT 100 CHECK (retention_rate >= 0 AND retention_rate <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create Learning Preferences Table
CREATE TABLE IF NOT EXISTS learning_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  preferred_difficulty TEXT NOT NULL DEFAULT 'medium' CHECK (preferred_difficulty IN ('easy', 'medium', 'hard')),
  learning_style TEXT NOT NULL DEFAULT 'visual' CHECK (learning_style IN ('visual', 'auditory', 'kinesthetic', 'reading')),
  study_time_preference TEXT NOT NULL DEFAULT 'evening' CHECK (study_time_preference IN ('morning', 'afternoon', 'evening', 'night')),
  session_duration INTEGER NOT NULL DEFAULT 30,
  subjects JSONB DEFAULT '[]'::jsonb,
  weak_areas JSONB DEFAULT '[]'::jsonb,
  strong_areas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Create Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_learning_analytics_user_id ON learning_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_subject ON learning_analytics(subject);
CREATE INDEX IF NOT EXISTS idx_learning_analytics_created_at ON learning_analytics(created_at);
CREATE INDEX IF NOT EXISTS idx_learning_preferences_user_id ON learning_preferences(user_id);

-- 4. Insert Sample Data for Testing (Optional)
-- Get the first user ID for demo data
DO $$
DECLARE
    demo_user_id UUID;
BEGIN
    -- Get a user ID for demo data
    SELECT id INTO demo_user_id FROM users LIMIT 1;
    
    IF demo_user_id IS NOT NULL THEN
        -- Insert sample learning analytics
        INSERT INTO learning_analytics (user_id, subject, topic, difficulty, performance, time_spent, attempts, correct_answers, total_questions, learning_velocity, retention_rate) VALUES
        (demo_user_id, 'Mathematics', 'Algebra', 'medium', 85, 300, 1, 8, 10, 2.0, 90),
        (demo_user_id, 'Science', 'Physics', 'hard', 75, 450, 2, 6, 8, 1.1, 80),
        (demo_user_id, 'English', 'Grammar', 'easy', 95, 180, 1, 9, 10, 3.3, 95),
        (demo_user_id, 'Mathematics', 'Geometry', 'medium', 70, 360, 1, 7, 10, 1.7, 85),
        (demo_user_id, 'Science', 'Chemistry', 'medium', 80, 240, 1, 8, 10, 2.5, 88)
        ON CONFLICT DO NOTHING;
        
        -- Insert sample learning preferences
        INSERT INTO learning_preferences (user_id, preferred_difficulty, learning_style, study_time_preference, session_duration, subjects, weak_areas, strong_areas) VALUES
        (demo_user_id, 'medium', 'visual', 'evening', 30, '["Mathematics", "Science", "English"]'::jsonb, '["Physics", "Geometry"]'::jsonb, '["Grammar", "Algebra"]'::jsonb)
        ON CONFLICT (user_id) DO NOTHING;
        
        RAISE NOTICE 'Sample data inserted for user: %', demo_user_id;
    ELSE
        RAISE NOTICE 'No users found. Please create a user account first.';
    END IF;
END $$;

-- 5. Verify Tables Created Successfully
SELECT 
    'learning_analytics' as table_name,
    COUNT(*) as record_count
FROM learning_analytics
UNION ALL
SELECT 
    'learning_preferences' as table_name,
    COUNT(*) as record_count  
FROM learning_preferences;

-- 6. Show Table Structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('learning_analytics', 'learning_preferences')
ORDER BY table_name, ordinal_position;
