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
  procedure_context?: any;
};

// Surgery context for tier-based pricing
export type SurgeryContext = {
  billType: "medicine" | "surgery";
  hospitalName: string;
  hospitalCity: string;
  hospitalAccreditation: "none" | "nabh" | "jci";
  primarySurgery: string;
  roomCategory: string;
};

type BillContextType = {
  // bill items
  billItems: BillItem[];
  setBillItems: React.Dispatch<React.SetStateAction<BillItem[]>>;

  // bill name
  billName: string;
  setBillName: React.Dispatch<React.SetStateAction<string>>;

  // surgery context
  surgeryContext: SurgeryContext;
  setSurgeryContext: React.Dispatch<React.SetStateAction<SurgeryContext>>;

  // analysis result
  analysis: AnalysisResult | null;
  setAnalysis: React.Dispatch<React.SetStateAction<AnalysisResult | null>>;

  // declared total
  declaredTotal: number | null;
  setDeclaredTotal: React.Dispatch<React.SetStateAction<number | null>>;

  resetBill: () => void;
};

const defaultSurgeryContext: SurgeryContext = {
  billType: "medicine",
  hospitalName: "",
  hospitalCity: "",
  hospitalAccreditation: "none",
  primarySurgery: "",
  roomCategory: "",
};

const BillContext = createContext<BillContextType | null>(null);

export function BillProvider({ children }: { children: React.ReactNode }) {
  const [billItems, setBillItems] = useState<BillItem[]>([]);
  const [billName, setBillName] = useState<string>("");
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [declaredTotal, setDeclaredTotal] = useState<number | null>(null);
  const [surgeryContext, setSurgeryContext] = useState<SurgeryContext>(defaultSurgeryContext);

  const resetBill = () => {
    setBillItems([]);
    setAnalysis(null);
    setBillName("");
    setSurgeryContext(defaultSurgeryContext);
  };
  return (
    <BillContext.Provider
      value={{
        billItems,
        setBillItems,

        billName,
        setBillName,

        surgeryContext,
        setSurgeryContext,

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

