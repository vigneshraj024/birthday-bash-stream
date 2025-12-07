-- Allow reading submissions (for admin panel)
CREATE POLICY "Anyone can view submissions"
ON public.submissions
FOR SELECT
USING (true);

-- Allow updating submissions (for approve/reject)
CREATE POLICY "Anyone can update submissions"
ON public.submissions
FOR UPDATE
USING (true);

-- Allow inserting into approved_kids
CREATE POLICY "Anyone can insert approved kids"
ON public.approved_kids
FOR INSERT
WITH CHECK (true);