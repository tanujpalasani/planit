import { cn } from "./utils";

function GlobalLoader({ isLoading }) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm",
        "transition-opacity duration-200",
        isLoading ? "visible opacity-100" : "invisible opacity-0 pointer-events-none",
      )}
      aria-busy={isLoading}
      aria-live="polite"
    >
      <div className="rounded-xl border border-white/10 bg-white/5 p-5 backdrop-blur-xl">
        <div
          className="h-10 w-10 animate-spin rounded-full border-2 border-white/30 border-t-white"
          role="status"
          aria-label="Loading"
        />
      </div>
    </div>
  );
}

export default GlobalLoader;
