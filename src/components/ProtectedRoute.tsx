import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [checking, setChecking] = useState(true);
  const [onboarded, setOnboarded] = useState<boolean>(true);

  useEffect(() => {
    if (!user) { setChecking(false); return; }
    supabase
      .from("career_profiles")
      .select("onboarding_completed")
      .eq("user_id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setOnboarded(Boolean(data?.onboarding_completed));
        setChecking(false);
      });
  }, [user]);

  if (loading || (user && checking)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-primary animate-pulse font-mono">[ INITIALIZING SYSTEM... ]</div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  // Force onboarding for new users
  if (!onboarded && location.pathname !== "/onboarding") {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
}
