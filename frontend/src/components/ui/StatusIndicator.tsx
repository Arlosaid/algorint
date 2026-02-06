import React from 'react';
import { CheckCircle, Circle, Clock } from 'lucide-react';
import { Status } from '../../types';

interface StatusIndicatorProps {
  status: Status;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

/**
 * StatusIndicator Component
 * =========================
 * Indicador visual del estado de una lección/ejercicio.
 * 
 * Estados:
 * - not-started: Círculo vacío (gris)
 * - in-progress: Reloj (azul)
 * - completed: Check (verde)
 */
export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
}) => {
  const sizeMap = {
    sm: 14,
    md: 18,
    lg: 24,
  };

  const iconSize = sizeMap[size];

  const statusConfig = {
    'not-started': {
      icon: Circle,
      color: 'text-dark-500',
      label: 'No iniciado',
      bgColor: 'bg-dark-700',
    },
    'in-progress': {
      icon: Clock,
      color: 'text-secondary-400',
      label: 'En progreso',
      bgColor: 'bg-secondary-500/20',
    },
    'completed': {
      icon: CheckCircle,
      color: 'text-primary-400',
      label: 'Completado',
      bgColor: 'bg-primary-500/20',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="flex items-center gap-2">
      <div className={`${config.bgColor} p-1 rounded-full`}>
        <Icon size={iconSize} className={config.color} />
      </div>
      {showLabel && (
        <span className={`text-sm ${config.color}`}>{config.label}</span>
      )}
    </div>
  );
};

export default StatusIndicator;
