-- CRITICAL: Run this SQL in Supabase SQL Editor to enable video streaming
-- Go to: https://supabase.com/dashboard/project/pufvhbxblotdedjxbzsa/sql/new
-- Copy and paste this entire file, then click "Run"

-- Add video generation columns to approved_kids table (for streaming)
ALTER TABLE public.approved_kids
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Add video generation columns to submissions table (for pending submissions)
ALTER TABLE public.submissions  
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_approved_kids_cartoon_id ON public.approved_kids(cartoon_id);
CREATE INDEX IF NOT EXISTS idx_approved_kids_date ON public.approved_kids(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_submissions_cartoon_id ON public.submissions(cartoon_id);

-- Add helpful comments
COMMENT ON COLUMN public.approved_kids.cartoon_id IS 'Selected cartoon character (mottu-patlu, doremon, shinchan, etc)';
COMMENT ON COLUMN public.approved_kids.generated_video_url IS 'AI-generated birthday video URL from Pixverse';
COMMENT ON COLUMN public.submissions.cartoon_id IS 'Selected cartoon character';
COMMENT ON COLUMN public.submissions.generated_video_url IS 'AI-generated birthday video URL';

-- Verify the migration worked
SELECT 
    'Migration successful! Columns added:' as status,
    COUNT(*) FILTER (WHERE column_name = 'cartoon_id') as cartoon_id_count,
    COUNT(*) FILTER (WHERE column_name = 'generated_video_url') as video_url_count
FROM information_schema.columns 
WHERE table_name IN ('approved_kids', 'submissions')
AND column_name IN ('cartoon_id', 'generated_video_url');
