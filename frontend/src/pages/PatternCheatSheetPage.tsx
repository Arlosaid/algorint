import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen,
  Code,
  Code2,
  Lightbulb,
  Target,
  Clock,
  Zap,
  ChevronDown,
  ChevronRight,
  Brain,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, Button, DifficultyBadge } from '../components/ui';

/**
 * PatternCheatSheetPage
 * =====================
 * Página de referencia rápida de los 10 patrones algorítmicos más importantes.
 * Diseñada con el Método Feynman: explicación simple → cuándo usar → template.
 * 
 * Esta es la página que diferencia a Algorint de LeetCode:
 * - Enseña el "por qué" antes del "cómo"
 * - Cada patrón tiene analogía del mundo real
 * - Templates de código listos para usar
 */

interface Pattern {
  id: string;
  name: string;
  difficulty: 'easy' | 'medium' | 'hard';
  // Método Feynman
  feynmanExplanation: string;  // Como a un niño de 5 años
  realWorldAnalogy: string;    // Analogía del mundo real
  // Cuándo usar
  whenToUse: string[];
  signalPhrases: string[];     // Frases clave en el problema
  // Template
  template: string;
  complexity: {
    time: string;
    space: string;
  };
  // Ejercicio representativo
  coreExercise: {
    name: string;
    id: string;
  };
  // Errores comunes
  commonMistakes: string[];
}

