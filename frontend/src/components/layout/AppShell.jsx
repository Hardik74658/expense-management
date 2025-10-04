import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Bell, LogOut, Menu, X } from "lucide-react";

const AppShell = ({ role, navItems, children }) => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const closeMobileNav = () => setIsMobileNavOpen(false);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Mobile Header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 shadow-sm lg:hidden">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileNavOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Expense Manager</p>
            <h1 className="text-lg font-semibold">{role} Workspace</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Off-canvas mobile nav */}
      {isMobileNavOpen ? (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={closeMobileNav} />
          <aside className="relative z-10 flex w-80 flex-col gap-6 border-r border-border bg-card p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Expense Manager</p>
                <h2 className="text-lg font-semibold">{role} Workspace</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeMobileNav}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <NavContent navItems={navItems} closeMobileNav={closeMobileNav} />
          </aside>
        </div>
      ) : null}

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-border bg-card/80 px-4 py-6 shadow-sm backdrop-blur lg:flex">
          <div className="mb-8">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Expense Manager</p>
            <h1 className="text-2xl font-semibold">{role} Workspace</h1>
          </div>
          <NavContent navItems={navItems} />
          <div className="mt-auto space-y-3 rounded-xl border border-border/60 bg-secondary/40 p-4">
            <p className="text-sm font-semibold text-foreground">Need assistance?</p>
            <p className="text-xs text-muted-foreground">Reach out to finance for onboarding and policy updates.</p>
            <Button variant="outline" size="sm" className="w-full">
              Contact Support
            </Button>
          </div>
        </aside>

        <main className="flex min-h-screen flex-1 flex-col">
          {/* Desktop Header */}
          <header className="hidden items-center justify-between border-b border-border bg-background/60 px-8 py-5 backdrop-blur lg:flex">
            <div>
              <h2 className="text-xl font-semibold tracking-tight">{role} Overview</h2>
              <p className="text-sm text-muted-foreground">Stay on top of your expense workflows</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
          </header>

          <div className="flex-1 bg-background/40">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

const NavContent = ({ navItems, closeMobileNav }) => (
  <nav className="space-y-1">
    {navItems.map(({ label, href, icon: Icon, badge }) => (
      <NavLink
        key={href}
        to={href}
        end
        onClick={closeMobileNav}
        className={({ isActive }) =>
          cn(
            "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
          )
        }
      >
        <span className="flex items-center gap-3">
          {Icon ? <Icon className="h-4 w-4" /> : null}
          {label}
        </span>
        {badge ? <Badge variant="outline" className="text-xs">{badge}</Badge> : null}
      </NavLink>
    ))}
  </nav>
);

export { AppShell };
