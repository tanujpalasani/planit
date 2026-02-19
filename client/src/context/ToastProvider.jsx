import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Toast from "../components/ui/Toast";
import ToastContext from "./ToastContext";

const AUTO_DISMISS_MS = 4000;
const EXIT_ANIMATION_MS = 250;

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const [closingIds, setClosingIds] = useState([]);
  const timeoutRefs = useRef(new Map());

  const removeToast = useCallback((id) => {
    const dismissKey = `dismiss-${id}`;
    const removeKey = `remove-${id}`;

    if (timeoutRefs.current.has(dismissKey)) {
      clearTimeout(timeoutRefs.current.get(dismissKey));
      timeoutRefs.current.delete(dismissKey);
    }

    setClosingIds((prev) => {
      if (prev.includes(id)) {
        return prev;
      }
      return [...prev, id];
    });

    if (timeoutRefs.current.has(removeKey)) {
      clearTimeout(timeoutRefs.current.get(removeKey));
    }

    const removeTimeout = setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
      setClosingIds((prev) => prev.filter((closingId) => closingId !== id));
      timeoutRefs.current.delete(removeKey);
    }, EXIT_ANIMATION_MS);

    timeoutRefs.current.set(removeKey, removeTimeout);
  }, []);

  const addToast = useCallback(
    (message, type = "info") => {
      const id = Date.now() + Math.floor(Math.random() * 1000);
      const normalizedType = ["success", "error", "warning", "info"].includes(type)
        ? type
        : "info";

      const nextToast = {
        id,
        message,
        type: normalizedType,
      };

      setToasts((prev) => [...prev, nextToast]);

      const dismissTimeout = setTimeout(() => {
        removeToast(id);
      }, AUTO_DISMISS_MS);

      timeoutRefs.current.set(`dismiss-${id}`, dismissTimeout);

      return id;
    },
    [removeToast],
  );

  useEffect(() => {
    const activeTimeouts = timeoutRefs.current;

    return () => {
      activeTimeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      activeTimeouts.clear();
    };
  }, []);

  const value = useMemo(
    () => ({
      addToast,
      removeToast,
    }),
    [addToast, removeToast],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast toasts={toasts} closingIds={closingIds} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export default ToastProvider;
