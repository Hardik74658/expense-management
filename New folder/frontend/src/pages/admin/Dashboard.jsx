import { Users, Settings, FileText, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Users", value: "24", icon: Users, color: "text-primary" },
    { label: "Active Expenses", value: "18", icon: FileText, color: "text-warning" },
    { label: "This Month", value: "$12,450", icon: TrendingUp, color: "text-success" },
    { label: "Approval Rules", value: "3", icon: Settings, color: "text-foreground" },
  ];

  const quickActions = [
    {
      title: "Manage Users",
      description: "Add employees and managers",
      icon: Users,
      color: "bg-primary/10 text-primary",
      action: () => navigate("/admin/users"),
    },
    {
      title: "Approval Rules",
      description: "Configure approval workflows",
      icon: Settings,
      color: "bg-success/10 text-success",
      action: () => navigate("/admin/rules"),
    },
    {
      title: "All Expenses",
      description: "View company expenses",
      icon: FileText,
      color: "bg-warning/10 text-warning",
      action: () => navigate("/admin/expenses"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your organization's expense system</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.label} className="p-6 card-hover">
                <div className="flex items-center justify-between mb-3">
                  <Icon className={`h-8 w-8 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            );
          })}
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <Card
                  key={action.title}
                  className="p-6 cursor-pointer card-hover"
                  onClick={action.action}
                >
                  <div className={`p-3 rounded-lg w-fit mb-4 ${action.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { action: "New user added", user: "Sarah Johnson", time: "2 hours ago" },
              { action: "Expense approved", user: "John Smith - $125.00", time: "3 hours ago" },
              { action: "Approval rule updated", user: "System", time: "1 day ago" },
              { action: "New expense submitted", user: "Mike Williams - $450.00", time: "1 day ago" },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 rounded-lg bg-secondary/50"
              >
                <div>
                  <p className="font-medium text-foreground">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.user}</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
