import { useEffect, useId, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "./utils";

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

const TRANSITION_DURATION_MS = 200;

function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = "md",
  closeOnOverlayClick = true,
}) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const titleId = useId();

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const raf = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(raf);
    }

    setIsVisible(false);
    const timer = window.setTimeout(() => setIsMounted(false), TRANSITION_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isMounted) {
      return undefined;
    }

    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isMounted, onClose]);

  useEffect(() => {
    if (!isMounted) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMounted]);

  if (typeof document === "undefined" || !isMounted) {
    return null;
  }

  const handleOverlayClick = () => {
    if (closeOnOverlayClick) {
      onClose?.();
    }
  };

  return createPortal(
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200",
        isVisible ? "opacity-100" : "opacity-0",
      )}
      aria-hidden={!isOpen}
    >
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-black/60 backdrop-blur-sm"
        aria-label="Close modal overlay"
        onClick={handleOverlayClick}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={cn(
          "relative z-10 w-full overflow-hidden rounded-xl border border-white/10",
          "bg-primary/95 shadow-2xl backdrop-blur-xl transition-all duration-200",
          isVisible ? "scale-100 translate-y-0" : "scale-95 translate-y-2",
          sizeClasses[size] || sizeClasses.md,
        )}
        onClick={(event) => event.stopPropagation()}
      >
        {(title || onClose) && (
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4">
            {title ? (
              <h2 id={titleId} className="text-lg font-semibold text-white">
                {title}
              </h2>
            ) : (
              <span />
            )}

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-textSecondary transition-colors hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-5 w-5"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
        )}

        <div className="max-h-[70vh] overflow-y-auto px-6 py-5 text-textPrimary">
          {children}
        </div>

        {footer && <div className="border-t border-white/10 px-6 py-4">{footer}</div>}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;