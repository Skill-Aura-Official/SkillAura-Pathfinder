DROP POLICY IF EXISTS "Users can manage own subscription" ON public.subscriptions;
-- Keep existing SELECT policy "Users can view own subscription"
-- No INSERT/UPDATE/DELETE policies => only service role (e.g., edge functions) can mutate