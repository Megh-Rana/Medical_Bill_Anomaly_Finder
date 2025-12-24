import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useBill } from "@/context/BillContext";

interface ProcessingPageProps {
  onNavigate: (page: string) => void;
}

async function analyzeBill(items: any[]) {
  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
    items: items
    })
  });

  if (!res.ok) {
    throw new Error("Analysis failed");
  }

  return res.json();
}

export function ProcessingPage({ onNavigate }: ProcessingPageProps) {
  const { billItems, setAnalysis } = useBill();
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    { label: "Finding anomalies", icon: "🔍" },
    { label: "Comparing with market rates", icon: "📊" },
    { label: "Analyzing billing patterns", icon: "📈" },
    { label: "Generating insights", icon: "✨" }
  ];

  useEffect(() => {
    let mounted = true;

    // 🔹 Animate steps
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
    }, 1200);

    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 1, 95));
    }, 60);

    // 🔹 REAL analysis
    async function runAnalysis() {
      try {
        const result = await analyzeBill(billItems);
        if (!mounted) return;

        setAnalysis(result);
        setProgress(100);

        // small UX delay so user sees completion
        setTimeout(() => {
          onNavigate("results");
        }, 600);
      } catch (err) {
        console.error(err);
        onNavigate("bill-entry");
      }
    }

    runAnalysis();

    return () => {
      mounted = false;
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, [billItems, onNavigate, setAnalysis]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-lg p-10 border border-border shadow-sm">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h2 className="mb-3">Analyzing Your Bill</h2>
            <p className="text-muted-foreground">
              This usually takes less than a minute
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm text-primary">{progress}%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-300 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Steps */}
          <div className="space-y-3 mb-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all duration-500 ${
                  index === currentStep
                    ? "bg-primary/5 border-primary"
                    : index < currentStep
                    ? "bg-success/10 border-success/30"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl flex-shrink-0">
                    {index < currentStep ? "✓" : step.icon}
                  </div>
                  <div className="flex-1">
                    <span
                      className={`text-sm ${
                        index === currentStep
                          ? "text-foreground"
                          : index < currentStep
                          ? "text-success"
                          : "text-muted-foreground"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {index === currentStep && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Info box */}
          <div className="bg-primary/5 rounded-lg p-5 border border-primary/20">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="mb-2 text-primary">Secure Processing</h4>
                <p className="text-sm text-muted-foreground">
                  Your data is being processed securely. We're analyzing your bill
                  against standard medical billing patterns to identify anomalies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
