import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { User, Shield, CreditCard, Loader2, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const themeOptions = [
  { id: "ocean", name: "Ocean 🌊", color: "from-cyan-500 to-blue-600" },
  { id: "windy", name: "Windy 🌪️", color: "from-emerald-400 to-teal-600" },
  { id: "wrench", name: "Wrench ⚙️", color: "from-zinc-400 to-slate-600" },
  { id: "bloodmoon", name: "Blood Moon 🌕", color: "from-red-500 to-rose-800" },
];

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [theme, setTheme] = useState("ocean");
  const [plan, setPlan] = useState("free");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("profiles").select("display_name, bio, theme").eq("user_id", user.id).single(),
      supabase.from("subscriptions").select("plan").eq("user_id", user.id).single(),
    ]).then(([profileRes, subRes]) => {
      if (profileRes.data) {
        setDisplayName(profileRes.data.display_name || "");
        setBio(profileRes.data.bio || "");
        setTheme((profileRes.data as any).theme || "ocean");
      }
      if (subRes.data) setPlan(subRes.data.plan);
      setLoading(false);
    });
  }, [user]);

  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    await supabase.from("profiles").update({ display_name: displayName, bio, theme } as any).eq("user_id", user.id);
    document.body.setAttribute("data-theme", theme);
    setSaving(false);
    toast.success("Profile updated!");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your account and preferences.</p>
      </motion.div>

      <div className="max-w-2xl space-y-6">
        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><User className="h-4 w-4 text-primary" /><span className="text-label">Profile</span></div>
          <div className="space-y-3">
            <div><label className="text-xs text-muted-foreground block mb-1">Display Name</label>
              <Input value={displayName} onChange={e => setDisplayName(e.target.value)} className="bg-secondary border-border" /></div>
            <div><label className="text-xs text-muted-foreground block mb-1">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground resize-none h-20" placeholder="Tell us about yourself..." /></div>
            <div><label className="text-xs text-muted-foreground block mb-1">Email</label>
              <Input value={user?.email || ""} disabled className="bg-secondary border-border opacity-60" /></div>
          </div>
        </div>

        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><Palette className="h-4 w-4 text-accent" /><span className="text-label">Theme</span></div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {themeOptions.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`relative overflow-hidden surface-interactive p-3 text-center transition-all ${theme === t.id ? "ring-2 ring-primary" : ""}`}>
                <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${t.color}`} />
                <span className="relative text-sm font-medium text-foreground">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button size="sm" onClick={saveProfile} disabled={saving} className="gradient-primary text-foreground border-0">{saving ? "Saving..." : "Save Changes"}</Button>

        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><CreditCard className="h-4 w-4 text-accent" /><span className="text-label">Subscription</span></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground capitalize">{plan} Plan</div>
              <div className="text-xs text-muted-foreground">
                {plan === "free" ? "Basic quests, resume analysis, career matches" : "Full access to all features"}
              </div>
            </div>
            {plan === "free" && <Button size="sm" variant="outline" className="border-primary text-primary">Upgrade</Button>}
          </div>
        </div>

        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><Shield className="h-4 w-4 text-destructive" /><span className="text-label">Security</span></div>
          <p className="text-xs text-muted-foreground mb-3">Manage your authentication settings.</p>
          <Button size="sm" variant="outline" className="border-border">Change Password</Button>
        </div>
      </div>
    </>
  );
}
