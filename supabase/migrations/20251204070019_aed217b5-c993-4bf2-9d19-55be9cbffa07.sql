-- Create enum for birthday themes
CREATE TYPE public.birthday_theme AS ENUM ('rockstar', 'princess', 'space', 'superhero', 'safari', 'unicorn');

-- Create enum for submission status
CREATE TYPE public.submission_status AS ENUM ('pending', 'approved', 'rejected');

-- Create submissions table (raw submissions)
CREATE TABLE public.submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kid_name TEXT NOT NULL,
  parent_email TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  photo_base64 TEXT NOT NULL,
  status submission_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create approved_kids table (CMS-managed)
CREATE TABLE public.approved_kids (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  submission_id UUID REFERENCES public.submissions(id) ON DELETE SET NULL,
  kid_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  photo_base64 TEXT NOT NULL,
  theme_id birthday_theme NOT NULL DEFAULT 'rockstar',
  approved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approved_kids ENABLE ROW LEVEL SECURITY;

-- Public can insert submissions
CREATE POLICY "Anyone can submit birthday requests"
ON public.submissions
FOR INSERT
WITH CHECK (true);

-- Public can view approved kids
CREATE POLICY "Anyone can view approved kids"
ON public.approved_kids
FOR SELECT
USING (true);

-- Enable realtime for approved_kids
ALTER PUBLICATION supabase_realtime ADD TABLE public.approved_kids;

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_submissions_updated_at
BEFORE UPDATE ON public.submissions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();