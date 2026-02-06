import React from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code2,
  Clock,
  Flame,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Star,
  Zap,
  Crosshair,
  Trophy,
  Dumbbell,
  Layers
} from 'lucide-react';
import { Card, Button, ProgressBar } from '../components/ui';
import { useProgress } from '../context/ProgressContext';

/**
 * ProgressPage
 * ============
 * Dashboard de progreso del usuario mostrando:
 * - Estadísticas generales
 * - Logros desbloqueados
 * - Actividad reciente
 * - Recomendaciones
 */
const ProgressPage: React.FC = () => {
  const { progress, getTotalProgress, resetProgress } = useProgress();
  const { stats, achievements } = progress;

  // Calcular streak (simulado)
  const today = new Date().toDateString();
  const lastActivity = progress.lastActivity 
    ? new Date(progress.lastActivity).toDateString() 
    : null;
  const isActiveToday = today === lastActivity;

  // Formatear tiempo total
  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Tu Progreso
          </h1>
          <p className="text-dark-400 text-lg">
            Revisa tu avance y mantén el ritmo de aprendizaje.
          </p>
        </div>

        {/* Main stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-500/20 flex items-center justify-center">
              <BookOpen className="text-primary-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.totalLessonsCompleted}
            </div>
            <div className="text-dark-500 text-sm">Lecciones</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-secondary-500/20 flex items-center justify-center">
              <Code2 className="text-secondary-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.totalExercisesSolved}
            </div>
            <div className="text-dark-500 text-sm">Ejercicios</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-accent-500/20 flex items-center justify-center">
              <Clock className="text-accent-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">
              {formatTotalTime(stats.totalTimeSpent)}
            </div>
            <div className="text-dark-500 text-sm">Tiempo Total</div>
          </Card>

          <Card className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/20 flex items-center justify-center">
              <Flame className="text-orange-400" size={24} />
            </div>
            <div className="text-3xl font-bold text-white">
              {stats.currentStreak}
            </div>
            <div className="text-dark-500 text-sm">Días seguidos</div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall progress */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <TrendingUp className="text-primary-400" size={24} />
                Progreso General
              </h2>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-dark-400">Completado</span>
                  <span className="text-primary-400 font-medium">{getTotalProgress()}%</span>
                </div>
                <ProgressBar value={getTotalProgress()} size="lg" />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-green-400">
                    {stats.exercisesByDifficulty.easy}
                  </div>
                  <div className="text-dark-500 text-sm">Fácil</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-400">
                    {stats.exercisesByDifficulty.medium}
                  </div>
                  <div className="text-dark-500 text-sm">Medio</div>
                </div>
                <div className="text-center p-4 bg-dark-700 rounded-lg">
                  <div className="text-2xl font-bold text-red-400">
                    {stats.exercisesByDifficulty.hard}
                  </div>
                  <div className="text-dark-500 text-sm">Difícil</div>
                </div>
              </div>
            </Card>

            {/* Activity calendar placeholder */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-secondary-400" size={24} />
                Actividad Reciente
              </h2>
              
              {/* Simplified activity grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: 35 }).map((_, i) => {
                  // Simular actividad aleatoria
                  const hasActivity = Math.random() > 0.6;
                  const intensity = hasActivity ? Math.floor(Math.random() * 4) + 1 : 0;
                  
                  return (
                    <div
                      key={i}
                      className={`
                        w-full aspect-square rounded-sm
                        ${intensity === 0 ? 'bg-dark-700' : ''}
                        ${intensity === 1 ? 'bg-primary-500/30' : ''}
                        ${intensity === 2 ? 'bg-primary-500/50' : ''}
                        ${intensity === 3 ? 'bg-primary-500/70' : ''}
                        ${intensity === 4 ? 'bg-primary-500' : ''}
                      `}
                      title={`${intensity} actividades`}
                    />
                  );
                })}
              </div>
              
              <div className="flex items-center justify-end gap-2 mt-4 text-xs text-dark-500">
                <span>Menos</span>
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-sm bg-dark-700" />
                  <div className="w-3 h-3 rounded-sm bg-primary-500/30" />
                  <div className="w-3 h-3 rounded-sm bg-primary-500/50" />
                  <div className="w-3 h-3 rounded-sm bg-primary-500/70" />
                  <div className="w-3 h-3 rounded-sm bg-primary-500" />
                </div>
                <span>Más</span>
              </div>
            </Card>

            {/* Recommendations */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Target className="text-accent-400" size={24} />
                Recomendado para Ti
              </h2>
              
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <Link 
                    key={index}
                    to={rec.link}
                    className="block group"
                  >
                    <div className="flex items-center gap-4 p-4 bg-dark-700 rounded-lg hover:bg-dark-600 transition-colors">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${rec.iconBg}`}>
                        <rec.icon className={rec.iconColor} size={20} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-medium group-hover:text-primary-400 transition-colors">
                          {rec.title}
                        </h3>
                        <p className="text-dark-500 text-sm">{rec.description}</p>
                      </div>
                      <Zap className="text-dark-600 group-hover:text-primary-400 transition-colors" size={20} />
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          </div>

          {/* Right column - Achievements */}
          <div className="space-y-6">
            {/* Streak card */}
            <Card className={`text-center ${isActiveToday ? 'border-orange-500/50' : ''}`}>
              <Flame 
                className={`mx-auto mb-4 ${isActiveToday ? 'text-orange-400' : 'text-dark-600'}`} 
                size={48} 
              />
              <h3 className="text-2xl font-bold text-white mb-1">
                {stats.currentStreak} días
              </h3>
              <p className="text-dark-500 text-sm mb-4">
                {isActiveToday 
                  ? '¡Racha activa! Sigue así.' 
                  : '¡Practica hoy para mantener tu racha!'
                }
              </p>
              {!isActiveToday && (
                <Link to="/practice">
                  <Button variant="primary" size="sm">
                    Practicar Ahora
                  </Button>
                </Link>
              )}
            </Card>

            {/* Achievements */}
            <Card>
              <h2 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Award className="text-accent-400" size={24} />
                Logros
              </h2>

              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent-500/20 flex items-center justify-center text-xl">
                        {achievement.icon}
                      </div>
                      <div>
                        <h4 className="text-white font-medium text-sm">
                          {achievement.title}
                        </h4>
                        <p className="text-dark-500 text-xs">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Star className="text-dark-600 mx-auto mb-3" size={32} />
                  <p className="text-dark-500 text-sm">
                    Completa lecciones y ejercicios para desbloquear logros
                  </p>
                </div>
              )}

              {/* Locked achievements preview */}
              <div className="mt-4 pt-4 border-t border-dark-700">
                <h4 className="text-dark-500 text-xs uppercase tracking-wide mb-3">
                  Próximos logros
                </h4>
                <div className="space-y-2">
                  {lockedAchievements.slice(0, 3).map((ach, index) => {
                    const IconComponent = ach.icon;
                    return (
                      <div 
                        key={index}
                        className="flex items-center gap-3 p-2 opacity-50"
                      >
                        <div className="w-8 h-8 rounded-full bg-dark-700 flex items-center justify-center">
                          <IconComponent size={16} className="text-dark-500" />
                        </div>
                        <span className="text-dark-500 text-sm">{ach.title}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card>

            {/* Reset progress */}
            <Card className="text-center">
              <p className="text-dark-500 text-sm mb-4">
                ¿Quieres empezar desde cero?
              </p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (confirm('¿Estás seguro? Esto borrará todo tu progreso.')) {
                    resetProgress();
                  }
                }}
              >
                Reiniciar Progreso
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DATA
// ============================================

const recommendations = [
  {
    title: 'Continúa con Big O',
    description: 'Tienes 3 lecciones pendientes en este módulo',
    link: '/modules/module-1',
    icon: TrendingUp,
    iconBg: 'bg-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    title: 'Practica Two Pointers',
    description: 'Patrón común en entrevistas',
    link: '/practice',
    icon: Code2,
    iconBg: 'bg-green-500/20',
    iconColor: 'text-green-400',
  },
  {
    title: 'Simula una Entrevista',
    description: 'Pon a prueba tus conocimientos',
    link: '/interview',
    icon: Target,
    iconBg: 'bg-purple-500/20',
    iconColor: 'text-purple-400',
  },
];

const lockedAchievements = [
  { title: 'Primer ejercicio completado', icon: Crosshair },
  { title: 'Racha de 7 días', icon: Flame },
  { title: '10 ejercicios fáciles', icon: Star },
  { title: 'Primer módulo completado', icon: Layers },
  { title: '5 ejercicios medios', icon: Dumbbell },
  { title: 'Entrevista aprobada', icon: Trophy },
];

export default ProgressPage;
