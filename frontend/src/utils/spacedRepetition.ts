/**
 * Spaced Repetition System (SRS)
 * ==============================
 * Sistema de repetición espaciada basado en el algoritmo SM-2 de SuperMemo.
 * 
 * El objetivo es maximizar la retención a largo plazo mostrando
 * los conceptos justo antes de que el estudiante los olvide.
 * 
 * Intervalos: 1 día → 3 días → 7 días → 14 días → 30 días → 60 días
 */

// ============================================
// TIPOS
// ============================================

export interface ReviewItem {
  id: string;
  type: 'concept' | 'pattern' | 'exercise';
  title: string;
  lastReview: string;  // ISO date
  nextReview: string;  // ISO date
  easeFactor: number;  // 1.3 - 2.5 (dificultad percibida)
  interval: number;    // días hasta próxima revisión
  repetitions: number; // veces revisado correctamente seguidas
  quality: number;     // última calificación (0-5)
}

export interface ReviewSession {
  items: ReviewItem[];
  completed: number;
  correct: number;
  date: string;
}

// ============================================
// CONSTANTES
// ============================================

const MIN_EASE_FACTOR = 1.3;
const DEFAULT_EASE_FACTOR = 2.5;

// Mapeo de calidad a descripción
export const QUALITY_LABELS = {
  0: { label: 'Olvidé completamente', color: 'red' },
  1: { label: 'Muy difícil, casi no recordé', color: 'orange' },
  2: { label: 'Difícil, recordé con esfuerzo', color: 'yellow' },
  3: { label: 'Bien, con algo de duda', color: 'blue' },
  4: { label: 'Fácil, recordé bien', color: 'green' },
  5: { label: 'Perfecto, lo sé de memoria', color: 'emerald' },
};

// ============================================
// ALGORITMO SM-2
// ============================================

/**
 * Calcula el nuevo intervalo y ease factor basado en la calidad de la respuesta.
 * 
 * Calidad:
 * 0 - Olvidó completamente
 * 1 - Muy difícil
 * 2 - Difícil
 * 3 - Bien
 * 4 - Fácil
 * 5 - Perfecto
 */
export function calculateNextReview(
  item: ReviewItem,
  quality: number
): ReviewItem {
  const now = new Date();
  let { easeFactor, interval, repetitions } = item;

  // Si la calidad es menor a 3, reiniciar
  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    // Incrementar repeticiones
    repetitions += 1;

    // Calcular nuevo intervalo
    if (repetitions === 1) {
      interval = 1;
    } else if (repetitions === 2) {
      interval = 3;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    // Actualizar ease factor usando la fórmula SM-2
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    
    // Mantener ease factor en rango válido
    easeFactor = Math.max(MIN_EASE_FACTOR, easeFactor);
  }

  // Calcular próxima fecha de revisión
  const nextReview = new Date(now);
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    ...item,
    lastReview: now.toISOString(),
    nextReview: nextReview.toISOString(),
    easeFactor,
    interval,
    repetitions,
    quality,
  };
}

/**
 * Obtiene los items que deben revisarse hoy.
 */
export function getDueItems(items: ReviewItem[]): ReviewItem[] {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  return items.filter(item => {
    const nextReview = new Date(item.nextReview);
    nextReview.setHours(0, 0, 0, 0);
    return nextReview <= now;
  }).sort((a, b) => {
    // Priorizar items con ease factor más bajo (más difíciles)
    return a.easeFactor - b.easeFactor;
  });
}

/**
 * Calcula estadísticas de retención.
 */
export function getRetentionStats(items: ReviewItem[]) {
  if (items.length === 0) {
    return {
      totalItems: 0,
      mastered: 0,
      learning: 0,
      struggling: 0,
      averageEase: 0,
      dueToday: 0,
      streak: 0,
    };
  }

  const now = new Date();
  now.setHours(0, 0, 0, 0);

  const mastered = items.filter(i => i.interval >= 30).length;
  const struggling = items.filter(i => i.easeFactor < 1.5).length;
  const learning = items.length - mastered - struggling;
  const dueToday = getDueItems(items).length;
  const averageEase = items.reduce((sum, i) => sum + i.easeFactor, 0) / items.length;

  return {
    totalItems: items.length,
    mastered,
    learning,
    struggling,
    averageEase: Math.round(averageEase * 100) / 100,
    dueToday,
    streak: calculateStreak(items),
  };
}

