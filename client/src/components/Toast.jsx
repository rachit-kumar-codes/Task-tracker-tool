import { useEffect } from "react";

export default function Toast({ toasts, removeToast }) {
  useEffect(() => {
    if (!toasts.length) return;

    const timer = setTimeout(() => {
      removeToast(toasts[0].id);
    }, 3000);

    return () => clearTimeout(timer);
  }, [toasts]);

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✓" : "✕"} {toast.message}
        </div>
      ))}
    </div>
  );
}
