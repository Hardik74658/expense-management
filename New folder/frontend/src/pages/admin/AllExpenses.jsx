import { useMemo, useState } from "react";
import { ArrowLeft, Search, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AllExpenses = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const expenses = useMemo(
    () => [
      { id: 1, employee: "John Smith", description: "Client Dinner", amount: "$125.00", date: "2025-09-28", category: "Meals", status: "Pending" },
      { id: 2, employee: "Sarah Johnson", description: "Travel - Conference", amount: "$450.00", date: "2025-09-27", category: "Travel", status: "Approved" },
      { id: 3, employee: "Mike Williams", description: "Office Equipment", amount: "$320.00", date: "2025-09-26", category: "Office", status: "Approved" },
      { id: 4, employee: "Emily Davis", description: "Hotel Stay", amount: "$280.00", date: "2025-09-25", category: "Accommodation", status: "Approved" },
      { id: 5, employee: "Tom Brown", description: "Team Lunch", amount: "$95.50", date: "2025-09-24", category: "Meals", status: "Rejected" },
    ],
    []
  );

  const filteredExpenses = expenses.filter((expense) => {
    const matchesSearch =
      expense.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || expense.status.toLowerCase() === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-success/10 text-success";
      case "Pending":
        return "bg-warning/10 text-warning";
      case "Rejected":
        return "bg-danger/10 text-danger";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">All Expenses</h1>
          <p className="text-muted-foreground">View and manage company-wide expenses</p>
        </div>

        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="p-6 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{expense.description}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-2">
                      <span>{expense.employee}</span>
                      <span>•</span>
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
            <p className="text-muted-foreground">No expenses found matching your criteria.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AllExpenses;
