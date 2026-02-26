import { cn } from "./utils";

const paddingClasses = {
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

function Card({ children, className, hover = false, padding = "md", ...rest }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl",
        hover &&
          "transition-all duration-300 ease-out hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-[0_16px_40px_rgba(0,0,0,0.28)]",
        paddingClasses[padding] || paddingClasses.md,
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export default Card;
