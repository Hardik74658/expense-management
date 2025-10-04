import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LayoutDashboard, PlusCircle, History } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
  { label: "Submit Expense", href: "/employee/submit", icon: PlusCircle },
  { label: "Expense History", href: "/employee/history", icon: History },
];

const EmployeeLayout = () => (
  <AppShell role="Employee" navItems={navItems}>
    <Outlet />
  </AppShell>
);

export default EmployeeLayout;
