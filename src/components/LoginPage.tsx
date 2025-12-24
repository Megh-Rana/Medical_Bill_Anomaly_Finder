import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, Lock, Sparkles } from "lucide-react";

interface LoginPageProps {
  onNavigate: (page: string) => void;
  onLogin: (email: string, name: string) => void;
}

export function LoginPage({ onNavigate, onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const name = email.split('@')[0];
    onLogin(email, name);
    onNavigate('dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white text-2xl">M</span>
            </div>
          </div>
          <h2 className="mb-2">Welcome back</h2>
          <p className="text-muted-foreground">
            Sign in to your MBAF account
          </p>
        </div>

        <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-input-background border-border focus:border-primary transition-all h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-input-background border-border focus:border-primary transition-all h-12"
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-border" />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <button type="button" className="text-primary hover:underline">
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90 h-12"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{" "}
              <button
                onClick={() => onNavigate('signup')}
                className="text-primary hover:underline"
              >
                Sign up for free
              </button>
            </p>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Secure Login</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
          <div className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>256-bit Encryption</span>
          </div>
        </div>
      </div>
    </div>
  );
}