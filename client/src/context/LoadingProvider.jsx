import { useCallback, useMemo, useState } from "react";
import GlobalLoader from "../components/ui/GlobalLoader";
import LoadingContext from "./LoadingContext";

function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);

  const startLoading = useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
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
