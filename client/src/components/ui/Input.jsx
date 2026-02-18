import { forwardRef, useId } from "react";
import { cn } from "./utils";

const Input = forwardRef(function Input(
  { label, error, leftIcon, rightIcon, className, id, ...rest },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-textPrimary">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span
            className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-textSecondary"
            aria-hidden="true"
          >
            {leftIcon}
          </span>
        )}

        <input
          id={inputId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border bg-white/5 px-4 py-2.5 text-sm text-white placeholder:text-textSecondary/80",
            "outline-none transition-all duration-200",
            "focus:ring-1 focus:ring-purple-500",
            leftIcon && "pl-10",
            rightIcon && "pr-10",
            error
              ? "border-red-400/80 focus:border-red-400 focus:ring-red-400"
              : "border-white/10 focus:border-white/30",
            className,
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...rest}
        />

        {rightIcon && (
          <span
            className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-textSecondary"
            aria-hidden="true"
          >
            {rightIcon}
          </span>
        )}
      </div>

      {error && (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-300">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;