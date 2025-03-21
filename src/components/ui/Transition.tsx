
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface TransitionProps {
  children: React.ReactNode;
  show?: boolean;
  appear?: boolean;
  type?: 'fade' | 'scale' | 'slide' | 'none';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  className?: string;
}

export const Transition: React.FC<TransitionProps> = ({
  children,
  show = true,
  appear = true,
  type = 'fade',
  duration = 'normal',
  delay = 0,
  className,
}) => {
  const [mounted, setMounted] = useState(!appear);

  useEffect(() => {
    if (appear) {
      const timer = setTimeout(() => {
        setMounted(true);
      }, 50); // Small delay for animation
      return () => clearTimeout(timer);
    }
  }, [appear]);

  const getAnimationClasses = () => {
    const durationClass = {
      fast: 'duration-200',
      normal: 'duration-300',
      slow: 'duration-500'
    };

    const typeClass = {
      fade: mounted && show ? 'opacity-100' : 'opacity-0',
      scale: mounted && show ? 'scale-100 opacity-100' : 'scale-95 opacity-0',
      slide: mounted && show ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0',
      none: ''
    };

    return `transition-all ${durationClass[duration]} ${typeClass[type]}`;
  };

  const getDelayStyle = () => {
    return { transitionDelay: `${delay}ms` };
  };

  if (!mounted && !show) {
    return null;
  }

  return (
    <div className={cn(getAnimationClasses(), className)} style={getDelayStyle()}>
      {children}
    </div>
  );
};

export default Transition;
