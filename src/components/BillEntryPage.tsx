import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, ArrowRight, Building2, MapPin, Stethoscope } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useBill } from "@/context/BillContext";
import { AutocompleteInput } from "./AutocompleteInput";

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

// Common Indian cities for the dropdown
const COMMON_CITIES = [
  "Mumbai", "Delhi", "Bangalore", "Chennai", "Hyderabad", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Chandigarh", "Gurgaon",
  "Noida", "Bhopal", "Indore", "Nagpur", "Patna", "Kochi", "Coimbatore"
];

export function BillEntryPage({ onNavigate }: BillEntryPageProps) {
  const { setBillItems, billName, setBillName, surgeryContext, setSurgeryContext } = useBill();

  const [items, setItems] = useState<BillItem[]>([
    { id: 1, name: "", unit_price: "", quantity: "", total_price: "" }
  ]);

  // Toggle between medicine and surgery bill
  const isSurgeryBill = surgeryContext.billType === "surgery";

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

  // Calculate total for an item
  const calculateTotal = (unitPrice: string, quantity: string): string => {
    const price = parseFloat(unitPrice) || 0;
    const qty = parseFloat(quantity) || 0;
    if (price && qty) {
      return (price * qty).toFixed(2);
    }
    return "";
  };

  const handleSubmit = () => {
    const validItems = items
      .filter(i => i.name.trim())
      .map(i => {
        // Default quantity to 1 if not specified
        const qty = i.quantity.trim() ? Number(i.quantity) : 1;
        const unitPrice = Number(i.unit_price) || 0;

        // Use billed total if provided, otherwise fall back to calculated total
        const billedTotal = i.total_price.trim()
          ? Number(i.total_price)
          : unitPrice * qty;

        return {
          item_name: i.name,
          quantity: qty,
          unit_price: unitPrice,
          total_price: billedTotal,
          category: undefined
        };
      });

    setBillItems(validItems);
    onNavigate("categorization");
  };

  const toggleBillType = () => {
    setSurgeryContext(prev => ({
      ...prev,
      billType: prev.billType === "medicine" ? "surgery" : "medicine"
    }));
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

        {/* Bill Type Toggle */}
        <div className="flex items-center gap-4 p-4 bg-card border rounded-xl">
          <span className="text-sm font-medium">Bill Type:</span>
          <div className="flex rounded-lg overflow-hidden border">
            <button
              onClick={() => setSurgeryContext(prev => ({ ...prev, billType: "medicine" }))}
              className={`px-4 py-2 text-sm font-medium transition-colors ${!isSurgeryBill
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
                }`}
            >
              Medicine Bill
            </button>
            <button
              onClick={() => setSurgeryContext(prev => ({ ...prev, billType: "surgery" }))}
              className={`px-4 py-2 text-sm font-medium transition-colors ${isSurgeryBill
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
                }`}
            >
              Surgery Bill
            </button>
          </div>
        </div>

        {/* Bill name */}
        <div>
          <Input
            placeholder="Bill name (e.g. Apollo Hospital – Blood Tests)"
            value={billName}
            onChange={e => setBillName(e.target.value)}
          />
        </div>

        {/* Surgery Context Fields - Only show for surgery bills */}
        {isSurgeryBill && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-card border rounded-xl">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                Hospital Name
              </label>
              <Input
                placeholder="e.g. Apollo Hospital"
                value={surgeryContext.hospitalName}
                onChange={e => setSurgeryContext(prev => ({ ...prev, hospitalName: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                City
              </label>
              <select
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={surgeryContext.hospitalCity}
                onChange={e => setSurgeryContext(prev => ({ ...prev, hospitalCity: e.target.value }))}
              >
                <option value="">Select city...</option>
                {COMMON_CITIES.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Stethoscope className="h-4 w-4 text-muted-foreground" />
                Primary Surgery/Procedure
              </label>
              <Input
                placeholder="e.g. Laparoscopic Cholecystectomy"
                value={surgeryContext.primarySurgery}
                onChange={e => setSurgeryContext(prev => ({ ...prev, primarySurgery: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hospital Accreditation</label>
              <select
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={surgeryContext.hospitalAccreditation}
                onChange={e => setSurgeryContext(prev => ({
                  ...prev,
                  hospitalAccreditation: e.target.value as "none" | "nabh" | "jci"
                }))}
              >
                <option value="none">None / Unknown</option>
                <option value="nabh">NABH Accredited</option>
                <option value="jci">JCI Accredited</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Room Category</label>
              <select
                className="w-full h-10 px-3 py-2 rounded-md border border-input bg-background text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                value={surgeryContext.roomCategory}
                onChange={e => setSurgeryContext(prev => ({ ...prev, roomCategory: e.target.value }))}
              >
                <option value="">Select room type...</option>
                <option value="general_ward">General Ward</option>
                <option value="semi_private">Semi-Private</option>
                <option value="private">Private Room</option>
                <option value="deluxe">Deluxe Room</option>
                <option value="suite">Suite</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-card border rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-muted/40">
              <tr>
                <th className="p-4 text-left w-12">#</th>
                <th className="p-4 text-left">Item</th>
                <th className="p-4 text-left w-32">Unit Price (₹)</th>
                <th className="p-4 text-left w-24">Qty</th>
                <th className="p-4 text-left w-32">Calculated</th>
                <th className="p-4 text-left w-32">Billed Total (₹)</th>
                <th className="p-4 w-12" />
              </tr>
            </thead>
            <tbody>
              {items.map((item, idx) => {
                const calculatedTotal = calculateTotal(item.unit_price, item.quantity);
                const billedTotal = parseFloat(item.total_price) || 0;
                const calcTotal = parseFloat(calculatedTotal) || 0;
                const hasMismatch = calculatedTotal && item.total_price &&
                  Math.abs(billedTotal - calcTotal) > 0.01;

                return (
                  <tr
                    key={item.id}
                    className="border-t hover:bg-muted/10 transition-colors"
                  >
                    <td className="p-4 text-muted-foreground">
                      {idx + 1}
                    </td>

                    <td className="p-4">
                      <AutocompleteInput
                        placeholder="e.g. Crocin 500 Tablet"
                        value={item.name}
                        onChange={(value) =>
                          handleChange(item.id, "name", value)
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

                    {/* Calculated Total - Read Only */}
                    <td className="p-4">
                      <div className={`h-10 px-3 py-2 rounded-md border bg-muted/30 text-sm flex items-center ${hasMismatch ? "border-amber-500 text-amber-600" : "border-input text-muted-foreground"
                        }`}>
                        {calculatedTotal ? `₹${calculatedTotal}` : "—"}
                      </div>
                    </td>

                    <td className="p-4">
                      <Input
                        type="number"
                        placeholder="As billed"
                        value={item.total_price}
                        onChange={e =>
                          handleChange(item.id, "total_price", e.target.value)
                        }
                        className={hasMismatch ? "border-amber-500" : ""}
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
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mismatch Legend */}
        <div className="text-sm text-muted-foreground flex items-center gap-2">
          <div className="w-3 h-3 rounded border-2 border-amber-500"></div>
          <span>Amber highlight indicates calculated total differs from billed total</span>
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
