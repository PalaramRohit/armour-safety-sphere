import React from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "solid" | "danger" | "safe" | "caution";
  padding?: "sm" | "md" | "lg" | "none";
}

const paddingMap = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const variantMap = {
  default:
    "border border-white/[0.06] backdrop-blur-md",
  solid:
    "border border-white/[0.06]",
  danger:
    "border border-danger/30 backdrop-blur-md",
  safe:
    "border border-safe/30 backdrop-blur-md",
  caution:
    "border border-caution/30 backdrop-blur-md",
};

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, variant = "default", padding = "md", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "rounded-2xl",
          variantMap[variant],
          paddingMap[padding],
          variant === "default" && "bg-card/50",
          variant === "solid" && "bg-card",
          variant === "danger" && "bg-danger/5",
          variant === "safe" && "bg-safe/5",
          variant === "caution" && "bg-caution/5",
          className
        )}
        style={{ boxShadow: "0 8px 32px rgba(0,0,0,0.4)" }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = "GlassCard";

export default GlassCard;
