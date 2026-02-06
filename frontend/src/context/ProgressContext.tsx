import { createContext, useContext, useReducer, useEffect, ReactNode, useState } from 'react';
import { 
  UserProgress, 
  LessonProgress, 
  ExerciseProgress, 
  Status,
  Achievement 
} from '../types';

// ============================================
// ESTADO INICIAL
// ============================================

const initialUserProgress: UserProgress = {
  lessonProgress: {},
  exerciseProgress: {},
  moduleProgress: {},
  stats: {
    totalLessonsCompleted: 0,
    totalExercisesSolved: 0,
    totalTimeSpent: 0,
    currentStreak: 0,
    longestStreak: 0,
    exercisesByDifficulty: {
      easy: 0,
      medium: 0,
      hard: 0,
    },
  },
  achievements: [],
  lastActivity: new Date().toISOString(),
};

// ============================================
// TIPOS DE ACCIONES
// ============================================

type ProgressAction =
  | { type: 'LOAD_PROGRESS'; payload: UserProgress }
  | { type: 'UPDATE_LESSON_PROGRESS'; payload: LessonProgress }
  | { type: 'UPDATE_EXERCISE_PROGRESS'; payload: ExerciseProgress }
  | { type: 'UPDATE_EXERCISE_PARTIAL'; payload: { exerciseId: string; score: number; timeSpent: number; attempts: number } }
  | { type: 'UPDATE_MODULE_PROGRESS'; payload: { moduleId: string; lessonsCompleted: number; exercisesCompleted: number; percentComplete: number } }
  | { type: 'ADD_ACHIEVEMENT'; payload: Achievement }
  | { type: 'UPDATE_STREAK'; payload: { current: number; longest: number } }
  | { type: 'ADD_TIME_SPENT'; payload: number }
  | { type: 'RESET_PROGRESS' };

// ============================================
// REDUCER
// ============================================

function progressReducer(state: UserProgress, action: ProgressAction): UserProgress {
  switch (action.type) {
    case 'LOAD_PROGRESS':
      return action.payload;

    case 'UPDATE_LESSON_PROGRESS': {
      const { lessonId, status } = action.payload;
      const wasCompleted = state.lessonProgress[lessonId]?.status === 'completed';
      const isNowCompleted = status === 'completed';
      
      return {
        ...state,
        lessonProgress: {
          ...state.lessonProgress,
          [lessonId]: action.payload,
        },
        stats: {
          ...state.stats,
          totalLessonsCompleted: !wasCompleted && isNowCompleted 
            ? state.stats.totalLessonsCompleted + 1 
            : state.stats.totalLessonsCompleted,
        },
        lastActivity: new Date().toISOString(),
      };
    }

    case 'UPDATE_EXERCISE_PARTIAL': {
      const { exerciseId, score, timeSpent, attempts } = action.payload;
      const existing = state.exerciseProgress[exerciseId];
      const wasCompleted = existing?.status === 'completed';
      const isNowCompleted = score >= 100; // Solo marcar como completed si score = 100%
      
      return {
        ...state,
        exerciseProgress: {
          ...state.exerciseProgress,
          [exerciseId]: {
            exerciseId,
            status: isNowCompleted ? 'completed' : 'in-progress',
            attempts: attempts,
            lastAttempt: new Date().toISOString(),
            score: score, // Nuevo campo para score parcial
            hintsUsed: existing?.hintsUsed || 0,
            completedAt: isNowCompleted ? new Date().toISOString() : existing?.completedAt,
            timeSpent: (existing?.timeSpent || 0) + timeSpent,
          },
        },
        stats: {
          ...state.stats,
          totalExercisesSolved: !wasCompleted && isNowCompleted 
            ? state.stats.totalExercisesSolved + 1 
            : state.stats.totalExercisesSolved,
        },
        lastActivity: new Date().toISOString(),
      };
    }

    case 'UPDATE_MODULE_PROGRESS':
      return {
        ...state,
        moduleProgress: {
          ...state.moduleProgress,
          [action.payload.moduleId]: action.payload,
        },
      };

    case 'ADD_ACHIEVEMENT':
      // Evitar duplicados
      if (state.achievements.some(a => a.id === action.payload.id)) {
        return state;
      }
      return {
        ...state,
        achievements: [...state.achievements, action.payload],
      };

    case 'UPDATE_STREAK':
      return {
        ...state,
        stats: {
          ...state.stats,
          currentStreak: action.payload.current,
          longestStreak: Math.max(action.payload.longest, state.stats.longestStreak),
        },
      };

    case 'ADD_TIME_SPENT':
      return {
        ...state,
        stats: {
          ...state.stats,
          totalTimeSpent: state.stats.totalTimeSpent + action.payload,
        },
      };

    case 'RESET_PROGRESS':
      return initialUserProgress;

    default:
      return state;
  }
}

