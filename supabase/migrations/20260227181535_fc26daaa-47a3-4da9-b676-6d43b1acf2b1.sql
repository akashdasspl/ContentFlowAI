
-- Fix RLS policies: drop restrictive and recreate as permissive

-- profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- content_generations
DROP POLICY IF EXISTS "Users can view their own content" ON public.content_generations;
DROP POLICY IF EXISTS "Users can insert their own content" ON public.content_generations;
DROP POLICY IF EXISTS "Users can delete their own content" ON public.content_generations;

CREATE POLICY "Users can view their own content" ON public.content_generations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own content" ON public.content_generations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own content" ON public.content_generations FOR DELETE USING (auth.uid() = user_id);
