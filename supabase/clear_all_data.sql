-- ========================================
-- CLEAR ALL BIRTHDAY DATA FROM DATABASE
-- ========================================
-- Run this script in your Supabase SQL Editor
-- This will delete ALL birthday submissions and approved kids
-- ========================================

-- Delete all approved kids
DELETE FROM public.approved_kids;

-- Delete all submissions  
DELETE FROM public.submissions;

-- Verify the tables are empty
SELECT 'Approved Kids Count:' as table_name, COUNT(*) as count FROM public.approved_kids
UNION ALL
SELECT 'Submissions Count:' as table_name, COUNT(*) as count FROM public.submissions;
