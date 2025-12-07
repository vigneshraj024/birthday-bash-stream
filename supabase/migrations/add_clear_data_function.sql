-- Create a function to clear all birthday data
-- This function will bypass RLS policies using SECURITY DEFINER

CREATE OR REPLACE FUNCTION clear_all_birthday_data()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  approved_count integer;
  submissions_count integer;
BEGIN
  -- Delete all approved kids
  DELETE FROM public.approved_kids;
  GET DIAGNOSTICS approved_count = ROW_COUNT;
  
  -- Delete all submissions
  DELETE FROM public.submissions;
  GET DIAGNOSTICS submissions_count = ROW_COUNT;
  
  -- Return the counts
  RETURN json_build_object(
    'success', true,
    'approved_deleted', approved_count,
    'submissions_deleted', submissions_count
  );
END;
$$;

-- Grant execute permission to anon users
GRANT EXECUTE ON FUNCTION clear_all_birthday_data() TO anon;
GRANT EXECUTE ON FUNCTION clear_all_birthday_data() TO authenticated;
