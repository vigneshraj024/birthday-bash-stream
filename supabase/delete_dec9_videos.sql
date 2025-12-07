-- Delete 30 out of 32 videos for December 9th
-- This script keeps the FIRST 2 videos (oldest submissions) and deletes the rest

-- Step 1: Show current count for December 9th
SELECT 
    'Before Deletion - December 9 Videos:' as status,
    COUNT(*) as total_count
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9;

-- Step 2: Show which videos will be KEPT (first 2)
SELECT 
    'KEEPING THESE 2 VIDEOS:' as status,
    id,
    kid_name,
    date_of_birth,
    created_at
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9
ORDER BY created_at ASC
LIMIT 2;

-- Step 3: Show which videos will be DELETED (remaining 30)
SELECT 
    'DELETING THESE 30 VIDEOS:' as status,
    id,
    kid_name,
    date_of_birth,
    created_at
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9
  AND id NOT IN (
    SELECT id
    FROM public.approved_kids
    WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
      AND EXTRACT(DAY FROM date_of_birth) = 9
    ORDER BY created_at ASC
    LIMIT 2
  )
ORDER BY created_at ASC;

-- Step 4: PERFORM THE DELETION
-- ⚠️ WARNING: This action is IRREVERSIBLE! ⚠️
-- Uncomment the DELETE statement below to execute the deletion

/*
DELETE FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9
  AND id NOT IN (
    SELECT id
    FROM public.approved_kids
    WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
      AND EXTRACT(DAY FROM date_of_birth) = 9
    ORDER BY created_at ASC
    LIMIT 2
  );
*/

-- Step 5: Verify deletion (run this AFTER uncommenting and executing Step 4)
SELECT 
    'After Deletion - December 9 Videos:' as status,
    COUNT(*) as total_count
FROM public.approved_kids
WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
  AND EXTRACT(DAY FROM date_of_birth) = 9;
