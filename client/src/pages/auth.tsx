import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Code2, ArrowRight } from "lucide-react";

export default function Auth() {
  const [, setLocation] = useLocation();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login - just redirect to home
    setLocation("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>
      
      <div className="w-full max-w-md space-y-8 relative z-10">
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="bg-card p-3 rounded-2xl border border-border shadow-lg shadow-primary/10 mb-4">
            <Code2 className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold tracking-tighter font-mono">DevMatch</h1>
          <p className="text-muted-foreground">Connect with talent, find your next role.</p>
        </div>

        <Card className="border-border/50 bg-card/60 backdrop-blur-xl shadow-2xl">
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
            <CardDescription>
              This is a mockup. You can just click sign in to continue.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="dev@example.com" defaultValue="demo@devmatch.app" className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" defaultValue="password123" className="bg-secondary/50" />
              </div>
              
              <div className="pt-2">
                <Button type="submit" className="w-full font-medium" size="lg">
                  Sign In <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Don't have an account? <a href="#" className="text-primary hover:underline font-medium">Create one</a>
            </div>
          </CardContent>
        </Card>
        
        <div className="text-center text-xs text-muted-foreground/60 font-mono">
          Mockup Mode Environment
        </div>
      </div>
    </div>
  );
}