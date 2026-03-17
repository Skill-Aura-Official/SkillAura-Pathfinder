import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Lock, Eye, EyeOff, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const USERNAME_MAP: Record<string, string> = {
  cazador_op: "cazador_op@skillaura.test",
  blacklord: "blacklord@skillaura.test",
  hunter: "hunter@skillaura.test",
};

export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const key = username.trim().toLowerCase();
    const email = USERNAME_MAP[key] || (key.includes("@") ? key : `${key}@skillaura.test`);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error("Invalid username or password");
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
          <p className="text-sm text-muted-foreground mt-1">Login with your username to continue</p>
        </div>

        <div className="surface-card-inset p-6 space-y-4">
          <form onSubmit={handleLogin} className="space-y-3">
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Username (e.g. Cazador_Op)"
                value={username}
                onChange={e => setUsername(e.target.value)}
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

          {/* Quick login hints */}
          <div className="border-t border-border/50 pt-4">
            <div className="text-label mb-2 text-center">Test Accounts</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { name: "Cazador_Op", role: "Player", color: "text-rank-c" },
                { name: "Blacklord", role: "Admin", color: "text-rank-a" },
                { name: "Hunter", role: "Recruiter", color: "text-rank-d" },
              ].map((u) => (
                <button
                  key={u.name}
                  type="button"
                  onClick={() => { setUsername(u.name); setPassword("#Tbh0fficial"); }}
                  className="surface-interactive p-2 text-center hover:bg-secondary/80"
                >
                  <div className={`text-xs font-bold font-mono ${u.color}`}>{u.name}</div>
                  <div className="text-[10px] text-muted-foreground">{u.role}</div>
                </button>
              ))}
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            New operative? <Link to="/signup" className="text-primary hover:underline">Create account</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
