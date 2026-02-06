import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Code2,
  Clock,
  CheckCircle,
  Circle,
  Play,
  Target,
  Lightbulb,
  ArrowRight,
  FileCode,
  BarChart3,
  FileText,
  FolderKey,
  Link2,
  Layers,
  TreeDeciduous,
  Search,
  Binary,
  GitBranch,
  Network,
  Repeat,
  Brain,
  SortAsc,
  Route,
  FileSearch,
  Briefcase
} from 'lucide-react';
import { Card, Button, ProgressBar, DifficultyBadge } from '../components/ui';
import { useProgress } from '../context/ProgressContext';

/**
 * ModuleDetailPage
 * ================
 * Página de detalle de un módulo específico.
 * Muestra objetivos, lecciones y ejercicios del módulo.
 */
const ModuleDetailPage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const { getLessonStatus, getModuleProgress } = useProgress();

  // Debug: Ver qué moduleId se recibe
  console.log('ModuleDetailPage - moduleId:', moduleId);
  console.log('ModuleDetailPage - available modules:', modulesData.map(m => m.id));

  // Encontrar el módulo actual
  const module = modulesData.find(m => m.id === moduleId);
  
  // Calcular progreso basándose en las lecciones reales del módulo
  const lessonIds = module?.lessons.map(l => l.id) || [];
  const progress = getModuleProgress(moduleId || '', lessonIds.length, lessonIds);

  if (!module) {
    console.log('ModuleDetailPage - Module not found for id:', moduleId);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Módulo no encontrado</h2>
          <p className="text-dark-400 mb-4">ID buscado: {moduleId}</p>
          <Link to="/modules">
            <Button variant="primary">Volver a módulos</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* Back navigation */}
        <Link 
          to="/modules" 
          className="inline-flex items-center gap-2 text-dark-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Volver a módulos
        </Link>

        {/* Module header */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main info */}
          <div className="lg:col-span-2">
            <div className="flex items-start gap-4 mb-6">
              <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${module.iconBg}`}>
                <module.icon size={40} className="text-white" />
              </div>
              <div>
                <span className="text-dark-500 text-sm">Módulo {module.number}</span>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {module.title}
                </h1>
                <p className="text-dark-400 text-lg">
                  {module.description}
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-6 mb-6">
              <div className="flex items-center gap-2 text-dark-400">
                <BookOpen size={18} />
                <span>{module.lessons.length} lecciones</span>
              </div>
              <div className="flex items-center gap-2 text-dark-400">
                <Code2 size={18} />
                <span>{module.exercisesCount} ejercicios</span>
              </div>
              <div className="flex items-center gap-2 text-dark-400">
                <Clock size={18} />
                <span>{module.duration}</span>
              </div>
            </div>

            {/* Topics */}
            <div className="flex flex-wrap gap-2">
              {module.topics.map((topic, i) => (
                <span 
                  key={i}
                  className="px-3 py-1 bg-dark-700 text-dark-300 text-sm rounded-full"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>

          {/* Progress card */}
          <Card className="h-fit">
            <h3 className="text-lg font-semibold text-white mb-4">Tu Progreso</h3>
            <ProgressBar value={progress.percentComplete} showLabel size="lg" />
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-primary-400">
                  {progress.lessonsCompleted}
                </div>
                <div className="text-dark-500 text-sm">Lecciones</div>
              </div>
              <div className="text-center p-3 bg-dark-700 rounded-lg">
                <div className="text-2xl font-bold text-secondary-400">
                  {progress.exercisesCompleted}
                </div>
                <div className="text-dark-500 text-sm">Ejercicios</div>
              </div>
            </div>

            {/* CTA */}
            <Link 
              to={`/modules/${moduleId}/lessons/${module.lessons[0]?.id}`}
              className="block mt-6"
            >
              <Button variant="primary" className="w-full">
                <Play size={18} />
                {progress.percentComplete > 0 ? 'Continuar' : 'Comenzar'}
              </Button>
            </Link>
          </Card>
        </div>

        {/* Objectives */}
        <Card className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-primary-400" size={24} />
            <h2 className="text-xl font-semibold text-white">Objetivos del Módulo</h2>
          </div>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {module.objectives.map((objective, i) => (
              <li key={i} className="flex items-start gap-3">
                <CheckCircle className="text-primary-500 mt-0.5 flex-shrink-0" size={18} />
                <span className="text-dark-300">{objective}</span>
              </li>
            ))}
          </ul>
        </Card>

        {/* Lessons */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="text-secondary-400" size={28} />
            Lecciones
          </h2>
          
          <div className="space-y-4">
            {module.lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id);
              const isCompleted = status === 'completed';
              const isInProgress = status === 'in-progress';

              return (
                <Link 
                  key={lesson.id}
                  to={`/modules/${moduleId}/lessons/${lesson.id}`}
                >
                  <Card hover className="group">
                    <div className="flex items-center gap-4">
                      {/* Lesson number/status */}
                      <div className={`
                        w-12 h-12 rounded-xl flex items-center justify-center font-bold
                        ${isCompleted 
                          ? 'bg-primary-500/20 text-primary-400' 
                          : isInProgress 
                            ? 'bg-secondary-500/20 text-secondary-400'
                            : 'bg-dark-700 text-dark-500'
                        }
                      `}>
                        {isCompleted ? (
                          <CheckCircle size={24} />
                        ) : (
                          index + 1
                        )}
                      </div>

                      {/* Lesson info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {lesson.title}
                        </h3>
                        <p className="text-dark-400 text-sm">
                          {lesson.description}
                        </p>
                      </div>

                      {/* Meta info */}
                      <div className="hidden md:flex items-center gap-4">
                        <DifficultyBadge difficulty={lesson.difficulty} size="sm" />
                        <div className="flex items-center gap-1 text-dark-500 text-sm">
                          <Clock size={14} />
                          {lesson.duration} min
                        </div>
                        <ArrowRight 
                          size={20} 
                          className="text-dark-600 group-hover:text-primary-400 transition-colors" 
                        />
                      </div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Prerequisites & Tips */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prerequisites */}
          {module.prerequisites.length > 0 && (
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <ArrowLeft size={20} className="text-dark-500" />
                Prerequisitos
              </h3>
              <ul className="space-y-2">
                {module.prerequisites.map((prereq, i) => {
                  const prereqModule = modulesData.find(m => m.id === prereq);
                  return (
                    <li key={i}>
                      <Link 
                        to={`/modules/${prereq}`}
                        className="flex items-center gap-2 text-dark-400 hover:text-primary-400 transition-colors"
                      >
                        <Circle size={8} className="fill-current" />
                        {prereqModule?.title || prereq}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </Card>
          )}

          {/* Tips */}
          <Card>
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-accent-400" />
              Tips para este módulo
            </h3>
            <ul className="space-y-2">
              {module.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-dark-400">
                  <span className="text-accent-400">•</span>
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DATA - Sincronizado con el backend
// ============================================

const modulesData = [
  {
    id: 'fundamentos-python',
    number: 1,
    title: 'Fundamentos de Python para Algoritmos',
    description: 'Domina las estructuras de datos nativas de Python y las técnicas esenciales para resolver problemas algorítmicos.',
    icon: FileCode,
    iconBg: 'bg-slate-500/20',
    duration: '10 horas',
    exercisesCount: 10,
    topics: ['Listas y Tuplas', 'Diccionarios y Sets', 'Strings', 'List Comprehensions', 'Funciones Lambda', 'Iteradores y Generadores'],
    prerequisites: [],
    objectives: [
      'Manipular eficientemente las estructuras de datos de Python',
      'Escribir código Pythónico y legible',
      'Entender la complejidad de las operaciones built-in',
      'Usar comprehensions y generadores efectivamente',
      'Dominar sorted() con keys personalizados',
      'Procesar datos eficientemente con iteradores',
    ],
    tips: [
      'Practica escribiendo código, no solo leyendo',
      'Usa el debugger para entender el flujo',
      'Familiarízate con los métodos built-in',
      'La documentación de Python es tu amiga',
    ],
    lessons: [
      {
        id: 'python-listas-tuplas',
        title: 'Listas y Tuplas en Python',
        description: 'Domina las estructuras de datos secuenciales más importantes de Python.',
        difficulty: 'easy' as const,
        duration: 45,
      },
      {
        id: 'python-diccionarios-sets',
        title: 'Diccionarios y Sets',
        description: 'Estructuras hash para búsquedas O(1) y eliminación de duplicados.',
        difficulty: 'easy' as const,
        duration: 50,
      },
      {
        id: 'python-strings',
        title: 'Manipulación de Strings',
        description: 'Domina las operaciones con strings y sus métodos más útiles para entrevistas.',
        difficulty: 'easy' as const,
        duration: 45,
      },
      {
        id: 'python-comprehensions',
        title: 'List Comprehensions y Expresiones',
        description: 'Escribe código Pythónico y conciso con comprehensions.',
        difficulty: 'easy' as const,
        duration: 40,
      },
      {
        id: 'python-lambdas',
        title: 'Funciones Lambda y de Orden Superior',
        description: 'Domina las funciones anónimas y map/filter/reduce para código conciso.',
        difficulty: 'easy' as const,
        duration: 35,
      },
      {
        id: 'python-iteradores',
        title: 'Iteradores y Generadores',
        description: 'Aprende a manejar grandes cantidades de datos de forma eficiente con iteradores.',
        difficulty: 'easy' as const,
        duration: 45,
      },
    ],
  },
  {
    id: 'complejidad-algoritmica',
    number: 2,
    title: 'Complejidad Algorítmica (Big O)',
    description: 'Aprende a analizar y comparar la eficiencia de algoritmos usando notación Big O.',
    icon: BarChart3,
    iconBg: 'bg-blue-500/20',
    duration: '6 horas',
    exercisesCount: 10,
    topics: ['Notación Big O', 'Complejidad Temporal', 'Complejidad Espacial', 'Análisis de Casos', 'Comparación de Algoritmos'],
    prerequisites: [],
    objectives: [
      'Calcular la complejidad temporal de cualquier algoritmo',
      'Identificar y evitar código ineficiente',
      'Comparar diferentes soluciones objetivamente',
      'Optimizar código existente',
    ],
    tips: [
      'Siempre analiza el peor caso primero',
      'Ignora constantes y términos menores',
      'Practica con ejemplos de código real',
      'Piensa en el crecimiento, no valores absolutos',
    ],
    lessons: [
      {
        id: 'big-o-introduccion',
        title: 'Introducción a Big O',
        description: 'Aprende a medir y comparar la eficiencia de algoritmos.',
        difficulty: 'easy' as const,
        duration: 40,
      },
      {
        id: 'big-o-analisis-tiempo',
        title: 'Análisis de Complejidad Temporal',
        description: 'Aprende a calcular la complejidad temporal paso a paso.',
        difficulty: 'easy' as const,
        duration: 45,
      },
      {
        id: 'big-o-analisis-espacio',
        title: 'Análisis de Complejidad Espacial',
        description: 'Entiende cuánta memoria usa tu algoritmo.',
        difficulty: 'easy' as const,
        duration: 40,
      },
      {
        id: 'big-o-casos',
        title: 'Mejor, Peor y Caso Promedio',
        description: 'Entiende los diferentes casos de análisis de algoritmos.',
        difficulty: 'easy' as const,
        duration: 35,
      },
      {
        id: 'big-o-comparacion',
        title: 'Comparación de Algoritmos',
        description: 'Aprende a elegir el mejor algoritmo para cada situación.',
        difficulty: 'easy' as const,
        duration: 40,
      },
    ],
  },
  {
    id: 'arrays-strings',
    number: 3,
    title: 'Arrays y Strings',
    description: 'Técnicas fundamentales para manipular arrays y strings, los tipos de datos más comunes en entrevistas.',
    icon: FileText,
    iconBg: 'bg-green-500/20',
    duration: '12 horas',
    exercisesCount: 25,
    topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'String Manipulation', 'Anagramas', 'Palindromos', 'Subarrays', 'In-place Operations'],
    prerequisites: ['fundamentos-python', 'complejidad-algoritmica'],
    objectives: [
      'Aplicar la técnica de dos punteros',
      'Implementar ventana deslizante',
      'Resolver problemas de subarrays eficientemente',
      'Manipular strings sin usar memoria extra',
    ],
    tips: [
      'Two pointers es clave para arrays ordenados',
      'Sliding window para subarrays contiguos',
      'Practica reconociendo patrones',
      'Siempre considera casos edge',
    ],
    lessons: [
      {
        id: 'two-pointers',
        title: 'Técnica Two Pointers',
        description: 'Domina la técnica de dos punteros para resolver problemas de arrays eficientemente.',
        difficulty: 'easy' as const,
        duration: 55,
      },
      {
        id: 'sliding-window',
        title: 'Técnica Sliding Window',
        description: 'Aprende a resolver problemas de subarrays y substrings con ventana deslizante.',
        difficulty: 'medium' as const,
        duration: 60,
      },
      {
        id: 'prefix-sum',
        title: 'Prefix Sum',
        description: 'Calcula sumas de rangos en O(1) con sumas prefijas.',
        difficulty: 'easy' as const,
        duration: 45,
      },
      {
        id: 'string-manipulation',
        title: 'Manipulación de Strings',
        description: 'Técnicas avanzadas para problemas de strings.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'in-place-operations',
        title: 'Operaciones In-Place',
        description: 'Modifica arrays sin usar espacio extra.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'subarray-problems',
        title: 'Problemas de Subarrays',
        description: 'Patrones comunes para resolver problemas de subarrays.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'palindromes-anagrams',
        title: 'Palíndromos y Anagramas',
        description: 'Técnicas para detectar palíndromos y anagramas.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'matrix-traversal',
        title: 'Recorrido de Matrices',
        description: 'Técnicas para recorrer y manipular matrices 2D.',
        difficulty: 'medium' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'hash-tables',
    number: 4,
    title: 'Hash Tables y Diccionarios',
    description: 'Domina el uso de hash tables para resolver problemas en tiempo O(1).',
    icon: FolderKey,
    iconBg: 'bg-purple-500/20',
    duration: '8 horas',
    exercisesCount: 20,
    topics: ['Hash Functions', 'Collision Handling', 'Two Sum Pattern', 'Frequency Counter', 'Grouping', 'Caching'],
    prerequisites: ['arrays-strings'],
    objectives: [
      'Entender cómo funcionan las hash tables internamente',
      'Identificar cuándo usar diccionarios vs otras estructuras',
      'Resolver problemas de frecuencia y agrupación',
      'Implementar caché con diccionarios',
    ],
    tips: [
      'Hash tables dan O(1) para búsqueda',
      'Perfectas para contar frecuencias',
      'Two Sum es el problema clásico',
      'Cuidado con colisiones de hash',
    ],
    lessons: [
      {
        id: 'hash-tables-fundamentos',
        title: 'Fundamentos de Hash Tables',
        description: 'Aprende cómo funcionan las tablas hash y sus aplicaciones.',
        difficulty: 'easy' as const,
        duration: 45,
      },
      {
        id: 'hash-tables-problemas',
        title: 'Problemas Clásicos de Hash Tables',
        description: 'Resuelve problemas comunes con hash tables.',
        difficulty: 'easy' as const,
        duration: 50,
      },
      {
        id: 'hash-counting',
        title: 'Patrones de Conteo con Hash',
        description: 'Usa hash maps para contar frecuencias.',
        difficulty: 'easy' as const,
        duration: 40,
      },
      {
        id: 'hash-two-sum-patterns',
        title: 'Patrones Two Sum con Hash',
        description: 'Resuelve variaciones del problema Two Sum.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'hash-set-operations',
        title: 'Operaciones con Hash Sets',
        description: 'Usa sets para operaciones de conjuntos.',
        difficulty: 'medium' as const,
        duration: 40,
      },
      {
        id: 'hash-design-problems',
        title: 'Diseño de Estructuras con Hash',
        description: 'Diseña estructuras personalizadas con hash tables.',
        difficulty: 'hard' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'linked-lists',
    number: 5,
    title: 'Listas Enlazadas',
    description: 'Aprende a manipular listas enlazadas, una estructura fundamental en ciencias de la computación.',
    icon: Link2,
    iconBg: 'bg-orange-500/20',
    duration: '10 horas',
    exercisesCount: 20,
    topics: ['Singly Linked List', 'Doubly Linked List', 'Fast & Slow Pointers', 'Reverse', 'Merge', 'Cycle Detection', 'LRU Cache'],
    prerequisites: ['hash-tables'],
    objectives: [
      'Implementar listas enlazadas desde cero',
      'Detectar ciclos con Floyd\'s algorithm',
      'Revertir listas in-place',
      'Resolver problemas de merge y split',
    ],
    tips: [
      'Dibuja los nodos para visualizar',
      'Cuidado con los edge cases',
      'Fast & slow es muy versátil',
      'Practica revertir listas',
    ],
    lessons: [
      {
        id: 'linked-lists-intro',
        title: 'Introducción a Linked Lists',
        description: 'Estructura, implementación y operaciones básicas.',
        difficulty: 'easy' as const,
        duration: 50,
      },
      {
        id: 'linked-lists-two-pointers',
        title: 'Técnicas: Fast/Slow Pointers',
        description: 'Detectar ciclos, encontrar el medio.',
        difficulty: 'medium' as const,
        duration: 55,
      },
      {
        id: 'linked-lists-reversal',
        title: 'Reversión de Listas',
        description: 'Técnicas para invertir listas completas o parciales.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'linked-lists-merge-sort',
        title: 'Merge y Sort en Listas',
        description: 'Operaciones de merge y ordenamiento.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'linked-lists-advanced',
        title: 'Técnicas Avanzadas',
        description: 'Copiar listas con random pointers.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'linked-lists-doubly',
        title: 'Doubly Linked Lists',
        description: 'Listas doblemente enlazadas y sus aplicaciones.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'linked-lists-problems',
        title: 'Problemas Clásicos de Listas',
        description: 'Resuelve problemas de entrevistas con linked lists.',
        difficulty: 'hard' as const,
        duration: 60,
      },
    ],
  },
  {
    id: 'stacks-queues',
    number: 6,
    title: 'Stacks y Queues',
    description: 'Estructuras LIFO y FIFO esenciales para muchos algoritmos.',
    icon: Layers,
    iconBg: 'bg-teal-500/20',
    duration: '8 horas',
    exercisesCount: 18,
    topics: ['Stack Implementation', 'Queue Implementation', 'Monotonic Stack', 'Valid Parentheses', 'Next Greater Element', 'BFS Basics'],
    prerequisites: ['linked-lists'],
    objectives: [
      'Implementar stacks y queues eficientemente',
      'Resolver problemas de paréntesis balanceados',
      'Usar monotonic stack para problemas de "next greater"',
      'Entender cuándo usar cada estructura',
    ],
    tips: [
      'Stack = LIFO (Last In, First Out)',
      'Queue = FIFO (First In, First Out)',
      'Valid Parentheses es clásico',
      'Monotonic stack es poderoso',
    ],
    lessons: [
      {
        id: 'stacks-intro',
        title: 'Stacks: LIFO',
        description: 'Pilas: Last In First Out. Implementación y aplicaciones.',
        difficulty: 'easy' as const,
        duration: 40,
      },
      {
        id: 'queues-intro',
        title: 'Queues: FIFO',
        description: 'Colas: First In First Out. Implementación y variantes.',
        difficulty: 'easy' as const,
        duration: 45,
      },
      {
        id: 'stacks-monotonic',
        title: 'Monotonic Stack',
        description: 'Usa stacks monótonos para problemas de siguiente mayor/menor.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'stacks-calculator',
        title: 'Calculadoras con Stack',
        description: 'Implementa calculadoras que evalúan expresiones.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'deque-sliding-window',
        title: 'Deque y Sliding Window',
        description: 'Usa deques para ventanas deslizantes eficientes.',
        difficulty: 'hard' as const,
        duration: 50,
      },
      {
        id: 'priority-queue',
        title: 'Priority Queue (Heap)',
        description: 'Usa heaps como colas de prioridad.',
        difficulty: 'medium' as const,
        duration: 45,
      },
    ],
  },
  {
    id: 'bit-manipulation',
    number: 7,
    title: 'Bit Manipulation',
    description: 'Operaciones a nivel de bits para resolver problemas de manera eficiente y elegante.',
    icon: Code2,
    iconBg: 'bg-cyan-500/20',
    duration: '8 horas',
    exercisesCount: 15,
    topics: ['Operadores Bitwise', 'AND OR XOR NOT', 'Shifts', 'Máscaras de Bits', 'Trucos Comunes', 'Potencias de 2'],
    prerequisites: ['stacks-queues'],
    objectives: [
      'Dominar operadores AND, OR, XOR, NOT y shifts',
      'Verificar y manipular bits individuales',
      'Detectar potencias de 2 eficientemente',
      'Resolver problemas clásicos como Single Number',
      'Aplicar XOR para encontrar elementos únicos',
      'Usar bit manipulation para optimizar espacio',
    ],
    tips: [
      'XOR es fundamental: a ^ a = 0',
      'n & (n-1) elimina el bit 1 más bajo',
      'Shifts son multiplicar/dividir por 2',
      'Practica con Single Number y variantes',
    ],
    lessons: [
      {
        id: 'bit-operadores-basicos',
        title: 'Operadores Bitwise Básicos',
        description: 'Domina AND, OR, XOR, NOT y shifts.',
        difficulty: 'medium' as const,
        duration: 40,
      },
      {
        id: 'bit-trucos-comunes',
        title: 'Trucos Comunes de Bits',
        description: 'Técnicas esenciales para manipular bits.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'bit-problemas-clasicos',
        title: 'Problemas Clásicos de Bits',
        description: 'Resuelve problemas frecuentes en entrevistas.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'bit-xor-applications',
        title: 'Aplicaciones de XOR',
        description: 'Domina las propiedades únicas de XOR.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'bit-masks',
        title: 'Máscaras de Bits',
        description: 'Usa máscaras para manipular conjuntos de bits.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'bit-advanced',
        title: 'Técnicas Avanzadas de Bits',
        description: 'Técnicas avanzadas para optimización.',
        difficulty: 'hard' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'trees',
    number: 8,
    title: 'Árboles Binarios',
    description: 'Estructuras jerárquicas fundamentales para organizar datos.',
    icon: TreeDeciduous,
    iconBg: 'bg-emerald-500/20',
    duration: '10 horas',
    exercisesCount: 20,
    topics: ['Binary Trees', 'Tree Traversals', 'DFS', 'BFS', 'Height/Depth', 'Path Problems'],
    prerequisites: ['stacks-queues'],
    objectives: [
      'Implementar recorridos preorder, inorder, postorder',
      'Resolver problemas con DFS y BFS',
      'Calcular altura y profundidad',
      'Encontrar caminos en árboles',
    ],
    tips: [
      'La recusión es natural para árboles',
      'Inorder en BST da orden ascendente',
      'BFS usa queue, DFS usa stack/recursion',
      'Dibuja los árboles para visualizar',
    ],
    lessons: [
      {
        id: 'trees-intro',
        title: 'Introducción a Árboles',
        description: 'Conceptos básicos, terminología y recorridos.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'trees-traversals',
        title: 'Recorridos de Árboles',
        description: 'Preorder, inorder, postorder y level order.',
        difficulty: 'medium' as const,
        duration: 55,
      },
      {
        id: 'trees-dfs',
        title: 'DFS en Árboles',
        description: 'Técnicas de búsqueda en profundidad.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'trees-bfs',
        title: 'BFS en Árboles',
        description: 'Búsqueda por niveles y level-order.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'trees-construction',
        title: 'Construcción de Árboles',
        description: 'Construye árboles desde recorridos.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'trees-lca',
        title: 'Lowest Common Ancestor',
        description: 'Encuentra el ancestro común más bajo.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'trees-diameter',
        title: 'Diámetro y Propiedades',
        description: 'Calcula diámetro, balance y otras propiedades.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'trees-subtree',
        title: 'Problemas de Subárboles',
        description: 'Trabaja con subárboles y comparaciones.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'trees-views',
        title: 'Vistas del Árbol',
        description: 'Left, right, top y bottom view.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'trees-advanced',
        title: 'Problemas Avanzados',
        description: 'House Robber III, Boundary Traversal.',
        difficulty: 'hard' as const,
        duration: 60,
      },
    ],
  },
  {
    id: 'bst',
    number: 9,
    title: 'Binary Search Trees',
    description: 'Árboles de búsqueda binaria para búsquedas eficientes.',
    icon: Search,
    iconBg: 'bg-amber-500/20',
    duration: '8 horas',
    exercisesCount: 15,
    topics: ['BST Properties', 'Search', 'Insert', 'Delete', 'Validation', 'Balancing'],
    prerequisites: ['trees'],
    objectives: [
      'Entender las propiedades de BST',
      'Implementar búsqueda, inserción y eliminación',
      'Validar si un árbol es BST',
      'Encontrar elementos por rango',
    ],
    tips: [
      'Left < Root < Right siempre',
      'Inorder traversal da orden ascendente',
      'Búsqueda es O(h) donde h es altura',
      'BST desbalanceado puede ser O(n)',
    ],
    lessons: [
      {
        id: 'bst-intro',
        title: 'Binary Search Trees',
        description: 'Propiedades, búsqueda, inserción y eliminación en BST.',
        difficulty: 'medium' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'heaps',
    number: 10,
    title: 'Heaps y Priority Queues',
    description: 'Estructuras para acceder rápidamente al elemento máximo o mínimo.',
    icon: Layers,
    iconBg: 'bg-rose-500/20',
    duration: '8 horas',
    exercisesCount: 15,
    topics: ['Min Heap', 'Max Heap', 'Heapify', 'Priority Queue', 'Top K', 'Merge K Sorted'],
    prerequisites: ['trees'],
    objectives: [
      'Entender la estructura del heap',
      'Usar heapq de Python',
      'Resolver problemas Top K',
      'Implementar merge de k listas ordenadas',
    ],
    tips: [
      'Python heapq es min-heap',
      'Para max-heap usa valores negativos',
      'heapify es O(n), no O(n log n)',
      'Ideal para encontrar min/max dinámico',
    ],
    lessons: [
      {
        id: 'heaps-intro',
        title: 'Heaps y Priority Queues',
        description: 'Min/Max heaps, heapify y aplicaciones.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'heaps-aplicaciones',
        title: 'Aplicaciones de Heaps',
        description: 'Merge k sorted lists, top k elements, median finding.',
        difficulty: 'medium' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'graphs',
    number: 11,
    title: 'Grafos',
    description: 'Estructuras para modelar relaciones y conexiones.',
    icon: Network,
    iconBg: 'bg-indigo-500/20',
    duration: '12 horas',
    exercisesCount: 25,
    topics: ['Graph Representation', 'BFS', 'DFS', 'Connected Components', 'Cycle Detection', 'Islands'],
    prerequisites: ['trees'],
    objectives: [
      'Representar grafos con adjacency list/matrix',
      'Implementar BFS y DFS en grafos',
      'Detectar ciclos',
      'Encontrar componentes conectados',
    ],
    tips: [
      'BFS para camino más corto sin pesos',
      'DFS para exploración completa',
      'Siempre marca nodos visitados',
      'Matrices son grafos implícitos',
    ],
    lessons: [
      {
        id: 'graphs-intro',
        title: 'Introducción a Grafos',
        description: 'Representación, BFS y DFS en grafos.',
        difficulty: 'medium' as const,
        duration: 55,
      },
      {
        id: 'graphs-problemas',
        title: 'Problemas de Grafos',
        description: 'Clone graph, course schedule, pacific atlantic.',
        difficulty: 'medium' as const,
        duration: 60,
      },
    ],
  },
  {
    id: 'recursion-backtracking',
    number: 12,
    title: 'Recursión y Backtracking',
    description: 'Técnicas para explorar todas las soluciones posibles.',
    icon: Repeat,
    iconBg: 'bg-fuchsia-500/20',
    duration: '10 horas',
    exercisesCount: 20,
    topics: ['Recursion', 'Backtracking', 'Permutations', 'Combinations', 'Subsets', 'N-Queens'],
    prerequisites: ['graphs'],
    objectives: [
      'Escribir funciones recursivas correctamente',
      'Aplicar el patrón de backtracking',
      'Generar permutaciones y combinaciones',
      'Resolver N-Queens y Sudoku',
    ],
    tips: [
      'Siempre define el caso base',
      'Backtracking = elegir, explorar, deshacer',
      'Visualiza el árbol de decisiones',
      'Poda temprana mejora eficiencia',
    ],
    lessons: [
      {
        id: 'recursion-intro',
        title: 'Recursión y Backtracking',
        description: 'Fundamentos de recursión y técnica de backtracking.',
        difficulty: 'medium' as const,
        duration: 55,
      },
      {
        id: 'backtracking-intro',
        title: 'Problemas de Backtracking',
        description: 'N-Queens, Sudoku solver.',
        difficulty: 'hard' as const,
        duration: 60,
      },
      {
        id: 'backtracking-subsets',
        title: 'Subsets y Combinations',
        description: 'Genera todos los subconjuntos y combinaciones.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'backtracking-permutations',
        title: 'Permutations',
        description: 'Genera todas las permutaciones posibles.',
        difficulty: 'medium' as const,
        duration: 45,
      },
      {
        id: 'backtracking-string',
        title: 'Backtracking con Strings',
        description: 'Letter combinations, palindrome partitioning.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'backtracking-matrix',
        title: 'Backtracking en Matrices',
        description: 'Word Search y Sudoku Solver.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'backtracking-path',
        title: 'Problemas de Caminos',
        description: 'Encontrar todos los caminos posibles.',
        difficulty: 'hard' as const,
        duration: 50,
      },
      {
        id: 'backtracking-optimization',
        title: 'Optimización de Backtracking',
        description: 'Técnicas de poda y optimización.',
        difficulty: 'hard' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'dynamic-programming',
    number: 13,
    title: 'Programación Dinámica',
    description: 'Optimización de problemas con subproblemas superpuestos.',
    icon: Brain,
    iconBg: 'bg-violet-500/20',
    duration: '15 horas',
    exercisesCount: 30,
    topics: ['Memoization', 'Tabulation', 'Fibonacci', 'Climbing Stairs', 'Coin Change', 'LCS', 'Knapsack'],
    prerequisites: ['recursion-backtracking'],
    objectives: [
      'Identificar problemas de DP',
      'Implementar memoization y tabulation',
      'Resolver problemas clásicos de DP',
      'Optimizar espacio en soluciones DP',
    ],
    tips: [
      'Busca subproblemas superpuestos',
      'Define la recursión antes de optimizar',
      'Bottom-up suele ser más eficiente',
      'Practica identificando el estado',
    ],
    lessons: [
      {
        id: 'dp-intro',
        title: 'Introducción a DP',
        description: 'Overlapping subproblems y optimal substructure.',
        difficulty: 'medium' as const,
        duration: 55,
      },
      {
        id: 'dp-problemas',
        title: 'Problemas Clásicos de DP',
        description: 'Coin change, LIS, LCS.',
        difficulty: 'hard' as const,
        duration: 65,
      },
      {
        id: 'dp-1d-patterns',
        title: 'Patrones DP 1D',
        description: 'House Robber, Maximum Subarray.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'dp-2d-patterns',
        title: 'Patrones DP 2D',
        description: 'Unique Paths, Minimum Path Sum.',
        difficulty: 'medium' as const,
        duration: 55,
      },
      {
        id: 'dp-knapsack',
        title: 'Problemas Knapsack',
        description: '0/1 Knapsack, Unbounded Knapsack.',
        difficulty: 'hard' as const,
        duration: 60,
      },
      {
        id: 'dp-coin-change',
        title: 'Coin Change Patterns',
        description: 'Problemas de cambio de monedas.',
        difficulty: 'medium' as const,
        duration: 50,
      },
      {
        id: 'dp-subsequences',
        title: 'Subsequences DP',
        description: 'LIS, LCS, Longest Palindromic.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'dp-strings',
        title: 'String DP',
        description: 'Edit distance, regex matching.',
        difficulty: 'hard' as const,
        duration: 60,
      },
      {
        id: 'dp-matrix',
        title: 'Matrix DP',
        description: 'Maximal square, rectangle.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'dp-intervals',
        title: 'Interval DP',
        description: 'Burst balloons, matrix chain.',
        difficulty: 'hard' as const,
        duration: 60,
      },
      {
        id: 'dp-state-machine',
        title: 'State Machine DP',
        description: 'Stock problems, state transitions.',
        difficulty: 'hard' as const,
        duration: 55,
      },
      {
        id: 'dp-bitmask',
        title: 'Bitmask DP',
        description: 'TSP, subset combinations.',
        difficulty: 'hard' as const,
        duration: 60,
      },
      {
        id: 'dp-digit',
        title: 'Digit DP',
        description: 'Count numbers with properties.',
        difficulty: 'hard' as const,
        duration: 60,
      },
      {
        id: 'dp-trees',
        title: 'Tree DP',
        description: 'DP sobre estructuras de árboles.',
        difficulty: 'hard' as const,
        duration: 60,
      },
    ],
  },
  {
    id: 'binary-search',
    number: 14,
    title: 'Binary Search',
    description: 'Búsqueda eficiente en datos ordenados.',
    icon: Search,
    iconBg: 'bg-sky-500/20',
    duration: '8 horas',
    exercisesCount: 15,
    topics: ['Classic Binary Search', 'Search Variants', 'Rotated Array', 'Search Space', 'Bisect Module'],
    prerequisites: ['arrays-strings'],
    objectives: [
      'Implementar binary search sin bugs',
      'Encontrar primera/última ocurrencia',
      'Buscar en arrays rotados',
      'Aplicar binary search en espacios de búsqueda abstractos',
    ],
    tips: [
      'Cuidado con off-by-one errors',
      'mid = left + (right - left) // 2 evita overflow',
      'Piensa en invariantes del loop',
      'Binary search no solo para arrays',
    ],
    lessons: [
      {
        id: 'binary-search-intro',
        title: 'Binary Search Fundamentals',
        description: 'Búsqueda binaria clásica y variantes.',
        difficulty: 'easy' as const,
        duration: 45,
      },
    ],
  },
  {
    id: 'sorting-algorithms',
    number: 15,
    title: 'Algoritmos de Ordenamiento',
    description: 'Comprender y aplicar diferentes algoritmos de ordenamiento.',
    icon: SortAsc,
    iconBg: 'bg-lime-500/20',
    duration: '8 horas',
    exercisesCount: 12,
    topics: ['Quick Sort', 'Merge Sort', 'Heap Sort', 'Counting Sort', 'Stability', 'Custom Comparators'],
    prerequisites: ['arrays-strings'],
    objectives: [
      'Implementar quick sort y merge sort',
      'Entender cuándo usar cada algoritmo',
      'Usar sorted() con comparadores custom',
      'Conocer sorting estable vs inestable',
    ],
    tips: [
      'Python usa TimSort (híbrido)',
      'Quick sort es in-place, merge sort no',
      'Counting sort para rangos pequeños',
      'sorted() es O(n log n) siempre',
    ],
    lessons: [
      {
        id: 'sorting-intro',
        title: 'Algoritmos de Ordenamiento',
        description: 'Quick sort, merge sort, y cuándo usar cada uno.',
        difficulty: 'medium' as const,
        duration: 55,
      },
    ],
  },
  {
    id: 'advanced-graphs',
    number: 16,
    title: 'Grafos Avanzados',
    description: 'Algoritmos avanzados: Dijkstra, topological sort, union find.',
    icon: Route,
    iconBg: 'bg-red-500/20',
    duration: '12 horas',
    exercisesCount: 20,
    topics: ['Dijkstra', 'Bellman-Ford', 'Topological Sort', 'Union Find', 'Kruskal', 'Prim'],
    prerequisites: ['graphs', 'heaps'],
    objectives: [
      'Implementar Dijkstra con heap',
      'Realizar topological sort',
      'Usar Union Find para componentes',
      'Encontrar árbol de expansión mínima',
    ],
    tips: [
      'Dijkstra solo para pesos positivos',
      'Topological sort solo para DAGs',
      'Union Find con path compression',
      'Kruskal ordena aristas, Prim usa heap',
    ],
    lessons: [
      {
        id: 'advanced-graphs-intro',
        title: 'Grafos Avanzados',
        description: 'Dijkstra, topological sort, union find.',
        difficulty: 'hard' as const,
        duration: 60,
      },
    ],
  },
  {
    id: 'tries',
    number: 17,
    title: 'Tries',
    description: 'Estructuras de prefijos para búsqueda eficiente de strings.',
    icon: FileSearch,
    iconBg: 'bg-pink-500/20',
    duration: '6 horas',
    exercisesCount: 10,
    topics: ['Trie Implementation', 'Insert/Search', 'Prefix Search', 'Autocomplete', 'Word Search'],
    prerequisites: ['trees'],
    objectives: [
      'Implementar un Trie desde cero',
      'Buscar palabras y prefijos',
      'Implementar autocomplete',
      'Resolver Word Search II',
    ],
    tips: [
      'Cada nodo tiene hasta 26 hijos (a-z)',
      'Marca el fin de palabra',
      'Ideal para diccionarios y autocomplete',
      'Combina bien con backtracking',
    ],
    lessons: [
      {
        id: 'tries-intro',
        title: 'Tries (Prefix Trees)',
        description: 'Estructura para búsqueda eficiente de strings por prefijo.',
        difficulty: 'medium' as const,
        duration: 50,
      },
    ],
  },
  {
    id: 'interview-prep',
    number: 18,
    title: 'Preparación para Entrevistas',
    description: 'Estrategias y técnicas para entrevistas técnicas.',
    icon: Briefcase,
    iconBg: 'bg-yellow-500/20',
    duration: '6 horas',
    exercisesCount: 0,
    topics: ['UMPIRE Framework', 'Communication', 'Time Management', 'Pattern Recognition', 'Mock Interviews'],
    prerequisites: [],
    objectives: [
      'Aplicar el framework UMPIRE',
      'Comunicar tu pensamiento claramente',
      'Manejar el tiempo en entrevistas',
      'Reconocer patrones rápidamente',
    ],
    tips: [
      'Siempre clarifica antes de codear',
      'Piensa en voz alta',
      'Empieza con fuerza bruta, luego optimiza',
      'Practica con mock interviews',
    ],
    lessons: [
      {
        id: 'interview-prep-intro',
        title: 'Preparación para Entrevistas',
        description: 'Estrategias, patrones comunes y cómo comunicar tu solución.',
        difficulty: 'easy' as const,
        duration: 45,
      },
    ],
  },
];

export default ModuleDetailPage;
