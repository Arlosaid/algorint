import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search,
  Code2,
  ArrowRight,
  CheckCircle,
  Target
} from 'lucide-react';
import { Card, Button, DifficultyBadge, ProgressBar } from '../components/ui';
import { useProgress } from '../context/ProgressContext';
import { Difficulty, AlgorithmPattern } from '../types';

/**
 * PracticePage
 * ============
 * Lista de todos los ejercicios disponibles para práctica.
 * Filtros por dificultad, categoría y patrón.
 */
const PracticePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedPattern, setSelectedPattern] = useState<AlgorithmPattern | 'all'>('all');
  const { getExerciseStatus } = useProgress();

  // Filtrar ejercicios
  const filteredExercises = exercises.filter(exercise => {
    const matchesSearch = exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         exercise.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDifficulty = selectedDifficulty === 'all' || exercise.difficulty === selectedDifficulty;
    const matchesPattern = selectedPattern === 'all' || exercise.pattern === selectedPattern;
    
    return matchesSearch && matchesDifficulty && matchesPattern;
  });

  // Stats
  const totalSolved = exercises.filter(e => getExerciseStatus(e.id) === 'completed').length;
  const easyCount = exercises.filter(e => e.difficulty === 'easy' && getExerciseStatus(e.id) === 'completed').length;
  const mediumCount = exercises.filter(e => e.difficulty === 'medium' && getExerciseStatus(e.id) === 'completed').length;
  const hardCount = exercises.filter(e => e.difficulty === 'hard' && getExerciseStatus(e.id) === 'completed').length;

  return (
    <div className="min-h-screen py-6 md:py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-white mb-3 md:mb-4">
            Área de Práctica
          </h1>
          <p className="text-dark-400 text-base md:text-lg max-w-2xl mx-auto">
            Resuelve ejercicios tipo LeetCode organizados por dificultad y patrón.
            Cada ejercicio incluye pistas, soluciones y explicaciones detalladas.
          </p>
        </div>

        {/* Stats - Compact on mobile, cards on desktop */}
        {/* Mobile stats bar */}
        <div className="md:hidden mb-4">
          <Card className="!p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-dark-400 text-xs">Progreso: {totalSolved}/{exercises.length}</span>
              <span className="text-white text-xs font-semibold">{Math.round((totalSolved / exercises.length) * 100)}%</span>
            </div>
            <ProgressBar value={totalSolved} max={exercises.length} size="sm" className="mb-3" />
            <div className="flex justify-around">
              <div className="text-center">
                <div className="text-lg font-bold text-green-400">{easyCount}</div>
                <div className="text-dark-500 text-[10px]">Fácil</div>
              </div>
              <div className="w-px bg-dark-700" />
              <div className="text-center">
                <div className="text-lg font-bold text-yellow-400">{mediumCount}</div>
                <div className="text-dark-500 text-[10px]">Medio</div>
              </div>
              <div className="w-px bg-dark-700" />
              <div className="text-center">
                <div className="text-lg font-bold text-red-400">{hardCount}</div>
                <div className="text-dark-500 text-[10px]">Difícil</div>
              </div>
            </div>
          </Card>
        </div>
        
        {/* Desktop stats cards */}
        <div className="hidden md:grid grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <div className="text-3xl font-bold text-white">{totalSolved}</div>
            <div className="text-dark-500 text-sm">Total Resueltos</div>
            <ProgressBar value={totalSolved} max={exercises.length} size="sm" className="mt-2" />
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-green-400">{easyCount}</div>
            <div className="text-dark-500 text-sm">Fácil</div>
            <ProgressBar value={easyCount} max={exercises.filter(e => e.difficulty === 'easy').length} size="sm" color="success" className="mt-2" />
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-yellow-400">{mediumCount}</div>
            <div className="text-dark-500 text-sm">Medio</div>
            <ProgressBar value={mediumCount} max={exercises.filter(e => e.difficulty === 'medium').length} size="sm" className="mt-2" />
          </Card>
          <Card className="text-center">
            <div className="text-3xl font-bold text-red-400">{hardCount}</div>
            <div className="text-dark-500 text-sm">Difícil</div>
            <ProgressBar value={hardCount} max={exercises.filter(e => e.difficulty === 'hard').length} size="sm" className="mt-2" />
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 md:gap-4 mb-6 md:mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-500" size={20} />
            <input
              type="text"
              placeholder="Buscar ejercicios..."
              className="input pl-12"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Difficulty filter */}
          <select
            className="input w-full md:w-auto"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'all')}
          >
            <option value="all">Todas las dificultades</option>
            <option value="easy">Fácil</option>
            <option value="medium">Medio</option>
            <option value="hard">Difícil</option>
          </select>

          {/* Pattern filter */}
          <select
            className="input w-full md:w-auto"
            value={selectedPattern}
            onChange={(e) => setSelectedPattern(e.target.value as AlgorithmPattern | 'all')}
          >
            <option value="all">Todos los patrones</option>
            <option value="two-pointers">Two Pointers</option>
            <option value="sliding-window">Sliding Window</option>
            <option value="binary-search">Binary Search</option>
            <option value="hashing">Hashing</option>
            <option value="recursion">Recursión</option>
            <option value="dynamic-programming">Dynamic Programming</option>
            <option value="bfs">BFS</option>
            <option value="dfs">DFS</option>
          </select>
        </div>

        {/* Exercises list */}
        <div className="space-y-3 md:space-y-4">
          {filteredExercises.map((exercise) => {
            const status = getExerciseStatus(exercise.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';

            return (
              <Link key={exercise.id} to={`/practice/${exercise.id}`}>
                <Card hover className="group">
                  <div className="flex items-center gap-3 md:gap-4">
                    {/* Status */}
                    <div className={`
                      w-8 h-8 md:w-10 md:h-10 rounded-lg flex items-center justify-center flex-shrink-0
                      ${isCompleted 
                        ? 'bg-primary-500/20' 
                        : isInProgress 
                          ? 'bg-secondary-500/20'
                          : 'bg-dark-700'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="text-primary-400" size={18} />
                      ) : (
                        <Code2 className={isInProgress ? 'text-secondary-400' : 'text-dark-500'} size={18} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-1">
                        <h3 className="text-base md:text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {exercise.title}
                        </h3>
                        <DifficultyBadge difficulty={exercise.difficulty} size="sm" />
                      </div>
                      <p className="text-dark-500 text-xs md:text-sm line-clamp-1">
                        {exercise.description}
                      </p>
                      {/* Tags - visible on mobile below description */}
                      <div className="flex md:hidden items-center gap-1.5 mt-1.5">
                        <span className="px-1.5 py-0.5 bg-dark-700 text-dark-400 text-[10px] rounded">
                          {exercise.category}
                        </span>
                        <span className="px-1.5 py-0.5 bg-secondary-500/20 text-secondary-400 text-[10px] rounded">
                          {patternLabels[exercise.pattern]}
                        </span>
                      </div>
                    </div>

                    {/* Tags - desktop */}
                    <div className="hidden md:flex items-center gap-2">
                      <span className="px-2 py-1 bg-dark-700 text-dark-400 text-xs rounded">
                        {exercise.category}
                      </span>
                      <span className="px-2 py-1 bg-secondary-500/20 text-secondary-400 text-xs rounded">
                        {patternLabels[exercise.pattern]}
                      </span>
                    </div>

                    {/* Arrow */}
                    <ArrowRight 
                      className="text-dark-600 group-hover:text-primary-400 transition-colors hidden md:block" 
                      size={20} 
                    />
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredExercises.length === 0 && (
          <Card className="text-center py-12">
            <Target className="text-dark-600 mx-auto mb-4" size={48} />
            <p className="text-dark-400 text-lg mb-4">
              No se encontraron ejercicios con los filtros actuales.
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedDifficulty('all');
                setSelectedPattern('all');
              }}
            >
              Limpiar filtros
            </Button>
          </Card>
        )}
      </div>
    </div>
  );
};

// ============================================
// DATA
// ============================================

const patternLabels: Record<string, string> = {
  'two-pointers': 'Two Pointers',
  'sliding-window': 'Sliding Window',
  'binary-search': 'Binary Search',
  'hashing': 'Hashing',
  'recursion': 'Recursión',
  'dynamic-programming': 'DP',
  'bfs': 'BFS',
  'dfs': 'DFS',
  'sorting': 'Sorting',
  'greedy': 'Greedy',
};

const exercises = [
  // === EASY ===
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: 'Encuentra dos números en un array que sumen un target específico.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'hashing' as const,
  },
  {
    id: 'contains-duplicate',
    title: 'Contiene Duplicados',
    description: 'Determina si un array contiene elementos duplicados.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'hashing' as const,
  },
  {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    description: 'Determina si un string es un palíndromo considerando solo caracteres alfanuméricos.',
    difficulty: 'easy' as const,
    category: 'String',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'valid-anagram',
    title: 'Anagrama Válido',
    description: 'Verifica si dos strings son anagramas entre sí.',
    difficulty: 'easy' as const,
    category: 'String',
    pattern: 'hashing' as const,
  },
  {
    id: 'single-number',
    title: 'Número Único',
    description: 'Encuentra el elemento que aparece solo una vez usando XOR.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'hashing' as const,
  },
  {
    id: 'reverse-string',
    title: 'Invertir String',
    description: 'Invierte un array de caracteres in-place usando two pointers.',
    difficulty: 'easy' as const,
    category: 'String',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'best-time-buy-sell',
    title: 'Best Time to Buy and Sell Stock',
    description: 'Maximiza la ganancia comprando y vendiendo una acción.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'sliding-window' as const,
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    description: 'Determina si un string de paréntesis está balanceado.',
    difficulty: 'easy' as const,
    category: 'Stack',
    pattern: 'hashing' as const,
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    description: 'Combina dos arrays ordenados en uno solo in-place.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'binary-search',
    title: 'Binary Search',
    description: 'Implementa búsqueda binaria en un array ordenado.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'binary-search' as const,
  },
  {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    description: 'Cuenta las formas de subir n escalones (Fibonacci).',
    difficulty: 'easy' as const,
    category: 'Dynamic Programming',
    pattern: 'dynamic-programming' as const,
  },
  {
    id: 'find-duplicate-number',
    title: 'Encontrar el Duplicado',
    description: 'Encuentra el número duplicado en un array usando Floyd\'s Cycle Detection.',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  // === MEDIUM ===
  {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating',
    description: 'Encuentra la subcadena más larga sin caracteres repetidos.',
    difficulty: 'medium' as const,
    category: 'String',
    pattern: 'sliding-window' as const,
  },
  {
    id: 'max-subarray',
    title: 'Subarray Máximo (Kadane)',
    description: 'Encuentra el subarray contiguo con la suma más grande.',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'dynamic-programming' as const,
  },
  {
    id: 'three-sum',
    title: '3Sum',
    description: 'Encuentra todos los tripletes únicos que sumen cero.',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    description: 'Encuentra el mínimo número de monedas para un monto.',
    difficulty: 'medium' as const,
    category: 'Dynamic Programming',
    pattern: 'dynamic-programming' as const,
  },
  {
    id: 'number-islands',
    title: 'Number of Islands',
    description: 'Cuenta el número de islas en una matriz 2D.',
    difficulty: 'medium' as const,
    category: 'Graph',
    pattern: 'dfs' as const,
  },
  {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    description: 'Combina intervalos que se solapan.',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'sorting' as const,
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    description: 'Encuentra el contenedor que puede almacenar más agua.',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'word-break',
    title: 'Word Break',
    description: 'Determina si un string puede segmentarse en palabras del diccionario.',
    difficulty: 'medium' as const,
    category: 'Dynamic Programming',
    pattern: 'dynamic-programming' as const,
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    description: 'Agrupa los anagramas de un array de strings.',
    difficulty: 'medium' as const,
    category: 'Hash Table',
    pattern: 'hashing' as const,
  },
  {
    id: 'longest-palindrome-substring',
    title: 'Longest Palindromic Substring',
    description: 'Encuentra la subcadena palindrómica más larga.',
    difficulty: 'medium' as const,
    category: 'String',
    pattern: 'dynamic-programming' as const,
  },
  // === EASY (adicionales) ===
  {
    id: 'move-zeroes',
    title: 'Mover Ceros',
    description: 'Mueve todos los ceros al final del array manteniendo el orden.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'rotate-array',
    title: 'Rotar Array',
    description: 'Rota un array k posiciones a la derecha in-place.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'fizz-buzz',
    title: 'FizzBuzz',
    description: 'Genera la clásica secuencia FizzBuzz.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'sorting' as const,
  },
  {
    id: 'first-unique-char',
    title: 'Primer Caracter Único',
    description: 'Encuentra el primer caracter que no se repite en un string.',
    difficulty: 'easy' as const,
    category: 'String',
    pattern: 'hashing' as const,
  },
  {
    id: 'sort-array-by-parity',
    title: 'Ordenar por Paridad',
    description: 'Coloca pares al inicio e impares al final.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'intersection-two-arrays',
    title: 'Intersección de Dos Arrays',
    description: 'Encuentra elementos comunes entre dos arrays.',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'hashing' as const,
  },
  // === HARD ===
  {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    description: 'Calcula cuánta agua puede atrapar una elevación.',
    difficulty: 'hard' as const,
    category: 'Array',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'median-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    description: 'Encuentra la mediana de dos arrays ordenados en O(log n).',
    difficulty: 'hard' as const,
    category: 'Array',
    pattern: 'binary-search' as const,
  },
  // === NUEVOS: 1 por módulo faltante ===
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    description: 'Invierte una linked list cambiando la dirección de los punteros.',
    difficulty: 'easy' as const,
    category: 'Linked List',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'max-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    description: 'Encuentra la profundidad máxima de un árbol binario.',
    difficulty: 'easy' as const,
    category: 'Tree',
    pattern: 'dfs' as const,
  },
  {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    description: 'Verifica si un árbol binario es un BST válido.',
    difficulty: 'medium' as const,
    category: 'BST',
    pattern: 'dfs' as const,
  },
  {
    id: 'kth-largest-element',
    title: 'Kth Largest Element',
    description: 'Encuentra el k-ésimo elemento más grande usando un heap.',
    difficulty: 'medium' as const,
    category: 'Heap',
    pattern: 'sorting' as const,
  },
  {
    id: 'subsets',
    title: 'Subsets',
    description: 'Genera todos los subconjuntos posibles de un array.',
    difficulty: 'medium' as const,
    category: 'Backtracking',
    pattern: 'recursion' as const,
  },
  {
    id: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    description: 'Ordena un array de 0s, 1s y 2s in-place en una pasada.',
    difficulty: 'medium' as const,
    category: 'Sorting',
    pattern: 'two-pointers' as const,
  },
  {
    id: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    description: 'Cuenta los bits 1 en la representación binaria de un número.',
    difficulty: 'easy' as const,
    category: 'Bit Manipulation',
    pattern: 'hashing' as const,
  },
  {
    id: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    description: 'Implementa un Trie con insert, search y startsWith.',
    difficulty: 'medium' as const,
    category: 'Trie',
    pattern: 'hashing' as const,
  },
  {
    id: 'house-robber',
    title: 'House Robber',
    description: 'Maximiza el botín sin robar casas adyacentes (DP clásico).',
    difficulty: 'medium' as const,
    category: 'Dynamic Programming',
    pattern: 'dynamic-programming' as const,
  },
];

export default PracticePage;
