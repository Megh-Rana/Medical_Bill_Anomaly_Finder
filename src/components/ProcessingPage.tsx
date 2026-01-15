import { useEffect, useState, useRef } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { useBill } from "@/context/BillContext";
import { useAuth } from "@/context/AuthContext";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface ProcessingPageProps {
  onNavigate: (page: string) => void;
}

async function analyzeBill(items: any[]) {
  const res = await fetch("http://localhost:8000/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items })
  });

  if (!res.ok) throw new Error("Analysis failed");
  return res.json();
}

export function ProcessingPage({ onNavigate }: ProcessingPageProps) {
  const { billItems, setAnalysis, billName } = useBill();
  const { user, userData, consumeCredit } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const hasRunRef = useRef(false);

  const steps = [
    { label: "Finding anomalies", icon: "🔍" },
    { label: "Comparing with market rates", icon: "📊" },
    { label: "Analyzing billing patterns", icon: "📈" },
    { label: "Generating insights", icon: "✨" }
  ];

  useEffect(() => {
    if (!user || !userData || userData.credits < 1) {
      onNavigate("pricing");
      return;
    }

    if (hasRunRef.current) return;
    hasRunRef.current = true;

    let mounted = true;

    const stepTimer = setInterval(() => {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }, 1200);

    const progressTimer = setInterval(() => {
      setProgress(prev => Math.min(prev + 1, 95));
    }, 60);

    async function run() {
      try {
        const result = await analyzeBill(billItems);
        if (!mounted) return;

        // 1️⃣ store in context
        setAnalysis(result);

        // 2️⃣ deduct credit
        await consumeCredit(1);

        // 3️⃣ store FULL result in Firestore
        await addDoc(collection(db, "users", user.uid, "analyses"), {
          createdAt: serverTimestamp(),
          billName: billName.trim() || "Untitled Bill",
          status: "Completed",
          itemCount: billItems.length,
          result
        });

        setProgress(100);

        setTimeout(() => {
          onNavigate("results");
        }, 600);
      } catch (e) {
        console.error(e);
        onNavigate("bill-entry");
      }
    }

    run();

    return () => {
      mounted = false;
      clearInterval(stepTimer);
      clearInterval(progressTimer);
    };
  }, []);

  /* ======= UI (unchanged styling) ======= */

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-lg p-10 border shadow-sm">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h2 className="mb-3">Analyzing Your Bill</h2>
            <p className="text-muted-foreground">
              This usually takes less than a minute
            </p>
          </div>

          <div className="mb-10">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="text-primary">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 mb-8">
            {steps.map((s, i) => (
              <div
                key={i}
                className={`p-4 rounded-lg border ${
                  i === currentStep
                    ? "bg-primary/5 border-primary"
                    : i < currentStep
                    ? "bg-success/10 border-success/30"
                    : "bg-card"
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">
                    {i < currentStep ? "✓" : s.icon}
                  </span>
                  <span className="text-sm">{s.label}</span>
                  {i === currentStep && (
                    <Loader2 className="ml-auto h-5 w-5 animate-spin text-primary" />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-primary/5 rounded-lg p-5 border">
            <div className="flex gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-1" />
              <p className="text-sm text-muted-foreground">
                Your bill is securely analyzed against standard billing patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
