
import React from 'react';
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'minimal';
}

export const Logo: React.FC<LogoProps> = ({ 
  className, 
  size = 'md', 
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className={cn("relative", sizeClasses[size])}>
        <div className="absolute inset-0 bg-time-blue rounded-full blur-[10px] opacity-30 animate-pulse-subtle"></div>
        <svg 
          className={cn("relative z-10", sizeClasses[size])} 
          viewBox="0 0 40 40" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="20" cy="20" r="16" stroke="url(#logo-gradient)" strokeWidth="2" />
          <path 
            d="M20 10V20L26 26" 
            stroke="url(#logo-gradient)" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <defs>
            <linearGradient id="logo-gradient" x1="4" y1="4" x2="36" y2="36" gradientUnits="userSpaceOnUse">
              <stop stopColor="#5E97F6" />
              <stop offset="1" stopColor="#9B7AEA" />
            </linearGradient>
          </defs>
        </svg>
      </div>
      {variant === 'default' && (
        <span className={cn(
          "font-display font-medium tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-time-blue to-time-purple",
          {
            'text-lg': size === 'sm',
            'text-xl': size === 'md',
            'text-2xl': size === 'lg',
          }
        )}>
          TimeSeal
        </span>
      )}
    </div>
  );
};

export default Logo;
