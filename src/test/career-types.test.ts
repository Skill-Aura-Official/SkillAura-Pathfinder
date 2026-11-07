import { describe, expect, it } from "vitest";
import { readUserSkills } from "../lib/career-types";

describe("skill relation normalization", () => {
  it("accepts object and array relation responses", () => {
    expect(readUserSkills([{ level: 3, skill: { name: "SQL", category: "Data" } }, { level: 2, skill: [{ name: "React" }] }]))
      .toEqual([{ level: 3, name: "SQL", category: "Data" }, { level: 2, name: "React", category: "General" }]);
  });
  it("handles absent and malformed rows without treating them as skills", () => {
    expect(readUserSkills(null)).toEqual([]);
    expect(readUserSkills([null, {}, { level: "5" }, { level: 1, skill: null }]))
      .toEqual([{ level: 1, name: "Unknown", category: "General" }]);
  });
});
