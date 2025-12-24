import { Download } from "lucide-react";
import { Button } from "./ui/button";
import { useBill } from "@/context/BillContext";
import { useEffect, useRef } from "react";
import { PrintPortal } from "@/components/PrintPortal";

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
  const { billItems, analysis } = useBill();

  // ensure auto-save runs once
  const hasSavedRef = useRef(false);

  useEffect(() => {
    if (!analysis || hasSavedRef.current) return;

    const savedReports = JSON.parse(
      localStorage.getItem("savedReports") || "[]"
    );

    const report = {
      id: Date.now(),
      createdAt: new Date().toISOString(),
      billItems,
      analysis
    };

    localStorage.setItem(
      "savedReports",
      JSON.stringify([...savedReports, report])
    );

    hasSavedRef.current = true;
  }, [analysis, billItems]);

  // guard: direct access
  if (!analysis) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-lg text-muted-foreground">
          No analysis found. Please analyze a bill first.
        </p>
        <Button onClick={() => onNavigate("bill-entry")}>
          Go to Bill Entry
        </Button>
      </div>
    );
  }

  const results: BillingItem[] = analysis.anomalies.map((a: any) => ({
    item: a.item,
    charged: "—",
    typical: "Reference based",
    observation: a.issue,
    severity: a.severity === "high" ? "warning" : "normal"
  }));

  const needsReviewCount = results.filter(
    r => r.severity === "warning"
  ).length;

  const overallStatus =
    needsReviewCount > 0 ? "Needs Review" : "Normal";

  const totalCharged = billItems.reduce(
    (sum: number, item: any) => sum + (item.total_price || 0),
    0
  );

  return (
    <>
      {/* =====================
          SCREEN UI
         ===================== */}
      <div className="py-8 px-4 sm:px-6 lg:px-8 bg-pattern">
        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="mb-8">
            <h1 className="mb-2 text-4xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Analysis Results
            </h1>
            <p className="text-muted-foreground text-lg">
              Detailed breakdown of your medical bill with AI-powered insights
            </p>
          </div>

          {/* SUMMARY */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="glass rounded-2xl p-6 border shadow-xl">
              <p className="text-sm text-muted-foreground mb-2">
                Overall Status
              </p>
              <p className="text-2xl">{overallStatus}</p>
            </div>

            <div className="glass rounded-2xl p-6 border shadow-xl">
              <p className="text-sm text-muted-foreground mb-2">
                Total Charged
              </p>
              <p className="text-3xl">
                ₹{totalCharged.toLocaleString()}
              </p>
            </div>

            <div className="glass rounded-2xl p-6 border shadow-xl">
              <p className="text-sm text-muted-foreground mb-2">
                Items Flagged
              </p>
              <p className="text-3xl">{needsReviewCount}</p>
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-card rounded-2xl border shadow-xl mb-8">
            <div className="p-6 border-b">
              <h2 className="text-2xl">Detailed Line Item Analysis</h2>
            </div>

            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="p-4 text-left">Item</th>
                  <th className="p-4 text-left">Charged</th>
                  <th className="p-4 text-left">Typical</th>
                  <th className="p-4 text-left">Observation</th>
                </tr>
              </thead>
              <tbody>
                {results.map((item, i) => (
                  <tr key={i} className="border-t">
                    <td className="p-4">{item.item}</td>
                    <td className="p-4">{item.charged}</td>
                    <td className="p-4 text-muted-foreground">
                      {item.typical}
                    </td>
                    <td className="p-4">{item.observation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ACTIONS */}
          <div className="grid sm:grid-cols-2 gap-4 no-print">
            <Button
              variant="outline"
              className="h-14"
              onClick={() => window.print()}
            >
              <Download className="h-5 w-5 mr-2" />
              Download Report
            </Button>

            <Button
              className="h-14 gradient-primary text-white"
              onClick={() => onNavigate("dashboard")}
            >
              Return to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* =====================
          PRINT DOCUMENT
         ===================== */}
      <PrintPortal>
        <div id="print-report">
          <h1>Medical Bill Analysis Report</h1>
          <p>Generated on {new Date().toLocaleString()}</p>

          <hr />

          <h2>Summary</h2>
          <p><strong>Status:</strong> {overallStatus}</p>
          <p><strong>Total Charged:</strong> ₹{totalCharged.toLocaleString()}</p>
          <p><strong>Items Flagged:</strong> {needsReviewCount}</p>

          <hr />

          <h2>Detailed Line Items</h2>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Charged</th>
                <th>Typical</th>
                <th>Observation</th>
              </tr>
            </thead>
            <tbody>
              {results.map((item, i) => (
                <tr key={i}>
                  <td>{item.item}</td>
                  <td>{item.charged}</td>
                  <td>{item.typical}</td>
                  <td>{item.observation}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p style={{ marginTop: 24, textAlign: "center" }}>
            Made by Team De-Cypher with ❤️
          </p>
        </div>
      </PrintPortal>
    </>
  );
}
