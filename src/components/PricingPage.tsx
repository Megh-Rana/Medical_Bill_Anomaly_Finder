import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Button } from "./ui/button";

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

  const handleChoosePlan = (planName: string) => {
    if (!isLoggedIn) {
      onNavigate('signup');
    } else {
      alert(`Purchase ${planName} credits - Payment integration would be implemented here`);
    }
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
            Buy credits in packages that fit your needs. All packages include access to our 
            AI-powered analysis framework and detailed insights.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-3xl overflow-hidden transition-all duration-300 ${
                plan.highlighted 
                  ? "transform hover:scale-105 shadow-2xl" 
                  : "hover:shadow-xl"
              }`}
            >
              {/* Background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.gradient} opacity-5`} />
              
              {/* Badge */}
              {plan.badge && (
                <div className={`absolute top-0 left-0 right-0 h-10 ${plan.highlighted ? 'gradient-primary' : `bg-gradient-to-r ${plan.gradient}`} flex items-center justify-center`}>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Sparkles className="h-4 w-4" />
                    <span>{plan.badge}</span>
                  </div>
                </div>
              )}
              
              <div className={`relative bg-card border-2 rounded-3xl ${
                plan.highlighted 
                  ? "border-primary shadow-lg" 
                  : "border-border"
              } ${plan.badge ? 'pt-16 p-6' : 'p-6'}`}>
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${plan.gradient} flex items-center justify-center text-2xl mb-4 shadow-lg`}>
                  {plan.icon}
                </div>

                {/* Price */}
                <div className="mb-2">
                  <span className="text-5xl text-foreground">
                    {plan.price}
                  </span>
                </div>

                {/* Credits */}
                <div className="mb-6">
                  <p className="text-lg text-foreground">
                    {plan.credits} {plan.credits === 1 ? 'Credit' : 'Credits'}
                  </p>
                </div>

                {/* Features */}
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${plan.gradient} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <Check className="h-2.5 w-2.5 text-white" />
                      </div>
                      <span className="text-xs text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                <Button
                  className={`w-full h-11 border-0 shadow-lg hover:shadow-xl transition-all ${
                    plan.highlighted
                      ? `gradient-primary text-white`
                      : `bg-gradient-to-r ${plan.gradient} text-white`
                  }`}
                  onClick={() => handleChoosePlan(plan.name)}
                >
                  Buy Credits
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="glass rounded-3xl border border-white/10 shadow-2xl p-10">
          <h2 className="mb-8 text-center text-3xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white">?</span>
                  </div>
                  <div>
                    <h4 className="mb-2">How do credits work?</h4>
                    <p className="text-sm text-muted-foreground">
                      Each bill analysis uses one credit. Credits are valid for 12 months 
                      from purchase date and can be used anytime during that period.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-secondary flex items-center justify-center flex-shrink-0">
                    <span className="text-white">?</span>
                  </div>
                  <div>
                    <h4 className="mb-2">Can I buy more credits?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, you can purchase additional credits at any time. Credits from all 
                      purchases are combined and each has its own 12-month validity period.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-accent flex items-center justify-center flex-shrink-0">
                    <span className="text-white">?</span>
                  </div>
                  <div>
                    <h4 className="mb-2">What formats are supported?</h4>
                    <p className="text-sm text-muted-foreground">
                      We support PDF and image files (JPG, PNG). The system can extract 
                      data from both digital and scanned documents.
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-card rounded-2xl border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white">?</span>
                  </div>
                  <div>
                    <h4 className="mb-2">Is my data secure?</h4>
                    <p className="text-sm text-muted-foreground">
                      Yes, all data is encrypted in transit and at rest with bank-level security. 
                      We never share your information with third parties.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <div className="glass rounded-3xl p-12 border border-white/10 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 animated-gradient opacity-10" />
            <div className="relative z-10">
              <h2 className="mb-4 text-3xl">Still have questions?</h2>
              <p className="text-muted-foreground mb-6 text-lg">
                Our team is here to help you choose the right package
              </p>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-primary hover:bg-primary/10 h-12 px-8"
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}