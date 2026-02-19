import { useCallback, useMemo, useState } from "react";
import GlobalLoader from "../components/ui/GlobalLoader";
import LoadingContext from "./LoadingContext";

function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = useState(0);
  const isLoading = loadingCount > 0;

  const startLoading = useCallback(() => {
    setLoadingCount((prev) => prev + 1);
  }, []);

  const stopLoading = useCallback(() => {
    setLoadingCount((prev) => Math.max(prev - 1, 0));
  }, []);

  const value = useMemo(
    () => ({
      isLoading,
      startLoading,
      stopLoading,
    }),
    [isLoading, startLoading, stopLoading],
  );

  return (
    <LoadingContext.Provider value={value}>
      {children}
      <GlobalLoader isLoading={isLoading} />
    </LoadingContext.Provider>
  );
}

export default LoadingProvider;
