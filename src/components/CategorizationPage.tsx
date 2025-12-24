import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "./ui/select";
import { useBill } from "@/context/BillContext";

interface CategorizedItem {
  id?: number;
  item_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  category: "medicine" | "diagnostic" | "other";
}

interface CategorizationPageProps {
  onNavigate: (page: string) => void;
}

export function CategorizationPage({ onNavigate }: CategorizationPageProps) {
  const { billItems, setBillItems } = useBill();
  const [categorizedItems, setCategorizedItems] = useState<CategorizedItem[]>([]);

  useEffect(() => {
    const auto = billItems.map(item => {
      const name = item.item_name.toLowerCase();
      let category: "medicine" | "diagnostic" | "other" = "other";

      if (
        name.includes("tablet") ||
        name.includes("capsule") ||
        name.includes("syrup") ||
        name.includes("injection")
      ) {
        category = "medicine";
      } else if (
        name.includes("test") ||
        name.includes("scan") ||
        name.includes("x-ray") ||
        name.includes("blood")
      ) {
        category = "diagnostic";
      }

      return { ...item, category };
    });

    setCategorizedItems(auto);
  }, [billItems]);

  const handleCategoryChange = (
    index: number,
    category: "medicine" | "diagnostic" | "other"
  ) => {
    setCategorizedItems(items =>
      items.map((item, i) =>
        i === index ? { ...item, category } : item
      )
    );
  };

  const handleContinue = () => {
    setBillItems(categorizedItems);
    onNavigate("processing");
  };

  if (!billItems.length) {
    onNavigate("bill-entry");
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">

        <div className="mb-10">
          <h1 className="mb-3">Review Categorization</h1>
          <p className="text-muted-foreground">
            Adjust categories if needed before analysis.
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {categorizedItems.map((item, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-lg p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-medium">{item.item_name}</p>
                <p className="text-sm text-muted-foreground">
                  ₹{item.unit_price} × {item.quantity} = ₹{item.total_price}
                </p>
              </div>

              <Select
                value={item.category}
                onValueChange={value =>
                  handleCategoryChange(index, value as any)
                }
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medicine">Medicine</SelectItem>
                  <SelectItem value="diagnostic">Diagnostic</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => onNavigate("bill-entry")}>
            Back
          </Button>
          <Button onClick={handleContinue}>
            Continue to Analysis
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
