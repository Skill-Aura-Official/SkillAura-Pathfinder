import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Onboarding from "./pages/Onboarding";
import DashboardHome from "./pages/DashboardHome";
import QuestLog from "./pages/QuestLog";
import CareerGPSPage from "./pages/CareerGPSPage";
import SkillTreePage from "./pages/SkillTreePage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AchievementsPage from "./pages/AchievementsPage";
import LeaderboardPage from "./pages/LeaderboardPage";
import AIMentor from "./pages/AIMentor";
import SettingsPage from "./pages/SettingsPage";
import AdminPanel from "./pages/AdminPanel";
import RecruiterPanel from "./pages/RecruiterPanel";
import PricingPage from "./pages/PricingPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardHome />} />
              <Route path="/quests" element={<QuestLog />} />
              <Route path="/career-gps" element={<CareerGPSPage />} />
              <Route path="/skill-tree" element={<SkillTreePage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/leaderboard" element={<LeaderboardPage />} />
              <Route path="/ai-mentor" element={<AIMentor />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="/admin" element={<AdminPanel />} />
              <Route path="/recruiter" element={<RecruiterPanel />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
