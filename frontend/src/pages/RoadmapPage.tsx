import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Trophy,
  Clock,
  BookOpen,
  Code2,
  CheckCircle,
  Circle,
  ArrowRight,
  FileCode,
  BarChart2,
  FileText,
  FolderKey,
  Link2,
  Layers,
} from 'lucide-react';
import { Card, Button, ProgressBar } from '../components/ui';
import { useProgress } from '../context/ProgressContext';

/**
 * StudyDashboardPage (antes RoadmapPage)
 * ======================================
 * Dashboard personalizado de estudio con estadísticas,
 * calendario de actividad, logros y metas.
 */
const RoadmapPage: React.FC = () => {
  const navigate = useNavigate();
  const { progress, getTotalProgress, getModuleProgress } = useProgress();

  // Calcular estadísticas
  const stats = useMemo(() => {
    const totalProgress = getTotalProgress();
    const { stats: userStats, lastActivity } = progress;
    
    // Calcular días desde última actividad
    const lastActivityDate = new Date(lastActivity);
    const today = new Date();
    const daysSinceActivity = Math.floor((today.getTime() - lastActivityDate.getTime()) / (1000 * 60 * 60 * 24));
    
    // Contar ejercicios por dificultad
    const exercisesByDiff = userStats.exercisesByDifficulty || { easy: 0, medium: 0, hard: 0 };
    
    return {
      totalProgress,
      lessonsCompleted: userStats.totalLessonsCompleted || 0,
      exercisesSolved: userStats.totalExercisesSolved || 0,
      currentStreak: userStats.currentStreak || 0,
      longestStreak: userStats.longestStreak || 0,
      totalTimeSpent: userStats.totalTimeSpent || 0,
      exercisesByDiff,
      daysSinceActivity,
      isActiveToday: daysSinceActivity === 0
    };
  }, [progress, getTotalProgress]);

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Roadmap de Aprendizaje
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Tu guía completa para dominar algoritmos y estructuras de datos.
            Sigue el camino desde fundamentos hasta técnicas avanzadas de entrevista.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary-500" />
            <span className="text-dark-300 text-sm">Completado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-secondary-500" />
            <span className="text-dark-300 text-sm">En progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <Circle className="text-dark-500" size={16} />
            <span className="text-dark-300 text-sm">No iniciado</span>
          </div>
        </div>

        {/* Roadmap */}
        <div className="max-w-4xl mx-auto">
          {roadmapModules.map((module, index) => {
            const progress = getModuleProgress(module.id);
            const isCompleted = progress.percentComplete === 100;
            const isInProgress = progress.percentComplete > 0 && !isCompleted;

            return (
              <div key={module.id} className="relative">
                {/* Connecting line */}
                {index < roadmapModules.length - 1 && (
                  <div className="absolute left-8 top-24 w-0.5 h-24 bg-dark-700 z-0" />
                )}

                {/* Module card */}
                <div className="relative z-10 flex gap-6 mb-8">
                  {/* Status indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`
                      w-16 h-16 rounded-2xl flex items-center justify-center
                      text-2xl font-bold transition-all duration-300
                      ${isCompleted 
                        ? 'bg-primary-500 text-white shadow-glow' 
                        : isInProgress 
                          ? 'bg-secondary-500/20 text-secondary-400 border-2 border-secondary-500'
                          : 'bg-dark-800 text-dark-400 border-2 border-dark-600'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle size={28} />
                      ) : (
                        module.number
                      )}
                    </div>
                  </div>

                  {/* Module content */}
                  <Card 
                    className="flex-1 cursor-pointer"
                    hover
                    onClick={() => navigate(`/modules/${module.id}`)}
                  >
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="text-primary-400">{module.icon}</div>
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Módulo {module.number}: {module.title}
                            </h3>
                            <p className="text-dark-400 text-sm">
                              {module.description}
                            </p>
                          </div>
                        </div>

                        {/* Topics */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          {module.topics.map((topic, i) => (
                            <span 
                              key={i} 
                              className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded"
                            >
                              {topic}
                            </span>
                          ))}
                        </div>

                        {/* Stats */}
                        <div className="flex items-center gap-6 mt-4 text-sm text-dark-500">
                          <span className="flex items-center gap-1">
                            <BookOpen size={14} />
                            {module.lessons} lecciones
                          </span>
                          <span className="flex items-center gap-1">
                            <Code2 size={14} />
                            {module.exercises} ejercicios
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} />
                            {module.duration}
                          </span>
                        </div>
                      </div>

                      {/* Progress */}
                      <div className="w-full md:w-48">
                        <ProgressBar 
                          value={progress.percentComplete} 
                          showLabel 
                          size="md"
                        />
                        <Link 
                          to={`/modules/${module.id}`}
                          className="mt-3 flex items-center gap-1 text-primary-400 text-sm hover:text-primary-300"
                        >
                          {isCompleted ? 'Repasar' : isInProgress ? 'Continuar' : 'Comenzar'}
                          <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            );
          })}

          {/* Final milestone */}
          <div className="flex justify-center mt-8">
            <Card className="text-center py-8 px-12 bg-gradient-to-r from-primary-500/10 to-secondary-500/10 border-primary-500/30">
              <Trophy className="text-accent-400 mx-auto mb-4" size={48} />
              <h3 className="text-2xl font-bold text-white mb-2">
                ¡Listo para Entrevistas!
              </h3>
              <p className="text-dark-400 mb-4">
                Completa todos los módulos para estar preparado
                para cualquier entrevista técnica.
              </p>
              <Link to="/interview">
                <Button variant="primary">
                  Modo Entrevista
                </Button>
              </Link>
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

const roadmapModules = [
  {
    id: 'fundamentos-python',
    number: 1,
    title: 'Fundamentos de Python',
    description: 'Domina las estructuras de datos nativas de Python y las técnicas esenciales.',
    icon: <FileCode size={28} />,
    duration: '10 horas',
    lessons: 6,
    exercises: 10,
    topics: ['Listas y Tuplas', 'Diccionarios y Sets', 'Strings', 'Comprehensions', 'Lambdas', 'Generadores'],
  },
  {
    id: 'complejidad-algoritmica',
    number: 2,
    title: 'Complejidad Algorítmica (Big O)',
    description: 'Aprende a analizar y comparar la eficiencia de algoritmos.',
    icon: <BarChart2 size={28} />,
    duration: '6 horas',
    lessons: 5,
    exercises: 10,
    topics: ['Notación Big O', 'Complejidad Temporal', 'Complejidad Espacial', 'Análisis'],
  },
  {
    id: 'arrays-strings',
    number: 3,
    title: 'Arrays y Strings',
    description: 'Técnicas fundamentales para manipular arrays y strings.',
    icon: <FileText size={28} />,
    duration: '12 horas',
    lessons: 10,
    exercises: 25,
    topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'String Manipulation'],
  },
  {
    id: 'hash-tables',
    number: 4,
    title: 'Hash Tables y Diccionarios',
    description: 'Domina el uso de hash tables para resolver problemas en tiempo O(1).',
    icon: <FolderKey size={28} />,
    duration: '8 horas',
    lessons: 8,
    exercises: 20,
    topics: ['Hash Functions', 'Collision Handling', 'Two Sum Pattern', 'Frequency Counter'],
  },
  {
    id: 'linked-lists',
    number: 5,
    title: 'Listas Enlazadas',
    description: 'Aprende a manipular listas enlazadas, una estructura fundamental.',
    icon: <Link2 size={28} />,
    duration: '10 horas',
    lessons: 10,
    exercises: 20,
    topics: ['Singly Linked List', 'Doubly Linked List', 'Fast & Slow Pointers', 'Reverse'],
  },
  {
    id: 'stacks-queues',
    number: 6,
    title: 'Stacks y Queues',
    description: 'Estructuras LIFO y FIFO esenciales para muchos algoritmos.',
    icon: <Layers size={28} />,
    duration: '8 horas',
    lessons: 8,
    exercises: 18,
    topics: ['Stack Implementation', 'Queue Implementation', 'Monotonic Stack', 'Valid Parentheses'],
  },
  {
    id: 'bit-manipulation',
    number: 7,
    title: 'Bit Manipulation',
    description: 'Operaciones a nivel de bits para resolver problemas de manera eficiente.',
    icon: <Code2 size={28} />,
    duration: '8 horas',
    lessons: 6,
    exercises: 15,
    topics: ['Operadores Bitwise', 'AND OR XOR NOT', 'Shifts', 'Single Number', 'Potencias de 2'],
  },
];

export default RoadmapPage;
