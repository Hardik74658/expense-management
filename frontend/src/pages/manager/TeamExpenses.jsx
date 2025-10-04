import { useMemo, useState } from "react";
import { Search, Users } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const TeamExpenses = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const teamExpenses = useMemo(
    () => [
      { id: 1, employee: "John Smith", amount: "$125.00", category: "Meals", status: "Pending", period: "Last 7 days" },
      { id: 2, employee: "Sarah Johnson", amount: "$450.00", category: "Travel", status: "Approved", period: "Last 14 days" },
      { id: 3, employee: "Mike Williams", amount: "$320.00", category: "Office", status: "Approved", period: "Last 30 days" },
      { id: 4, employee: "Emily Davis", amount: "$280.00", category: "Accommodation", status: "Pending", period: "Last 30 days" },
    ],
    []
  );

  const filteredExpenses = teamExpenses.filter((expense) =>
    expense.employee.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusTone = (status) => {
    if (status === "Approved") return "bg-success/10 text-success";
    if (status === "Pending") return "bg-warning/10 text-warning";
    return "bg-muted text-muted-foreground";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 p-4 md:p-8">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Team Expenses</h1>
          <p className="text-muted-foreground">Track spending patterns across your direct reports.</p>
        </header>

        <Card className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search by team member or category"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-2">
          {filteredExpenses.map((expense) => (
            <Card key={expense.id} className="p-6 card-hover">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{expense.period}</p>
                    <h3 className="text-lg font-semibold text-foreground">{expense.employee}</h3>
                  </div>
                </div>
                <Badge className={getStatusTone(expense.status)}>{expense.status}</Badge>
              </div>

              <div className="mt-6 flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Amount</p>
                  <p className="text-2xl font-semibold text-foreground">{expense.amount}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-muted-foreground">Category</p>
                  <p className="text-sm font-medium text-foreground">{expense.category}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredExpenses.length === 0 && (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No matching expenses for your search.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default TeamExpenses;
