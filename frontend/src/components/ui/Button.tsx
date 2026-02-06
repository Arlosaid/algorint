import React from 'react';
import { Loader2 } from 'lucide-react';
import { ButtonProps } from '../../types';

/**
 * Button Component
 * ================
 * Componente de botón reutilizable con múltiples variantes.
 * 
 * Variantes disponibles:
 * - primary: Verde principal, para acciones importantes
 * - secondary: Azul, para acciones secundarias
 * - outline: Borde sin fondo, para acciones terciarias
 * - ghost: Transparente, para acciones sutiles
 * 
 * Tamaños:
 * - sm: Pequeño (padding reducido)
 * - md: Mediano (default)
 * - lg: Grande (padding aumentado)
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  children,
  onClick,
  className = '',
}) => {
  // Clases base del botón
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900
    disabled:opacity-50 disabled:cursor-not-allowed
  `;

  // Clases según variante
  const variantClasses = {
    primary: `
      bg-primary-500 text-white 
      hover:bg-primary-600 
      focus:ring-primary-500 
      shadow-lg hover:shadow-glow
    `,
    secondary: `
      bg-secondary-500 text-white 
      hover:bg-secondary-600 
      focus:ring-secondary-500 
      shadow-lg hover:shadow-glow-blue
    `,
    outline: `
      border-2 border-dark-600 text-dark-200 
      hover:border-primary-500 hover:text-primary-400
      focus:ring-primary-500
      bg-transparent
    `,
    ghost: `
      text-dark-300 
      hover:text-white hover:bg-dark-800
      focus:ring-dark-500
      bg-transparent
    `,
  };

  // Clases según tamaño
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-4 py-2 text-base gap-2',
    lg: 'px-6 py-3 text-lg gap-2.5',
  };

  const combinedClasses = `
    ${baseClasses}
    ${variantClasses[variant]}
    ${sizeClasses[size]}
    ${className}
  `.trim().replace(/\s+/g, ' ');

  return (
    <button
      className={combinedClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
      )}
      {children}
    </button>
  );
};

export default Button;
