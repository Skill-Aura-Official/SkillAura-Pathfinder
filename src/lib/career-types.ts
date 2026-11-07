export interface CareerStats {
  stat_technical?: number;
  stat_logic?: number;
  stat_creativity?: number;
  stat_communication?: number;
  stat_leadership?: number;
  stat_problem_solving?: number;
  current_xp?: number;
  job_readiness?: number;
}

export interface ResumeAnalysis extends CareerStats {
  strengths?: string[];
  experience_level?: string;
  career_paths?: string[];
  suggested_class?: string;
  salary_estimate?: string;
  summary?: string;
  skills?: string[];
}

export function readUserSkills(value: unknown): { level: number; name: string; category: string }[] {
  if (!Array.isArray(value)) return [];
  return value.flatMap((row: unknown) => {
    if (typeof row !== "object" || row === null || !("level" in row) || typeof row.level !== "number") return [];
    const joined = "skill" in row ? row.skill : null;
    const skill: unknown = Array.isArray(joined) ? joined[0] : joined;
    return [{
      level: row.level,
      name: typeof skill === "object" && skill !== null && "name" in skill && typeof skill.name === "string" ? skill.name : "Unknown",
      category: typeof skill === "object" && skill !== null && "category" in skill && typeof skill.category === "string" ? skill.category : "General",
    }];
  });
}
