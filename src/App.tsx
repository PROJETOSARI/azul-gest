
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import EmployeesList from "./pages/EmployeesList";
import EmployeeForm from "./pages/EmployeeForm";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import { AuthProvider } from "./contexts/AuthContext";
import { EmployeeProvider } from "./contexts/EmployeeContext";
import { ProtocolProvider } from "./contexts/ProtocolContext";
import Profile from "./pages/Profile";
import ProtocolManagement from "./pages/ProtocolManagement";
import Ouvidoria from "./pages/Ouvidoria";
import PreparingData from "./pages/PreparingData";
import PWAInstallPrompt from "./components/PWAInstallPrompt";
import OfflineIndicator from "./components/OfflineIndicator";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <PWAInstallPrompt />
      <OfflineIndicator />
      <BrowserRouter>
        <AuthProvider>
          <EmployeeProvider>
            <ProtocolProvider>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Login />} />
                <Route path="/preparing" element={<PreparingData />} />
                
                {/* Dashboard Routes (Protected) */}
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Dashboard />} />
                  <Route path="employees" element={<EmployeesList />} />
                  <Route path="employees/new" element={<EmployeeForm />} />
                  <Route path="protocols" element={<ProtocolManagement />} />
                  <Route path="ouvidoria" element={<Ouvidoria />} />
                  <Route path="profile" element={<Profile />} />
                </Route>
                
                {/* Fallback routes */}
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" />} />
              </Routes>
            </ProtocolProvider>
          </EmployeeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
