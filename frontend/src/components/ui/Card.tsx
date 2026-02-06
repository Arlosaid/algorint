import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  id?: string;
}

/**
 * Card Component
 * ==============
 * Contenedor con estilo de tarjeta.
 * 
 * Características:
 * - Fondo oscuro con borde sutil
 * - Opción de efecto hover
 * - Padding configurable
 */
export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  padding = 'md',
  id,
}) => {
  const baseClasses = `
    bg-dark-800 rounded-xl border border-dark-700 
    shadow-lg transition-all duration-300
  `;

  const hoverClasses = hover ? `
    hover:border-primary-500/50 hover:shadow-glow 
    hover:-translate-y-1 cursor-pointer
  ` : '';

  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  return (
    <div
      id={id}
      className={`${baseClasses} ${hoverClasses} ${paddingClasses[padding]} ${className}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {children}
    </div>
  );
};

export default Card;
