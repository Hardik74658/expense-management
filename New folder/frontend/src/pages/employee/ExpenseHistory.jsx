import { useMemo, useState } from "react";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const ExpenseHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const expenses = useMemo(
    () => [
      { id: 1, description: "Client Dinner - Q3 Planning", amount: "$125.00", date: "2025-09-28", category: "Meals", status: "Pending" },
      { id: 2, description: "Office Supplies - Notebooks", amount: "$45.30", date: "2025-09-25", category: "Office", status: "Approved" },
      { id: 3, description: "Travel - Tech Conference", amount: "$450.00", date: "2025-09-20", category: "Travel", status: "Approved" },
      { id: 4, description: "Hotel Stay - Business Trip", amount: "$280.00", date: "2025-09-15", category: "Accommodation", status: "Approved" },
      { id: 5, description: "Team Lunch", amount: "$95.50", date: "2025-09-10", category: "Meals", status: "Rejected" },
      { id: 6, description: "Taxi to Airport", amount: "$35.00", date: "2025-09-08", category: "Travel", status: "Approved" },
    ],
    []
  );

  const filteredExpenses = expenses.filter(
    (expense) =>
      expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status) => {
    if (status === "Approved") return "bg-success/10 text-success hover:bg-success/20";
    if (status === "Pending") return "bg-warning/10 text-warning hover:bg-warning/20";
    if (status === "Rejected") return "bg-danger/10 text-danger hover:bg-danger/20";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/employee/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Expense History</h1>
          <p className="text-muted-foreground">View and track all your submitted expenses</p>
        </div>

        <Card className="p-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="p-6 card-hover">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{expense.description}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                      <span>{expense.date}</span>
                      <span>•</span>
                      <span>{expense.category}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4 md:justify-end">
                  <span className="text-xl font-bold text-foreground">{expense.amount}</span>
                  <Badge className={getStatusColor(expense.status)}>{expense.status}</Badge>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No expenses found matching your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;