const patterns: Pattern[] = [
  {
    id: 'two-pointers',
    name: 'Two Pointers',
    difficulty: 'easy',
    feynmanExplanation: 'Imagina que tienes una fila de ninos ordenados por altura. Quieres encontrar dos ninos cuyas alturas sumen exactamente 150cm. En lugar de comparar cada nino con todos los demas, pones un dedo en el mas bajo y otro en el mas alto. Si suman mucho, mueves el dedo del alto. Si suman poco, mueves el dedo del bajo. Es mucho mas rapido!',
    realWorldAnalogy: 'Es como buscar dos libros en una estanteria ordenada que juntos cuesten exactamente $50. Empiezas por el mas barato y el mas caro, y ajustas.',
    whenToUse: [
      'Array ordenado',
      'Buscar par que cumpla una condición',
      'Comparar elementos desde extremos',
      'Problemas de "dos elementos que..."'
    ],
    signalPhrases: ['sorted array', 'pair with sum', 'two elements', 'opposite ends'],
    template: `def two_pointers(arr, target):
    """
    Template Two Pointers para array ordenado.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    left, right = 0, len(arr) - 1
    
    while left < right:
        current = arr[left] + arr[right]  # o la operación que necesites
        
        if current == target:
            return [left, right]  # Encontrado
        elif current < target:
            left += 1   # Necesitamos más grande
        else:
            right -= 1  # Necesitamos más pequeño
    
    return []  # No encontrado`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    coreExercise: { name: 'Two Sum II (Sorted Array)', id: 'two-sum-sorted' },
    commonMistakes: [
      'Olvidar que el array debe estar ordenado',
      'Usar <= en lugar de < en el while',
      'No manejar duplicados si el problema lo requiere'
    ]
  },
  {
    id: 'sliding-window',
    name: 'Sliding Window',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina que miras por una ventana de tren que se mueve. La ventana siempre muestra la misma cantidad de casas, pero cada vez que avanzas ves una casa nueva y dejas de ver la anterior. En lugar de contar todas las casas cada vez, solo restas la que se fue y sumas la nueva.',
    realWorldAnalogy: 'Es como calcular la temperatura promedio de los ultimos 7 dias. Cada dia nuevo, restas el dia mas viejo y sumas el nuevo, sin recalcular todo.',
    whenToUse: [
      'Subarray/substring contiguo',
      'Máximo/mínimo en ventana de tamaño k',
      'Substring con condición',
      'Suma de subarray'
    ],
    signalPhrases: ['subarray', 'substring', 'window size k', 'contiguous', 'consecutive'],
    template: `def sliding_window(arr, k):
    """
    Template Sliding Window de tamaño fijo.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    n = len(arr)
    if n < k:
        return None
    
    # Calcular suma de primera ventana
    window_sum = sum(arr[:k])
    max_sum = window_sum
    
    # Deslizar la ventana
    for i in range(k, n):
        window_sum += arr[i]      # Agregar nuevo elemento
        window_sum -= arr[i - k]  # Quitar elemento viejo
        max_sum = max(max_sum, window_sum)
    
    return max_sum

def sliding_window_variable(s):
    """
    Template Sliding Window de tamaño variable.
    Para: substring más largo sin repetir caracteres.
    """
    seen = {}
    left = 0
    max_length = 0
    
    for right, char in enumerate(s):
        if char in seen and seen[char] >= left:
            left = seen[char] + 1  # Contraer ventana
        
        seen[char] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
    complexity: { time: 'O(n)', space: 'O(1) o O(k)' },
    coreExercise: { name: 'Longest Substring Without Repeating', id: 'longest-substring' },
    commonMistakes: [
      'Olvidar manejar ventana de tamaño variable',
      'No actualizar correctamente el índice left',
      'Confundir índices al expandir/contraer'
    ]
  },
  {
    id: 'fast-slow-pointers',
    name: 'Fast & Slow Pointers',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina una pista de carreras circular. Si un corredor va al doble de velocidad que otro, eventualmente lo alcanzara. Si la pista es un camino recto (sin ciclo), el rapido llegara al final primero. Asi detectamos si hay un bucle en nuestros datos.',
    realWorldAnalogy: 'Es como dos corredores en una pista. Si hay ciclo, el rapido alcanza al lento. Si no hay ciclo, el rapido llega al fin.',
    whenToUse: [
      'Detectar ciclos en linked list',
      'Encontrar el inicio del ciclo',
      'Encontrar el elemento medio',
      'Detectar duplicados (ver como ciclo)'
    ],
    signalPhrases: ['cycle', 'circular', 'loop', 'middle element', 'linked list'],
    template: `def has_cycle(head):
    """
    Detectar ciclo en linked list (Floyd's Algorithm).
    Complejidad: O(n) tiempo, O(1) espacio
    """
    slow = fast = head
    
    while fast and fast.next:
        slow = slow.next        # Un paso
        fast = fast.next.next   # Dos pasos
        
        if slow == fast:
            return True  # Ciclo detectado
    
    return False  # No hay ciclo

def find_cycle_start(head):
    """
    Encontrar inicio del ciclo.
    """
    slow = fast = head
    
    # Fase 1: Detectar ciclo
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            break
    else:
        return None  # No hay ciclo
    
    # Fase 2: Encontrar inicio
    slow = head
    while slow != fast:
        slow = slow.next
        fast = fast.next
    
    return slow  # Inicio del ciclo`,
    complexity: { time: 'O(n)', space: 'O(1)' },
    coreExercise: { name: 'Linked List Cycle II', id: 'linked-list-cycle' },
    commonMistakes: [
      'No verificar fast.next antes de avanzar',
      'Confundir las dos fases del algoritmo',
      'Olvidar el caso sin ciclo'
    ]
  },
  {
    id: 'hash-map',
    name: 'Hash Map / Frequency Counter',
    difficulty: 'easy',
    feynmanExplanation: 'Imagina una agenda telefonica donde guardas el nombre y en que pagina esta cada persona. Cuando quieres llamar a alguien, no revisas pagina por pagina, vas directo! El hash map es esa agenda: guardas algo y lo encuentras instantaneamente.',
    realWorldAnalogy: 'Es una agenda telefonica. Buscas Maria y te dice directamente su numero, sin revisar todos los contactos.',
    whenToUse: [
      'Buscar si elemento existe en O(1)',
      'Contar frecuencias',
      'Agrupar elementos',
      'Two Sum (versión no ordenada)',
      'Encontrar duplicados'
    ],
    signalPhrases: ['frequency', 'count', 'exists', 'duplicate', 'anagram', 'two sum'],
    template: `def two_sum_hash(nums, target):
    """
    Two Sum con hash map.
    Complejidad: O(n) tiempo, O(n) espacio
    """
    seen = {}  # valor -> índice
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []

def frequency_counter(arr):
    """
    Contar frecuencia de elementos.
    """
    from collections import Counter
    return Counter(arr)  # {elemento: frecuencia}

def group_anagrams(strs):
    """
    Agrupar anagramas usando hash map.
    """
    from collections import defaultdict
    
    groups = defaultdict(list)
    
    for s in strs:
        key = tuple(sorted(s))  # "eat" -> ('a','e','t')
        groups[key].append(s)
    
    return list(groups.values())`,
    complexity: { time: 'O(n)', space: 'O(n)' },
    coreExercise: { name: 'Two Sum', id: 'two-sum' },
    commonMistakes: [
      'No usar collections.Counter cuando es más limpio',
      'Olvidar que dict no mantiene orden (usar OrderedDict si importa)',
      'No manejar colisiones de keys'
    ]
  },
  {
    id: 'merge-intervals',
    name: 'Merge Intervals',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina que tienes varias citas en tu calendario y algunas se solapan. Quieres combinarlas para ver tu tiempo ocupado real. Ordenas las citas por hora de inicio, y si una cita empieza antes de que termine la anterior, las juntas en una sola.',
    realWorldAnalogy: 'Es como organizar tu agenda. Si tienes reunion 9-11 y otra 10-12, realmente estas ocupado 9-12.',
    whenToUse: [
      'Intervalos que se solapan',
      'Encontrar espacios libres',
      'Combinar rangos',
      'Verificar conflictos de horarios'
    ],
    signalPhrases: ['intervals', 'overlapping', 'merge', 'schedule', 'time slots'],
    template: `def merge_intervals(intervals):
    """
    Combinar intervalos solapados.
    Complejidad: O(n log n) tiempo, O(n) espacio
    """
    if not intervals:
        return []
    
    # Ordenar por inicio
    intervals.sort(key=lambda x: x[0])
    
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        if current[0] <= last[1]:  # Se solapan
            last[1] = max(last[1], current[1])  # Extender
        else:
            merged.append(current)  # No se solapan
    
    return merged

def insert_interval(intervals, new):
    """
    Insertar un nuevo intervalo y combinar.
    """
    result = []
    i = 0
    n = len(intervals)
    
    # Agregar intervalos que terminan antes del nuevo
    while i < n and intervals[i][1] < new[0]:
        result.append(intervals[i])
        i += 1
    
    # Combinar intervalos que se solapan con el nuevo
    while i < n and intervals[i][0] <= new[1]:
        new[0] = min(new[0], intervals[i][0])
        new[1] = max(new[1], intervals[i][1])
        i += 1
    
    result.append(new)
    
    # Agregar el resto
    result.extend(intervals[i:])
    
    return result`,
    complexity: { time: 'O(n log n)', space: 'O(n)' },
    coreExercise: { name: 'Merge Intervals', id: 'merge-intervals' },
    commonMistakes: [
      'Olvidar ordenar los intervalos primero',
      'Usar < en lugar de <= para detectar solape',
      'No actualizar el end con max()'
    ]
  },
  {
    id: 'bfs',
    name: 'BFS (Breadth-First Search)',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina que dejas caer una piedra en un lago. Las ondas se expanden en circulos, tocando primero lo cercano y luego lo lejano. BFS explora asi: primero todos los vecinos directos, luego los vecinos de los vecinos, y asi sucesivamente.',
    realWorldAnalogy: 'Es como las ondas en un lago. Primero tocan la orilla cercana, luego se expanden nivel por nivel.',
    whenToUse: [
      'Camino más corto (sin pesos)',
      'Recorrer por niveles',
      'Encontrar distancia mínima',
      'Explorar vecinos antes de profundizar'
    ],
    signalPhrases: ['shortest path', 'minimum steps', 'level by level', 'nearest', 'fewest moves'],
    template: `from collections import deque

def bfs_shortest_path(graph, start, end):
    """
    BFS para camino más corto.
    Complejidad: O(V + E) tiempo, O(V) espacio
    """
    queue = deque([(start, 0)])  # (nodo, distancia)
    visited = {start}
    
    while queue:
        node, dist = queue.popleft()
        
        if node == end:
            return dist
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, dist + 1))
    
    return -1  # No hay camino

def bfs_level_order(root):
    """
    BFS para recorrido por niveles en árbol.
    """
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result`,
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    coreExercise: { name: 'Binary Tree Level Order Traversal', id: 'level-order-traversal' },
    commonMistakes: [
      'Usar lista en lugar de deque (popleft es O(n) en lista)',
      'Olvidar marcar como visitado ANTES de agregar a la cola',
      'No manejar el caso de grafo desconectado'
    ]
  },
  {
    id: 'dfs',
    name: 'DFS (Depth-First Search)',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina que exploras un laberinto. DFS dice: ve todo lo que puedas en una direccion hasta chocar con la pared, luego regresa y prueba otra direccion. Es como un explorador que va hasta el fondo de cada tunel antes de probar otro.',
    realWorldAnalogy: 'Es como explorar un laberinto: vas todo lo posible en una direccion, y cuando llegas a un callejon sin salida, regresas y pruebas otro camino.',
    whenToUse: [
      'Explorar todos los caminos posibles',
      'Detectar ciclos',
      'Problemas de backtracking',
      'Recorrer árboles (preorder, inorder, postorder)'
    ],
    signalPhrases: ['all paths', 'explore', 'traverse', 'connected components', 'cycle detection'],
    template: `def dfs_recursive(graph, node, visited=None):
    """
    DFS recursivo.
    Complejidad: O(V + E) tiempo, O(V) espacio
    """
    if visited is None:
        visited = set()
    
    visited.add(node)
    print(node)  # Procesar nodo
    
    for neighbor in graph[node]:
        if neighbor not in visited:
            dfs_recursive(graph, neighbor, visited)

def dfs_iterative(graph, start):
    """
    DFS iterativo con stack.
    """
    stack = [start]
    visited = set()
    
    while stack:
        node = stack.pop()
        
        if node in visited:
            continue
        
        visited.add(node)
        print(node)  # Procesar nodo
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                stack.append(neighbor)

def dfs_tree_inorder(root):
    """
    DFS inorder en árbol binario (izq -> raíz -> der).
    """
    result = []
    
    def inorder(node):
        if not node:
            return
        inorder(node.left)
        result.append(node.val)
        inorder(node.right)
    
    inorder(root)
    return result`,
    complexity: { time: 'O(V + E)', space: 'O(V)' },
    coreExercise: { name: 'Number of Islands', id: 'number-of-islands' },
    commonMistakes: [
      'Stack overflow por recursión muy profunda (usar iterativo)',
      'Olvidar marcar como visitado',
      'No manejar el orden de visita correctamente'
    ]
  },
  {
    id: 'top-k-elements',
    name: 'Top K Elements (Heap)',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina que tienes una bolsa magica que solo puede guardar K cosas. Cada vez que quieres meter algo nuevo, lo comparas con el mas pequeno de la bolsa. Si el nuevo es mas grande, sacas el pequeno y metes el nuevo. Al final, la bolsa tiene los K mas grandes.',
    realWorldAnalogy: 'Es como un ranking de los 10 mejores jugadores. Solo mantienes los 10 mejores, y si alguien nuevo es mejor que el peor del top 10, lo reemplazas.',
    whenToUse: [
      'K elementos más grandes/pequeños',
      'K elementos más frecuentes',
      'Mediana de stream',
      'Merge K listas ordenadas'
    ],
    signalPhrases: ['top k', 'k largest', 'k smallest', 'k most frequent', 'kth element'],
    template: `import heapq

def top_k_largest(nums, k):
    """
    K elementos más grandes usando min-heap.
    Complejidad: O(n log k) tiempo, O(k) espacio
    """
    # Min-heap de tamaño k
    heap = []
    
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)  # Sacar el más pequeño
    
    return heap  # Los k más grandes

def k_most_frequent(nums, k):
    """
    K elementos más frecuentes.
    """
    from collections import Counter
    
    count = Counter(nums)
    
    # Heap de (-frecuencia, elemento) - negativo para max-heap
    return heapq.nlargest(k, count.keys(), key=count.get)

def kth_largest(nums, k):
    """
    El K-ésimo elemento más grande.
    """
    # Min-heap de tamaño k
    heap = nums[:k]
    heapq.heapify(heap)
    
    for num in nums[k:]:
        if num > heap[0]:
            heapq.heapreplace(heap, num)
    
    return heap[0]  # La raíz es el k-ésimo más grande`,
    complexity: { time: 'O(n log k)', space: 'O(k)' },
    coreExercise: { name: 'Top K Frequent Elements', id: 'top-k-frequent' },
    commonMistakes: [
      'Usar max-heap cuando min-heap es más eficiente para Top K',
      'Olvidar que heapq en Python es min-heap por defecto',
      'No aprovechar heapq.nlargest() / heapq.nsmallest()'
    ]
  },
  {
    id: 'backtracking',
    name: 'Backtracking (Subsets)',
    difficulty: 'medium',
    feynmanExplanation: 'Imagina que estas en un buffet y puedes elegir que poner en tu plato. Para cada comida, tienes dos opciones: la tomas o la dejas. Backtracking prueba todas las combinaciones posibles: toma el pollo, luego decide sobre la ensalada, luego sobre el arroz... Si no te gusta el resultado, retrocedes y pruebas otra combinacion.',
    realWorldAnalogy: 'Es como armar tu plato en un buffet. Por cada comida decides: la tomo o la dejo? Pruebas todas las combinaciones posibles.',
    whenToUse: [
      'Generar todas las combinaciones/permutaciones',
      'Generar todos los subsets',
      'Problemas de decisión (tomar o dejar)',
      'Sudoku, N-Queens, etc.'
    ],
    signalPhrases: ['all subsets', 'all combinations', 'all permutations', 'generate all', 'possible ways'],
    template: `def subsets(nums):
    """
    Generar todos los subsets.
    Complejidad: O(2^n) tiempo, O(n) espacio
    """
    result = []
    
    def backtrack(index, current):
        # Cada estado es un subset válido
        result.append(current[:])
        
        for i in range(index, len(nums)):
            current.append(nums[i])      # Tomar
            backtrack(i + 1, current)
            current.pop()                 # Retroceder (no tomar)
    
    backtrack(0, [])
    return result

def permutations(nums):
    """
    Generar todas las permutaciones.
    """
    result = []
    
    def backtrack(current, remaining):
        if not remaining:
            result.append(current[:])
            return
        
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()
    
    backtrack([], nums)
    return result

def combination_sum(candidates, target):
    """
    Combinaciones que suman target.
    """
    result = []
    
    def backtrack(index, current, remaining):
        if remaining == 0:
            result.append(current[:])
            return
        if remaining < 0:
            return
        
        for i in range(index, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])  # i, no i+1, para repetir
            current.pop()
    
    backtrack(0, [], target)
    return result`,
    complexity: { time: 'O(2^n) o O(n!)', space: 'O(n)' },
    coreExercise: { name: 'Subsets', id: 'subsets' },
    commonMistakes: [
      'Olvidar hacer pop() después de la recursión',
      'Copiar la lista incorrectamente (usar [:] o list())',
      'Confundir índices para evitar duplicados'
    ]
  },
  {
    id: 'dynamic-programming',
    name: 'Dynamic Programming',
    difficulty: 'hard',
    feynmanExplanation: 'Imagina que calculas cuantos pasos hay para subir una escalera. Para llegar al escalon 5, puedes venir del 4 (1 paso) o del 3 (2 pasos). Si ya calculaste cuantas formas hay de llegar al 3 y al 4, solo sumas esas respuestas. DP es recordar las respuestas de problemas pequenos para resolver problemas grandes sin repetir trabajo.',
    realWorldAnalogy: 'Es como hacer un examen donde cada pregunta usa la respuesta de las anteriores. Si apuntas las respuestas, no tienes que recalcular.',
    whenToUse: [
      'Problemas con subproblemas solapados',
      'Decisiones óptimas (máximo/mínimo)',
      'Contar formas de hacer algo',
      'Cuando recursión tiene muchas llamadas repetidas'
    ],
    signalPhrases: ['minimum cost', 'maximum profit', 'number of ways', 'can we reach', 'optimal'],
    template: `def climb_stairs(n):
    """
    Número de formas de subir n escalones.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    if n <= 2:
        return n
    
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2, prev1 = prev1, current
    
    return prev1

def coin_change(coins, amount):
    """
    Mínimo número de monedas para amount.
    """
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

def longest_common_subsequence(text1, text2):
    """
    Subsecuencia común más larga.
    """
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]`,
    complexity: { time: 'O(n) a O(n²)', space: 'O(n) a O(n²)' },
    coreExercise: { name: 'Climbing Stairs', id: 'climbing-stairs' },
    commonMistakes: [
      'No identificar los subproblemas correctamente',
      'Olvidar el caso base',
      'Usar recursión sin memoización (timeout)',
      'No optimizar espacio cuando es posible'
    ]
  }
];

