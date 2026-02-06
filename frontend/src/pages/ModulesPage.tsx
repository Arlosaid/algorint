import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  BookOpen,
  Code2,
  Clock,
  ArrowRight,
  Filter,
  FileCode,
  BarChart3,
  FileText,
  FolderKey,
  Link2,
  Layers,
  TreeDeciduous,
  RotateCcw,
  Gem
} from 'lucide-react';
import { Card, Button, ProgressBar } from '../components/ui';
import { useProgress } from '../context/ProgressContext';

/**
 * ModulesPage
 * ===========
 * Lista todos los módulos educativos disponibles.
 * Permite filtrar y buscar módulos.
 */
const ModulesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const { getModuleProgress } = useProgress();

  // Filtrar módulos
  const filteredModules = modules.filter(module => {
    const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         module.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const lessonIds = moduleLessonsMap[module.id] || [];
    const moduleProgress = getModuleProgress(module.id, module.lessons, lessonIds);
    
    if (selectedFilter === 'all') return matchesSearch;
    if (selectedFilter === 'completed') return matchesSearch && moduleProgress.percentComplete === 100;
    if (selectedFilter === 'in-progress') {
      return matchesSearch && moduleProgress.percentComplete > 0 && moduleProgress.percentComplete < 100;
    }
    if (selectedFilter === 'not-started') return matchesSearch && moduleProgress.percentComplete === 0;
    
    return matchesSearch;
  });

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Módulos de Aprendizaje
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Explora todos los módulos disponibles. Cada uno está diseñado para
            llevarte del concepto a la maestría.
          </p>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 max-w-3xl mx-auto">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" size={20} />
            <input
              type="text"
              placeholder="Buscar módulos..."
              className="input pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filter */}
          <div className="flex items-center gap-2">
            <Filter className="text-dark-500" size={20} />
            <select
              className="input w-auto"
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
            >
              <option value="all">Todos</option>
              <option value="not-started">No iniciados</option>
              <option value="in-progress">En progreso</option>
              <option value="completed">Completados</option>
            </select>
          </div>
        </div>

        {/* Modules grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredModules.map((module) => {
            const lessonIds = moduleLessonsMap[module.id] || [];
            const progress = getModuleProgress(module.id, module.lessons, lessonIds);
            const isCompleted = progress.percentComplete === 100;
            const isInProgress = progress.percentComplete > 0 && !isCompleted;

            return (
              <Link key={module.id} to={`/modules/${module.id}`}>
                <Card hover className="h-full group">
                  {/* Module gradient header */}
                  <div className={`h-2 rounded-t-xl -mx-6 -mt-6 mb-4 ${module.gradient}`} />

                  {/* Icon and number */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${module.iconBg}`}>
                      <module.icon size={28} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <span className="text-dark-500 text-sm">Módulo {module.number}</span>
                      <h3 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                        {module.title}
                      </h3>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-dark-400 text-sm mb-4 line-clamp-2">
                    {module.description}
                  </p>

                  {/* Topics preview */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {module.topics.slice(0, 4).map((topic, i) => (
                      <span 
                        key={i}
                        className="px-2 py-0.5 bg-dark-700 text-dark-400 text-xs rounded"
                      >
                        {topic}
                      </span>
                    ))}
                    {module.topics.length > 4 && (
                      <span className="text-dark-500 text-xs">
                        +{module.topics.length - 4} más
                      </span>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-dark-500 mb-4">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {module.lessons}
                    </span>
                    <span className="flex items-center gap-1">
                      <Code2 size={14} />
                      {module.exercises}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {module.duration}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="pt-4 border-t border-dark-700">
                    <ProgressBar value={progress.percentComplete} size="sm" />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-dark-500 text-xs">
                        {progress.lessonsCompleted}/{module.lessons} lecciones
                      </span>
                      <span className={`text-xs font-medium flex items-center gap-1 ${
                        isCompleted ? 'text-primary-400' : isInProgress ? 'text-secondary-400' : 'text-dark-500'
                      }`}>
                        {isCompleted ? 'Completado' : isInProgress ? 'Continuar' : 'Comenzar'}
                        <ArrowRight size={12} />
                      </span>
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredModules.length === 0 && (
          <div className="text-center py-16">
            <p className="text-dark-400 text-lg">
              No se encontraron módulos con los filtros actuales.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedFilter('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// DATA - Sincronizado con el backend
// ============================================

// Mapa de IDs de lecciones por módulo (para calcular progreso)
// Sincronizado con ModuleDetailPage.tsx
const moduleLessonsMap: Record<string, string[]> = {
  'fundamentos-python': [
    'python-listas-tuplas',
    'python-diccionarios-sets',
    'python-strings',
    'python-comprehensions',
    'python-lambdas',
    'python-iteradores',
  ],
  'complejidad-algoritmica': [
    'big-o-introduccion',
    'big-o-analisis-tiempo',
    'big-o-analisis-espacio',
    'big-o-casos',
    'big-o-comparacion',
  ],
  'arrays-strings': [
    'two-pointers',
    'sliding-window',
    'prefix-sum',
    'string-manipulation',
    'in-place-operations',
    'subarray-problems',
    'palindromes-anagrams',
    'matrix-traversal',
  ],
  'hash-tables': [
    'hash-tables-fundamentos',
    'hash-tables-problemas',
    'hash-counting',
    'hash-two-sum-patterns',
    'hash-set-operations',
    'hash-design-problems',
  ],
  'linked-lists': [
    'linked-lists-intro',
    'linked-lists-two-pointers',
    'linked-lists-reversal',
    'linked-lists-merge-sort',
    'linked-lists-advanced',
    'linked-lists-doubly',
    'linked-lists-problems',
  ],
  'stacks-queues': [
    'stacks-intro',
    'queues-intro',
    'stacks-monotonic',
    'stacks-calculator',
    'deque-sliding-window',
    'priority-queue',
  ],
  'bit-manipulation': [
    'bit-operadores-basicos',
    'bit-trucos-comunes',
    'bit-problemas-clasicos',
    'bit-xor-applications',
    'bit-masks',
    'bit-advanced',
  ],
  'trees': [
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
  ],
  'bst': [
    'bst-intro',
  ],
  'heaps': [
    'heaps-intro',
    'heaps-aplicaciones',
  ],
  'graphs': [
    'graphs-intro',
    'graphs-problemas',
  ],
  'recursion-backtracking': [
    'recursion-intro',
    'backtracking-intro',
    'backtracking-subsets',
    'backtracking-permutations',
    'backtracking-string',
    'backtracking-matrix',
    'backtracking-path',
    'backtracking-optimization',
  ],
  'dynamic-programming': [
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
  ],
  'binary-search': [
    'binary-search-intro',
  ],
  'sorting-algorithms': [
    'sorting-intro',
  ],
  'advanced-graphs': [
    'advanced-graphs-intro',
  ],
  'tries': [
    'tries-intro',
  ],
  'interview-prep': [
    'interview-prep-intro',
  ],
};

const modules = [
  {
    id: 'fundamentos-python',
    number: 1,
    title: 'Fundamentos de Python para Algoritmos',
    description: 'Domina las estructuras de datos nativas de Python y las técnicas esenciales para resolver problemas algorítmicos.',
    icon: FileCode,
    gradient: 'bg-gradient-to-r from-slate-500 to-slate-600',
    iconBg: 'bg-slate-500/20',
    duration: '10h',
    lessons: 6,
    exercises: 10,
    topics: ['Listas y Tuplas', 'Diccionarios y Sets', 'Strings', 'Comprehensions', 'Lambdas', 'Generadores'],
  },
  {
    id: 'complejidad-algoritmica',
    number: 2,
    title: 'Complejidad Algorítmica (Big O)',
    description: 'Aprende a analizar y comparar la eficiencia de algoritmos usando notación Big O.',
    icon: BarChart3,
    gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/20',
    duration: '6h',
    lessons: 5,
    exercises: 10,
    topics: ['Notación Big O', 'Complejidad Temporal', 'Complejidad Espacial', 'Análisis de Casos'],
  },
  {
    id: 'arrays-strings',
    number: 3,
    title: 'Arrays y Strings',
    description: 'Técnicas fundamentales para manipular arrays y strings, los tipos de datos más comunes en entrevistas.',
    icon: FileText,
    gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
    iconBg: 'bg-green-500/20',
    duration: '12h',
    lessons: 8,
    exercises: 25,
    topics: ['Two Pointers', 'Sliding Window', 'Prefix Sum', 'Subarrays', 'Palindromos'],
  },
  {
    id: 'hash-tables',
    number: 4,
    title: 'Hash Tables y Diccionarios',
    description: 'Domina el uso de hash tables para resolver problemas en tiempo O(1).',
    icon: FolderKey,
    gradient: 'bg-gradient-to-r from-purple-500 to-violet-500',
    iconBg: 'bg-purple-500/20',
    duration: '8h',
    lessons: 6,
    exercises: 20,
    topics: ['Hash Functions', 'Two Sum Pattern', 'Frequency Counter', 'Grouping', 'Caching'],
  },
  {
    id: 'linked-lists',
    number: 5,
    title: 'Listas Enlazadas',
    description: 'Aprende a manipular listas enlazadas, una estructura fundamental en ciencias de la computación.',
    icon: Link2,
    gradient: 'bg-gradient-to-r from-orange-500 to-amber-500',
    iconBg: 'bg-orange-500/20',
    duration: '10h',
    lessons: 7,
    exercises: 20,
    topics: ['Singly Linked List', 'Fast & Slow Pointers', 'Reverse', 'Cycle Detection', 'Merge'],
  },
  {
    id: 'stacks-queues',
    number: 6,
    title: 'Stacks y Queues',
    description: 'Estructuras LIFO y FIFO esenciales para muchos algoritmos.',
    icon: Layers,
    gradient: 'bg-gradient-to-r from-teal-500 to-cyan-500',
    iconBg: 'bg-teal-500/20',
    duration: '8h',
    lessons: 6,
    exercises: 18,
    topics: ['Stack', 'Queue', 'Monotonic Stack', 'Valid Parentheses', 'BFS Basics'],
  },
  {
    id: 'bit-manipulation',
    number: 7,
    title: 'Bit Manipulation',
    description: 'Operaciones a nivel de bits para resolver problemas de manera eficiente y elegante.',
    icon: Code2,
    gradient: 'bg-gradient-to-r from-cyan-500 to-blue-500',
    iconBg: 'bg-cyan-500/20',
    duration: '8h',
    lessons: 6,
    exercises: 15,
    topics: ['Operadores Bitwise', 'AND OR XOR', 'Shifts', 'Máscaras', 'Single Number'],
  },
  {
    id: 'trees',
    number: 8,
    title: 'Árboles Binarios',
    description: 'Domina los árboles binarios y sus traversals, fundamentales para entrevistas técnicas.',
    icon: TreeDeciduous,
    gradient: 'bg-gradient-to-r from-yellow-500 to-orange-500',
    iconBg: 'bg-yellow-500/20',
    duration: '14h',
    lessons: 10,
    exercises: 30,
    topics: ['DFS Traversals', 'BFS Traversal', 'Path Problems', 'Tree Construction'],
  },
  {
    id: 'recursion-backtracking',
    number: 9,
    title: 'Recursión y Backtracking',
    description: 'Técnicas para resolver problemas de combinatoria y búsqueda exhaustiva.',
    icon: RotateCcw,
    gradient: 'bg-gradient-to-r from-red-500 to-pink-500',
    iconBg: 'bg-red-500/20',
    duration: '12h',
    lessons: 8,
    exercises: 25,
    topics: ['Recursion', 'Backtracking', 'Permutations', 'Combinations', 'Subsets'],
  },
  {
    id: 'dynamic-programming',
    number: 10,
    title: 'Programación Dinámica',
    description: 'La técnica más desafiante y común en entrevistas técnicas de alto nivel.',
    icon: Gem,
    gradient: 'bg-gradient-to-r from-indigo-500 to-purple-500',
    iconBg: 'bg-indigo-500/20',
    duration: '20h',
    lessons: 14,
    exercises: 40,
    topics: ['1D DP', '2D DP', 'Knapsack', 'LCS', 'Grid Problems'],
  },
];

export default ModulesPage;
