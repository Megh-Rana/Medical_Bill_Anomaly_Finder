import { CreditCard, Upload, FileText, Eye, TrendingUp, Activity, Edit3 } from "lucide-react";
import { Button } from "./ui/button";

interface DashboardProps {
  userName: string;
  onNavigate: (page: string) => void;
}

interface AnalysisRecord {
  id: string;
  date: string;
  billName: string;
  status: "Completed" | "Processing" | "Needs Review";
}

export function Dashboard({ userName, onNavigate }: DashboardProps) {
  const credits = 5;

  const mockAnalyses: AnalysisRecord[] = [
    {
      id: "1",
      date: "Dec 10, 2024",
      billName: "General Consultation - City Hospital",
      status: "Completed"
    },
    {
      id: "2",
      date: "Nov 28, 2024",
      billName: "Lab Tests - Medical Center",
      status: "Needs Review"
    },
    {
      id: "3",
      date: "Nov 15, 2024",
      billName: "Emergency Visit - Regional Hospital",
      status: "Completed"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "status-completed";
      case "Needs Review":
        return "status-review";
      case "Processing":
        return "status-processing";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="mb-2">
            Welcome back, {userName}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your medical bill analyses
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Credit Balance Card */}
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Available Credits</p>
                <p className="text-5xl text-primary">
                  {credits}
                </p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground mb-3">
                Each analysis uses 1 credit
              </p>
              <Button
                variant="default"
                className="w-full bg-secondary hover:bg-secondary/90 text-white group"
                onClick={() => onNavigate('pricing')}
              >
                Buy More Credits
                <TrendingUp className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>

          {/* Quick Action Cards */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <button
              onClick={() => onNavigate('bill-entry')}
              className="group bg-primary/5 rounded-lg p-6 border-2 border-primary hover:bg-primary/10 transition-all text-left relative overflow-hidden card-hover"
            >
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4 shadow-sm group-hover:scale-105 transition-transform">
                  <Edit3 className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2 text-primary">Enter Your Bill</h3>
                <p className="text-sm text-muted-foreground">
                  Add bill details item by item
                </p>
              </div>
            </button>

            <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="mb-2">Total Analyses</h3>
                <p className="text-4xl text-secondary">
                  {mockAnalyses.length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">This Month</p>
                <p className="text-2xl">3 analyses</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Processing</p>
                <p className="text-2xl">4.2 min</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Eye className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Insights Found</p>
                <p className="text-2xl">12 total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Analyses Table */}
        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border bg-muted/20">
            <h2>Previous Uploads</h2>
            <p className="text-sm text-muted-foreground mt-1">View and manage your bill analyses</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/10 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm text-muted-foreground">Date</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Bill Name</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Status</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {mockAnalyses.map((analysis, index) => (
                  <tr
                    key={analysis.id}
                    className={`border-t border-border hover:bg-muted/5 transition-colors ${
                      index % 2 === 0 ? '' : 'bg-muted/5'
                    }`}
                  >
                    <td className="p-4 text-sm text-muted-foreground">{analysis.date}</td>
                    <td className="p-4">{analysis.billName}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(analysis.status)}`}>
                        {analysis.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onNavigate('results')}
                        className="hover:bg-primary/5 hover:text-primary hover:border-primary transition-all"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}