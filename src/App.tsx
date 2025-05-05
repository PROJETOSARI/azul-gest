
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
import Profile from "./pages/Profile";
import Protocols from "./pages/Protocols";
import SalarySimulator from "./pages/SalarySimulator";
import Licitacoes from "./pages/Licitacoes";
import Compras from "./pages/Compras";
import PreparingData from "./pages/PreparingData";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <EmployeeProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Login />} />
              <Route path="/preparing" element={<PreparingData />} />
              
              {/* Dashboard Routes (Protected) */}
              <Route path="/dashboard" element={<DashboardLayout />}>
                <Route index element={<Dashboard />} />
                <Route path="employees" element={<EmployeesList />} />
                <Route path="employees/new" element={<EmployeeForm />} />
                <Route path="protocols" element={<Protocols />} />
                <Route path="licitacoes" element={<Licitacoes />} />
                <Route path="compras" element={<Compras />} />
                <Route path="profile" element={<Profile />} />
                <Route path="salary-simulator" element={<SalarySimulator />} />
              </Route>
              
              {/* Fallback routes */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" />} />
            </Routes>
          </EmployeeProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
