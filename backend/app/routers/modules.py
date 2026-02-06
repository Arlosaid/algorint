"""
Modules Router
==============
Endpoints para gestión de módulos educativos.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from ..models import Module, Difficulty, ModuleStatus

router = APIRouter()

# Datos de ejemplo - En producción esto vendría de una base de datos
MODULES_DATA: List[Module] = [
    Module(
        id="fundamentos-python",
        title="Fundamentos de Python para Algoritmos",
        description="Domina las estructuras de datos nativas de Python y las técnicas esenciales para resolver problemas algorítmicos.",
        icon="file-code",
        difficulty=Difficulty.BEGINNER,
        estimatedHours=10,
        totalLessons=6,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=1,
        prerequisites=[],
        topics=["Listas y Tuplas", "Diccionarios y Sets", "Manipulación de Strings", "List Comprehensions", "Funciones Lambda", "Iteradores y Generadores"],
        learningObjectives=[
            "Manipular eficientemente las estructuras de datos de Python",
            "Escribir código Pythónico y legible",
            "Entender la complejidad de las operaciones built-in",
            "Usar comprehensions y generadores efectivamente",
            "Dominar sorted() con keys personalizados",
            "Procesar datos eficientemente con iteradores"
        ]
    ),
    Module(
        id="complejidad-algoritmica",
        title="Complejidad Algorítmica (Big O)",
        description="Aprende a analizar y comparar la eficiencia de algoritmos usando notación Big O.",
        icon="bar-chart-3",
        difficulty=Difficulty.BEGINNER,
        estimatedHours=6,
        totalLessons=5,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=2,
        prerequisites=[],
        topics=["Notación Big O", "Complejidad Temporal", "Complejidad Espacial", "Análisis de Casos", "Comparación de Algoritmos"],
        learningObjectives=[
            "Calcular la complejidad temporal de cualquier algoritmo",
            "Identificar y evitar código ineficiente",
            "Comparar diferentes soluciones objetivamente",
            "Optimizar código existente"
        ]
    ),
    Module(
        id="arrays-strings",
        title="Arrays y Strings",
        description="Técnicas fundamentales para manipular arrays y strings, los tipos de datos más comunes en entrevistas.",
        icon="file-text",
        difficulty=Difficulty.BEGINNER,
        estimatedHours=12,
        totalLessons=8,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=3,
        prerequisites=["fundamentos-python", "complejidad-algoritmica"],
        topics=["Two Pointers", "Sliding Window", "Prefix Sum", "String Manipulation", "Anagramas", "Palindromos", "Subarrays", "In-place Operations"],
        learningObjectives=[
            "Aplicar la técnica de dos punteros",
            "Implementar ventana deslizante",
            "Resolver problemas de subarrays eficientemente",
            "Manipular strings sin usar memoria extra"
        ]
    ),
    Module(
        id="hash-tables",
        title="Hash Tables y Diccionarios",
        description="Domina el uso de hash tables para resolver problemas en tiempo O(1).",
        icon="folder-key",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedHours=8,
        totalLessons=6,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=4,
        prerequisites=["arrays-strings"],
        topics=["Hash Functions", "Collision Handling", "Two Sum Pattern", "Frequency Counter", "Grouping", "Caching"],
        learningObjectives=[
            "Entender cómo funcionan las hash tables internamente",
            "Identificar cuándo usar diccionarios vs otras estructuras",
            "Resolver problemas de frecuencia y agrupación",
            "Implementar caché con diccionarios"
        ]
    ),
    Module(
        id="linked-lists",
        title="Listas Enlazadas",
        description="Aprende a manipular listas enlazadas, una estructura fundamental en ciencias de la computación.",
        icon="link-2",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedHours=10,
        totalLessons=7,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=5,
        prerequisites=["hash-tables"],
        topics=["Singly Linked List", "Doubly Linked List", "Fast & Slow Pointers", "Reverse", "Merge", "Cycle Detection", "LRU Cache"],
        learningObjectives=[
            "Implementar listas enlazadas desde cero",
            "Detectar ciclos con Floyd's algorithm",
            "Revertir listas in-place",
            "Resolver problemas de merge y split"
        ]
    ),
    Module(
        id="stacks-queues",
        title="Stacks y Queues",
        description="Estructuras LIFO y FIFO esenciales para muchos algoritmos.",
        icon="layers",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedHours=8,
        totalLessons=6,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=6,
        prerequisites=["linked-lists"],
        topics=["Stack Implementation", "Queue Implementation", "Monotonic Stack", "Valid Parentheses", "Next Greater Element", "BFS Basics"],
        learningObjectives=[
            "Implementar stacks y queues eficientemente",
            "Resolver problemas de paréntesis balanceados",
            "Usar monotonic stack para problemas de 'next greater'",
            "Entender cuándo usar cada estructura"
        ]
    ),
    Module(
        id="trees",
        title="Árboles Binarios",
        description="Domina los árboles binarios y sus traversals, fundamentales para entrevistas técnicas.",
        icon="tree-deciduous",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedHours=14,
        totalLessons=10,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=7,
        prerequisites=["stacks-queues"],
        topics=["Binary Tree Basics", "DFS Traversals", "BFS Traversal", "Tree Construction", "Path Problems", "Lowest Common Ancestor", "Tree Validation", "Serialization"],
        learningObjectives=[
            "Implementar todos los tipos de traversal",
            "Resolver problemas de caminos en árboles",
            "Encontrar ancestros comunes",
            "Serializar y deserializar árboles"
        ]
    ),
    Module(
        id="bst",
        title="Binary Search Trees",
        description="Aprende las propiedades especiales de los BST y cómo aprovecharlas.",
        icon="search",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedHours=8,
        totalLessons=1,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=8,
        prerequisites=["trees"],
        topics=["BST Properties", "Insert & Delete", "Search Operations", "Validation", "Inorder Successor", "Balanced BST"],
        learningObjectives=[
            "Entender las propiedades de los BST",
            "Implementar operaciones CRUD eficientemente",
            "Validar si un árbol es BST",
            "Convertir arrays a BST balanceados"
        ]
    ),
    Module(
        id="heaps",
        title="Heaps y Priority Queues",
        description="Estructura esencial para problemas de 'top K' y scheduling.",
        icon="mountain",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=8,
        totalLessons=2,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=9,
        prerequisites=["bst"],
        topics=["Heap Properties", "Heapify", "Top K Elements", "Merge K Lists", "Median Finder", "Task Scheduler"],
        learningObjectives=[
            "Implementar min-heap y max-heap",
            "Resolver problemas de 'top K' eficientemente",
            "Usar heapq de Python correctamente",
            "Combinar heaps con otras estructuras"
        ]
    ),
    Module(
        id="graphs",
        title="Grafos",
        description="Algoritmos de grafos: DFS, BFS, y detección de ciclos.",
        icon="network",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=16,
        totalLessons=2,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=10,
        prerequisites=["heaps"],
        topics=["Graph Representation", "DFS", "BFS", "Cycle Detection", "Topological Sort", "Connected Components", "Bipartite", "Clone Graph"],
        learningObjectives=[
            "Representar grafos de múltiples formas",
            "Implementar DFS y BFS correctamente",
            "Detectar ciclos en grafos dirigidos y no dirigidos",
            "Resolver problemas de ordenamiento topológico"
        ]
    ),
    Module(
        id="recursion-backtracking",
        title="Recursión y Backtracking",
        description="Técnicas para resolver problemas de combinatoria y búsqueda exhaustiva.",
        icon="rotate-ccw",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=12,
        totalLessons=8,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=11,
        prerequisites=["graphs"],
        topics=["Recursion Basics", "Backtracking Template", "Permutations", "Combinations", "Subsets", "N-Queens", "Sudoku Solver", "Word Search"],
        learningObjectives=[
            "Pensar recursivamente en problemas",
            "Aplicar el template de backtracking",
            "Generar permutaciones y combinaciones",
            "Podar el espacio de búsqueda eficientemente"
        ]
    ),
    Module(
        id="dynamic-programming",
        title="Programación Dinámica",
        description="La técnica más desafiante y común en entrevistas técnicas de alto nivel.",
        icon="gem",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=20,
        totalLessons=14,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=12,
        prerequisites=["recursion-backtracking"],
        topics=["DP Fundamentals", "1D DP", "2D DP", "Fibonacci Pattern", "Knapsack", "LCS/LIS", "Grid Problems", "State Machine", "Interval DP"],
        learningObjectives=[
            "Identificar problemas de DP",
            "Definir estados y transiciones",
            "Convertir recursión a DP bottom-up",
            "Optimizar espacio en soluciones DP"
        ]
    ),
    Module(
        id="binary-search",
        title="Binary Search Avanzado",
        description="Más allá de la búsqueda básica: aplicaciones avanzadas de binary search.",
        icon="target",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=8,
        totalLessons=1,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=13,
        prerequisites=["dynamic-programming"],
        topics=["Classic Binary Search", "Search in Rotated Array", "Find Peak", "Search Space", "Binary Search on Answer", "Bisect Module"],
        learningObjectives=[
            "Implementar binary search sin bugs",
            "Buscar en arrays rotados",
            "Aplicar binary search a espacios de respuesta",
            "Usar el módulo bisect de Python"
        ]
    ),
    Module(
        id="sorting-algorithms",
        title="Algoritmos de Ordenamiento",
        description="Implementación y análisis de los algoritmos de ordenamiento clásicos.",
        icon="trending-up",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=10,
        totalLessons=1,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=14,
        prerequisites=["binary-search"],
        topics=["QuickSort", "MergeSort", "HeapSort", "Counting Sort", "Radix Sort", "Custom Sorting", "Stability"],
        learningObjectives=[
            "Implementar sorting algorithms desde cero",
            "Entender trade-offs entre algoritmos",
            "Usar sorting customizado en Python",
            "Elegir el algoritmo correcto para cada caso"
        ]
    ),
    Module(
        id="advanced-graphs",
        title="Grafos Avanzados",
        description="Dijkstra, Bellman-Ford, Union-Find y más algoritmos avanzados.",
        icon="globe",
        difficulty=Difficulty.EXPERT,
        estimatedHours=14,
        totalLessons=1,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=15,
        prerequisites=["sorting-algorithms"],
        topics=["Dijkstra", "Bellman-Ford", "Floyd-Warshall", "Union-Find", "Kruskal", "Prim", "Strongly Connected Components"],
        learningObjectives=[
            "Encontrar caminos más cortos",
            "Implementar Union-Find con optimizaciones",
            "Construir minimum spanning trees",
            "Resolver problemas de conectividad"
        ]
    ),
    Module(
        id="tries",
        title="Tries y Estructuras de Texto",
        description="Estructuras especializadas para búsqueda y autocompletado de texto.",
        icon="type",
        difficulty=Difficulty.EXPERT,
        estimatedHours=6,
        totalLessons=1,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=16,
        prerequisites=["advanced-graphs"],
        topics=["Trie Implementation", "Word Search II", "Autocomplete", "Word Dictionary", "Prefix Matching"],
        learningObjectives=[
            "Implementar un Trie desde cero",
            "Resolver problemas de autocompletado",
            "Buscar palabras con wildcards",
            "Optimizar búsquedas de prefijos"
        ]
    ),
    Module(
        id="bit-manipulation",
        title="Bit Manipulation",
        description="Operaciones a nivel de bits para resolver problemas de manera eficiente y elegante.",
        icon="binary",
        difficulty=Difficulty.ADVANCED,
        estimatedHours=8,
        totalLessons=6,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=17,
        prerequisites=["tries"],
        topics=["Operadores Bitwise", "AND OR XOR NOT", "Shifts", "Máscaras de Bits", "Trucos Comunes", "Potencias de 2"],
        learningObjectives=[
            "Dominar operadores AND, OR, XOR, NOT y shifts",
            "Verificar y manipular bits individuales",
            "Detectar potencias de 2 eficientemente",
            "Resolver problemas clásicos como Single Number",
            "Aplicar XOR para encontrar elementos únicos",
            "Usar bit manipulation para optimizar espacio"
        ]
    ),
    Module(
        id="interview-prep",
        title="Preparación para Entrevistas",
        description="Estrategias, patrones comunes y simulación de entrevistas reales.",
        icon="briefcase",
        difficulty=Difficulty.EXPERT,
        estimatedHours=10,
        totalLessons=1,
        completedLessons=0,
        status=ModuleStatus.AVAILABLE,
        order=18,
        prerequisites=["bit-manipulation"],
        topics=["Problem Solving Framework", "Communication Tips", "Time Management", "Common Patterns", "Mock Interviews", "Behavioral Questions"],
        learningObjectives=[
            "Estructurar tu approach ante cualquier problema",
            "Comunicar efectivamente tu pensamiento",
            "Manejar el tiempo durante la entrevista",
            "Reconocer patrones comunes rápidamente"
        ]
    )
]


@router.get("/", response_model=List[Module])
async def get_all_modules():
    """Obtiene todos los módulos disponibles."""
    return MODULES_DATA


@router.get("/{module_id}", response_model=Module)
async def get_module(module_id: str):
    """Obtiene un módulo específico por su ID."""
    for module in MODULES_DATA:
        if module.id == module_id:
            return module
    raise HTTPException(status_code=404, detail=f"Módulo '{module_id}' no encontrado")


@router.get("/{module_id}/lessons")
async def get_module_lessons(module_id: str):
    """Obtiene las lecciones de un módulo específico."""
    # Verificar que el módulo existe
    module_exists = any(m.id == module_id for m in MODULES_DATA)
    if not module_exists:
        raise HTTPException(status_code=404, detail=f"Módulo '{module_id}' no encontrado")
    
    # Importar lecciones del router de lecciones
    from .lessons import get_lessons_by_module
    return await get_lessons_by_module(module_id)
