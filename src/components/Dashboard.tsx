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
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  orderBy,
  query,
  doc,
  getDoc,
  Timestamp
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useBill } from "@/context/BillContext";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

interface AnalysisRecord {
  id: string;
  billName: string;
  status: "Completed" | "Processing" | "Needs Review";
  createdAt?: Timestamp;
}

export function Dashboard({ onNavigate }: DashboardProps) {
  const { user, userData } = useAuth();
  const credits = userData?.credits ?? 0;

  const [analyses, setAnalyses] = useState<AnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const { setAnalysis } = useBill();
  const { resetBill } = useBill();

  useEffect(() => {
    if (!user) return;

    const fetchAnalyses = async () => {
      try {
        const q = query(
          collection(db, "users", user.uid, "analyses"),
          orderBy("createdAt", "desc")
        );

        const snap = await getDocs(q);

        const data = snap.docs.map(d => ({
          id: d.id,
          ...(d.data() as any)
        }));

        setAnalyses(data);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, [user]);

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
    resetBill();
    onNavigate("bill-entry");
  };

  const handleViewAnalysis = async (analysisId: string) => {
    if (!user) return;

    const ref = doc(db, "users", user.uid, "analyses", analysisId);
    const snap = await getDoc(ref);

    if (!snap.exists()) return;

    const data = snap.data();

    // 🔑 push analysis result into context
    setAnalysis(data.result);

    // 🔑 navigate to real results page
    onNavigate("results");
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

        {/* Top cards */}
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
                {analyses.length}
              </p>
            </div>
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

          {loading ? (
            <p className="p-6 text-muted-foreground">Loading analyses…</p>
          ) : analyses.length === 0 ? (
            <p className="p-6 text-muted-foreground">
              No analyses yet. Start your first one.
            </p>
          ) : (
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
                {analyses.map((a, i) => (
                  <tr
                    key={a.id}
                    className={`border-t ${i % 2 ? "bg-muted/5" : ""}`}
                  >
                    <td className="p-4 text-sm">
                      {a.createdAt
                        ? a.createdAt.toDate().toLocaleDateString()
                        : "—"}
                    </td>
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
                        onClick={() => handleViewAnalysis(a.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
