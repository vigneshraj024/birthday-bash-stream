-- COMPLETE DELETION SCRIPT FOR DECEMBER 9 VIDEOS
-- This deletes from the database
-- You ALSO need to clear localStorage (see instructions below)

-- Step 1: Delete from approved_kids table (keep first 2)
DO $$
DECLARE
    deleted_count INTEGER;
    remaining_count INTEGER;
BEGIN
    -- Show before count
    SELECT COUNT(*) INTO remaining_count
    FROM public.approved_kids
    WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
      AND EXTRACT(DAY FROM date_of_birth) = 9;
    
    RAISE NOTICE 'Before deletion: % videos for December 9', remaining_count;
    
    -- Perform deletion (keep first 2, delete rest)
    WITH videos_to_keep AS (
        SELECT id
        FROM public.approved_kids
        WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
          AND EXTRACT(DAY FROM date_of_birth) = 9
        ORDER BY created_at ASC
        LIMIT 2
    )
    DELETE FROM public.approved_kids
    WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
      AND EXTRACT(DAY FROM date_of_birth) = 9
      AND id NOT IN (SELECT id FROM videos_to_keep);
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    
    -- Show after count
    SELECT COUNT(*) INTO remaining_count
    FROM public.approved_kids
    WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
      AND EXTRACT(DAY FROM date_of_birth) = 9;
    
    RAISE NOTICE 'Deleted: % videos from database', deleted_count;
    RAISE NOTICE 'Remaining: % videos in database for December 9', remaining_count;
END $$;

-- ⚠️ IMPORTANT: After running this SQL script, you MUST also clear localStorage!
-- Open your browser console (F12) and run:
-- localStorage.removeItem('local_generated_birthdays');
-- Then refresh the page.
