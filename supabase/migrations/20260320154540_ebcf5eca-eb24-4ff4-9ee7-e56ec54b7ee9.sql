CREATE OR REPLACE FUNCTION public.complete_quest(p_user_id uuid, p_quest_id integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  xp_gain INT;
  skill TEXT;
  skill_id_val UUID;
BEGIN
  SELECT xp_reward, skill_reward INTO xp_gain, skill FROM quests WHERE id = p_quest_id::text::uuid;
  UPDATE user_quests SET status = 'completed', completed_at = now() WHERE user_id = p_user_id AND quest_id = p_quest_id::text::uuid;
  UPDATE career_profiles SET current_xp = COALESCE(current_xp, 0) + xp_gain WHERE user_id = p_user_id;
  SELECT id INTO skill_id_val FROM skills WHERE name = skill LIMIT 1;
  IF skill_id_val IS NOT NULL THEN
    UPDATE user_skills SET level = COALESCE(level,1) + 1 WHERE user_id = p_user_id AND skill_id = skill_id_val;
  END IF;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_level(p_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
  UPDATE career_profiles SET 
    level = FLOOR(current_xp / 200) + 1,
    rank = CASE
      WHEN current_xp >= 2000 THEN 'S'
      WHEN current_xp >= 1500 THEN 'A'
      WHEN current_xp >= 1000 THEN 'B'
      WHEN current_xp >= 500 THEN 'C'
      WHEN current_xp >= 200 THEN 'D'
      ELSE 'E'
    END
  WHERE user_id = p_user_id;
END;
$function$;