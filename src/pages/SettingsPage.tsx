import { useState } from "react";
import { motion } from "framer-motion";
import { User, Shield, Bell, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";

export default function SettingsPage() {
  const { user } = useAuth();
  const [displayName, setDisplayName] = useState(user?.user_metadata?.full_name || "");

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
            <div><label className="text-xs text-muted-foreground block mb-1">Email</label>
              <Input value={user?.email || ""} disabled className="bg-secondary border-border opacity-60" /></div>
            <Button size="sm" className="gradient-primary text-foreground border-0">Save Changes</Button>
          </div>
        </div>

        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><CreditCard className="h-4 w-4 text-accent" /><span className="text-label">Subscription</span></div>
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-foreground">Free Plan</div>
              <div className="text-xs text-muted-foreground">Basic quests, resume analysis, career matches</div>
            </div>
            <Button size="sm" variant="outline" className="border-primary text-primary">Upgrade to Premium — ₹199/mo</Button>
          </div>
        </div>

        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><Bell className="h-4 w-4 text-rank-c" /><span className="text-label">Notifications</span></div>
          <div className="space-y-2 text-sm">
            {["Quest reminders", "Weekly progress reports", "New achievement alerts", "Leaderboard updates"].map(n => (
              <label key={n} className="flex items-center gap-3 text-foreground cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded border-border" />{n}
              </label>
            ))}
          </div>
        </div>

        <div className="surface-card-inset p-6">
          <div className="flex items-center gap-2 mb-4"><Shield className="h-4 w-4 text-destructive" /><span className="text-label">Security</span></div>
          <Button size="sm" variant="outline" className="border-border">Change Password</Button>
        </div>
      </div>
    </>
  );
}
