"""
Modelos Pydantic
================
Definición de todos los modelos de datos utilizados en la API.
Estos modelos garantizan validación y serialización correcta.
"""

from typing import Optional, Any
from pydantic import BaseModel, Field
from enum import Enum


# ============================================
# ENUMS
# ============================================

class Difficulty(str, Enum):
    """Niveles de dificultad de ejercicios."""
    BEGINNER = "beginner"
    EASY = "easy"
    INTERMEDIATE = "intermediate"
    MEDIUM = "medium"
    ADVANCED = "advanced"
    HARD = "hard"
    EXPERT = "expert"


class Status(str, Enum):
    """Estados posibles de progreso."""
    NOT_STARTED = "not-started"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"


class ModuleStatus(str, Enum):
    """Estados de disponibilidad de módulos."""
    AVAILABLE = "available"
    LOCKED = "locked"
    COMPLETED = "completed"


class LessonStatus(str, Enum):
    """Estados de lecciones."""
    AVAILABLE = "available"
    LOCKED = "locked"
    COMPLETED = "completed"


class ExerciseStatus(str, Enum):
    """Estados de ejercicios."""
    NOT_STARTED = "not-started"
    IN_PROGRESS = "in-progress"
    COMPLETED = "completed"
    FAILED = "failed"


class AlgorithmPattern(str, Enum):
    """Patrones algorítmicos comunes."""
    TWO_POINTERS = "two-pointers"
    SLIDING_WINDOW = "sliding-window"
    BINARY_SEARCH = "binary-search"
    HASH_MAP = "hash-map"
    RECURSION = "recursion"
    DYNAMIC_PROGRAMMING = "dynamic-programming"
    BACKTRACKING = "backtracking"
    BFS = "bfs"
    DFS = "dfs"
    GREEDY = "greedy"
    DIVIDE_CONQUER = "divide-conquer"
    SORTING = "sorting"
    STACK = "stack"
    QUEUE = "queue"
    HEAP = "heap"
    TREE = "tree"
    GRAPH = "graph"
    TRIE = "trie"


# ============================================
# MODELOS DE MÓDULO
# ============================================

class Module(BaseModel):
    """Módulo educativo."""
    id: str
    title: str
    description: str
    icon: str
    difficulty: Difficulty
    estimatedHours: int
    totalLessons: int
    completedLessons: int = 0
    status: ModuleStatus
    order: int
    prerequisites: list[str] = []
    topics: list[str]
    learningObjectives: list[str]


# ============================================
# MODELOS DE LECCIÓN
# ============================================

class QuizQuestion(BaseModel):
    """Pregunta de quiz interactivo para verificar comprensión."""
    id: str
    question: str
    options: list[str]
    correct_index: int
    explanation: str
    difficulty: str = "easy"  # easy, medium, hard


class FillBlankQuestion(BaseModel):
    """Pregunta de completar el espacio en blanco."""
    id: str
    code_template: str  # Código con ___ para completar
    blank_answer: str  # Respuesta correcta
    hint: str
    explanation: str


class ContentBlock(BaseModel):
    """Bloque de contenido de una lección."""
    type: str  # "text", "code", "info", "warning", "quiz", "fill-blank"
    content: Optional[str] = None
    language: Optional[str] = None
    quiz: Optional[QuizQuestion] = None  # Para type="quiz"
    fill_blank: Optional[FillBlankQuestion] = None  # Para type="fill-blank"


class CodeExample(BaseModel):
    """Ejemplo de código con explicación."""
    title: str
    description: str
    code: str
    language: str = "python"


class Lesson(BaseModel):
    """Lección individual."""
    id: str
    moduleId: str
    title: str
    description: str
    order: int
    difficulty: Difficulty
    estimatedMinutes: int
    status: LessonStatus
    content: list[ContentBlock]
    codeExamples: list[CodeExample] = []
    prerequisites: list[str] = []
    nextLessonId: Optional[str] = None
    # Campos para "Píldoras de Código" (Método Feynman)
    visual_diagram: Optional[str] = None  # ASCII art o descripción visual del patrón
    core_code_snippet: Optional[str] = None  # Máximo 15 líneas - el código esencial
    feynman_explanation: Optional[str] = None  # Explicación como a un niño de 5 años
    # Quizzes de la lección
    quiz_questions: list[QuizQuestion] = []


# ============================================
# MODELOS DE EJERCICIO
# ============================================

class TestCase(BaseModel):
    """Caso de prueba para ejercicio."""
    input: Any
    expected: Any
    isHidden: bool = False


class SelfEvaluationItem(BaseModel):
    """Item del checklist de autoevaluación."""
    id: str
    label: str
    category: str = "general"  # complexity, edge_cases, code_quality, understanding


class Exercise(BaseModel):
    """Ejercicio de práctica."""
    id: str
    moduleId: str
    lessonId: Optional[str] = None
    title: str
    description: str
    difficulty: Difficulty
    estimatedMinutes: int
    status: ExerciseStatus
    starterCode: str
    solution: str
    hints: list[str]
    testCases: list[TestCase]
    constraints: list[str]
    patterns: list[AlgorithmPattern]
    companies: list[str] = []
    similarProblems: list[str] = []
    order: int
    points: int = 10
    # Checklist de autoevaluación (Método Feynman)
    self_evaluation: list[SelfEvaluationItem] = [
        SelfEvaluationItem(id="complexity_time", label="¿Expliqué la complejidad temporal O(n)?", category="complexity"),
        SelfEvaluationItem(id="complexity_space", label="¿Expliqué la complejidad espacial?", category="complexity"),
        SelfEvaluationItem(id="edge_cases", label="¿Consideré casos de borde (lista vacía, un elemento)?", category="edge_cases"),
        SelfEvaluationItem(id="pythonic", label="¿Mi código es legible y Pythonic?", category="code_quality"),
        SelfEvaluationItem(id="no_solution", label="¿Lo resolví sin ver la solución?", category="understanding"),
    ]
    # Explicación del "por qué" funciona (Método Feynman)
    why_it_works: Optional[str] = None


# ============================================
# MODELOS DE EJECUCIÓN DE CÓDIGO
# ============================================

class CodeExecutionRequest(BaseModel):
    """Request para ejecutar código."""
    code: str
    functionName: str
    testCases: list[TestCase]
    timeout: int = Field(default=5, ge=1, le=30)


class TestResult(BaseModel):
    """Resultado de un test individual."""
    testCaseIndex: int
    passed: bool
    input: Any
    expected: Any
    actual: Any
    executionTime: float
    error: Optional[str] = None


class CodeExecutionResult(BaseModel):
    """Resultado de ejecución de código."""
    success: bool
    output: Optional[Any] = None
    stdout: str = ""
    executionTime: float
    error: Optional[str] = None
    testResults: list[TestResult] = []


# ============================================
# MODELOS DE RESPUESTA API
# ============================================

class APIResponse(BaseModel):
    """Respuesta genérica de la API."""
    success: bool
    message: Optional[str] = None
    data: Optional[Any] = None
    error: Optional[str] = None
