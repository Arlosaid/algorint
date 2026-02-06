"""
Lessons Router
==============
Endpoints para gestión de lecciones.
"""

from fastapi import APIRouter, HTTPException
from typing import List, Optional
from ..models import Lesson, Difficulty, LessonStatus, ContentBlock, CodeExample, QuizQuestion

router = APIRouter()

# Datos de lecciones - En producción vendría de base de datos
LESSONS_DATA: List[Lesson] = [
    # === MÓDULO: Fundamentos de Python ===
    Lesson(
        id="python-listas-tuplas",
        moduleId="fundamentos-python",
        title="Listas y Tuplas en Python",
        description="Domina las estructuras de datos secuenciales más importantes de Python.",
        order=1,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Listas y Tuplas en Python

Las **listas** y **tuplas** son las estructuras de datos secuenciales fundamentales en Python. Entender sus diferencias y cuándo usar cada una es esencial para escribir código eficiente.

## Objetivos de esta lección

- Entender la diferencia entre listas (mutables) y tuplas (inmutables)
- Conocer las operaciones y su complejidad temporal
- Aplicar técnicas comunes en problemas algorítmicos"""
            ),
            ContentBlock(
                type="text",
                content="""## Listas: Colecciones Mutables

Las listas en Python son **arrays dinámicos** que pueden crecer y reducirse. Son mutables, lo que significa que puedes modificar sus elementos después de crearlas."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Creación de listas
numeros = [1, 2, 3, 4, 5]
mixta = [1, "hola", 3.14, True]
vacia = []

# Operaciones básicas - O(1)
numeros.append(6)       # Agregar al final
ultimo = numeros.pop()  # Remover del final
longitud = len(numeros) # Obtener tamaño
elemento = numeros[0]   # Acceso por índice

# Operaciones O(n)
numeros.insert(0, 0)    # Insertar en posición
numeros.remove(3)       # Remover por valor
existe = 4 in numeros   # Verificar existencia

print(numeros)  # [0, 1, 2, 4, 5]'''
            ),
            ContentBlock(
                type="info",
                content="**Tip para entrevistas**: Siempre menciona la complejidad de las operaciones. `append()` y `pop()` son O(1), pero `insert(0, x)` y `remove(x)` son O(n)."
            ),
            ContentBlock(
                type="text",
                content="""## Tuplas: Colecciones Inmutables

Las tuplas son similares a las listas pero **inmutables**. Una vez creadas, no puedes modificar sus elementos. Esto las hace más eficientes en memoria y seguras para datos que no deben cambiar."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Creación de tuplas
coordenada = (10, 20)
punto_3d = (1, 2, 3)
singleton = (42,)  # Nota la coma para tupla de un elemento

# Desempaquetado - muy útil en algoritmos
x, y = coordenada
a, b, c = punto_3d

# Swap elegante usando tuplas
a, b = b, a  # Intercambia valores sin variable temporal

# Tuplas como claves de diccionario (listas no pueden)
cache = {}
cache[(0, 0)] = "origen"
cache[(1, 2)] = "punto A"

# Named tuples para código más legible
from collections import namedtuple
Point = namedtuple('Point', ['x', 'y'])
p = Point(3, 4)
print(p.x, p.y)  # 3 4'''
            ),
            ContentBlock(
                type="warning",
                content="**Cuidado**: Intentar modificar una tupla lanza `TypeError`. Si necesitas modificar elementos, usa una lista o crea una nueva tupla."
            ),
            ContentBlock(
                type="text",
                content="""## Comparación: Lista vs Tupla

| Característica | Lista | Tupla |
|---------------|-------|-------|
| Mutable | Sí | No |
| Sintaxis | `[1, 2, 3]` | `(1, 2, 3)` |
| Memoria | Mayor | Menor |
| Clave dict | No | Sí |
| Uso típico | Colección dinámica | Datos fijos |"""
            ),
            ContentBlock(
                type="text",
                content="""## Técnicas Comunes en Entrevistas

### Slicing
```python
nums = [0, 1, 2, 3, 4, 5]
nums[1:4]     # [1, 2, 3]
nums[::2]     # [0, 2, 4] - cada 2
nums[::-1]    # [5, 4, 3, 2, 1, 0] - reverso
```

### List Comprehension
```python
cuadrados = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
pares = [x for x in nums if x % 2 == 0]  # [0, 2, 4]
```

### Enumerate y Zip
```python
for i, val in enumerate(['a', 'b', 'c']):
    print(i, val)  # 0 a, 1 b, 2 c

for a, b in zip([1, 2], ['x', 'y']):
    print(a, b)  # 1 x, 2 y
```"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Two Sum con Lista",
                description="Encontrar dos números que sumen un target",
                code='''def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Ejemplo
print(two_sum([2, 7, 11, 15], 9))  # [0, 1]''',
                language="python"
            ),
            CodeExample(
                title="Rotar Array In-Place",
                description="Rotar elementos k posiciones usando tupla swap",
                code='''def rotate(nums, k):
    n = len(nums)
    k = k % n
    
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)

# Ejemplo
arr = [1, 2, 3, 4, 5]
rotate(arr, 2)
print(arr)  # [4, 5, 1, 2, 3]''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="python-diccionarios-sets",
        quiz_questions=[
            QuizQuestion(
                id="q1-listas-complexity",
                question="¿Cuál es la complejidad de tiempo de list.append() en Python?",
                options=["O(1) amortizado", "O(n)", "O(log n)", "O(n²)"],
                correct_index=0,
                explanation="append() es O(1) amortizado porque Python pre-reserva espacio extra en las listas. Solo ocasionalmente necesita redimensionar.",
                difficulty="easy"
            ),
            QuizQuestion(
                id="q2-listas-insert",
                question="¿Por qué list.insert(0, x) es O(n)?",
                options=[
                    "Porque Python es lento",
                    "Porque debe mover todos los elementos existentes",
                    "Porque necesita buscar el índice 0",
                    "Porque crea una nueva lista"
                ],
                correct_index=1,
                explanation="Insertar al inicio requiere desplazar TODOS los elementos una posición hacia la derecha, lo que toma O(n) tiempo.",
                difficulty="medium"
            ),
            QuizQuestion(
                id="q3-tuplas-dict",
                question="¿Por qué las tuplas pueden ser claves de diccionario pero las listas no?",
                options=[
                    "Las tuplas son más rápidas",
                    "Las tuplas son inmutables (hashables)",
                    "Las listas ocupan más memoria",
                    "Es una limitación arbitraria de Python"
                ],
                correct_index=1,
                explanation="Las claves de diccionario deben ser hashables (inmutables). Las tuplas no cambian, así que su hash es constante. Las listas pueden cambiar, lo que rompería el hash.",
                difficulty="medium"
            ),
            QuizQuestion(
                id="q4-slicing",
                question="¿Qué retorna nums[::-1]?",
                options=[
                    "El primer elemento",
                    "El último elemento", 
                    "Una copia invertida de la lista",
                    "Un error"
                ],
                correct_index=2,
                explanation="El slice [::-1] significa 'desde el inicio hasta el final, con paso -1', lo que efectivamente invierte la lista.",
                difficulty="easy"
            ),
            QuizQuestion(
                id="q5-swap",
                question="¿Qué hace a, b = b, a en Python?",
                options=[
                    "Crea un error de sintaxis",
                    "Intercambia los valores de a y b sin variable temporal",
                    "Asigna b a ambas variables",
                    "Crea una tupla (b, a)"
                ],
                correct_index=1,
                explanation="Python evalúa el lado derecho primero creando una tupla (b, a), luego desempaqueta en a, b. Es el swap más elegante del lenguaje.",
                difficulty="easy"
            )
        ]
    ),
    
    # Lección 2: Diccionarios y Sets
    Lesson(
        id="python-diccionarios-sets",
        moduleId="fundamentos-python",
        title="Diccionarios y Sets",
        description="Estructuras hash para búsquedas O(1) y eliminación de duplicados.",
        order=2,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Diccionarios y Sets en Python

Los **diccionarios** y **sets** son estructuras basadas en hash tables que ofrecen operaciones O(1) promedio. Son fundamentales para resolver problemas de manera eficiente.

## Objetivos

- Dominar operaciones de diccionarios y sets
- Entender cuándo usar cada estructura
- Aplicar patrones comunes: frequency counter, lookup table"""
            ),
            ContentBlock(
                type="text",
                content="""## Diccionarios (dict)

Los diccionarios almacenan pares clave-valor con acceso O(1) promedio."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Creación
persona = {"nombre": "Ana", "edad": 25}
vacio = {}
desde_pares = dict([("a", 1), ("b", 2)])

# Operaciones O(1)
persona["ciudad"] = "Madrid"  # Insertar
edad = persona.get("edad", 0)  # Obtener con default
del persona["edad"]            # Eliminar
existe = "nombre" in persona   # Verificar existencia

# Iteración
for key in persona:
    print(key)
for key, value in persona.items():
    print(f"{key}: {value}")

# Métodos útiles
persona.keys()    # dict_keys(['nombre', 'ciudad'])
persona.values()  # dict_values(['Ana', 'Madrid'])
persona.items()   # dict_items([('nombre', 'Ana'), ...])'''
            ),
            ContentBlock(
                type="text",
                content="""## Sets (Conjuntos)

Los sets son colecciones de elementos únicos, ideales para eliminar duplicados y verificar pertenencia en O(1)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Creación
numeros = {1, 2, 3, 4, 5}
desde_lista = set([1, 2, 2, 3, 3, 3])  # {1, 2, 3}
vacio = set()  # {} crea dict, no set!

# Operaciones O(1)
numeros.add(6)         # Agregar
numeros.remove(1)      # Eliminar (error si no existe)
numeros.discard(100)   # Eliminar (sin error si no existe)
existe = 3 in numeros  # Verificar existencia

# Operaciones de conjuntos
a = {1, 2, 3}
b = {3, 4, 5}
a | b  # Unión: {1, 2, 3, 4, 5}
a & b  # Intersección: {3}
a - b  # Diferencia: {1, 2}
a ^ b  # Diferencia simétrica: {1, 2, 4, 5}'''
            ),
            ContentBlock(
                type="info",
                content="**Patrón clave**: Cuando necesites verificar existencia o eliminar duplicados, piensa en sets. Cuando necesites contar o mapear, piensa en diccionarios."
            ),
            ContentBlock(
                type="text",
                content="""## Patrones Comunes en Entrevistas

### 1. Frequency Counter (Contador de Frecuencia)
```python
from collections import Counter

def is_anagram(s1, s2):
    return Counter(s1) == Counter(s2)

# O manualmente:
def count_chars(s):
    freq = {}
    for char in s:
        freq[char] = freq.get(char, 0) + 1
    return freq
```

### 2. Two Sum con Hash Map
```python
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        if target - num in seen:
            return [seen[target - num], i]
        seen[num] = i
    return []
```

### 3. Encontrar Duplicados
```python
def has_duplicates(nums):
    return len(nums) != len(set(nums))

def find_duplicate(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return num
        seen.add(num)
    return -1
```"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Group Anagrams",
                description="Agrupar strings que son anagramas entre sí",
                code='''from collections import defaultdict

def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())

# Ejemplo
strs = ["eat", "tea", "tan", "ate", "nat", "bat"]
print(group_anagrams(strs))
# [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']]''',
                language="python"
            )
        ],
        prerequisites=["python-listas-tuplas"],
        nextLessonId="python-strings",
        quiz_questions=[
            QuizQuestion(
                id="q1-dict-complexity",
                question="¿Cuál es la complejidad promedio de buscar una clave en un diccionario?",
                options=["O(1)", "O(n)", "O(log n)", "O(n²)"],
                correct_index=0,
                explanation="Los diccionarios usan hash tables, lo que permite acceso directo O(1) promedio. Solo en el peor caso (muchas colisiones) sería O(n).",
                difficulty="easy"
            ),
            QuizQuestion(
                id="q2-set-vs-list",
                question="Para verificar si un elemento existe, ¿qué estructura es más eficiente?",
                options=["Lista - O(1)", "Set - O(1)", "Lista - O(n)", "Ambas son iguales"],
                correct_index=1,
                explanation="Los sets usan hashing para búsqueda O(1). Las listas requieren recorrer elemento por elemento O(n). ¡Usa sets para membership testing!",
                difficulty="easy"
            ),
            QuizQuestion(
                id="q3-counter",
                question="¿Qué hace Counter('aabbcc')?",
                options=[
                    "Cuenta las palabras",
                    "Retorna {'a': 2, 'b': 2, 'c': 2}",
                    "Ordena los caracteres",
                    "Retorna 6 (total de caracteres)"
                ],
                correct_index=1,
                explanation="Counter cuenta la frecuencia de cada elemento. Es perfecto para problemas de frequency counting y anagramas.",
                difficulty="easy"
            ),
            QuizQuestion(
                id="q4-defaultdict",
                question="¿Cuál es la ventaja de defaultdict sobre dict normal?",
                options=[
                    "Es más rápido",
                    "Ocupa menos memoria",
                    "Crea valores por defecto automáticamente para claves nuevas",
                    "Mantiene el orden de inserción"
                ],
                correct_index=2,
                explanation="defaultdict evita KeyError al acceder a claves inexistentes. defaultdict(list) crea [] automáticamente, defaultdict(int) crea 0.",
                difficulty="medium"
            ),
            QuizQuestion(
                id="q5-two-sum-pattern",
                question="En Two Sum, ¿por qué guardamos num:index en el diccionario?",
                options=[
                    "Para ordenar los números",
                    "Para buscar el complemento (target - num) en O(1)",
                    "Para eliminar duplicados",
                    "Para contar frecuencias"
                ],
                correct_index=1,
                explanation="Guardamos cada número con su índice para poder buscar instantáneamente si ya vimos el complemento que necesitamos. ¡Es el patrón Hash Map clásico!",
                difficulty="medium"
            )
        ]
    ),
    
    # Lección 3: Strings
    Lesson(
        id="python-strings",
        moduleId="fundamentos-python",
        title="Manipulación de Strings",
        description="Domina las operaciones con strings y sus métodos más útiles para entrevistas.",
        order=3,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Manipulación de Strings en Python

Los strings son uno de los tipos más comunes en entrevistas. Dominar su manipulación es esencial.

## Objetivos

- Conocer los métodos más útiles de strings
- Entender la inmutabilidad y sus implicaciones
- Aplicar técnicas para problemas de palíndromos, anagramas, etc."""
            ),
            ContentBlock(
                type="warning",
                content="**Importante**: Los strings son INMUTABLES. Cada modificación crea un nuevo string. Concatenar en un loop es O(n^2)!"
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# MAL: Concatenación en loop - O(n^2)
result = ""
for char in "hello":
    result += char  # Crea nuevo string cada vez

# BIEN: Usar join - O(n)
result = "".join(["h", "e", "l", "l", "o"])

# BIEN: Usar lista y join - O(n)
chars = []
for char in "hello":
    chars.append(char.upper())
result = "".join(chars)'''
            ),
            ContentBlock(
                type="text",
                content="""## Métodos Esenciales

```python
s = "  Hello World  "

# Transformación
s.lower()        # "  hello world  "
s.upper()        # "  HELLO WORLD  "
s.strip()        # "Hello World"
s.replace("o", "0")  # "  Hell0 W0rld  "

# Búsqueda
s.find("World")  # 8 (índice o -1)
s.index("World") # 8 (índice o ValueError)
"World" in s     # True

# División y unión
s.split()        # ["Hello", "World"]
"-".join(["a", "b", "c"])  # "a-b-c"

# Verificación
"123".isdigit()  # True
"abc".isalpha()  # True
"abc123".isalnum()  # True
```"""
            ),
            ContentBlock(
                type="info",
                content="**Tip**: Para modificar un string caracter por caracter, conviértelo a lista, modifica, y luego usa join: `''.join(list(s))`"
            ),
            ContentBlock(
                type="text",
                content="""## Técnicas Comunes

### Verificar Palíndromo
```python
def is_palindrome(s):
    s = s.lower()
    s = ''.join(c for c in s if c.isalnum())
    return s == s[::-1]

# O con two pointers (más eficiente en espacio):
def is_palindrome_tp(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True
```"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Longest Common Prefix",
                description="Encontrar el prefijo común más largo",
                code='''def longest_common_prefix(strs):
    if not strs:
        return ""
    
    prefix = strs[0]
    for s in strs[1:]:
        while not s.startswith(prefix):
            prefix = prefix[:-1]
            if not prefix:
                return ""
    return prefix

# Ejemplo
print(longest_common_prefix(["flower", "flow", "flight"]))  # "fl"''',
                language="python"
            )
        ],
        prerequisites=["python-diccionarios-sets"],
        nextLessonId="python-comprehensions"
    ),
    
    # Lección 4: List Comprehensions
    Lesson(
        id="python-comprehensions",
        moduleId="fundamentos-python",
        title="List Comprehensions y Expresiones",
        description="Escribe código Pythónico y conciso con comprehensions.",
        order=4,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# List Comprehensions y Expresiones

Las comprehensions son una forma elegante y Pythónica de crear colecciones.

## Objetivos

- Dominar list, dict y set comprehensions
- Saber cuándo usar comprehensions vs loops
- Escribir código más legible y eficiente"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Sintaxis básica: [expresión for item in iterable if condición]

# List comprehension
cuadrados = [x**2 for x in range(5)]  # [0, 1, 4, 9, 16]
pares = [x for x in range(10) if x % 2 == 0]  # [0, 2, 4, 6, 8]

# Dict comprehension
cuadrados_dict = {x: x**2 for x in range(5)}  # {0: 0, 1: 1, 2: 4, ...}

# Set comprehension
letras = {c.lower() for c in "Hello"}  # {'h', 'e', 'l', 'o'}

# Generator expression (memoria eficiente)
gen = (x**2 for x in range(1000000))  # No crea lista en memoria'''
            ),
            ContentBlock(
                type="info",
                content="**Regla de oro**: Si la comprehension tiene más de una línea, probablemente un loop tradicional sea más legible."
            ),
            ContentBlock(
                type="text",
                content="""## Comprehensions Anidadas

```python
# Aplanar matriz
matrix = [[1, 2], [3, 4], [5, 6]]
flat = [num for row in matrix for num in row]  # [1, 2, 3, 4, 5, 6]

# Crear matriz
matrix = [[0] * 3 for _ in range(3)]  # [[0,0,0], [0,0,0], [0,0,0]]

# CUIDADO: Esto crea referencias al mismo objeto!
wrong = [[0] * 3] * 3  # Todas las filas son el mismo objeto
```"""
            ),
            ContentBlock(
                type="warning",
                content="**Cuidado con la memoria**: Las comprehensions crean la estructura completa en memoria. Para datos muy grandes, usa generadores."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Filtrar y Transformar",
                description="Ejemplo práctico de comprehension",
                code='''# Obtener palabras largas en mayúsculas
words = ["hola", "mundo", "python", "es", "genial"]
long_upper = [w.upper() for w in words if len(w) > 4]
print(long_upper)  # ['MUNDO', 'PYTHON', 'GENIAL']

# Crear diccionario de longitudes
lengths = {w: len(w) for w in words}
print(lengths)  # {'hola': 4, 'mundo': 5, ...}''',
                language="python"
            )
        ],
        prerequisites=["python-strings"],
        nextLessonId="python-lambdas"
    ),
    
    # Lección 5: Lambdas
    Lesson(
        id="python-lambdas",
        moduleId="fundamentos-python",
        title="Funciones Lambda y de Orden Superior",
        description="Domina las funciones anónimas y map/filter/reduce para código conciso.",
        order=5,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=35,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Funciones Lambda y de Orden Superior

Las lambdas son funciones anónimas de una línea, muy útiles como argumentos de otras funciones.

## Objetivos

- Entender la sintaxis de lambdas
- Usar map, filter y sorted con lambdas
- Saber cuándo usar lambdas vs funciones regulares"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Sintaxis: lambda argumentos: expresión

# Lambda básica
doble = lambda x: x * 2
print(doble(5))  # 10

# Múltiples argumentos
suma = lambda x, y: x + y
print(suma(3, 4))  # 7

# Uso principal: como argumento de funciones
nums = [3, 1, 4, 1, 5, 9, 2, 6]

# sorted con key
sorted(nums, key=lambda x: -x)  # Orden descendente
sorted(["banana", "Apple", "cherry"], key=lambda s: s.lower())

# max/min con key
max(nums, key=lambda x: x % 3)  # Máximo módulo 3'''
            ),
            ContentBlock(
                type="info",
                content="**Uso principal**: Las lambdas brillan como argumentos de funciones como `sorted()`, `max()`, `min()`, no para definir funciones reutilizables."
            ),
            ContentBlock(
                type="text",
                content="""## Map, Filter y Reduce

```python
nums = [1, 2, 3, 4, 5]

# map: aplica función a cada elemento
cuadrados = list(map(lambda x: x**2, nums))  # [1, 4, 9, 16, 25]

# filter: filtra elementos
pares = list(filter(lambda x: x % 2 == 0, nums))  # [2, 4]

# reduce: acumula valores
from functools import reduce
suma = reduce(lambda x, y: x + y, nums)  # 15
```

**Nota**: En Python moderno, las comprehensions suelen ser preferidas sobre map/filter."""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Ordenar Objetos Complejos",
                description="Usar lambda para ordenar por múltiples criterios",
                code='''# Ordenar por múltiples criterios
students = [
    {"name": "Ana", "grade": 85},
    {"name": "Bob", "grade": 90},
    {"name": "Carlos", "grade": 85}
]

# Por nota (desc), luego por nombre (asc)
sorted_students = sorted(students, 
    key=lambda s: (-s["grade"], s["name"]))

for s in sorted_students:
    print(f"{s['name']}: {s['grade']}")
# Bob: 90
# Ana: 85
# Carlos: 85''',
                language="python"
            )
        ],
        prerequisites=["python-comprehensions"],
        nextLessonId="python-iteradores"
    ),
    
    # Lección 6: Iteradores y Generadores
    Lesson(
        id="python-iteradores",
        moduleId="fundamentos-python",
        title="Iteradores y Generadores",
        description="Aprende a manejar grandes cantidades de datos de forma eficiente con iteradores.",
        order=6,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Iteradores y Generadores

Los generadores permiten crear secuencias de valores de forma lazy (bajo demanda), ahorrando memoria.

## Objetivos

- Entender la diferencia entre iterador y generador
- Crear generadores con yield
- Usar generadores para datos grandes"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Generador básico con yield
def count_up_to(n):
    i = 1
    while i <= n:
        yield i
        i += 1

# Uso
for num in count_up_to(5):
    print(num)  # 1, 2, 3, 4, 5

# Generator expression
gen = (x**2 for x in range(1000000))
# NO crea lista de 1M elementos en memoria

# Obtener valores
print(next(gen))  # 0
print(next(gen))  # 1'''
            ),
            ContentBlock(
                type="info",
                content="**Ventaja clave**: Un generador que produce 1 millón de números usa la misma memoria que uno que produce 10. Solo existe un valor a la vez."
            ),
            ContentBlock(
                type="text",
                content="""## Itertools - Herramientas Poderosas

```python
from itertools import combinations, permutations, product

# Combinaciones
list(combinations([1,2,3], 2))  # [(1,2), (1,3), (2,3)]

# Permutaciones
list(permutations([1,2,3], 2))  # [(1,2), (1,3), (2,1), (2,3), (3,1), (3,2)]

# Producto cartesiano
list(product([1,2], ['a','b']))  # [(1,'a'), (1,'b'), (2,'a'), (2,'b')]

# Más útiles
from itertools import chain, groupby, accumulate
list(chain([1,2], [3,4]))  # [1, 2, 3, 4]
list(accumulate([1,2,3,4]))  # [1, 3, 6, 10] - sumas acumuladas
```"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Fibonacci con Generador",
                description="Secuencia infinita de Fibonacci",
                code='''def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b

# Primeros 10 números de Fibonacci
fib = fibonacci()
for _ in range(10):
    print(next(fib), end=" ")
# 0 1 1 2 3 5 8 13 21 34''',
                language="python"
            )
        ],
        prerequisites=["python-lambdas"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Complejidad Algorítmica ===
    Lesson(
        id="big-o-introduccion",
        moduleId="complejidad-algoritmica",
        title="Introducción a Big O",
        description="Aprende a medir y comparar la eficiencia de algoritmos.",
        order=1,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Introducción a la Notación Big O

La notación Big O describe cómo crece el tiempo de ejecución de un algoritmo cuando el input crece.

## Objetivos

- Entender qué mide Big O
- Conocer las complejidades más comunes
- Analizar código para determinar su complejidad"""
            ),
            ContentBlock(
                type="text",
                content="""## Las Complejidades Más Comunes

| Big O | Nombre | Ejemplo |
|-------|--------|---------|
| O(1) | Constante | Acceso a array por índice |
| O(log n) | Logarítmica | Binary search |
| O(n) | Lineal | Recorrer array |
| O(n log n) | Linearítmica | Merge sort, Tim sort |
| O(n^2) | Cuadrática | Nested loops |
| O(2^n) | Exponencial | Subsets recursivo |
| O(n!) | Factorial | Permutaciones |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# O(1) - Constante
def get_first(arr):
    return arr[0]  # Siempre 1 operación

# O(n) - Lineal
def find_max(arr):
    max_val = arr[0]
    for num in arr:  # n iteraciones
        if num > max_val:
            max_val = num
    return max_val

# O(n^2) - Cuadrática
def has_duplicate_pair(arr):
    for i in range(len(arr)):      # n veces
        for j in range(i+1, len(arr)):  # ~n veces
            if arr[i] == arr[j]:
                return True
    return False

# O(log n) - Logarítmica
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1'''
            ),
            ContentBlock(
                type="text",
                content="""## Reglas para Analizar Complejidad

1. **Ignora constantes**: O(2n) = O(n)
2. **Toma el término dominante**: O(n^2 + n) = O(n^2)
3. **Analiza el peor caso** (generalmente)
4. **Loops anidados multiplican**: O(n) * O(n) = O(n^2)
5. **Loops consecutivos suman**: O(n) + O(n) = O(n)"""
            ),
            ContentBlock(
                type="info",
                content="**En entrevistas**: Siempre menciona la complejidad de tu solución (tiempo Y espacio). Es una de las primeras cosas que el entrevistador evalúa."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Análisis de Ejemplo Real",
                description="Analizar la complejidad de Two Sum",
                code='''# Solución O(n^2) - fuerza bruta
def two_sum_brute(nums, target):
    for i in range(len(nums)):          # O(n)
        for j in range(i+1, len(nums)):  # O(n)
            if nums[i] + nums[j] == target:
                return [i, j]
    return []
# Total: O(n^2) tiempo, O(1) espacio

# Solución O(n) - con hash map
def two_sum_optimal(nums, target):
    seen = {}                            # O(n) espacio
    for i, num in enumerate(nums):       # O(n)
        complement = target - num
        if complement in seen:           # O(1)
            return [seen[complement], i]
        seen[num] = i                    # O(1)
    return []
# Total: O(n) tiempo, O(n) espacio''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="big-o-analisis-tiempo"
    ),
    
    Lesson(
        id="big-o-analisis-tiempo",
        moduleId="complejidad-algoritmica",
        title="Análisis de Complejidad Temporal",
        description="Aprende a calcular la complejidad temporal paso a paso.",
        order=2,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Análisis de Complejidad Temporal

Aprende a analizar sistemáticamente el tiempo de ejecución de cualquier algoritmo.

## Pasos para Analizar

1. Identifica las operaciones básicas
2. Cuenta cuántas veces se ejecutan
3. Expresa en función del tamaño del input
4. Simplifica usando reglas de Big O"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Ejemplo 1: Loop simple
def sum_array(arr):
    total = 0          # O(1)
    for num in arr:    # O(n) - se repite n veces
        total += num   # O(1) por iteración
    return total       # O(1)
# Total: O(1) + O(n) * O(1) + O(1) = O(n)

# Ejemplo 2: Loops anidados
def print_pairs(arr):
    n = len(arr)
    for i in range(n):       # O(n)
        for j in range(n):   # O(n) por cada i
            print(arr[i], arr[j])  # O(1)
# Total: O(n) * O(n) * O(1) = O(n^2)

# Ejemplo 3: Loop que reduce a la mitad
def binary_example(n):
    count = 0
    while n > 1:
        n = n // 2
        count += 1
    return count
# n -> n/2 -> n/4 -> ... -> 1
# Total: O(log n)'''
            ),
            ContentBlock(
                type="info",
                content="**Tip**: Cuando un loop divide el problema a la mitad en cada iteración, es O(log n). Cuando lo multiplica, es exponencial."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Análisis de Merge Sort",
                description="Desglose de O(n log n)",
                code='''def merge_sort(arr):
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])   # T(n/2)
    right = merge_sort(arr[mid:])  # T(n/2)
    return merge(left, right)       # O(n)

# Recurrencia: T(n) = 2*T(n/2) + O(n)
# Niveles de recursión: log n
# Trabajo por nivel: O(n)
# Total: O(n log n)''',
                language="python"
            )
        ],
        prerequisites=["big-o-introduccion"],
        nextLessonId="big-o-analisis-espacio"
    ),
    
    Lesson(
        id="big-o-analisis-espacio",
        moduleId="complejidad-algoritmica",
        title="Análisis de Complejidad Espacial",
        description="Entiende cuánta memoria usa tu algoritmo.",
        order=3,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Complejidad Espacial

La complejidad espacial mide cuánta memoria adicional usa tu algoritmo.

## Qué Contar
- Variables auxiliares
- Estructuras de datos creadas
- Stack de recursión
- NO contar el input (generalmente)"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# O(1) espacio - constante
def find_max(arr):
    max_val = arr[0]  # Solo una variable
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val

# O(n) espacio - lineal
def duplicate_array(arr):
    result = []        # Crece con n
    for num in arr:
        result.append(num)
    return result

# O(n) espacio por recursión
def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
# El stack tiene n llamadas pendientes

# O(log n) espacio
def binary_search_recursive(arr, target, left, right):
    if left > right:
        return -1
    mid = (left + right) // 2
    if arr[mid] == target:
        return mid
    elif arr[mid] < target:
        return binary_search_recursive(arr, target, mid+1, right)
    else:
        return binary_search_recursive(arr, target, left, mid-1)
# El stack tiene log n llamadas'''
            ),
            ContentBlock(
                type="warning",
                content="**Cuidado con la recursión**: Cada llamada recursiva usa espacio en el stack. Una recursión de profundidad n usa O(n) espacio."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Trade-off Tiempo vs Espacio",
                description="A veces puedes usar más memoria para ser más rápido",
                code='''# O(n^2) tiempo, O(1) espacio
def has_duplicate_slow(nums):
    for i in range(len(nums)):
        for j in range(i+1, len(nums)):
            if nums[i] == nums[j]:
                return True
    return False

# O(n) tiempo, O(n) espacio
def has_duplicate_fast(nums):
    seen = set()
    for num in nums:
        if num in seen:
            return True
        seen.add(num)
    return False

# Usamos más memoria pero somos más rápidos''',
                language="python"
            )
        ],
        prerequisites=["big-o-analisis-tiempo"],
        nextLessonId="big-o-casos"
    ),
    
    Lesson(
        id="big-o-casos",
        moduleId="complejidad-algoritmica",
        title="Mejor, Peor y Caso Promedio",
        description="Entiende los diferentes casos de análisis de algoritmos.",
        order=4,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=35,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Casos de Análisis

## Los Tres Casos
- **Mejor caso**: El input más favorable
- **Peor caso**: El input más desfavorable
- **Caso promedio**: El input típico

## Por qué importa el peor caso
En entrevistas, generalmente nos enfocamos en el **peor caso** porque:
1. Es garantizado (nunca será peor)
2. Es más fácil de analizar
3. Es lo que el entrevistador espera"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Quick Sort - diferentes casos
def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[0]
    left = [x for x in arr[1:] if x < pivot]
    right = [x for x in arr[1:] if x >= pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)

# Mejor caso: O(n log n)
# - Pivot siempre divide en mitades iguales

# Peor caso: O(n^2)
# - Array ya ordenado y pivot es el primero
# - Cada partición tiene n-1 elementos de un lado

# Caso promedio: O(n log n)
# - Con pivot aleatorio, muy probable

# Linear Search
def linear_search(arr, target):
    for i, num in enumerate(arr):
        if num == target:
            return i
    return -1

# Mejor: O(1) - target está al inicio
# Peor: O(n) - target al final o no existe
# Promedio: O(n/2) = O(n)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Comparación de Casos",
                description="Binary Search vs Linear Search",
                code='''import random

# Linear Search
# Mejor: O(1), Peor: O(n), Promedio: O(n)
def linear_search(arr, target):
    for i, val in enumerate(arr):
        if val == target:
            return i
    return -1

# Binary Search (requiere array ordenado)
# Mejor: O(1), Peor: O(log n), Promedio: O(log n)
def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1''',
                language="python"
            )
        ],
        prerequisites=["big-o-analisis-espacio"],
        nextLessonId="big-o-comparacion"
    ),
    
    Lesson(
        id="big-o-comparacion",
        moduleId="complejidad-algoritmica",
        title="Comparación de Algoritmos",
        description="Aprende a elegir el mejor algoritmo para cada situación.",
        order=5,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Comparación de Algoritmos

## Jerarquía de Complejidades (de mejor a peor)

O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2ⁿ) < O(n!)

## Tiempo Real Aproximado (n = 1,000,000)

| Big O | Operaciones | Tiempo aprox |
|-------|-------------|--------------|
| O(1) | 1 | instant |
| O(log n) | 20 | instant |
| O(n) | 1,000,000 | 1 segundo |
| O(n log n) | 20,000,000 | 20 segundos |
| O(n²) | 1,000,000,000,000 | 31+ años |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Mismo problema, diferentes complejidades

# Encontrar elemento en lista
def find_linear(arr, target):      # O(n)
    return target in arr

def find_binary(arr, target):      # O(log n) - requiere ordenado
    import bisect
    idx = bisect.bisect_left(arr, target)
    return idx < len(arr) and arr[idx] == target

def find_hash(hash_set, target):   # O(1) promedio
    return target in hash_set

# Sumar elementos
def sum_loop(n):                   # O(n)
    total = 0
    for i in range(1, n+1):
        total += i
    return total

def sum_formula(n):                # O(1)
    return n * (n + 1) // 2'''
            ),
            ContentBlock(
                type="info",
                content="**Regla general**: Para n < 1000, casi cualquier algoritmo funciona. Para n > 10^6, necesitas O(n) o mejor. Para n > 10^8, necesitas O(log n) o O(1)."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Elegir el Algoritmo Correcto",
                description="Según el tamaño del input",
                code='''def solve_problem(n, data):
    """
    Guía para elegir complejidad según n:
    
    n <= 10:      O(n!) o O(2^n) pueden funcionar
    n <= 20:      O(2^n) está bien
    n <= 100:     O(n^3) está bien
    n <= 1000:    O(n^2) está bien
    n <= 10^5:    O(n log n) necesario
    n <= 10^6:    O(n) necesario
    n <= 10^8:    O(log n) o O(1) necesario
    """
    
    # Ejemplo: buscar en array
    if len(data) <= 100:
        # Linear search está bien
        return linear_search(data, target)
    else:
        # Mejor usar binary search o hash
        return binary_search(sorted(data), target)''',
                language="python"
            )
        ],
        prerequisites=["big-o-casos"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Arrays y Strings ===
    Lesson(
        id="two-pointers",
        moduleId="arrays-strings",
        title="Técnica Two Pointers",
        description="Domina la técnica de dos punteros para resolver problemas de arrays eficientemente.",
        order=1,
        difficulty=Difficulty.EASY,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Imagina que estás en un pasillo largo con puertas numeradas del 1 al 100. Buscas dos puertas cuyos números sumen exactamente 50. ¿Revisarías cada par posible? ¡Eso tomaría para siempre! En cambio, pon a un amigo en la puerta 1 y a otro en la puerta 100. Si la suma es mayor que 50, el amigo de la derecha se mueve a la izquierda. Si es menor, el de la izquierda avanza. Cada vez eliminan muchas posibilidades de golpe. Eso es Two Pointers: dos 'dedos' moviéndose inteligentemente por los datos para evitar revisar todas las combinaciones.""",
        visual_diagram="""## Variantes de Two Pointers

### 1. Punteros Opuestos (se acercan)

```
  [ 1 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 5 ]  [ 6 ]  [ 7 ]
    ^                                           ^
   left  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ►       right
    >>>                                    <<<
```

**Uso:** Two Sum, Palindrome, Container Water

---

### 2. Punteros Misma Direccion (slow/fast)

```
  [ 1 ]  [ 1 ]  [ 2 ]  [ 2 ]  [ 3 ]  [ 4 ]  [ 4 ]
    ^                     ^
   slow                  fast  ─ ─ ─ ─ ─ ─ ─ ─ ►
```

**Uso:** Remove Duplicates, Move Zeros, Particion

---

### 3. Punteros Desde el Inicio (dos arrays)

```
  Array A: [ 1, 3, 5, 7 ]     Array B: [ 2, 4, 6, 8 ]
             ^                            ^
            i ──►                        j ──►
```

**Uso:** Merge Sorted Arrays, Interseccion

---

| Variante | Inicio | Movimiento | Complejidad |
|----------|--------|------------|-------------|
| Opuestos | Extremos | Se acercan al centro | O(n) |
| Slow/Fast | Mismo lado | Misma direccion, distinta velocidad | O(n) |
| Dos arrays | Inicio de cada array | Avanzan segun condicion | O(n + m) |
""",
        core_code_snippet="""# TEMPLATE: Two Pointers - Punteros Opuestos
def two_pointer_opposite(arr, target):
    left, right = 0, len(arr) - 1
    
    while left < right:
        current = arr[left] + arr[right]
        if current == target:
            return [left, right]
        elif current < target:
            left += 1    # Necesitamos más
        else:
            right -= 1   # Necesitamos menos
    return []

# TEMPLATE: Two Pointers - Slow/Fast
def two_pointer_same_dir(arr):
    slow = 0
    for fast in range(len(arr)):
        if condicion(arr[fast]):  # Si el elemento es válido
            arr[slow] = arr[fast]
            slow += 1
    return slow  # Nuevo tamaño""",
        content=[
            ContentBlock(
                type="text",
                content="""# Técnica Two Pointers

La técnica de dos punteros es una de las más versátiles y frecuentes en entrevistas técnicas. Consiste en usar **dos índices** que se mueven por el array de manera estratégica, eliminando la necesidad de bucles anidados.

## ¿Por qué es tan importante?

Two Pointers aparece en **~30% de los problemas de arrays** en entrevistas FAANG. Es la primera técnica que deberías dominar porque:

1. **Reduce complejidad**: Convierte O(n²) en O(n)
2. **Es intuitiva**: Una vez entiendes el patrón, lo aplicas en muchas variantes
3. **Usa O(1) espacio**: No necesitas estructuras de datos extra"""
            ),
            ContentBlock(
                type="text",
                content="""## ¿Cuándo usar Two Pointers?

Hazte estas preguntas al ver un problema:

| Señal en el problema | Variante a usar |
|---------------------|-----------------|
| Array **ordenado** + buscar par/tripleta | Punteros opuestos |
| **Remover/filtrar** elementos in-place | Slow/Fast |
| Verificar **palíndromo** | Punteros opuestos |
| **Merge** de arrays ordenados | Punteros independientes |
| Encontrar **ciclos** en linked list | Fast/Slow (tortuga/liebre) |
| Problemas de **partición** | Slow/Fast |

### Regla de oro
> Si el problema dice "in-place" u "O(1) espacio extra", piensa en Two Pointers."""
            ),
            ContentBlock(
                type="text",
                content="""## Variante 1: Punteros Opuestos

Los punteros empiezan en los **extremos** y se acercan. Es como cerrar una pinza: vas descartando opciones por ambos lados.

### Paso a paso: encontrar par que sume 9

| Paso | Array | Left | Right | Suma | Accion |
|------|-------|------|-------|------|--------|
| 1 | `[1, 2, 4, 5, 7, 11]` | `L=0` (1) | `R=5` (11) | 12 | 12 > 9 → mover R |
| 2 | `[1, 2, 4, 5, 7, 11]` | `L=0` (1) | `R=4` (7) | 8 | 8 < 9 → mover L |
| 3 | `[1, 2, 4, 5, 7, 11]` | `L=1` (2) | `R=4` (7) | **9** | 9 = 9 → **Encontrado!** |

> **¿Por que funciona?** Al mover `right` reducimos la suma (descartamos el mayor). Al mover `left` la aumentamos. Asi cubrimos todas las posibilidades relevantes sin revisar cada par."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Two Sum en Array Ordenado - El ejemplo clásico
def two_sum_sorted(nums: list[int], target: int) -> list[int]:
    """
    Encuentra dos números en un array ORDENADO que sumen target.
    
    Estrategia: Punteros en extremos opuestos.
    - Si la suma es muy grande → mover right (reducir)
    - Si la suma es muy pequeña → mover left (aumentar)
    
    Complejidad: O(n) tiempo, O(1) espacio
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        current_sum = nums[left] + nums[right]
        
        if current_sum == target:
            return [left, right]        # ¡Encontrado!
        elif current_sum < target:
            left += 1                   # Necesitamos suma mayor
        else:
            right -= 1                  # Necesitamos suma menor
    
    return []  # No encontrado

# Ejemplo paso a paso
print(two_sum_sorted([1, 2, 3, 4, 6], 6))  # [1, 3] → 2+4=6'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="tp-q1",
                    question="En el array ordenado [1, 3, 5, 7, 9] con target=10, ¿cuál es el primer movimiento de los punteros?",
                    options=[
                        "left se mueve a la derecha porque 1+9=10 ya es la respuesta",
                        "right se mueve a la izquierda porque la suma 1+9=10 es igual al target",
                        "Se retornan los índices [0, 4] porque 1+9=10",
                        "left se mueve a la derecha porque 1+9 < 10"
                    ],
                    correct_index=2,
                    explanation="¡Correcto! La suma 1+9=10 es exactamente el target, así que retornamos [0, 4] inmediatamente. No necesitamos mover ningún puntero.",
                    difficulty="easy"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Variante 2: Punteros en la Misma Dirección (Slow/Fast)

Aquí ambos punteros avanzan de izquierda a derecha, pero a **velocidades diferentes**:
- `fast` recorre todo el array
- `slow` solo avanza cuando encontramos algo útil

### Analogía: La fila del cine

Imagina una fila de personas donde algunas no tienen boleto. `fast` revisa a cada persona. Si tiene boleto, la mueve al frente donde está `slow`. Los sin boleto simplemente se quedan atrás.

```
Original:     [✓, ✗, ✓, ✗, ✗, ✓, ✓]
Después:      [✓, ✓, ✓, ✓, ✗, ✗, ✗]
               slow→         fast→
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Remover Duplicados In-Place (Array Ordenado)
def remove_duplicates(nums: list[int]) -> int:
    """
    Mantiene solo elementos únicos al inicio del array.
    Retorna la nueva longitud.
    
    slow = posición donde escribir el siguiente único
    fast = lee cada elemento
    
    Complejidad: O(n) tiempo, O(1) espacio
    """
    if not nums:
        return 0
    
    slow = 0  # Último elemento único colocado
    
    for fast in range(1, len(nums)):
        if nums[fast] != nums[slow]:  # ¡Encontré uno nuevo!
            slow += 1
            nums[slow] = nums[fast]   # Lo coloco en su lugar
    
    return slow + 1  # Longitud del array sin duplicados

# Paso a paso:
# [1, 1, 2, 2, 3]
#  s  f              → 1==1, fast avanza
#  s     f           → 2!=1, slow avanza, copia → [1, 2, 2, 2, 3]
#     s     f        → 2==2, fast avanza
#     s        f     → 3!=2, slow avanza, copia → [1, 2, 3, 2, 3]
# Resultado: los primeros 3 elementos = [1, 2, 3]'''
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Move Zeros - Mover ceros al final manteniendo orden
def move_zeroes(nums: list[int]) -> None:
    """
    Mueve todos los 0 al final, manteniendo el orden relativo.
    
    Idea: slow marca dónde colocar el siguiente no-cero.
    Fast recorre buscando no-ceros para moverlos al frente.
    
    Complejidad: O(n) tiempo, O(1) espacio
    """
    slow = 0  # Posición para el siguiente no-cero
    
    for fast in range(len(nums)):
        if nums[fast] != 0:
            # Swap: mover el no-cero al frente
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1

# Ejemplo visual:
# [0, 1, 0, 3, 12]
#  s  f              → 1≠0, swap → [1, 0, 0, 3, 12], s=1
#     s     f        → 3≠0, swap → [1, 3, 0, 0, 12], s=2
#        s        f  → 12≠0, swap → [1, 3, 12, 0, 0], s=3 ✓'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="tp-q2",
                    question="En la técnica slow/fast para remover duplicados, ¿qué pasa cuando fast encuentra un elemento igual al que está en slow?",
                    options=[
                        "Se intercambian slow y fast",
                        "slow avanza una posición",
                        "fast simplemente avanza sin hacer nada más",
                        "Se elimina el elemento duplicado"
                    ],
                    correct_index=2,
                    explanation="Cuando fast encuentra un duplicado (nums[fast] == nums[slow]), simplemente fast avanza al siguiente elemento. Solo cuando fast encuentra un valor DIFERENTE es que slow avanza y se copia el valor. Los duplicados se 'ignoran' y quedan sobrescritos.",
                    difficulty="easy"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Variante 3: Valid Palindrome

Un palíndromo se lee igual de izquierda a derecha. Los punteros opuestos son perfectos: compara los extremos y ve cerrando hacia el centro.

### Truco para entrevistas
Siempre pregunta: "¿Debo ignorar mayúsculas y caracteres especiales?" La respuesta suele ser sí, y eso lo manejas con `isalnum()` y `lower()`."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Valid Palindrome - Ignorando caracteres no alfanuméricos
def is_palindrome(s: str) -> bool:
    """
    Verifica si un string es palíndromo.
    Ignora caracteres no alfanuméricos y mayúsculas.
    
    Complejidad: O(n) tiempo, O(1) espacio
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        # Saltar caracteres no alfanuméricos
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        
        # Comparar ignorando mayúsculas
        if s[left].lower() != s[right].lower():
            return False
        
        left += 1
        right -= 1
    
    return True

# "A man, a plan, a canal: Panama"
#  ↓ limpiamos: "amanaplanacanalpanama"
#  a...............a  → iguales ✓
#   m.............m   → iguales ✓
#    a...........a    → iguales ✓  ... hasta el centro'''
            ),
            ContentBlock(
                type="info",
                content="**Tip para entrevistas**: Two Pointers convierte muchos problemas O(n²) en O(n). Siempre pregunta si el array está ordenado — es una pista fuerte para usar esta técnica. Si no está ordenado, considera si ordenarlo primero vale la pena (O(n log n) sigue siendo mejor que O(n²))."
            ),
            ContentBlock(
                type="text",
                content="""## Errores Comunes (¡Evítalos!)

### 1. Off-by-one en la condición del while
```python
# ❌ INCORRECTO: left <= right puede causar que compares un elemento consigo mismo
while left <= right:

# ✅ CORRECTO: left < right asegura que siempre comparas DOS elementos distintos
while left < right:
```

### 2. Olvidar manejar el caso de array vacío
```python
# ❌ INCORRECTO: crashea con array vacío
left, right = 0, len(nums) - 1  # right = -1!

# ✅ CORRECTO: verificar primero
if len(nums) < 2:
    return default_value
```

### 3. No avanzar los punteros (loop infinito)
```python
# ❌ INCORRECTO: si no hay match, los punteros no se mueven
while left < right:
    if nums[left] + nums[right] == target:
        return [left, right]
    # ¿Y si no es igual? ¡Loop infinito!

# ✅ CORRECTO: siempre mover al menos un puntero
while left < right:
    if total == target: return [left, right]
    elif total < target: left += 1
    else: right -= 1
```"""
            ),
            ContentBlock(
                type="warning",
                content="**Cuidado con duplicados**: En problemas como 3Sum, debes saltar duplicados para evitar respuestas repetidas. Usa `while left < right and nums[left] == nums[left+1]: left += 1` después de encontrar una solución."
            ),
            ContentBlock(
                type="text",
                content="""## Complejidad: ¿Por qué Two Pointers es O(n)?

Muchos principiantes se confunden: "¿No hay un while dentro de otro while? ¿No es O(n²)?"

La clave es contar **cuántas veces se mueven los punteros en total**:
- `left` solo se mueve hacia la derecha (máximo n veces)
- `right` solo se mueve hacia la izquierda (máximo n veces)
- **Total de movimientos**: máximo 2n → O(n)

Cada elemento se visita como máximo una vez por cada puntero. No es como un doble for donde cada iteración exterior recorre todo el array interior."""
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="tp-q3",
                    question="¿Cuál es la complejidad temporal de Two Pointers en un array de tamaño n?",
                    options=[
                        "O(n²) porque hay un while dentro de lógica condicional",
                        "O(n log n) porque necesitamos ordenar primero",
                        "O(n) porque cada puntero recorre el array como máximo una vez",
                        "O(1) porque solo usamos dos variables"
                    ],
                    correct_index=2,
                    explanation="Correcto. Aunque parece que hay loops anidados, cada puntero se mueve como máximo n posiciones en total. El total de movimientos es 2n, que es O(n). La complejidad espacial es O(1) porque solo usamos dos variables de índice.",
                    difficulty="medium"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Resumen: Checklist de Two Pointers

Antes de implementar, responde:

1. **¿Qué tipo de punteros necesito?**
   - ¿Opuestos (extremos → centro)?
   - ¿Misma dirección (slow/fast)?
   - ¿Dos arrays (un puntero en cada uno)?

2. **¿Cuándo muevo cada puntero?**
   - Define claramente la condición para mover left, right, slow o fast

3. **¿Cuándo me detengo?**
   - `left < right` para opuestos
   - `fast < len(arr)` para mismo sentido

4. **¿Necesito el array ordenado?**
   - Si es punteros opuestos buscando sumas → sí
   - Si es slow/fast para filtrar → no necesariamente"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Container With Most Water",
                description="Encontrar el contenedor que almacena más agua. Punteros opuestos: empezamos con el ancho máximo y vamos reduciendo.",
                code='''def max_area(height: list[int]) -> int:
    """
    Encuentra las dos líneas que forman el contenedor con más agua.
    
    ¿Por qué funciona mover el puntero de menor altura?
    - El área = min(h[left], h[right]) × ancho
    - Al mover cualquier puntero, el ancho DISMINUYE
    - Si movemos el más alto, min() no puede mejorar
    - Si movemos el más bajo, min() PODRÍA mejorar
    
    Complejidad: O(n) tiempo, O(1) espacio
    """
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        # Calcular área actual
        width = right - left
        h = min(height[left], height[right])
        area = width * h
        max_water = max(max_water, area)
        
        # Mover el puntero con menor altura
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water

print(max_area([1,8,6,2,5,4,8,3,7]))  # 49''',
                language="python"
            ),
            CodeExample(
                title="3Sum - Encontrar tripletes que suman cero",
                description="Fija un número y usa Two Pointers para encontrar el par complementario. Clave: manejar duplicados.",
                code='''def three_sum(nums: list[int]) -> list[list[int]]:
    """
    Encuentra todos los tripletes únicos que suman 0.
    
    Estrategia:
    1. Ordenar el array (necesario para Two Pointers)
    2. Fijar nums[i] y buscar two_sum = -nums[i]
    3. Saltar duplicados en los 3 niveles
    
    Complejidad: O(n²) tiempo, O(1) espacio extra
    """
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Optimización: si el menor es > 0, no hay tripletes
        if nums[i] > 0:
            break
        
        # Saltar duplicados para i
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        # Two Pointers para el par restante
        left, right = i + 1, len(nums) - 1
        target = -nums[i]
        
        while left < right:
            total = nums[left] + nums[right]
            
            if total == target:
                result.append([nums[i], nums[left], nums[right]])
                # Saltar duplicados
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    
    return result

print(three_sum([-1, 0, 1, 2, -1, -4]))
# [[-1, -1, 2], [-1, 0, 1]]''',
                language="python"
            ),
            CodeExample(
                title="Sort Colors (Dutch National Flag)",
                description="Ordenar array con 3 valores usando 3 punteros. Una extensión elegante de Two Pointers.",
                code='''def sort_colors(nums: list[int]) -> None:
    """
    Ordena array con solo 0s, 1s, y 2s in-place.
    
    Tres punteros:
    - low: frontera de 0s (todo antes de low es 0)
    - mid: puntero actual
    - high: frontera de 2s (todo después de high es 2)
    
    Complejidad: O(n) tiempo, O(1) espacio - UNA sola pasada
    """
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1  # Ya está en su lugar
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1  # No avanzar mid! El swap puede traer un 0

# Ejemplo
arr = [2, 0, 2, 1, 1, 0]
sort_colors(arr)
print(arr)  # [0, 0, 1, 1, 2, 2]''',
                language="python"
            )
        ],
        quiz_questions=[
            QuizQuestion(
                id="tp-final-1",
                question="Tienes un array NO ordenado y necesitas encontrar dos números que sumen un target. ¿Qué approach es mejor?",
                options=[
                    "Two Pointers directamente - O(n)",
                    "Ordenar primero + Two Pointers - O(n log n)",
                    "Hash Map para buscar complementos - O(n)",
                    "Fuerza bruta con dos for loops - O(n²)"
                ],
                correct_index=2,
                explanation="Para array NO ordenado, Hash Map es O(n) en tiempo y espacio. Two Pointers necesitaría ordenar primero, dando O(n log n). Si el array ya estuviera ordenado, Two Pointers sería mejor porque usa O(1) espacio.",
                difficulty="medium"
            ),
            QuizQuestion(
                id="tp-final-2",
                question="En el problema Container With Most Water, ¿por qué movemos el puntero con menor altura?",
                options=[
                    "Porque el puntero menor siempre produce áreas más pequeñas",
                    "Porque al reducir el ancho, la única forma de mejorar es encontrar una altura mayor, y eso solo puede pasar si movemos el puntero más bajo",
                    "Porque el algoritmo funciona de forma aleatoria",
                    "Porque mover el más alto nunca cambia el resultado"
                ],
                correct_index=1,
                explanation="El área se calcula como min(h[L], h[R]) × ancho. Al mover cualquier puntero, el ancho DISMINUYE. Si movemos el puntero más alto, min() no puede aumentar (sigue limitada por el más bajo). Si movemos el más bajo, min() PODRÍA aumentar si encontramos una altura mayor. Es la única forma de posiblemente mejorar el área.",
                difficulty="hard"
            )
        ],
        prerequisites=["big-o-introduccion"],
        nextLessonId="sliding-window"
    ),
    
    Lesson(
        id="sliding-window",
        moduleId="arrays-strings",
        title="Técnica Sliding Window",
        description="Aprende a resolver problemas de subarrays y substrings con ventana deslizante.",
        order=2,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Imagina que miras por una ventana de tren. La ventana tiene un tamaño fijo y solo ves lo que está dentro. A medida que el tren avanza, la ventana se 'desliza': entra una cosa nueva por la derecha y sale una por la izquierda. En vez de recalcular todo lo que ves desde cero cada vez, solo actualizas lo que entró y lo que salió. Así, Sliding Window convierte problemas que parecen O(n²) en O(n): en vez de revisar todos los subarrays posibles, solo deslizas la ventana y actualizas.""",
        visual_diagram="""## Sliding Window: Ventana Deslizante

### Ventana de tamano fijo (k=3)

```
  Array: [ 2 ]  [ 1 ]  [ 5 ]  [ 1 ]  [ 3 ]  [ 2 ]
          ─────────────────
          ventana k=3        sum = 8
                  ─────────────────
                  ventana k=3        sum = 7
                          ─────────────────
                          ventana k=3        sum = 9  ← max!
```

---

### Ventana de tamano variable

```
  Target >= 7

  [ 2 ]  [ 3 ]  [ 1 ]  [ 2 ]  [ 4 ]  [ 3 ]
   L──────────────R                          sum=8 >= 7, contraer
          L───────R                          sum=6 < 7, expandir
          L──────────────R                   sum=10 >= 7, contraer
                  L──────R                   sum=7 >= 7, len=2 ← min!
```

---

### Cuando usar cada tipo

| Tipo | Senal en el problema | Ejemplo |
|------|---------------------|---------|
| **Fija** | "k elementos consecutivos" | Max sum de k consecutivos |
| **Variable** | "subarray mas corto/largo que..." | Min subarray con suma >= k |
| **Con hash** | "substring sin repetir" | Longest substring sin duplicados |
""",
        content=[
            ContentBlock(
                type="text",
                content="""# Sliding Window: Ventana Deslizante

La técnica de ventana deslizante optimiza problemas que involucran subarrays o substrings contiguos.

## Cuándo usar Sliding Window

- Problemas de subarrays/substrings contiguos
- Máximo/mínimo de suma, longitud, etc.
- Conteo de elementos que cumplen condición
- Problemas con "k elementos consecutivos"

## Tipos de Ventana

1. **Tamaño fijo**: La ventana siempre tiene k elementos
2. **Tamaño variable**: La ventana crece/decrece según condiciones"""
            ),
            ContentBlock(
                type="text",
                content="""## Patrón de Ventana Fija

```python
def fixed_window(arr, k):
    # 1. Calcular primera ventana
    window_sum = sum(arr[:k])
    result = window_sum
    
    # 2. Deslizar: agregar derecha, quitar izquierda
    for i in range(k, len(arr)):
        window_sum += arr[i]      # Agregar nuevo elemento
        window_sum -= arr[i - k]  # Quitar elemento viejo
        result = max(result, window_sum)
    
    return result
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Ejemplo: Máxima suma de k elementos consecutivos
def max_sum_subarray(nums, k):
    if len(nums) < k:
        return 0
    
    # Primera ventana
    window_sum = sum(nums[:k])
    max_sum = window_sum
    
    # Deslizar ventana
    for i in range(k, len(nums)):
        window_sum += nums[i] - nums[i - k]
        max_sum = max(max_sum, window_sum)
    
    return max_sum

# Ejemplo
print(max_sum_subarray([2, 1, 5, 1, 3, 2], 3))  # 9 (5+1+3)'''
            ),
            ContentBlock(
                type="text",
                content="""## Patrón de Ventana Variable

```python
def variable_window(arr, target):
    left = 0
    current = 0
    result = float('inf')
    
    for right in range(len(arr)):
        # Expandir: agregar elemento derecho
        current += arr[right]
        
        # Contraer: mientras se cumpla condición
        while condicion_se_cumple:
            result = min(result, right - left + 1)
            current -= arr[left]
            left += 1
    
    return result
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Ejemplo: Subarray mínimo con suma >= target
def min_subarray_len(target, nums):
    left = 0
    current_sum = 0
    min_len = float('inf')
    
    for right in range(len(nums)):
        current_sum += nums[right]
        
        while current_sum >= target:
            min_len = min(min_len, right - left + 1)
            current_sum -= nums[left]
            left += 1
    
    return min_len if min_len != float('inf') else 0

# Ejemplo
print(min_subarray_len(7, [2, 3, 1, 2, 4, 3]))  # 2 (4+3)'''
            ),
            ContentBlock(
                type="info",
                content="**Clave del Sliding Window**: Mantienes información de la ventana actual y la actualizas incrementalmente al deslizar, evitando recalcular todo desde cero."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Longest Substring Without Repeating",
                description="Substring más largo sin caracteres repetidos",
                code='''def length_of_longest_substring(s):
    char_index = {}  # Último índice de cada caracter
    max_len = 0
    left = 0
    
    for right, char in enumerate(s):
        # Si el caracter ya existe en la ventana
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_len = max(max_len, right - left + 1)
    
    return max_len

print(length_of_longest_substring("abcabcbb"))  # 3 ("abc")
print(length_of_longest_substring("pwwkew"))    # 3 ("wke")''',
                language="python"
            ),
            CodeExample(
                title="Find All Anagrams",
                description="Encontrar todas las posiciones de anagramas de p en s",
                code='''from collections import Counter

def find_anagrams(s, p):
    if len(p) > len(s):
        return []
    
    p_count = Counter(p)
    window_count = Counter(s[:len(p)])
    result = []
    
    if window_count == p_count:
        result.append(0)
    
    for i in range(len(p), len(s)):
        # Agregar nuevo caracter
        window_count[s[i]] += 1
        
        # Remover caracter viejo
        old_char = s[i - len(p)]
        window_count[old_char] -= 1
        if window_count[old_char] == 0:
            del window_count[old_char]
        
        if window_count == p_count:
            result.append(i - len(p) + 1)
    
    return result

print(find_anagrams("cbaebabacd", "abc"))  # [0, 6]''',
                language="python"
            )
        ],
        prerequisites=["two-pointers"],
        nextLessonId="prefix-sum"
    ),
    
    Lesson(
        id="prefix-sum",
        moduleId="arrays-strings",
        title="Técnica Prefix Sum",
        description="Calcula sumas de rangos en O(1) usando sumas acumuladas.",
        order=3,
        difficulty=Difficulty.EASY,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Prefix Sum (Suma de Prefijos)

La técnica de prefix sum permite calcular la suma de cualquier rango en O(1) después de un preprocesamiento O(n).

## Idea Principal

Guardamos la suma acumulada hasta cada índice:
```
arr    = [1, 2, 3, 4, 5]
prefix = [1, 3, 6, 10, 15]
```

Suma de rango [i, j] = prefix[j] - prefix[i-1]"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Construir prefix sum
def build_prefix_sum(arr):
    prefix = [0] * (len(arr) + 1)
    for i in range(len(arr)):
        prefix[i + 1] = prefix[i] + arr[i]
    return prefix

# Consultar suma de rango [left, right]
def range_sum(prefix, left, right):
    return prefix[right + 1] - prefix[left]

# Ejemplo
arr = [1, 2, 3, 4, 5]
prefix = build_prefix_sum(arr)
print(prefix)  # [0, 1, 3, 6, 10, 15]

print(range_sum(prefix, 1, 3))  # 2+3+4 = 9
print(range_sum(prefix, 0, 4))  # 1+2+3+4+5 = 15'''
            ),
            ContentBlock(
                type="info",
                content="**Tip**: Usa prefix[0] = 0 para evitar casos especiales cuando left = 0."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Subarray Sum Equals K",
                description="Contar subarrays que suman k",
                code='''from collections import defaultdict

def subarray_sum(nums, k):
    count = 0
    prefix_sum = 0
    seen = defaultdict(int)
    seen[0] = 1  # Suma 0 aparece una vez (antes del array)
    
    for num in nums:
        prefix_sum += num
        # Si prefix_sum - k existe, encontramos subarrays
        count += seen[prefix_sum - k]
        seen[prefix_sum] += 1
    
    return count

print(subarray_sum([1, 1, 1], 2))  # 2: [1,1] y [1,1]
print(subarray_sum([1, 2, 3], 3))  # 2: [1,2] y [3]''',
                language="python"
            )
        ],
        prerequisites=["sliding-window"],
        nextLessonId="string-manipulation"
    ),
    
    Lesson(
        id="string-manipulation",
        moduleId="arrays-strings",
        title="Manipulación de Strings",
        description="Técnicas esenciales para resolver problemas de strings en entrevistas.",
        order=4,
        difficulty=Difficulty.EASY,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Manipulación de Strings

Los strings son inmutables en Python. Cada modificación crea un nuevo string.

## Técnicas Clave

1. **Convertir a lista** para modificar in-place
2. **Usar join** para concatenar eficientemente
3. **Counter** para frecuencias
4. **Two pointers** para palíndromos"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# MAL: Concatenación O(n^2)
result = ""
for char in "hello":
    result += char  # Crea nuevo string cada vez

# BIEN: Usar lista y join O(n)
chars = []
for char in "hello":
    chars.append(char.upper())
result = "".join(chars)

# Reverse string in-place
def reverse_string(s):
    s = list(s)
    left, right = 0, len(s) - 1
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1
    return "".join(s)

print(reverse_string("hello"))  # "olleh"'''
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Verificar palíndromo
def is_palindrome(s):
    s = s.lower()
    s = ''.join(c for c in s if c.isalnum())
    return s == s[::-1]

# Con two pointers (más eficiente en espacio)
def is_palindrome_tp(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("A man, a plan, a canal: Panama"))  # True'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Valid Anagram",
                description="Verificar si dos strings son anagramas",
                code='''from collections import Counter

def is_anagram(s, t):
    return Counter(s) == Counter(t)

# O manualmente
def is_anagram_manual(s, t):
    if len(s) != len(t):
        return False
    
    count = {}
    for c in s:
        count[c] = count.get(c, 0) + 1
    for c in t:
        count[c] = count.get(c, 0) - 1
        if count[c] < 0:
            return False
    return True

print(is_anagram("anagram", "nagaram"))  # True
print(is_anagram("rat", "car"))          # False''',
                language="python"
            )
        ],
        prerequisites=["prefix-sum"],
        nextLessonId="in-place-operations"
    ),
    
    Lesson(
        id="in-place-operations",
        moduleId="arrays-strings",
        title="Operaciones In-Place",
        description="Modifica arrays sin usar espacio adicional.",
        order=5,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Operaciones In-Place

Modificar un array "in-place" significa usar O(1) espacio extra (sin crear nuevos arrays).

## Técnicas Comunes

1. **Swap elements**: Intercambiar posiciones
2. **Two pointers**: slow/fast para reorganizar
3. **Reverse sections**: Invertir partes del array
4. **Cyclic sort**: Para arrays con valores 1 a n"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Move Zeros - mover ceros al final
def move_zeroes(nums):
    slow = 0  # Posición para el próximo no-cero
    
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow], nums[fast] = nums[fast], nums[slow]
            slow += 1

arr = [0, 1, 0, 3, 12]
move_zeroes(arr)
print(arr)  # [1, 3, 12, 0, 0]

# Rotate Array
def rotate(nums, k):
    n = len(nums)
    k = k % n
    
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)
    reverse(0, k - 1)
    reverse(k, n - 1)

arr = [1, 2, 3, 4, 5, 6, 7]
rotate(arr, 3)
print(arr)  # [5, 6, 7, 1, 2, 3, 4]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Sort Colors (Dutch National Flag)",
                description="Ordenar array con solo 0s, 1s y 2s",
                code='''def sort_colors(nums):
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1

arr = [2, 0, 2, 1, 1, 0]
sort_colors(arr)
print(arr)  # [0, 0, 1, 1, 2, 2]''',
                language="python"
            )
        ],
        prerequisites=["string-manipulation"],
        nextLessonId="subarray-problems"
    ),
    
    Lesson(
        id="subarray-problems",
        moduleId="arrays-strings",
        title="Problemas de Subarrays",
        description="Patrones comunes para resolver problemas de subarrays contiguos.",
        order=6,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas de Subarrays

Un subarray es una porción contigua de un array.

## Patrones Principales

1. **Sliding Window**: Para subarrays con condición de suma/longitud
2. **Prefix Sum**: Para consultas de rangos
3. **Kadane's Algorithm**: Para máximo subarray
4. **Two Pointers**: Para subarrays ordenados"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Maximum Subarray - Kadane's Algorithm
def max_subarray(nums):
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum

print(max_subarray([-2, 1, -3, 4, -1, 2, 1, -5, 4]))  # 6

# Product of Array Except Self
def product_except_self(nums):
    n = len(nums)
    result = [1] * n
    
    # Productos de la izquierda
    left = 1
    for i in range(n):
        result[i] = left
        left *= nums[i]
    
    # Productos de la derecha
    right = 1
    for i in range(n - 1, -1, -1):
        result[i] *= right
        right *= nums[i]
    
    return result

print(product_except_self([1, 2, 3, 4]))  # [24, 12, 8, 6]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Maximum Product Subarray",
                description="Encontrar el producto máximo de un subarray",
                code='''def max_product(nums):
    max_prod = min_prod = result = nums[0]
    
    for num in nums[1:]:
        if num < 0:
            max_prod, min_prod = min_prod, max_prod
        
        max_prod = max(num, max_prod * num)
        min_prod = min(num, min_prod * num)
        result = max(result, max_prod)
    
    return result

print(max_product([2, 3, -2, 4]))   # 6
print(max_product([-2, 0, -1]))    # 0
print(max_product([-2, 3, -4]))    # 24''',
                language="python"
            )
        ],
        prerequisites=["in-place-operations"],
        nextLessonId="palindromes-anagrams"
    ),
    
    Lesson(
        id="palindromes-anagrams",
        moduleId="arrays-strings",
        title="Palíndromos y Anagramas",
        description="Técnicas para detectar y manipular palíndromos y anagramas.",
        order=7,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Palíndromos y Anagramas

Dos tipos de problemas muy comunes en entrevistas que involucran strings."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Valid Palindrome
def is_palindrome(s):
    s = ''.join(c.lower() for c in s if c.isalnum())
    return s == s[::-1]

# Con two pointers (más eficiente en espacio)
def is_palindrome_two_pointers(s):
    left, right = 0, len(s) - 1
    while left < right:
        while left < right and not s[left].isalnum():
            left += 1
        while left < right and not s[right].isalnum():
            right -= 1
        if s[left].lower() != s[right].lower():
            return False
        left += 1
        right -= 1
    return True

# Valid Anagram
def is_anagram(s, t):
    if len(s) != len(t):
        return False
    return sorted(s) == sorted(t)

# O(n) con counter
from collections import Counter
def is_anagram_counter(s, t):
    return Counter(s) == Counter(t)

print(is_palindrome("A man, a plan, a canal: Panama"))  # True
print(is_anagram("anagram", "nagaram"))  # True'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Longest Palindromic Substring",
                description="Encontrar el substring palindrómico más largo",
                code='''def longest_palindrome(s):
    if len(s) < 2:
        return s
    
    def expand_around_center(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left + 1:right]
    
    result = ""
    for i in range(len(s)):
        # Odd length palindrome
        odd = expand_around_center(i, i)
        if len(odd) > len(result):
            result = odd
        
        # Even length palindrome
        even = expand_around_center(i, i + 1)
        if len(even) > len(result):
            result = even
    
    return result

print(longest_palindrome("babad"))  # "bab" or "aba"''',
                language="python"
            )
        ],
        prerequisites=["subarray-problems"],
        nextLessonId="matrix-traversal"
    ),
    
    Lesson(
        id="matrix-traversal",
        moduleId="arrays-strings",
        title="Recorrido de Matrices",
        description="Técnicas para recorrer y manipular matrices 2D.",
        order=8,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Recorrido de Matrices

Las matrices 2D son arrays de arrays y requieren técnicas especiales."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Recorrido en espiral
def spiral_order(matrix):
    if not matrix:
        return []
    
    result = []
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Derecha
        for col in range(left, right + 1):
            result.append(matrix[top][col])
        top += 1
        
        # Abajo
        for row in range(top, bottom + 1):
            result.append(matrix[row][right])
        right -= 1
        
        if top <= bottom:
            # Izquierda
            for col in range(right, left - 1, -1):
                result.append(matrix[bottom][col])
            bottom -= 1
        
        if left <= right:
            # Arriba
            for row in range(bottom, top - 1, -1):
                result.append(matrix[row][left])
            left += 1
    
    return result

# Rotar matriz 90 grados
def rotate(matrix):
    n = len(matrix)
    # Transponer
    for i in range(n):
        for j in range(i, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Invertir cada fila
    for row in matrix:
        row.reverse()'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Set Matrix Zeroes",
                description="Si un elemento es 0, poner su fila y columna en 0",
                code='''def set_zeroes(matrix):
    m, n = len(matrix), len(matrix[0])
    first_row_zero = any(matrix[0][j] == 0 for j in range(n))
    first_col_zero = any(matrix[i][0] == 0 for i in range(m))
    
    # Usar primera fila/columna como marcadores
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][j] == 0:
                matrix[i][0] = 0
                matrix[0][j] = 0
    
    # Aplicar ceros
    for i in range(1, m):
        for j in range(1, n):
            if matrix[i][0] == 0 or matrix[0][j] == 0:
                matrix[i][j] = 0
    
    # Primera fila y columna
    if first_row_zero:
        for j in range(n):
            matrix[0][j] = 0
    if first_col_zero:
        for i in range(m):
            matrix[i][0] = 0''',
                language="python"
            )
        ],
        prerequisites=["palindromes-anagrams"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Bit Manipulation ===
    Lesson(
        id="bit-operadores-basicos",
        moduleId="bit-manipulation",
        title="Operadores Bitwise Básicos",
        description="Domina los operadores AND, OR, XOR, NOT y shifts para manipular bits.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Operadores Bitwise Básicos

La manipulación de bits es una técnica poderosa para resolver ciertos problemas de manera muy eficiente.

## Los Operadores Básicos

| Operador | Símbolo | Descripción |
|----------|---------|-------------|
| AND | & | 1 si ambos bits son 1 |
| OR | | | 1 si al menos un bit es 1 |
| XOR | ^ | 1 si los bits son diferentes |
| NOT | ~ | Invierte todos los bits |
| Left Shift | << | Desplaza bits a la izquierda |
| Right Shift | >> | Desplaza bits a la derecha |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Ejemplos de cada operador
a = 5   # 0101 en binario
b = 3   # 0011 en binario

# AND - ambos deben ser 1
print(a & b)    # 1 (0001)

# OR - al menos uno debe ser 1
print(a | b)    # 7 (0111)

# XOR - deben ser diferentes
print(a ^ b)    # 6 (0110)

# NOT - invierte (complemento a dos)
print(~a)       # -6

# Left shift - multiplica por 2^n
print(a << 1)   # 10 (1010) = 5 * 2
print(a << 2)   # 20 (10100) = 5 * 4

# Right shift - divide por 2^n
print(a >> 1)   # 2 (0010) = 5 // 2'''
            ),
            ContentBlock(
                type="text",
                content="""## Propiedades Importantes de XOR

```python
# XOR tiene propiedades muy útiles:
a ^ 0 = a        # XOR con 0 no cambia nada
a ^ a = 0        # XOR consigo mismo es 0
a ^ b ^ a = b    # Se puede "cancelar"

# Esto es clave para problemas como "Single Number"
```"""
            ),
            ContentBlock(
                type="info",
                content="**Tip**: XOR es tu mejor amigo en manipulación de bits. `a ^ a = 0` te permite encontrar elementos únicos en arrays."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Single Number",
                description="Encontrar el único elemento que aparece una vez",
                code='''def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# [2, 1, 2, 3, 3] -> 2^1^2^3^3 -> (2^2)^(3^3)^1 -> 0^0^1 -> 1
print(single_number([2, 1, 2, 3, 3]))  # 1''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="bit-trucos-comunes"
    ),
    
    Lesson(
        id="bit-trucos-comunes",
        moduleId="bit-manipulation",
        title="Trucos Comunes de Bits",
        description="Técnicas esenciales para manipular bits individuales y resolver problemas clásicos.",
        order=2,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Trucos Comunes de Bits

Estas técnicas aparecen frecuentemente en entrevistas y permiten soluciones elegantes.

## Operaciones Básicas con Bits

```python
# Verificar si el bit i está encendido
def get_bit(n, i):
    return (n >> i) & 1

# Encender el bit i
def set_bit(n, i):
    return n | (1 << i)

# Apagar el bit i
def clear_bit(n, i):
    return n & ~(1 << i)

# Toggle el bit i
def toggle_bit(n, i):
    return n ^ (1 << i)
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Verificar si es potencia de 2
def is_power_of_two(n):
    return n > 0 and (n & (n - 1)) == 0

# Explicación: potencias de 2 tienen solo un bit en 1
# 8 = 1000, 7 = 0111 -> 8 & 7 = 0000 = 0

print(is_power_of_two(16))  # True (10000)
print(is_power_of_two(18))  # False (10010)

# Contar bits en 1 (population count)
def count_ones(n):
    count = 0
    while n:
        count += n & 1
        n >>= 1
    return count

# Método más eficiente
def count_ones_fast(n):
    count = 0
    while n:
        n &= (n - 1)  # Elimina el bit 1 más bajo
        count += 1
    return count

print(count_ones(7))  # 3 (111)'''
            ),
            ContentBlock(
                type="info",
                content="**Truco clave**: `n & (n-1)` elimina el bit 1 más bajo. Es útil para contar bits y verificar potencias de 2."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Subsets usando Bits",
                description="Generar todos los subconjuntos usando máscaras de bits",
                code='''def subsets(nums):
    n = len(nums)
    result = []
    
    # 2^n subsets posibles
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    
    return result

print(subsets([1, 2, 3]))
# [[], [1], [2], [1,2], [3], [1,3], [2,3], [1,2,3]]''',
                language="python"
            )
        ],
        prerequisites=["bit-operadores-basicos"],
        nextLessonId="bit-problemas-clasicos"
    ),
    
    Lesson(
        id="bit-problemas-clasicos",
        moduleId="bit-manipulation",
        title="Problemas Clásicos de Bits",
        description="Resuelve los problemas de bit manipulation más frecuentes en entrevistas FAANG.",
        order=3,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Clásicos de Bit Manipulation

Estos problemas son favoritos en entrevistas técnicas por sus soluciones elegantes.

## 1. Reverse Bits

Invertir el orden de los bits de un número de 32 bits."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''def reverse_bits(n):
    result = 0
    for i in range(32):
        # Obtener bit actual
        bit = (n >> i) & 1
        # Colocarlo en posición inversa
        result |= bit << (31 - i)
    return result

# Ejemplo: 00000010100101000001111010011100
# Resultado: 00111001011110000010100101000000
print(bin(reverse_bits(43261596)))'''
            ),
            ContentBlock(
                type="text",
                content="""## 2. Missing Number

Encontrar el número faltante en un array de 0 a n."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''def missing_number(nums):
    n = len(nums)
    result = n  # Empezar con n
    
    for i, num in enumerate(nums):
        result ^= i ^ num
    
    return result

# Si tenemos [0,1,3] (falta 2):
# result = 3 ^ (0^0) ^ (1^1) ^ (2^3)
#        = 3 ^ 0 ^ 0 ^ 1
#        = 2

print(missing_number([0, 1, 3]))  # 2'''
            ),
            ContentBlock(
                type="text",
                content="""## 3. Hamming Distance

Contar bits diferentes entre dos números."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''def hamming_distance(x, y):
    xor = x ^ y  # Bits diferentes = 1
    count = 0
    while xor:
        count += xor & 1
        xor >>= 1
    return count

# 1 = 0001, 4 = 0100 -> XOR = 0101 -> 2 bits diferentes
print(hamming_distance(1, 4))  # 2'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="UTF-8 Validation",
                description="Validar si un array de enteros es una codificación UTF-8 válida",
                code='''def valid_utf8(data):
    bytes_remaining = 0
    
    for byte in data:
        # Solo considerar los últimos 8 bits
        byte = byte & 0xFF
        
        if bytes_remaining == 0:
            # Determinar cuántos bytes tiene este caracter
            if (byte >> 7) == 0:
                continue  # 1 byte
            elif (byte >> 5) == 0b110:
                bytes_remaining = 1
            elif (byte >> 4) == 0b1110:
                bytes_remaining = 2
            elif (byte >> 3) == 0b11110:
                bytes_remaining = 3
            else:
                return False
        else:
            # Debe empezar con 10xxxxxx
            if (byte >> 6) != 0b10:
                return False
            bytes_remaining -= 1
    
    return bytes_remaining == 0

# Pruebas
print(valid_utf8([197, 130, 1]))  # True
print(valid_utf8([235, 140, 4]))  # False''',
                language="python"
            )
        ],
        prerequisites=["bit-trucos-comunes"],
        nextLessonId="bit-xor-applications"
    ),
    
    Lesson(
        id="bit-xor-applications",
        moduleId="bit-manipulation",
        title="Aplicaciones de XOR",
        description="Domina las propiedades únicas de XOR para resolver problemas elegantemente.",
        order=4,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Aplicaciones de XOR

XOR tiene propiedades matemáticas únicas que lo hacen perfecto para ciertos problemas.

## Propiedades de XOR
- `a ^ 0 = a` (identidad)
- `a ^ a = 0` (auto-inverso)
- `a ^ b ^ a = b` (cancelación)
- Conmutativo y asociativo"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Single Number - encontrar el único elemento sin par
def single_number(nums):
    result = 0
    for num in nums:
        result ^= num
    return result

# [4, 1, 2, 1, 2] -> 4^1^2^1^2 = 4^(1^1)^(2^2) = 4^0^0 = 4
print(single_number([4, 1, 2, 1, 2]))  # 4

# Swap sin variable temporal
def swap(a, b):
    a = a ^ b
    b = a ^ b  # b = (a^b)^b = a
    a = a ^ b  # a = (a^b)^a = b
    return a, b

print(swap(5, 3))  # (3, 5)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Find Two Single Numbers",
                description="Encontrar dos números que aparecen solo una vez",
                code='''def single_number_iii(nums):
    # XOR de todos da xor de los dos únicos
    xor_all = 0
    for num in nums:
        xor_all ^= num
    
    # Encontrar bit diferente (rightmost set bit)
    diff_bit = xor_all & (-xor_all)
    
    # Separar en dos grupos
    a, b = 0, 0
    for num in nums:
        if num & diff_bit:
            a ^= num
        else:
            b ^= num
    
    return [a, b]

print(single_number_iii([1, 2, 1, 3, 2, 5]))  # [3, 5]''',
                language="python"
            )
        ],
        prerequisites=["bit-problemas-clasicos"],
        nextLessonId="bit-masks"
    ),
    
    Lesson(
        id="bit-masks",
        moduleId="bit-manipulation",
        title="Máscaras de Bits",
        description="Usa máscaras para manipular conjuntos de bits eficientemente.",
        order=5,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Máscaras de Bits

Las máscaras permiten seleccionar, establecer o limpiar grupos específicos de bits.

## Máscaras Comunes
- `(1 << n) - 1`: n bits en 1 (ej: n=3 -> 0111)
- `~((1 << n) - 1)`: n bits bajos en 0
- `1 << i`: solo bit i en 1"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Extraer los n bits más bajos
def get_low_bits(num, n):
    mask = (1 << n) - 1
    return num & mask

print(bin(get_low_bits(0b11010110, 4)))  # 0b0110

# Limpiar los n bits más bajos
def clear_low_bits(num, n):
    mask = ~((1 << n) - 1)
    return num & mask

print(bin(clear_low_bits(0b11010110, 4)))  # 0b11010000

# Representar conjuntos con bits
def subsets_bitmask(nums):
    n = len(nums)
    result = []
    for mask in range(1 << n):
        subset = []
        for i in range(n):
            if mask & (1 << i):
                subset.append(nums[i])
        result.append(subset)
    return result

print(subsets_bitmask([1, 2, 3]))'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Counting Bits",
                description="Contar bits en 1 para todos los números de 0 a n",
                code='''def count_bits(n):
    result = [0] * (n + 1)
    for i in range(1, n + 1):
        # i >> 1 tiene un bit menos, + bit actual
        result[i] = result[i >> 1] + (i & 1)
    return result

print(count_bits(5))  # [0, 1, 1, 2, 1, 2]''',
                language="python"
            )
        ],
        prerequisites=["bit-xor-applications"],
        nextLessonId="bit-advanced"
    ),
    
    Lesson(
        id="bit-advanced",
        moduleId="bit-manipulation",
        title="Técnicas Avanzadas de Bits",
        description="Técnicas avanzadas para optimización y problemas complejos.",
        order=6,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Técnicas Avanzadas de Bits

Técnicas más sofisticadas para problemas complejos de bit manipulation."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Bit manipulation para rangos
def range_bitwise_and(left, right):
    """AND de todos los números en [left, right]"""
    shift = 0
    while left < right:
        left >>= 1
        right >>= 1
        shift += 1
    return left << shift

print(range_bitwise_and(5, 7))  # 4 (100 & 101 & 110 & 111 = 100)

# Encontrar el bit más significativo
def highest_bit(n):
    if n == 0:
        return 0
    msb = 0
    while n > 0:
        n >>= 1
        msb += 1
    return 1 << (msb - 1)

print(bin(highest_bit(12)))  # 0b1000'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Maximum XOR of Two Numbers",
                description="Encontrar el máximo XOR posible entre dos números",
                code='''def find_maximum_xor(nums):
    max_xor = 0
    mask = 0
    
    for i in range(31, -1, -1):
        mask |= (1 << i)
        prefixes = set(num & mask for num in nums)
        
        # Intentar si podemos tener un 1 en esta posición
        candidate = max_xor | (1 << i)
        
        for prefix in prefixes:
            if prefix ^ candidate in prefixes:
                max_xor = candidate
                break
    
    return max_xor

print(find_maximum_xor([3, 10, 5, 25, 2, 8]))  # 28''',
                language="python"
            )
        ],
        prerequisites=["bit-masks"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Hash Tables ===
    Lesson(
        id="hash-tables-fundamentos",
        moduleId="hash-tables",
        title="Fundamentos de Hash Tables",
        description="Aprende cómo funcionan las tablas hash y sus aplicaciones.",
        order=1,
        difficulty=Difficulty.EASY,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Fundamentos de Hash Tables

Las hash tables (diccionarios en Python) ofrecen operaciones O(1) promedio para inserción, búsqueda y eliminación.

## Cómo funcionan

1. Una función hash convierte la clave en un índice
2. El valor se almacena en ese índice del array interno
3. Las colisiones se manejan con chaining o open addressing"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Implementación simple de Hash Table
class HashTable:
    def __init__(self, size=10):
        self.size = size
        self.table = [[] for _ in range(size)]
    
    def _hash(self, key):
        return hash(key) % self.size
    
    def put(self, key, value):
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                pair[1] = value
                return
        self.table[index].append([key, value])
    
    def get(self, key):
        index = self._hash(key)
        for pair in self.table[index]:
            if pair[0] == key:
                return pair[1]
        return None

# Uso
ht = HashTable()
ht.put("nombre", "Ana")
print(ht.get("nombre"))  # Ana'''
            ),
            ContentBlock(
                type="info",
                content="**Complejidades**: Promedio O(1) para get/put/delete. Peor caso O(n) cuando hay muchas colisiones."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Two Sum con Hash Map",
                description="El problema clásico que demuestra el poder de hash tables",
                code='''def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

print(two_sum([2, 7, 11, 15], 9))  # [0, 1]''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="hash-tables-problemas"
    ),
    
    Lesson(
        id="hash-tables-problemas",
        moduleId="hash-tables",
        title="Aplicaciones de Hash Tables",
        description="Patrones comunes: frequency counter, caching, deduplicación.",
        order=2,
        difficulty=Difficulty.EASY,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Aplicaciones de Hash Tables

## Patrones Comunes

1. **Frequency Counter**: Contar ocurrencias
2. **Lookup Table**: Búsqueda rápida
3. **Caching/Memoization**: Guardar resultados
4. **Deduplicación**: Eliminar duplicados"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import Counter, defaultdict

# Frequency Counter
def is_anagram(s1, s2):
    return Counter(s1) == Counter(s2)

# Group by key
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())

# Memoization
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

print(fib_memo(100))  # Instantáneo gracias al cache'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="LRU Cache",
                description="Implementación de Least Recently Used cache",
                code='''from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.cache = OrderedDict()
        self.capacity = capacity
    
    def get(self, key):
        if key not in self.cache:
            return -1
        self.cache.move_to_end(key)
        return self.cache[key]
    
    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)''',
                language="python"
            )
        ],
        prerequisites=["hash-tables-fundamentos"],
        nextLessonId="hash-counting"
    ),
    
    Lesson(
        id="hash-counting",
        moduleId="hash-tables",
        title="Patrones de Conteo con Hash",
        description="Usa hash maps para contar frecuencias, agrupar elementos y resolver problemas de conteo.",
        order=3,
        difficulty=Difficulty.EASY,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Patrones de Conteo con Hash Maps

## ¿Por qué contar frecuencias?

Contar cuántas veces aparece cada elemento es uno de los patrones más comunes en entrevistas. Aparece en problemas de:
- **Anagramas**: ¿Tienen las mismas letras con la misma frecuencia?
- **Mayoría**: ¿Qué elemento aparece más de n/2 veces?
- **Top K**: ¿Cuáles son los k elementos más frecuentes?
- **Duplicados**: ¿Hay algún elemento repetido?

## Herramientas de Python

Python tiene herramientas increíbles para conteo:

```python
from collections import Counter, defaultdict

# Counter: crea un diccionario de frecuencias automáticamente
Counter("banana")  # Counter({'a': 3, 'n': 2, 'b': 1})

# defaultdict: diccionario con valor por defecto
d = defaultdict(list)  # Si la key no existe, crea una lista vacía
d["fruits"].append("apple")  # No necesitas verificar si existe
```

## El Patrón Frequency Counter

```python
# Patrón manual (sin Counter)
freq = {}
for item in collection:
    freq[item] = freq.get(item, 0) + 1

# Patrón con Counter (más Pythónico)
freq = Counter(collection)
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import Counter, defaultdict

# ========================================
# Patrón 1: Comparar Frecuencias
# ========================================

# Valid Anagram: ¿Dos strings tienen las mismas letras?
def is_anagram(s, t):
    return Counter(s) == Counter(t)

print(is_anagram("anagram", "nagaram"))  # True
print(is_anagram("rat", "car"))          # False

# ========================================
# Patrón 2: Agrupar por Clave
# ========================================

# Group Anagrams: Agrupar palabras que son anagramas entre sí
def group_anagrams(strs):
    groups = defaultdict(list)
    for s in strs:
        # Clave: letras ordenadas (anagramas tienen la misma clave)
        key = tuple(sorted(s))
        groups[key].append(s)
    return list(groups.values())

print(group_anagrams(["eat","tea","tan","ate","nat","bat"]))
# [["eat","tea","ate"], ["tan","nat"], ["bat"]]

# ========================================
# Patrón 3: Encontrar el Más Frecuente
# ========================================

# Majority Element: Elemento que aparece más de n/2 veces
def majority_element(nums):
    count = Counter(nums)
    return count.most_common(1)[0][0]

# Top K Frequent: Los k elementos más frecuentes
def top_k_frequent(nums, k):
    count = Counter(nums)
    return [x for x, _ in count.most_common(k)]

print(top_k_frequent([1,1,1,2,2,3], 2))  # [1, 2]'''
            ),
            ContentBlock(
                type="text",
                content="""## Patrón Avanzado: Bucket Sort con Frecuencias

Para "Top K Frequent Elements", hay una solución O(n) usando **bucket sort**:
1. Contamos frecuencias
2. Creamos buckets donde el índice = frecuencia
3. Recorremos los buckets de mayor a menor

Esto es más eficiente que ordenar (O(n log n))."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Top K con Bucket Sort - O(n)
def top_k_frequent_optimal(nums, k):
    count = Counter(nums)
    
    # Crear buckets: bucket[i] = elementos con frecuencia i
    buckets = [[] for _ in range(len(nums) + 1)]
    for num, freq in count.items():
        buckets[freq].append(num)
    
    # Recorrer de mayor frecuencia a menor
    result = []
    for freq in range(len(buckets) - 1, 0, -1):
        for num in buckets[freq]:
            result.append(num)
            if len(result) == k:
                return result
    
    return result

# Ransom Note: ¿Puedo formar la nota con las letras del magazine?
def can_construct(ransom_note, magazine):
    mag_count = Counter(magazine)
    for char in ransom_note:
        if mag_count[char] <= 0:
            return False
        mag_count[char] -= 1
    return True

print(can_construct("aa", "aab"))  # True
print(can_construct("aa", "ab"))   # False'''
            ),
            ContentBlock(
                type="text",
                content="""## Resumen de Complejidad

| Operación | Tiempo |
|-----------|--------|
| Contar frecuencias | O(n) |
| Comparar dos Counter | O(n) |
| most_common(k) | O(n log k) |
| Bucket sort approach | O(n) |

## Tips para Entrevistas
- `Counter` es tu mejor amigo para problemas de frecuencia
- `defaultdict(list)` para agrupar sin verificar existencia
- Si te piden "top k", piensa en bucket sort para O(n)"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="First Unique Character",
                description="Encontrar el primer carácter que no se repite",
                code='''def first_uniq_char(s):
    count = Counter(s)
    for i, char in enumerate(s):
        if count[char] == 1:
            return i
    return -1

print(first_uniq_char("leetcode"))    # 0 (la 'l')
print(first_uniq_char("loveleetcode"))  # 2 (la 'v')''',
                language="python"
            ),
            CodeExample(
                title="Minimum Window Substring",
                description="Menor substring que contiene todas las letras de t",
                code='''def min_window(s, t):
    need = Counter(t)
    missing = len(t)
    left = start = end = 0
    
    for right, char in enumerate(s, 1):
        if need[char] > 0:
            missing -= 1
        need[char] -= 1
        
        if missing == 0:
            # Contraer ventana
            while need[s[left]] < 0:
                need[s[left]] += 1
                left += 1
            # Actualizar resultado
            if not end or right - left <= end - start:
                start, end = left, right
            need[s[left]] += 1
            missing += 1
            left += 1
    
    return s[start:end]''',
                language="python"
            )
        ],
        prerequisites=["hash-tables-problemas"],
        nextLessonId="hash-two-sum-patterns"
    ),
    
    Lesson(
        id="hash-two-sum-patterns",
        moduleId="hash-tables",
        title="Patrones Two Sum con Hash",
        description="Resuelve variaciones del problema Two Sum y sus extensiones a 3Sum y 4Sum.",
        order=4,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Patrones Two Sum con Hash

## ¿Por qué es tan importante Two Sum?

**Two Sum** es probablemente el problema más famoso de LeetCode y la puerta de entrada a muchos patrones. La idea es: dado un array y un target, encontrar dos números que sumen el target.

## La Idea Clave: Complemento

En lugar de probar todos los pares (O(n²)), por cada número `num`, calculamos su **complemento** = `target - num` y verificamos si ya lo vimos:

```
nums = [2, 7, 11, 15], target = 9

num=2: complemento=7, no lo hemos visto → guardar {2: 0}
num=7: complemento=2, ¡SÍ lo vimos! → return [0, 1]
```

## Variaciones del Patrón

| Problema | Técnica | Complejidad |
|----------|---------|-------------|
| Two Sum (no ordenado) | Hash map | O(n) |
| Two Sum II (ordenado) | Dos punteros | O(n) |
| 3Sum | Ordenar + dos punteros | O(n²) |
| 4Sum | Ordenar + dos punteros anidado | O(n³) |
| Two Sum - Input is BST | Inorder + dos punteros | O(n) |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Two Sum clásico
def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

# Two Sum II - Input Array Is Sorted
def two_sum_sorted(numbers, target):
    left, right = 0, len(numbers) - 1
    while left < right:
        total = numbers[left] + numbers[right]
        if total == target:
            return [left + 1, right + 1]
        elif total < target:
            left += 1
        else:
            right -= 1'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="3Sum with Hash",
                description="Encontrar tripletas que suman cero",
                code='''def three_sum(nums):
    nums.sort()
    result = []
    for i in range(len(nums) - 2):
        if i > 0 and nums[i] == nums[i-1]:
            continue
        target = -nums[i]
        left, right = i + 1, len(nums) - 1
        while left < right:
            total = nums[left] + nums[right]
            if total == target:
                result.append([nums[i], nums[left], nums[right]])
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                left += 1
                right -= 1
            elif total < target:
                left += 1
            else:
                right -= 1
    return result''',
                language="python"
            )
        ],
        prerequisites=["hash-counting"],
        nextLessonId="hash-set-operations"
    ),
    
    Lesson(
        id="hash-set-operations",
        moduleId="hash-tables",
        title="Operaciones con Hash Sets",
        description="Usa sets para búsqueda O(1), deduplicación y operaciones de conjuntos.",
        order=5,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Operaciones con Hash Sets

## ¿Qué es un Hash Set?

Un **set** en Python es una colección que:
- **No permite duplicados** (cada elemento es único)
- **Búsqueda en O(1)** (basado en hash table)
- **No tiene orden** (no puedes acceder por índice)

## Operaciones de Conjuntos

```python
a = {1, 2, 3, 4}
b = {3, 4, 5, 6}

a | b    # Unión: {1, 2, 3, 4, 5, 6}
a & b    # Intersección: {3, 4}
a - b    # Diferencia: {1, 2}
a ^ b    # Diferencia simétrica: {1, 2, 5, 6}
```

## ¿Cuándo usar Sets?

| Situación | Set es ideal |
|-----------|-------------|
| Verificar si un elemento existe | `if x in my_set` → O(1) |
| Eliminar duplicados | `unique = set(nums)` |
| Encontrar elementos comunes | `set1 & set2` |
| Secuencias consecutivas | Verificar inicio de secuencia |

## El Truco del "Inicio de Secuencia"

Para encontrar la secuencia consecutiva más larga, la clave es **solo empezar a contar desde el INICIO de una secuencia**. Un número es inicio si `num - 1` NO está en el set."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Longest Consecutive Sequence
def longest_consecutive(nums):
    num_set = set(nums)
    longest = 0
    
    for num in num_set:
        # Solo empezar si es inicio de secuencia
        if num - 1 not in num_set:
            current = num
            streak = 1
            while current + 1 in num_set:
                current += 1
                streak += 1
            longest = max(longest, streak)
    
    return longest

print(longest_consecutive([100, 4, 200, 1, 3, 2]))  # 4

# Contains Duplicate
def contains_duplicate(nums):
    return len(nums) != len(set(nums))'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Intersection of Arrays",
                description="Encontrar elementos comunes en dos arrays",
                code='''def intersection(nums1, nums2):
    return list(set(nums1) & set(nums2))

def intersection_with_duplicates(nums1, nums2):
    from collections import Counter
    c1, c2 = Counter(nums1), Counter(nums2)
    result = []
    for num in c1:
        if num in c2:
            result.extend([num] * min(c1[num], c2[num]))
    return result''',
                language="python"
            )
        ],
        prerequisites=["hash-two-sum-patterns"],
        nextLessonId="hash-design-problems"
    ),
    
    Lesson(
        id="hash-design-problems",
        moduleId="hash-tables",
        title="Diseño de Estructuras con Hash",
        description="Diseña estructuras de datos personalizadas usando hash tables.",
        order=6,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Diseño con Hash Tables

Combina hash tables con otras estructuras para crear sistemas eficientes."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Insert Delete GetRandom O(1)
import random

class RandomizedSet:
    def __init__(self):
        self.list = []
        self.indices = {}
    
    def insert(self, val):
        if val in self.indices:
            return False
        self.indices[val] = len(self.list)
        self.list.append(val)
        return True
    
    def remove(self, val):
        if val not in self.indices:
            return False
        idx = self.indices[val]
        last = self.list[-1]
        self.list[idx] = last
        self.indices[last] = idx
        self.list.pop()
        del self.indices[val]
        return True
    
    def getRandom(self):
        return random.choice(self.list)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Time Based Key-Value Store",
                description="Estructura con timestamps para valores",
                code='''import bisect

class TimeMap:
    def __init__(self):
        self.store = {}  # key -> [(timestamp, value), ...]
    
    def set(self, key, value, timestamp):
        if key not in self.store:
            self.store[key] = []
        self.store[key].append((timestamp, value))
    
    def get(self, key, timestamp):
        if key not in self.store:
            return ""
        values = self.store[key]
        idx = bisect.bisect_right(values, (timestamp, chr(127)))
        if idx == 0:
            return ""
        return values[idx - 1][1]''',
                language="python"
            )
        ],
        prerequisites=["hash-set-operations"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Linked Lists ===
    Lesson(
        id="linked-lists-intro",
        moduleId="linked-lists",
        title="Introducción a Linked Lists",
        description="Estructura, implementación y operaciones básicas de listas enlazadas.",
        order=1,
        difficulty=Difficulty.EASY,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Introducción a Linked Lists

Una linked list es una estructura donde cada nodo contiene un valor y una referencia al siguiente nodo.

## Ventajas vs Arrays
- Inserción/eliminación O(1) si tienes referencia al nodo
- Tamaño dinámico sin reubicación de memoria

## Desventajas
- Acceso O(n) - no hay índices
- Usa más memoria por los punteros"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# Crear lista: 1 -> 2 -> 3
head = ListNode(1)
head.next = ListNode(2)
head.next.next = ListNode(3)

# Recorrer lista
def print_list(head):
    current = head
    while current:
        print(current.val, end=" -> ")
        current = current.next
    print("None")

print_list(head)  # 1 -> 2 -> 3 -> None

# Insertar al inicio - O(1)
def insert_at_head(head, val):
    new_node = ListNode(val)
    new_node.next = head
    return new_node

head = insert_at_head(head, 0)
print_list(head)  # 0 -> 1 -> 2 -> 3 -> None'''
            ),
            ContentBlock(
                type="info",
                content="**Tip**: Siempre dibuja la lista en papel. Los errores más comunes son perder referencias o crear ciclos accidentales."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Reverse Linked List",
                description="Invertir una lista enlazada",
                code='''def reverse_list(head):
    prev = None
    current = head
    
    while current:
        next_temp = current.next  # Guardar siguiente
        current.next = prev       # Invertir puntero
        prev = current            # Mover prev
        current = next_temp       # Mover current
    
    return prev

# 1 -> 2 -> 3 se convierte en 3 -> 2 -> 1''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="linked-lists-two-pointers"
    ),
    
    Lesson(
        id="linked-lists-two-pointers",
        moduleId="linked-lists",
        title="Técnicas: Fast/Slow Pointers",
        description="Detectar ciclos, encontrar el medio, y más con dos punteros.",
        order=2,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Técnica Fast/Slow Pointers

Usar dos punteros que se mueven a diferente velocidad resuelve muchos problemas de linked lists.

## Aplicaciones
- Detectar ciclo (Floyd's Algorithm)
- Encontrar el nodo medio
- Encontrar el inicio del ciclo
- Detectar intersección de listas"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Detectar ciclo - Floyd's Algorithm
def has_cycle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            return True
    return False

# Encontrar el nodo medio
def find_middle(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    return slow  # slow está en el medio

# Encontrar inicio del ciclo
def detect_cycle_start(head):
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
        if slow == fast:
            # Encontrar inicio
            slow = head
            while slow != fast:
                slow = slow.next
                fast = fast.next
            return slow
    return None'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Merge Two Sorted Lists",
                description="Combinar dos listas ordenadas en una",
                code='''def merge_two_lists(l1, l2):
    dummy = ListNode(0)
    current = dummy
    
    while l1 and l2:
        if l1.val <= l2.val:
            current.next = l1
            l1 = l1.next
        else:
            current.next = l2
            l2 = l2.next
        current = current.next
    
    current.next = l1 or l2
    return dummy.next''',
                language="python"
            )
        ],
        prerequisites=["linked-lists-intro"],
        nextLessonId="linked-lists-reversal"
    ),
    
    Lesson(
        id="linked-lists-reversal",
        moduleId="linked-lists",
        title="Reversión de Listas",
        description="Técnicas para invertir listas enlazadas completas o parciales.",
        order=3,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Reversión de Linked Lists

La inversión de listas es una operación fundamental con muchas variaciones."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Reverse iterativo
def reverse_list(head):
    prev = None
    current = head
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    return prev

# Reverse recursivo
def reverse_recursive(head):
    if not head or not head.next:
        return head
    new_head = reverse_recursive(head.next)
    head.next.next = head
    head.next = None
    return new_head

# Reverse entre posiciones m y n
def reverse_between(head, left, right):
    if not head or left == right:
        return head
    
    dummy = ListNode(0, head)
    prev = dummy
    
    for _ in range(left - 1):
        prev = prev.next
    
    current = prev.next
    for _ in range(right - left):
        next_node = current.next
        current.next = next_node.next
        next_node.next = prev.next
        prev.next = next_node
    
    return dummy.next'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Reverse in K-Groups",
                description="Invertir nodos en grupos de k",
                code='''def reverse_k_group(head, k):
    def reverse(head, k):
        prev = None
        current = head
        while k > 0:
            next_temp = current.next
            current.next = prev
            prev = current
            current = next_temp
            k -= 1
        return prev
    
    # Verificar si hay k nodos
    count = 0
    node = head
    while node and count < k:
        node = node.next
        count += 1
    
    if count == k:
        reversed_head = reverse(head, k)
        head.next = reverse_k_group(node, k)
        return reversed_head
    return head''',
                language="python"
            )
        ],
        prerequisites=["linked-lists-two-pointers"],
        nextLessonId="linked-lists-merge-sort"
    ),
    
    Lesson(
        id="linked-lists-merge-sort",
        moduleId="linked-lists",
        title="Merge y Sort en Listas",
        description="Operaciones de merge y ordenamiento en linked lists.",
        order=4,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Merge y Sort

Combinar listas ordenadas y ordenar listas son operaciones comunes."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Merge K Sorted Lists
import heapq

def merge_k_lists(lists):
    heap = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(heap, (lst.val, i, lst))
    
    dummy = ListNode(0)
    current = dummy
    
    while heap:
        val, i, node = heapq.heappop(heap)
        current.next = node
        current = current.next
        if node.next:
            heapq.heappush(heap, (node.next.val, i, node.next))
    
    return dummy.next

# Sort List usando Merge Sort
def sort_list(head):
    if not head or not head.next:
        return head
    
    # Encontrar el medio
    slow = head
    fast = head.next
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    mid = slow.next
    slow.next = None
    
    left = sort_list(head)
    right = sort_list(mid)
    
    return merge_two_lists(left, right)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Partition List",
                description="Particionar lista alrededor de un valor x",
                code='''def partition(head, x):
    before = before_head = ListNode(0)
    after = after_head = ListNode(0)
    
    while head:
        if head.val < x:
            before.next = head
            before = before.next
        else:
            after.next = head
            after = after.next
        head = head.next
    
    after.next = None
    before.next = after_head.next
    return before_head.next''',
                language="python"
            )
        ],
        prerequisites=["linked-lists-reversal"],
        nextLessonId="linked-lists-advanced"
    ),
    
    Lesson(
        id="linked-lists-advanced",
        moduleId="linked-lists",
        title="Técnicas Avanzadas",
        description="Copiar listas con random pointers y otros problemas avanzados.",
        order=5,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Técnicas Avanzadas

Problemas complejos que combinan múltiples técnicas."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Copy List with Random Pointer
class Node:
    def __init__(self, val, next=None, random=None):
        self.val = val
        self.next = next
        self.random = random

def copy_random_list(head):
    if not head:
        return None
    
    # Paso 1: Crear copias entrelazadas
    current = head
    while current:
        copy = Node(current.val)
        copy.next = current.next
        current.next = copy
        current = copy.next
    
    # Paso 2: Asignar random pointers
    current = head
    while current:
        if current.random:
            current.next.random = current.random.next
        current = current.next.next
    
    # Paso 3: Separar las listas
    dummy = Node(0)
    copy_curr = dummy
    current = head
    while current:
        copy_curr.next = current.next
        copy_curr = copy_curr.next
        current.next = current.next.next
        current = current.next
    
    return dummy.next'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Add Two Numbers",
                description="Sumar dos números representados como listas",
                code='''def add_two_numbers(l1, l2):
    dummy = ListNode(0)
    current = dummy
    carry = 0
    
    while l1 or l2 or carry:
        val1 = l1.val if l1 else 0
        val2 = l2.val if l2 else 0
        
        total = val1 + val2 + carry
        carry = total // 10
        current.next = ListNode(total % 10)
        current = current.next
        
        l1 = l1.next if l1 else None
        l2 = l2.next if l2 else None
    
    return dummy.next''',
                language="python"
            )
        ],
        prerequisites=["linked-lists-merge-sort"],
        nextLessonId="linked-lists-doubly"
    ),
    
    Lesson(
        id="linked-lists-doubly",
        moduleId="linked-lists",
        title="Doubly Linked Lists",
        description="Listas doblemente enlazadas y sus aplicaciones.",
        order=6,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Doubly Linked Lists

Permiten navegación en ambas direcciones."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''class DoublyNode:
    def __init__(self, val=0):
        self.val = val
        self.prev = None
        self.next = None

class DoublyLinkedList:
    def __init__(self):
        self.head = DoublyNode(0)  # dummy head
        self.tail = DoublyNode(0)  # dummy tail
        self.head.next = self.tail
        self.tail.prev = self.head
    
    def add_to_front(self, val):
        node = DoublyNode(val)
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node
    
    def add_to_back(self, val):
        node = DoublyNode(val)
        node.prev = self.tail.prev
        node.next = self.tail
        self.tail.prev.next = node
        self.tail.prev = node
    
    def remove(self, node):
        node.prev.next = node.next
        node.next.prev = node.prev'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Flatten Multilevel Doubly Linked List",
                description="Aplanar una lista con nodos child",
                code='''def flatten(head):
    if not head:
        return None
    
    stack = []
    current = head
    
    while current:
        if current.child:
            if current.next:
                stack.append(current.next)
            current.next = current.child
            current.child.prev = current
            current.child = None
        elif not current.next and stack:
            next_node = stack.pop()
            current.next = next_node
            next_node.prev = current
        current = current.next
    
    return head''',
                language="python"
            )
        ],
        prerequisites=["linked-lists-advanced"],
        nextLessonId="linked-lists-problems"
    ),
    
    Lesson(
        id="linked-lists-problems",
        moduleId="linked-lists",
        title="Problemas Clásicos de Listas",
        description="Resuelve los problemas más comunes de entrevistas con linked lists.",
        order=7,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Clásicos

Consolidación de técnicas en problemas de entrevista."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Remove Nth Node From End
def remove_nth_from_end(head, n):
    dummy = ListNode(0, head)
    first = second = dummy
    
    for _ in range(n + 1):
        first = first.next
    
    while first:
        first = first.next
        second = second.next
    
    second.next = second.next.next
    return dummy.next

# Palindrome Linked List
def is_palindrome(head):
    # Encontrar medio
    slow = fast = head
    while fast and fast.next:
        slow = slow.next
        fast = fast.next.next
    
    # Invertir segunda mitad
    prev = None
    while slow:
        next_temp = slow.next
        slow.next = prev
        prev = slow
        slow = next_temp
    
    # Comparar
    left, right = head, prev
    while right:
        if left.val != right.val:
            return False
        left = left.next
        right = right.next
    return True'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Reorder List",
                description="Reordenar L0->L1->...->Ln a L0->Ln->L1->Ln-1...",
                code='''def reorder_list(head):
    if not head or not head.next:
        return
    
    # Encontrar medio
    slow = fast = head
    while fast.next and fast.next.next:
        slow = slow.next
        fast = fast.next.next
    
    # Invertir segunda mitad
    prev = None
    current = slow.next
    slow.next = None
    while current:
        next_temp = current.next
        current.next = prev
        prev = current
        current = next_temp
    
    # Intercalar
    first, second = head, prev
    while second:
        tmp1, tmp2 = first.next, second.next
        first.next = second
        second.next = tmp1
        first, second = tmp1, tmp2''',
                language="python"
            )
        ],
        prerequisites=["linked-lists-doubly"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Stacks & Queues ===
    Lesson(
        id="stacks-intro",
        moduleId="stacks-queues",
        title="Stacks: LIFO",
        description="Pilas: Last In First Out. Implementación y aplicaciones.",
        order=1,
        difficulty=Difficulty.EASY,
        estimatedMinutes=40,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Stacks (Pilas)

Un stack es una estructura LIFO (Last In, First Out). El último elemento agregado es el primero en salir.

## Operaciones
- **push(x)**: Agregar elemento - O(1)
- **pop()**: Remover y retornar el tope - O(1)
- **peek()/top()**: Ver el tope sin remover - O(1)
- **isEmpty()**: Verificar si está vacía - O(1)"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# En Python, usa list como stack
stack = []
stack.append(1)  # push
stack.append(2)
stack.append(3)
print(stack.pop())  # 3 - pop
print(stack[-1])    # 2 - peek

# Usando deque (más eficiente)
from collections import deque
stack = deque()
stack.append(1)
stack.pop()

# Valid Parentheses - problema clásico
def is_valid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    
    for char in s:
        if char in mapping:
            if not stack or stack.pop() != mapping[char]:
                return False
        else:
            stack.append(char)
    
    return len(stack) == 0

print(is_valid("()[]{}"))  # True
print(is_valid("([)]"))    # False'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Min Stack",
                description="Stack que soporta obtener el mínimo en O(1)",
                code='''class MinStack:
    def __init__(self):
        self.stack = []
        self.min_stack = []
    
    def push(self, val):
        self.stack.append(val)
        if not self.min_stack or val <= self.min_stack[-1]:
            self.min_stack.append(val)
    
    def pop(self):
        if self.stack.pop() == self.min_stack[-1]:
            self.min_stack.pop()
    
    def top(self):
        return self.stack[-1]
    
    def getMin(self):
        return self.min_stack[-1]''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="queues-intro"
    ),
    
    Lesson(
        id="queues-intro",
        moduleId="stacks-queues",
        title="Queues: FIFO",
        description="Colas: First In First Out. Implementación y variantes.",
        order=2,
        difficulty=Difficulty.EASY,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Queues (Colas)

Una queue es una estructura FIFO (First In, First Out). El primer elemento agregado es el primero en salir.

## Operaciones
- **enqueue(x)**: Agregar al final - O(1)
- **dequeue()**: Remover del frente - O(1)
- **front()**: Ver el frente sin remover - O(1)"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import deque

# Usar deque como queue
queue = deque()
queue.append(1)     # enqueue al final
queue.append(2)
queue.append(3)
print(queue.popleft())  # 1 - dequeue del frente
print(queue[0])         # 2 - front/peek

# BFS usa queue
def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Implement Queue using Stacks",
                description="Implementar una cola usando dos pilas",
                code='''class MyQueue:
    def __init__(self):
        self.stack_in = []
        self.stack_out = []
    
    def push(self, x):
        self.stack_in.append(x)
    
    def pop(self):
        self._transfer()
        return self.stack_out.pop()
    
    def peek(self):
        self._transfer()
        return self.stack_out[-1]
    
    def _transfer(self):
        if not self.stack_out:
            while self.stack_in:
                self.stack_out.append(self.stack_in.pop())''',
                language="python"
            )
        ],
        prerequisites=["stacks-intro"],
        nextLessonId="stacks-monotonic"
    ),
    
    Lesson(
        id="stacks-monotonic",
        moduleId="stacks-queues",
        title="Monotonic Stack",
        description="Usa stacks monótonos para resolver problemas de siguiente mayor/menor elemento.",
        order=3,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Monotonic Stack: Un Patrón Poderoso

## ¿Qué es un Monotonic Stack?

Un **monotonic stack** es un stack donde los elementos se mantienen en orden (creciente o decreciente). Cada vez que añades un elemento que "rompe" el orden, sacas elementos hasta restaurarlo.

## ¿Cuándo usarlo?

Siempre que veas frases como:
- "Next greater element" (siguiente elemento mayor)
- "Next smaller element" (siguiente elemento menor)
- "Previous greater/smaller element"
- "Number of days until warmer temperature"
- Problemas de histogramas o áreas

## La Idea Clave

Imagina que estás en una fila de personas y quieres saber: **¿quién es la primera persona más alta que yo a mi derecha?**

En lugar de comparar cada persona con todas las demás (O(n²)), usamos un stack:
1. Recorremos de izquierda a derecha
2. Para cada persona, sacamos del stack a todos los que son más bajos que ella
3. Esos que sacamos ya encontraron su "next greater" → es la persona actual

## Tipos de Monotonic Stack

| Tipo | Mantiene | Encuentra |
|------|----------|-----------|
| Decreciente (↓) | Valores de mayor a menor | Next Greater Element |
| Creciente (↑) | Valores de menor a mayor | Next Smaller Element |

**Complejidad**: O(n) tiempo, O(n) espacio - ¡cada elemento entra y sale del stack máximo una vez!"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Next Greater Element
def next_greater_element(nums):
    n = len(nums)
    result = [-1] * n
    stack = []  # índices
    
    for i in range(n):
        while stack and nums[i] > nums[stack[-1]]:
            idx = stack.pop()
            result[idx] = nums[i]
        stack.append(i)
    
    return result

print(next_greater_element([2, 1, 2, 4, 3]))  # [4, 2, 4, -1, -1]

# Daily Temperatures
def daily_temperatures(temps):
    n = len(temps)
    result = [0] * n
    stack = []
    
    for i in range(n):
        while stack and temps[i] > temps[stack[-1]]:
            prev_idx = stack.pop()
            result[prev_idx] = i - prev_idx
        stack.append(i)
    
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Largest Rectangle in Histogram",
                description="Encontrar el rectángulo más grande en histograma",
                code='''def largest_rectangle_area(heights):
    stack = []
    max_area = 0
    heights.append(0)  # sentinel
    
    for i, h in enumerate(heights):
        start = i
        while stack and stack[-1][1] > h:
            idx, height = stack.pop()
            max_area = max(max_area, height * (i - idx))
            start = idx
        stack.append((start, h))
    
    return max_area''',
                language="python"
            )
        ],
        prerequisites=["queues-intro"],
        nextLessonId="stacks-calculator"
    ),
    
    Lesson(
        id="stacks-calculator",
        moduleId="stacks-queues",
        title="Calculadoras con Stack",
        description="Implementa calculadoras que evalúan expresiones matemáticas.",
        order=4,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Calculadoras con Stack

## ¿Por qué Stacks para Calculadoras?

Cuando evalúas `3 + 2 * 2`, no puedes simplemente ir de izquierda a derecha (darías 10 en vez de 7). Necesitas **respetar la precedencia** de operadores. Un stack te permite "posponer" operaciones de baja prioridad.

## Estrategia General

1. Recorre el string carácter a carácter
2. Si es dígito → construye el número completo
3. Si es operador o fin del string → procesa el operador **anterior**:
   - `+/-`: guarda el número en el stack (con signo)
   - `*//`: opera inmediatamente con el tope del stack
4. Al final: suma todo el stack

## Con Paréntesis

Los paréntesis añaden una capa: cuando encuentras `(`, guardas el resultado actual y empiezas de cero. Cuando encuentras `)`, combinas con lo guardado."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Basic Calculator II (sin paréntesis)
def calculate(s):
    stack = []
    num = 0
    sign = '+'
    
    for i, c in enumerate(s):
        if c.isdigit():
            num = num * 10 + int(c)
        
        if c in '+-*/' or i == len(s) - 1:
            if sign == '+':
                stack.append(num)
            elif sign == '-':
                stack.append(-num)
            elif sign == '*':
                stack.append(stack.pop() * num)
            elif sign == '/':
                stack.append(int(stack.pop() / num))
            sign = c
            num = 0
    
    return sum(stack)

print(calculate("3+2*2"))  # 7'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Basic Calculator (con paréntesis)",
                description="Evaluar expresiones con paréntesis",
                code='''def calculate_with_parens(s):
    stack = []
    num = 0
    sign = 1
    result = 0
    
    for c in s:
        if c.isdigit():
            num = num * 10 + int(c)
        elif c == '+':
            result += sign * num
            num = 0
            sign = 1
        elif c == '-':
            result += sign * num
            num = 0
            sign = -1
        elif c == '(':
            stack.append(result)
            stack.append(sign)
            result = 0
            sign = 1
        elif c == ')':
            result += sign * num
            num = 0
            result *= stack.pop()  # sign
            result += stack.pop()  # previous result
    
    return result + sign * num''',
                language="python"
            )
        ],
        prerequisites=["stacks-monotonic"],
        nextLessonId="deque-sliding-window"
    ),
    
    Lesson(
        id="deque-sliding-window",
        moduleId="stacks-queues",
        title="Deque y Sliding Window",
        description="Usa deques para mantener el máximo/mínimo en ventanas deslizantes en O(n).",
        order=5,
        difficulty=Difficulty.HARD,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Deque para Sliding Window

## ¿Qué es un Deque?

Un **deque** (double-ended queue) permite añadir y quitar elementos por **ambos extremos** en O(1). En Python: `from collections import deque`.

## ¿Por qué Deque + Sliding Window?

Imagina que tienes una ventana de tamaño k deslizándose sobre un array y necesitas el **máximo** en cada posición. Sin deque sería O(n·k). Con deque es O(n).

## La Idea: Monotonic Deque

Mantenemos un deque con los **índices** de los máximos potenciales, en orden decreciente de valor:

1. **Quitar viejos**: Si el frente del deque está fuera de la ventana → `popleft()`
2. **Mantener orden**: Mientras el nuevo elemento sea mayor que el final del deque → `pop()`  
3. **Añadir**: Agregar el nuevo índice al final → `append()`
4. **Resultado**: El frente del deque siempre tiene el máximo actual

```
nums = [1, 3, -1, -3, 5, 3, 6, 7], k = 3

ventana [1,3,-1]:  deque=[1(3)]  → max = 3
ventana [3,-1,-3]: deque=[1(3)]  → max = 3
ventana [-1,-3,5]: deque=[4(5)]  → max = 5
...
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import deque

# Sliding Window Maximum
def max_sliding_window(nums, k):
    result = []
    dq = deque()  # índices de máximos potenciales
    
    for i in range(len(nums)):
        # Remover índices fuera de ventana
        while dq and dq[0] <= i - k:
            dq.popleft()
        
        # Mantener orden decreciente
        while dq and nums[dq[-1]] < nums[i]:
            dq.pop()
        
        dq.append(i)
        
        if i >= k - 1:
            result.append(nums[dq[0]])
    
    return result

print(max_sliding_window([1,3,-1,-3,5,3,6,7], 3))  # [3,3,5,5,6,7]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Shortest Subarray with Sum at Least K",
                description="Encontrar subarreglo más corto con suma >= k",
                code='''def shortest_subarray(nums, k):
    n = len(nums)
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + nums[i]
    
    dq = deque()
    result = float('inf')
    
    for i in range(n + 1):
        while dq and prefix[i] - prefix[dq[0]] >= k:
            result = min(result, i - dq.popleft())
        while dq and prefix[i] <= prefix[dq[-1]]:
            dq.pop()
        dq.append(i)
    
    return result if result != float('inf') else -1''',
                language="python"
            )
        ],
        prerequisites=["stacks-calculator"],
        nextLessonId="priority-queue"
    ),
    
    Lesson(
        id="priority-queue",
        moduleId="stacks-queues",
        title="Priority Queue (Heap)",
        description="Usa heaps como colas de prioridad: Top K, merge k sorted lists y más.",
        order=6,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Priority Queue con Heaps

## ¿Qué es una Priority Queue?

Es una cola donde cada elemento tiene una **prioridad** y siempre sale primero el de mayor (o menor) prioridad. La implementación más eficiente es con un **heap**.

## Complejidad

| Operación | Tiempo |
|-----------|--------|
| Insert (heappush) | O(log n) |
| Extract min (heappop) | O(log n) |
| Peek (heap[0]) | O(1) |
| Heapify (crear heap) | O(n) |

## Python: `heapq`

Python solo tiene **min-heap** (el menor está arriba). Para max-heap, usa negativos:

```python
import heapq

# Min-heap
heapq.heappush(heap, 3)    # Añadir
min_val = heapq.heappop(heap)  # Extraer mínimo
min_val = heap[0]            # Ver mínimo sin extraer

# Max-heap → negar valores
heapq.heappush(heap, -val)  # Añadir
max_val = -heapq.heappop(heap)  # Extraer máximo
```

## ¿Cuándo usar Heaps?

- "Top K" / "K-ésimo mayor/menor" → Heap de tamaño K
- "Merge K sorted lists" → Min-heap con un elemento de cada lista
- "Mediana en stream" → Dos heaps (max-heap izq + min-heap der)
- Cualquier problema donde necesitas acceder al min/max dinámicamente"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import heapq

# heapq es min-heap por defecto
# Para max-heap, negamos valores

# K Largest Elements
def find_k_largest(nums, k):
    return heapq.nlargest(k, nums)

# Merge K Sorted Arrays
def merge_k_sorted(arrays):
    heap = []
    for i, arr in enumerate(arrays):
        if arr:
            heapq.heappush(heap, (arr[0], i, 0))
    
    result = []
    while heap:
        val, arr_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        if elem_idx + 1 < len(arrays[arr_idx]):
            next_val = arrays[arr_idx][elem_idx + 1]
            heapq.heappush(heap, (next_val, arr_idx, elem_idx + 1))
    
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Find Median from Data Stream",
                description="Mantener mediana con dos heaps",
                code='''class MedianFinder:
    def __init__(self):
        self.small = []  # max-heap (negados)
        self.large = []  # min-heap
    
    def addNum(self, num):
        heapq.heappush(self.small, -num)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self):
        if len(self.small) > len(self.large):
            return -self.small[0]
        return (-self.small[0] + self.large[0]) / 2''',
                language="python"
            )
        ],
        prerequisites=["deque-sliding-window"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Trees ===
    Lesson(
        id="trees-intro",
        moduleId="trees",
        title="Introducción a Árboles",
        description="Conceptos básicos, terminología y recorridos de árboles.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Introducción a Árboles

Un árbol es una estructura jerárquica con nodos conectados por aristas.

## Terminología
- **Root**: Nodo sin padre
- **Leaf**: Nodo sin hijos
- **Height**: Distancia máxima de root a leaf
- **Depth**: Distancia de un nodo al root
- **Binary Tree**: Cada nodo tiene máximo 2 hijos"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Crear árbol:     1
#                 / \\
#                2   3
#               / \\
#              4   5
root = TreeNode(1)
root.left = TreeNode(2)
root.right = TreeNode(3)
root.left.left = TreeNode(4)
root.left.right = TreeNode(5)

# Recorridos DFS
def preorder(root):  # Root -> Left -> Right
    if not root:
        return []
    return [root.val] + preorder(root.left) + preorder(root.right)

def inorder(root):   # Left -> Root -> Right
    if not root:
        return []
    return inorder(root.left) + [root.val] + inorder(root.right)

def postorder(root): # Left -> Right -> Root
    if not root:
        return []
    return postorder(root.left) + postorder(root.right) + [root.val]

print(preorder(root))   # [1, 2, 4, 5, 3]
print(inorder(root))    # [4, 2, 5, 1, 3]
print(postorder(root))  # [4, 5, 2, 3, 1]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Level Order Traversal (BFS)",
                description="Recorrer árbol por niveles",
                code='''from collections import deque

def level_order(root):
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
    
    return result

# [[1], [2, 3], [4, 5]]''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="trees-traversals"
    ),
    
    Lesson(
        id="trees-traversals",
        moduleId="trees",
        title="Recorridos de Árboles",
        description="Preorder, inorder, postorder y level order: los 4 recorridos fundamentales.",
        order=2,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Recorridos de Árboles Binarios

Los recorridos (traversals) son la base de TODO lo que harás con árboles. Antes de resolver cualquier problema, necesitas saber **cómo visitar cada nodo** de forma ordenada.

## ¿Por qué importan los recorridos?

Imagina que tienes un árbol genealógico y quieres listar a todos los miembros. ¿Por dónde empiezas? ¿Vas primero por una rama completa o nivel por nivel? Esa decisión es exactamente lo que distingue los tipos de recorrido.

## Los 4 Tipos Fundamentales

Hay **dos familias** de recorridos:

### 🔹 DFS (Depth-First Search) - Van "hacia abajo" primero
1. **Preorder**: Raíz → Izquierda → Derecha (útil para copiar/serializar árboles)
2. **Inorder**: Izquierda → Raíz → Derecha (en BST da orden ascendente ⭐)
3. **Postorder**: Izquierda → Derecha → Raíz (útil para eliminar/evaluar)

### 🔹 BFS (Breadth-First Search) - Van "por niveles"
4. **Level Order**: Nivel 0 → Nivel 1 → Nivel 2... (útil para encontrar el camino más corto)

## Ejemplo Visual

```
        1
       / \\
      2   3
     / \\   \\
    4   5   6
```

| Recorrido  | Orden de visita | Resultado    |
|------------|-----------------|-------------|
| Preorder   | Raíz→Izq→Der   | [1,2,4,5,3,6] |
| Inorder    | Izq→Raíz→Der   | [4,2,5,1,3,6] |
| Postorder  | Izq→Der→Raíz   | [4,5,2,6,3,1] |
| Level Order| Nivel por nivel | [1,2,3,4,5,6] |

## Truco para Recordar

- **Pre**order = la raíz va **PRE** (antes) que todo
- **In**order = la raíz va **IN** (en medio) de izquierda y derecha
- **Post**order = la raíz va **POST** (después) de todo"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Definición del nodo
class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# ========================================
# 1. PREORDER: Raíz → Izquierda → Derecha
# ========================================
# Recursivo (más intuitivo)
def preorder_recursive(root):
    if not root:
        return []
    return [root.val] + preorder_recursive(root.left) + preorder_recursive(root.right)

# Iterativo (con stack - importante para entrevistas)
def preorder_iterative(root):
    if not root:
        return []
    result = []
    stack = [root]
    while stack:
        node = stack.pop()
        result.append(node.val)
        # ¡Derecha primero! Porque el stack es LIFO
        if node.right:
            stack.append(node.right)
        if node.left:
            stack.append(node.left)
    return result

# ========================================
# 2. INORDER: Izquierda → Raíz → Derecha
# ========================================
# Recursivo
def inorder_recursive(root):
    if not root:
        return []
    return inorder_recursive(root.left) + [root.val] + inorder_recursive(root.right)

# Iterativo (patrón importante: ir lo más a la izquierda posible)
def inorder_iterative(root):
    result = []
    stack = []
    current = root
    while current or stack:
        # Ir lo más a la izquierda posible
        while current:
            stack.append(current)
            current = current.left
        # Procesar nodo
        current = stack.pop()
        result.append(current.val)
        # Ir a la derecha
        current = current.right
    return result

# ========================================
# 3. POSTORDER: Izquierda → Derecha → Raíz
# ========================================
# Recursivo
def postorder_recursive(root):
    if not root:
        return []
    return postorder_recursive(root.left) + postorder_recursive(root.right) + [root.val]

# Iterativo (truco: preorder modificado + reverse)
def postorder_iterative(root):
    if not root:
        return []
    result = []
    stack = [root]
    while stack:
        node = stack.pop()
        result.append(node.val)
        # Izquierda primero (inverso del preorder)
        if node.left:
            stack.append(node.left)
        if node.right:
            stack.append(node.right)
    return result[::-1]  # Invertir al final'''
            ),
            ContentBlock(
                type="text",
                content="""## Level Order Traversal (BFS)

El recorrido por niveles usa una **cola (queue)** en lugar de un stack. Es la base para muchos problemas de árboles como:
- Encontrar el ancho máximo del árbol
- Zigzag traversal
- Right side view del árbol
- Conectar nodos del mismo nivel

### ¿Cómo funciona?
1. Empezamos con la raíz en la cola
2. Para cada nivel, procesamos TODOS los nodos de ese nivel
3. Al procesar cada nodo, añadimos sus hijos a la cola
4. Repetimos hasta que la cola esté vacía"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import deque

# ========================================
# 4. LEVEL ORDER: Nivel por nivel (BFS)
# ========================================
def level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)  # Nodos en este nivel
        level = []
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result

# Ejemplo:
#       1
#      / \\
#     2   3
#    / \\   \\
#   4   5   6
# Resultado: [[1], [2, 3], [4, 5, 6]]

# ========================================
# VARIANTE: Zigzag Level Order
# ========================================
def zigzag_level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
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
        
        if not left_to_right:
            level.reverse()
        result.append(level)
        left_to_right = not left_to_right
    
    return result'''
            ),
            ContentBlock(
                type="text",
                content="""## ¿Cuándo usar cada recorrido?

| Situación | Recorrido | ¿Por qué? |
|-----------|-----------|-----------|
| Copiar/serializar un árbol | Preorder | Procesas la raíz primero, luego reconstruyes |
| Obtener valores ordenados de un BST | Inorder | BST + inorder = orden ascendente |
| Eliminar un árbol (liberar memoria) | Postorder | Eliminas hijos antes que padres |
| Encontrar profundidad mínima | Level Order | El primer leaf que encuentres es el más cercano |
| Evaluar expresiones matemáticas | Postorder | Evalúas operandos antes del operador |

## Complejidad

Todos los recorridos tienen la misma complejidad:
- **Tiempo**: O(n) - visitamos cada nodo exactamente una vez
- **Espacio**: O(h) para DFS (h = altura), O(w) para BFS (w = ancho máximo)
  - Mejor caso (árbol balanceado): O(log n)
  - Peor caso (árbol degenerado/lista): O(n)

## Tip para Entrevistas

> Cuando te pregunten un problema de árboles, primero piensa: "¿Necesito DFS o BFS?" 
> - Si necesitas **explorar caminos completos** → DFS
> - Si necesitas **procesar nivel por nivel** → BFS
> - Si necesitas **valores ordenados** de un BST → Inorder"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Recorridos completos con ejemplo",
                description="Todos los recorridos aplicados al mismo árbol para comparar",
                code='''class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Construir árbol de ejemplo:
#       1
#      / \\
#     2   3
#    / \\   \\
#   4   5   6
root = TreeNode(1)
root.left = TreeNode(2, TreeNode(4), TreeNode(5))
root.right = TreeNode(3, None, TreeNode(6))

# Preorder: Raíz → Izq → Der
def preorder(root):
    if not root: return []
    return [root.val] + preorder(root.left) + preorder(root.right)

# Inorder: Izq → Raíz → Der  
def inorder(root):
    if not root: return []
    return inorder(root.left) + [root.val] + inorder(root.right)

# Postorder: Izq → Der → Raíz
def postorder(root):
    if not root: return []
    return postorder(root.left) + postorder(root.right) + [root.val]

print("Preorder: ", preorder(root))   # [1, 2, 4, 5, 3, 6]
print("Inorder:  ", inorder(root))    # [4, 2, 5, 1, 3, 6]
print("Postorder:", postorder(root))  # [4, 5, 2, 6, 3, 1]''',
                language="python"
            ),
            CodeExample(
                title="Serializar y Deserializar un Árbol",
                description="Usa preorder traversal para convertir árbol ↔ string",
                code='''# Serializar: árbol → string (usando preorder)
def serialize(root):
    if not root:
        return "null"
    return f"{root.val},{serialize(root.left)},{serialize(root.right)}"

# Deserializar: string → árbol
def deserialize(data):
    values = iter(data.split(","))
    
    def build():
        val = next(values)
        if val == "null":
            return None
        node = TreeNode(int(val))
        node.left = build()
        node.right = build()
        return node
    
    return build()

# Ejemplo
tree_string = serialize(root)
print(tree_string)  # "1,2,4,null,null,5,null,null,3,null,6,null,null"
restored = deserialize(tree_string)
print(preorder(restored))  # [1, 2, 4, 5, 3, 6] ✓''',
                language="python"
            )
        ],
        prerequisites=["trees-intro"],
        nextLessonId="trees-dfs"
    ),
    
    Lesson(
        id="trees-dfs",
        moduleId="trees",
        title="DFS en Árboles",
        description="Técnicas de búsqueda en profundidad: problemas clásicos y patrones recursivos.",
        order=3,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# DFS en Árboles: Problemas y Patrones

Ya conoces los recorridos (preorder, inorder, postorder). Ahora vamos a usar DFS para **resolver problemas reales**.

## ¿Qué es DFS en el contexto de problemas?

DFS (Depth-First Search) en árboles significa explorar **todo un camino hasta las hojas** antes de retroceder. La mayoría de problemas de árboles se resuelven con DFS recursivo.

## El Patrón DFS Recursivo

Casi todos los problemas de DFS en árboles siguen este esqueleto:

```python
def dfs(node):
    # 1. Caso base: ¿qué pasa si el nodo es None?
    if not node:
        return valor_base
    
    # 2. Resolver para subárboles izquierdo y derecho
    left_result = dfs(node.left)
    right_result = dfs(node.right)
    
    # 3. Combinar resultados con el nodo actual
    return combinar(node.val, left_result, right_result)
```

## Tipos de Problemas DFS

1. **Top-down**: Pasas información del padre al hijo (usa parámetros)
2. **Bottom-up**: Recoges información de los hijos (usa return)
3. **Combinado**: Necesitas información de ambas direcciones"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# ========================================
# BOTTOM-UP: Información de hijos → padre
# ========================================

# Maximum Depth (el clásico)
def max_depth(root):
    """La profundidad máxima es la más profunda entre izq y der + 1"""
    if not root:
        return 0
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    return 1 + max(left_depth, right_depth)

# Same Tree: ¿Son dos árboles idénticos?
def is_same_tree(p, q):
    # Ambos vacíos → iguales
    if not p and not q:
        return True
    # Uno vacío y otro no → diferentes
    if not p or not q:
        return False
    # Comparar valor actual Y ambos subárboles
    return (p.val == q.val and 
            is_same_tree(p.left, q.left) and 
            is_same_tree(p.right, q.right))

# Symmetric Tree: ¿Es simétrico (espejo)?
def is_symmetric(root):
    def is_mirror(t1, t2):
        if not t1 and not t2:
            return True
        if not t1 or not t2:
            return False
        return (t1.val == t2.val and
                is_mirror(t1.left, t2.right) and  # Izq con Der
                is_mirror(t1.right, t2.left))      # Der con Izq
    return is_mirror(root, root)

# ========================================
# TOP-DOWN: Información de padre → hijos
# ========================================

# Has Path Sum: ¿Existe camino root→leaf con suma dada?
def has_path_sum(root, target_sum):
    if not root:
        return False
    # Si es hoja, verificar si la suma coincide
    if not root.left and not root.right:
        return root.val == target_sum
    # Pasar la suma restante a los hijos
    remaining = target_sum - root.val
    return (has_path_sum(root.left, remaining) or
            has_path_sum(root.right, remaining))'''
            ),
            ContentBlock(
                type="text",
                content="""## Patrón: Recolectar Todos los Caminos

Muchos problemas piden "todos los caminos" o "todos los valores". Para esto usamos **backtracking con DFS**: llevamos un `path` que modificamos al bajar y restauramos al subir.

### Clave del backtracking en árboles:
1. Añadir el nodo actual al camino
2. Si es hoja y cumple la condición → guardar copia del camino
3. Explorar hijos
4. **Quitar el nodo del camino** (backtrack)"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Path Sum II: Encontrar TODOS los caminos root→leaf con suma dada
def path_sum_ii(root, target):
    result = []
    
    def dfs(node, remaining, path):
        if not node:
            return
        
        path.append(node.val)  # Añadir al camino
        
        # ¿Es hoja con suma correcta?
        if not node.left and not node.right and remaining == node.val:
            result.append(path.copy())  # ¡Copia! No referencia
        else:
            dfs(node.left, remaining - node.val, path)
            dfs(node.right, remaining - node.val, path)
        
        path.pop()  # Backtrack: quitar del camino
    
    dfs(root, target, [])
    return result

# Ejemplo:
#       5
#      / \\
#     4   8
#    /   / \\
#   11  13  4
#  / \\     / \\
# 7   2   5   1
# target = 22
# Resultado: [[5,4,11,2], [5,8,4,5]]

# Binary Tree Paths: Todos los caminos root→leaf como strings
def binary_tree_paths(root):
    result = []
    
    def dfs(node, path):
        if not node:
            return
        path.append(str(node.val))
        if not node.left and not node.right:
            result.append("->".join(path))
        else:
            dfs(node.left, path)
            dfs(node.right, path)
        path.pop()
    
    dfs(root, [])
    return result

# Invert Binary Tree (el favorito de las entrevistas)
def invert_tree(root):
    if not root:
        return None
    # Intercambiar hijos
    root.left, root.right = root.right, root.left
    # Recursivamente invertir subárboles
    invert_tree(root.left)
    invert_tree(root.right)
    return root'''
            ),
            ContentBlock(
                type="text",
                content="""## Errores Comunes en DFS

1. **Olvidar el caso base**: Siempre maneja `if not node: return`
2. **No copiar el path**: `result.append(path.copy())` NO `result.append(path)`
3. **Olvidar el backtrack**: Si modificas `path`, siempre haz `path.pop()` al final
4. **Confundir hoja con None**: Una hoja es un nodo sin hijos, no un nodo None

## Resumen de Complejidad
- **Tiempo**: O(n) - visitamos cada nodo una vez
- **Espacio**: O(h) - la pila de recursión tiene como máximo la altura del árbol"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Validate BST con DFS",
                description="Verificar si un árbol es un BST válido usando rangos",
                code='''def is_valid_bst(root):
    def validate(node, min_val, max_val):
        if not node:
            return True
        if node.val <= min_val or node.val >= max_val:
            return False
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))''',
                language="python"
            ),
            CodeExample(
                title="Count Good Nodes",
                description="Contar nodos donde ningún ancestro es mayor",
                code='''def good_nodes(root):
    def dfs(node, max_so_far):
        if not node:
            return 0
        count = 1 if node.val >= max_so_far else 0
        new_max = max(max_so_far, node.val)
        count += dfs(node.left, new_max)
        count += dfs(node.right, new_max)
        return count
    
    return dfs(root, root.val)''',
                language="python"
            )
        ],
        prerequisites=["trees-traversals"],
        nextLessonId="trees-bfs"
    ),
    
    Lesson(
        id="trees-bfs",
        moduleId="trees",
        title="BFS en Árboles",
        description="Búsqueda por niveles: level order, right side view, minimum depth y más.",
        order=4,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# BFS en Árboles: Exploración Nivel por Nivel

## ¿Qué es BFS?

BFS (Breadth-First Search) explora el árbol **nivel por nivel**, de izquierda a derecha. A diferencia de DFS que va "hasta el fondo", BFS va "a lo ancho".

## ¿Cuándo usar BFS en lugar de DFS?

| Usa BFS cuando... | Ejemplo |
|-------------------|---------|
| Necesitas procesar por niveles | Level order traversal |
| Buscas el camino más corto | Minimum depth |
| Necesitas el último/primer nodo de cada nivel | Right/Left side view |
| Trabajas con "vecinos" del mismo nivel | Connect next pointers |

## El Patrón BFS con Cola

```python
from collections import deque

def bfs_template(root):
    if not root:
        return []
    
    queue = deque([root])      # Cola con la raíz
    
    while queue:
        level_size = len(queue)  # ¡Clave! Nodos en ESTE nivel
        
        for _ in range(level_size):
            node = queue.popleft()
            # Procesar nodo...
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
```

**¿Por qué `level_size = len(queue)`?** Porque nos permite saber exactamente cuántos nodos pertenecen al nivel actual antes de añadir los del siguiente nivel."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import deque

# ========================================
# Level Order Traversal (el clásico)
# ========================================
def level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level = []
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level)
    
    return result

# Ejemplo:
#       3
#      / \\
#     9   20
#        /  \\
#       15   7
# Resultado: [[3], [9, 20], [15, 7]]

# ========================================
# Right Side View
# ========================================
# ¿Qué verías si miras el árbol desde la derecha?
# Respuesta: el ÚLTIMO nodo de cada nivel
def right_side_view(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            if i == level_size - 1:  # Último nodo del nivel
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result

# ========================================
# Minimum Depth (BFS es ÓPTIMO aquí)
# ========================================
# BFS encuentra la primera hoja = profundidad mínima
def min_depth(root):
    if not root:
        return 0
    
    queue = deque([(root, 1)])  # (nodo, profundidad)
    
    while queue:
        node, depth = queue.popleft()
        
        # ¡Primera hoja encontrada! BFS garantiza que es la más cercana
        if not node.left and not node.right:
            return depth
        
        if node.left:
            queue.append((node.left, depth + 1))
        if node.right:
            queue.append((node.right, depth + 1))'''
            ),
            ContentBlock(
                type="text",
                content="""## Variantes Populares en Entrevistas

### Zigzag Level Order
Alterna la dirección en cada nivel: izquierda→derecha, luego derecha→izquierda.

### Average of Levels
Calcula el promedio de valores en cada nivel.

### Maximum Width
Encuentra el nivel con más nodos (contando None entre nodos)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# ========================================
# Zigzag Level Order
# ========================================
def zigzag_level_order(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    left_to_right = True
    
    while queue:
        level = deque()
        for _ in range(len(queue)):
            node = queue.popleft()
            if left_to_right:
                level.append(node.val)
            else:
                level.appendleft(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(list(level))
        left_to_right = not left_to_right
    
    return result

# ========================================
# Average of Levels
# ========================================
def average_of_levels(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_sum = 0
        level_size = len(queue)
        
        for _ in range(level_size):
            node = queue.popleft()
            level_sum += node.val
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        
        result.append(level_sum / level_size)
    
    return result'''
            ),
            ContentBlock(
                type="text",
                content="""## BFS vs DFS: Resumen

| Aspecto | BFS | DFS |
|---------|-----|-----|
| Estructura | Cola (queue) | Pila (stack/recursión) |
| Exploración | Nivel por nivel | Camino completo |
| Espacio | O(w) ancho máximo | O(h) altura |
| Mejor para | Camino más corto, niveles | Caminos completos, búsqueda profunda |
| Implementación | Siempre iterativo | Recursivo o iterativo |

## Complejidad
- **Tiempo**: O(n) - visitamos cada nodo una vez
- **Espacio**: O(w) donde w es el ancho máximo del árbol (peor caso O(n/2) = O(n) en último nivel)"""
            )
        ],
        codeExamples=[
            CodeExample(
                title="Connect Next Right Pointers",
                description="Conectar cada nodo con su vecino de la derecha en el mismo nivel",
                code='''def connect(root):
    if not root:
        return root
    
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            # Conectar con el siguiente si no es el último del nivel
            if i < level_size - 1:
                node.next = queue[0]
            else:
                node.next = None
            
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return root''',
                language="python"
            )
        ],
        prerequisites=["trees-dfs"],
        nextLessonId="trees-construction"
    ),
    
    Lesson(
        id="trees-construction",
        moduleId="trees",
        title="Construcción de Árboles",
        description="Reconstruye árboles desde recorridos preorder/inorder/postorder.",
        order=5,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Construcción de Árboles desde Recorridos

## ¿Por qué es importante?

Este es un problema clásico de entrevistas: dado uno o dos recorridos de un árbol, ¿puedes reconstruirlo?

## La Clave: ¿Qué información da cada recorrido?

- **Preorder** `[Raíz, ...izquierda..., ...derecha...]`: El **primer elemento** siempre es la raíz
- **Inorder** `[...izquierda..., Raíz, ...derecha...]`: Divide el árbol en subárbol izquierdo y derecho
- **Postorder** `[...izquierda..., ...derecha..., Raíz]`: El **último elemento** siempre es la raíz

## ¿Qué combinaciones funcionan?

| Combinación | ¿Funciona? | ¿Por qué? |
|-------------|-----------|-----------|
| Preorder + Inorder | ✅ Sí | Preorder da la raíz, inorder divide izq/der |
| Postorder + Inorder | ✅ Sí | Postorder da la raíz, inorder divide izq/der |
| Preorder + Postorder | ❌ No (en general) | Sin inorder no sabemos dónde dividir |

## Algoritmo Paso a Paso

```
Preorder: [3, 9, 20, 15, 7]
Inorder:  [9, 3, 15, 20, 7]

Paso 1: La raíz es preorder[0] = 3
Paso 2: En inorder, 3 está en posición 1
         → Izquierda: inorder[:1] = [9]
         → Derecha: inorder[2:] = [15, 20, 7]
Paso 3: En preorder, separamos igual:
         → Izquierda: preorder[1:2] = [9]
         → Derecha: preorder[2:] = [20, 15, 7]
Paso 4: Recurrir para cada subárbol
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Construir desde Preorder e Inorder
def build_tree_pre_in(preorder, inorder):
    if not preorder:
        return None
    
    root_val = preorder[0]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)
    
    root.left = build_tree_pre_in(preorder[1:mid+1], inorder[:mid])
    root.right = build_tree_pre_in(preorder[mid+1:], inorder[mid+1:])
    
    return root

# Construir desde Inorder y Postorder
def build_tree_in_post(inorder, postorder):
    if not inorder:
        return None
    
    root_val = postorder[-1]
    root = TreeNode(root_val)
    mid = inorder.index(root_val)
    
    root.left = build_tree_in_post(inorder[:mid], postorder[:mid])
    root.right = build_tree_in_post(inorder[mid+1:], postorder[mid:-1])
    
    return root'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Serializar y Deserializar Árbol",
                description="Convertir árbol a string y viceversa",
                code='''class Codec:
    def serialize(self, root):
        if not root:
            return "null"
        return f"{root.val},{self.serialize(root.left)},{self.serialize(root.right)}"
    
    def deserialize(self, data):
        def helper(nodes):
            val = next(nodes)
            if val == "null":
                return None
            node = TreeNode(int(val))
            node.left = helper(nodes)
            node.right = helper(nodes)
            return node
        
        return helper(iter(data.split(",")))''',
                language="python"
            )
        ],
        prerequisites=["trees-bfs"],
        nextLessonId="trees-lca"
    ),
    
    Lesson(
        id="trees-lca",
        moduleId="trees",
        title="Lowest Common Ancestor",
        description="Encuentra el ancestro común más bajo de dos nodos en un árbol.",
        order=6,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Lowest Common Ancestor (LCA)

## ¿Qué es el LCA?

El **Lowest Common Ancestor** (Ancestro Común Más Bajo) de dos nodos `p` y `q` es el nodo más profundo que es ancestro de ambos.

### Ejemplo Visual
```
        3
       / \\
      5   1
     / \\ / \\
    6  2 0  8
      / \\
     7   4
```

- LCA(5, 1) = **3** (la raíz es ancestro de ambos)
- LCA(5, 4) = **5** (5 es ancestro de 4, y es ancestro de sí mismo)
- LCA(6, 4) = **5** (5 es el ancestro más profundo que comparten)

## ¿Cuándo aparece en entrevistas?

- Encontrar la distancia entre dos nodos
- Verificar si un nodo es ancestro de otro
- Problemas de rutas entre dos nodos en un árbol

## La Intuición del Algoritmo

Para cada nodo, preguntamos: "¿Los nodos `p` y `q` están en mi subárbol?"

- Si `p` está en mi subárbol izquierdo y `q` en el derecho → **yo soy el LCA**
- Si ambos están en el mismo lado → el LCA está en ese lado
- Si yo soy `p` o `q` → yo soy el LCA (el otro está en mi subárbol)"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# LCA en Binary Tree
def lowest_common_ancestor(root, p, q):
    if not root or root == p or root == q:
        return root
    
    left = lowest_common_ancestor(root.left, p, q)
    right = lowest_common_ancestor(root.right, p, q)
    
    if left and right:
        return root
    return left or right

# LCA en BST (más eficiente)
def lca_bst(root, p, q):
    while root:
        if p.val < root.val and q.val < root.val:
            root = root.left
        elif p.val > root.val and q.val > root.val:
            root = root.right
        else:
            return root'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Distance Between Two Nodes",
                description="Calcular distancia entre dos nodos usando LCA",
                code='''def find_distance(root, p, q):
    def depth(root, node, d):
        if not root:
            return -1
        if root == node:
            return d
        left = depth(root.left, node, d + 1)
        if left != -1:
            return left
        return depth(root.right, node, d + 1)
    
    lca = lowest_common_ancestor(root, p, q)
    return depth(lca, p, 0) + depth(lca, q, 0)''',
                language="python"
            )
        ],
        prerequisites=["trees-construction"],
        nextLessonId="trees-diameter"
    ),
    
    Lesson(
        id="trees-diameter",
        moduleId="trees",
        title="Diámetro y Propiedades",
        description="Calcula diámetro, balance y otras propiedades de árboles.",
        order=7,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Diámetro y Propiedades de Árboles

## ¿Qué es el Diámetro?

El **diámetro** de un árbol es la longitud del camino más largo entre **cualquier** par de nodos. Este camino puede o no pasar por la raíz.

```
        1
       / \\
      2   3      Diámetro = 3 (camino: 4→2→1→3)
     / \\
    4   5        Pero si 5 tuviera hijos profundos,
                 el diámetro podría NO pasar por la raíz
```

## El Truco: Variable Global + Altura

Para calcular el diámetro, en cada nodo calculamos la **altura** de sus subárboles izquierdo y derecho. El camino más largo QUE PASA POR ESE NODO es `left_height + right_height`.

## ¿Qué es un Árbol Balanceado?

Un árbol es **balanceado** si para CADA nodo, la diferencia de altura entre sus subárboles izquierdo y derecho es ≤ 1. Usamos el mismo patrón de calcular alturas, pero retornamos -1 si detectamos desbalance.

## Maximum Path Sum (Hard pero importante)

Similar al diámetro pero con **sumas**: encuentra el camino con la suma máxima de valores. La clave es que a cada nodo le "ofreces" al padre tu mejor contribución (izq o der, no ambos)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Diameter of Binary Tree
def diameter_of_binary_tree(root):
    diameter = 0
    
    def height(node):
        nonlocal diameter
        if not node:
            return 0
        left_h = height(node.left)
        right_h = height(node.right)
        diameter = max(diameter, left_h + right_h)
        return 1 + max(left_h, right_h)
    
    height(root)
    return diameter

# Balanced Binary Tree
def is_balanced(root):
    def check(node):
        if not node:
            return 0
        left = check(node.left)
        right = check(node.right)
        if left == -1 or right == -1 or abs(left - right) > 1:
            return -1
        return 1 + max(left, right)
    
    return check(root) != -1'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Maximum Path Sum",
                description="Encontrar la suma máxima de cualquier ruta",
                code='''def max_path_sum(root):
    max_sum = float('-inf')
    
    def dfs(node):
        nonlocal max_sum
        if not node:
            return 0
        
        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)
        
        # Ruta que pasa por este nodo
        max_sum = max(max_sum, left + right + node.val)
        
        # Máximo contribuible hacia arriba
        return max(left, right) + node.val
    
    dfs(root)
    return max_sum''',
                language="python"
            )
        ],
        prerequisites=["trees-lca"],
        nextLessonId="trees-subtree"
    ),
    
    Lesson(
        id="trees-subtree",
        moduleId="trees",
        title="Problemas de Subárboles",
        description="Trabaja con subárboles y comparaciones de árboles.",
        order=8,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas de Subárboles

## ¿Qué son los problemas de subárboles?

Son problemas donde necesitas comparar, transformar o analizar **subárboles completos**. Incluyen:

- **Subtree of Another Tree**: ¿Un árbol es subárbol de otro?
- **Invert Binary Tree**: Crear el espejo de un árbol
- **Flatten to Linked List**: Convertir árbol en lista enlazada
- **Merge Two Trees**: Combinar dos árboles

## Patrón: Comparación de Árboles

Para verificar si dos árboles son iguales, comparamos recursivamente:
1. Ambos son None → iguales
2. Uno es None y otro no → diferentes
3. Valores diferentes → diferentes
4. Recursivamente comparar izquierda con izquierda Y derecha con derecha

## Subtree: Estrategia

Para ver si `subRoot` es subárbol de `root`:
1. En cada nodo de `root`, preguntamos: ¿este nodo es la raíz de un árbol idéntico a `subRoot`?
2. Si no, buscamos recursivamente en izquierda y derecha
3. Complejidad: O(n × m) donde n = nodos en root, m = nodos en subRoot"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Subtree of Another Tree
def is_subtree(root, subRoot):
    if not root:
        return False
    if is_same_tree(root, subRoot):
        return True
    return is_subtree(root.left, subRoot) or is_subtree(root.right, subRoot)

def is_same_tree(p, q):
    if not p and not q:
        return True
    if not p or not q or p.val != q.val:
        return False
    return is_same_tree(p.left, q.left) and is_same_tree(p.right, q.right)

# Invert Binary Tree
def invert_tree(root):
    if not root:
        return None
    root.left, root.right = invert_tree(root.right), invert_tree(root.left)
    return root

# Flatten Binary Tree to Linked List
def flatten(root):
    while root:
        if root.left:
            rightmost = root.left
            while rightmost.right:
                rightmost = rightmost.right
            rightmost.right = root.right
            root.right = root.left
            root.left = None
        root = root.right'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Count Good Nodes",
                description="Contar nodos mayores o iguales a ancestros",
                code='''def good_nodes(root):
    def dfs(node, max_val):
        if not node:
            return 0
        
        count = 1 if node.val >= max_val else 0
        new_max = max(max_val, node.val)
        
        return count + dfs(node.left, new_max) + dfs(node.right, new_max)
    
    return dfs(root, root.val)''',
                language="python"
            )
        ],
        prerequisites=["trees-diameter"],
        nextLessonId="trees-views"
    ),
    
    Lesson(
        id="trees-views",
        moduleId="trees",
        title="Vistas del Árbol",
        description="Left view, right view, top view, bottom view.",
        order=9,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Vistas del Árbol

## ¿Qué son las "vistas" de un árbol?

Imagina que miras un árbol desde diferentes ángulos:
- **Right Side View**: Lo que ves mirando desde la derecha (último nodo de cada nivel)
- **Left Side View**: Lo que ves mirando desde la izquierda (primer nodo de cada nivel)
- **Top View**: Lo que ves mirando desde arriba
- **Bottom View**: Lo que ves mirando desde abajo
- **Boundary Traversal**: Los nodos del "contorno" del árbol

## ¿Cómo resolverlos?

La mayoría usa **BFS (level order)** con un truco específico:
- **Right view**: Último nodo de cada nivel → `if i == level_size - 1`
- **Left view**: Primer nodo de cada nivel → `if i == 0`
- **Top/Bottom view**: Necesitas rastrear la "columna" de cada nodo usando una coordenada horizontal

## Vertical Order Traversal

Asigna una coordenada x a cada nodo (raíz = 0, izquierda = x-1, derecha = x+1). Agrupa por columna."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''from collections import deque, defaultdict

# Left View
def left_view(root):
    if not root:
        return []
    
    result = []
    queue = deque([root])
    
    while queue:
        level_size = len(queue)
        for i in range(level_size):
            node = queue.popleft()
            if i == 0:
                result.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
    
    return result

# Vertical Order Traversal
def vertical_order(root):
    if not root:
        return []
    
    columns = defaultdict(list)
    queue = deque([(root, 0)])
    
    while queue:
        node, col = queue.popleft()
        columns[col].append(node.val)
        if node.left:
            queue.append((node.left, col - 1))
        if node.right:
            queue.append((node.right, col + 1))
    
    return [columns[c] for c in sorted(columns)]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Top View and Bottom View",
                description="Vista desde arriba y desde abajo",
                code='''def top_view(root):
    if not root:
        return []
    
    columns = {}
    queue = deque([(root, 0)])
    
    while queue:
        node, col = queue.popleft()
        if col not in columns:
            columns[col] = node.val
        if node.left:
            queue.append((node.left, col - 1))
        if node.right:
            queue.append((node.right, col + 1))
    
    return [columns[c] for c in sorted(columns)]

def bottom_view(root):
    columns = {}
    queue = deque([(root, 0)])
    
    while queue:
        node, col = queue.popleft()
        columns[col] = node.val  # Sobrescribe
        if node.left:
            queue.append((node.left, col - 1))
        if node.right:
            queue.append((node.right, col + 1))
    
    return [columns[c] for c in sorted(columns)]''',
                language="python"
            )
        ],
        prerequisites=["trees-subtree"],
        nextLessonId="trees-advanced"
    ),
    
    Lesson(
        id="trees-advanced",
        moduleId="trees",
        title="Problemas Avanzados",
        description="House Robber III, Boundary Traversal y más.",
        order=10,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Avanzados de Árboles

## ¿Qué los hace "avanzados"?

Estos problemas combinan múltiples técnicas (DFS + DP, BFS + HashMap, etc.) y requieren pensar creativamente sobre la estructura del árbol.

## Problemas Importantes

| Problema | Técnicas | Dificultad |
|----------|----------|-----------|
| House Robber III | DFS + DP en árbol | Hard |
| Boundary Traversal | DFS izq + hojas + DFS der | Hard |
| Binary Tree Cameras | DFS + Greedy | Hard |
| Serialize/Deserialize | Preorder + Queue | Hard |
| Count Complete Tree Nodes | Binary Search + Recursión | Medium |

## House Robber III: DP en Árboles

Cada nodo retorna DOS valores: (max SI robo este nodo, max si NO robo este nodo). Es la combinación de árboles con DP que debes dominar."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# House Robber III
def rob(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (sin robar, robando)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Si robamos este nodo, no podemos robar hijos
        rob_this = node.val + left[0] + right[0]
        # Si no robamos, tomamos el máximo de cada hijo
        not_rob = max(left) + max(right)
        
        return (not_rob, rob_this)
    
    return max(dfs(root))

# Boundary of Binary Tree
def boundary_of_binary_tree(root):
    if not root:
        return []
    
    result = [root.val]
    
    def left_boundary(node):
        if not node or (not node.left and not node.right):
            return
        result.append(node.val)
        if node.left:
            left_boundary(node.left)
        else:
            left_boundary(node.right)
    
    def leaves(node):
        if not node:
            return
        if not node.left and not node.right:
            result.append(node.val)
            return
        leaves(node.left)
        leaves(node.right)
    
    def right_boundary(node):
        if not node or (not node.left and not node.right):
            return
        if node.right:
            right_boundary(node.right)
        else:
            right_boundary(node.left)
        result.append(node.val)
    
    left_boundary(root.left)
    leaves(root.left)
    leaves(root.right)
    right_boundary(root.right)
    
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="All Nodes Distance K",
                description="Encontrar todos los nodos a distancia K",
                code='''def distance_k(root, target, k):
    # Construir grafo con padres
    parent = {}
    
    def find_parent(node, par=None):
        if not node:
            return
        parent[node] = par
        find_parent(node.left, node)
        find_parent(node.right, node)
    
    find_parent(root)
    
    # BFS desde target
    queue = deque([(target, 0)])
    visited = {target}
    result = []
    
    while queue:
        node, dist = queue.popleft()
        if dist == k:
            result.append(node.val)
        elif dist < k:
            for neighbor in [node.left, node.right, parent[node]]:
                if neighbor and neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, dist + 1))
    
    return result''',
                language="python"
            )
        ],
        prerequisites=["trees-views"],
        nextLessonId=None
    ),
    
    # === MÓDULO: BST ===
    Lesson(
        id="bst-intro",
        moduleId="bst",
        title="Binary Search Trees: De Cero a Experto",
        description="Propiedades, búsqueda, inserción, eliminación, validación y problemas clásicos en BST.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=70,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Imagina una biblioteca donde los libros están organizados así: en cada estante, todos los libros a la izquierda tienen títulos que van ANTES en el alfabeto, y los de la derecha van DESPUÉS. Si buscas "Harry Potter", miras el libro del medio del estante. ¿Va antes o después? Si va después, ignoras toda la mitad izquierda. Repites con la mitad restante. En segundos encuentras tu libro entre miles. Eso es un BST: cada nodo te dice "busca a la izquierda" o "busca a la derecha", eliminando la mitad de opciones cada vez.""",
        visual_diagram="""## Binary Search Tree

**Propiedad BST:** izquierda < nodo < derecha

```
              [8]
             /   \\
          [3]     [10]
         /   \\       \\
       [1]   [6]     [14]
             / \\      /
           [4] [7]  [13]
```

**Inorder traversal:** 1, 3, 4, 6, 7, 8, 10, 13, 14 (siempre ordenado ascendente)

---

### Busqueda de 7 (paso a paso)

| Paso | Nodo actual | Comparacion | Accion |
|------|-------------|-------------|--------|
| 1 | **8** | 7 < 8 | Ir a la izquierda |
| 2 | **3** | 7 > 3 | Ir a la derecha |
| 3 | **6** | 7 > 6 | Ir a la derecha |
| 4 | **7** | 7 = 7 | **Encontrado!** (3 pasos en vez de 9) |

---

### Complejidades

| Operacion | Balanceado | Peor caso |
|-----------|------------|-----------|
| Busqueda | O(log n) | O(n) |
| Insercion | O(log n) | O(n) |
| Eliminacion | O(log n) | O(n) |

> El peor caso ocurre cuando el arbol se degenera en una lista enlazada (todos los nodos a un lado).
""",
        core_code_snippet="""# TEMPLATE: Operaciones fundamentales de BST

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Búsqueda - O(h)
def search(root, val):
    if not root or root.val == val:
        return root
    if val < root.val:
        return search(root.left, val)
    return search(root.right, val)

# Inserción - O(h)
def insert(root, val):
    if not root:
        return TreeNode(val)
    if val < root.val:
        root.left = insert(root.left, val)
    else:
        root.right = insert(root.right, val)
    return root

# Validación - O(n)
def is_valid(root, lo=float('-inf'), hi=float('inf')):
    if not root: return True
    if root.val <= lo or root.val >= hi: return False
    return is_valid(root.left, lo, root.val) and \\
           is_valid(root.right, root.val, hi)""",
        content=[
            ContentBlock(
                type="text",
                content="""# Binary Search Trees (BST)

Un BST es un árbol binario con una **regla de oro**: para cualquier nodo, **todos** los valores a su izquierda son menores, y **todos** a su derecha son mayores. Esta propiedad simple permite búsquedas ultrarrápidas.

## ¿Por qué importan los BST?

| Estructura | Búsqueda | Inserción | Ordenado |
|-----------|----------|-----------|----------|
| Array | O(n) | O(1) | No |
| Array ordenado | O(log n) | O(n) | Sí |
| **BST balanceado** | **O(log n)** | **O(log n)** | **Sí** |
| Hash Table | O(1) | O(1) | No |

Los BST combinan lo mejor de ambos mundos: búsqueda rápida Y inserción rápida, manteniendo los datos ordenados."""
            ),
            ContentBlock(
                type="text",
                content="""## La Propiedad BST (entenderla al 100%)

Para **cada nodo** en el árbol:
- Todo el subárbol izquierdo tiene valores **estrictamente menores**
- Todo el subárbol derecho tiene valores **estrictamente mayores**

### Error común de entrevista

```
        5
       / \\
      3   7
     / \\
    2   8  ← ¡ESTO NO ES BST!
```

¿Por qué no es BST? Porque 8 está en el subárbol izquierdo de 5, pero 8 > 5. No basta con que cada nodo sea mayor que su hijo izquierdo y menor que su hijo derecho. La regla aplica a **todo el subárbol**."""
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="bst-q1",
                    question="¿Cuál de estos árboles es un BST válido?",
                    options=[
                        "Root=5, izq=3(izq=1,der=6), der=8",
                        "Root=5, izq=3(izq=1,der=4), der=8(izq=6,der=9)",
                        "Root=5, izq=3(izq=1,der=4), der=8(izq=2,der=9)",
                        "Root=5, izq=7(izq=1,der=4), der=8"
                    ],
                    correct_index=1,
                    explanation="Opción B es correcta: 1<3<4<5<6<8<9. El inorder da una secuencia ascendente. La opción A falla porque 6 está en el subárbol izquierdo de 5 pero 6>5. La C falla porque 2<5 pero está a la derecha. La D falla porque 7>5 pero está a la izquierda.",
                    difficulty="medium"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Operación 1: Búsqueda en BST

La búsqueda es la operación más elegante. En cada nodo tomamos una decisión: izquierda o derecha. Eliminamos **la mitad** del árbol en cada paso.

### Paso a paso visual

Buscar 7 en el BST:
```
        8         → 7 < 8, ir izquierda
       / \\
      3   10      → 7 > 3, ir derecha
     / \\
    1   6         → 7 > 6, ir derecha
       / \\
      4   7       → ¡Encontrado! ✓
```
Solo 4 comparaciones para encontrarlo entre 9 nodos."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

# Búsqueda RECURSIVA - más elegante
def search_bst(root: TreeNode, val: int) -> TreeNode:
    """
    Busca un valor en el BST.
    En cada nodo: si val < nodo, va izquierda; si val > nodo, va derecha.
    
    Complejidad: O(h) tiempo, O(h) espacio (stack de recursión)
    """
    if not root or root.val == val:
        return root
    if val < root.val:
        return search_bst(root.left, val)
    return search_bst(root.right, val)

# Búsqueda ITERATIVA - más eficiente en espacio
def search_bst_iterative(root: TreeNode, val: int) -> TreeNode:
    """
    Misma lógica pero sin recursión.
    Complejidad: O(h) tiempo, O(1) espacio ← mejor!
    """
    while root and root.val != val:
        if val < root.val:
            root = root.left
        else:
            root = root.right
    return root'''
            ),
            ContentBlock(
                type="info",
                content="**Tip de entrevista**: Si el entrevistador pregunta 'recursivo o iterativo', di que prefieres iterativo para BST porque usa O(1) espacio en vez de O(h). Pero menciona que recursivo es más legible. Muestra que conoces ambos approaches."
            ),
            ContentBlock(
                type="text",
                content="""## Operación 2: Inserción en BST

Insertar es como buscar, pero cuando llegas a un espacio vacío (`None`), ahí colocas el nuevo nodo. El nuevo nodo **siempre será una hoja**.

### Paso a paso visual

Insertar 5 en el BST:
```
        8              8
       / \\            / \\
      3   10    →    3   10
     / \\            / \\
    1   6          1   6
                      / \\
                     5   (ya estaba: 6)
```
5 < 8 → izquierda, 5 > 3 → derecha, 5 < 6 → izquierda, `None` → ¡insertar aquí!"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Inserción en BST
def insert_bst(root: TreeNode, val: int) -> TreeNode:
    """
    Inserta un valor manteniendo la propiedad BST.
    El nuevo nodo siempre se inserta como hoja.
    
    Complejidad: O(h) tiempo, O(h) espacio (recursión)
    """
    # Caso base: encontramos el lugar vacío
    if not root:
        return TreeNode(val)
    
    # Decidir: izquierda o derecha
    if val < root.val:
        root.left = insert_bst(root.left, val)
    elif val > root.val:
        root.right = insert_bst(root.right, val)
    # Si val == root.val, depende del problema (ignorar o duplicar)
    
    return root  # Retornar el root sin cambios

# Versión iterativa
def insert_bst_iterative(root: TreeNode, val: int) -> TreeNode:
    """Inserción sin recursión - O(1) espacio extra."""
    new_node = TreeNode(val)
    if not root:
        return new_node
    
    current = root
    while True:
        if val < current.val:
            if not current.left:
                current.left = new_node
                break
            current = current.left
        else:
            if not current.right:
                current.right = new_node
                break
            current = current.right
    
    return root'''
            ),
            ContentBlock(
                type="text",
                content="""## Operación 3: Eliminación en BST (La más difícil)

Eliminar es más complejo porque debemos mantener la propiedad BST. Hay **3 casos**:

### Caso 1: Nodo hoja (sin hijos)
Simplemente lo removemos. Fácil.

### Caso 2: Nodo con UN hijo
Reemplazamos el nodo con su único hijo. Como un eslabón que se quita de una cadena.

### Caso 3: Nodo con DOS hijos (¡el tricky!)
Necesitamos un **reemplazo** que mantenga la propiedad BST. Usamos el **sucesor inorder**: el nodo más pequeño del subárbol derecho.

```
Eliminar 3:
        8                  8
       / \\                / \\
     [3]  10      →      4   10
     / \\                / 
    1   6              1   6
       /
      4
      
Sucesor inorder de 3 = 4 (el menor de su subárbol derecho)
Copiamos 4 al lugar de 3, y eliminamos el 4 original.
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Eliminación en BST - Los 3 casos
def delete_bst(root: TreeNode, key: int) -> TreeNode:
    """
    Elimina un nodo del BST y mantiene la propiedad BST.
    
    3 casos:
    1. Hoja → eliminar directamente
    2. Un hijo → reemplazar con ese hijo
    3. Dos hijos → reemplazar con sucesor inorder
    
    Complejidad: O(h) tiempo
    """
    if not root:
        return None
    
    # Buscar el nodo a eliminar
    if key < root.val:
        root.left = delete_bst(root.left, key)
    elif key > root.val:
        root.right = delete_bst(root.right, key)
    else:
        # ¡Encontrado! Ahora eliminarlo
        
        # Caso 1 y 2: 0 o 1 hijo
        if not root.left:
            return root.right
        if not root.right:
            return root.left
        
        # Caso 3: Dos hijos
        # Encontrar sucesor inorder (menor del subárbol derecho)
        successor = root.right
        while successor.left:
            successor = successor.left
        
        # Copiar valor del sucesor
        root.val = successor.val
        
        # Eliminar el sucesor de su posición original
        root.right = delete_bst(root.right, successor.val)
    
    return root'''
            ),
            ContentBlock(
                type="warning",
                content="**Error frecuente en entrevistas**: Olvidar manejar los 3 casos de eliminación. Siempre verifica: ¿sin hijos? ¿un hijo? ¿dos hijos? El caso de dos hijos es el que más preguntan."
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="bst-q2",
                    question="Al eliminar un nodo con dos hijos en un BST, ¿cuál es el sucesor inorder?",
                    options=[
                        "El hijo izquierdo del nodo",
                        "El nodo más grande del subárbol izquierdo",
                        "El nodo más pequeño del subárbol derecho",
                        "El padre del nodo"
                    ],
                    correct_index=2,
                    explanation="El sucesor inorder es el nodo más PEQUEÑO del subárbol DERECHO. Es el valor que viene 'justo después' en orden. También podríamos usar el predecesor inorder (el más GRANDE del subárbol IZQUIERDO). Ambos mantienen la propiedad BST.",
                    difficulty="medium"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Validar BST - Problema Clásico de Entrevista

Este es uno de los problemas más frecuentes. La trampa es que NO basta con verificar nodo > hijo_izquierdo y nodo < hijo_derecho.

### El enfoque correcto: Rango válido

Cada nodo tiene un **rango permitido** (min, max). Al ir a la izquierda, el max se reduce. Al ir a la derecha, el min se aumenta.

```
        8  (rango: -∞ a +∞)
       / \\
      3   10
(rango:   (rango:
-∞ a 8)  8 a +∞)
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Validar BST - El approach correcto con rangos
def is_valid_bst(root: TreeNode) -> bool:
    """
    Verifica si un árbol binario es un BST válido.
    
    Estrategia: Cada nodo tiene un rango (min, max) permitido.
    - Al ir a la izquierda: max = valor del padre
    - Al ir a la derecha: min = valor del padre
    
    Complejidad: O(n) tiempo, O(h) espacio
    """
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        # ¿El valor está fuera de rango?
        if node.val <= min_val or node.val >= max_val:
            return False
        
        # Izquierda: el max se acota al valor actual
        # Derecha: el min se acota al valor actual
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))

