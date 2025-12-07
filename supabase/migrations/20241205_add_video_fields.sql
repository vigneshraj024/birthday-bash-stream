-- Migration: Add cartoon and video fields to submissions table
-- Run this migration to enable video generation feature

ALTER TABLE submissions
ADD COLUMN IF NOT EXISTS cartoon_id TEXT,
ADD COLUMN IF NOT EXISTS generated_video_url TEXT;

-- Optional: Remove old theme_id column if you're not using it
-- ALTER TABLE submissions DROP COLUMN IF EXISTS theme_id;
