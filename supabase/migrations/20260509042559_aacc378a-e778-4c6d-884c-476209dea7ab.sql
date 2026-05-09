-- Fix #1: complete_quest type bug (quests.id is uuid, not int)
DROP FUNCTION IF EXISTS public.complete_quest(uuid, integer);
CREATE OR REPLACE FUNCTION public.complete_quest(p_user_id uuid, p_quest_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  xp_gain INT;
  skill TEXT;
  skill_id_val UUID;
BEGIN
  SELECT xp_reward, skill_reward INTO xp_gain, skill FROM quests WHERE id = p_quest_id;
  UPDATE user_quests SET status = 'completed', completed_at = now()
    WHERE user_id = p_user_id AND quest_id = p_quest_id;
  UPDATE career_profiles SET current_xp = COALESCE(current_xp, 0) + COALESCE(xp_gain, 0)
    WHERE user_id = p_user_id;
  IF skill IS NOT NULL THEN
    SELECT id INTO skill_id_val FROM skills WHERE name = skill LIMIT 1;
    IF skill_id_val IS NOT NULL THEN
      UPDATE user_skills SET level = COALESCE(level,1) + 1
        WHERE user_id = p_user_id AND skill_id = skill_id_val;
    END IF;
  END IF;
  PERFORM public.update_level(p_user_id);
END;
$$;

-- Fix #2: case-insensitive unique constraint on username
CREATE UNIQUE INDEX IF NOT EXISTS profiles_username_unique_ci
  ON public.profiles (lower(username)) WHERE username IS NOT NULL;

-- Fix #3: harden handle_new_user against username collision
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  desired_username TEXT;
  final_username TEXT;
  attempt INT := 0;
BEGIN
  desired_username := NULLIF(NEW.raw_user_meta_data->>'username', '');
  final_username := desired_username;

  -- If username taken, suffix _1, _2... until unique (max 20 tries)
  WHILE final_username IS NOT NULL AND attempt < 20
        AND EXISTS (SELECT 1 FROM public.profiles WHERE lower(username) = lower(final_username)) LOOP
    attempt := attempt + 1;
    final_username := desired_username || '_' || attempt::text;
  END LOOP;

  INSERT INTO public.profiles (user_id, display_name, username)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    final_username
  );

  INSERT INTO public.career_profiles (user_id) VALUES (NEW.id);
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'player');
  INSERT INTO public.subscriptions (user_id, plan) VALUES (NEW.id, 'free');

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Never block signup
  RAISE WARNING 'handle_new_user error: %', SQLERRM;
  RETURN NEW;
END;
$$;

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Fix #4: track onboarding completion
ALTER TABLE public.career_profiles
  ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN NOT NULL DEFAULT false;

-- Fix #5: allow users to delete their own data (GDPR)
CREATE POLICY "Users can delete own career profile" ON public.career_profiles
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own chat messages" ON public.chat_messages
  FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own profile" ON public.profiles
  FOR DELETE USING (auth.uid() = user_id);