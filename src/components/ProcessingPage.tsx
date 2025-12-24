import { useEffect, useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

interface ProcessingPageProps {
  onNavigate: (page: string) => void;
}

export function ProcessingPage({ onNavigate }: ProcessingPageProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const steps = [
    { label: "Finding anomalies", icon: "🔍" },
    { label: "Comparing with market rates", icon: "📊" },
    { label: "Analyzing billing patterns", icon: "📈" },
    { label: "Generating insights", icon: "✨" }
  ];

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1500);

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev < 100) {
          return prev + 1;
        }
        return prev;
      });
    }, 60);

    const completionTimeout = setTimeout(() => {
      onNavigate('anomalies');
    }, 7000);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
      clearTimeout(completionTimeout);
    };
  }, [onNavigate]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full">
        <div className="bg-card rounded-lg p-10 border border-border shadow-sm">
          <div className="text-center mb-10">
            <div className="mx-auto w-20 h-20 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
              <Loader2 className="h-10 w-10 text-primary animate-spin" />
            </div>
            <h2 className="mb-3">
              Analyzing Your Bill
            </h2>
            <p className="text-muted-foreground">
              This usually takes less than a minute
            </p>
          </div>

          {/* Progress bar */}
          <div className="mb-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-muted-foreground">Progress</span>
              <span className="text-sm text-primary">
                {progress}%
              </span>
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
                  <div className={`text-2xl flex-shrink-0`}>
                    {index < currentStep ? '✓' : step.icon}
                  </div>
                  <div className="flex-1">
                    <span className={`text-sm ${
                      index === currentStep 
                        ? 'text-foreground' 
                        : index < currentStep 
                        ? 'text-success' 
                        : 'text-muted-foreground'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                  {index === currentStep && (
                    <Loader2 className="h-5 w-5 text-primary animate-spin" />
                  )}
                  {index < currentStep && (
                    <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
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
                  Your data is being processed securely. We're analyzing your bill against standard medical billing patterns to identify categories and anomalies.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}