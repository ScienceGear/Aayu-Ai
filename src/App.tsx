import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AppProvider, useApp } from "@/contexts/AppContext";

import Landing from "@/pages/Landing";
import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";

// Elder Pages
import ElderDashboard from "@/pages/elder/Dashboard";
import AayuAssistant from "@/pages/elder/Assistant";
import Medicines from "@/pages/elder/Medicines";
import VirtualGarden from "@/pages/elder/Garden";
import Emergency from "@/pages/elder/Emergency";
import Settings from "@/pages/elder/Settings";
import Exercise from "@/pages/elder/Exercise";
import ElderCaregivers from "@/pages/elder/Caregivers"; // Renamed to avoid conflict
import ElderReports from "@/pages/elder/Reports";

// Caregiver Pages
import CaregiverDashboard from "@/pages/caregiver/Dashboard";
import CaregiverSettings from "@/pages/caregiver/Settings";

// Organization Pages
import OrganizationDashboard from "@/pages/organization/Dashboard";
import OrganizationCaregivers from "@/pages/organization/Caregivers";
import OrganizationSettings from "@/pages/organization/Settings";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function RoleBasedRedirect() {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;

  switch (user.role) {
    case 'caregiver':
      return <Navigate to="/caregiver" replace />;
    case 'organization':
      return <Navigate to="/organization" replace />;
    default:
      return <Navigate to="/elder" replace />;
  }
}

function AppRoutes() {
  const { isAuthenticated } = useApp();

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <RoleBasedRedirect /> : <Landing />} />
      <Route path="/login" element={isAuthenticated ? <RoleBasedRedirect /> : <Login />} />
      <Route path="/signup" element={isAuthenticated ? <RoleBasedRedirect /> : <Signup />} />

      {/* Elder Routes */}
      <Route path="/elder" element={<ProtectedRoute><ElderDashboard /></ProtectedRoute>} />
      <Route path="/elder/assistant" element={<ProtectedRoute><AayuAssistant /></ProtectedRoute>} />
      <Route path="/elder/medicines" element={<ProtectedRoute><Medicines /></ProtectedRoute>} />
      <Route path="/elder/garden" element={<ProtectedRoute><VirtualGarden /></ProtectedRoute>} />
      <Route path="/elder/emergency" element={<ProtectedRoute><Emergency /></ProtectedRoute>} />
      <Route path="/elder/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/elder/reports" element={<ProtectedRoute><ElderReports /></ProtectedRoute>} />
      <Route path="/elder/caregivers" element={<ProtectedRoute><ElderCaregivers /></ProtectedRoute>} />
      <Route path="/elder/exercise" element={<ProtectedRoute><Exercise /></ProtectedRoute>} />

      {/* Caregiver Routes */}
      <Route path="/caregiver" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
      <Route path="/caregiver/elders" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
      <Route path="/caregiver/reports" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
      <Route path="/caregiver/messages" element={<ProtectedRoute><CaregiverDashboard /></ProtectedRoute>} />
      <Route path="/caregiver/settings" element={<ProtectedRoute><CaregiverSettings /></ProtectedRoute>} />

      {/* Organization Routes */}
      <Route path="/organization" element={<ProtectedRoute><OrganizationDashboard /></ProtectedRoute>} />
      <Route path="/organization/caregivers" element={<ProtectedRoute><OrganizationCaregivers /></ProtectedRoute>} />
      <Route path="/organization/alerts" element={<ProtectedRoute><OrganizationDashboard /></ProtectedRoute>} />
      <Route path="/organization/settings" element={<ProtectedRoute><OrganizationSettings /></ProtectedRoute>} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AppProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TooltipProvider>
    </AppProvider>
  </QueryClientProvider>
);

export default App;
