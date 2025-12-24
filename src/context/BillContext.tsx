import { createContext, useContext, useState } from "react";

type BillItem = {
  item_name: string;
  quantity?: number;
  unit_price?: number;
  total_price?: number;
};

type AnalysisResult = {
  classified_items: any[];
  anomalies: any[];
};

const BillContext = createContext<any>(null);

export function BillProvider({ children }: { children: React.ReactNode }) {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);

  return (
    <BillContext.Provider
      value={{ billItems, setBillItems, analysis, setAnalysis }}
    >
      {children}
    </BillContext.Provider>
  );
}

export function useBill() {
  return useContext(BillContext);
}
