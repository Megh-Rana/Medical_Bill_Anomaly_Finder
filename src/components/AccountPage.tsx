import { User, CreditCard, History, TrendingUp, Settings, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

interface AccountPageProps {
  userName: string;
  userEmail: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export function AccountPage({ userName, userEmail, onNavigate, onLogout }: AccountPageProps) {
  const creditsRemaining = 5;
  const usageHistory = [
    { date: "Dec 10, 2024", credits: 1, billName: "General Consultation" },
    { date: "Nov 28, 2024", credits: 1, billName: "Lab Tests" },
    { date: "Nov 15, 2024", credits: 1, billName: "Emergency Visit" },
    { date: "Oct 22, 2024", credits: 1, billName: "Follow-up Consultation" },
    { date: "Oct 05, 2024", credits: 1, billName: "Diagnostic Imaging" }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Account Settings
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your account details and credits
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-2">
            <button className="w-full flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-secondary/10 text-foreground border border-primary/20">
              <User className="h-5 w-5 text-primary" />
              <span>Profile</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-muted transition-colors text-muted-foreground hover:text-foreground">
              <Settings className="h-5 w-5" />
              <span>Preferences</span>
            </button>
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-3 p-4 rounded-xl hover:bg-destructive/10 transition-colors text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* User Details */}
            <div className="glass rounded-2xl border border-white/10 shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl">Personal Information</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    defaultValue={userName}
                    className="bg-input-background border-border/50 focus:border-primary transition-all h-12"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue={userEmail}
                    className="bg-input-background border-border/50 focus:border-primary transition-all h-12"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button className="gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all">
                    Save Changes
                  </Button>
                  <Button variant="outline" className="border-2">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>

            {/* Credits Section */}
            <div className="glass rounded-2xl border border-white/10 shadow-xl p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-xl gradient-secondary flex items-center justify-center shadow-lg">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl">Credits</h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl border border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Available Credits</p>
                      <p className="text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {creditsRemaining}
                      </p>
                    </div>
                    <Button
                      size="default"
                      onClick={() => onNavigate('pricing')}
                      className="bg-secondary hover:bg-secondary/90 text-white border-0 shadow-lg"
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Buy More
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Each bill analysis uses 1 credit
                  </p>
                </div>
              </div>
            </div>

            {/* Usage History */}
            <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
              <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
                    <History className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl">Usage History</h2>
                    <p className="text-sm text-muted-foreground">Your recent bill analyses</p>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="text-left p-4 text-sm text-muted-foreground">Date</th>
                      <th className="text-left p-4 text-sm text-muted-foreground">Bill Name</th>
                      <th className="text-right p-4 text-sm text-muted-foreground">Credits Used</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usageHistory.map((item, index) => (
                      <tr 
                        key={index} 
                        className={`border-t border-border hover:bg-muted/30 transition-colors ${
                          index % 2 === 0 ? '' : 'bg-muted/10'
                        }`}
                      >
                        <td className="py-4 px-4 text-sm text-muted-foreground">{item.date}</td>
                        <td className="py-4 px-4 text-sm">{item.billName}</td>
                        <td className="py-4 px-4 text-sm text-right">
                          <span className="px-3 py-1 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border border-primary/20">
                            {item.credits}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}