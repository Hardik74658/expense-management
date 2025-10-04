import { Toaster as RadixToaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AdminLayout from "@/components/layout/AdminLayout.jsx";
import EmployeeLayout from "@/components/layout/EmployeeLayout.jsx";
import ManagerLayout from "@/components/layout/ManagerLayout.jsx";
import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import AllExpenses from "./pages/admin/AllExpenses.jsx";
import ApprovalRules from "./pages/admin/ApprovalRules.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import NotFound from "./pages/NotFound.jsx";
import EmployeeDashboard from "./pages/employee/Dashboard.jsx";
import ExpenseHistory from "./pages/employee/ExpenseHistory.jsx";
import SubmitExpense from "./pages/employee/SubmitExpense.jsx";
import ManagerDashboard from "./pages/manager/Dashboard.jsx";
import TeamExpenses from "./pages/manager/TeamExpenses.jsx";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <RadixToaster />
        <SonnerToaster />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="rules" element={<ApprovalRules />} />
              <Route path="expenses" element={<AllExpenses />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/employee" element={<EmployeeLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="submit" element={<SubmitExpense />} />
              <Route path="history" element={<ExpenseHistory />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/manager" element={<ManagerLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<ManagerDashboard />} />
              <Route path="expenses" element={<TeamExpenses />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
