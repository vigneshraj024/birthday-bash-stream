-- Add video generation support to birthday submissions
-- Adds cartoon_id and generated_video_url columns to both tables

-- Add columns to submissions table
ALTER TABLE public.submissions
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Add columns to approved_kids table  
ALTER TABLE public.approved_kids
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_submissions_cartoon_id ON public.submissions(cartoon_id);
CREATE INDEX IF NOT EXISTS idx_approved_kids_cartoon_id ON public.approved_kids(cartoon_id);

-- Add helpful comments
COMMENT ON COLUMN public.submissions.cartoon_id IS 'Selected cartoon character ID (mottu-patlu, doremon, shinchan, etc)';
COMMENT ON COLUMN public.submissions.generated_video_url IS 'AI-generated birthday video URL from Pixverse';
COMMENT ON COLUMN public.approved_kids.cartoon_id IS 'Selected cartoon character ID';
COMMENT ON COLUMN public.approved_kids.generated_video_url IS 'AI-generated birthday video URL';
