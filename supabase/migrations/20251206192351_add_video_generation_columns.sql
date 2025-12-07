-- Add video generation support columns to approved_kids and submissions tables
-- This migration adds cartoon_id and generated_video_url columns for AI video feature

-- Add columns to approved_kids table
ALTER TABLE public.approved_kids
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Add columns to submissions table
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_approved_kids_cartoon_id ON public.approved_kids(cartoon_id);
CREATE INDEX IF NOT EXISTS idx_submissions_cartoon_id ON public.submissions(cartoon_id);

-- Add comments for documentation
COMMENT ON COLUMN public.approved_kids.cartoon_id IS 'Selected cartoon character ID (mottu-patlu, doremon, shinchan, little-krishna, rudra, chotta-bheem)';
COMMENT ON COLUMN public.approved_kids.generated_video_url IS 'AI-generated birthday celebration video URL from Pixverse API';
COMMENT ON COLUMN public.submissions.cartoon_id IS 'Selected cartoon character ID';
COMMENT ON COLUMN public.submissions.generated_video_url IS 'AI-generated birthday celebration video URL';
