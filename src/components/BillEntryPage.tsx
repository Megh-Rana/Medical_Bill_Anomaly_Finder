import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

interface BillItem {
  id: number;
  name: string;
  price: string;
  quantity: string;
  total: number;
}

interface BillEntryPageProps {
  onNavigate: (page: string) => void;
  billItems: any[];
  setBillItems: (items: any[]) => void;
}

export function BillEntryPage({ onNavigate, billItems: externalBillItems, setBillItems: setExternalBillItems }: BillEntryPageProps) {
  const [items, setItems] = useState<BillItem[]>([
    { id: 1, name: "", price: "", quantity: "", total: 0 }
  ]);

  const calculateTotal = (price: string, quantity: string): number => {
    const p = parseFloat(price) || 0;
    const q = parseFloat(quantity) || 0;
    return p * q;
  };

  const handleItemChange = (id: number, field: keyof BillItem, value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'price' || field === 'quantity') {
          updated.total = calculateTotal(updated.price, updated.quantity);
        }
        return updated;
      }
      return item;
    }));
  };

  const addRow = () => {
    const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
    setItems([...items, { id: newId, name: "", price: "", quantity: "", total: 0 }]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const grandTotal = items.reduce((sum, item) => sum + item.total, 0);

  const handleSubmit = () => {
    // Save items and navigate directly to categorization (instant)
    const validItems = items.filter(item => item.name.trim() !== "");
    setExternalBillItems(validItems);
    onNavigate('categorization');
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-3">Enter Your Bill Details</h1>
          <p className="text-muted-foreground">
            Add each item from your medical bill below. We'll analyze it for you.
          </p>
        </div>

        {/* Bill Entry Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/30 border-b border-border">
                <tr>
                  <th className="text-left p-4 text-sm text-muted-foreground w-16">Sr. No.</th>
                  <th className="text-left p-4 text-sm text-muted-foreground">Item Name</th>
                  <th className="text-left p-4 text-sm text-muted-foreground w-32">Price (₹)</th>
                  <th className="text-left p-4 text-sm text-muted-foreground w-28">Quantity</th>
                  <th className="text-left p-4 text-sm text-muted-foreground w-32">Total (₹)</th>
                  <th className="w-16"></th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors">
                    <td className="p-4 text-sm text-muted-foreground">
                      {index + 1}
                    </td>
                    <td className="p-4">
                      <Input
                        type="text"
                        value={item.name}
                        onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                        placeholder="e.g., Blood Test, X-Ray, Consultation"
                        className="border-transparent focus:border-primary bg-transparent"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.price}
                        onChange={(e) => handleItemChange(item.id, 'price', e.target.value)}
                        placeholder="0.00"
                        className="border-transparent focus:border-primary bg-transparent"
                        min="0"
                        step="0.01"
                      />
                    </td>
                    <td className="p-4">
                      <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.id, 'quantity', e.target.value)}
                        placeholder="1"
                        className="border-transparent focus:border-primary bg-transparent"
                        min="1"
                      />
                    </td>
                    <td className="p-4 text-sm">
                      ₹{item.total.toFixed(2)}
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => removeRow(item.id)}
                        disabled={items.length === 1}
                        className="text-muted-foreground hover:text-destructive disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-muted/20 border-t-2 border-border">
                <tr>
                  <td colSpan={4} className="p-4 text-right">
                    <strong>Grand Total</strong>
                  </td>
                  <td className="p-4">
                    <strong>₹{grandTotal.toFixed(2)}</strong>
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-4">
          <Button
            onClick={addRow}
            variant="outline"
            className="border-primary text-primary hover:bg-primary/5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Row
          </Button>

          <div className="flex gap-4">
            <Button
              onClick={() => onNavigate('dashboard')}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={items.filter(i => i.name.trim() !== "").length === 0}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Analyze Bill
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}