import { useState, useCallback } from "react";

// Minimal self-contained toast — no external dependency needed.
// Usage: const { toast, showToast } = useToast(); showToast("Saved!");
export default function useToast() {
  const [toast, setToast] = useState(null); // { message, type }

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  return { toast, showToast };
}
