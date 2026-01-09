import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    loading?: boolean;
    icon?: ReactNode;
    children: ReactNode;
    className?: string;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    loading = false,
    icon,
    children,
    className = '',
    disabled,
    type = 'button',
    onClick,
}: ButtonProps) {
    const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900';

    const variantClasses = {
        primary: 'bg-gradient-to-r from-pink-600 to-cyan-600 text-white hover:from-pink-500 hover:to-cyan-500 focus:ring-pink-500 shadow-lg hover:shadow-pink-500/25',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600 focus:ring-slate-500 border border-slate-600',
        outline: 'border-2 border-cyan-500 text-cyan-400 hover:bg-cyan-500/10 focus:ring-cyan-500',
        ghost: 'text-gray-300 hover:text-white hover:bg-slate-700/50 focus:ring-slate-500',
        danger: 'bg-red-600 text-white hover:bg-red-500 focus:ring-red-500',
    };

    const sizeClasses = {
        sm: 'px-3 py-1.5 text-sm gap-1.5',
        md: 'px-5 py-2.5 text-base gap-2',
        lg: 'px-7 py-3.5 text-lg gap-2.5',
    };

    const isDisabled = disabled || loading;

    return (
        <motion.button
            whileHover={{ scale: isDisabled ? 1 : 1.02 }}
            whileTap={{ scale: isDisabled ? 1 : 0.98 }}
            type={type}
            onClick={onClick}
            className={`
        ${baseClasses}
        ${variantClasses[variant]}
        ${sizeClasses[size]}
        ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
            disabled={isDisabled}
        >
            {loading ? (
                <motion.div
                    className="w-5 h-5 border-2 border-current border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                />
            ) : icon ? (
                <span className="flex-shrink-0">{icon}</span>
            ) : null}
            {children}
        </motion.button>
    );
}
