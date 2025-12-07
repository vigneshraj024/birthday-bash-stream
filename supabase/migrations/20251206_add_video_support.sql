-- Consolidated Migration: Add Video Generation Support
-- This adds cartoon_id and generated_video_url to both submissions and approved_kids tables

-- Add columns to submissions table
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Add columns to approved_kids table
ALTER TABLE public.approved_kids
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_submissions_cartoon_id ON public.submissions(cartoon_id);
CREATE INDEX IF NOT EXISTS idx_approved_kids_cartoon_id ON public.approved_kids(cartoon_id);

-- Add comments for documentation
COMMENT ON COLUMN public.submissions.cartoon_id IS 'ID of the selected cartoon character (e.g., mottu-patlu, doremon, shinchan)';
COMMENT ON COLUMN public.submissions.generated_video_url IS 'URL of the AI-generated birthday video';
COMMENT ON COLUMN public.approved_kids.cartoon_id IS 'ID of the selected cartoon character';
COMMENT ON COLUMN public.approved_kids.generated_video_url IS 'URL of the AI-generated birthday video';

-- Verify columns were added
SELECT 'Columns added successfully!' as status;
