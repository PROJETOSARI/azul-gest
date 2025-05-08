
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
import { InventoryProvider } from "./contexts/InventoryContext";
import { ThemeProvider } from "./contexts/ThemeContext";
import Profile from "./pages/Profile";
import Protocols from "./pages/Protocols";
import SalarySimulator from "./pages/SalarySimulator";
import Licitacoes from "./pages/Licitacoes";
import Compras from "./pages/Compras";
import PreparingData from "./pages/PreparingData";
import Inventory from "./pages/Inventory";
import InventoryItemView from "./pages/InventoryItemView";
import InventoryForm from "./pages/InventoryForm";
import DataManagement from "./pages/DataManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <EmployeeProvider>
              <InventoryProvider>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Login />} />
                  <Route path="/preparing" element={<PreparingData />} />
                  
                  {/* Dashboard Routes (Protected) */}
                  <Route path="/dashboard" element={
                    <DashboardLayout>
                      <Dashboard />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/employees" element={
                    <DashboardLayout>
                      <EmployeesList />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/employees/new" element={
                    <DashboardLayout>
                      <EmployeeForm />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/protocols" element={
                    <DashboardLayout>
                      <Protocols />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/licitacoes" element={
                    <DashboardLayout>
                      <Licitacoes />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/compras" element={
                    <DashboardLayout>
                      <Compras />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/profile" element={
                    <DashboardLayout>
                      <Profile />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/salary-simulator" element={
                    <DashboardLayout>
                      <SalarySimulator />
                    </DashboardLayout>
                  } />
                  
                  {/* Inventory Routes */}
                  <Route path="/dashboard/inventory" element={
                    <DashboardLayout>
                      <Inventory />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/inventory/:id" element={
                    <DashboardLayout>
                      <InventoryItemView />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/inventory/new" element={
                    <DashboardLayout>
                      <InventoryForm />
                    </DashboardLayout>
                  } />
                  <Route path="/dashboard/inventory/edit/:id" element={
                    <DashboardLayout>
                      <InventoryForm />
                    </DashboardLayout>
                  } />
                  
                  {/* Data Management Route */}
                  <Route path="/dashboard/data-management" element={
                    <DashboardLayout>
                      <DataManagement />
                    </DashboardLayout>
                  } />
                  
                  {/* Fallback routes */}
                  <Route path="/404" element={<NotFound />} />
                  <Route path="*" element={<Navigate to="/404" />} />
                </Routes>
              </InventoryProvider>
            </EmployeeProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
