import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users, Search, Plus, Building2, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Tab = "company" | "jobs" | "candidates";

const mockJobs = [
  { id: "1", title: "Junior Data Scientist", location: "Remote", salary: "₹6-8L", minRank: "C", applicants: 24, active: true },
  { id: "2", title: "ML Engineer", location: "Bangalore", salary: "₹12-18L", minRank: "B", applicants: 12, active: true },
];

const mockCandidates = [
  { name: "Alice Johnson", level: 15, rank: "C", class: "Data Scientist", skills: ["Python", "ML", "SQL"], readiness: 78 },
  { name: "Bob Lee", level: 22, rank: "B", class: "AI Engineer", skills: ["Python", "Deep Learning", "PyTorch"], readiness: 85 },
  { name: "Carol Park", level: 10, rank: "D", class: "Software Engineer", skills: ["React", "Node.js", "SQL"], readiness: 62 },
];

const rankColor: Record<string, string> = { S: "text-rank-s", A: "text-rank-a", B: "text-rank-b", C: "text-rank-c", D: "text-rank-d", E: "text-rank-e" };

export default function RecruiterPanel() {
  const [tab, setTab] = useState<Tab>("jobs");
  const [skillFilter, setSkillFilter] = useState("");

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
            <Input placeholder="Company Name" className="bg-secondary border-border" />
            <Input placeholder="Industry" className="bg-secondary border-border" />
            <Input placeholder="Website" className="bg-secondary border-border" />
            <textarea placeholder="Description" className="w-full rounded-md border border-border bg-secondary px-3 py-2 text-sm text-foreground resize-none h-24" />
            <Button className="gradient-primary text-foreground border-0">Save Profile</Button>
          </div>
        </div>
      )}

      {tab === "jobs" && (
        <div>
          <div className="flex justify-end mb-4"><Button size="sm" className="gradient-primary text-foreground border-0"><Plus className="h-3 w-3 mr-1" />Post Job</Button></div>
          <div className="grid md:grid-cols-2 gap-4">
            {mockJobs.map(j => (
              <div key={j.id} className="surface-card-inset p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-sm font-semibold text-foreground">{j.title}</h4>
                  <span className={`text-xs font-mono font-bold ${rankColor[j.minRank]}`}>Min {j.minRank}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{j.location}</span>
                  <span>{j.salary}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{j.applicants} applicants</span>
                  <Button size="sm" variant="outline" className="border-border h-7 text-xs">Manage</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "candidates" && (
        <div>
          <div className="relative mb-4">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Filter by skill (e.g. Python, ML)..." value={skillFilter} onChange={e => setSkillFilter(e.target.value)} className="pl-9 bg-secondary border-border" />
          </div>
          <div className="surface-card-inset divide-y divide-border/30">
            {mockCandidates.filter(c => !skillFilter || c.skills.some(s => s.toLowerCase().includes(skillFilter.toLowerCase()))).map(c => (
              <div key={c.name} className="flex items-center justify-between px-4 py-3">
                <div>
                  <div className="text-sm font-medium text-foreground">{c.name}</div>
                  <div className="flex gap-1 mt-1">{c.skills.map(s => <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">{s}</span>)}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-muted-foreground">Lv{c.level}</span>
                  <span className={`text-sm font-black font-mono ${rankColor[c.rank]}`}>{c.rank}</span>
                  <span className="text-xs font-mono text-rank-c">{c.readiness}%</span>
                  <Button size="sm" variant="outline" className="border-border h-7 text-xs">View</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
