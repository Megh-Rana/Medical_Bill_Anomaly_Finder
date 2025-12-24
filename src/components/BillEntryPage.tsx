import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBill } from "@/context/BillContext";

interface BillItem {
  id: number;
  name: string;
  price: string;
  quantity: string;
  total: number;
}

interface BillEntryPageProps {
  onNavigate: (page: string) => void;
}

export function BillEntryPage({ onNavigate }: BillEntryPageProps) {
  const { setBillItems } = useBill();

  const [items, setItems] = useState<BillItem[]>([
    { id: 1, name: "", price: "", quantity: "", total: 0 }
  ]);

  const calculateTotal = (price: string, quantity: string): number => {
    const p = parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    return p * q;
  };

  const handleItemChange = (id: number, field: keyof BillItem, value: string) => {
    setItems(prev =>
      prev.map(item => {
        if (item.id === id) {
          const updated = { ...item, [field]: value };
          if (field === "price" || field === "quantity") {
            updated.total = calculateTotal(updated.price, updated.quantity);
          }
          return updated;
        }
        return item;
      })
    );
  };

  const addRow = () => {
    const newId = Math.max(...items.map(i => i.id)) + 1;
    setItems([...items, { id: newId, name: "", price: "", quantity: "", total: 0 }]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = () => {
    const validItems = items
      .filter(item => item.name.trim() !== "")
      .map(item => ({
        item_name: item.name,
        quantity: Number(item.quantity),
        unit_price: Number(item.price),
        total_price: item.total
      }));

    setBillItems(validItems);
    onNavigate("categorization");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">

        <div className="mb-12">
          <h1 className="mb-3">Enter Your Bill Details</h1>
          <p className="text-muted-foreground">
            Add each item from your medical bill below.
          </p>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="p-4 w-16">#</th>
                  <th className="p-4">Item Name</th>
                  <th className="p-4 w-32">Price (₹)</th>
                  <th className="p-4 w-28">Qty</th>
                  <th className="p-4 w-32">Total (₹)</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-border">
                    <td className="p-4 text-muted-foreground">{index + 1}</td>
                    <td className="p-4">
                      <Input
                        value={item.name}
                        onChange={e => handleItemChange(item.id, "name", e.target.value)}
                        placeholder="e.g. Crocin 500"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={e => handleItemChange(item.id, "price", e.target.value)}
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={e => handleItemChange(item.id, "quantity", e.target.value)}
                      />
                    </td>
                    <td className="p-4">₹{item.total.toFixed(2)}</td>
                    <td className="p-4">
                      <button
                        onClick={() => removeRow(item.id)}
                        disabled={items.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={4} className="p-4 text-right font-semibold">
                    Grand Total
                  </td>
                  <td className="p-4 font-semibold">
                    ₹{grandTotal.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex justify-between">
          <Button onClick={addRow} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={items.filter(i => i.name.trim()).length === 0}
          >
            Analyze Bill
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
