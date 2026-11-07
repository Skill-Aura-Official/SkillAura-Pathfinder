import { describe, expect, it } from "vitest";
import { readSupabaseConfig } from "../integrations/supabase/config";

describe("Supabase deployment configuration", () => {
  const key = "unit-test-publishable-key";

  it("requires both deployment values", () => {
    expect(readSupabaseConfig({ VITE_SUPABASE_PUBLISHABLE_KEY: key })).toBeNull();
  });

  it("accepts HTTPS and explicit local HTTP endpoints", () => {
    for (const url of ["https://example.invalid", "http://127.0.0.1:54321"]) {
      expect(readSupabaseConfig({ VITE_SUPABASE_URL: `${url}/`, VITE_SUPABASE_PUBLISHABLE_KEY: key }))
        .toEqual({ url, key });
    }
  });

  it("rejects remote plaintext, embedded credentials and malformed URLs", () => {
    for (const url of ["http://example.invalid", "https://user@example.invalid", "invalid"]) {
      expect(readSupabaseConfig({ VITE_SUPABASE_URL: url, VITE_SUPABASE_PUBLISHABLE_KEY: key })).toBeNull();
    }
  });
});
