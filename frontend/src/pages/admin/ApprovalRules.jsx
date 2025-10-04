import { useState } from "react";
import { ArrowLeft, Plus, Settings, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const defaultRules = [
  {
    id: 1,
    name: "Standard Approval",
    type: "Sequential",
    description: "Manager approval required for all expenses",
    approvers: ["Manager", "Finance"],
    threshold: "$0+",
    active: true,
  },
  {
    id: 2,
    name: "High Value",
    type: "Percentage",
    description: "60% approval required for expenses over $500",
    approvers: ["Manager", "Finance", "Director"],
    threshold: "$500+",
    active: true,
  },
  {
    id: 3,
    name: "CFO Override",
    type: "Specific Approver",
    description: "CFO can auto-approve any expense",
    approvers: ["CFO"],
    threshold: "Any amount",
    active: true,
  },
];

const emptyRuleForm = {
  name: "",
  type: "Sequential",
  description: "",
  approvers: "",
  threshold: "",
  active: "true",
};

const ApprovalRules = () => {
  const navigate = useNavigate();
  const [rules, setRules] = useState(defaultRules);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyRuleForm);
  const [editingRule, setEditingRule] = useState(null);

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingRule(null);
      setFormData(emptyRuleForm);
    }
  };

  const handleCreateRule = () => {
    setEditingRule(null);
    setFormData(emptyRuleForm);
    setIsDialogOpen(true);
  };

  const handleEditRule = (rule) => {
    setEditingRule(rule);
    setFormData({
      name: rule.name,
      type: rule.type,
      description: rule.description,
      approvers: rule.approvers.join(", "),
      threshold: rule.threshold,
      active: rule.active ? "true" : "false",
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedApprovers = formData.approvers
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean);

    if (!formData.name.trim()) {
      toast.error("Rule name is required");
      return;
    }

    const payload = {
      name: formData.name.trim(),
      type: formData.type,
      description: formData.description.trim(),
      threshold: formData.threshold.trim() || "Any amount",
      approvers: trimmedApprovers.length ? trimmedApprovers : ["Manager"],
      active: formData.active === "true",
    };

    if (editingRule) {
      setRules((previous) =>
        previous.map((rule) => (rule.id === editingRule.id ? { ...rule, ...payload } : rule))
      );
      toast.success("Rule updated successfully");
    } else {
      setRules((previous) => [
        ...previous,
        {
          ...payload,
          id: Date.now(),
        },
      ]);
      toast.success("Rule created successfully");
    }

    handleDialogChange(false);
  };

  const handleToggleRule = (ruleId) => {
    setRules((previous) =>
      previous.map((rule) =>
        rule.id === ruleId ? { ...rule, active: !rule.active } : rule
      )
    );
    toast.success("Rule status updated");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Approval Rules</h1>
          <p className="text-muted-foreground">Configure expense approval workflows</p>
        </div>

        <Button className="mb-6" onClick={handleCreateRule}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Rule
        </Button>

        <div className="grid grid-cols-1 gap-6">
          {rules.map((rule) => (
            <Card key={rule.id} className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4 mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-foreground">{rule.name}</h3>
                    {rule.active ? (
                      <Badge className="bg-success/10 text-success">Active</Badge>
                    ) : null}
                  </div>
                  <p className="text-muted-foreground mb-4">{rule.description}</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Rule Type</p>
                      <p className="font-medium text-foreground">{rule.type}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Threshold</p>
                      <p className="font-medium text-foreground">{rule.threshold}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Approvers</p>
                      <div className="flex flex-wrap gap-2">
                        {rule.approvers.map((approver) => (
                          <Badge key={approver} variant="outline">
                            {approver}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEditRule(rule)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleToggleRule(rule.id)}>
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-6 mt-6 bg-primary/5 border-primary/20">
          <h3 className="font-semibold text-foreground mb-2">About Approval Rules</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><strong>Sequential:</strong> Approvers must approve in order</li>
            <li><strong>Percentage:</strong> A percentage of approvers must approve</li>
            <li><strong>Specific Approver:</strong> One specific person can approve</li>
            <li><strong>Hybrid:</strong> Combination of multiple rule types</li>
          </ul>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingRule ? "Edit Approval Rule" : "Create Approval Rule"}</DialogTitle>
              <DialogDescription>
                Define thresholds, approvers, and rule types to automate your expense workflow.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="rule-name">Rule name</Label>
                  <Input
                    id="rule-name"
                    placeholder="High Value Expenses"
                    value={formData.name}
                    onChange={(event) => setFormData((previous) => ({ ...previous, name: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-type">Rule type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData((previous) => ({ ...previous, type: value }))}
                  >
                    <SelectTrigger id="rule-type">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Sequential">Sequential</SelectItem>
                      <SelectItem value="Percentage">Percentage</SelectItem>
                      <SelectItem value="Specific Approver">Specific Approver</SelectItem>
                      <SelectItem value="Hybrid">Hybrid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-threshold">Threshold</Label>
                  <Input
                    id="rule-threshold"
                    placeholder="$500+"
                    value={formData.threshold}
                    onChange={(event) => setFormData((previous) => ({ ...previous, threshold: event.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="rule-status">Rule status</Label>
                  <Select
                    value={formData.active}
                    onValueChange={(value) => setFormData((previous) => ({ ...previous, active: value }))}
                  >
                    <SelectTrigger id="rule-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-approvers">Approvers</Label>
                <Input
                  id="rule-approvers"
                  placeholder="Manager, Finance, Director"
                  value={formData.approvers}
                  onChange={(event) => setFormData((previous) => ({ ...previous, approvers: event.target.value }))}
                />
                <p className="text-xs text-muted-foreground">Separate approvers with commas.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rule-description">Description</Label>
                <Textarea
                  id="rule-description"
                  placeholder="Describe the purpose and behaviour of this rule."
                  rows={4}
                  value={formData.description}
                  onChange={(event) => setFormData((previous) => ({ ...previous, description: event.target.value }))}
                />
              </div>

              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editingRule ? "Save changes" : "Create rule"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ApprovalRules;
