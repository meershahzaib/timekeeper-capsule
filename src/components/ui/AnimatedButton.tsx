
import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { cn } from "@/lib/utils";

interface AnimatedButtonProps extends ButtonProps {
  glowEffect?: boolean;
  hoverScale?: boolean;
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, glowEffect = true, hoverScale = true, ...props }, ref) => {
    return (
      <Button
        className={cn(
          "relative overflow-hidden transition-all duration-300", 
          glowEffect && "button-glow",
          hoverScale && "hover:scale-[1.02]",
          "shadow-button hover:shadow-button-hover",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

AnimatedButton.displayName = "AnimatedButton";

export { AnimatedButton };
