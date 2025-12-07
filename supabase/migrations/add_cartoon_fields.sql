-- Migration: Replace theme_id with cartoon_id and add generated_video_url
-- Run this in your Supabase SQL Editor

-- Step 1: Add new columns
ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Step 2: Drop the old theme_id column (if it exists)
ALTER TABLE submissions
DROP COLUMN IF EXISTS theme_id;

-- Step 3: Add comment for documentation
COMMENT ON COLUMN submissions.cartoon_id IS 'ID of the selected cartoon character (e.g., mickey, minnie)';
COMMENT ON COLUMN submissions.generated_video_url IS 'URL of the AI-generated birthday video with cartoon and person';

-- Optional: Create an index for faster queries by cartoon_id
CREATE INDEX IF NOT EXISTS idx_submissions_cartoon_id ON submissions(cartoon_id);
