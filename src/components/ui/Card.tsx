import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
    children: ReactNode;
    className?: string;
    hover?: boolean;
    gradient?: boolean;
}

export default function Card({ children, className = '', hover = false, gradient = false }: CardProps) {
    const baseClasses = 'bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700';
    const hoverClasses = hover ? 'transition-all duration-300 hover:border-slate-600 hover:shadow-lg hover:shadow-cyan-500/5' : '';
    const gradientClasses = gradient ? 'bg-gradient-to-br from-slate-800/80 to-slate-900/80' : '';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className={`${baseClasses} ${hoverClasses} ${gradientClasses} ${className}`}
        >
            {children}
        </motion.div>
    );
}
