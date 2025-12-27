import {
  CreditCard,
  FileText,
  Eye,
  TrendingUp,
  Activity,
  Edit3
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface AnalysisRecord {
  id: string;
  date: string;
  billName: string;
  status: "Completed" | "Processing" | "Needs Review";
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, userData } = useAuth();

  const credits = userData?.credits ?? 0;

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

  const handleStartAnalysis = () => {
    if (credits <= 0) {
      onNavigate("pricing");
      return;
    }
    onNavigate("bill-entry");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Welcome */}
        <div className="mb-12">
          <h1 className="mb-2">Welcome back</h1>
          <p className="text-muted-foreground">
            Signed in as {user?.email}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Credits */}
          <div className="bg-card rounded-lg border p-6 shadow-sm">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  Available Credits
                </p>
                <p className="text-5xl text-primary">{credits}</p>
              </div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-3">
                Each analysis uses 1 credit
              </p>
              <Button
                className="w-full bg-secondary text-white"
                onClick={() => onNavigate("pricing")}
              >
                Buy More Credits
                <TrendingUp className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick actions */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-6">
            <button
              onClick={handleStartAnalysis}
              disabled={credits <= 0}
              className={`group rounded-lg p-6 border-2 text-left transition-all
                ${
                  credits > 0
                    ? "bg-primary/5 border-primary hover:bg-primary/10"
                    : "bg-muted border-border opacity-60 cursor-not-allowed"
                }`}
            >
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                <Edit3 className="h-6 w-6 text-white" />
              </div>
              <h3 className="mb-2 text-primary">Enter Your Bill</h3>
              <p className="text-sm text-muted-foreground">
                {credits > 0
                  ? "Add bill details item by item"
                  : "No credits remaining"}
              </p>
            </button>

            <div className="bg-card rounded-lg p-6 border shadow-sm">
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

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-card p-6 border rounded-lg">
            <Activity className="mb-2 text-success" />
            <p className="text-sm text-muted-foreground">This Month</p>
            <p className="text-2xl">3 analyses</p>
          </div>

          <div className="bg-card p-6 border rounded-lg">
            <TrendingUp className="mb-2 text-accent" />
            <p className="text-sm text-muted-foreground">Avg. Processing</p>
            <p className="text-2xl">4.2 min</p>
          </div>

          <div className="bg-card p-6 border rounded-lg">
            <Eye className="mb-2 text-secondary" />
            <p className="text-sm text-muted-foreground">Insights Found</p>
            <p className="text-2xl">12 total</p>
          </div>
        </div>

        {/* Previous analyses */}
        <div className="bg-card rounded-lg border overflow-hidden">
          <div className="p-6 border-b bg-muted/20">
            <h2>Previous Uploads</h2>
            <p className="text-sm text-muted-foreground">
              View your past bill analyses
            </p>
          </div>

          <table className="w-full">
            <thead className="bg-muted/10 border-b">
              <tr>
                <th className="p-4 text-left text-sm">Date</th>
                <th className="p-4 text-left text-sm">Bill</th>
                <th className="p-4 text-left text-sm">Status</th>
                <th className="p-4 text-left text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockAnalyses.map((a, i) => (
                <tr
                  key={a.id}
                  className={`border-t ${
                    i % 2 ? "bg-muted/5" : ""
                  }`}
                >
                  <td className="p-4 text-sm">{a.date}</td>
                  <td className="p-4">{a.billName}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full border ${getStatusColor(
                        a.status
                      )}`}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onNavigate("results")}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
