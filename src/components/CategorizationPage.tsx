import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface CategorizedItem {
  id: number;
  name: string;
  price: string;
  quantity: string;
  total: number;
  category: "medicine" | "diagnostic" | "other";
}

interface CategorizationPageProps {
  onNavigate: (page: string) => void;
  billItems: any[];
  setBillItems: (items: any[]) => void;
}

export function CategorizationPage({ onNavigate, billItems, setBillItems }: CategorizationPageProps) {
  const [categorizedItems, setCategorizedItems] = useState<CategorizedItem[]>([]);

  useEffect(() => {
    // Auto-categorize items (simple mock logic)
    const autoCategorizeBillItems = billItems.map(item => {
      const nameLower = item.name.toLowerCase();
      let category: "medicine" | "diagnostic" | "other" = "other";

      if (nameLower.includes("tablet") || nameLower.includes("syrup") || nameLower.includes("capsule") || nameLower.includes("medicine") || nameLower.includes("injection")) {
        category = "medicine";
      } else if (nameLower.includes("test") || nameLower.includes("x-ray") || nameLower.includes("scan") || nameLower.includes("ultrasound") || nameLower.includes("mri") || nameLower.includes("ct") || nameLower.includes("blood") || nameLower.includes("urine")) {
        category = "diagnostic";
      }

      return {
        ...item,
        category
      };
    });

    setCategorizedItems(autoCategorizeBillItems);
  }, [billItems]);

  const handleCategoryChange = (id: number, newCategory: "medicine" | "diagnostic" | "other") => {
    setCategorizedItems(items =>
      items.map(item => item.id === id ? { ...item, category: newCategory } : item)
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "medicine":
        return "bg-success/10 text-success border-success/30 dark:bg-success/20 dark:text-success dark:border-success/40";
      case "diagnostic":
        return "bg-secondary/10 text-secondary border-secondary/30 dark:bg-secondary/20 dark:text-secondary dark:border-secondary/40";
      case "other":
        return "bg-accent/10 text-accent border-accent/30 dark:bg-accent/20 dark:text-accent dark:border-accent/40";
      default:
        return "";
    }
  };

  const getCategoryLabel = (category: string) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  const handleContinue = () => {
    setBillItems(categorizedItems);
    onNavigate('processing');
  };

  const groupedByCategory = {
    medicine: categorizedItems.filter(item => item.category === "medicine"),
    diagnostic: categorizedItems.filter(item => item.category === "diagnostic"),
    other: categorizedItems.filter(item => item.category === "other")
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3">Review Categorization</h1>
          <p className="text-muted-foreground">
            We've automatically categorized your bill items. You can adjust the categories if needed.
          </p>
        </div>

        {/* Categorized Items */}
        <div className="space-y-8 mb-8">
          {Object.entries(groupedByCategory).map(([category, items]) => {
            if (items.length === 0) return null;
            
            return (
              <div key={category} className="bg-card rounded-lg border border-border overflow-hidden">
                <div className="p-6 border-b border-border bg-muted/20">
                  <div className="flex items-center justify-between">
                    <h2>{getCategoryLabel(category)}</h2>
                    <span className={`px-3 py-1 rounded-full text-sm border ${getCategoryColor(category)}`}>
                      {items.length} {items.length === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted/10 border-b border-border">
                      <tr>
                        <th className="text-left p-4 text-sm text-muted-foreground w-16">Sr. No.</th>
                        <th className="text-left p-4 text-sm text-muted-foreground">Item Name</th>
                        <th className="text-left p-4 text-sm text-muted-foreground w-32">Price (₹)</th>
                        <th className="text-left p-4 text-sm text-muted-foreground w-28">Quantity</th>
                        <th className="text-left p-4 text-sm text-muted-foreground w-32">Total (₹)</th>
                        <th className="text-left p-4 text-sm text-muted-foreground w-48">Category</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/5 transition-colors">
                          <td className="p-4 text-sm text-muted-foreground">
                            {categorizedItems.findIndex(i => i.id === item.id) + 1}
                          </td>
                          <td className="p-4">{item.name}</td>
                          <td className="p-4 text-sm">₹{parseFloat(item.price).toFixed(2)}</td>
                          <td className="p-4 text-sm">{item.quantity}</td>
                          <td className="p-4 text-sm">₹{item.total.toFixed(2)}</td>
                          <td className="p-4">
                            <Select
                              value={item.category}
                              onValueChange={(value) => handleCategoryChange(item.id, value as "medicine" | "diagnostic" | "other")}
                            >
                              <SelectTrigger className="w-full border-border">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="medicine">Medicine</SelectItem>
                                <SelectItem value="diagnostic">Diagnostic</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <Button
            onClick={() => onNavigate('bill-entry')}
            variant="outline"
          >
            Back
          </Button>
          <Button
            onClick={handleContinue}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Continue to Analysis
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}