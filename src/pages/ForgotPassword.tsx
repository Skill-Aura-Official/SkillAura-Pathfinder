import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/integrations/api/client";
import { toast } from "sonner";
import { Loader2, Mail } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
    if (!email) { toast.error("Enter your email"); return; }
    setLoading(true);
    try {
      const data = await api.post("/auth/forgot-password", { email });
      if (data.error) { toast.error(data.error); return; }
      setSent(true);
      toast.success("Reset link sent to your email!");
    } catch {
      toast.error("Failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="surface-card-inset p-8">
          <div className="text-center mb-8">
            <Mail className="h-10 w-10 text-primary mx-auto mb-3" strokeWidth={1.5} />
            <h1 className="text-2xl font-bold text-foreground">Forgot Password</h1>
            <p className="text-sm text-muted-foreground mt-1">We'll send you a reset link</p>
          </div>

          {sent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-foreground">Check your email for the reset link.</p>
              <Link to="/login" className="text-primary hover:underline text-sm">Back to Login</Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Email</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="bg-secondary border-border"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                />
              </div>
              <Button className="w-full gradient-primary text-foreground border-0" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                <Link to="/login" className="text-primary hover:underline">Back to Login</Link>
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}