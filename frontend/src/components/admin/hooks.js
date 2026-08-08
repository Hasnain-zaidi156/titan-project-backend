import { useState, useEffect, useRef, useCallback } from "react";

// Safe incremental id generator: current list se agla id nikalta hai, taake
// module-level counter drift na ho (React StrictMode dev double-invoke se bachne ke liye)
export function nextId(list) {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

// Escape key par modal/popover close karne ke liye. Usage: useEscapeKey(onClose)
export function useEscapeKey(onClose) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);
}

// Shared toast-stack hook — multiple toasts queue mein lagte hain, ek dusre
// ko replace nahi karte
export function useToasts() {
  const [toasts, setToasts] = useState([]);
  const idRef = useRef(1);

  const showToast = useCallback((message, variant = "default") => {
    const id = idRef.current++;
    setToasts((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return { toasts, showToast };
}
