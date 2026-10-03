import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  isLoading = false,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'relative inline-flex items-center justify-center font-extrabold tracking-wider uppercase transition-all duration-300 rounded-full focus:outline-none focus:ring-2 focus:ring-brand-navy/40 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group';

  const variantStyles = {
    primary:
      'bg-gradient-to-r from-brand-navy via-[#003B66] to-brand-orange text-white shadow-lg shadow-brand-navy/20 hover:shadow-xl hover:shadow-brand-orange/30 hover:scale-[1.03] active:scale-[0.97]',
    secondary:
      'bg-white text-brand-navy border-2 border-brand-navy/20 hover:border-brand-orange hover:text-brand-orange shadow-md hover:shadow-lg hover:scale-[1.03] active:scale-[0.97]',
    outline:
      'bg-transparent text-brand-navy border-2 border-brand-navy hover:bg-brand-navy hover:text-white hover:scale-[1.03] active:scale-[0.97]',
    ghost:
      'bg-transparent text-slate-700 hover:text-brand-orange hover:bg-slate-100',
  };

  const sizeStyles = {
    sm: 'px-4 py-2 text-xs gap-1.5',
    md: 'px-6 py-3 text-xs sm:text-sm gap-2',
    lg: 'px-8 py-4 text-sm sm:text-base gap-2.5 tracking-widest',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {/* Shine Line */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />

      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : Icon && iconPosition === 'left' ? (
        <Icon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
      ) : null}

      <span>{children}</span>

      {!isLoading && Icon && iconPosition === 'right' && (
        <Icon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      )}
    </button>
  );
};
