import { Button } from "@/components/ui/button";

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      Home Page
      <Button className="ml-4" asChild>
        <a href="/auth/login">Login</a>
      </Button>
      <Button className="ml-4" asChild>
        <a href="/auth/signup">Sign Up</a>
      </Button>
    </div>
  );
}