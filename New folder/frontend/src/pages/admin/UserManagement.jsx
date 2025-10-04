import { useMemo, useState } from "react";
import { ArrowLeft, Plus, Search, Edit, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
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

const defaultUsers = [
  { id: 1, name: "John Smith", email: "john@company.com", role: "Employee", manager: "Sarah Johnson" },
  { id: 2, name: "Sarah Johnson", email: "sarah@company.com", role: "Manager", manager: "Admin" },
  { id: 3, name: "Mike Williams", email: "mike@company.com", role: "Employee", manager: "Sarah Johnson" },
  { id: 4, name: "Emily Davis", email: "emily@company.com", role: "Manager", manager: "Admin" },
  { id: 5, name: "Tom Brown", email: "tom@company.com", role: "Employee", manager: "Emily Davis" },
];

const emptyUserForm = {
  name: "",
  email: "",
  role: "Employee",
  manager: "",
};

const UserManagement = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState(defaultUsers);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState(emptyUserForm);
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [users, searchTerm]
  );

  const getRoleBadgeColor = (role) => {
    switch (role) {
      case "Admin":
        return "bg-danger/10 text-danger";
      case "Manager":
        return "bg-primary/10 text-primary";
      case "Employee":
        return "bg-success/10 text-success";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const handleOpenDialog = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        manager: user.manager ?? "",
      });
    } else {
      setEditingUser(null);
      setFormData(emptyUserForm);
    }
    setIsDialogOpen(true);
  };

  const handleDialogChange = (open) => {
    setIsDialogOpen(open);
    if (!open) {
      setEditingUser(null);
      setFormData(emptyUserForm);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const payload = {
      ...formData,
      name: formData.name.trim(),
      email: formData.email.trim().toLowerCase(),
      manager: formData.manager.trim(),
    };

    if (!payload.name || !payload.email) {
      toast.error("Name and email are required");
      return;
    }

    if (editingUser) {
      setUsers((previous) =>
        previous.map((user) => (user.id === editingUser.id ? { ...user, ...payload } : user))
      );
      toast.success("User updated successfully");
    } else {
      setUsers((previous) => [
        ...previous,
        {
          ...payload,
          id: Date.now(),
        },
      ]);
      toast.success("User added successfully");
    }

    handleDialogChange(false);
  };

  const handleDelete = (id) => {
    setUsers((previous) => previous.filter((user) => user.id !== id));
    toast.success("User removed");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <Button variant="ghost" onClick={() => navigate("/admin/dashboard")} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">User Management</h1>
          <p className="text-muted-foreground">Manage employees and managers</p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="pl-10"
            />
          </div>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </div>

        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-semibold text-foreground">Name</th>
                  <th className="text-left p-4 font-semibold text-foreground">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground">Role</th>
                  <th className="text-left p-4 font-semibold text-foreground">Manager</th>
                  <th className="text-left p-4 font-semibold text-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <p className="font-medium text-foreground">{user.name}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-muted-foreground">{user.email}</p>
                    </td>
                    <td className="p-4">
                      <Badge className={getRoleBadgeColor(user.role)}>{user.role}</Badge>
                    </td>
                    <td className="p-4">
                      <p className="text-muted-foreground">{user.manager}</p>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => handleOpenDialog(user)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-danger hover:text-danger hover:bg-danger/10"
                          onClick={() => handleDelete(user.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-muted-foreground">No users found matching your search.</p>
            </div>
          )}
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogChange}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              <DialogDescription>
                {editingUser
                  ? "Update the user's details and role assignments."
                  : "Fill in the details to add a new team member."}
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="user-name">Full Name</Label>
                  <Input
                    id="user-name"
                    placeholder="Sarah Johnson"
                    value={formData.name}
                    onChange={(event) => setFormData((previous) => ({ ...previous, name: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.email}
                    onChange={(event) => setFormData((previous) => ({ ...previous, email: event.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData((previous) => ({ ...previous, role: value }))}
                  >
                    <SelectTrigger id="user-role">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Manager">Manager</SelectItem>
                      <SelectItem value="Employee">Employee</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-manager">Reporting To</Label>
                  <Input
                    id="user-manager"
                    placeholder="Manager name"
                    value={formData.manager}
                    onChange={(event) => setFormData((previous) => ({ ...previous, manager: event.target.value }))}
                  />
                </div>
              </div>

              <DialogFooter className="pt-2">
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </DialogClose>
                <Button type="submit">{editingUser ? "Save Changes" : "Add User"}</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default UserManagement;
