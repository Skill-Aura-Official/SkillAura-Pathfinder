
-- Fix: Replace SECURITY DEFINER view with SECURITY INVOKER
DROP VIEW IF EXISTS public.leaderboard;
CREATE VIEW public.leaderboard WITH (security_invoker = on) AS
SELECT 
  p.display_name,
  cp.level,
  cp.current_xp,
  cp.rank,
  cp.career_class,
  cp.user_id
FROM public.career_profiles cp
JOIN public.profiles p ON p.user_id = cp.user_id
ORDER BY cp.level DESC, cp.current_xp DESC;
