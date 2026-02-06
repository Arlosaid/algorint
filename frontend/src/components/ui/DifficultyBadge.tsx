import React from 'react';
import { Difficulty } from '../../types';

interface BadgeProps {
  difficulty: Difficulty;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * DifficultyBadge Component
 * =========================
 * Badge que muestra la dificultad de un ejercicio/lección.
 * 
 * Colores:
 * - Easy: Verde
 * - Medium: Amarillo/Naranja
 * - Hard: Rojo
 */
export const DifficultyBadge: React.FC<BadgeProps> = ({ 
  difficulty, 
  size = 'md' 
}) => {
  const baseClasses = 'inline-flex items-center rounded-full font-semibold uppercase tracking-wide';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-4 py-1.5 text-sm',
  };

  const difficultyClasses = {
    easy: 'bg-green-500/20 text-green-400 border border-green-500/30',
    medium: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    hard: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  const labels = {
    easy: 'Fácil',
    medium: 'Medio',
    hard: 'Difícil',
  };

  return (
    <span className={`${baseClasses} ${sizeClasses[size]} ${difficultyClasses[difficulty]}`}>
      {labels[difficulty]}
    </span>
  );
};

export default DifficultyBadge;
