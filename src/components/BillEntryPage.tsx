import { useState } from "react";
import { Plus, Trash2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBill } from "@/context/BillContext";

interface BillItem {
  id: number;
  name: string;
  unit_price: string;
  quantity: string;
  total_price: string;
}

interface BillEntryPageProps {
  onNavigate: (page: string) => void;
}

export function BillEntryPage({ onNavigate }: BillEntryPageProps) {
  const { setBillItems, billName, setBillName } = useBill();

  const [items, setItems] = useState<BillItem[]>([
    { id: 1, name: "", unit_price: "", quantity: "", total_price: "" }
  ]);

  const handleChange = (
    id: number,
    field: keyof BillItem,
    value: string
  ) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const addRow = () => {
    const newId = Math.max(...items.map(i => i.id)) + 1;
    setItems([
      ...items,
      { id: newId, name: "", unit_price: "", quantity: "", total_price: "" }
    ]);
  };

  const removeRow = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleSubmit = () => {
    const validItems = items
      .filter(i => i.name.trim())
      .map(i => ({
        item_name: i.name,
        quantity: Number(i.quantity),
        unit_price: Number(i.unit_price),
        total_price: Number(i.total_price),
        category: undefined
      }));

    setBillItems(validItems);
    onNavigate("categorization");
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl mb-2">Enter Bill Details</h1>
          <p className="text-muted-foreground">
            Enter values exactly as shown on the hospital bill.  
            Totals may differ from unit × quantity.
          </p>
        </div>

        {/* Bill name (NEW, styling untouched) */}
        <div>
          <Input
            placeholder="Bill name (e.g. Apollo Hospital – Blood Tests)"
            value={billName}
            onChange={e => setBillName(e.target.value)}
          />
        </div>

        {/* Table */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4 text-left w-12">#</th>
                <th className="p-4 text-left">Item</th>
                <th className="p-4 text-left w-36">Unit Price (₹)</th>
                <th className="p-4 text-left w-28">Qty</th>
                <th className="p-4 text-left w-40">Total (₹)</th>
                <th className="p-4 w-12" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => (
                <tr
                  key={item.id}
                  className="border-t hover:bg-muted/10 transition-colors"
                >
                  <td className="p-4 text-muted-foreground">
                    {idx + 1}
                  </td>

                  <td className="p-4">
                    <Input
                      placeholder="e.g. Crocin 500 Tablet"
                      value={item.name}
                      onChange={e =>
                        handleChange(item.id, "name", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-4">
                    <Input
                      type="number"
                      placeholder="0.00"
                      value={item.unit_price}
                      onChange={e =>
                        handleChange(item.id, "unit_price", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-4">
                    <Input
                      type="number"
                      placeholder="1"
                      value={item.quantity}
                      onChange={e =>
                        handleChange(item.id, "quantity", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-4">
                    <Input
                      type="number"
                      placeholder="As billed"
                      value={item.total_price}
                      onChange={e =>
                        handleChange(item.id, "total_price", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-4">
                    <button
                      onClick={() => removeRow(item.id)}
                      disabled={items.length === 1}
                      className="text-muted-foreground hover:text-destructive disabled:opacity-30"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={addRow}>
            <Plus className="h-4 w-4 mr-2" />
            Add Item
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={items.every(i => !i.name.trim())}
            className="px-6"
          >
            Analyze Bill
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
