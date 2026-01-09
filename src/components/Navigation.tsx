import { Sun, Moon } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  isLoggedIn: boolean;
  userName?: string;
}

export function Navigation({
  currentPage,
  onNavigate,
  isDarkMode,
  onToggleDarkMode,
  isLoggedIn,
  userName
}: NavigationProps) {
  const { logout } = useAuth();

  return (
    <nav className="sticky top-0 z-50 bg-card border-b border-border backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* LEFT */}
          <div className="flex items-center gap-8">
            <button
              onClick={() => {
                  onNavigate("landing");
              }}
              className="group flex items-center gap-2"
            >
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-white text-xl">BD</span>
              </div>
              <span className="text-xl text-foreground">BillDrishti</span>
            </button>

            {isLoggedIn && (
              <div className="hidden md:flex items-center gap-6">
                <button
                  onClick={() => onNavigate("dashboard")}
                  className={`text-sm transition-all relative ${
                    currentPage === "dashboard"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Dashboard
                  {currentPage === "dashboard" && (
                    <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>

                <button
                  onClick={() => onNavigate("bill-entry")}
                  className={`text-sm transition-all relative ${
                    currentPage === "bill-entry" || currentPage === "upload"
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Enter Bill
                  {(currentPage === "bill-entry" ||
                    currentPage === "upload") && (
                    <div className="absolute -bottom-5 left-0 right-0 h-0.5 bg-primary rounded-full" />
                  )}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-4">
            {!isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate("pricing")}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Pricing
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("login")}
                  className="hover:bg-primary/10"
                >
                  Login
                </Button>
              </>
            )}

            {isLoggedIn && (
              <>
                <button
                  onClick={() => onNavigate("account")}
                  className="text-sm px-4 py-2 rounded-lg bg-primary/10 text-foreground hover:bg-primary/20 transition-all"
                >
                  {userName || "Account"}
                </button>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={async () => {
                    await logout();
                    onNavigate("landing");
                  }}
                  className="text-red-500 hover:bg-red-500/10"
                >
                  Logout
                </Button>
              </>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleDarkMode}
              className="rounded-lg hover:bg-primary/10 transition-all"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5 text-accent" />
              ) : (
                <Moon className="h-5 w-5 text-primary" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
