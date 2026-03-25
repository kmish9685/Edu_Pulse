-- SQL Migration: Multi-tenancy and Data Isolation
-- This script adds the 'institution_id' column to all relevant tables and creates a default institution.

-- 1. Create the 'institutions' table
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 2. Create a default institution (to prevent data loss)
DO $$
DECLARE
    default_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    INSERT INTO public.institutions (id, name)
    VALUES (default_id, 'Default Institution')
    ON CONFLICT (id) DO NOTHING;
END $$;

-- 3. Add 'institution_id' to 'profiles' table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) DEFAULT '00000000-0000-0000-0000-000000000001';

-- 4. Add 'institution_id' to 'signals' table
ALTER TABLE public.signals 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) DEFAULT '00000000-0000-0000-0000-000000000001';

-- 5. Add 'institution_id' to 'active_sessions' table
ALTER TABLE public.active_sessions 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) DEFAULT '00000000-0000-0000-0000-000000000001';

-- 6. Add 'institution_id' to 'signal_types' table
ALTER TABLE public.signal_types 
ADD COLUMN IF NOT EXISTS institution_id UUID REFERENCES public.institutions(id) DEFAULT '00000000-0000-0000-0000-000000000001';

-- 7. (Optional) Force the schema cache to refresh
NOTIFY pgrst, 'reload schema';

