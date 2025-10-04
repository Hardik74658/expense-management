import { Plus, Receipt, Clock, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const EmployeeDashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { label: "Total Expenses", value: "12", icon: Receipt, color: "text-primary" },
    { label: "Pending", value: "3", icon: Clock, color: "text-warning" },
    { label: "Approved", value: "8", icon: CheckCircle, color: "text-success" },
    { label: "Rejected", value: "1", icon: XCircle, color: "text-danger" },
  ];

  const recentExpenses = [
    { id: 1, description: "Client Dinner", amount: "$125.00", date: "2025-09-28", status: "Pending" },
    { id: 2, description: "Office Supplies", amount: "$45.30", date: "2025-09-25", status: "Approved" },
    { id: 3, description: "Travel - Conference", amount: "$450.00", date: "2025-09-20", status: "Approved" },
  ];

  const getStatusClasses = (status) => {
    if (status === "Approved") return "bg-success/10 text-success";
    if (status === "Pending") return "bg-warning/10 text-warning";
    return "bg-danger/10 text-danger";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Employee Dashboard</h1>
          <p className="text-muted-foreground">Manage your expenses and track reimbursements</p>
        </div>

        <Button onClick={() => navigate("/employee/submit")} className="mb-8 btn-transition" size="lg">
          <Plus className="mr-2 h-5 w-5" />
          Submit New Expense
        </Button>

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

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-foreground">Recent Expenses</h2>
            <Button variant="outline" onClick={() => navigate("/employee/history")}>
              View All
            </Button>
          </div>

          <div className="space-y-4">
            {recentExpenses.map((expense) => (
              <div
                key={expense.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
              >
                <div className="mb-2 md:mb-0">
                  <h3 className="font-semibold text-foreground">{expense.description}</h3>
                  <p className="text-sm text-muted-foreground">{expense.date}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold text-foreground">{expense.amount}</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(expense.status)}`}>
                    {expense.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
