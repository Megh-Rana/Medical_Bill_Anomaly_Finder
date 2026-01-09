import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface LoginPageProps {
  onNavigate: (page: string) => void;
}

export function LoginPage({ onNavigate }: LoginPageProps) {
  const { loginEmail, signupEmail, loginGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      await loginEmail(email, password);
      onNavigate("dashboard");
    } catch (err: any) {
      // auto-signup if user doesn't exist
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/invalid-credential"
      ) {
        try {
          await signupEmail(email, password);
          onNavigate("dashboard");
        } catch (signupErr: any) {
          setError(signupErr.message);
        }
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleContinue = async () => {
    setLoading(true);
    setError(null);

    try {
      await loginGoogle();
      onNavigate("dashboard");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8 shadow-sm">
        <h1 className="text-2xl text-center mb-2">
          Welcome to BillDrishti
        </h1>

        <p className="text-sm text-muted-foreground text-center mb-6">
          Login or create an account to continue
        </p>

        <div className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-500">
              {error}
            </p>
          )}

          <Button
            className="w-full"
            onClick={handleEmailContinue}
            disabled={loading || !email || !password}
          >
            {loading ? "Please wait..." : "Continue"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t" />
            </div>
            <div className="relative text-center text-sm text-muted-foreground bg-card px-2">
              or
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleContinue}
            disabled={loading}
          >
            Continue with Google
          </Button>
        </div>
      </div>
    </div>
  );
}
