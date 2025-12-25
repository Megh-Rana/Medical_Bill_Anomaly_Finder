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
  billItems: BillItem[];
  setBillItems: React.Dispatch<React.SetStateAction<BillItem[]>>;

  analysis: AnalysisResult | null;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;

  declaredTotal: number | null;
  setDeclaredTotal: React.Dispatch<React.SetStateAction<number | null>>;
};

const BillContext = createContext<BillContextType | null>(null);

export function BillProvider({ children }: { children: React.ReactNode }) {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  const [declaredTotal, setDeclaredTotal] = useState<number | null>(null);

  return (
    <BillContext.Provider
      value={{
        billItems,
        setBillItems,
        analysis,
        setAnalysis,
        declaredTotal,
        setDeclaredTotal
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
