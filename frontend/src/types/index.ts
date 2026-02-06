/**
 * Tipos principales de la aplicación Algorint
 * =============================================
 * 
 * Este archivo define todas las interfaces y tipos TypeScript
 * utilizados en la aplicación para garantizar type-safety.
 */

// ============================================
// ENUMS
// ============================================

/** Niveles de dificultad de ejercicios (estilo LeetCode) */
export type Difficulty = 'easy' | 'medium' | 'hard';

/** Estados posibles de un ejercicio o lección */
export type Status = 'not-started' | 'in-progress' | 'completed';

/** Tipos de estructuras de datos */
export type DataStructureType = 
  | 'array' 
  | 'string' 
  | 'linked-list' 
  | 'stack' 
  | 'queue' 
  | 'hash-table' 
  | 'tree' 
  | 'graph' 
  | 'heap';

/** Patrones de algoritmos comunes en entrevistas */
export type AlgorithmPattern = 
  | 'two-pointers'
  | 'sliding-window'
  | 'binary-search'
  | 'recursion'
  | 'dynamic-programming'
  | 'backtracking'
  | 'bfs'
  | 'dfs'
  | 'greedy'
  | 'divide-conquer'
  | 'sorting'
  | 'hashing';

// ============================================
// MÓDULOS Y LECCIONES
// ============================================

/** Representa un módulo educativo completo */
export interface Module {
  id: string;
  number: number;
  title: string;
  description: string;
  icon: string;
  color: string;
  estimatedHours: number;
  lessonsCount: number;
  exercisesCount: number;
  prerequisites: string[];
  objectives: string[];
  lessons: Lesson[];
}

/** Representa una lección individual dentro de un módulo */
export interface Lesson {
  id: string;
  moduleId: string;
  number: number;
  title: string;
  description: string;
  duration: number; // en minutos
  difficulty: Difficulty;
  content: LessonContent;
  exercises: string[]; // IDs de ejercicios relacionados
}

/** Contenido estructurado de una lección */
export interface LessonContent {
  /** Explicación teórica en lenguaje humano */
  theory: string;
  
  /** Ejemplo real del mundo para contextualizar */
  realWorldExample: string;
  
  /** Visualización mental o analogía */
  mentalVisualization: string;
  
  /** Código Python de ejemplo */
  code: CodeBlock[];
  
  /** Explicación línea por línea del código */
  codeExplanation: CodeExplanation[];
  
  /** Traza paso a paso de ejecución */
  stepByStepTrace: TraceStep[];
  
  /** Análisis de complejidad Big O */
  complexity: ComplexityAnalysis;
  
  /** Casos borde a considerar */
  edgeCases: string[];
  
  /** Errores comunes que evitar */
  commonMistakes: string[];
  
  /** Tips de entrevista */
  interviewTips: string[];
}

/** Bloque de código con metadatos */
export interface CodeBlock {
  id: string;
  title: string;
  language: string;
  code: string;
  description?: string;
  isOptimized?: boolean;
}

/** Explicación de una línea de código */
export interface CodeExplanation {
  lineNumber: number;
  code: string;
  explanation: string;
  concept?: string; // Concepto clave relacionado
}

/** Paso en la traza de ejecución */
export interface TraceStep {
  step: number;
  description: string;
  variables: Record<string, any>;
  output?: string;
  highlight?: number[]; // Líneas a resaltar
}

/** Análisis de complejidad temporal y espacial */
export interface ComplexityAnalysis {
  time: {
    notation: string; // e.g., "O(n)"
    explanation: string;
    bestCase?: string;
    worstCase?: string;
    averageCase?: string;
  };
  space: {
    notation: string;
    explanation: string;
  };
}

// ============================================
// EJERCICIOS
// ============================================

/** Ejercicio de práctica tipo LeetCode */
export interface Exercise {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: DataStructureType;
  pattern: AlgorithmPattern;
  description: string;
  examples: ExerciseExample[];
  constraints: string[];
  hints: string[];
  starterCode: string;
  solutions: ExerciseSolution[];
  testCases: TestCase[];
  relatedExercises: string[];
  interviewQuestion?: string; // Pregunta típica de entrevista
}

/** Ejemplo de entrada/salida para un ejercicio */
export interface ExerciseExample {
  input: string;
  output: string;
  explanation?: string;
}

/** Solución a un ejercicio */
export interface ExerciseSolution {
  id: string;
  title: string; // e.g., "Fuerza Bruta", "Optimizada"
  approach: string;
  code: string;
  complexity: ComplexityAnalysis;
  explanation: string;
}

/** Caso de prueba para validar soluciones */
export interface TestCase {
  id: string;
  input: any;
  expectedOutput: any;
  isHidden?: boolean;
}

// ============================================
// PROGRESO DEL USUARIO
// ============================================

/** Progreso general del usuario */
export interface UserProgress {
  lessonProgress: Record<string, LessonProgress>;
  exerciseProgress: Record<string, ExerciseProgress>;
  moduleProgress: Record<string, ModuleProgress>;
  stats: UserStats;
  achievements: Achievement[];
  lastActivity: string; // ISO date
}

/** Progreso en una lección específica */
export interface LessonProgress {
  lessonId: string;
  status: Status;
  completedAt?: string;
  timeSpent: number; // segundos
}

/** Progreso en un ejercicio específico */
export interface ExerciseProgress {
  exerciseId: string;
  status: Status;
  attempts: number;
  lastAttempt?: string;
  bestSolution?: string;
  hintsUsed: number;
  completedAt?: string;
  timeSpent: number;
  score?: number; // 0-100, para calificación parcial
}

/** Progreso en un módulo */
export interface ModuleProgress {
  moduleId: string;
  lessonsCompleted: number;
  exercisesCompleted: number;
  percentComplete: number;
}

/** Estadísticas del usuario */
export interface UserStats {
  totalLessonsCompleted: number;
  totalExercisesSolved: number;
  totalTimeSpent: number; // segundos
  currentStreak: number; // días consecutivos
  longestStreak: number;
  exercisesByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
}

/** Logro desbloqueado */
export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
}

// ============================================
// MODO ENTREVISTA
// ============================================

/** Sesión de entrevista simulada */
export interface InterviewSession {
  id: string;
  startedAt: string;
  endedAt?: string;
  exercise: Exercise;
  timeLimit: number; // segundos
  userSolution?: string;
  feedback?: InterviewFeedback;
}

/** Feedback de una sesión de entrevista */
export interface InterviewFeedback {
  score: number; // 0-100
  correctness: number;
  efficiency: number;
  codeQuality: number;
  communication: number;
  strengths: string[];
  improvements: string[];
  recommendation: string;
}

// ============================================
// API RESPONSES
// ============================================

/** Respuesta genérica de la API */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/** Resultado de ejecución de código */
export interface CodeExecutionResult {
  success: boolean;
  output?: string;
  error?: string;
  executionTime?: number;
  memoryUsed?: number;
  testResults?: TestResult[];
}

/** Resultado de un test individual */
export interface TestResult {
  testId: string;
  passed: boolean;
  input: any;
  expectedOutput: any;
  actualOutput: any;
  executionTime: number;
}

// ============================================
// UI COMPONENTS
// ============================================

/** Props comunes para botones */
export interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

/** Props para el componente de progreso */
export interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'success';
  className?: string;
}

/** Props para el editor de código */
export interface CodeEditorProps {
  code: string;
  onChange?: (code: string) => void;
  language?: string;
  readOnly?: boolean;
  height?: string | number;
  theme?: 'light' | 'dark';
}