# ALTERNATIVA: Usando inorder traversal
def is_valid_bst_inorder(root: TreeNode) -> bool:
    """
    El inorder de un BST siempre es ascendente.
    Si encontramos un valor <= al anterior, NO es BST.
    """
    prev = float('-inf')
    
    def inorder(node):
        nonlocal prev
        if not node:
            return True
        
        if not inorder(node.left):
            return False
        
        if node.val <= prev:
            return False
        prev = node.val
        
        return inorder(node.right)
    
    return inorder(root)'''
            ),
            ContentBlock(
                type="text",
                content="""## Propiedad Clave: Inorder = Ordenado

La propiedad más poderosa de los BST: el **recorrido inorder** siempre produce los elementos en **orden ascendente**.

Esto es útil para:
- **Validar BST** (verificar que inorder es ascendente)
- **Kth smallest** (hacer inorder y parar en el k-ésimo)
- **Convertir BST a sorted array** (inorder completo)
- **Encontrar sucesor/predecesor** inorder"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Kth Smallest Element in BST
def kth_smallest(root: TreeNode, k: int) -> int:
    """
    Encuentra el k-ésimo elemento más pequeño del BST.
    
    Estrategia: Inorder traversal iterativo.
    El inorder visita nodos en orden ascendente.
    Paramos en el k-ésimo visitado.
    
    Complejidad: O(H + k) tiempo, O(H) espacio
    """
    stack = []
    current = root
    count = 0
    
    while stack or current:
        # Ir lo más a la izquierda posible
        while current:
            stack.append(current)
            current = current.left
        
        # Procesar nodo actual
        current = stack.pop()
        count += 1
        if count == k:
            return current.val  # ¡K-ésimo encontrado!
        
        # Explorar subárbol derecho
        current = current.right
    
    return -1

# Lowest Common Ancestor en BST
def lca_bst(root: TreeNode, p: TreeNode, q: TreeNode) -> TreeNode:
    """
    En un BST, el LCA es el primer nodo cuyo valor está
    entre p y q. Más simple que en árboles generales.
    
    Complejidad: O(h) tiempo, O(1) espacio
    """
    current = root
    while current:
        if p.val < current.val and q.val < current.val:
            current = current.left   # Ambos a la izquierda
        elif p.val > current.val and q.val > current.val:
            current = current.right  # Ambos a la derecha
        else:
            return current  # Se "separan" aquí → es el LCA
    return None'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="bst-q3",
                    question="En un BST con nodos [1,2,3,4,5,6,7], ¿cuál es la altura si se insertan en orden?",
                    options=[
                        "3 (árbol balanceado perfectamente)",
                        "7 (se convierte en una lista enlazada)",
                        "4 (logarítmico redondeado)",
                        "Depende de la implementación"
                    ],
                    correct_index=1,
                    explanation="Si insertas 1,2,3,4,5,6,7 en orden, cada nuevo nodo va siempre a la derecha. El árbol se degrada a una lista enlazada con altura n=7. Esto da búsqueda O(n) en vez de O(log n). Por eso existen los árboles balanceados (AVL, Red-Black).",
                    difficulty="hard"
                )
            ),
            ContentBlock(
                type="text",
                content="""## El Problema del Desbalanceo

Un BST puede degenerarse en una **lista enlazada** si los elementos se insertan en orden:

```
Insertar: 1, 2, 3, 4, 5

  1                    vs       Balanceado:
   \\                              3
    2                            / \\
     \\                          2   4
      3                        /     \\
       \\                      1       5
        4
         \\                  Altura: 3
          5                 Búsqueda: O(log n)
          
Altura: 5
Búsqueda: O(n) 😢
```

**Solución**: Usar árboles **autobalanceados** (AVL, Red-Black) que garantizan O(log n). En Python, `sorted containers` usa árboles B. En Java, `TreeMap` usa Red-Black."""
            ),
            ContentBlock(
                type="text",
                content="""## Construir BST Balanceado desde Array Ordenado

Si tienes un array ordenado y quieres el BST más balanceado posible, usa el **medio como raíz** recursivamente. Esto garantiza altura mínima = O(log n)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Convertir array ordenado a BST balanceado
def sorted_array_to_bst(nums: list[int]) -> TreeNode:
    """
    Construye un BST balanceado desde un array ordenado.
    
    Estrategia: El elemento del medio es la raíz.
    La mitad izquierda forma el subárbol izquierdo.
    La mitad derecha forma el subárbol derecho.
    
    Complejidad: O(n) tiempo, O(log n) espacio
    """
    if not nums:
        return None
    
    mid = len(nums) // 2
    root = TreeNode(nums[mid])
    root.left = sorted_array_to_bst(nums[:mid])
    root.right = sorted_array_to_bst(nums[mid + 1:])
    
    return root

# Ejemplo:
# Input: [1, 2, 3, 4, 5, 6, 7]
# Output:
#        4
#       / \\
#      2   6
#     / \\ / \\
#    1  3 5  7
# ¡Perfectamente balanceado!'''
            ),
            ContentBlock(
                type="info",
                content="**Propiedad clave**: El recorrido inorder de un BST produce los elementos en orden ascendente. Esto es la base de muchos problemas: validar BST, encontrar kth smallest, encontrar sucesor/predecesor, etc."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Kth Smallest Element in BST",
                description="Usando inorder iterativo para encontrar el k-ésimo menor",
                code='''def kth_smallest(root, k):
    stack = []
    current = root
    count = 0
    
    while stack or current:
        while current:
            stack.append(current)
            current = current.left
        
        current = stack.pop()
        count += 1
        if count == k:
            return current.val
        
        current = current.right
    
    return -1''',
                language="python"
            ),
            CodeExample(
                title="Inorder Successor in BST",
                description="Encontrar el siguiente nodo en orden (siguiente valor mayor)",
                code='''def inorder_successor(root, p):
    """
    Caso 1: Si p tiene hijo derecho → el menor del subárbol derecho
    Caso 2: Si no → el primer ancestro donde p está en subárbol izq
    """
    successor = None
    current = root
    
    while current:
        if p.val < current.val:
            successor = current  # Candidato a sucesor
            current = current.left
        else:
            current = current.right
    
    return successor

# Ejemplo: En BST [1,3,4,6,7,8,10,13,14]
# Sucesor de 6 = 7 (hijo derecho existe → menor del subárbol der)
# Sucesor de 7 = 8 (no hay hijo derecho → primer ancestro mayor)''',
                language="python"
            ),
            CodeExample(
                title="BST Iterator (Problema frecuente en entrevistas)",
                description="Implementar next() y hasNext() que recorran el BST en orden",
                code='''class BSTIterator:
    """
    Iterador para BST que devuelve valores en orden ascendente.
    next() y hasNext() deben ser O(1) amortizado.
    
    Idea: Simular inorder traversal con un stack.
    Mantener el stack con la rama izquierda pendiente.
    """
    def __init__(self, root):
        self.stack = []
        self._push_left(root)
    
    def _push_left(self, node):
        """Push todos los nodos izquierdos al stack."""
        while node:
            self.stack.append(node)
            node = node.left
    
    def next(self) -> int:
        """Retorna el siguiente menor valor."""
        node = self.stack.pop()
        # Si tiene hijo derecho, push su rama izquierda
        if node.right:
            self._push_left(node.right)
        return node.val
    
    def hasNext(self) -> bool:
        return len(self.stack) > 0

# Uso:
# it = BSTIterator(root)
# while it.hasNext():
#     print(it.next())  # Imprime en orden ascendente''',
                language="python"
            )
        ],
        quiz_questions=[
            QuizQuestion(
                id="bst-final-1",
                question="¿Cuál es la diferencia principal entre buscar el LCA en un BST vs un árbol binario general?",
                options=[
                    "No hay diferencia, se usa el mismo algoritmo",
                    "En BST podemos usar la propiedad de ordenamiento para decidir si ir izquierda o derecha, haciéndolo O(h) sin visitar todos los nodos",
                    "En BST es más lento porque hay que verificar la propiedad BST",
                    "Solo se puede encontrar LCA en BST, no en árboles generales"
                ],
                correct_index=1,
                explanation="En un BST, si ambos valores son menores que el nodo actual, el LCA está a la izquierda. Si ambos son mayores, está a la derecha. Si se 'separan' (uno menor, otro mayor), el nodo actual ES el LCA. Esto permite O(h) sin visitar todo el árbol, mientras que en un árbol general necesitas O(n).",
                difficulty="hard"
            ),
            QuizQuestion(
                id="bst-final-2",
                question="¿Cuál operación de BST es la más compleja de implementar?",
                options=[
                    "Búsqueda",
                    "Inserción",
                    "Eliminación",
                    "Validación"
                ],
                correct_index=2,
                explanation="La eliminación tiene 3 casos diferentes que manejar (hoja, un hijo, dos hijos). El caso de dos hijos requiere encontrar el sucesor inorder, copiar su valor, y luego eliminar el sucesor recursivamente. Es el caso más preguntado en entrevistas precisamente por su complejidad.",
                difficulty="easy"
            )
        ],
        prerequisites=["trees-intro"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Heaps ===
    Lesson(
        id="heaps-intro",
        moduleId="heaps",
        title="Heaps y Priority Queues: Fundamentos",
        description="Entiende cómo funcionan los heaps internamente, domina heapq de Python y aprende cuándo usarlos.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Imagina una sala de emergencias. No atienden por orden de llegada, sino por **gravedad**: el paciente más grave siempre pasa primero, sin importar cuándo llegó. Eso es un heap (o priority queue): una estructura que siempre te da el elemento más importante (el menor o mayor) en O(1), y cuando lo extraes, el siguiente más importante sube automáticamente. Es como una fila mágica que siempre se reorganiza para que el VIP esté al frente.""",
        visual_diagram="""## Min-Heap

**Propiedad:** padre <= hijos (el menor siempre arriba)

### Representacion visual

```
  Arbol:                     Array interno:
        [1]                  [1, 3, 2, 7, 6, 4, 5]
       /   \\                  0  1  2  3  4  5  6
     [3]   [2]
    /  \\   / \\              Padre de i: (i-1)//2
  [7] [6][4] [5]            Hijo izq:   2*i + 1
                             Hijo der:   2*i + 2
```

---

### Operaciones

| Operacion | Complejidad | Python (`heapq`) |
|-----------|-------------|-------------------|
| Insertar | O(log n) | `heappush(h, val)` |
| Extraer min | O(log n) | `heappop(h)` |
| Ver min | O(1) | `h[0]` |
| Heapify | O(n) | `heapify(lista)` |
| Push + Pop | O(log n) | `heappushpop(h, val)` |

> **Importante:** Python SOLO tiene min-heap. Para max-heap: insertar negativos (`-val`).
""",
        core_code_snippet="""import heapq

# Min-heap básico
h = []
heapq.heappush(h, 5)      # Insertar
heapq.heappush(h, 1)
heapq.heappush(h, 3)
print(h[0])                # Ver mínimo: 1
smallest = heapq.heappop(h) # Extraer mínimo: 1

# Max-heap (truco con negativos)
max_h = []
heapq.heappush(max_h, -5)
heapq.heappush(max_h, -1)
largest = -heapq.heappop(max_h)  # 5

# Heapify: convertir lista en heap O(n)
nums = [3, 1, 4, 1, 5, 9]
heapq.heapify(nums)  # nums ahora es un heap válido

# Top K: mantener heap de tamaño k
def top_k(nums, k):
    heap = nums[:k]
    heapq.heapify(heap)
    for n in nums[k:]:
        if n > heap[0]:
            heapq.heapreplace(heap, n)
    return heap""",
        content=[
            ContentBlock(
                type="text",
                content="""# Heaps y Priority Queues

Un **heap** (o montículo) es un árbol binario **completo** con una propiedad especial:
- **Min-heap**: cada padre es ≤ que sus hijos → el mínimo está en la raíz
- **Max-heap**: cada padre es ≥ que sus hijos → el máximo está en la raíz

## ¿Cuándo necesitas un Heap?

| Problema | ¿Por qué Heap? |
|----------|----------------|
| "Encuentra los K más grandes/pequeños" | Heap de tamaño K |
| "Mediana en stream de datos" | Dos heaps |
| "Merge K listas ordenadas" | Heap de K elementos |
| "Siguiente evento más cercano" | Priority Queue |
| "Task scheduling" | Priority Queue |

### Regla rápida
> Si ves **"K"** o **"mayor/menor"** en el problema, piensa en Heap."""
            ),
            ContentBlock(
                type="text",
                content="""## ¿Cómo funciona internamente?

El heap se almacena como un **array**, pero lo pensamos como un árbol:

```
Array:  [1, 3, 2, 7, 6, 4, 5]
Index:   0  1  2  3  4  5  6

Árbol:         1          ← índice 0
              / \\
             3   2        ← índices 1, 2
            / \\ / \\
           7  6 4  5      ← índices 3, 4, 5, 6
```

**Fórmulas de navegación** (memorízalas):
- Padre de `i`: `(i - 1) // 2`
- Hijo izquierdo de `i`: `2 * i + 1`
- Hijo derecho de `i`: `2 * i + 2`

Cuando insertas, el elemento "sube" hasta encontrar su lugar (sift up).
Cuando extraes el mínimo, el último elemento se pone en la raíz y "baja" (sift down)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import heapq

# =============================================
# OPERACIONES BÁSICAS DE HEAPQ
# =============================================

# 1. Crear heap desde lista - O(n)
nums = [3, 1, 4, 1, 5, 9, 2, 6]
heapq.heapify(nums)  # Modifica in-place
print(nums)  # [1, 1, 2, 6, 5, 9, 4, 3] - propiedad heap

# 2. Insertar elemento - O(log n)
heapq.heappush(nums, 0)
print(nums[0])  # 0 - el nuevo mínimo

# 3. Extraer mínimo - O(log n)
smallest = heapq.heappop(nums)
print(smallest)  # 0

# 4. Ver mínimo sin extraer - O(1)
print(nums[0])  # 1

# 5. Push + Pop en una operación - O(log n)
# Más eficiente que hacer push y pop por separado
result = heapq.heappushpop(nums, 3)  # Push 3, luego pop min
print(result)  # 1 (el min anterior)

# 6. Top K y Bottom K
print(heapq.nlargest(3, [3, 1, 4, 1, 5, 9]))   # [9, 5, 4]
print(heapq.nsmallest(3, [3, 1, 4, 1, 5, 9]))   # [1, 1, 3]'''
            ),
            ContentBlock(
                type="warning",
                content="**Python solo tiene min-heap**. Para max-heap, usa el truco de los negativos: inserta `-val` y al extraer niega el resultado: `-heapq.heappop(h)`. Para tuplas, Python compara por el primer elemento, luego el segundo, etc."
            ),
            ContentBlock(
                type="text",
                content="""## El truco del Max-Heap en Python

Como `heapq` solo hace min-heap, para max-heap multiplicamos por -1:

```python
import heapq

# MAX-HEAP usando negativos
max_heap = []
heapq.heappush(max_heap, -5)   # Insertar 5
heapq.heappush(max_heap, -1)   # Insertar 1
heapq.heappush(max_heap, -8)   # Insertar 8

# Extraer máximo
largest = -heapq.heappop(max_heap)  # 8
print(largest)  # 8

# Ver máximo
print(-max_heap[0])  # 5
```"""
            ),
            ContentBlock(
                type="text",
                content="""## Heaps con Tuplas - Prioridad Custom

Cuando necesitas prioridad por algo más que el valor numérico, usa **tuplas**. Python compara tuplas elemento por elemento:

```python
# (prioridad, desempate, dato)
heap = []
heapq.heappush(heap, (3, 0, "tarea C"))
heapq.heappush(heap, (1, 1, "tarea A"))
heapq.heappush(heap, (1, 2, "tarea B"))

# Sale primero: (1, 1, "tarea A") - menor prioridad, luego desempate
```

El segundo elemento (desempate) es crucial cuando las prioridades son iguales y los datos no son comparables."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Kth Largest Element - El problema más clásico de heaps
import heapq

def find_kth_largest(nums: list[int], k: int) -> int:
    """
    Encuentra el k-ésimo elemento más grande del array.
    
    Estrategia: Mantener un min-heap de tamaño k.
    Al final, la raíz del heap es el k-ésimo más grande.
    
    ¿Por qué funciona?
    - El heap guarda los K más grandes vistos hasta ahora
    - Al insertar uno nuevo, si es mayor que el mínimo del heap,
      reemplaza al más pequeño de los K grandes
    - El mínimo del heap = el k-ésimo más grande
    
    Complejidad: O(n log k) tiempo, O(k) espacio
    Mejor que ordenar: O(n log n)
    """
    heap = []
    for num in nums:
        heapq.heappush(heap, num)
        if len(heap) > k:
            heapq.heappop(heap)  # Eliminar el menor
    
    return heap[0]  # El k-ésimo más grande

# Versión optimizada con heapify
def find_kth_largest_v2(nums: list[int], k: int) -> int:
    """Alternativa: negar y usar min-heap"""
    return heapq.nlargest(k, nums)[-1]

# Ejemplo
print(find_kth_largest([3,2,1,5,6,4], 2))  # 5
# Heap pasa por: [3] → [2,3] → [1,2,3]→pop 1 → [2,3] 
# → [2,3,5]→pop 2 → [3,5] → [3,5,6]→pop 3 → [5,6]
# → [4,5,6]→pop 4 → [5,6] → respuesta: 5'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="heap-q1",
                    question="Para encontrar el k-ésimo MAYOR elemento, ¿qué tipo de heap usas y de qué tamaño?",
                    options=[
                        "Max-heap de tamaño n",
                        "Min-heap de tamaño k",
                        "Max-heap de tamaño k",
                        "Min-heap de tamaño n-k"
                    ],
                    correct_index=1,
                    explanation="Usamos un min-heap de tamaño k. El heap contiene los k elementos más grandes vistos hasta ahora. La raíz (el menor de esos k grandes) es exactamente el k-ésimo más grande. Si usáramos max-heap de tamaño n, sería O(n log n) — igual que ordenar.",
                    difficulty="medium"
                )
            ),
            ContentBlock(
                type="info",
                content="**Cuándo usar `nlargest`/`nsmallest` vs heap manual**: Para k pequeño comparado con n, `nlargest(k, nums)` es eficiente O(n log k). Para k cercano a n, es mejor `sorted(nums)`. Para k=1, usa simplemente `max()` o `min()` que son O(n)."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Top K Frequent Elements",
                description="Encontrar los K elementos que más se repiten. Combina Counter + Heap.",
                code='''from collections import Counter
import heapq

def top_k_frequent(nums: list[int], k: int) -> list[int]:
    """
    Retorna los k elementos más frecuentes.
    
    Estrategia: Contar frecuencias + heap de tamaño k
    Complejidad: O(n log k)
    """
    count = Counter(nums)
    
    # Min-heap de tamaño k por frecuencia
    # Tupla: (frecuencia, número)
    return heapq.nlargest(k, count.keys(), key=count.get)

# O manual para entender mejor:
def top_k_frequent_manual(nums, k):
    count = Counter(nums)
    heap = []  # min-heap de (freq, num)
    
    for num, freq in count.items():
        heapq.heappush(heap, (freq, num))
        if len(heap) > k:
            heapq.heappop(heap)
    
    return [num for freq, num in heap]

print(top_k_frequent([1,1,1,2,2,3], 2))  # [1, 2]''',
                language="python"
            ),
            CodeExample(
                title="Sort Characters By Frequency",
                description="Ordenar un string por frecuencia de caracteres (de mayor a menor)",
                code='''from collections import Counter
import heapq

def frequency_sort(s: str) -> str:
    """
    Ordena caracteres por frecuencia descendente.
    "tree" → "eert" o "eetr"
    
    Complejidad: O(n log k) donde k = caracteres únicos
    """
    count = Counter(s)
    
    # Max-heap por frecuencia (negativos)
    heap = [(-freq, char) for char, freq in count.items()]
    heapq.heapify(heap)
    
    result = []
    while heap:
        freq, char = heapq.heappop(heap)
        result.append(char * (-freq))
    
    return ''.join(result)

print(frequency_sort("tree"))    # "eetr"
print(frequency_sort("cccaaa"))  # "aaaccc" o "cccaaa"''',
                language="python"
            )
        ],
        quiz_questions=[
            QuizQuestion(
                id="heap-final-1",
                question="heapq.heapify(nums) tiene complejidad O(n), no O(n log n). ¿Por qué?",
                options=[
                    "Porque solo mira la raíz",
                    "Porque hace sift-down desde la mitad del array hacia arriba, y la mayoría de nodos están cerca de las hojas donde el sift-down es barato",
                    "Porque usa un algoritmo especial que no se puede explicar fácilmente",
                    "Porque Python está optimizado internamente"
                ],
                correct_index=1,
                explanation="Heapify usa sift-down empezando desde el penúltimo nivel. La mitad de los nodos (hojas) no necesitan moverse. Un cuarto se mueve máximo 1 nivel, un octavo 2 niveles, etc. La suma total es O(n). Si hicieras n inserciones individuales (sift-up), sería O(n log n).",
                difficulty="hard"
            )
        ],
        prerequisites=[],
        nextLessonId="heaps-aplicaciones"
    ),
    
    Lesson(
        id="heaps-aplicaciones",
        moduleId="heaps",
        title="Aplicaciones Avanzadas de Heaps",
        description="Merge k sorted lists, running median, task scheduling y más patrones con heaps.",
        order=2,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=65,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Imagina que diriges un restaurante con 5 cocineros. Cada cocinero tiene una fila de pedidos ordenados por hora. Necesitas servir TODOS los platos en orden. ¿Cómo? Miras el primer plato de cada cocinero, eliges el más urgente, lo sirves, y miras el siguiente de ESE cocinero. El heap mantiene los 5 'primeros platos' y siempre te dice cuál va primero. Para la mediana, imagina dos filas: una de los bajos y otra de los altos. El más alto de los bajos y el más bajo de los altos te dan la mediana al instante.""",
        visual_diagram="""## Patrones de Heap en Entrevistas

### 1. Top K Elements (min-heap de tamano k)

```
  Input: [3, 1, 5, 2, 4]   k = 3

  Heap mantiene los 3 mas grandes: [3, 4, 5]
  Raiz = 3 = el 3er mas grande
```

---

### 2. Merge K Sorted (min-heap de k cabezas)

```
  Lista 1: [1, 4, 7]  ─┐
  Lista 2: [2, 5, 8]  ─┼─►  Heap: [1, 2, 3]  →  saca 1
  Lista 3: [3, 6, 9]  ─┘    mete 4 de Lista 1
                             Heap: [2, 3, 4]  →  saca 2
```

---

### 3. Running Median (dos heaps)

```
  max-heap (mitad baja)  |  min-heap (mitad alta)
       [3, 1]            |       [5, 7]
        ↑ top=3          |        ↑ top=5

  Mediana = (3 + 5) / 2 = 4.0
```

---

| Patron | Estructura | Complejidad | Uso tipico |
|--------|-----------|-------------|------------|
| Top K | Min-heap de tamano k | O(n log k) | K mas grandes/pequenos |
| Merge K | Min-heap de k cabezas | O(N log k) | Unir K listas ordenadas |
| Mediana | Dos heaps balanceados | O(log n) por insercion | Mediana en streaming |
""",
        content=[
            ContentBlock(
                type="text",
                content="""# Aplicaciones Avanzadas de Heaps

Los heaps aparecen constantemente en entrevistas FAANG. Aquí cubrimos los **3 patrones más importantes** que debes dominar.

## Patrón 1: Merge K Sorted Lists

**Problema**: Tienes K listas ya ordenadas. Mézclalas en una sola lista ordenada.

**Idea**: Mantener un heap con los K elementos "cabeza" (uno de cada lista). Extraer el menor, y meter el siguiente de esa misma lista.

**¿Por qué heap?** Sin heap necesitarías buscar el mínimo entre K listas en cada paso = O(K). Con heap, extraer mínimo y insertar siguiente = O(log K)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import heapq

def merge_k_lists(lists: list[list[int]]) -> list[int]:
    """
    Merge K listas ordenadas en una sola lista ordenada.
    
    Heap contiene tuplas: (valor, índice_lista, índice_elemento)
    - valor: para comparar prioridad
    - índice_lista: saber de qué lista viene
    - índice_elemento: saber cuál es el siguiente
    
    Complejidad: O(N log K) donde N = total de elementos
    Espacio: O(K) para el heap
    """
    heap = []
    
    # Inicializar: meter el primer elemento de cada lista
    for i, lst in enumerate(lists):
        if lst:  # Ignorar listas vacías
            heapq.heappush(heap, (lst[0], i, 0))
    
    result = []
    while heap:
        val, list_idx, elem_idx = heapq.heappop(heap)
        result.append(val)
        
        # Si esa lista tiene más elementos, meter el siguiente
        next_idx = elem_idx + 1
        if next_idx < len(lists[list_idx]):
            next_val = lists[list_idx][next_idx]
            heapq.heappush(heap, (next_val, list_idx, next_idx))
    
    return result

# Ejemplo
lists = [[1,4,5], [1,3,4], [2,6]]
print(merge_k_lists(lists))
# Paso a paso:
# Heap: [(1,0,0), (1,1,0), (2,2,0)] → pop (1,0,0) → push (4,0,1)
# Heap: [(1,1,0), (2,2,0), (4,0,1)] → pop (1,1,0) → push (3,1,1)
# ... → [1,1,2,3,4,4,5,6]'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="heap-app-q1",
                    question="En Merge K Sorted Lists, ¿cuál es la complejidad temporal si hay N elementos totales y K listas?",
                    options=[
                        "O(N × K) porque revisamos K listas para cada elemento",
                        "O(N log N) porque ordenamos todos los elementos",
                        "O(N log K) porque cada operación de heap es O(log K)",
                        "O(K log N) porque procesamos K listas"
                    ],
                    correct_index=2,
                    explanation="Cada uno de los N elementos se inserta y se extrae del heap exactamente una vez. El heap tiene máximo K elementos, así que cada operación es O(log K). Total: N × O(log K) = O(N log K).",
                    difficulty="medium"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Patrón 2: Running Median (Dos Heaps)

**Problema**: Datos llegan uno a uno. Después de cada dato, calcula la mediana de todos los datos vistos.

**Idea genial**: Usar **dos heaps** que dividen los datos a la mitad:
- `max_heap` (mitad baja): guarda la mitad menor de los datos
- `min_heap` (mitad alta): guarda la mitad mayor de los datos

La mediana es el promedio de los tops de ambos heaps (o el top del mayor si hay cantidad impar).

```
Datos: [5, 2, 8, 1, 9]

Después de 5:  max=[5]      min=[]        mediana=5
Después de 2:  max=[2]      min=[5]       mediana=3.5
Después de 8:  max=[5,2]    min=[8]       mediana=5
Después de 1:  max=[2,1]    min=[5,8]     mediana=3.5
Después de 9:  max=[5,2,1]  min=[8,9]     mediana=5
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import heapq

class MedianFinder:
    """
    Calcula la mediana de un stream de datos en O(log n) por inserción.
    
    Dos heaps:
    - small: max-heap (negativos) → mitad inferior
    - large: min-heap → mitad superior
    
    Invariante: len(small) == len(large) o len(small) == len(large) + 1
    La mediana está en el top de ambos (o solo small si impar)
    """
    def __init__(self):
        self.small = []  # max-heap (almacena negativos)
        self.large = []  # min-heap
    
    def addNum(self, num: int) -> None:
        """Inserta un número manteniendo el balance. O(log n)"""
        # Paso 1: Siempre insertar primero en small
        heapq.heappush(self.small, -num)
        
        # Paso 2: Mover el mayor de small a large
        # (garantiza que small solo tiene los menores)
        heapq.heappush(self.large, -heapq.heappop(self.small))
        
        # Paso 3: Rebalancear si large tiene más elementos
        if len(self.large) > len(self.small):
            heapq.heappush(self.small, -heapq.heappop(self.large))
    
    def findMedian(self) -> float:
        """Obtiene la mediana actual. O(1)"""
        if len(self.small) > len(self.large):
            return -self.small[0]  # Impar: el medio está en small
        return (-self.small[0] + self.large[0]) / 2  # Par: promedio

# Ejemplo de uso
mf = MedianFinder()
mf.addNum(1)  # [1]          → mediana = 1
mf.addNum(2)  # [1, 2]       → mediana = 1.5
mf.addNum(3)  # [1, 2, 3]    → mediana = 2
print(mf.findMedian())  # 2.0'''
            ),
            ContentBlock(
                type="info",
                content="**¿Por qué 3 pasos?** El truco es brillante: 1) Insertamos en small, 2) Movemos el mayor de small a large (esto garantiza que el mayor de small ≤ menor de large), 3) Si large quedó más grande, devolvemos uno. Esto mantiene el invariante automáticamente."
            ),
            ContentBlock(
                type="text",
                content="""## Patrón 3: Task Scheduler

**Problema**: Tienes tareas con frecuencias y un cooldown entre tareas iguales. ¿Cuánto tiempo mínimo necesitas?

**Idea**: Siempre procesa la tarea más frecuente primero (greedy). Usa un max-heap de frecuencias y una cola de enfriamiento."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import heapq
from collections import Counter, deque

def least_interval(tasks: list[str], n: int) -> int:
    """
    Calcula el mínimo de intervalos para completar todas las tareas.
    
    Estrategia Greedy + Heap:
    1. Siempre ejecutar la tarea más frecuente disponible
    2. Cuando una tarea entra en cooldown, ponerla en espera
    3. Si no hay tarea disponible, esperar (idle)
    
    Complejidad: O(T × log 26) ≈ O(T) donde T = total de tareas
    """
    count = Counter(tasks)
    # Max-heap de frecuencias (negativas)
    max_heap = [-cnt for cnt in count.values()]
    heapq.heapify(max_heap)
    
    time = 0
    cooldown = deque()  # (frecuencia_restante, tiempo_disponible)
    
    while max_heap or cooldown:
        time += 1
        
        if max_heap:
            # Ejecutar la tarea más frecuente
            freq = heapq.heappop(max_heap) + 1  # +1 porque es negativo
            if freq != 0:  # Aún tiene tareas pendientes
                cooldown.append((freq, time + n))
        
        # ¿Alguna tarea sale del cooldown?
        if cooldown and cooldown[0][1] == time:
            freq, _ = cooldown.popleft()
            heapq.heappush(max_heap, freq)
    
    return time

# Ejemplo: tasks=["A","A","A","B","B","B"], n=2
# A → B → idle → A → B → idle → A → B = 8
print(least_interval(["A","A","A","B","B","B"], 2))  # 8'''
            ),
            ContentBlock(
                type="warning",
                content="**Trampa en entrevistas con heaps**: Cuando usas tuplas en el heap, Python compara elemento por elemento. Si el primer elemento es igual, compara el segundo. Si el segundo no es comparable (ej: un objeto), ¡crashea! Siempre agrega un desempate numérico como segundo elemento."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Find Median from Data Stream (alternativa con sortedcontainers)",
                description="Versión con SortedList para comparar approaches",
                code='''# Si tienes acceso a sortedcontainers (no siempre en entrevistas)
# from sortedcontainers import SortedList
# Pero dominar la versión con dos heaps es esencial

# Versión simple pero O(n) por inserción (para comparar):
class MedianFinderSimple:
    def __init__(self):
        self.nums = []
    
    def addNum(self, num):
        # Insertar manteniendo orden - O(n) con bisect
        import bisect
        bisect.insort(self.nums, num)
    
    def findMedian(self):
        n = len(self.nums)
        if n % 2 == 1:
            return self.nums[n // 2]
        return (self.nums[n//2 - 1] + self.nums[n//2]) / 2

# La versión con dos heaps es mejor:
# addNum: O(log n) vs O(n)
# findMedian: O(1) vs O(1)''',
                language="python"
            ),
            CodeExample(
                title="Reorganize String (heap greedy)",
                description="Reorganizar un string para que no haya dos caracteres iguales adyacentes",
                code='''import heapq
from collections import Counter

def reorganize_string(s: str) -> str:
    """
    Reorganiza s para que ningún caracter se repita adyacente.
    Retorna "" si es imposible.
    
    Greedy: siempre colocar el caracter más frecuente que no
    sea igual al último colocado.
    """
    count = Counter(s)
    
    # Verificar si es posible
    max_freq = max(count.values())
    if max_freq > (len(s) + 1) // 2:
        return ""
    
    # Max-heap de (-frecuencia, caracter)
    heap = [(-freq, char) for char, freq in count.items()]
    heapq.heapify(heap)
    
    result = []
    prev_freq, prev_char = 0, ''
    
    while heap:
        freq, char = heapq.heappop(heap)
        result.append(char)
        
        # Re-insertar el caracter anterior si aún tiene frecuencia
        if prev_freq < 0:
            heapq.heappush(heap, (prev_freq, prev_char))
        
        # Guardar actual como "anterior" para próxima iteración
        prev_freq = freq + 1  # +1 porque usamos negativos
        prev_char = char
    
    return ''.join(result)

print(reorganize_string("aab"))    # "aba"
print(reorganize_string("aaab"))   # "" (imposible)''',
                language="python"
            )
        ],
        quiz_questions=[
            QuizQuestion(
                id="heap-app-final-1",
                question="En el patrón de Running Median con dos heaps, ¿qué invariante debemos mantener?",
                options=[
                    "Ambos heaps deben tener el mismo tamaño siempre",
                    "El max-heap (small) debe tener igual o un elemento más que el min-heap (large), y max(small) ≤ min(large)",
                    "El min-heap debe contener solo números positivos",
                    "Los heaps deben rebalancearse solo cuando se pide la mediana"
                ],
                correct_index=1,
                explanation="El invariante clave es: 1) len(small) == len(large) o len(small) == len(large)+1, y 2) todo elemento en small ≤ todo elemento en large. Esto nos permite encontrar la mediana en O(1): si impar, es el top de small; si par, es el promedio de ambos tops.",
                difficulty="hard"
            )
        ],
        prerequisites=["heaps-intro"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Graphs ===
    Lesson(
        id="graphs-intro",
        moduleId="graphs",
        title="Introducción a Grafos",
        description="Representación, BFS y DFS en grafos.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Piensa en un mapa de ciudades conectadas por carreteras. Cada ciudad es un 'nodo' y cada carretera es una 'arista'. Si quieres ir de tu ciudad a otra, necesitas encontrar un camino. BFS (búsqueda por anchura) es como una onda expansiva: primero exploras las ciudades vecinas, luego las vecinas de las vecinas, etc. Encuentra el camino más corto en número de pasos. DFS (búsqueda en profundidad) es como un explorador aventurero: sigue un camino hasta el final antes de retroceder y probar otro.""",
        visual_diagram="""## Grafos: BFS vs DFS

### Estructura del grafo

```
      [A] ─── [B]
       |  \\    |
       |   \\ [C]
       |      |
      [D] ─── [E]
```

---

### BFS (Busqueda por anchura) - desde A

| Paso | Cola | Visitando | Visitados |
|------|------|-----------|-----------|
| 1 | `[A]` | **A** | {A} |
| 2 | `[B, D, C]` | **B** | {A, B} |
| 3 | `[D, C]` | **D** | {A, B, D} |
| 4 | `[C, E]` | **C** | {A, B, D, C} |
| 5 | `[E]` | **E** | {A, B, D, C, E} |

> BFS explora por **niveles** (onda expansiva). Encuentra el camino mas corto.

---

### DFS (Busqueda en profundidad) - desde A

| Paso | Stack | Visitando | Visitados |
|------|-------|-----------|-----------|
| 1 | `[A]` | **A** | {A} |
| 2 | `[B]` | **B** | {A, B} |
| 3 | `[C]` | **C** | {A, B, C} |
| 4 | `[E]` | **E** | {A, B, C, E} |
| 5 | `[D]` | **D** | {A, B, C, E, D} |

> DFS explora **en profundidad** (un camino hasta el final, luego retrocede).

---

| Caracteristica | BFS | DFS |
|---------------|-----|-----|
| Estructura | Cola (Queue) | Stack/Recursion |
| Camino mas corto | Si (no ponderado) | No garantizado |
| Espacio | O(ancho del grafo) | O(profundidad) |
| Uso tipico | Shortest path, niveles | Ciclos, componentes, topological sort |
""",
        content=[
            ContentBlock(
                type="text",
                content="""# Introducción a Grafos

Un grafo es un conjunto de nodos (vértices) conectados por aristas (edges).

## Tipos
- **Dirigido vs No dirigido**
- **Ponderado vs No ponderado**
- **Cíclico vs Acíclico**

## Representaciones
- **Adjacency List**: Más común, O(V + E) espacio
- **Adjacency Matrix**: O(V^2) espacio, O(1) lookup"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Adjacency List
graph = {
    'A': ['B', 'C'],
    'B': ['A', 'D', 'E'],
    'C': ['A', 'F'],
    'D': ['B'],
    'E': ['B', 'F'],
    'F': ['C', 'E']
}

# BFS - Usa Queue
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    result = []
    
    while queue:
        node = queue.popleft()
        result.append(node)
        
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
    
    return result

# DFS - Usa Stack o Recursión
def dfs(graph, start, visited=None):
    if visited is None:
        visited = set()
    
    visited.add(start)
    result = [start]
    
    for neighbor in graph[start]:
        if neighbor not in visited:
            result.extend(dfs(graph, neighbor, visited))
    
    return result

print(bfs(graph, 'A'))  # ['A', 'B', 'C', 'D', 'E', 'F']
print(dfs(graph, 'A'))  # ['A', 'B', 'D', 'E', 'F', 'C']'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Number of Islands",
                description="Contar islas en una matriz",
                code='''def num_islands(grid):
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            grid[r][c] == '0'):
            return
        grid[r][c] = '0'  # Marcar visitado
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="graphs-problemas"
    ),
    
    Lesson(
        id="graphs-problemas",
        moduleId="graphs",
        title="Problemas de Grafos",
        description="Clone graph, course schedule, pacific atlantic.",
        order=2,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Comunes de Grafos

## Los 4 Patrones Principales

### 1. Matrix as Graph (Islas)
Las matrices 2D son grafos implícitos: cada celda es un nodo, y sus vecinos (arriba, abajo, izquierda, derecha) son las aristas.

### 2. Topological Sort (Dependencias)
¿En qué orden tomar cursos con prerequisitos? Topological sort ordena un DAG (grafo dirigido acíclico) respetando las dependencias.

### 3. Cycle Detection (Ciclos)
¿Hay un ciclo en el grafo? Usamos coloreo de nodos:
- **Blanco (0)**: No visitado
- **Gris (1)**: En proceso (en la pila de recursión)
- **Negro (2)**: Completamente procesado
Si llegamos a un nodo gris → ¡hay ciclo!

### 4. Clone Graph (Copia profunda)
Copiar un grafo nodo por nodo usando un hash map para evitar visitar el mismo nodo dos veces.

## Tip para Entrevistas
> Cuando veas una **matriz** con 0s y 1s, piensa: "¿Es un problema de grafos (islas, caminos, componentes conectados)?" Casi siempre lo es."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Course Schedule - Detectar ciclo en grafo dirigido
def can_finish(num_courses, prerequisites):
    graph = {i: [] for i in range(num_courses)}
    for course, prereq in prerequisites:
        graph[prereq].append(course)
    
    # 0: no visitado, 1: visitando, 2: visitado
    state = [0] * num_courses
    
    def has_cycle(course):
        if state[course] == 1:  # Ciclo detectado
            return True
        if state[course] == 2:  # Ya procesado
            return False
        
        state[course] = 1  # Marcamos como visitando
        
        for next_course in graph[course]:
            if has_cycle(next_course):
                return True
        
        state[course] = 2  # Marcamos como visitado
        return False
    
    for course in range(num_courses):
        if has_cycle(course):
            return False
    return True

print(can_finish(2, [[1,0]]))     # True
print(can_finish(2, [[1,0],[0,1]]))  # False - ciclo'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Clone Graph",
                description="Clonar un grafo completo",
                code='''def clone_graph(node):
    if not node:
        return None
    
    cloned = {}
    
    def dfs(node):
        if node in cloned:
            return cloned[node]
        
        copy = Node(node.val)
        cloned[node] = copy
        
        for neighbor in node.neighbors:
            copy.neighbors.append(dfs(neighbor))
        
        return copy
    
    return dfs(node)''',
                language="python"
            )
        ],
        prerequisites=["graphs-intro"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Recursion & Backtracking ===
    Lesson(
        id="recursion-intro",
        moduleId="recursion-backtracking",
        title="Recursión y Backtracking",
        description="Fundamentos de recursión y técnica de backtracking.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""La recursión es como las muñecas rusas (matryoshkas): abres una y dentro hay otra más pequeña, y dentro otra, y otra... hasta llegar a la más pequeña que no se abre. Cada muñeca es una versión más simple del mismo problema. Backtracking agrega una idea: imagina un laberinto. Avanzas por un camino, y si llegas a un callejón sin salida, retrocedes al último cruce y pruebas otro camino. Exploras todas las posibilidades de forma ordenada, descartando las que no funcionan.""",
        visual_diagram="""## Recursion y Backtracking

### Recursion: arbol de llamadas de factorial(4)

```
  factorial(4)
  └── 4 * factorial(3)
       └── 3 * factorial(2)
            └── 2 * factorial(1)
                 └── return 1    ← caso base
                return 2 * 1 = 2
           return 3 * 2 = 6
      return 4 * 6 = 24
```

---

### Backtracking: generar subsets de [1, 2, 3]

```
                     []
            /        |        \\
         [1]        [2]       [3]
        /   \\        |
     [1,2] [1,3]   [2,3]
       |
    [1,2,3]
```

> En cada nodo decidimos: **incluir o no incluir** el siguiente elemento. Si una rama no lleva a solucion valida, **retrocedemos** (backtrack).

---

### Patron de Backtracking

| Paso | Accion | Descripcion |
|------|--------|-------------|
| 1 | **Elegir** | Tomar una decision (agregar elemento) |
| 2 | **Explorar** | Llamar recursivamente con la decision |
| 3 | **Deshacer** | Quitar la decision (backtrack) |
| 4 | **Repetir** | Probar la siguiente opcion |

### Cuando usar cada uno

| Patron | Senal | Ejemplo |
|--------|-------|---------|
| Recursion pura | Estructura se divide en subproblemas | Fibonacci, factorial |
| Backtracking | "Genera todas las combinaciones/permutaciones" | Subsets, N-Queens |
| Backtracking + poda | "Encuentra si existe una solucion valida" | Sudoku solver |
""",
        content=[
            ContentBlock(
                type="text",
                content="""# Recursión y Backtracking

## Recursión
Una función que se llama a sí misma. Necesita:
1. **Caso base**: Cuándo parar
2. **Caso recursivo**: Cómo reducir el problema

## Backtracking
Explorar todas las soluciones posibles, "volviendo atrás" cuando una rama no es válida."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Recursión básica: Factorial
def factorial(n):
    if n <= 1:  # Caso base
        return 1
    return n * factorial(n - 1)  # Caso recursivo

# Backtracking: Generar todas las combinaciones
def combinations(n, k):
    result = []
    
    def backtrack(start, combo):
        if len(combo) == k:
            result.append(combo[:])
            return
        
        for i in range(start, n + 1):
            combo.append(i)           # Elegir
            backtrack(i + 1, combo)   # Explorar
            combo.pop()               # Deshacer (backtrack)
    
    backtrack(1, [])
    return result

print(combinations(4, 2))
# [[1,2], [1,3], [1,4], [2,3], [2,4], [3,4]]'''
            ),
            ContentBlock(
                type="info",
                content="**Patrón Backtracking**: 1) Elegir, 2) Explorar, 3) Deshacer. Siempre deshaz los cambios después de explorar una rama."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Permutations",
                description="Generar todas las permutaciones",
                code='''def permutations(nums):
    result = []
    
    def backtrack(path, remaining):
        if not remaining:
            result.append(path[:])
            return
        
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i+1:])
            path.pop()
    
    backtrack([], nums)
    return result

print(permutations([1, 2, 3]))
# [[1,2,3], [1,3,2], [2,1,3], [2,3,1], [3,1,2], [3,2,1]]''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="backtracking-intro"
    ),
    
    Lesson(
        id="backtracking-intro",
        moduleId="recursion-backtracking",
        title="Problemas de Backtracking",
        description="N-Queens, Sudoku solver, subsets, combination sum.",
        order=2,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Clásicos de Backtracking

## Template General
```python
def backtrack(state):
    if is_solution(state):
        add_to_results(state)
        return
    
    for choice in get_choices(state):
        if is_valid(choice, state):
            make_choice(choice, state)
            backtrack(state)
            undo_choice(choice, state)
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Subsets - Generar todos los subconjuntos
def subsets(nums):
    result = []
    
    def backtrack(start, subset):
        result.append(subset[:])
        
        for i in range(start, len(nums)):
            subset.append(nums[i])
            backtrack(i + 1, subset)
            subset.pop()
    
    backtrack(0, [])
    return result

# Combination Sum - Números que sumen target
def combination_sum(candidates, target):
    result = []
    
    def backtrack(start, combo, remaining):
        if remaining == 0:
            result.append(combo[:])
            return
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            combo.append(candidates[i])
            # Permitir reusar el mismo número
            backtrack(i, combo, remaining - candidates[i])
            combo.pop()
    
    backtrack(0, [], target)
    return result

print(combination_sum([2,3,6,7], 7))
# [[2,2,3], [7]]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="N-Queens",
                description="Colocar N reinas sin que se ataquen",
                code='''def solve_n_queens(n):
    result = []
    board = [['.' for _ in range(n)] for _ in range(n)]
    
    def is_safe(row, col):
        # Verificar columna
        for i in range(row):
            if board[i][col] == 'Q':
                return False
        # Verificar diagonal superior izquierda
        i, j = row - 1, col - 1
        while i >= 0 and j >= 0:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j -= 1
        # Verificar diagonal superior derecha
        i, j = row - 1, col + 1
        while i >= 0 and j < n:
            if board[i][j] == 'Q':
                return False
            i -= 1
            j += 1
        return True
    
    def backtrack(row):
        if row == n:
            result.append([''.join(r) for r in board])
            return
        
        for col in range(n):
            if is_safe(row, col):
                board[row][col] = 'Q'
                backtrack(row + 1)
                board[row][col] = '.'
    
    backtrack(0)
    return result''',
                language="python"
            )
        ],
        prerequisites=["recursion-intro"],
        nextLessonId="backtracking-subsets"
    ),
    
    Lesson(
        id="backtracking-subsets",
        moduleId="recursion-backtracking",
        title="Subsets y Combinations",
        description="Genera todos los subconjuntos y combinaciones.",
        order=3,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Subsets y Combinations

## El Patrón de Subsets

Para cada elemento, tienes dos opciones: **incluirlo o no**. Esto crea un árbol binario de decisiones con 2^n hojas (subsets).

## Subsets vs Combinations

| Concepto | Definición | Ejemplo con [1,2,3] |
|----------|-----------|---------------------|
| **Subsets** | Todos los subconjuntos posibles | [], [1], [2], [3], [1,2], [1,3], [2,3], [1,2,3] |
| **Combinations(k)** | Subconjuntos de tamaño k | C(3,2) = [1,2], [1,3], [2,3] |
| **Combination Sum** | Subconjuntos que sumen target | target=4 → [1,3] si existe |

## El Truco para Evitar Duplicados

Si el array tiene duplicados como [1,2,2]:
1. **Ordena** el array primero
2. Si `nums[i] == nums[i-1]` y no usamos `nums[i-1]`, **salta** `nums[i]`

Esto evita generar el mismo subset dos veces."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Subsets
def subsets(nums):
    result = []
    
    def backtrack(start, current):
        result.append(current.copy())
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result

# Subsets with Duplicates
def subsets_with_dup(nums):
    result = []
    nums.sort()
    
    def backtrack(start, current):
        result.append(current.copy())
        for i in range(start, len(nums)):
            if i > start and nums[i] == nums[i-1]:
                continue
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(0, [])
    return result

# Combinations (C(n,k))
def combine(n, k):
    result = []
    
    def backtrack(start, current):
        if len(current) == k:
            result.append(current.copy())
            return
        for i in range(start, n + 1):
            current.append(i)
            backtrack(i + 1, current)
            current.pop()
    
    backtrack(1, [])
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Combination Sum",
                description="Encontrar combinaciones que suman un target",
                code='''def combination_sum(candidates, target):
    result = []
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current.copy())
            return
        if remaining < 0:
            return
        
        for i in range(start, len(candidates)):
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result''',
                language="python"
            )
        ],
        prerequisites=["backtracking-intro"],
        nextLessonId="backtracking-permutations"
    ),
    
    Lesson(
        id="backtracking-permutations",
        moduleId="recursion-backtracking",
        title="Permutations",
        description="Genera todas las permutaciones posibles.",
        order=4,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Permutations

## Subsets vs Permutations

- **Subsets**: {1,2} y {2,1} son el **mismo** subconjunto
- **Permutations**: [1,2] y [2,1] son **diferentes** permutaciones

En subsets elegimos "¿incluyo o no?". En permutations elegimos "¿qué pongo en esta posición?"

## El Patrón

```python
def permute(nums):
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
```

## Con Duplicados

Para manejar duplicados en permutaciones:
1. Ordena el array
2. Usa un array `used[]` para rastrear qué elementos ya están en la permutación actual
3. Salta `nums[i]` si `nums[i] == nums[i-1]` y `nums[i-1]` no fue usado"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Permutations
def permute(nums):
    result = []
    
    def backtrack(current, remaining):
        if not remaining:
            result.append(current.copy())
            return
        
        for i in range(len(remaining)):
            current.append(remaining[i])
            backtrack(current, remaining[:i] + remaining[i+1:])
            current.pop()
    
    backtrack([], nums)
    return result

# Permutations con duplicados
def permute_unique(nums):
    result = []
    nums.sort()
    used = [False] * len(nums)
    
    def backtrack(current):
        if len(current) == len(nums):
            result.append(current.copy())
            return
        
        for i in range(len(nums)):
            if used[i]:
                continue
            if i > 0 and nums[i] == nums[i-1] and not used[i-1]:
                continue
            
            used[i] = True
            current.append(nums[i])
            backtrack(current)
            current.pop()
            used[i] = False
    
    backtrack([])
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Next Permutation",
                description="Encontrar la siguiente permutación lexicográfica",
                code='''def next_permutation(nums):
    n = len(nums)
    
    # Encontrar primer decreciente desde la derecha
    i = n - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    
    if i >= 0:
        # Encontrar el menor mayor que nums[i]
        j = n - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Invertir el sufijo
    left, right = i + 1, n - 1
    while left < right:
        nums[left], nums[right] = nums[right], nums[left]
        left += 1
        right -= 1''',
                language="python"
            )
        ],
        prerequisites=["backtracking-subsets"],
        nextLessonId="backtracking-string"
    ),
    
    Lesson(
        id="backtracking-string",
        moduleId="recursion-backtracking",
        title="Backtracking con Strings",
        description="Letter Combinations, Palindrome Partitioning, Generate Parentheses y más.",
        order=5,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Backtracking con Strings

## ¿Por qué strings + backtracking?

Muchos problemas de strings requieren explorar TODAS las posibles combinaciones o particiones. Backtracking es perfecto porque:
- Genera todas las posibilidades de forma sistemática
- Puede podar (descartar) ramas inválidas temprano
- El string se va construyendo carácter a carácter

## Problemas Clásicos

| Problema | Idea Clave |
|----------|-----------|
| Letter Combinations | Mapear dígitos → letras, explorar todas las combinaciones |
| Palindrome Partitioning | Partir string en todas las formas posibles donde cada parte es palíndromo |
| Generate Parentheses | Construir combinaciones válidas usando open/close counts |
| Word Break II | Encontrar todas las formas de segmentar un string en palabras |

## El Patrón para Strings

```python
def backtrack(index, current_string):
    if index == len(s):  # Procesamos todo el string
        result.append(current_string)
        return
    
    for choice in get_choices(index):
        if is_valid(choice):
            backtrack(index + 1, current_string + choice)
```

**Tip**: Con strings, es común pasar `current + char` como nuevo string (en lugar de append/pop) porque los strings son inmutables en Python. Esto simplifica el backtrack pero usa más memoria."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Letter Combinations of Phone Number
def letter_combinations(digits):
    if not digits:
        return []
    
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi',
        '5': 'jkl', '6': 'mno', '7': 'pqrs',
        '8': 'tuv', '9': 'wxyz'
    }
    
    result = []
    
    def backtrack(idx, current):
        if idx == len(digits):
            result.append(current)
            return
        
        for letter in phone[digits[idx]]:
            backtrack(idx + 1, current + letter)
    
    backtrack(0, '')
    return result

