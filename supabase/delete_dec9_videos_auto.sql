-- AUTOMATED DELETION SCRIPT FOR DECEMBER 9 VIDEOS
-- This will IMMEDIATELY delete 30 videos, keeping only the first 2

-- Execute this entire script to delete excess videos
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
    
    RAISE NOTICE 'Deleted: % videos', deleted_count;
    RAISE NOTICE 'Remaining: % videos for December 9', remaining_count;
    
    -- Show which videos were kept
    RAISE NOTICE '--- KEPT VIDEOS ---';
    FOR i IN (
        SELECT kid_name, date_of_birth, created_at
        FROM public.approved_kids
        WHERE EXTRACT(MONTH FROM date_of_birth) = 12 
          AND EXTRACT(DAY FROM date_of_birth) = 9
        ORDER BY created_at ASC
    ) LOOP
        RAISE NOTICE 'Kept: % (Birthday: %, Submitted: %)', i.kid_name, i.date_of_birth, i.created_at;
    END LOOP;
END $$;
