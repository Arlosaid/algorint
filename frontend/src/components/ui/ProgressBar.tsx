import React from 'react';
import { ProgressBarProps } from '../../types';

/**
 * ProgressBar Component
 * =====================
 * Barra de progreso animada con gradiente.
 * 
 * Uso:
 * <ProgressBar value={75} showLabel />
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = false,
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  // Calcular porcentaje
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  // Clases de tamaño
  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  // Clases de color
  const colorClasses = {
    primary: 'from-primary-500 to-primary-400',
    secondary: 'from-secondary-500 to-secondary-400',
    success: 'from-green-500 to-emerald-400',
  };

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-dark-300">Progreso</span>
          <span className="text-sm font-medium text-primary-400">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={`w-full bg-dark-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <div
          className={`h-full bg-gradient-to-r ${colorClasses[color]} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