const PatternCheatSheetPage: React.FC = () => {
  const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPatterns = patterns.filter(pattern =>
    pattern.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.signalPhrases.some(phrase => phrase.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const togglePattern = (patternId: string) => {
    setExpandedPattern(expandedPattern === patternId ? null : patternId);
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="text-primary-400" size={40} />
            <h1 className="text-4xl font-bold text-white">Pattern Cheat Sheet</h1>
          </div>
          <p className="text-dark-400 text-lg max-w-2xl mx-auto">
            Los 10 patrones algorítmicos que resuelven el 90% de las entrevistas FAANG.
            <br />
            <span className="text-accent-400">Explicados con el Método Feynman: simple, visual, memorable.</span>
          </p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Buscar patrón o palabra clave (ej: 'shortest path', 'subarray')..."
            className="input w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Feynman Method Explanation */}
        <Card className="mb-8 bg-accent-500/10 border-accent-500/30">
          <div className="flex items-start gap-4">
            <Brain className="text-accent-400 flex-shrink-0 mt-1" size={24} />
            <div>
              <h3 className="text-white font-semibold mb-2">¿Qué es el Método Feynman?</h3>
              <p className="text-dark-300 text-sm leading-relaxed">
                Richard Feynman, premio Nobel de Física, decía: <em>"Si no puedes explicar algo de forma simple, no lo entiendes bien"</em>.
                <br /><br />
                En esta página, cada patrón se explica como si se lo explicaras a un niño de 5 años. 
                Si entiendes la analogía del mundo real, entiendes el patrón. Si no puedes explicar 
                tu solución de forma simple antes de codificar, probablemente necesitas entender mejor el problema.
              </p>
            </div>
          </div>
        </Card>

        {/* Patterns List */}
        <div className="space-y-4">
          {filteredPatterns.map((pattern) => (
            <Card key={pattern.id} className="overflow-hidden">
              {/* Pattern Header */}
              <button
                onClick={() => togglePattern(pattern.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary-500/20 flex items-center justify-center">
                    <Code className="text-primary-400" size={24} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">{pattern.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <DifficultyBadge difficulty={pattern.difficulty} size="sm" />
                      <span className="text-dark-500 text-sm">
                        {pattern.complexity.time} tiempo | {pattern.complexity.space} espacio
                      </span>
                    </div>
                  </div>
                </div>
                {expandedPattern === pattern.id ? (
                  <ChevronDown className="text-dark-400" size={24} />
                ) : (
                  <ChevronRight className="text-dark-400" size={24} />
                )}
              </button>

              {/* Expanded Content */}
              {expandedPattern === pattern.id && (
                <div className="border-t border-dark-700 p-6 space-y-6">
                  {/* Feynman Explanation */}
                  <section>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Brain className="text-accent-400" size={18} />
                      Explicación Simple (Método Feynman)
                    </h4>
                    <div className="bg-accent-500/10 border border-accent-500/30 rounded-lg p-4">
                      <p className="text-dark-300 leading-relaxed">{pattern.feynmanExplanation}</p>
                    </div>
                  </section>

                  {/* Real World Analogy */}
                  <section>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Lightbulb className="text-yellow-400" size={18} />
                      Analogía del Mundo Real
                    </h4>
                    <p className="text-dark-300 bg-dark-900 rounded-lg p-4">{pattern.realWorldAnalogy}</p>
                  </section>

                  {/* When to Use */}
                  <section>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Target className="text-primary-400" size={18} />
                      ¿Cuándo usar este patrón?
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-dark-500 text-sm mb-2">Situaciones:</p>
                        <ul className="space-y-1">
                          {pattern.whenToUse.map((use, i) => (
                            <li key={i} className="text-dark-300 text-sm flex items-center gap-2">
                              <CheckCircle className="text-primary-400 flex-shrink-0" size={14} />
                              {use}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-dark-500 text-sm mb-2">Palabras clave en el problema:</p>
                        <div className="flex flex-wrap gap-2">
                          {pattern.signalPhrases.map((phrase, i) => (
                            <span
                              key={i}
                              className="px-2 py-1 bg-secondary-500/20 text-secondary-400 text-xs rounded"
                            >
                              {phrase}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Code Template */}
                  <section>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <Code2 className="text-secondary-400" size={18} />
                      Template de Código
                    </h4>
                    <div className="rounded-lg overflow-hidden border border-dark-700">
                      <SyntaxHighlighter
                        language="python"
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          padding: '1rem',
                          fontSize: '0.8rem',
                          background: '#1e1e1e',
                        }}
                      >
                        {pattern.template}
                      </SyntaxHighlighter>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="text-primary-400" size={14} />
                        <span className="text-dark-400">Tiempo:</span>
                        <span className="text-primary-400 font-mono">{pattern.complexity.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Zap className="text-secondary-400" size={14} />
                        <span className="text-dark-400">Espacio:</span>
                        <span className="text-secondary-400 font-mono">{pattern.complexity.space}</span>
                      </div>
                    </div>
                  </section>

                  {/* Common Mistakes */}
                  <section>
                    <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                      <span className="text-red-400">⚠️</span>
                      Errores Comunes
                    </h4>
                    <ul className="space-y-2">
                      {pattern.commonMistakes.map((mistake, i) => (
                        <li key={i} className="text-dark-400 text-sm flex items-start gap-2">
                          <span className="text-red-400 flex-shrink-0">•</span>
                          {mistake}
                        </li>
                      ))}
                    </ul>
                  </section>

                  {/* Practice Exercise */}
                  <section className="pt-4 border-t border-dark-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-semibold">Ejercicio Representativo</h4>
                        <p className="text-dark-500 text-sm">{pattern.coreExercise.name}</p>
                      </div>
                      <Link to={`/practice/${pattern.coreExercise.id}`}>
                        <Button variant="primary" size="sm">
                          Practicar
                          <ExternalLink size={14} />
                        </Button>
                      </Link>
                    </div>
                  </section>
                </div>
              )}
            </Card>
          ))}
        </div>

        {/* No results */}
        {filteredPatterns.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-dark-400">No se encontraron patrones que coincidan con "{searchTerm}"</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default PatternCheatSheetPage;
