// Ye bas queue mein jitne bhi toasts hain unko render karta hai
export function ToastStack({ toasts }) {
  if (toasts.length === 0) return null;
  return (
    <div className="ta-toast-stack" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className={`ta-toast ${t.variant === "error" ? "ta-toast-error" : ""}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
