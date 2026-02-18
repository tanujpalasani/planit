import { cn } from "./utils";

const variantClasses = {
  primary:
    "bg-gradient-primary text-white shadow-glow hover:opacity-95 active:scale-[0.98]",
  secondary:
    "border border-white/10 bg-white/5 text-white hover:bg-white/10 active:scale-[0.98]",
  ghost:
    "border border-transparent bg-transparent text-textSecondary hover:bg-white/5 hover:text-white active:scale-[0.98]",
  danger:
    "bg-red-500/90 text-white hover:bg-red-500 active:scale-[0.98]",
};

const sizeClasses = {
  sm: "h-9 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  children,
  onClick,
  type = "button",
  className,
  ...rest
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-purple-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-primary",
        "disabled:pointer-events-none disabled:opacity-60",
        variantClasses[variant] || variantClasses.primary,
        sizeClasses[size] || sizeClasses.md,
        className,
      )}
      {...rest}
    >
      {loading ? (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
          aria-hidden="true"
        />
      ) : (
        leftIcon && <span className="shrink-0" aria-hidden="true">{leftIcon}</span>
      )}

      <span>{children}</span>

      {!loading && rightIcon && (
        <span className="shrink-0" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
}

export default Button;