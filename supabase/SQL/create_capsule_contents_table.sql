
-- Create capsule_contents table to track uploaded files
CREATE TABLE IF NOT EXISTS public.capsule_contents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  capsule_id UUID NOT NULL REFERENCES time_capsules(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Add RLS policies for capsule_contents
ALTER TABLE public.capsule_contents ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own capsule contents
CREATE POLICY "Users can view their own capsule contents"
ON public.capsule_contents
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.time_capsules
    WHERE id = capsule_id
  )
);

-- Allow users to insert their own capsule contents
CREATE POLICY "Users can insert their own capsule contents"
ON public.capsule_contents
FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT user_id FROM public.time_capsules
    WHERE id = capsule_id
  )
);

-- Allow users to delete their own capsule contents
CREATE POLICY "Users can delete their own capsule contents"
ON public.capsule_contents
FOR DELETE
USING (
  auth.uid() IN (
    SELECT user_id FROM public.time_capsules
    WHERE id = capsule_id
  )
);
