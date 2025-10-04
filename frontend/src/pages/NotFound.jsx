import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <Card className="w-full max-w-lg p-10 text-center">
        <div className="flex flex-col items-center gap-6">
          <div className="rounded-full border border-border bg-secondary/60 px-6 py-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Error 404
          </div>
          <h1 className="text-3xl font-bold text-foreground">We lost that page for a moment</h1>
          <p className="text-muted-foreground">
            The link you followed may be broken, or the page may have been removed. Let&apos;s get you back to the expense workspace.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" onClick={() => navigate(-1)}>
              Go Back
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/")}>
              Return to Login
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
