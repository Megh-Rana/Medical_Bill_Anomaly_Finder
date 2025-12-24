import { AlertTriangle, CheckCircle, TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";

interface AnomaliesPageProps {
  onNavigate: (page: string) => void;
  billItems: any[];
  setBillItems: (items: any[]) => void;
}

interface Anomaly {
  id: number;
  type: "warning" | "info" | "alert";
  itemName: string;
  message: string;
  suggestion?: string;
}

export function AnomaliesPage({ onNavigate, billItems }: AnomaliesPageProps) {
  // Mock anomaly detection logic
  const detectAnomalies = (): Anomaly[] => {
    const anomalies: Anomaly[] = [];

    billItems.forEach((item, index) => {
      const price = parseFloat(item.price);
      
      // Price too high
      if (item.category === "medicine" && price > 500) {
        anomalies.push({
          id: index * 3 + 1,
          type: "warning",
          itemName: item.name,
          message: `High cost detected: ₹${price.toFixed(2)}`,
          suggestion: "Average market price for similar medicines is typically ₹200-400. Consider checking with pharmacy."
        });
      }

      // Quantity check
      if (parseInt(item.quantity) > 5 && item.category === "diagnostic") {
        anomalies.push({
          id: index * 3 + 2,
          type: "info",
          itemName: item.name,
          message: `Unusual quantity: ${item.quantity} units`,
          suggestion: "Multiple diagnostic tests of the same type are uncommon. Verify with your healthcare provider."
        });
      }

      // Generic items in "other"
      if (item.category === "other" && item.total > 1000) {
        anomalies.push({
          id: index * 3 + 3,
          type: "alert",
          itemName: item.name,
          message: "Uncategorized high-value item",
          suggestion: "Please verify this charge with the billing department for clarity."
        });
      }
    });

    // If no anomalies found, add a positive message
    if (anomalies.length === 0) {
      anomalies.push({
        id: 0,
        type: "info",
        itemName: "Overall Bill",
        message: "No significant anomalies detected",
        suggestion: "Your bill appears to be within normal ranges based on our analysis."
      });
    }

    return anomalies;
  };

  const anomalies = detectAnomalies();

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-accent" />;
      case "alert":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "info":
        return <CheckCircle className="h-5 w-5 text-success" />;
      default:
        return null;
    }
  };

  const getAnomalyColor = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-accent/10 border-accent/30 dark:bg-accent/20 dark:border-accent/40";
      case "alert":
        return "bg-destructive/10 border-destructive/30 dark:bg-destructive/20 dark:border-destructive/40";
      case "info":
        return "bg-success/10 border-success/30 dark:bg-success/20 dark:border-success/40";
      default:
        return "";
    }
  };

  const totalAmount = billItems.reduce((sum, item) => sum + item.total, 0);
  const medicineTotal = billItems.filter(i => i.category === "medicine").reduce((sum, item) => sum + item.total, 0);
  const diagnosticTotal = billItems.filter(i => i.category === "diagnostic").reduce((sum, item) => sum + item.total, 0);
  const otherTotal = billItems.filter(i => i.category === "other").reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3">Analysis Complete</h1>
          <p className="text-muted-foreground">
            We've analyzed your bill and identified {anomalies.length} {anomalies.length === 1 ? 'point' : 'points'} of interest.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-12">
          {/* Summary Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="mb-6">Bill Summary</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Total Items</span>
                  <span>{billItems.length}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Medicine</span>
                  <span>₹{medicineTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Diagnostic</span>
                  <span>₹{diagnosticTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-border">
                  <span className="text-sm text-muted-foreground">Other</span>
                  <span>₹{otherTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span>Total Amount</span>
                  <span className="text-xl">₹{totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-lg border border-border p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4>Insights</h4>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Your bill has been categorized and analyzed against standard medical billing practices.
              </p>
            </div>
          </div>

          {/* Anomalies List */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border border-border">
              <div className="p-6 border-b border-border">
                <h2>Detected Anomalies</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Review these findings and take action if needed
                </p>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {anomalies.map((anomaly) => (
                    <div
                      key={anomaly.id}
                      className={`rounded-lg border p-4 ${getAnomalyColor(anomaly.type)}`}
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getAnomalyIcon(anomaly.type)}
                        </div>
                        <div className="flex-1">
                          <div className="mb-1">
                            <span className="text-sm text-muted-foreground">{anomaly.itemName}</span>
                          </div>
                          <h4 className="mb-2">{anomaly.message}</h4>
                          {anomaly.suggestion && (
                            <p className="text-sm text-muted-foreground">
                              {anomaly.suggestion}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => onNavigate('categorization')}
            variant="outline"
          >
            Back
          </Button>
          <div className="flex gap-4">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="outline"
            >
              Return to Dashboard
            </Button>
            <Button
              onClick={() => window.print()}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Download Report
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}