/**
 * Calcula la racha de días consecutivos estudiando.
 */
function calculateStreak(items: ReviewItem[]): number {
  const reviewDates = items
    .map(i => i.lastReview)
    .filter(Boolean)
    .map(d => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    });

  const uniqueDates = [...new Set(reviewDates)].sort((a, b) => b - a);
  
  if (uniqueDates.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTime = today.getTime();

  // Si no estudió hoy, verificar si estudió ayer
  if (uniqueDates[0] !== todayTime) {
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (uniqueDates[0] !== yesterday.getTime()) {
      return 0; // Racha rota
    }
  }

  let streak = 1;
  const oneDayMs = 24 * 60 * 60 * 1000;

  for (let i = 1; i < uniqueDates.length; i++) {
    if (uniqueDates[i - 1] - uniqueDates[i] === oneDayMs) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

// ============================================
// CONTENIDO PARA REVISIÓN
// ============================================

/**
 * Conceptos clave que deben memorizarse para entrevistas.
 */
export const REVIEW_CONCEPTS: Omit<ReviewItem, 'lastReview' | 'nextReview' | 'easeFactor' | 'interval' | 'repetitions' | 'quality'>[] = [
  // Complejidades
  {
    id: 'complexity-array-access',
    type: 'concept',
    title: '¿Complejidad de acceso a array por índice?',
  },
  {
    id: 'complexity-hashmap-lookup',
    type: 'concept',
    title: '¿Complejidad de búsqueda en HashMap?',
  },
  {
    id: 'complexity-binary-search',
    type: 'concept',
    title: '¿Complejidad de Binary Search?',
  },
  {
    id: 'complexity-sorting',
    type: 'concept',
    title: '¿Complejidad de ordenamiento óptimo?',
  },
  
  // Patrones
  {
    id: 'pattern-two-pointers-when',
    type: 'pattern',
    title: '¿Cuándo usar Two Pointers?',
  },
  {
    id: 'pattern-sliding-window-when',
    type: 'pattern',
    title: '¿Cuándo usar Sliding Window?',
  },
  {
    id: 'pattern-bfs-vs-dfs',
    type: 'pattern',
    title: '¿Cuándo BFS vs DFS?',
  },
  {
    id: 'pattern-dp-recognition',
    type: 'pattern',
    title: '¿Cómo reconocer un problema DP?',
  },
];

/**
 * Respuestas esperadas para los conceptos.
 */
export const CONCEPT_ANSWERS: Record<string, string> = {
  'complexity-array-access': 'O(1) - Acceso directo por índice',
  'complexity-hashmap-lookup': 'O(1) amortizado - Hash permite acceso directo',
  'complexity-binary-search': 'O(log n) - Divide el espacio a la mitad',
  'complexity-sorting': 'O(n log n) - Merge Sort, Quick Sort, Heap Sort',
  'pattern-two-pointers-when': 'Arrays ordenados, buscar pares, palíndromos',
  'pattern-sliding-window-when': 'Subarrays contiguos, máximo en rango, k elementos',
  'pattern-bfs-vs-dfs': 'BFS: camino más corto, niveles. DFS: explorar todo, backtracking',
  'pattern-dp-recognition': 'Optimización, decisiones dependientes, subproblemas repetidos',
};

/**
 * Crea un nuevo item de revisión.
 */
export function createReviewItem(
  id: string,
  type: 'concept' | 'pattern' | 'exercise',
  title: string
): ReviewItem {
  const now = new Date().toISOString();
  return {
    id,
    type,
    title,
    lastReview: now,
    nextReview: now, // Due immediately
    easeFactor: DEFAULT_EASE_FACTOR,
    interval: 0,
    repetitions: 0,
    quality: 0,
  };
}

/**
 * Guarda el progreso de SRS en localStorage.
 */
export function saveSRSProgress(items: ReviewItem[]): void {
  try {
    localStorage.setItem('algorint-srs-items', JSON.stringify(items));
  } catch (e) {
    console.error('Error saving SRS progress:', e);
  }
}

/**
 * Carga el progreso de SRS desde localStorage.
 */
export function loadSRSProgress(): ReviewItem[] {
  try {
    const stored = localStorage.getItem('algorint-srs-items');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error('Error loading SRS progress:', e);
  }
  
  // Inicializar con conceptos predefinidos
  return REVIEW_CONCEPTS.map(c => createReviewItem(c.id, c.type, c.title));
}
