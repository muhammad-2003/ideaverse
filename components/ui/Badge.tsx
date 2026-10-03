import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'navy' | 'orange' | 'blue' | 'purple' | 'amber' | 'emerald' | 'slate';
  size?: 'sm' | 'md';
  pulse?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'navy',
  size = 'md',
  pulse = false,
  className = '',
}) => {
  const variantStyles = {
    navy: 'bg-brand-navy/10 text-brand-navy border-brand-navy/30 shadow-sm font-bold',
    orange: 'bg-brand-orange/10 text-brand-orange border-brand-orange/30 shadow-sm font-bold',
    blue: 'bg-brand-blue/10 text-brand-blue border-brand-blue/30 shadow-sm font-bold',
    purple: 'bg-purple-600/10 text-purple-700 border-purple-600/30 shadow-sm font-bold',
    amber: 'bg-amber-500/10 text-amber-700 border-amber-500/30 shadow-sm font-bold',
    emerald: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30 shadow-sm font-bold',
    slate: 'bg-slate-100 text-slate-700 border-slate-300 font-bold',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-0.5 text-[10px]',
    md: 'px-3.5 py-1 text-xs font-mono tracking-widest uppercase',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border backdrop-blur-md ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-orange"></span>
        </span>
      )}
      {children}
    </span>
  );
};
