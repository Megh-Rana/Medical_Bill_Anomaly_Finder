import { FileSearch, BarChart3, ArrowRight, Shield, Zap, CheckCircle2, Edit3 } from "lucide-react";
import { Button } from "./ui/button";

interface LandingPageProps {
  onNavigate: (page: string) => void;
  isLoggedIn?: boolean;
}

export function LandingPage({ onNavigate, isLoggedIn }: LandingPageProps) {
  const handleGetStarted = () => {
    if (isLoggedIn) {
      onNavigate('dashboard');
    } else {
      onNavigate('login');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm text-primary">Medical Bill Analysis</span>
            </div>
            
            <h1 className="mb-6 text-5xl sm:text-6xl lg:text-7xl text-foreground">
              A smarter way to review <br/>medical bills
            </h1>
            
            <p className="text-muted-foreground mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Understand medical billing patterns through structured analysis. Get clear insights in minutes.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-secondary text-white hover:bg-secondary/90 px-8 py-6 rounded-lg group"
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate('pricing')}
                className="px-8 py-6 rounded-lg border-2 hover:bg-primary/5"
              >
                View Pricing
              </Button>
            </div>

            {/* Hero Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl mb-1 text-primary">10k+</div>
                <div className="text-sm text-muted-foreground">Bills Analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1 text-secondary">98%</div>
                <div className="text-sm text-muted-foreground">Accuracy Rate</div>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-1 text-accent">5min</div>
                <div className="text-sm text-muted-foreground">Avg. Analysis</div>
              </div>
            </div>
          </div>

          {/* Hero Visual Card */}
          <div className="bg-card rounded-lg p-8 border border-border shadow-sm">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-primary/5 rounded-lg p-6 border border-primary/20">
                <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2">Secure & Private</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level encryption for all your medical data
                </p>
              </div>

              <div className="bg-secondary/5 rounded-lg p-6 border border-secondary/20">
                <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2">Lightning Fast</h3>
                <p className="text-sm text-muted-foreground">
                  Get detailed insights in under 5 minutes
                </p>
              </div>

              <div className="bg-accent/10 rounded-lg p-6 border border-accent/30">
                <div className="w-12 h-12 rounded-lg bg-[#D4A574] flex items-center justify-center mb-4">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <h3 className="mb-2">Highly Accurate</h3>
                <p className="text-sm text-muted-foreground">
                  Analysis with 98% accuracy rate
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg">
              Three simple steps to understand your medical bills
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="relative">
              <div className="bg-card rounded-lg p-8 border border-border shadow-sm h-full">
                <div className="inline-flex w-10 h-10 rounded-lg bg-primary/10 items-center justify-center text-primary mb-6">
                  1
                </div>
                <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-6">
                  <Edit3 className="h-7 w-7 text-primary" />
                </div>
                <h3 className="mb-3">Enter your bill</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Add bill details item by item. Simple and straightforward data entry.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-lg p-8 border border-border shadow-sm h-full">
                <div className="inline-flex w-10 h-10 rounded-lg bg-secondary/10 items-center justify-center text-secondary mb-6">
                  2
                </div>
                <div className="w-14 h-14 rounded-lg bg-secondary/10 flex items-center justify-center mb-6">
                  <FileSearch className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="mb-3">Analysis runs</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Our system categorizes items and compares against standard billing patterns.
                </p>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-lg p-8 border border-border shadow-sm h-full">
                <div className="inline-flex w-10 h-10 rounded-lg bg-accent/20 items-center justify-center text-[#8B6F3F] mb-6">
                  3
                </div>
                <div className="w-14 h-14 rounded-lg bg-accent/20 flex items-center justify-center mb-6">
                  <BarChart3 className="h-7 w-7 text-[#8B6F3F]" />
                </div>
                <h3 className="mb-3">Get insights</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Receive clear, actionable insights with categorization and anomaly detection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="mb-4">
              Why MBAF Exists
            </h2>
          </div>
          
          <div className="bg-card rounded-lg p-10 border border-border shadow-sm">
            <div className="space-y-6 text-lg">
              <p className="text-muted-foreground leading-relaxed">
                Medical billing is complex, and understanding the charges on your bill can be challenging. 
                The Medical Bill Analysis Framework helps users review and understand their billing data 
                through structured analysis and comparison with reference datasets.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                This tool provides analytical insights to help you better understand billing patterns. 
                It does not provide medical advice, legal conclusions, or accusations. Our goal is to 
                bring clarity and transparency to medical billing data, empowering you with knowledge.
              </p>
              <div className="grid sm:grid-cols-2 gap-4 pt-6">
                <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/10">
                  <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-1">Neutral Analysis</h4>
                    <p className="text-sm text-muted-foreground">Objective insights without bias</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-4 bg-secondary/5 rounded-lg border border-secondary/10">
                  <CheckCircle2 className="h-5 w-5 text-secondary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="mb-1">Data-Driven</h4>
                    <p className="text-sm text-muted-foreground">Based on real reference data</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-primary/5 rounded-lg p-12 text-center border border-primary/20">
            <h2 className="mb-4">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground mb-8 text-lg">
              Join thousands of users who trust MBAF for bill analysis
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-secondary text-white hover:bg-secondary/90 px-8 py-6 rounded-lg"
            >
              Start Analyzing Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}