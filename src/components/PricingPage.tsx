import { Check, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "@/context/AuthContext";

interface PricingPageProps {
  onNavigate: (page: string) => void;
  isLoggedIn: boolean;
}

interface PricingPlan {
  name: string;
  credits: number;
  price: string;
  priceValue: number;
  features: string[];
  highlighted?: boolean;
  icon: string;
  gradient: string;
  badge?: string;
}

export function PricingPage({ onNavigate, isLoggedIn }: PricingPageProps) {
  const { addCredits } = useAuth();

  const plans: PricingPlan[] = [
    {
      name: "Starter",
      credits: 5,
      price: "₹100",
      priceValue: 100,
      features: [
        "5 analysis credits",
        "Basic categorization",
        "Anomaly detection",
        "PDF report download",
        "Email support",
        "12 months validity"
      ],
      icon: "✨",
      gradient: "from-secondary to-success"
    },
    {
      name: "Growth",
      credits: 25,
      price: "₹450",
      priceValue: 450,
      features: [
        "25 analysis credits",
        "Advanced categorization",
        "Detailed anomaly insights",
        "PDF & CSV export",
        "Priority email support",
        "12 months validity",
        "10% savings"
      ],
      highlighted: true,
      icon: "⚡",
      gradient: "from-primary to-secondary",
      badge: "Best Value"
    },
    {
      name: "Professional",
      credits: 50,
      price: "₹800",
      priceValue: 800,
      features: [
        "50 analysis credits",
        "Premium insights",
        "Historical trends",
        "All export formats",
        "Priority support",
        "12 months validity",
        "20% savings"
      ],
      icon: "👑",
      gradient: "from-accent to-amber-600",
      badge: "Most Popular"
    },
    {
      name: "Enterprise",
      credits: 100,
      price: "₹1,400",
      priceValue: 1400,
      features: [
        "100 analysis credits",
        "All premium features",
        "Custom integrations",
        "API access",
        "Dedicated support",
        "12 months validity",
        "30% savings"
      ],
      icon: "🚀",
      gradient: "from-purple-500 to-pink-600"
    }
  ];

  const handleChoosePlan = async (credits: number) => {
    if (!isLoggedIn) {
      onNavigate("login");
      return;
    }

    await addCredits(credits);
    onNavigate("dashboard");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-pattern">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">Credit-Based Pricing</span>
          </div>
          <h1 className="mb-4 text-5xl bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Simple, Transparent Pricing
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Buy credits in packages that fit your needs. Each bill analysis uses 1 credit.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl overflow-hidden transition-all ${
                plan.highlighted ? "shadow-2xl scale-[1.02]" : "hover:shadow-xl"
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5`} />

              {plan.badge && (
                <div className="absolute top-0 inset-x-0 h-10 gradient-primary flex items-center justify-center text-white text-sm">
                  {plan.badge}
                </div>
              )}

              <div
                className={`relative bg-card border-2 rounded-3xl ${
                  plan.highlighted ? "border-primary" : "border-border"
                } ${plan.badge ? "pt-16 p-6" : "p-6"}`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-2xl mb-4`}
                >
                  {plan.icon}
                </div>

                <div className="mb-2">
                  <span className="text-5xl">{plan.price}</span>
                </div>

                <p className="mb-6 text-lg">
                  {plan.credits} Credits
                </p>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-sm text-muted-foreground">
                      <Check className="h-4 w-4 text-primary mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full h-11 ${
                    plan.highlighted
                      ? "gradient-primary text-white"
                      : `bg-gradient-to-r ${plan.gradient} text-white`
                  }`}
                  onClick={() => handleChoosePlan(plan.credits)}
                >
                  Buy Credits
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
