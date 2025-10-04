import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/layout/AppShell";
import { LayoutDashboard, Users, FileText, Settings } from "lucide-react";

const navItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Approval Rules", href: "/admin/rules", icon: Settings },
  { label: "All Expenses", href: "/admin/expenses", icon: FileText },
];

const AdminLayout = () => (
  <AppShell role="Admin" navItems={navItems}>
    <Outlet />
  </AppShell>
);

export default AdminLayout;
