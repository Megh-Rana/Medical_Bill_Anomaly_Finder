import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Mail, Lock, User, Sparkles } from "lucide-react";

interface SignupPageProps {
  onNavigate: (page: string) => void;
  onLogin: (email: string, name: string) => void;
}

export function SignupPage({ onNavigate, onLogin }: SignupPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
          <h2 className="mb-2">Create an account</h2>
          <p className="text-muted-foreground">
            Get started with BillDrishti today - it's free!
          </p>
        </div>

        <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4 text-primary" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-input-background border-border focus:border-primary transition-all h-12"
              />
            </div>

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
              <p className="text-xs text-muted-foreground">
                Minimum 8 characters with at least one number
              </p>
            </div>

            <div className="flex items-start gap-2">
              <input 
                type="checkbox" 
                required 
                className="mt-1 rounded border-border/50" 
              />
              <p className="text-xs text-muted-foreground">
                I agree to the Terms of Service and Privacy Policy
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-primary text-white hover:bg-primary/90 h-12"
            >
              Create Account
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => onNavigate('login')}
                className="text-primary hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-8 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-6 h-6 rounded-lg bg-primary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span>Free credit included</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="w-6 h-6 rounded-lg bg-secondary flex items-center justify-center">
              <Sparkles className="h-3 w-3 text-white" />
            </div>
            <span>No credit card</span>
          </div>
        </div>
      </div>
    </div>
  );
}