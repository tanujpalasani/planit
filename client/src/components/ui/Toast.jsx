import { X } from "lucide-react";
import { cn } from "./utils";

const typeStyles = {
  success: "border-emerald-400/30 bg-emerald-400/10 text-emerald-100",
  error: "border-red-400/30 bg-red-400/10 text-red-100",
  warning: "border-amber-400/30 bg-amber-400/10 text-amber-100",
  info: "border-blue-400/30 bg-blue-400/10 text-blue-100",
};

function Toast({ toasts, closingIds, onClose }) {
  if (!toasts.length) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[70] flex w-full max-w-sm flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          role="alert"
          className={cn(
            "pointer-events-auto rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-xl",
            "shadow-xl transition-all duration-300",
            closingIds.includes(toast.id)
              ? "translate-x-4 scale-95 opacity-0"
              : "translate-x-0 scale-100 opacity-100",
            typeStyles[toast.type] || typeStyles.info,
          )}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-sm font-medium text-white">{toast.message}</p>

            <button
              type="button"
              onClick={() => onClose(toast.id)}
              className="rounded-md p-1 text-white/70 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              aria-label="Close notification"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Toast;
