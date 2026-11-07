import { beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
const auth = vi.hoisted(() => ({ signInWithPassword: vi.fn(), signUp: vi.fn() }));
const notifications = vi.hoisted(() => ({ error: vi.fn(), success: vi.fn() }));
vi.mock("@/integrations/supabase/client", () => ({ supabase: { auth } }));
vi.mock("sonner", () => ({ toast: notifications }));
import Login from "../pages/Login";
import Signup from "../pages/Signup";

beforeEach(() => { cleanup(); vi.clearAllMocks(); });
function mount(page: React.ReactNode) {
  render(<MemoryRouter><Routes><Route path="/" element={page} /><Route path="/dashboard" element={<p>Dashboard destination</p>} /><Route path="/login" element={<p>Login destination</p>} /><Route path="/onboarding" element={<p>Onboarding destination</p>} /></Routes></MemoryRouter>);
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "qa@example.invalid" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "fixture-only" } });
}
describe("Supabase authentication screens", () => {
  it("navigates after Supabase establishes a login session", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { session: { user: { id: "synthetic" } } }, error: null });
    mount(<Login />); fireEvent.click(screen.getByRole("button", { name: "Login" }));
    expect(await screen.findByText("Dashboard destination")).toBeInTheDocument();
    expect(auth.signInWithPassword).toHaveBeenCalledWith({ email: "qa@example.invalid", password: "fixture-only" });
  });
  it("keeps failed logins on the form", async () => {
    auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: { message: "Invalid credentials" } });
    mount(<Login />); fireEvent.click(screen.getByRole("button", { name: "Login" }));
    await waitFor(() => expect(notifications.error).toHaveBeenCalledWith("Invalid credentials"));
    expect(screen.queryByText("Dashboard destination")).toBeNull();
  });
  it("requires email confirmation when signup provides no session", async () => {
    auth.signUp.mockResolvedValue({ data: { session: null }, error: null });
    mount(<Signup />); fireEvent.change(screen.getByLabelText("Username"), { target: { value: "synthetic" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Account" }));
    expect(await screen.findByText("Login destination")).toBeInTheDocument();
    expect(screen.queryByText("Onboarding destination")).toBeNull();
  });
});
