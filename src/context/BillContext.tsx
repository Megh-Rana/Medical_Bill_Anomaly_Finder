import { createContext, useContext, useState } from "react";

export type BillItem = {
  item_name: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
  category?: string;
};

export type AnalysisResult = {
  classified_items: BillItem[];
  anomalies: any[];
};

type BillContextType = {
  // bill items
  billItems: BillItem[];
  setBillItems: React.Dispatch<React.SetStateAction<BillItem[]>>;

  // bill name
  billName: string;
  setBillName: React.Dispatch<React.SetStateAction<string>>;

  // analysis result
  analysis: AnalysisResult | null;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;

  // declared total
  declaredTotal: number | null;
  setDeclaredTotal: React.Dispatch<React.SetStateAction<number | null>>;

  resetBill: () => void;
};

const BillContext = createContext<BillContextType | null>(null);

export function BillProvider({ children }: { children: React.ReactNode }) {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [billName, setBillName] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [declaredTotal, setDeclaredTotal] = useState<number | null>(null);

  const resetBill = () => {
    setBillItems([]);
    setAnalysis(null);
    setBillName("");
  };
  return (
    <BillContext.Provider
      value={{
        billItems,
        setBillItems,

        billName,
        setBillName,

        analysis,
        setAnalysis,

        declaredTotal,
        setDeclaredTotal,

        resetBill
      }}
    >
      {children}
    </BillContext.Provider>
  );
}

export function useBill() {
  const ctx = useContext(BillContext);
  if (!ctx) {
    throw new Error("useBill must be used inside BillProvider");
  }
  return ctx;
}
