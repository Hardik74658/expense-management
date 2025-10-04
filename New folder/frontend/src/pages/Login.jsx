import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Receipt } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    country: "US",
  });

  const handleLogin = (event) => {
    event.preventDefault();
    toast.success("Login successful!");
    navigate("/employee/dashboard");
  };

  const handleSignup = (event) => {
    event.preventDefault();
    toast.success("Account created successfully!");
    navigate("/admin/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-success/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-8">
          <div className="p-3 rounded-xl bg-primary/10">
            <Receipt className="h-10 w-10 text-primary" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center text-foreground mb-2">Expense Manager</h1>
        <p className="text-center text-muted-foreground mb-8">Streamline your expense workflow</p>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="you@company.com"
                  value={loginData.email}
                  onChange={(event) => setLoginData({ ...loginData, email: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  value={loginData.password}
                  onChange={(event) => setLoginData({ ...loginData, password: event.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Sign In
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name">Full Name</Label>
                <Input
                  id="signup-name"
                  placeholder="John Doe"
                  value={signupData.name}
                  onChange={(event) => setSignupData({ ...signupData, name: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="you@company.com"
                  value={signupData.email}
                  onChange={(event) => setSignupData({ ...signupData, email: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-company">Company Name</Label>
                <Input
                  id="signup-company"
                  placeholder="Acme Inc."
                  value={signupData.company}
                  onChange={(event) => setSignupData({ ...signupData, company: event.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-country">Country</Label>
                <Select value={signupData.country} onValueChange={(value) => setSignupData({ ...signupData, country: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States (USD)</SelectItem>
                    <SelectItem value="GB">United Kingdom (GBP)</SelectItem>
                    <SelectItem value="EU">European Union (EUR)</SelectItem>
                    <SelectItem value="IN">India (INR)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  value={signupData.password}
                  onChange={(event) => setSignupData({ ...signupData, password: event.target.value })}
                  required
                />
              </div>

              <Button type="submit" className="w-full">
                Create Account
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Login;
