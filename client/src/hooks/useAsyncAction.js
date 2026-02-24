import { useCallback } from "react";
import { useLoading } from "./useLoading";
import { useToast } from "./useToast";

function useAsyncAction() {
  const { startLoading, stopLoading } = useLoading();
  const { addToast } = useToast();

  const runAsync = useCallback(
    async (asyncFunction, options = {}) => {
      const {
        successMessage,
        errorMessage,
        showSuccessToast = true,
        showErrorToast = true,
      } = options;

      startLoading();

      try {
        const result = await asyncFunction();

        if (successMessage && showSuccessToast) {
          addToast(successMessage, "success");
        }

        return result;
      } catch {
        if (showErrorToast) {
          if (errorMessage) {
            addToast(errorMessage, "error");
          } else {
            addToast("Something went wrong", "error");
          }
        }

        return undefined;
      } finally {
        stopLoading();
      }
    },
    [addToast, startLoading, stopLoading],
  );

  return { runAsync };
}

export default useAsyncAction;