# Palindrome Partitioning
def partition(s):
    result = []
    
    def is_palindrome(sub):
        return sub == sub[::-1]
    
    def backtrack(start, current):
        if start == len(s):
            result.append(current.copy())
            return
        
        for end in range(start + 1, len(s) + 1):
            if is_palindrome(s[start:end]):
                current.append(s[start:end])
                backtrack(end, current)
                current.pop()
    
    backtrack(0, [])
    return result'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Generate Parentheses",
                description="Generar todas las combinaciones válidas de paréntesis",
                code='''def generate_parenthesis(n):
    result = []
    
    def backtrack(current, open_count, close_count):
        if len(current) == 2 * n:
            result.append(current)
            return
        
        if open_count < n:
            backtrack(current + '(', open_count + 1, close_count)
        if close_count < open_count:
            backtrack(current + ')', open_count, close_count + 1)
    
    backtrack('', 0, 0)
    return result''',
                language="python"
            )
        ],
        prerequisites=["backtracking-permutations"],
        nextLessonId="backtracking-matrix"
    ),
    
    Lesson(
        id="backtracking-matrix",
        moduleId="recursion-backtracking",
        title="Backtracking en Matrices",
        description="Word Search y otros problemas de matrices con backtracking.",
        order=6,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Backtracking en Matrices

## ¿Cuándo se usa?

Cuando necesitas explorar caminos o buscar palabras en una cuadrícula 2D. Los problemas clásicos incluyen:
- **Word Search**: ¿Existe una palabra en la cuadrícula?
- **Sudoku Solver**: Rellenar un sudoku válido
- **N-Queens**: Colocar N reinas sin conflictos

## El Patrón para Matrices

```python
def backtrack(row, col, index):
    # 1. Fuera de límites o celda ya visitada
    if row < 0 or row >= m or col < 0 or col >= n:
        return False
    if grid[row][col] != target[index]:
        return False
    
    # 2. Encontramos la solución
    if index == len(target) - 1:
        return True
    
    # 3. Marcar como visitado
    temp = grid[row][col]
    grid[row][col] = '#'
    
    # 4. Explorar 4 direcciones
    for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
        if backtrack(row+dr, col+dc, index+1):
            return True
    
    # 5. Desmarcar (backtrack)
    grid[row][col] = temp
    return False
```

**Clave**: Marca la celda como visitada antes de explorar y desmárcala al volver (backtrack)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Word Search
def exist(board, word):
    rows, cols = len(board), len(board[0])
    
    def backtrack(r, c, idx):
        if idx == len(word):
            return True
        
        if (r < 0 or r >= rows or c < 0 or c >= cols or
            board[r][c] != word[idx]):
            return False
        
        # Marcar como visitado
        temp = board[r][c]
        board[r][c] = '#'
        
        # Explorar direcciones
        found = (backtrack(r + 1, c, idx + 1) or
                 backtrack(r - 1, c, idx + 1) or
                 backtrack(r, c + 1, idx + 1) or
                 backtrack(r, c - 1, idx + 1))
        
        # Restaurar
        board[r][c] = temp
        return found
    
    for r in range(rows):
        for c in range(cols):
            if backtrack(r, c, 0):
                return True
    return False'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Sudoku Solver",
                description="Resolver un Sudoku usando backtracking",
                code='''def solve_sudoku(board):
    def is_valid(row, col, num):
        for i in range(9):
            if board[row][i] == num or board[i][col] == num:
                return False
        
        box_row, box_col = 3 * (row // 3), 3 * (col // 3)
        for i in range(3):
            for j in range(3):
                if board[box_row + i][box_col + j] == num:
                    return False
        return True
    
    def solve():
        for r in range(9):
            for c in range(9):
                if board[r][c] == '.':
                    for num in '123456789':
                        if is_valid(r, c, num):
                            board[r][c] = num
                            if solve():
                                return True
                            board[r][c] = '.'
                    return False
        return True
    
    solve()''',
                language="python"
            )
        ],
        prerequisites=["backtracking-string"],
        nextLessonId="backtracking-path"
    ),
    
    Lesson(
        id="backtracking-path",
        moduleId="recursion-backtracking",
        title="Problemas de Caminos",
        description="Encontrar caminos en grafos y matrices con backtracking.",
        order=7,
        difficulty=Difficulty.HARD,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas de Caminos con Backtracking

## ¿Cuándo usar Backtracking para Caminos?

Cuando necesitas encontrar **TODOS** los caminos posibles (no solo el más corto). BFS/DFS normal encuentran UN camino, pero backtracking los explora todos.

## Problemas Clásicos

| Problema | Descripción |
|----------|-------------|
| All Paths From Source to Target | Todos los caminos de 0 a n-1 en DAG |
| Path Sum II | Todos los caminos root→leaf con suma dada |
| Unique Paths III | Caminos que visitan TODAS las celdas vacías |
| Rat in a Maze | Todos los caminos de (0,0) a (n-1,n-1) |

## El Patrón

```python
def find_all_paths(graph, start, end):
    result = []
    def backtrack(node, path):
        if node == end:
            result.append(path[:])
            return
        for neighbor in graph[node]:
            if neighbor not in visited:
                visited.add(neighbor)
                path.append(neighbor)
                backtrack(neighbor, path)
                path.pop()
                visited.remove(neighbor)
    backtrack(start, [start])
    return result
```"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# All Paths From Source to Target (DAG)
def all_paths_source_target(graph):
    n = len(graph)
    result = []
    
    def backtrack(node, path):
        if node == n - 1:
            result.append(path.copy())
            return
        
        for neighbor in graph[node]:
            path.append(neighbor)
            backtrack(neighbor, path)
            path.pop()
    
    backtrack(0, [0])
    return result

# Unique Paths III (visitar todas las celdas)
def unique_paths_iii(grid):
    rows, cols = len(grid), len(grid[0])
    start = end = None
    empty_count = 1  # incluir start
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == 1:
                start = (r, c)
            elif grid[r][c] == 2:
                end = (r, c)
            elif grid[r][c] == 0:
                empty_count += 1
    
    result = [0]
    
    def backtrack(r, c, count):
        if (r, c) == end:
            if count == empty_count:
                result[0] += 1
            return
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] != -1):
                temp = grid[nr][nc]
                grid[nr][nc] = -1
                backtrack(nr, nc, count + 1)
                grid[nr][nc] = temp
    
    r, c = start
    grid[r][c] = -1
    backtrack(r, c, 0)
    return result[0]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Path with Maximum Gold",
                description="Recolectar máximo oro en una mina",
                code='''def get_maximum_gold(grid):
    rows, cols = len(grid), len(grid[0])
    max_gold = [0]
    
    def backtrack(r, c, gold):
        max_gold[0] = max(max_gold[0], gold)
        
        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:
            nr, nc = r + dr, c + dc
            if (0 <= nr < rows and 0 <= nc < cols and
                grid[nr][nc] > 0):
                temp = grid[nr][nc]
                grid[nr][nc] = 0
                backtrack(nr, nc, gold + temp)
                grid[nr][nc] = temp
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] > 0:
                temp = grid[r][c]
                grid[r][c] = 0
                backtrack(r, c, temp)
                grid[r][c] = temp
    
    return max_gold[0]''',
                language="python"
            )
        ],
        prerequisites=["backtracking-matrix"],
        nextLessonId="backtracking-optimization"
    ),
    
    Lesson(
        id="backtracking-optimization",
        moduleId="recursion-backtracking",
        title="Optimización de Backtracking",
        description="Técnicas de poda y optimización para backtracking.",
        order=8,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Optimización de Backtracking

## ¿Por qué optimizar?

Backtracking puro puede ser extremadamente lento (exponencial). Las optimizaciones pueden reducir el tiempo dramáticamente.

## Técnicas de Optimización

### 1. Poda (Pruning)
Descartar ramas que NO pueden llevar a una solución válida antes de explorarlas:
```python
if current_sum > target:  # Ya excedimos → no sigas
    return
```

### 2. Ordenar el Input
Ordenar permite detectar cuándo parar de explorar más temprano:
```python
candidates.sort()
if candidates[i] > remaining:
    break  # Los siguientes son aún mayores
```

### 3. Memoización
Si el mismo subproblema se repite, guarda el resultado:
```python
@lru_cache(maxsize=None)
def solve(state):
    ...
```

### 4. Bit Manipulation
Usar bits para rastrear el estado es más rápido que sets:
```python
# En lugar de: visited = set()
# Usar: mask |= (1 << i)
```

### 5. Early Termination
Si ya encontraste una solución y solo necesitas una, retorna inmediatamente."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Combination Sum con poda temprana
def combination_sum_optimized(candidates, target):
    result = []
    candidates.sort()  # Permite poda
    
    def backtrack(start, current, remaining):
        if remaining == 0:
            result.append(current.copy())
            return
        
        for i in range(start, len(candidates)):
            # Poda: si el actual es mayor que remaining, los siguientes también
            if candidates[i] > remaining:
                break
            current.append(candidates[i])
            backtrack(i, current, remaining - candidates[i])
            current.pop()
    
    backtrack(0, [], target)
    return result

# Partition to K Equal Sum Subsets con optimización
def can_partition_k_subsets(nums, k):
    total = sum(nums)
    if total % k != 0:
        return False
    
    target = total // k
    nums.sort(reverse=True)  # Optimización
    
    if nums[0] > target:
        return False
    
    buckets = [0] * k
    
    def backtrack(idx):
        if idx == len(nums):
            return all(b == target for b in buckets)
        
        seen = set()  # Evitar duplicados
        for i in range(k):
            if buckets[i] in seen:
                continue
            if buckets[i] + nums[idx] <= target:
                seen.add(buckets[i])
                buckets[i] += nums[idx]
                if backtrack(idx + 1):
                    return True
                buckets[i] -= nums[idx]
        return False
    
    return backtrack(0)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Maximum Score Words",
                description="Maximizar puntuación formando palabras",
                code='''def max_score_words(words, letters, score):
    letter_count = {}
    for c in letters:
        letter_count[c] = letter_count.get(c, 0) + 1
    
    def word_score(word):
        return sum(score[ord(c) - ord('a')] for c in word)
    
    def can_form(word, available):
        needed = {}
        for c in word:
            needed[c] = needed.get(c, 0) + 1
        return all(available.get(c, 0) >= cnt for c, cnt in needed.items())
    
    max_score = [0]
    
    def backtrack(idx, available, current_score):
        max_score[0] = max(max_score[0], current_score)
        
        for i in range(idx, len(words)):
            if can_form(words[i], available):
                new_available = available.copy()
                for c in words[i]:
                    new_available[c] -= 1
                backtrack(i + 1, new_available, 
                         current_score + word_score(words[i]))
    
    backtrack(0, letter_count, 0)
    return max_score[0]''',
                language="python"
            )
        ],
        prerequisites=["backtracking-path"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Dynamic Programming ===
    Lesson(
        id="dp-intro",
        moduleId="dynamic-programming",
        title="Introducción a Dynamic Programming",
        description="Conceptos básicos: overlapping subproblems y optimal substructure.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""¿Cuántos caminos hay para subir 10 escalones si puedes dar pasos de 1 o 2? Podrías calcular TODOS los caminos posibles, pero eso explotar exponencialmente. El truco de DP: si ya calculaste cuántos caminos hay al escalón 8 y al escalón 9, llegar al 10 es simplemente sumarlos (vienes de 8+2 o de 9+1). DP es básicamente: 'si ya resolví subproblemas más pequeños, ¿puedo combinarlos para resolver el problema grande?' Guardas las respuestas anteriores para no recalcularlas. Es como tener una tabla de multiplicar en vez de multiplicar desde cero cada vez.""",
        visual_diagram="""## Dynamic Programming

### Problema: Climbing Stairs (pasos de 1 o 2)

**Sin DP** - recalculas subproblemas (arbol exponencial):
```
                  f(5)
               /       \\
            f(4)       f(3)
           /   \\      /   \\
        f(3)  f(2)  f(2)  f(1)    ← f(3) y f(2) se repiten!
        / \\
     f(2) f(1)
```

**Con DP** - cada subproblema se calcula UNA vez:

| Escalon | Formas de llegar | Calculo |
|---------|-----------------|---------|
| 0 | 1 | Base |
| 1 | 1 | Base |
| 2 | 2 | dp[0] + dp[1] = 1 + 1 |
| 3 | 3 | dp[1] + dp[2] = 1 + 2 |
| 4 | 5 | dp[2] + dp[3] = 2 + 3 |
| 5 | **8** | dp[3] + dp[4] = 3 + 5 |

---

### Dos enfoques de DP

| Enfoque | Direccion | Estructura | Ventaja |
|---------|-----------|-----------|---------|
| **Top-down** (Memoization) | Grande → pequeno | Recursion + cache | Mas intuitivo |
| **Bottom-up** (Tabulation) | Pequeno → grande | Iteracion + tabla | Mas eficiente |

---

### Cuando usar DP

| Senal en el problema | Ejemplo |
|---------------------|---------|
| "Cuantas formas hay de..." | Climbing stairs, coin change |
| "Minimo/maximo costo para..." | Min path sum, edit distance |
| "Es posible llegar a...?" | Word break, subset sum |
| Subproblemas que se **repiten** | Fibonacci, knapsack |
""",
        content=[
            ContentBlock(
                type="text",
                content="""# Introducción a Dynamic Programming

DP optimiza problemas que tienen:
1. **Overlapping Subproblems**: Los mismos subproblemas se resuelven múltiples veces
2. **Optimal Substructure**: La solución óptima se construye de soluciones óptimas de subproblemas

## Enfoques
- **Top-Down (Memoization)**: Recursión + cache
- **Bottom-Up (Tabulation)**: Iterativo, construir desde casos base"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Fibonacci - El ejemplo clásico

# Sin DP: O(2^n) - Muy lento
def fib_naive(n):
    if n <= 1:
        return n
    return fib_naive(n-1) + fib_naive(n-2)

# Top-Down con Memoization: O(n)
def fib_memo(n, memo={}):
    if n in memo:
        return memo[n]
    if n <= 1:
        return n
    memo[n] = fib_memo(n-1, memo) + fib_memo(n-2, memo)
    return memo[n]

# Bottom-Up con Tabulation: O(n)
def fib_tab(n):
    if n <= 1:
        return n
    dp = [0] * (n + 1)
    dp[1] = 1
    for i in range(2, n + 1):
        dp[i] = dp[i-1] + dp[i-2]
    return dp[n]

# Optimizado O(1) espacio
def fib_optimal(n):
    if n <= 1:
        return n
    prev, curr = 0, 1
    for _ in range(2, n + 1):
        prev, curr = curr, prev + curr
    return curr'''
            ),
            ContentBlock(
                type="info",
                content="**Framework DP**: 1) Definir estado, 2) Identificar recurrencia, 3) Establecer casos base, 4) Determinar orden de cálculo."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Climbing Stairs",
                description="Contar formas de subir n escalones",
                code='''def climb_stairs(n):
    if n <= 2:
        return n
    
    # dp[i] = formas de llegar al escalón i
    prev, curr = 1, 2
    
    for i in range(3, n + 1):
        prev, curr = curr, prev + curr
    
    return curr

# También es Fibonacci!
print(climb_stairs(5))  # 8''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId="dp-problemas"
    ),
    
    Lesson(
        id="dp-problemas",
        moduleId="dynamic-programming",
        title="Problemas Clásicos de DP",
        description="Coin change, longest subsequences, knapsack y más: los problemas que DEBES conocer.",
        order=2,
        difficulty=Difficulty.HARD,
        estimatedMinutes=65,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Clásicos de DP

Estos son los problemas que aparecen una y otra vez en entrevistas. Domina estos y tendrás la base para resolver casi cualquier problema de DP.

## Mapa de Patrones

| Patrón | Problemas | Dificultad |
|--------|-----------|-----------|
| **1D DP** | Fibonacci, Climbing Stairs, House Robber | ⭐⭐ |
| **2D DP** | LCS, Edit Distance, Unique Paths | ⭐⭐⭐ |
| **Knapsack** | Partition Equal Subset, Target Sum | ⭐⭐⭐ |
| **Subsequences** | LIS, LCS, Palindromic | ⭐⭐⭐⭐ |
| **Interval** | Burst Balloons, Matrix Chain | ⭐⭐⭐⭐⭐ |

## Cómo Abordar un Problema de DP

1. **¿Es DP?** → ¿Tiene subproblemas superpuestos Y subestructura óptima?
2. **Define el estado** → ¿Qué representa `dp[i]` o `dp[i][j]`?
3. **Escribe la recurrencia** → ¿Cómo se relaciona con estados anteriores?
4. **Define el caso base** → ¿Cuál es el valor cuando no hay nada que resolver?
5. **¿Top-down o bottom-up?** → Memoización vs tabulación"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Coin Change - Mínimas monedas para amount
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i and dp[i - coin] != float('inf'):
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

print(coin_change([1, 2, 5], 11))  # 3 (5+5+1)

# Longest Increasing Subsequence
def length_of_lis(nums):
    if not nums:
        return 0
    
    dp = [1] * len(nums)  # dp[i] = LIS terminando en i
    
    for i in range(1, len(nums)):
        for j in range(i):
            if nums[j] < nums[i]:
                dp[i] = max(dp[i], dp[j] + 1)
    
    return max(dp)

print(length_of_lis([10,9,2,5,3,7,101,18]))  # 4'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Longest Common Subsequence",
                description="Encontrar la subsecuencia común más larga",
                code='''def longest_common_subsequence(text1, text2):
    m, n = len(text1), len(text2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if text1[i-1] == text2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    
    return dp[m][n]

print(longest_common_subsequence("abcde", "ace"))  # 3''',
                language="python"
            )
        ],
        prerequisites=["dp-intro"],
        nextLessonId="dp-1d-patterns"
    ),
    
    Lesson(
        id="dp-1d-patterns",
        moduleId="dynamic-programming",
        title="Patrones DP 1D",
        description="Problemas de DP con un array unidimensional.",
        order=3,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Patrones DP 1D

## ¿Qué es DP 1D?

Son problemas donde el estado se define con un solo índice: `dp[i]`. Cada posición depende de posiciones anteriores.

## El Patrón House Robber

Este es EL patrón 1D por excelencia:
- Tienes opciones en cada posición (tomar o no tomar)
- No puedes tomar dos adyacentes
- `dp[i] = max(dp[i-1], dp[i-2] + nums[i])`

Traducido: "el mejor resultado hasta i es el máximo entre NO robar esta casa (quedo con lo de antes) y SÍ robarla (lo de dos atrás + esta)".

## Optimización de Espacio

En DP 1D, si solo dependes de `dp[i-1]` y `dp[i-2]`, puedes usar solo **dos variables** en lugar de un array entero:
```python
prev2, prev1 = dp[i-2], dp[i-1]
# En lugar de dp[len(nums)]
```

## Problemas Clásicos 1D

| Problema | Estado dp[i] | Recurrencia |
|----------|-------------|-------------|
| Climbing Stairs | Formas de llegar a i | dp[i] = dp[i-1] + dp[i-2] |
| House Robber | Max robo hasta i | dp[i] = max(dp[i-1], dp[i-2]+nums[i]) |
| Maximum Subarray | Max subarray terminando en i | dp[i] = max(nums[i], dp[i-1]+nums[i]) |
| Decode Ways | Formas de decodificar hasta i | dp[i] = dp[i-1] + dp[i-2] (si válidos) |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# House Robber
def rob(nums):
    if len(nums) <= 2:
        return max(nums) if nums else 0
    
    dp = [0] * len(nums)
    dp[0] = nums[0]
    dp[1] = max(nums[0], nums[1])
    
    for i in range(2, len(nums)):
        dp[i] = max(dp[i-1], dp[i-2] + nums[i])
    
    return dp[-1]

# House Robber II (circular)
def rob_circular(nums):
    if len(nums) == 1:
        return nums[0]
    return max(rob(nums[1:]), rob(nums[:-1]))

# Maximum Subarray (Kadane)
def max_subarray(nums):
    current_sum = max_sum = nums[0]
    
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Decode Ways",
                description="Contar formas de decodificar un mensaje",
                code='''def num_decodings(s):
    if not s or s[0] == '0':
        return 0
    
    n = len(s)
    dp = [0] * (n + 1)
    dp[0] = 1
    dp[1] = 1
    
    for i in range(2, n + 1):
        # Un dígito
        if s[i-1] != '0':
            dp[i] += dp[i-1]
        # Dos dígitos
        two_digit = int(s[i-2:i])
        if 10 <= two_digit <= 26:
            dp[i] += dp[i-2]
    
    return dp[n]''',
                language="python"
            )
        ],
        prerequisites=["dp-problemas"],
        nextLessonId="dp-2d-patterns"
    ),
    
    Lesson(
        id="dp-2d-patterns",
        moduleId="dynamic-programming",
        title="Patrones DP 2D",
        description="Problemas de DP con matrices bidimensionales.",
        order=4,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Patrones DP 2D

## ¿Cuándo es DP 2D?

Usamos DP 2D cuando el estado necesita **dos variables**:
- `dp[i][j]` = resultado para el subproblema definido por (i, j)

## Tipos de DP 2D

### 1. Grid/Matrix DP
Moverse en una cuadrícula desde (0,0) hasta (m-1, n-1):
- `dp[i][j]` = resultado óptimo para llegar a (i, j)
- Transición: viene de arriba `dp[i-1][j]` o de la izquierda `dp[i][j-1]`

### 2. Two-String DP
Comparar dos strings (como LCS, Edit Distance):
- `dp[i][j]` = resultado para s1[:i] y s2[:j]
- Transición: depende de si s1[i-1] == s2[j-1]

### 3. Interval DP
Subproblemas definidos por rangos [i, j]:
- `dp[i][j]` = resultado para el rango de i a j
- Transición: probar todos los puntos de corte k entre i y j

## Problemas Más Comunes

| Problema | Estado | Tipo |
|----------|--------|------|
| Unique Paths | Caminos hasta (i,j) | Grid |
| Min Path Sum | Costo mínimo hasta (i,j) | Grid |
| LCS | Subsequencia común de s1[:i], s2[:j] | Two-String |
| Edit Distance | Operaciones para s1[:i] → s2[:j] | Two-String |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Unique Paths
def unique_paths(m, n):
    dp = [[1] * n for _ in range(m)]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]

# Minimum Path Sum
def min_path_sum(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    dp[0][0] = grid[0][0]
    
    for i in range(1, m):
        dp[i][0] = dp[i-1][0] + grid[i][0]
    for j in range(1, n):
        dp[0][j] = dp[0][j-1] + grid[0][j]
    
    for i in range(1, m):
        for j in range(1, n):
            dp[i][j] = min(dp[i-1][j], dp[i][j-1]) + grid[i][j]
    
    return dp[m-1][n-1]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Unique Paths with Obstacles",
                description="Caminos únicos con obstáculos",
                code='''def unique_paths_with_obstacles(grid):
    m, n = len(grid), len(grid[0])
    dp = [[0] * n for _ in range(m)]
    
    # Primera columna
    for i in range(m):
        if grid[i][0] == 1:
            break
        dp[i][0] = 1
    
    # Primera fila
    for j in range(n):
        if grid[0][j] == 1:
            break
        dp[0][j] = 1
    
    for i in range(1, m):
        for j in range(1, n):
            if grid[i][j] == 0:
                dp[i][j] = dp[i-1][j] + dp[i][j-1]
    
    return dp[m-1][n-1]''',
                language="python"
            )
        ],
        prerequisites=["dp-1d-patterns"],
        nextLessonId="dp-knapsack"
    ),
    
    Lesson(
        id="dp-knapsack",
        moduleId="dynamic-programming",
        title="Problemas Knapsack",
        description="0/1 Knapsack, Unbounded Knapsack y variantes como Partition Equal Subset Sum.",
        order=5,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas Knapsack (Mochila)

## La Analogía

Imagina que eres un ladrón con una mochila de capacidad limitada. Hay objetos con diferentes pesos y valores. ¿Cómo maximizas el valor total sin exceder la capacidad?

## Dos Tipos de Knapsack

### 1. 0/1 Knapsack (cada item se usa 0 o 1 vez)
- "¿Tomo este item o no?"
- Ejemplos: Partition Equal Subset Sum, Target Sum

### 2. Unbounded Knapsack (items ilimitados)
- "¿Cuántas veces uso este item?"
- Ejemplos: Coin Change, Rod Cutting

## El Patrón 0/1 Knapsack

```
Estado: dp[i][w] = máximo valor usando items 0..i-1 con capacidad w

Transición:
  Si NO tomo item i: dp[i][w] = dp[i-1][w]
  Si SÍ tomo item i: dp[i][w] = dp[i-1][w - weight[i]] + value[i]
  
  dp[i][w] = max(no tomar, tomar si cabe)
```

## Optimización de Espacio

En 0/1 Knapsack, solo necesitamos la fila anterior → podemos usar un array 1D recorriendo **de derecha a izquierda** (para no usar un item dos veces).

En Unbounded Knapsack, recorremos **de izquierda a derecha** (porque SÍ podemos reusar items)."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# 0/1 Knapsack
def knapsack_01(weights, values, capacity):
    n = len(weights)
    dp = [[0] * (capacity + 1) for _ in range(n + 1)]
    
    for i in range(1, n + 1):
        for w in range(capacity + 1):
            if weights[i-1] <= w:
                dp[i][w] = max(dp[i-1][w], 
                              dp[i-1][w-weights[i-1]] + values[i-1])
            else:
                dp[i][w] = dp[i-1][w]
    
    return dp[n][capacity]

# Unbounded Knapsack (items ilimitados)
def unbounded_knapsack(weights, values, capacity):
    dp = [0] * (capacity + 1)
    
    for w in range(1, capacity + 1):
        for i in range(len(weights)):
            if weights[i] <= w:
                dp[w] = max(dp[w], dp[w - weights[i]] + values[i])
    
    return dp[capacity]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Partition Equal Subset Sum",
                description="Particionar array en dos subsets de igual suma",
                code='''def can_partition(nums):
    total = sum(nums)
    if total % 2 != 0:
        return False
    
    target = total // 2
    dp = [False] * (target + 1)
    dp[0] = True
    
    for num in nums:
        for j in range(target, num - 1, -1):
            dp[j] = dp[j] or dp[j - num]
    
    return dp[target]''',
                language="python"
            )
        ],
        prerequisites=["dp-2d-patterns"],
        nextLessonId="dp-coin-change"
    ),
    
    Lesson(
        id="dp-coin-change",
        moduleId="dynamic-programming",
        title="Coin Change Patterns",
        description="Problemas de cambio de monedas: mínimas monedas, número de combinaciones y variantes.",
        order=6,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Coin Change Patterns

## ¿Por qué es tan importante?

Los problemas de monedas son clásicos en entrevistas y encapsulan perfectamente los conceptos de DP. Hay dos variantes principales:

1. **Coin Change I**: ¿Cuál es el **mínimo** número de monedas para llegar al amount? (Optimización)
2. **Coin Change II**: ¿De **cuántas formas** puedo llegar al amount? (Conteo)

## La Clave: Orden de los Loops

```python
# COMBINACIONES (el orden no importa: {1,2} = {2,1})
for coin in coins:           # Moneda externa
    for x in range(coin, amount+1):  # Amount interno

# PERMUTACIONES (el orden importa: {1,2} ≠ {2,1})
for x in range(1, amount+1):  # Amount externo
    for coin in coins:          # Moneda interna
```

**¿Por qué?** Si la moneda es el loop externo, procesamos TODAS las combinaciones con moneda 1 antes de considerar moneda 2, evitando duplicados como {2,1} cuando ya contamos {1,2}."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Coin Change - mínimas monedas
def coin_change(coins, amount):
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] = min(dp[x], dp[x - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1

# Coin Change II - número de combinaciones
def change(amount, coins):
    dp = [0] * (amount + 1)
    dp[0] = 1
    
    for coin in coins:
        for x in range(coin, amount + 1):
            dp[x] += dp[x - coin]
    
    return dp[amount]

# Nota: El orden de los loops importa!
# coin primero -> combinaciones (order doesn't matter)
# amount primero -> permutaciones (order matters)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Perfect Squares",
                description="Mínimos cuadrados perfectos que suman n",
                code='''def num_squares(n):
    dp = [float('inf')] * (n + 1)
    dp[0] = 0
    
    for i in range(1, n + 1):
        j = 1
        while j * j <= i:
            dp[i] = min(dp[i], dp[i - j*j] + 1)
            j += 1
    
    return dp[n]''',
                language="python"
            )
        ],
        prerequisites=["dp-knapsack"],
        nextLessonId="dp-subsequences"
    ),
    
    Lesson(
        id="dp-subsequences",
        moduleId="dynamic-programming",
        title="Subsequences DP",
        description="LIS, LCS y otros problemas de subsecuencias.",
        order=7,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Problemas de Subsequences con DP

## ¿Qué es una Subsequence?

Una **subsecuencia** es un subconjunto de elementos que mantienen su orden relativo (pero no necesitan ser contiguos). Por ejemplo, de `[1,3,2,4]`, las subsecuencias incluyen `[1,2,4]`, `[3,4]`, etc.

## Problemas Clave

| Problema | Estado | Complejidad |
|----------|--------|-------------|
| **LIS** (Longest Increasing Subsequence) | dp[i] = LIS terminando en i | O(n²) o O(n log n) |
| **LCS** (Longest Common Subsequence) | dp[i][j] = LCS de s1[:i] y s2[:j] | O(n·m) |
| **Longest Palindromic Subsequence** | dp[i][j] = LPS en s[i:j+1] | O(n²) |

## LIS con Binary Search: El Truco O(n log n)

En lugar de comparar cada par de elementos (O(n²)), mantenemos un array `tails` donde `tails[i]` es el **menor** elemento final de todas las subsecuencias crecientes de longitud i+1. Usamos binary search para encontrar dónde insertar cada nuevo elemento."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# LIS con Binary Search - O(n log n)
from bisect import bisect_left

def length_of_lis_optimized(nums):
    tails = []
    
    for num in nums:
        pos = bisect_left(tails, num)
        if pos == len(tails):
            tails.append(num)
        else:
            tails[pos] = num
    
    return len(tails)

# Number of LIS
def find_number_of_lis(nums):
    n = len(nums)
    if n == 0:
        return 0
    
    length = [1] * n  # longitud del LIS terminando en i
    count = [1] * n   # número de LIS de esa longitud
    
    for i in range(1, n):
        for j in range(i):
            if nums[j] < nums[i]:
                if length[j] + 1 > length[i]:
                    length[i] = length[j] + 1
                    count[i] = count[j]
                elif length[j] + 1 == length[i]:
                    count[i] += count[j]
    
    max_length = max(length)
    return sum(c for l, c in zip(length, count) if l == max_length)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Longest Palindromic Subsequence",
                description="Subsecuencia palindrómica más larga",
                code='''def longest_palindrome_subseq(s):
    n = len(s)
    dp = [[0] * n for _ in range(n)]
    
    for i in range(n):
        dp[i][i] = 1
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            if s[i] == s[j]:
                dp[i][j] = dp[i+1][j-1] + 2
            else:
                dp[i][j] = max(dp[i+1][j], dp[i][j-1])
    
    return dp[0][n-1]''',
                language="python"
            )
        ],
        prerequisites=["dp-coin-change"],
        nextLessonId="dp-strings"
    ),
    
    Lesson(
        id="dp-strings",
        moduleId="dynamic-programming",
        title="String DP",
        description="Edit distance, regex matching y otros problemas de strings.",
        order=8,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# String DP: Edit Distance y Más

## ¿Cuándo es String DP?

Cuando tienes uno o dos strings y necesitas encontrar transformaciones, coincidencias o comparaciones óptimas. Son siempre DP 2D donde `dp[i][j]` involucra prefijos de los strings.

## Problemas Clave

| Problema | dp[i][j] representa | Complejidad |
|----------|---------------------|-------------|
| Edit Distance | Min operaciones para s1[:i] → s2[:j] | O(n·m) |
| Regex Matching | ¿s1[:i] matches con pattern[:j]? | O(n·m) |
| Wildcard Matching | ¿s1[:i] matches con pattern[:j]? | O(n·m) |
| Distinct Subsequences | Formas de formar s2[:j] desde s1[:i] | O(n·m) |

## Edit Distance: La Recurrencia

Si los caracteres coinciden: `dp[i][j] = dp[i-1][j-1]` (gratis)
Si no coinciden, tomamos el mínimo de:
- **Insertar**: `dp[i][j-1] + 1`
- **Eliminar**: `dp[i-1][j] + 1`  
- **Reemplazar**: `dp[i-1][j-1] + 1`"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Edit Distance (Levenshtein)
def min_distance(word1, word2):
    m, n = len(word1), len(word2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = i
    for j in range(n + 1):
        dp[0][j] = j
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if word1[i-1] == word2[j-1]:
                dp[i][j] = dp[i-1][j-1]
            else:
                dp[i][j] = 1 + min(dp[i-1][j],    # delete
                                  dp[i][j-1],    # insert
                                  dp[i-1][j-1])  # replace
    
    return dp[m][n]

# Distinct Subsequences
def num_distinct(s, t):
    m, n = len(s), len(t)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    
    for i in range(m + 1):
        dp[i][0] = 1
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            dp[i][j] = dp[i-1][j]
            if s[i-1] == t[j-1]:
                dp[i][j] += dp[i-1][j-1]
    
    return dp[m][n]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Regular Expression Matching",
                description="Implementar matching con . y *",
                code='''def is_match(s, p):
    m, n = len(s), len(p)
    dp = [[False] * (n + 1) for _ in range(m + 1)]
    dp[0][0] = True
    
    # Handle patterns like a*, a*b*, etc.
    for j in range(2, n + 1):
        if p[j-1] == '*':
            dp[0][j] = dp[0][j-2]
    
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if p[j-1] == '*':
                dp[i][j] = dp[i][j-2]  # zero occurrences
                if p[j-2] == '.' or p[j-2] == s[i-1]:
                    dp[i][j] = dp[i][j] or dp[i-1][j]
            elif p[j-1] == '.' or p[j-1] == s[i-1]:
                dp[i][j] = dp[i-1][j-1]
    
    return dp[m][n]''',
                language="python"
            )
        ],
        prerequisites=["dp-subsequences"],
        nextLessonId="dp-matrix"
    ),
    
    Lesson(
        id="dp-matrix",
        moduleId="dynamic-programming",
        title="Matrix DP",
        description="Problemas de DP en matrices: maximal square, rectangle, etc.",
        order=9,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Matrix DP: Problemas en Cuadrículas

## ¿Cuándo usar Matrix DP?

Cuando el problema involucra encontrar regiones, áreas o propiedades en una matriz 2D. A diferencia de Grid DP (moverse de A a B), aquí exploramos **propiedades de submatrices**.

## Problemas Clave

| Problema | dp[i][j] | Idea |
|----------|----------|------|
| Maximal Square | Lado del mayor cuadrado con esquina en (i,j) | min(arriba, izq, diagonal) + 1 |
| Maximal Rectangle | Mayor rectángulo de 1s en la fila i | Histograma por fila |
| Count Square Submatrices | Cuadrados con esquina inferior derecha en (i,j) | Similar a Maximal Square |

## Maximal Square: La Intuición

Para que `(i,j)` sea esquina de un cuadrado de lado `k`, necesitas que:
- La celda de arriba `(i-1,j)` sea esquina de un cuadrado de al menos `k-1`
- La celda a la izquierda `(i,j-1)` sea esquina de un cuadrado de al menos `k-1`
- La diagonal `(i-1,j-1)` sea esquina de un cuadrado de al menos `k-1`
- La celda actual `(i,j)` sea 1"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Maximal Square
def maximal_square(matrix):
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    dp = [[0] * n for _ in range(m)]
    max_side = 0
    
    for i in range(m):
        for j in range(n):
            if matrix[i][j] == '1':
                if i == 0 or j == 0:
                    dp[i][j] = 1
                else:
                    dp[i][j] = min(dp[i-1][j], dp[i][j-1], 
                                   dp[i-1][j-1]) + 1
                max_side = max(max_side, dp[i][j])
    
    return max_side * max_side

# Triangle Minimum Path
def minimum_total(triangle):
    n = len(triangle)
    dp = triangle[-1][:]
    
    for i in range(n - 2, -1, -1):
        for j in range(i + 1):
            dp[j] = triangle[i][j] + min(dp[j], dp[j + 1])
    
    return dp[0]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Maximal Rectangle",
                description="Rectángulo más grande de 1s en matriz",
                code='''def maximal_rectangle(matrix):
    if not matrix:
        return 0
    
    m, n = len(matrix), len(matrix[0])
    heights = [0] * n
    max_area = 0
    
    for i in range(m):
        for j in range(n):
            heights[j] = heights[j] + 1 if matrix[i][j] == '1' else 0
        
        # Largest rectangle in histogram
        stack = []
        for k, h in enumerate(heights + [0]):
            start = k
            while stack and stack[-1][1] > h:
                idx, height = stack.pop()
                max_area = max(max_area, height * (k - idx))
                start = idx
            stack.append((start, h))
    
    return max_area''',
                language="python"
            )
        ],
        prerequisites=["dp-strings"],
        nextLessonId="dp-intervals"
    ),
    
    Lesson(
        id="dp-intervals",
        moduleId="dynamic-programming",
        title="Interval DP",
        description="DP sobre intervalos: burst balloons, matrix chain, etc.",
        order=10,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Interval DP: Problemas de Rangos

## ¿Qué es Interval DP?

El estado es un **rango [i, j]**. Probamos todos los puntos de corte `k` entre `i` y `j` para dividir el problema.

```python
for length in range(2, n+1):     # Longitud del intervalo
    for i in range(n - length + 1):
        j = i + length - 1
        for k in range(i, j):    # Punto de corte
            dp[i][j] = optimal(dp[i][k], dp[k+1][j])
```

## Problemas Clave

| Problema | Descripción |
|----------|-------------|
| Burst Balloons | Explotar globos en el mejor orden para max coins |
| Matrix Chain | Mejor orden para multiplicar matrices |
| Palindrome Partitioning II | Mín cortes para dividir en palíndromos |
| Stone Game | Estrategia óptima para juego de piedras |

## La Clave: ¿Por qué probar todos los cortes?

Porque no sabemos de antemano dónde es mejor dividir. En Burst Balloons, el último globo en explotar determina la respuesta óptima."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Burst Balloons
def max_coins(nums):
    nums = [1] + nums + [1]
    n = len(nums)
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n):
        for i in range(n - length):
            j = i + length
            for k in range(i + 1, j):
                dp[i][j] = max(dp[i][j],
                    dp[i][k] + dp[k][j] + 
                    nums[i] * nums[k] * nums[j])
    
    return dp[0][n - 1]

# Matrix Chain Multiplication
def matrix_chain_order(dims):
    n = len(dims) - 1
    dp = [[0] * n for _ in range(n)]
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            dp[i][j] = float('inf')
            for k in range(i, j):
                cost = (dp[i][k] + dp[k+1][j] + 
                       dims[i] * dims[k+1] * dims[j+1])
                dp[i][j] = min(dp[i][j], cost)
    
    return dp[0][n - 1]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Minimum Cost to Merge Stones",
                description="Costo mínimo para fusionar piedras",
                code='''def merge_stones(stones, k):
    n = len(stones)
    if (n - 1) % (k - 1) != 0:
        return -1
    
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i + 1] = prefix[i] + stones[i]
    
    dp = [[float('inf')] * n for _ in range(n)]
    for i in range(n):
        dp[i][i] = 0
    
    for length in range(2, n + 1):
        for i in range(n - length + 1):
            j = i + length - 1
            for mid in range(i, j, k - 1):
                dp[i][j] = min(dp[i][j], dp[i][mid] + dp[mid+1][j])
            if (j - i) % (k - 1) == 0:
                dp[i][j] += prefix[j + 1] - prefix[i]
    
    return dp[0][n - 1]''',
                language="python"
            )
        ],
        prerequisites=["dp-matrix"],
        nextLessonId="dp-state-machine"
    ),
    
    Lesson(
        id="dp-state-machine",
        moduleId="dynamic-programming",
        title="State Machine DP",
        description="Problemas de DP modelados como máquinas de estados.",
        order=11,
        difficulty=Difficulty.HARD,
        estimatedMinutes=55,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# State Machine DP: Transiciones de Estado

## ¿Cuándo usar State Machine DP?

Cuando el problema tiene **múltiples estados** y las decisiones cambian de un estado a otro. El ejemplo clásico: **Best Time to Buy and Sell Stock**.

## La Idea

Define los posibles estados y las transiciones entre ellos:

```
     comprar         vender
IDLE --------→ HOLD --------→ IDLE
 ↑                               |
 └───────────── cooldown ────────┘
```

Cada día, para cada estado, calcula el mejor profit posible.

## Ejemplo: Stock con Cooldown

| Estado | Significado | Transición |
|--------|------------|------------|
| `idle[i]` | No tengo acciones, puedo comprar | max(idle[i-1], cooldown[i-1]) |
| `hold[i]` | Tengo acciones, puedo vender | max(hold[i-1], idle[i-1] - price[i]) |
| `cooldown[i]` | Acabo de vender, no puedo hacer nada | hold[i-1] + price[i] |

## Problemas de Stock (todos siguen este patrón)

- Stock I: Una transacción
- Stock II: Transacciones ilimitadas  
- Stock III: Máximo 2 transacciones
- Stock IV: Máximo k transacciones
- Stock with Cooldown: Esperar 1 día después de vender
- Stock with Fee: Comisión por transacción"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Best Time to Buy and Sell Stock with Cooldown
def max_profit_cooldown(prices):
    if len(prices) < 2:
        return 0
    
    # Estados: held, sold, rest
    held = float('-inf')  # tenemos acción
    sold = 0              # acabamos de vender
    rest = 0              # no tenemos nada
    
    for price in prices:
        held_new = max(held, rest - price)
        sold_new = held + price
        rest_new = max(rest, sold)
        
        held, sold, rest = held_new, sold_new, rest_new
    
    return max(sold, rest)

# Best Time to Buy and Sell Stock with Transaction Fee
def max_profit_fee(prices, fee):
    cash = 0     # sin acción
    hold = -prices[0]  # con acción
    
    for price in prices[1:]:
        cash = max(cash, hold + price - fee)
        hold = max(hold, cash - price)
    
    return cash'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Best Time to Buy and Sell Stock IV",
                description="Máximo k transacciones",
                code='''def max_profit_k(k, prices):
    if not prices:
        return 0
    
    n = len(prices)
    if k >= n // 2:
        return sum(max(0, prices[i] - prices[i-1]) 
                   for i in range(1, n))
    
    dp = [[0] * n for _ in range(k + 1)]
    
    for i in range(1, k + 1):
        max_diff = -prices[0]
        for j in range(1, n):
            dp[i][j] = max(dp[i][j-1], prices[j] + max_diff)
            max_diff = max(max_diff, dp[i-1][j] - prices[j])
    
    return dp[k][n-1]''',
                language="python"
            )
        ],
        prerequisites=["dp-intervals"],
        nextLessonId="dp-bitmask"
    ),
    
    Lesson(
        id="dp-bitmask",
        moduleId="dynamic-programming",
        title="Bitmask DP",
        description="DP usando máscaras de bits para representar estados.",
        order=12,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Bitmask DP: Representar Conjuntos con Bits

## ¿Cuándo usar Bitmask DP?

Cuando necesitas rastrear **qué elementos ya usaste** de un conjunto pequeño (n ≤ 20). Cada bit del entero representa si un elemento está incluido (1) o no (0).

## La Representación

```python
# Con n=4 elementos: {A, B, C, D}
# mask = 0b1010 = 10 → elementos B y D están incluidos
# mask = 0b1111 = 15 → todos incluidos

# Verificar si elemento i está incluido:
if mask & (1 << i):  # True si bit i es 1

# Añadir elemento i:
new_mask = mask | (1 << i)

# Quitar elemento i:
new_mask = mask & ~(1 << i)

# Total de subconjuntos posibles: 2^n
```

## Estado: `dp[mask]`

`dp[mask]` = resultado óptimo habiendo visitado/usado los elementos indicados por `mask`.

## Problemas Clásicos

| Problema | n máximo | Idea |
|----------|---------|------|
| TSP (Travelling Salesman) | ~20 | dp[mask][last] = mín distancia visitando mask, terminando en last |
| Partition to K Equal Sum Subsets | ~16 | dp[mask] = ¿puedo particionar los elementos en mask? |
| Number of Ways to Wear Hats | ~40 hats, ~10 people | Bitmask sobre personas |

## Complejidad: O(2^n · n)
Hay 2^n posibles masks, y para cada uno iteramos sobre n elementos."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Traveling Salesman Problem
def tsp(dist):
    n = len(dist)
    dp = [[float('inf')] * n for _ in range(1 << n)]
    dp[1][0] = 0  # empezar en nodo 0
    
    for mask in range(1 << n):
        for last in range(n):
            if not (mask & (1 << last)):
                continue
            if dp[mask][last] == float('inf'):
                continue
            
            for next_node in range(n):
                if mask & (1 << next_node):
                    continue
                new_mask = mask | (1 << next_node)
                dp[new_mask][next_node] = min(
                    dp[new_mask][next_node],
                    dp[mask][last] + dist[last][next_node]
                )
    
    # Volver al inicio
    full_mask = (1 << n) - 1
    return min(dp[full_mask][i] + dist[i][0] for i in range(n))

# Minimum XOR Sum of Two Arrays
def minimum_xor_sum(nums1, nums2):
    n = len(nums1)
    dp = [float('inf')] * (1 << n)
    dp[0] = 0
    
    for i in range(n):
        for mask in range((1 << n) - 1, -1, -1):
            if bin(mask).count('1') != i:
                continue
            for j in range(n):
                if not (mask & (1 << j)):
                    new_mask = mask | (1 << j)
                    dp[new_mask] = min(dp[new_mask],
                        dp[mask] + (nums1[i] ^ nums2[j]))
    
    return dp[(1 << n) - 1]'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Count Subsets with Given Sum",
                description="Contar subconjuntos con suma específica usando bitmask",
                code='''def count_subsets_sum(nums, target):
    n = len(nums)
    count = 0
    
    for mask in range(1 << n):
        total = sum(nums[i] for i in range(n) if mask & (1 << i))
        if total == target:
            count += 1
    
    return count

# O(n * target) con DP tradicional es mejor para n grande''',
                language="python"
            )
        ],
        prerequisites=["dp-state-machine"],
        nextLessonId="dp-digit"
    ),
    
    Lesson(
        id="dp-digit",
        moduleId="dynamic-programming",
        title="Digit DP",
        description="Contar números con propiedades específicas en rangos.",
        order=13,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Digit DP

Cuenta números en [0, N] con ciertas propiedades."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Contar números del 1 al N sin 4 consecutivos
def count_numbers(n):
    digits = []
    while n > 0:
        digits.append(n % 10)
        n //= 10
    digits.reverse()
    
    from functools import lru_cache
    
    @lru_cache(maxsize=None)
    def dp(pos, prev, tight, started):
        if pos == len(digits):
            return 1 if started else 0
        
        limit = digits[pos] if tight else 9
        result = 0
        
        for d in range(0, limit + 1):
            # Skip si tenemos dos 4s consecutivos
            if prev == 4 and d == 4:
                continue
            
            new_started = started or d > 0
            new_tight = tight and d == limit
            result += dp(pos + 1, d, new_tight, new_started)
        
        return result
    
    return dp(0, -1, True, False)

# Números con suma de dígitos divisible por k
def count_divisible_sum(n, k):
    digits = list(str(n))
    
    @lru_cache(maxsize=None)
    def dp(pos, remainder, tight):
        if pos == len(digits):
            return 1 if remainder == 0 else 0
        
        limit = int(digits[pos]) if tight else 9
        result = 0
        
        for d in range(0, limit + 1):
            result += dp(pos + 1, (remainder + d) % k, 
                        tight and d == limit)
        
        return result
    
    return dp(0, 0, True)'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Numbers At Most N Given Digit Set",
                description="Contar números formados con dígitos permitidos",
                code='''def at_most_n_given_digit_set(digits, n):
    s = str(n)
    k = len(s)
    d = len(digits)
    
    # Números con menos dígitos
    result = sum(d ** i for i in range(1, k))
    
    # Números con exactamente k dígitos
    for i, c in enumerate(s):
        # Dígitos estrictamente menores
        smaller = sum(1 for x in digits if x < c)
        result += smaller * (d ** (k - i - 1))
        
        # Si el dígito actual no está disponible, terminar
        if c not in digits:
            break
        
        # Si llegamos al final y n es válido
        if i == k - 1:
            result += 1
    
    return result''',
                language="python"
            )
        ],
        prerequisites=["dp-bitmask"],
        nextLessonId="dp-trees"
    ),
    
    Lesson(
        id="dp-trees",
        moduleId="dynamic-programming",
        title="Tree DP",
        description="DP sobre estructuras de árboles.",
        order=14,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Tree DP

DP donde el estado está asociado a nodos del árbol."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Binary Tree Maximum Path Sum
def max_path_sum(root):
    max_sum = [float('-inf')]
    
    def dfs(node):
        if not node:
            return 0
        
        left = max(dfs(node.left), 0)
        right = max(dfs(node.right), 0)
        
        # Actualizar máximo global
        max_sum[0] = max(max_sum[0], left + right + node.val)
        
        # Retornar máximo de un solo lado
        return max(left, right) + node.val
    
    dfs(root)
    return max_sum[0]

# House Robber III
def rob_tree(root):
    def dfs(node):
        if not node:
            return (0, 0)  # (no robar, robar)
        
        left = dfs(node.left)
        right = dfs(node.right)
        
        # Si no robamos este nodo
        not_rob = max(left) + max(right)
        # Si robamos este nodo
        rob = node.val + left[0] + right[0]
        
        return (not_rob, rob)
    
    return max(dfs(root))'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Diameter of Binary Tree con DP",
                description="Calcular diámetro usando DP en árbol",
                code='''def diameter(root):
    max_diameter = [0]
    
    def height(node):
        if not node:
            return 0
        
        left_h = height(node.left)
        right_h = height(node.right)
        
        # Diámetro pasando por este nodo
        max_diameter[0] = max(max_diameter[0], left_h + right_h)
        
        return 1 + max(left_h, right_h)
    
    height(root)
    return max_diameter[0]

# Longest Path with Same Value
def longest_univalue_path(root):
    longest = [0]
    
    def dfs(node, parent_val):
        if not node:
            return 0
        
        left = dfs(node.left, node.val)
        right = dfs(node.right, node.val)
        
        longest[0] = max(longest[0], left + right)
        
        if node.val == parent_val:
            return 1 + max(left, right)
        return 0
    
    dfs(root, None)
    return longest[0]''',
                language="python"
            )
        ],
        prerequisites=["dp-digit"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Binary Search ===
    Lesson(
        id="binary-search-intro",
        moduleId="binary-search",
        title="Binary Search: De lo Básico a lo Avanzado",
        description="Domina búsqueda binaria: template básico, variantes, arrays rotados y binary search on answer.",
        order=1,
        difficulty=Difficulty.EASY,
        estimatedMinutes=65,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Piensa en el juego de "adivina el número del 1 al 100". Tu amigo piensa un número y tú preguntas. Si dices 50 y te dice "más alto", acabas de eliminar la MITAD de las opciones. Luego dices 75, "más bajo" — otra mitad eliminada. En máximo 7 intentos adivinas entre 100 números. Binary search funciona igual: en cada paso eliminas la mitad del espacio de búsqueda. Por eso es O(log n): con un millón de elementos, solo necesitas ~20 pasos.""",
        visual_diagram="""## Binary Search Visual

### Ejemplo 1: Buscar 7 en [1, 3, 5, 7, 9, 11, 13]

| Paso | Rango | L | M | R | Comparacion | Resultado |
|------|-------|---|---|---|-------------|-----------|
| 1 | `[1, 3, 5, **7**, 9, 11, 13]` | 0 | 3 | 6 | mid=7 == 7 | **Encontrado!** |

### Ejemplo 2: Buscar 3 en [1, 3, 5, 7, 9, 11, 13]

| Paso | Rango | L | M | R | Comparacion | Resultado |
|------|-------|---|---|---|-------------|-----------|
| 1 | `[1, 3, 5, **7**, 9, 11, 13]` | 0 | 3 | 6 | mid=7 > 3 | Ir a la izquierda |
| 2 | `[1, **3**, 5]` | 0 | 1 | 2 | mid=3 == 3 | **Encontrado!** |

---

### 3 Templates de Binary Search

| Template | Condicion while | Uso |
|----------|----------------|-----|
| **Exacto** | `left <= right` | Buscar un valor especifico |
| **Limite** | `left < right` | Buscar frontera/primer True |
| **Answer** | `left < right` | Buscar en espacio de respuestas |

---

### Errores comunes

| Error | Problema | Solucion |
|-------|----------|----------|
| `left + right` | Puede causar overflow | Usar `left + (right - left) // 2` |
| `<=` vs `<` en while | Loop infinito o miss | Depende del template elegido |
| `mid+1` vs `mid` | Off-by-one error | Analizar que mitad descartas |
""",
        core_code_snippet="""# TEMPLATE 1: Binary Search Exacto
def binary_search(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = left + (right - left) // 2
        if nums[mid] == target: return mid
        elif nums[mid] < target: left = mid + 1
        else: right = mid - 1
    return -1  # left = punto de inserción

# TEMPLATE 2: Buscar Frontera (primer True)
def first_true(lo, hi, condition):
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if condition(mid): hi = mid
        else: lo = mid + 1
    return lo  # primer índice donde condition es True

# TEMPLATE 3: Binary Search on Answer
def min_answer(lo, hi, is_feasible):
    while lo < hi:
        mid = lo + (hi - lo) // 2
        if is_feasible(mid): hi = mid
        else: lo = mid + 1
    return lo""",
        content=[
            ContentBlock(
                type="text",
                content="""# Binary Search: De lo Básico a lo Avanzado

Binary Search es probablemente el algoritmo **más importante** en computer science. Reduce cualquier búsqueda de O(n) a O(log n) — eso es pasar de revisar 1 millón de elementos a solo 20 comparaciones.

## ¿Cuándo usar Binary Search?

| Señal | Ejemplo |
|-------|---------|
| Array **ordenado** + buscar valor | Búsqueda clásica |
| Encontrar **primera/última** ocurrencia | Lower/Upper bound |
| Array **rotado** ordenado | Buscar el punto de rotación |
| "Minimizar el máximo" / "Maximizar el mínimo" | Binary Search on Answer |
| Respuesta **monótona** (si X funciona, X+1 también) | Binary Search on Answer |

### El error #1 de principiantes
Binary search NO es solo para arrays. Se puede usar siempre que puedas **dividir el espacio de búsqueda a la mitad** con una condición."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Template 1: Binary Search EXACTO
def binary_search(nums: list[int], target: int) -> int:
    """
    Busca target en un array ordenado.
    Retorna el índice o -1 si no existe.
    
    CLAVE: while left <= right (incluye igualdad)
    Complejidad: O(log n) tiempo, O(1) espacio
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:  # <= porque left==right es un rango válido
        mid = left + (right - left) // 2  # Evita overflow
        
        if nums[mid] == target:
            return mid              # ¡Encontrado!
        elif nums[mid] < target:
            left = mid + 1          # Descartar mitad izquierda
        else:
            right = mid - 1         # Descartar mitad derecha
    
    return -1  # No encontrado
    # BONUS: 'left' = punto donde se insertaría target

# Ejemplo paso a paso: buscar 7 en [1,3,5,7,9,11]
# left=0, right=5 → mid=2, arr[2]=5 < 7 → left=3
# left=3, right=5 → mid=4, arr[4]=9 > 7 → right=3
# left=3, right=3 → mid=3, arr[3]=7 == 7 → ¡return 3!'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="bs-q1",
                    question="¿Por qué usamos `mid = left + (right - left) // 2` en vez de `mid = (left + right) // 2`?",
                    options=[
                        "Es más rápido computacionalmente",
                        "Evita overflow cuando left + right excede el valor máximo de un entero",
                        "Produce un mid más preciso",
                        "No hay diferencia, es solo estilo"
                    ],
                    correct_index=1,
                    explanation="En lenguajes como Java o C++, left + right puede causar integer overflow si ambos son muy grandes. left + (right - left) // 2 es matemáticamente equivalente pero seguro. En Python no hay overflow de enteros, pero es buena práctica mencionarlo en entrevistas.",
                    difficulty="easy"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Template 2: Buscar Primera/Última Ocurrencia

A veces no buscas un valor exacto, sino la **frontera**: ¿dónde empieza o termina algo?

```
Array: [1, 2, 2, 2, 2, 3, 4]
Primera ocurrencia de 2 → índice 1
Última ocurrencia de 2 → índice 4
```

El truco: cuando encuentras target, **no paras**, sigues buscando hacia un lado."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Encontrar PRIMERA ocurrencia (lower bound)
def first_occurrence(nums: list[int], target: int) -> int:
    """
    Cuando encontramos target, NO retornamos.
    Seguimos buscando a la IZQUIERDA por si hay otra.
    """
    left, right = 0, len(nums) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid         # Guardar candidato
            right = mid - 1      # Seguir buscando a la izquierda
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result

# Encontrar ÚLTIMA ocurrencia (upper bound)
def last_occurrence(nums: list[int], target: int) -> int:
    """
    Igual pero buscamos a la DERECHA cuando encontramos.
    """
    left, right = 0, len(nums) - 1
    result = -1
    
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            result = mid         # Guardar candidato
            left = mid + 1       # Seguir buscando a la derecha
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return result

# Ejemplo
arr = [1, 2, 2, 2, 2, 3, 4]
print(first_occurrence(arr, 2))  # 1
print(last_occurrence(arr, 2))   # 4

# BONUS: Módulo bisect de Python hace esto
import bisect
print(bisect.bisect_left(arr, 2))   # 1 (primera posición de 2)
print(bisect.bisect_right(arr, 2))  # 5 (primera posición después de 2)'''
            ),
            ContentBlock(
                type="text",
                content="""## Search in Rotated Sorted Array

Un clásico de entrevistas FAANG. El array estaba ordenado pero se "rotó":

```
Original: [0, 1, 2, 3, 4, 5, 6, 7]
Rotado:   [4, 5, 6, 7, 0, 1, 2, 3]
```

**Idea clave**: Al menos UNA mitad siempre está ordenada. Determina cuál y verifica si target está en ella."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''def search_rotated(nums: list[int], target: int) -> int:
    """
    Binary search en array rotado.
    
    En cada paso, una mitad está ordenada:
    - Si nums[left] <= nums[mid]: izquierda ordenada
    - Si no: derecha ordenada
    
    Verificamos si target está en la mitad ordenada.
    Si sí, buscamos ahí. Si no, buscamos en la otra.
    
    Complejidad: O(log n) tiempo, O(1) espacio
    """
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        
        # ¿La mitad IZQUIERDA está ordenada?
        if nums[left] <= nums[mid]:
            # ¿Target está en la mitad izquierda (ordenada)?
            if nums[left] <= target < nums[mid]:
                right = mid - 1     # Sí, buscar ahí
            else:
                left = mid + 1      # No, buscar en la otra
        # La mitad DERECHA está ordenada
        else:
            # ¿Target está en la mitad derecha (ordenada)?
            if nums[mid] < target <= nums[right]:
                left = mid + 1      # Sí, buscar ahí
            else:
                right = mid - 1     # No, buscar en la otra
    
    return -1

# [4, 5, 6, 7, 0, 1, 2], target=0
# mid=7, left=4 <= 7 → izq ordenada, 0 no está en [4,7) → right half
# mid=1, left=0 <= 1 → izq ordenada, 0 está en [0,1) → left half  
# mid=0 == target → ¡Encontrado!
print(search_rotated([4,5,6,7,0,1,2], 0))  # 4'''
            ),
            ContentBlock(
                type="text",
                content="""## Binary Search on Answer (Avanzado)

Esta es la aplicación más poderosa y la que separa a los candidatos buenos de los excelentes. En vez de buscar un valor en un array, **buscas la respuesta óptima**.

**Patrón**: "¿Cuál es el mínimo/máximo X tal que se cumple una condición?"

Si la condición es **monótona** (si funciona para X, también funciona para X+1), puedes usar binary search.

Ejemplos:
- Koko comiendo bananas: mínima velocidad para terminar en H horas
- Dividir array en subarrays: minimizar la suma máxima
- Capacidad de barco: mínima capacidad para enviar todo en D días"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import math

def min_eating_speed(piles: list[int], h: int) -> int:
    """
    Koko come bananas: encuentra la velocidad MÍNIMA
    para comer todas las pilas en h horas.
    
    Binary Search on Answer:
    - Rango de respuesta: [1, max(piles)]
    - Condición: ¿puede terminar con velocidad mid?
    - Si sí → intentar más lento (right = mid)
    - Si no → necesita más rápido (left = mid + 1)
    
    Complejidad: O(n × log(max_pile)) tiempo
    """
    def can_finish(speed):
        """¿Puede comer todo en h horas con esta velocidad?"""
        hours = sum(math.ceil(pile / speed) for pile in piles)
        return hours <= h
    
    left, right = 1, max(piles)
    
    while left < right:  # Nota: < no <=
        mid = (left + right) // 2
        if can_finish(mid):
            right = mid       # Puede, intentar más lento
        else:
            left = mid + 1    # No puede, necesita más rápido
    
    return left

# piles=[3,6,7,11], h=8
# Rango: [1, 11]
# speed=6 → horas=1+1+2+2=6 ≤ 8 ✓ → intentar menos
# speed=3 → horas=1+2+3+4=10 > 8 ✗ → necesita más
# speed=4 → horas=1+2+2+3=8 ≤ 8 ✓ → respuesta: 4
print(min_eating_speed([3,6,7,11], 8))  # 4'''
            ),
            ContentBlock(
                type="warning",
                content="**El error más común**: confundir `<` con `<=` y `mid` con `mid+1`. En Binary Search on Answer, usa `while left < right` (sin =) y `right = mid` (sin -1). Esto busca la frontera donde la condición cambia de False a True."
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="bs-q2",
                    question="En Binary Search on Answer, ¿por qué usamos 'while left < right' en vez de 'while left <= right'?",
                    options=[
                        "Es más rápido",
                        "Porque buscamos una frontera (no un valor exacto), y cuando left == right, hemos convergido a la respuesta",
                        "Para evitar loops infinitos",
                        "No hay diferencia real"
                    ],
                    correct_index=1,
                    explanation="Correcto. En binary search on answer buscamos el PRIMER valor donde la condición es True (la frontera). Cuando left == right, hemos convergido: ese es el valor mínimo que cumple la condición. Si usáramos <=, necesitaríamos lógica adicional para detectar cuándo parar.",
                    difficulty="hard"
                )
            )
        ],
        codeExamples=[
            CodeExample(
                title="Search in Rotated Sorted Array",
                description="El clásico de entrevistas: binary search en array rotado",
                code='''def search_rotated(nums, target):
    left, right = 0, len(nums) - 1
    while left <= right:
        mid = (left + right) // 2
        if nums[mid] == target:
            return mid
        if nums[left] <= nums[mid]:
            if nums[left] <= target < nums[mid]:
                right = mid - 1
            else:
                left = mid + 1
        else:
            if nums[mid] < target <= nums[right]:
                left = mid + 1
            else:
                right = mid - 1
    return -1

print(search_rotated([4,5,6,7,0,1,2], 0))  # 4''',
                language="python"
            ),
            CodeExample(
                title="Find Peak Element",
                description="Encontrar un pico local usando binary search",
                code='''def find_peak_element(nums: list[int]) -> int:
    """
    Un pico es mayor que sus vecinos.
    Si nums[mid] < nums[mid+1], hay un pico a la derecha.
    Si nums[mid] > nums[mid+1], hay un pico a la izquierda (o es mid).
    
    Complejidad: O(log n)
    """
    left, right = 0, len(nums) - 1
    
    while left < right:
        mid = (left + right) // 2
        if nums[mid] < nums[mid + 1]:
            left = mid + 1   # Pico a la derecha
        else:
            right = mid       # Pico a la izquierda o en mid
    
    return left

print(find_peak_element([1,2,3,1]))  # 2 (valor 3)
print(find_peak_element([1,2,1,3,5,6,4]))  # 5 (valor 6)''',
                language="python"
            )
        ],
        quiz_questions=[
            QuizQuestion(
                id="bs-final-1",
                question="¿Cuántas comparaciones necesita binary search para buscar en un array de 1,000,000 elementos?",
                options=[
                    "1,000,000 en el peor caso",
                    "Alrededor de 20 (log2 de 1,000,000)",
                    "500,000 (la mitad)",
                    "100 (raíz cuadrada)"
                ],
                correct_index=1,
                explanation="log₂(1,000,000) ≈ 20. Binary search reduce el espacio a la mitad en cada paso: 1M → 500K → 250K → ... → 1. Necesita ⌈log₂(n)⌉ pasos. Esto es lo que hace a binary search tan poderoso comparado con búsqueda lineal O(n).",
                difficulty="easy"
            )
        ],
        prerequisites=[],
        nextLessonId=None
    ),
    
    # === MÓDULO: Sorting Algorithms ===
    Lesson(
        id="sorting-intro",
        moduleId="sorting-algorithms",
        title="Algoritmos de Ordenamiento: Guía Completa",
        description="Quick sort, merge sort, counting sort y cuándo usar cada uno. Con análisis de trade-offs.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=65,
        status=LessonStatus.AVAILABLE,
        feynman_explanation="""Imagina que tienes 100 cartas desordenadas y necesitas ordenarlas. Quick Sort: eliges una carta al azar (pivote), pones las menores a la izquierda y las mayores a la derecha, y repites con cada mitad. Merge Sort: divides el mazo en dos, ordenas cada mitad por separado, y luego las combinas como un zipper. Quick Sort es más rápido en la práctica (menos movimientos), pero Merge Sort es más predecible (siempre O(n log n)). Python usa Tim Sort, una mezcla inteligente de ambos.""",
        visual_diagram="""## Comparacion de Algoritmos de Sorting

### Tabla de referencia

| Algoritmo | Mejor | Promedio | Peor | Espacio | Estable |
|-----------|-------|----------|------|---------|---------|
| **Quick Sort** | O(n log n) | O(n log n) | O(n^2) | O(log n) | No |
| **Merge Sort** | O(n log n) | O(n log n) | O(n log n) | O(n) | Si |
| **Heap Sort** | O(n log n) | O(n log n) | O(n log n) | O(1) | No |
| **Tim Sort** | O(n) | O(n log n) | O(n log n) | O(n) | Si |
| **Counting** | O(n+k) | O(n+k) | O(n+k) | O(k) | Si |

---

### Quick Sort (divide and conquer)

```
  [3, 6, 8, 10, 1, 2, 1]     pivot = 6
  [3, 1, 2, 1]  [6]  [8, 10]   ← particionar
  [1, 1, 2, 3]  [6]  [8, 10]   ← ordenar recursivamente
```

### Merge Sort (divide and conquer)

```
  [38, 27, 43, 3, 9, 82, 10]           ← original
  [38, 27, 43, 3]    [9, 82, 10]       ← dividir
  [27, 38]  [3, 43]   [9, 82]  [10]    ← dividir mas
  [3, 27, 38, 43]    [9, 10, 82]       ← merge
  [3, 9, 10, 27, 38, 43, 82]           ← merge final
```

---

### Estabilidad (mantiene orden relativo de iguales)

| Estables | No estables |
|----------|-------------|
| Merge Sort, Tim Sort, Counting Sort | Quick Sort, Heap Sort |
""",
        core_code_snippet="""# Quick Sort - El más usado en la práctica
def quick_sort(arr):
    if len(arr) <= 1: return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    mid = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + mid + quick_sort(right)

# Merge Sort - Garantizado O(n log n)
def merge_sort(arr):
    if len(arr) <= 1: return arr
    m = len(arr) // 2
    L, R = merge_sort(arr[:m]), merge_sort(arr[m:])
    return merge(L, R)

def merge(L, R):
    result, i, j = [], 0, 0
    while i < len(L) and j < len(R):
        if L[i] <= R[j]: result.append(L[i]); i += 1
        else: result.append(R[j]); j += 1
    return result + L[i:] + R[j:]""",
        content=[
            ContentBlock(
                type="text",
                content="""# Algoritmos de Ordenamiento

Ordenar es una de las operaciones más fundamentales en ciencias de la computación. En entrevistas, necesitas saber:

1. **Implementar** Quick Sort y Merge Sort desde cero
2. **Elegir** el algoritmo correcto para cada situación
3. **Usar** `sorted()` y `sort()` de Python con `key` personalizado
4. Entender **estabilidad** y cuándo importa

## Tabla de Referencia Rápida

| Algoritmo | Tiempo Promedio | Peor Caso | Espacio | Estable | Cuándo usar |
|-----------|----------------|-----------|---------|---------|-------------|
| Quick Sort | O(n log n) | O(n²) | O(log n) | No | Uso general, rápido en práctica |
| Merge Sort | O(n log n) | O(n log n) | O(n) | Sí | Necesitas estabilidad o worst-case |
| Heap Sort | O(n log n) | O(n log n) | O(1) | No | Memoria limitada |
| Tim Sort | O(n log n) | O(n log n) | O(n) | Sí | ¡Python lo usa! Datos semi-ordenados |
| Counting Sort | O(n + k) | O(n + k) | O(k) | Sí | Rango pequeño de valores |"""
            ),
            ContentBlock(
                type="text",
                content="""## Quick Sort — El más rápido en la práctica

**Idea**: Elige un **pivote**, pon los menores a la izquierda y los mayores a la derecha, y repite recursivamente.

### ¿Por qué es "quick"?
- Excelente cache performance (acceso secuencial a memoria)
- Constantes pequeñas comparado con merge sort
- In-place en la versión con partición

### ¿Cuándo NO usar Quick Sort?
- Cuando necesitas **garantía O(n log n)** (peor caso es O(n²))
- Cuando necesitas **estabilidad** (mantener orden de iguales)"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Quick Sort - Versión Simple (usa espacio extra)
def quick_sort(arr: list) -> list:
    """
    Divide: elige pivote, separa menores y mayores.
    Conquista: ordena recursivamente cada parte.
    
    Esta versión es fácil de entender pero usa O(n) espacio.
    """
    if len(arr) <= 1:
        return arr
    
    pivot = arr[len(arr) // 2]  # Pivote: elemento del medio
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    
    return quick_sort(left) + middle + quick_sort(right)

# Versión IN-PLACE con Lomuto Partition (más cercana a la real)
def quick_sort_inplace(arr: list, lo: int = 0, hi: int = None) -> None:
    """Quick Sort in-place usando partición Lomuto."""
    if hi is None:
        hi = len(arr) - 1
    
    if lo < hi:
        pivot_idx = partition(arr, lo, hi)
        quick_sort_inplace(arr, lo, pivot_idx - 1)
        quick_sort_inplace(arr, pivot_idx + 1, hi)

def partition(arr, lo, hi):
    """
    Partición Lomuto: pivote = último elemento.
    Reorganiza para que menores estén a la izquierda.
    Retorna la posición final del pivote.
    """
    pivot = arr[hi]
    i = lo  # Frontera de los "menores que pivote"
    
    for j in range(lo, hi):
        if arr[j] < pivot:
            arr[i], arr[j] = arr[j], arr[i]
            i += 1
    
    arr[i], arr[hi] = arr[hi], arr[i]  # Colocar pivote
    return i

arr = [3, 6, 8, 10, 1, 2, 1]
quick_sort_inplace(arr)
print(arr)  # [1, 1, 2, 3, 6, 8, 10]'''
            ),
            ContentBlock(
                type="text",
                content="""## Merge Sort — Garantizado y Estable

**Idea**: Divide el array a la mitad, ordena cada mitad recursivamente, y luego **merge** (combina) ambas mitades ordenadas.

### Ventajas sobre Quick Sort
- **Siempre O(n log n)** — sin peor caso cuadrático
- **Estable** — mantiene el orden relativo de elementos iguales
- Base de muchos algoritmos (merge k lists, external sort, count inversions)

### Desventaja
- Usa **O(n) espacio extra** para el merge"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Merge Sort - Completo con explicación
def merge_sort(arr: list) -> list:
    """
    Divide y Conquista:
    1. Si el array tiene 0-1 elementos, ya está ordenado
    2. Divide por la mitad
    3. Ordena cada mitad recursivamente
    4. Merge las dos mitades ordenadas
    
    Complejidad: O(n log n) siempre, O(n) espacio
    """
    if len(arr) <= 1:
        return arr
    
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    
    return merge(left, right)

def merge(left: list, right: list) -> list:
    """
    Combina dos listas ORDENADAS en una sola ordenada.
    Usa dos punteros (¡Two Pointers otra vez!).
    
    Complejidad: O(n + m) donde n, m son los tamaños
    """
    result = []
    i = j = 0
    
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:  # <= para estabilidad
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    
    # Agregar los restantes
    result.extend(left[i:])
    result.extend(right[j:])
    return result

print(merge_sort([38, 27, 43, 3, 9, 82, 10]))
# [3, 9, 10, 27, 38, 43, 82]'''
            ),
            ContentBlock(
                type="quiz",
                quiz=QuizQuestion(
                    id="sort-q1",
                    question="¿Cuándo es merge sort MEJOR que quick sort?",
                    options=[
                        "Siempre, porque tiene mejor complejidad promedio",
                        "Cuando el array es pequeño (< 10 elementos)",
                        "Cuando necesitas estabilidad o peor caso garantizado O(n log n)",
                        "Cuando el array ya está casi ordenado"
                    ],
                    correct_index=2,
                    explanation="Merge sort es mejor cuando necesitas: 1) Estabilidad (mantener orden relativo de iguales), o 2) Garantía de O(n log n) en el peor caso. Quick sort tiene peor caso O(n²) aunque es más rápido en la práctica por constantes menores y mejor uso de caché.",
                    difficulty="medium"
                )
            ),
            ContentBlock(
                type="text",
                content="""## Sorting en Python: `sorted()` y `.sort()`

En entrevistas, generalmente NO necesitas implementar sorting desde cero. Python usa **Tim Sort** que es O(n log n) y estable.

Lo que sí necesitas dominar es el parámetro `key`:

```python
# Ordenar por longitud
words = ["banana", "pie", "Washington", "book"]
sorted(words, key=len)  # ['pie', 'book', 'banana', 'Washington']

# Ordenar por segundo elemento
pairs = [(1, 'b'), (2, 'a'), (1, 'a')]
sorted(pairs, key=lambda x: x[1])  # [(2, 'a'), (1, 'a'), (1, 'b')]

# Ordenar por múltiples criterios
# Primero por edad, luego por nombre
people = [("Bob", 25), ("Alice", 25), ("Charlie", 20)]
sorted(people, key=lambda x: (x[1], x[0]))
# [('Charlie', 20), ('Alice', 25), ('Bob', 25)]

# Ordenar descendente
sorted(nums, reverse=True)
sorted(nums, key=lambda x: -x)  # Alternativa
```"""
            ),
            ContentBlock(
                type="info",
                content="**Para entrevistas**: Si el problema no pide implementar el sorting, usa `sorted()`. Si pide específicamente implementar uno, Quick Sort es lo más impresionante por ser in-place, pero Merge Sort es más fácil de implementar correctamente."
            ),
            ContentBlock(
                type="warning",
                content="**¿Estabilidad importa?** Sí cuando ordenas por múltiples criterios. Si ordenas primero por nombre y luego por edad, un sort estable mantiene el orden por nombre para personas de la misma edad. Python `sorted()` ES estable — aprovéchalo."
            )
        ],
        codeExamples=[
            CodeExample(
                title="Sort Colors (Dutch National Flag)",
                description="Ordenar array con solo 3 valores distintos en UNA pasada O(n)",
                code='''def sort_colors(nums: list[int]) -> None:
    """
    Solo tiene 0s, 1s, 2s. Ordenar in-place.
    
    3 punteros:
    - low: frontera de 0s
    - mid: puntero actual  
    - high: frontera de 2s
    
    Complejidad: O(n) tiempo, O(1) espacio - UNA pasada
    """
    low = mid = 0
    high = len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 1:
            mid += 1
        else:  # nums[mid] == 2
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
            # ¡NO avanzar mid! El swap puede traer un 0

arr = [2, 0, 2, 1, 1, 0]
sort_colors(arr)
print(arr)  # [0, 0, 1, 1, 2, 2]''',
                language="python"
            ),
            CodeExample(
                title="Counting Sort — Cuando los valores tienen rango limitado",
                description="O(n + k) — más rápido que cualquier sort por comparación",
                code='''def counting_sort(arr: list[int]) -> list[int]:
    """
    Funciona cuando los valores están en un rango [0, k].
    Cuenta ocurrencias y reconstruye el array.
    
    Complejidad: O(n + k) tiempo y espacio
    Supera O(n log n) cuando k es pequeño.
    """
    if not arr:
        return arr
    
    max_val = max(arr)
    count = [0] * (max_val + 1)
    
    # Contar ocurrencias
    for num in arr:
        count[num] += 1
    
    # Reconstruir
    result = []
    for val, cnt in enumerate(count):
        result.extend([val] * cnt)
    
    return result

print(counting_sort([4, 2, 2, 8, 3, 3, 1]))
# [1, 2, 2, 3, 3, 4, 8]

# Útil para: edades, calificaciones, caracteres ASCII''',
                language="python"
            )
        ],
        quiz_questions=[
            QuizQuestion(
                id="sort-final-1",
                question="¿Qué sorting algorithm usa Python internamente con sorted() y .sort()?",
                options=[
                    "Quick Sort porque es el más rápido",
                    "Merge Sort porque es estable",
                    "Tim Sort, un híbrido de Merge Sort e Insertion Sort optimizado para datos reales",
                    "Heap Sort porque usa O(1) espacio"
                ],
                correct_index=2,
                explanation="Python usa Tim Sort, creado por Tim Peters. Es un híbrido inteligente: usa Insertion Sort para runs pequeños y Merge Sort para combinarlos. Es O(n log n) en peor caso, estable, y especialmente eficiente con datos parcialmente ordenados — puede ser O(n) si los datos ya están casi ordenados.",
                difficulty="medium"
            )
        ],
        prerequisites=[],
        nextLessonId=None
    ),
    
    # === MÓDULO: Advanced Graphs ===
    Lesson(
        id="advanced-graphs-intro",
        moduleId="advanced-graphs",
        title="Grafos Avanzados",
        description="Dijkstra, topological sort, union find.",
        order=1,
        difficulty=Difficulty.HARD,
        estimatedMinutes=60,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Algoritmos de Grafos Avanzados

## Dijkstra
Camino más corto desde un nodo a todos los demás. O((V+E) log V) con heap.

## Topological Sort
Ordenar nodos en un DAG respetando dependencias.

## Union Find
Estructure para conjuntos disjuntos - eficiente para componentes conectados."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''import heapq

# Dijkstra
def dijkstra(graph, start):
    distances = {node: float('inf') for node in graph}
    distances[start] = 0
    pq = [(0, start)]
    
    while pq:
        dist, node = heapq.heappop(pq)
        
        if dist > distances[node]:
            continue
        
        for neighbor, weight in graph[node]:
            new_dist = dist + weight
            if new_dist < distances[neighbor]:
                distances[neighbor] = new_dist
                heapq.heappush(pq, (new_dist, neighbor))
    
    return distances

# Union Find
class UnionFind:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        px, py = self.find(x), self.find(y)
        if px == py:
            return False
        if self.rank[px] < self.rank[py]:
            px, py = py, px
        self.parent[py] = px
        if self.rank[px] == self.rank[py]:
            self.rank[px] += 1
        return True'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Number of Connected Components",
                description="Contar componentes usando Union Find",
                code='''def count_components(n, edges):
    uf = UnionFind(n)
    
    for a, b in edges:
        uf.union(a, b)
    
    # Contar roots únicos
    return len(set(uf.find(i) for i in range(n)))

print(count_components(5, [[0,1],[1,2],[3,4]]))  # 2''',
                language="python"
            )
        ],
        prerequisites=["graphs-intro"],
        nextLessonId=None
    ),
    
    # === MÓDULO: Tries ===
    Lesson(
        id="tries-intro",
        moduleId="tries",
        title="Tries (Prefix Trees)",
        description="Estructura para búsqueda eficiente de strings por prefijo.",
        order=1,
        difficulty=Difficulty.MEDIUM,
        estimatedMinutes=50,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Tries (Prefix Trees)

Un Trie es un árbol donde cada nodo representa un carácter. Permite:
- Inserción: O(m) donde m es longitud del string
- Búsqueda: O(m)
- Búsqueda por prefijo: O(m)

Ideal para autocompletado, spell checkers, diccionarios."""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''class TrieNode:
    def __init__(self):
        self.children = {}
        self.is_end = False

class Trie:
    def __init__(self):
        self.root = TrieNode()
    
    def insert(self, word):
        node = self.root
        for char in word:
            if char not in node.children:
                node.children[char] = TrieNode()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word):
        node = self._find_node(word)
        return node is not None and node.is_end
    
    def starts_with(self, prefix):
        return self._find_node(prefix) is not None
    
    def _find_node(self, prefix):
        node = self.root
        for char in prefix:
            if char not in node.children:
                return None
            node = node.children[char]
        return node

# Uso
trie = Trie()
trie.insert("apple")
print(trie.search("apple"))      # True
print(trie.search("app"))        # False
print(trie.starts_with("app"))   # True'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Word Search II",
                description="Encontrar palabras del diccionario en una matriz",
                code='''def find_words(board, words):
    trie = Trie()
    for word in words:
        trie.insert(word)
    
    result = set()
    rows, cols = len(board), len(board[0])
    
    def dfs(r, c, node, path):
        if node.is_end:
            result.add(path)
        
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        
        char = board[r][c]
        if char not in node.children:
            return
        
        board[r][c] = '#'
        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:
            dfs(r+dr, c+dc, node.children[char], path+char)
        board[r][c] = char
    
    for r in range(rows):
        for c in range(cols):
            dfs(r, c, trie.root, "")
    
    return list(result)''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId=None
    ),
    
    # === MÓDULO: Interview Prep ===
    Lesson(
        id="interview-prep-intro",
        moduleId="interview-prep",
        title="Preparación para Entrevistas",
        description="Estrategias, patrones comunes y cómo comunicar tu solución.",
        order=1,
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=45,
        status=LessonStatus.AVAILABLE,
        content=[
            ContentBlock(
                type="text",
                content="""# Preparación para Entrevistas Técnicas

## El Framework UMPIRE

1. **U**nderstand: Clarifica el problema
2. **M**atch: Identifica patrones conocidos
3. **P**lan: Diseña tu approach
4. **I**mplement: Escribe el código
5. **R**eview: Revisa errores
6. **E**valuate: Analiza complejidad"""
            ),
            ContentBlock(
                type="text",
                content="""## Preguntas para Clarificar

- ¿Cuál es el rango de los inputs?
- ¿El array está ordenado?
- ¿Puede haber duplicados?
- ¿Qué retornar si no hay solución?
- ¿Puedo modificar el input?
- ¿Qué restricciones de tiempo/espacio hay?

## Patrones a Reconocer

| Si ves... | Piensa en... |
|-----------|-------------|
| Array ordenado | Binary Search, Two Pointers |
| Pares/tripletas | Hash Map, Two Pointers |
| Subarrays contiguos | Sliding Window |
| Árbol/Grafo | BFS, DFS |
| Encontrar min/max | Heap |
| Optimización | DP |
| Strings/prefijos | Trie |"""
            ),
            ContentBlock(
                type="code",
                language="python",
                content='''# Ejemplo de cómo comunicar tu solución

"""
Entrevistador: Dado un array de enteros, encuentra dos 
números que sumen un target.

TÚ:
1. CLARIFICAR:
   - ¿El array está ordenado? (No)
   - ¿Siempre hay solución? (Sí)
   - ¿Puedo usar el mismo elemento dos veces? (No)

2. APPROACH:
   - Fuerza bruta sería O(n^2) con dos loops
   - Pero puedo usar un hash map para O(n)
   - Guardo cada número y su índice
   - Para cada número, busco su complemento

3. CÓDIGO:
"""
def two_sum(nums, target):
    seen = {}  # valor -> índice
    
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    
    return []  # No debería llegar aquí

"""
4. COMPLEJIDAD:
   - Tiempo: O(n) - un paso por el array
   - Espacio: O(n) - para el hash map
"""'''
            )
        ],
        codeExamples=[
            CodeExample(
                title="Template para Resolver Problemas",
                description="Estructura mental para abordar cualquier problema",
                code='''def solve_problem(input_data):
    """
    PASO 1: Entender el problema
    - ¿Qué me piden exactamente?
    - ¿Cuáles son los edge cases?
    
    PASO 2: Identificar el patrón
    - ¿Es Two Pointers? ¿Sliding Window?
    - ¿BFS/DFS? ¿DP?
    
    PASO 3: Escribir pseudocódigo
    
    PASO 4: Implementar
    
    PASO 5: Probar con ejemplos
    - Caso normal
    - Edge cases (vacío, un elemento, etc.)
    
    PASO 6: Analizar complejidad
    """
    
    # Edge cases primero
    if not input_data:
        return default_value
    
    # Inicializar estructuras de datos
    result = []
    
    # Lógica principal
    for item in input_data:
        # Procesar
        pass
    
    return result''',
                language="python"
            )
        ],
        prerequisites=[],
        nextLessonId=None
    )
]


@router.get("/", response_model=List[Lesson])
async def get_all_lessons():
    """Obtiene todas las lecciones."""
    return LESSONS_DATA


@router.get("/{lesson_id}", response_model=Lesson)
async def get_lesson(lesson_id: str):
    """Obtiene una lección específica por su ID."""
    for lesson in LESSONS_DATA:
        if lesson.id == lesson_id:
            return lesson
    raise HTTPException(status_code=404, detail=f"Lección '{lesson_id}' no encontrada")


@router.get("/{lesson_id}/quiz")
async def get_lesson_quiz(lesson_id: str, shuffle: bool = True):
    """
    Obtiene el quiz de una lección específica.
    shuffle: Si es True, mezcla el orden de las preguntas y opciones.
    """
    import random
    
    for lesson in LESSONS_DATA:
        if lesson.id == lesson_id:
            if not lesson.quiz_questions:
                return {
                    "lessonId": lesson_id,
                    "lessonTitle": lesson.title,
                    "questions": [],
                    "message": "Esta lección aún no tiene quiz."
                }
            
            questions = []
            quiz_list = list(lesson.quiz_questions)
            
            if shuffle:
                random.shuffle(quiz_list)
            
            for q in quiz_list:
                # Mezclar opciones manteniendo track del índice correcto
                options_with_index = list(enumerate(q.options))
                if shuffle:
                    random.shuffle(options_with_index)
                
                new_correct_index = next(
                    i for i, (orig_idx, _) in enumerate(options_with_index) 
                    if orig_idx == q.correct_index
                )
                
                questions.append({
                    "id": q.id,
                    "question": q.question,
                    "options": [opt for _, opt in options_with_index],
                    "correct_index": new_correct_index,
                    "explanation": q.explanation,
                    "difficulty": q.difficulty
                })
            
            return {
                "lessonId": lesson_id,
                "lessonTitle": lesson.title,
                "questions": questions,
                "totalQuestions": len(questions),
                "message": f"🧠 Quiz de {lesson.title} - ¡Demuestra lo que aprendiste!"
            }
    
    raise HTTPException(status_code=404, detail=f"Lección '{lesson_id}' no encontrada")


@router.post("/{lesson_id}/quiz/check")
async def check_quiz_answer(lesson_id: str, question_id: str, selected_index: int):
    """
    Verifica una respuesta del quiz.
    Retorna si es correcta y la explicación.
    """
    for lesson in LESSONS_DATA:
        if lesson.id == lesson_id:
            for q in lesson.quiz_questions:
                if q.id == question_id:
                    is_correct = selected_index == q.correct_index
                    return {
                        "correct": is_correct,
                        "correctIndex": q.correct_index,
                        "explanation": q.explanation,
                        "message": "✅ ¡Correcto!" if is_correct else "❌ Incorrecto. Lee la explicación."
                    }
            raise HTTPException(status_code=404, detail=f"Pregunta '{question_id}' no encontrada")
    raise HTTPException(status_code=404, detail=f"Lección '{lesson_id}' no encontrada")


async def get_lessons_by_module(module_id: str) -> List[Lesson]:
    """Obtiene las lecciones de un módulo específico."""
    return [l for l in LESSONS_DATA if l.moduleId == module_id]


@router.get("/module/{module_id}", response_model=List[Lesson])
async def get_lessons_for_module(module_id: str):
    """Obtiene las lecciones de un módulo específico."""
    lessons = await get_lessons_by_module(module_id)
    if not lessons:
        raise HTTPException(status_code=404, detail=f"No se encontraron lecciones para el módulo '{module_id}'")
    return lessons
