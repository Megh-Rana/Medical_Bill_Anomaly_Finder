import { CheckCircle2, AlertTriangle, Download, Save, TrendingUp, DollarSign, FileText } from "lucide-react";
import { Button } from "./ui/button";

interface ResultsPageProps {
  onNavigate: (page: string) => void;
}

interface BillingItem {
  item: string;
  charged: string;
  typical: string;
  observation: string;
  severity: "normal" | "warning" | "info";
}

export function ResultsPage({ onNavigate }: ResultsPageProps) {
  const mockResults: BillingItem[] = [
    {
      item: "General Consultation Fee",
      charged: "$250",
      typical: "$180 - $220",
      observation: "Higher than typical range",
      severity: "warning"
    },
    {
      item: "Complete Blood Count",
      charged: "$45",
      typical: "$40 - $60",
      observation: "Within expected range",
      severity: "normal"
    },
    {
      item: "X-Ray - Chest (2 views)",
      charged: "$320",
      typical: "$150 - $250",
      observation: "Unusual deviation from reference",
      severity: "warning"
    },
    {
      item: "Medical Supplies",
      charged: "$85",
      typical: "$50 - $100",
      observation: "Within expected range",
      severity: "normal"
    },
    {
      item: "Facility Fee",
      charged: "$450",
      typical: "$300 - $500",
      observation: "Within expected range",
      severity: "normal"
    }
  ];

  const needsReviewCount = mockResults.filter(r => r.severity === "warning").length;
  const overallStatus = needsReviewCount > 0 ? "Needs Review" : "Normal";
  const totalCharged = "$1,150";

  const getRowColor = (severity: string) => {
    switch (severity) {
      case "warning":
        return "bg-amber-50/50 dark:bg-amber-950/10 border-l-4 border-l-amber-500";
      case "normal":
        return "hover:bg-muted/30";
      default:
        return "";
    }
  };

  const getObservationBadge = (severity: string) => {
    switch (severity) {
      case "warning":
        return "px-3 py-1 rounded-full bg-gradient-to-r from-amber-100 to-amber-200 dark:from-amber-950/30 dark:to-amber-900/20 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-700 text-xs";
      case "normal":
        return "px-3 py-1 rounded-full bg-gradient-to-r from-green-100 to-green-200 dark:from-green-950/30 dark:to-green-900/20 text-green-700 dark:text-green-400 border border-green-300 dark:border-green-700 text-xs";
      default:
        return "px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs";
    }
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Analysis Results
          </h1>
          <p className="text-muted-foreground text-lg">
            Detailed breakdown of your medical bill with AI-powered insights
          </p>
        </div>

        {/* Summary Cards Row */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Status Card */}
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Overall Status</p>
                <p className="text-2xl">
                  {overallStatus}
                </p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${
                overallStatus === "Normal" 
                  ? "gradient-success"
                  : "bg-gradient-to-br from-amber-500 to-amber-600"
              }`}>
                {overallStatus === "Normal" ? (
                  <CheckCircle2 className="h-6 w-6 text-white" />
                ) : (
                  <AlertTriangle className="h-6 w-6 text-white" />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Analysis completed on Dec 14, 2024
            </p>
          </div>

          {/* Total Amount Card */}
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Total Charged</p>
                <p className="text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {totalCharged}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              City General Hospital
            </p>
          </div>

          {/* Items Flagged Card */}
          <div className="glass rounded-2xl p-6 border border-white/10 shadow-xl card-hover">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Items Flagged</p>
                <p className="text-3xl bg-gradient-to-r from-accent to-amber-600 bg-clip-text text-transparent">
                  {needsReviewCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg">
                <FileText className="h-6 w-6 text-white" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Out of {mockResults.length} line items
            </p>
          </div>
        </div>

        {/* Key Observations */}
        <div className="glass rounded-2xl border border-white/10 shadow-xl mb-8 p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl gradient-secondary flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl">Key Observations</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="mb-2 text-amber-900 dark:text-amber-300">Unusual Deviation</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    X-Ray charges show significant variance from typical pricing patterns in our reference dataset
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950/20 dark:to-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="mb-2 text-amber-900 dark:text-amber-300">Higher Than Typical</h4>
                  <p className="text-sm text-amber-700 dark:text-amber-400">
                    General consultation fee is above the commonly observed range for similar services
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800 md:col-span-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h4 className="mb-2 text-blue-900 dark:text-blue-300">Less Common Combination</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400">
                    The combination of services billed together is less frequently observed in our reference data
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-card rounded-2xl border border-border shadow-xl overflow-hidden">
          <div className="p-6 border-b border-border bg-gradient-to-r from-primary/5 to-secondary/5">
            <h2 className="text-2xl">Detailed Line Item Analysis</h2>
            <p className="text-sm text-muted-foreground mt-1">Compare each charge against typical market ranges</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 text-sm text-muted-foreground">Item Description</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Charged</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Typical Range</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Observation</th>
                </tr>
              </thead>
              <tbody>
                {mockResults.map((item, index) => (
                  <tr
                    key={index}
                    className={`border-t border-border transition-colors ${getRowColor(item.severity)}`}
                  >
                    <td className="p-4">{item.item}</td>
                    <td className="p-4">
                      <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        {item.charged}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">{item.typical}</td>
                    <td className="p-4">
                      <span className={getObservationBadge(item.severity)}>
                        {item.observation}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 grid sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-14 border-2 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all"
            onClick={() => alert('Download functionality would be implemented here')}
          >
            <Download className="h-5 w-5 mr-2" />
            Download Report
          </Button>
          <Button
            variant="outline"
            className="h-14 border-2 hover:bg-secondary/10 hover:border-secondary hover:text-secondary transition-all"
            onClick={() => alert('Save functionality would be implemented here')}
          >
            <Save className="h-5 w-5 mr-2" />
            Save Result
          </Button>
          <Button
            className="h-14 gradient-primary text-white border-0 shadow-lg hover:shadow-xl transition-all text-lg"
            onClick={() => onNavigate('dashboard')}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
