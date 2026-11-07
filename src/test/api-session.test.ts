import { expect, it, vi } from "vitest";
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth: { getSession: vi.fn().mockResolvedValue({ data: { session: { access_token: "synthetic-test-token" } } }) } } }));
import { api } from "../integrations/api/client";
it("uses the active Supabase session for the separate API", async () => {
  const fetchMock = vi.fn().mockResolvedValue({ json: async () => ({ ok: true }) });
  vi.stubGlobal("fetch", fetchMock);
  try {
    localStorage.setItem("skillaura_token", "stale-test-token");
    await api.get("/profile/career");
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe("Bearer synthetic-test-token");
  } finally { localStorage.removeItem("skillaura_token"); vi.unstubAllGlobals(); }
});