// ============================================
// CONTEXT
// ============================================

interface ProgressContextType {
  progress: UserProgress;
  
  // Acciones para lecciones
  startLesson: (lessonId: string) => void;
  completeLesson: (lessonId: string, timeSpent: number) => void;
  getLessonStatus: (lessonId: string) => Status;
  
  // Acciones para ejercicios
  startExercise: (exerciseId: string) => void;
  completeExercise: (exerciseId: string, timeSpent: number, solution?: string) => void;
  updateExercisePartial: (exerciseId: string, score: number, timeSpent: number, attempts: number) => void;
  recordExerciseAttempt: (exerciseId: string) => void;
  useHint: (exerciseId: string) => void;
  getExerciseStatus: (exerciseId: string) => Status;
  
  // Acciones para módulos
  getModuleProgress: (moduleId: string, totalLessons?: number, lessonIds?: string[]) => { lessonsCompleted: number; exercisesCompleted: number; percentComplete: number };
  
  // Utilidades
  addTimeSpent: (seconds: number) => void;
  resetProgress: () => void;
  
  // Estadísticas
  getTotalProgress: () => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// ============================================
// STORAGE KEY
// ============================================

const STORAGE_KEY = 'algorint_progress';

// ============================================
// PROVIDER
// ============================================

interface ProgressProviderProps {
  children: ReactNode;
}

export function ProgressProvider({ children }: ProgressProviderProps) {
  const [progress, dispatch] = useReducer(progressReducer, initialUserProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar progreso desde localStorage al iniciar
  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem(STORAGE_KEY);
      if (savedProgress) {
        const parsed = JSON.parse(savedProgress) as UserProgress;
        dispatch({ type: 'LOAD_PROGRESS', payload: parsed });
      }
    } catch (error) {
      console.error('Error loading progress from localStorage:', error);
    }
    // Marcar como cargado después de intentar cargar
    setIsLoaded(true);
  }, []);

  // Guardar progreso en localStorage cuando cambia (solo después de cargar)
  useEffect(() => {
    // No guardar hasta que hayamos intentado cargar primero
    if (!isLoaded) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch (error) {
      console.error('Error saving progress to localStorage:', error);
    }
  }, [progress, isLoaded]);

  // ============================================
  // FUNCIONES PARA LECCIONES
  // ============================================

  const startLesson = (lessonId: string) => {
    const existing = progress.lessonProgress[lessonId];
    if (!existing || existing.status === 'not-started') {
      dispatch({
        type: 'UPDATE_LESSON_PROGRESS',
        payload: {
          lessonId,
          status: 'in-progress',
          timeSpent: existing?.timeSpent || 0,
        },
      });
    }
  };

  const completeLesson = (lessonId: string, timeSpent: number) => {
    const existing = progress.lessonProgress[lessonId];
    dispatch({
      type: 'UPDATE_LESSON_PROGRESS',
      payload: {
        lessonId,
        status: 'completed',
        completedAt: new Date().toISOString(),
        timeSpent: (existing?.timeSpent || 0) + timeSpent,
      },
    });
  };

  const getLessonStatus = (lessonId: string): Status => {
    return progress.lessonProgress[lessonId]?.status || 'not-started';
  };

  // ============================================
  // FUNCIONES PARA EJERCICIOS
  // ============================================

  const startExercise = (exerciseId: string) => {
    const existing = progress.exerciseProgress[exerciseId];
    if (!existing || existing.status === 'not-started') {
      dispatch({
        type: 'UPDATE_EXERCISE_PROGRESS',
        payload: {
          exerciseId,
          status: 'in-progress',
          attempts: existing?.attempts || 0,
          hintsUsed: existing?.hintsUsed || 0,
          timeSpent: existing?.timeSpent || 0,
        },
      });
    }
  };

  const completeExercise = (exerciseId: string, timeSpent: number, solution?: string) => {
    const existing = progress.exerciseProgress[exerciseId];
    dispatch({
      type: 'UPDATE_EXERCISE_PROGRESS',
      payload: {
        exerciseId,
        status: 'completed',
        attempts: (existing?.attempts || 0) + 1,
        lastAttempt: new Date().toISOString(),
        bestSolution: solution,
        hintsUsed: existing?.hintsUsed || 0,
        completedAt: new Date().toISOString(),
        timeSpent: (existing?.timeSpent || 0) + timeSpent,
      },
    });
  };

  const updateExercisePartial = (exerciseId: string, score: number, timeSpent: number, attempts: number) => {
    dispatch({
      type: 'UPDATE_EXERCISE_PARTIAL',
      payload: {
        exerciseId,
        score,
        timeSpent,
        attempts,
      },
    });
  };

  const recordExerciseAttempt = (exerciseId: string) => {
    const existing = progress.exerciseProgress[exerciseId];
    dispatch({
      type: 'UPDATE_EXERCISE_PROGRESS',
      payload: {
        ...existing,
        exerciseId,
        status: existing?.status || 'in-progress',
        attempts: (existing?.attempts || 0) + 1,
        lastAttempt: new Date().toISOString(),
        hintsUsed: existing?.hintsUsed || 0,
        timeSpent: existing?.timeSpent || 0,
      },
    });
  };

  const useHint = (exerciseId: string) => {
    const existing = progress.exerciseProgress[exerciseId];
    dispatch({
      type: 'UPDATE_EXERCISE_PROGRESS',
      payload: {
        ...existing,
        exerciseId,
        status: existing?.status || 'in-progress',
        attempts: existing?.attempts || 0,
        hintsUsed: (existing?.hintsUsed || 0) + 1,
        timeSpent: existing?.timeSpent || 0,
      },
    });
  };

  const getExerciseStatus = (exerciseId: string): Status => {
    return progress.exerciseProgress[exerciseId]?.status || 'not-started';
  };

  // ============================================
  // FUNCIONES PARA MÓDULOS
  // ============================================

  const getModuleProgress = (moduleId: string, totalLessons?: number, lessonIds?: string[]) => {
    // Si se proporcionan los IDs de lecciones, calcular el progreso real
    if (lessonIds && lessonIds.length > 0) {
      const completedLessons = lessonIds.filter(
        id => progress.lessonProgress[id]?.status === 'completed'
      ).length;
      const total = totalLessons || lessonIds.length;
      return {
        lessonsCompleted: completedLessons,
        exercisesCompleted: 0, // TODO: implementar conteo de ejercicios
        percentComplete: total > 0 ? Math.round((completedLessons / total) * 100) : 0,
      };
    }
    // Fallback al valor guardado
    return progress.moduleProgress[moduleId] || {
      lessonsCompleted: 0,
      exercisesCompleted: 0,
      percentComplete: 0,
    };
  };

  // ============================================
  // UTILIDADES
  // ============================================

  const addTimeSpent = (seconds: number) => {
    dispatch({ type: 'ADD_TIME_SPENT', payload: seconds });
  };

  const resetProgress = () => {
    dispatch({ type: 'RESET_PROGRESS' });
  };

  // Lista de todas las lecciones disponibles en la app
  // Sincronizado con ModulesPage.tsx y ModuleDetailPage.tsx
  const ALL_LESSON_IDS = [
    // Módulo 1: Fundamentos de Python
    'python-listas-tuplas',
    'python-diccionarios-sets',
    'python-strings',
    'python-comprehensions',
    'python-lambdas',
    'python-iteradores',
    // Módulo 2: Complejidad Algorítmica
    'big-o-introduccion',
    'big-o-analisis-tiempo',
    'big-o-analisis-espacio',
    'big-o-casos',
    'big-o-comparacion',
    // Módulo 3: Arrays y Strings
    'two-pointers',
    'sliding-window',
    'prefix-sum',
    'string-manipulation',
    'in-place-operations',
    'subarray-problems',
    'palindromes-anagrams',
    'matrix-traversal',
    // Módulo 4: Hash Tables
    'hash-tables-fundamentos',
    'hash-tables-problemas',
    'hash-counting',
    'hash-two-sum-patterns',
    'hash-set-operations',
    'hash-design-problems',
    // Módulo 5: Linked Lists
    'linked-lists-intro',
    'linked-lists-two-pointers',
    'linked-lists-reversal',
    'linked-lists-merge-sort',
    'linked-lists-advanced',
    'linked-lists-doubly',
    'linked-lists-problems',
    // Módulo 6: Stacks y Queues
    'stacks-intro',
    'queues-intro',
    'stacks-monotonic',
    'stacks-calculator',
    'deque-sliding-window',
    'priority-queue',
    // Módulo 7: Bit Manipulation
    'bit-operadores-basicos',
    'bit-trucos-comunes',
    'bit-problemas-clasicos',
    'bit-xor-applications',
    'bit-masks',
    'bit-advanced',
    // Módulo 8: Trees
    'trees-intro',
    'trees-traversals',
    'trees-dfs',
    'trees-bfs',
    'trees-construction',
    'trees-lca',
    'trees-diameter',
    'trees-subtree',
    'trees-views',
    'trees-advanced',
    // Módulo 9: BST
    'bst-intro',
    // Módulo 10: Heaps
    'heaps-intro',
    'heaps-aplicaciones',
    // Módulo 11: Graphs
    'graphs-intro',
    'graphs-problemas',
    // Módulo 12: Recursion y Backtracking
    'recursion-intro',
    'backtracking-intro',
    'backtracking-subsets',
    'backtracking-permutations',
    'backtracking-string',
    'backtracking-matrix',
    'backtracking-path',
    'backtracking-optimization',
    // Módulo 13: Dynamic Programming
    'dp-intro',
    'dp-problemas',
    'dp-1d-patterns',
    'dp-2d-patterns',
    'dp-knapsack',
    'dp-coin-change',
    'dp-subsequences',
    'dp-strings',
    'dp-matrix',
    'dp-intervals',
    'dp-state-machine',
    'dp-bitmask',
    'dp-digit',
    'dp-trees',
    // Módulo 14: Binary Search
    'binary-search-intro',
    // Módulo 15: Sorting
    'sorting-intro',
    // Módulo 16: Advanced Graphs
    'advanced-graphs-intro',
    // Módulo 17: Tries
    'tries-intro',
    // Módulo 18: Interview Prep
    'interview-prep-intro',
  ];

  const getTotalProgress = (): number => {
    const totalLessons = ALL_LESSON_IDS.length;
    const completedLessons = ALL_LESSON_IDS.filter(
      id => progress.lessonProgress[id]?.status === 'completed'
    ).length;
    
    if (totalLessons === 0) return 0;
    return Math.round((completedLessons / totalLessons) * 100);
  };

  // ============================================
  // VALOR DEL CONTEXT
  // ============================================

  const value: ProgressContextType = {
    progress,
    startLesson,
    completeLesson,
    getLessonStatus,
    startExercise,
    completeExercise,
    updateExercisePartial,
    recordExerciseAttempt,
    useHint,
    getExerciseStatus,
    getModuleProgress,
    addTimeSpent,
    resetProgress,
    getTotalProgress,
  };

  // Mostrar loading mientras se carga el progreso del localStorage
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-dark-400">Cargando progreso...</p>
        </div>
      </div>
    );
  }

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

// ============================================
// HOOK PERSONALIZADO
// ============================================

export function useProgress(): ProgressContextType {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
