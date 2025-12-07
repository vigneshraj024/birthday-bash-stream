-- DIAGNOSTIC SCRIPT: Check December 9 Video Count
-- Run this to see the actual count in your database

-- 1. Check total count in approved_kids table for Dec 9
SELECT 
    'Total Dec 9 Videos in approved_kids:' as check_name,
    COUNT(*) as count
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9;

-- 2. Check total count in submissions table for Dec 9 (approved status)
SELECT 
    'Total Dec 9 Videos in submissions (approved):' as check_name,
    COUNT(*) as count
FROM public.submissions
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9
  AND status = 'approved';

-- 3. List all Dec 9 videos in approved_kids with details
SELECT 
    'approved_kids table' as source,
    id,
    kid_name,
    date_of_birth,
    generated_video_url,
    created_at
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9
ORDER BY created_at ASC;

-- 4. Check if videos have generated_video_url (only these show in stream)
SELECT 
    'Dec 9 Videos WITH generated_video_url:' as check_name,
    COUNT(*) as count
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9
  AND generated_video_url IS NOT NULL
  AND generated_video_url != '';
