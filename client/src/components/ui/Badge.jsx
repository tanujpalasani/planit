import { cn } from "./utils";

const variantClasses = {
  success: "border-green-400/30 bg-green-400/15 text-green-200",
  warning: "border-amber-400/30 bg-amber-400/15 text-amber-200",
  danger: "border-red-400/30 bg-red-400/15 text-red-200",
  info: "border-blue-400/30 bg-blue-400/15 text-blue-200",
  neutral: "border-white/15 bg-white/10 text-textPrimary",
};

function Badge({ variant = "neutral", children, className, ...rest }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium leading-none transition-colors duration-200",
        variantClasses[variant] || variantClasses.neutral,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}

export default Badge;
