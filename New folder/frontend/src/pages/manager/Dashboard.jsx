import { CheckCircle, XCircle, Clock, Users, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ManagerDashboard = () => {
  const stats = [
    { label: "Pending Approval", value: "5", icon: Clock, color: "text-warning" },
    { label: "Approved Today", value: "12", icon: CheckCircle, color: "text-success" },
    { label: "Team Members", value: "8", icon: Users, color: "text-primary" },
    { label: "Total Amount", value: "$2,450", icon: DollarSign, color: "text-foreground" },
  ];

  const pendingExpenses = [
    { id: 1, employee: "John Smith", description: "Client Dinner", amount: "$125.00", date: "2025-09-28", category: "Meals" },
    { id: 2, employee: "Sarah Johnson", description: "Travel - Conference", amount: "$450.00", date: "2025-09-27", category: "Travel" },
    { id: 3, employee: "Mike Williams", description: "Office Equipment", amount: "$320.00", date: "2025-09-26", category: "Office" },
  ];

  const handleApprove = (id) => {
    console.log("Approved expense:", id);
  };

  const handleReject = (id) => {
    console.log("Rejected expense:", id);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Manager Dashboard</h1>
          <p className="text-muted-foreground">Review and approve team expenses</p>
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

        <Card className="p-6">
          <h2 className="text-2xl font-semibold text-foreground mb-6">Pending Approvals</h2>
          <div className="space-y-4">
            {pendingExpenses.map((expense) => (
              <div
                key={expense.id}
                className="p-6 rounded-lg border border-border bg-card hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg text-foreground">{expense.description}</h3>
                      <Badge variant="outline">{expense.category}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-1">Submitted by {expense.employee}</p>
                    <p className="text-muted-foreground text-sm">{expense.date}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-bold text-foreground">{expense.amount}</span>
                    <div className="flex gap-2">
                      <Button onClick={() => handleApprove(expense.id)} className="bg-success hover:bg-success/90">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleReject(expense.id)}
                        variant="outline"
                        className="border-danger text-danger hover:bg-danger hover:text-danger-foreground"
                      >
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {pendingExpenses.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <p className="text-muted-foreground">No pending approvals at this time</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ManagerDashboard;
