-- SQL Migration for EduPulse Week 3 Features
-- Run this in your Supabase SQL Editor to "Fix the Core" and enable all features!

-- 1. Add missing columns to 'signals' table
ALTER TABLE signals 
ADD COLUMN IF NOT EXISTS is_spam BOOLEAN DEFAULT false;

ALTER TABLE signals 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

-- 2. Add missing columns to 'active_sessions' table
ALTER TABLE active_sessions 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

ALTER TABLE active_sessions 
ADD COLUMN IF NOT EXISTS remediation_material TEXT;

-- 3. (Optional) Force the schema cache to refresh
-- Sometimes required if the API doesn't see the new columns immediately
NOTIFY pgrst, 'reload schema';
