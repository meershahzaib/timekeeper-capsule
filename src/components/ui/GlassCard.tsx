
import React from 'react';
import { cn } from "@/lib/utils";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'subtle' | 'dark';
  hoverEffect?: boolean;
  borderEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  variant = 'default',
  hoverEffect = true,
  borderEffect = true,
  ...props
}) => {
  return (
    <div 
      className={cn(
        "rounded-2xl transition-all duration-300 overflow-hidden",
        {
          "bg-white/80 backdrop-blur-md shadow-glass": variant === 'default',
          "bg-white/60 backdrop-blur-md shadow-subtle": variant === 'subtle',
          "bg-black/30 backdrop-blur-md border-white/10 shadow-glass": variant === 'dark',
        },
        borderEffect && {
          "border border-white/20": variant !== 'dark',
          "border border-white/10": variant === 'dark',
        },
        hoverEffect && {
          "hover:shadow-glass-hover": true,
          "hover:-translate-y-1": true,
        },
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
