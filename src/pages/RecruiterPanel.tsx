import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Search, Plus, Building2, MapPin, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Tab = "company" | "jobs" | "candidates";

interface CompanyRow { id: string; name: string; industry: string | null; website: string | null; description: string | null; }
interface JobRow { id: string; title: string; location: string | null; salary_range: string | null; min_rank: string | null; is_active: boolean | null; company_id: string; }
interface CandidateRow { user_id: string; display_name: string | null; level: number | null; rank: string | null; career_class: string | null; current_xp: number | null; }

const rankColor: Record<string, string> = { S: "text-rank-s", A: "text-rank-a", B: "text-rank-b", C: "text-rank-c", D: "text-rank-d", E: "text-rank-e" };

export default function RecruiterPanel() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("jobs");
  const [skillFilter, setSkillFilter] = useState("");
  const [company, setCompany] = useState<CompanyRow | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [candidates, setCandidates] = useState<CandidateRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [companyForm, setCompanyForm] = useState({ name: "", industry: "", website: "", description: "" });

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("companies").select("*").eq("recruiter_id", user.id).limit(1).single(),
      supabase.from("leaderboard").select("*").order("current_xp", { ascending: false }).limit(50),
    ]).then(([companyRes, candidatesRes]) => {
      if (companyRes.data) {
        setCompany(companyRes.data as CompanyRow);
        setCompanyForm({
          name: companyRes.data.name || "",
          industry: companyRes.data.industry || "",
          website: companyRes.data.website || "",
          description: companyRes.data.description || "",
        });
        // Fetch jobs for this company
        supabase.from("jobs").select("*").eq("company_id", companyRes.data.id).then(({ data }) => {
          if (data) setJobs(data as JobRow[]);
        });
      }
      if (candidatesRes.data) setCandidates(candidatesRes.data as CandidateRow[]);
      setLoading(false);
    });
  }, [user]);

  const saveCompany = async () => {
    if (!user) return;
    if (company) {
      await supabase.from("companies").update(companyForm).eq("id", company.id);
    } else {
      const { data } = await supabase.from("companies").insert({ ...companyForm, recruiter_id: user.id }).select().single();
      if (data) setCompany(data as CompanyRow);
    }
    toast.success("Company profile saved!");
  };

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Recruiter Panel</h1>
        <p className="text-sm text-muted-foreground">Manage jobs and find skilled candidates.</p>
      </motion.div>

      <div className="flex gap-2 mb-6">
        {([["company", Building2, "Company"], ["jobs", Briefcase, "Jobs"], ["candidates", Users, "Candidates"]] as [Tab, typeof Briefcase, string][]).map(([key, Icon, label]) => (
          <button key={key} onClick={() => setTab(key)} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === key ? "bg-primary/20 text-primary" : "bg-secondary text-muted-foreground hover:text-foreground"}`}>
            <Icon className="h-3.5 w-3.5" />{label}
          </button>
        ))}
      </div>

      {tab === "company" && (
        <div className="surface-card-inset p-6 max-w-lg">
          <div className="text-label mb-4">Company Profile</div>
          <div className="space-y-3">
            <Input placeholder="Company Name" value={companyForm.name} onChange={e => setCompanyForm(p => ({ ...p, name: e.target.value }))} className="bg-secondary border-border" />
            <Input placeholder="Industry" value={companyForm.industry} onChange={e => setCompanyForm(p => ({ ...p, industry: e.target.value }))} className="bg-secondary border-border" />
            <Input placeholder="Website" value={companyForm.website} onChange={e => setCompanyForm(p => ({ ...p, website: e.target.value }))} className="bg-secondary border-border" />
            <textarea placeholder="Description" value={companyForm.description} onChange={e => setCompanyForm(p => ({ ...p, description: e.target.value }))} className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground resize-none h-24" />
            <Button onClick={saveCompany} className="gradient-primary text-foreground border-0">Save Profile</Button>
          </div>
        </div>
      )}

      {tab === "jobs" && (
        <div>
          {jobs.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-4">
              {jobs.map(j => (
                <div key={j.id} className="surface-card-inset p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-sm font-semibold text-foreground">{j.title}</h4>
                    <span className={`text-xs font-mono font-bold ${rankColor[j.min_rank || "E"]}`}>Min {j.min_rank || "E"}</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    {j.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>}
                    {j.salary_range && <span>{j.salary_range}</span>}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${j.is_active ? "bg-rank-c/10 text-rank-c" : "bg-destructive/10 text-destructive"}`}>{j.is_active ? "Active" : "Inactive"}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="surface-card-inset p-12 text-center">
              <Briefcase className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">{company ? "No jobs posted yet." : "Create a company profile first to post jobs."}</p>
            </div>
          )}
        </div>
      )}

      {tab === "candidates" && (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter by name..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="pl-9 bg-secondary border-border" />
          </div>
          <div className="surface-card-inset divide-y divide-border/30">
            {candidates.filter(c => !skillFilter || (c.display_name || "").toLowerCase().includes(skillFilter.toLowerCase())).map(c => (
              <div key={c.user_id} className="flex items-center justify-between px-4 py-3">
                <div className="text-sm font-medium text-foreground">{c.display_name || "Unknown"}</div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">Lv{c.level || 1}</span>
                  <span className={`text-sm font-black font-mono ${rankColor[c.rank || "E"]}`}>{c.rank || "E"}</span>
                  <span className="text-xs font-mono text-accent">{(c.current_xp || 0).toLocaleString()} XP</span>
                </div>
              </div>
            ))}
            {candidates.length === 0 && <div className="p-6 text-center text-sm text-muted-foreground">No candidates in the system yet.</div>}
          </div>
        </div>
      )}
    </>
  );
}
