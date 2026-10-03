import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
  hoverEffect?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  glow = false,
  hoverEffect = true,
}) => {
  return (
    <div
      className={`relative rounded-3xl bg-white border border-slate-200/80 p-6 sm:p-8 shadow-xl shadow-slate-200/50 transition-all duration-300 ${
        hoverEffect ? 'hover:border-brand-blue/40 hover:shadow-2xl hover:shadow-brand-blue/10 hover:-translate-y-1' : ''
      } ${className}`}
    >
      {glow && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-blue via-brand-purple to-brand-orange rounded-t-3xl" />
      )}
      {children}
    </div>
  );
};
