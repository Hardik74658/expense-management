import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LayoutDashboard, FileCheck } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
  { label: "Team Expenses", href: "/manager/expenses", icon: FileCheck },
];

const ManagerLayout = () => (
  <AppShell role="Manager" navItems={navItems}>
    <Outlet />
  </AppShell>
);

export default ManagerLayout;
