import { createPortal } from "react-dom";

export function PrintPortal({ children }: { children: React.ReactNode }) {
  return createPortal(
    <div
      id="print-portal-root"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: "hidden",
        pointerEvents: "none"
      }}
    >
      {children}
    </div>,
    document.body
  );
}
