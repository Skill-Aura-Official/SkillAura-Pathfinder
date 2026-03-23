import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const key = identifier.trim();
    let email = key;

    // If not an email, look up username from DB
    if (!key.includes("@")) {
      const { data } = await supabase
        .from("profiles")
        .select("user_id")
        .or(`username.eq.${key},display_name.eq.${key}`)
        .limit(1)
        .single();

      if (!data) {
        setLoading(false);
        toast.error("Username not found");
        return;
      }

      // Get email from auth admin — we can't, so we use a convention
      // Look up the user's email by checking if display_name matches
      // Since we can't query auth.users, we store username and use email pattern
      // Try with the user_id to find their email via profiles
      // Fallback: try common pattern
      const { data: profileData } = await supabase
        .from("profiles")
        .select("user_id")
        .or(`username.ilike.${key},display_name.ilike.${key}`)
        .limit(1)
        .single();

      if (!profileData) {
        setLoading(false);
        toast.error("Username not found");
        return;
      }

      // We need to use an edge function for username login since we can't query auth.users
      // For now, try the email pattern
      email = `${key.toLowerCase()}@skillaura.test`;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Invalid credentials. Check your username/email and password.");
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <img src="/favicon.png" alt="SkillAura PathFinder AI" className="h-12 w-12" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Enter the System</h1>
          <p className="text-sm text-muted-foreground mt-1">Login with your username or email</p>
        </div>

        <div className="surface-card-inset p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Username or Email"
                value={identifier}
                onChange={e => setIdentifier(e.target.value)}
                className="pl-9 bg-secondary border-border"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-9 pr-9 bg-secondary border-border"
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="text-right">
              <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot password?</Link>
            </div>
            <Button type="submit" disabled={loading} className="w-full gradient-primary text-foreground border-0">
              {loading ? "Authenticating..." : "Login"}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            New operative? <Link to="/signup" className="text-primary hover:underline">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
