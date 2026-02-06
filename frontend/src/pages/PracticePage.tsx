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
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Área de Práctica
          </h1>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Resuelve ejercicios tipo LeetCode organizados por dificultad y patrón.
            Cada ejercicio incluye pistas, soluciones y explicaciones detalladas.
          </p>
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        <div className="flex flex-col md:flex-row gap-4 mb-8">
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
            className="input w-auto"
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
            className="input w-auto"
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
        <div className="space-y-4">
          {filteredExercises.map((exercise) => {
            const status = getExerciseStatus(exercise.id);
            const isCompleted = status === 'completed';
            const isInProgress = status === 'in-progress';

            return (
              <Link key={exercise.id} to={`/practice/${exercise.id}`}>
                <Card hover className="group">
                  <div className="flex items-center gap-4">
                    {/* Status */}
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center
                      ${isCompleted 
                        ? 'bg-primary-500/20' 
                        : isInProgress 
                          ? 'bg-secondary-500/20'
                          : 'bg-dark-700'
                      }
                    `}>
                      {isCompleted ? (
                        <CheckCircle className="text-primary-400" size={20} />
                      ) : (
                        <Code2 className={isInProgress ? 'text-secondary-400' : 'text-dark-500'} size={20} />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                          {exercise.title}
                        </h3>
                        <DifficultyBadge difficulty={exercise.difficulty} size="sm" />
                      </div>
                      <p className="text-dark-500 text-sm line-clamp-1">
                        {exercise.description}
                      </p>
                    </div>

                    {/* Tags */}
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
                      className="text-dark-600 group-hover:text-primary-400 transition-colors" 
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
  {
    id: 'two-sum',
    title: 'Two Sum',
    description: 'Encuentra dos números en un array que sumen un target específico.',
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
    description: 'Combina dos arrays ordenados en uno solo.',
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
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating',
    description: 'Encuentra la subcadena más larga sin caracteres repetidos.',
    difficulty: 'medium' as const,
    category: 'String',
    pattern: 'sliding-window' as const,
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
    id: 'word-break',
    title: 'Word Break',
    description: 'Determina si un string puede ser segmentado en palabras del diccionario.',
    difficulty: 'medium' as const,
    category: 'Dynamic Programming',
    pattern: 'dynamic-programming' as const,
  },
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
  {
    id: 'longest-palindrome-substring',
    title: 'Longest Palindromic Substring',
    description: 'Encuentra la subcadena palindrómica más larga.',
    difficulty: 'medium' as const,
    category: 'String',
    pattern: 'dynamic-programming' as const,
  },
];

export default PracticePage;
