"""
Exercises Router
================
Endpoints para gestión de ejercicios de práctica.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from ..models import Exercise, Difficulty, ExerciseStatus, TestCase, AlgorithmPattern

router = APIRouter()

# Datos de ejercicios
EXERCISES_DATA: List[Exercise] = [
    # === MÓDULO: Fundamentos de Python ===
    Exercise(
        id="find-duplicate-number",
        moduleId="fundamentos-python",
        lessonId="python-listas-tuplas",
        title="Encontrar el Duplicado",
        description="""Dado un array de `n + 1` enteros donde cada entero está en el rango `[1, n]`, existe **exactamente un número duplicado**.

Encuentra y retorna el número duplicado.

**Restricción adicional**: Debes resolver el problema **sin modificar** el array y usando solo **O(1) espacio extra**.""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def find_duplicate(nums: list[int]) -> int:
    """
    Encuentra el único número duplicado.
    
    Args:
        nums: Lista de n+1 enteros en rango [1, n]
        
    Returns:
        El número duplicado
    """
    # Tu código aquí
    pass''',
        solution='''def find_duplicate(nums: list[int]) -> int:
    """
    Usa Floyd's Cycle Detection (tortuga y liebre).
    Como cada num está en [1, n], podemos tratar los valores como punteros.
    El duplicado crea un ciclo.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    # Fase 1: Detectar el ciclo
    slow = fast = nums[0]
    while True:
        slow = nums[slow]         # Un paso
        fast = nums[nums[fast]]   # Dos pasos
        if slow == fast:
            break
    
    # Fase 2: Encontrar entrada del ciclo
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow''',
        hints=[
            "Los valores están en [1, n], así que puedes usar cada valor como 'puntero' al siguiente índice",
            "El duplicado crea un ciclo - piensa en detección de ciclos en linked lists",
            "Algoritmo de Floyd (tortuga y liebre) puede encontrar el inicio del ciclo"
        ],
        testCases=[
            TestCase(input={"nums": [1, 3, 4, 2, 2]}, expected=2, isHidden=False),
            TestCase(input={"nums": [3, 1, 3, 4, 2]}, expected=3, isHidden=False),
            TestCase(input={"nums": [1, 1]}, expected=1, isHidden=False),
            TestCase(input={"nums": [2, 2, 2, 2, 2]}, expected=2, isHidden=True),
            TestCase(input={"nums": [1, 4, 4, 2, 4]}, expected=4, isHidden=True),
        ],
        constraints=[
            "1 ≤ n ≤ 10⁵",
            "nums.length == n + 1",
            "1 ≤ nums[i] ≤ n",
            "Solo hay un número duplicado, pero puede repetirse más de una vez"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Amazon", "Microsoft", "Bloomberg"],
        similarProblems=["find-all-duplicates", "missing-number"],
        order=1,
        points=15
    ),
    
    Exercise(
        id="rotate-array",
        moduleId="fundamentos-python",
        lessonId="python-listas-tuplas",
        title="Rotar Array",
        description="""Dado un array de enteros `nums`, rota el array hacia la derecha `k` pasos, donde `k` es no negativo.

Debes hacerlo **in-place** con **O(1) espacio extra**.

**Ejemplo:**
- Input: nums = [1,2,3,4,5,6,7], k = 3
- Output: [5,6,7,1,2,3,4]
- Explicación: rotar 1 paso: [7,1,2,3,4,5,6], rotar 2 pasos: [6,7,1,2,3,4,5], rotar 3 pasos: [5,6,7,1,2,3,4]""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=20,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def rotate(nums: list[int], k: int) -> None:
    """
    Rota el array k posiciones a la derecha in-place.
    
    Args:
        nums: Lista de enteros (modificar in-place)
        k: Número de posiciones a rotar
    """
    # Tu código aquí
    pass''',
        solution='''def rotate(nums: list[int], k: int) -> None:
    """
    Técnica de triple reverso:
    1. Revertir todo el array
    2. Revertir primeros k elementos
    3. Revertir el resto
    
    Ejemplo: [1,2,3,4,5,6,7], k=3
    [7,6,5,4,3,2,1] -> [5,6,7,4,3,2,1] -> [5,6,7,1,2,3,4]
    
    Complejidad: O(n) tiempo, O(1) espacio
    """
    n = len(nums)
    k = k % n  # Manejar k > n
    
    def reverse(start: int, end: int) -> None:
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    # Triple reverso
    reverse(0, n - 1)      # Revertir todo
    reverse(0, k - 1)      # Revertir primeros k
    reverse(k, n - 1)      # Revertir resto''',
        hints=[
            "¿Qué pasa si reviertes todo el array primero?",
            "Después de revertir todo, ¿cómo puedes 'arreglar' las dos partes?",
            "Técnica de triple reverso: reverse(todo) -> reverse(0:k) -> reverse(k:n)"
        ],
        testCases=[
            TestCase(input={"nums": [1, 2, 3, 4, 5, 6, 7], "k": 3}, expected=[5, 6, 7, 1, 2, 3, 4], isHidden=False),
            TestCase(input={"nums": [-1, -100, 3, 99], "k": 2}, expected=[3, 99, -1, -100], isHidden=False),
            TestCase(input={"nums": [1, 2], "k": 3}, expected=[2, 1], isHidden=False),
            TestCase(input={"nums": [1], "k": 0}, expected=[1], isHidden=True),
            TestCase(input={"nums": [1, 2, 3], "k": 4}, expected=[3, 1, 2], isHidden=True),
        ],
        constraints=[
            "1 ≤ nums.length ≤ 10⁵",
            "-2³¹ ≤ nums[i] ≤ 2³¹ - 1",
            "0 ≤ k ≤ 10⁵"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Microsoft", "Amazon", "Apple"],
        similarProblems=["rotate-list", "reverse-words-in-a-string"],
        order=2,
        points=15
    ),
    
    Exercise(
        id="intersection-two-arrays",
        moduleId="fundamentos-python",
        lessonId="python-diccionarios-sets",
        title="Intersección de Dos Arrays II",
        description="""Dados dos arrays de enteros `nums1` y `nums2`, retorna un array con su intersección.

Cada elemento en el resultado debe aparecer **tantas veces como aparece en ambos arrays**. El resultado puede estar en cualquier orden.

**Ejemplo:**
- Input: nums1 = [1,2,2,1], nums2 = [2,2]
- Output: [2,2]""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def intersect(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Encuentra la intersección de dos arrays (con repeticiones).
    
    Args:
        nums1: Primer array
        nums2: Segundo array
        
    Returns:
        Array con elementos comunes (incluyendo duplicados)
    """
    # Tu código aquí
    pass''',
        solution='''from collections import Counter

def intersect(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Usa Counter para contar frecuencias y tomar el mínimo.
    Complejidad: O(n + m) tiempo, O(min(n, m)) espacio
    """
    # Optimización: contar el array más pequeño
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    count = Counter(nums1)
    result = []
    
    for num in nums2:
        if count[num] > 0:
            result.append(num)
            count[num] -= 1
    
    return result''',
        hints=[
            "¿Qué estructura de datos te permite contar elementos eficientemente?",
            "Usa Counter o un diccionario para contar frecuencias del primer array",
            "Recorre el segundo array y 'consume' del contador"
        ],
        testCases=[
            TestCase(input={"nums1": [1, 2, 2, 1], "nums2": [2, 2]}, expected=[2, 2], isHidden=False),
            TestCase(input={"nums1": [4, 9, 5], "nums2": [9, 4, 9, 8, 4]}, expected=[4, 9], isHidden=False),
            TestCase(input={"nums1": [1, 2, 3], "nums2": [4, 5, 6]}, expected=[], isHidden=False),
            TestCase(input={"nums1": [1, 1, 1], "nums2": [1, 1]}, expected=[1, 1], isHidden=True),
        ],
        constraints=[
            "1 ≤ nums1.length, nums2.length ≤ 1000",
            "0 ≤ nums1[i], nums2[i] ≤ 1000"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Facebook", "Amazon", "Google"],
        similarProblems=["intersection-of-two-arrays", "find-common-characters"],
        order=3,
        points=10
    ),
    
    Exercise(
        id="single-number",
        moduleId="fundamentos-python",
        lessonId="python-diccionarios-sets",
        title="Número Único",
        description="""Dado un array de enteros `nums`, donde cada elemento aparece **dos veces** excepto uno que aparece **solo una vez**. Encuentra ese elemento único.

Debes implementar una solución con **O(n) tiempo** y **O(1) espacio extra**.

**Pista**: Piensa en operaciones bit a bit.""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=10,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def single_number(nums: list[int]) -> int:
    """
    Encuentra el número que aparece solo una vez.
    
    Args:
        nums: Lista donde todos los elementos aparecen dos veces excepto uno
        
    Returns:
        El número único
    """
    # Tu código aquí
    pass''',
        solution='''def single_number(nums: list[int]) -> int:
    """
    Usa XOR: a ^ a = 0, a ^ 0 = a
    XOR de todos los números deja solo el único.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    result = 0
    for num in nums:
        result ^= num
    return result''',
        hints=[
            "XOR tiene propiedades interesantes: a ^ a = 0 y a ^ 0 = a",
            "¿Qué pasa si haces XOR de todos los números?",
            "Los que aparecen dos veces se cancelan entre sí"
        ],
        testCases=[
            TestCase(input={"nums": [2, 2, 1]}, expected=1, isHidden=False),
            TestCase(input={"nums": [4, 1, 2, 1, 2]}, expected=4, isHidden=False),
            TestCase(input={"nums": [1]}, expected=1, isHidden=False),
            TestCase(input={"nums": [1, 0, 1]}, expected=0, isHidden=True),
            TestCase(input={"nums": [-1, -1, -2]}, expected=-2, isHidden=True),
        ],
        constraints=[
            "1 ≤ nums.length ≤ 3 × 10⁴",
            "-3 × 10⁴ ≤ nums[i] ≤ 3 × 10⁴",
            "Cada elemento aparece dos veces excepto uno"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Amazon", "Google", "Facebook"],
        similarProblems=["single-number-ii", "single-number-iii"],
        order=4,
        points=10
    ),
    
    Exercise(
        id="first-unique-char",
        moduleId="fundamentos-python",
        lessonId="python-strings",
        title="Primer Caracter Único",
        description="""Dado un string `s`, encuentra el **primer caracter que no se repite** y retorna su índice. Si no existe, retorna `-1`.

**Ejemplo:**
- Input: s = "leetcode"
- Output: 0 (el caracter 'l' es el primero que no se repite)

- Input: s = "loveleetcode"  
- Output: 2 (el caracter 'v' es el primero que no se repite)""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=10,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def first_uniq_char(s: str) -> int:
    """
    Encuentra el índice del primer caracter único.
    
    Args:
        s: String de entrada
        
    Returns:
        Índice del primer caracter único, o -1 si no existe
    """
    # Tu código aquí
    pass''',
        solution='''from collections import Counter

def first_uniq_char(s: str) -> int:
    """
    Cuenta frecuencias y busca el primero con count = 1.
    Complejidad: O(n) tiempo, O(1) espacio (máximo 26 letras)
    """
    count = Counter(s)
    
    for i, char in enumerate(s):
        if count[char] == 1:
            return i
    
    return -1''',
        hints=[
            "Primero cuenta la frecuencia de cada caracter",
            "Luego recorre el string otra vez buscando el primer caracter con frecuencia 1",
            "Counter de collections hace el conteo muy fácil"
        ],
        testCases=[
            TestCase(input={"s": "leetcode"}, expected=0, isHidden=False),
            TestCase(input={"s": "loveleetcode"}, expected=2, isHidden=False),
            TestCase(input={"s": "aabb"}, expected=-1, isHidden=False),
            TestCase(input={"s": "z"}, expected=0, isHidden=True),
            TestCase(input={"s": "aadadaad"}, expected=-1, isHidden=True),
        ],
        constraints=[
            "1 ≤ s.length ≤ 10⁵",
            "s consiste solo de letras minúsculas"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Amazon", "Google", "Microsoft", "Bloomberg"],
        similarProblems=["sort-characters-by-frequency", "first-letter-to-appear-twice"],
        order=5,
        points=10
    ),
    
    Exercise(
        id="valid-anagram",
        moduleId="fundamentos-python",
        lessonId="python-strings",
        title="Anagrama Válido",
        description="""Dados dos strings `s` y `t`, retorna `true` si `t` es un **anagrama** de `s`, y `false` en caso contrario.

Un **anagrama** es una palabra formada reordenando las letras de otra palabra, usando todas las letras originales exactamente una vez.

**Ejemplo:**
- Input: s = "anagram", t = "nagaram" → Output: true
- Input: s = "rat", t = "car" → Output: false""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=10,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def is_anagram(s: str, t: str) -> bool:
    """
    Verifica si t es un anagrama de s.
    
    Args:
        s: Primer string
        t: Segundo string
        
    Returns:
        True si son anagramas, False si no
    """
    # Tu código aquí
    pass''',
        solution='''from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    """
    Dos strings son anagramas si tienen los mismos caracteres
    con las mismas frecuencias.
    Complejidad: O(n) tiempo, O(1) espacio (máximo 26 letras)
    """
    return Counter(s) == Counter(t)''',
        hints=[
            "Los anagramas tienen exactamente los mismos caracteres",
            "¿Qué pasa si cuentas la frecuencia de cada caracter en ambos strings?",
            "Counter hace la comparación muy simple"
        ],
        testCases=[
            TestCase(input={"s": "anagram", "t": "nagaram"}, expected=True, isHidden=False),
            TestCase(input={"s": "rat", "t": "car"}, expected=False, isHidden=False),
            TestCase(input={"s": "a", "t": "a"}, expected=True, isHidden=False),
            TestCase(input={"s": "ab", "t": "ba"}, expected=True, isHidden=True),
            TestCase(input={"s": "aacc", "t": "ccac"}, expected=False, isHidden=True),
        ],
        constraints=[
            "1 ≤ s.length, t.length ≤ 5 × 10⁴",
            "s y t consisten de letras minúsculas"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Amazon", "Google", "Facebook", "Microsoft"],
        similarProblems=["group-anagrams", "find-all-anagrams-in-a-string"],
        order=6,
        points=10
    ),
    
    Exercise(
        id="reverse-string",
        moduleId="fundamentos-python",
        lessonId="python-strings",
        title="Revertir String",
        description="""Escribe una función que revierta un string. El string se da como un array de caracteres `s`.

Debes hacerlo **in-place** con **O(1) memoria extra**.

**Ejemplo:**
- Input: s = ["h","e","l","l","o"]
- Output: ["o","l","l","e","h"]""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=5,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def reverse_string(s: list[str]) -> None:
    """
    Revierte el array de caracteres in-place.
    
    Args:
        s: Lista de caracteres (modificar in-place)
    """
    # Tu código aquí
    pass''',
        solution='''def reverse_string(s: list[str]) -> None:
    """
    Two pointers: intercambia extremos y acerca los punteros.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    left, right = 0, len(s) - 1
    
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1''',
        hints=[
            "Usa dos punteros: uno al inicio y otro al final",
            "Intercambia los elementos en los punteros",
            "Acerca los punteros hasta que se crucen"
        ],
        testCases=[
            TestCase(input={"s": ["h", "e", "l", "l", "o"]}, expected=["o", "l", "l", "e", "h"], isHidden=False),
            TestCase(input={"s": ["H", "a", "n", "n", "a", "h"]}, expected=["h", "a", "n", "n", "a", "H"], isHidden=False),
            TestCase(input={"s": ["a"]}, expected=["a"], isHidden=True),
            TestCase(input={"s": ["a", "b"]}, expected=["b", "a"], isHidden=True),
        ],
        constraints=[
            "1 ≤ s.length ≤ 10⁵",
            "s[i] es un caracter ASCII imprimible"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Microsoft", "Amazon", "Apple"],
        similarProblems=["reverse-string-ii", "reverse-words-in-a-string"],
        order=7,
        points=5
    ),
    
    Exercise(
        id="fizz-buzz",
        moduleId="fundamentos-python",
        lessonId="python-comprehensions",
        title="FizzBuzz",
        description="""Dado un entero `n`, retorna un array de strings `answer` (1-indexed) donde:

- `answer[i] == "FizzBuzz"` si `i` es divisible por 3 y 5.
- `answer[i] == "Fizz"` si `i` es divisible por 3.
- `answer[i] == "Buzz"` si `i` es divisible por 5.
- `answer[i] == i` (como string) si ninguna de las condiciones anteriores es verdadera.

**Ejemplo:**
- Input: n = 5
- Output: ["1","2","Fizz","4","Buzz"]""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=10,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def fizz_buzz(n: int) -> list[str]:
    """
    Genera la secuencia FizzBuzz hasta n.
    
    Args:
        n: Número hasta el cual generar
        
    Returns:
        Lista con la secuencia FizzBuzz
    """
    # Tu código aquí
    pass''',
        solution='''def fizz_buzz(n: int) -> list[str]:
    """
    Solución concisa usando expresiones condicionales.
    Complejidad: O(n) tiempo, O(n) espacio (para el resultado)
    """
    result = []
    
    for i in range(1, n + 1):
        if i % 15 == 0:      # Divisible por 3 y 5
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    
    return result''',
        hints=[
            "Verifica primero si es divisible por 15 (3 y 5)",
            "El orden de las condiciones importa",
            "Puedes usar comprehension con expresiones condicionales anidadas"
        ],
        testCases=[
            TestCase(input={"n": 3}, expected=["1", "2", "Fizz"], isHidden=False),
            TestCase(input={"n": 5}, expected=["1", "2", "Fizz", "4", "Buzz"], isHidden=False),
            TestCase(input={"n": 15}, expected=["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"], isHidden=False),
            TestCase(input={"n": 1}, expected=["1"], isHidden=True),
        ],
        constraints=[
            "1 ≤ n ≤ 10⁴"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Amazon", "Microsoft", "Bloomberg"],
        similarProblems=["fizz-buzz-multithreaded"],
        order=8,
        points=5
    ),
    
    Exercise(
        id="move-zeroes",
        moduleId="fundamentos-python",
        lessonId="python-listas-tuplas",
        title="Mover Ceros",
        description="""Dado un array de enteros `nums`, mueve todos los `0` al final mientras mantienes el orden relativo de los elementos no-cero.

Debes hacerlo **in-place** sin hacer una copia del array.

**Ejemplo:**
- Input: nums = [0,1,0,3,12]
- Output: [1,3,12,0,0]""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def move_zeroes(nums: list[int]) -> None:
    """
    Mueve todos los ceros al final in-place.
    
    Args:
        nums: Lista de enteros (modificar in-place)
    """
    # Tu código aquí
    pass''',
        solution='''def move_zeroes(nums: list[int]) -> None:
    """
    Two pointers: slow para escribir, fast para leer.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    slow = 0  # Posición para escribir el siguiente no-cero
    
    # Mover todos los no-ceros al frente
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow] = nums[fast]
            slow += 1
    
    # Rellenar el resto con ceros
    while slow < len(nums):
        nums[slow] = 0
        slow += 1''',
        hints=[
            "Usa dos punteros: uno para leer (fast) y otro para escribir (slow)",
            "Copia los no-ceros al frente manteniendo su orden",
            "Rellena el resto con ceros"
        ],
        testCases=[
            TestCase(input={"nums": [0, 1, 0, 3, 12]}, expected=[1, 3, 12, 0, 0], isHidden=False),
            TestCase(input={"nums": [0]}, expected=[0], isHidden=False),
            TestCase(input={"nums": [1, 2, 3]}, expected=[1, 2, 3], isHidden=True),
            TestCase(input={"nums": [0, 0, 1]}, expected=[1, 0, 0], isHidden=True),
        ],
        constraints=[
            "1 ≤ nums.length ≤ 10⁴",
            "-2³¹ ≤ nums[i] ≤ 2³¹ - 1"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Facebook", "Amazon", "Apple"],
        similarProblems=["remove-element"],
        order=9,
        points=10
    ),
    
    Exercise(
        id="sort-array-by-parity",
        moduleId="fundamentos-python",
        lessonId="python-lambdas",
        title="Ordenar Array por Paridad",
        description="""Dado un array de enteros `nums`, mueve todos los números **pares** al inicio del array seguidos por todos los números **impares**.

Retorna **cualquier array** que satisfaga esta condición.

**Ejemplo:**
- Input: nums = [3,1,2,4]
- Output: [2,4,3,1] (también válido: [4,2,1,3], [2,4,1,3], etc.)""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=10,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def sort_array_by_parity(nums: list[int]) -> list[int]:
    """
    Ordena el array con pares al inicio e impares al final.
    
    Args:
        nums: Lista de enteros
        
    Returns:
        Array con pares primero, luego impares
    """
    # Tu código aquí
    pass''',
        solution='''def sort_array_by_parity(nums: list[int]) -> list[int]:
    """
    Solución con sorted y key lambda.
    Complejidad: O(n log n) tiempo, O(n) espacio
    
    Alternativa O(n): two pointers in-place
    """
    # Solución elegante con lambda
    return sorted(nums, key=lambda x: x % 2)
    
    # Alternativa más eficiente in-place:
    # left, right = 0, len(nums) - 1
    # while left < right:
    #     if nums[left] % 2 > nums[right] % 2:
    #         nums[left], nums[right] = nums[right], nums[left]
    #     if nums[left] % 2 == 0:
    #         left += 1
    #     if nums[right] % 2 == 1:
    #         right -= 1
    # return nums''',
        hints=[
            "Puedes usar sorted() con una función key",
            "x % 2 es 0 para pares y 1 para impares",
            "sorted() ordena de menor a mayor, así que 0 (pares) va primero"
        ],
        testCases=[
            TestCase(input={"nums": [3, 1, 2, 4]}, expected=[2, 4, 3, 1], isHidden=False),
            TestCase(input={"nums": [0]}, expected=[0], isHidden=False),
            TestCase(input={"nums": [1, 3, 5]}, expected=[1, 3, 5], isHidden=True),
            TestCase(input={"nums": [2, 4, 6]}, expected=[2, 4, 6], isHidden=True),
        ],
        constraints=[
            "1 ≤ nums.length ≤ 5000",
            "0 ≤ nums[i] ≤ 5000"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Facebook", "Amazon"],
        similarProblems=["sort-colors", "sort-array-by-parity-ii"],
        order=10,
        points=10
    ),
    
    # === MÓDULO: Arrays y Strings ===
    Exercise(
        id="two-sum",
        moduleId="arrays-strings",
        lessonId="two-pointers",
        title="Two Sum",
        description="""Dado un array de enteros `nums` y un entero `target`, retorna los **índices** de los dos números que suman `target`.

Puedes asumir que cada input tiene **exactamente una solución**, y no puedes usar el mismo elemento dos veces.

Puedes retornar la respuesta en cualquier orden.""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Encuentra dos números que sumen target.
    
    Args:
        nums: Lista de enteros
        target: Suma objetivo
        
    Returns:
        Lista con los dos índices
    """
    # Tu código aquí
    pass''',
        solution='''def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Usa un diccionario para buscar el complemento en O(1).
    Complejidad: O(n) tiempo, O(n) espacio
    """
    seen = {}  # valor -> índice
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []  # No debería llegar aquí según el problema''',
        hints=[
            "¿Qué estructura de datos te permite buscar en O(1)?",
            "Para cada número, necesitas encontrar su 'complemento' (target - num)",
            "Usa un diccionario para guardar los números que ya viste con sus índices"
        ],
        testCases=[
            TestCase(input={"nums": [2, 7, 11, 15], "target": 9}, expected=[0, 1], isHidden=False),
            TestCase(input={"nums": [3, 2, 4], "target": 6}, expected=[1, 2], isHidden=False),
            TestCase(input={"nums": [3, 3], "target": 6}, expected=[0, 1], isHidden=False),
            TestCase(input={"nums": [1, 2, 3, 4, 5], "target": 9}, expected=[3, 4], isHidden=True),
            TestCase(input={"nums": [-1, -2, -3, -4, -5], "target": -8}, expected=[2, 4], isHidden=True),
        ],
        constraints=[
            "2 ≤ nums.length ≤ 10⁴",
            "-10⁹ ≤ nums[i] ≤ 10⁹",
            "-10⁹ ≤ target ≤ 10⁹",
            "Solo existe una respuesta válida"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Google", "Amazon", "Facebook", "Microsoft", "Apple"],
        similarProblems=["three-sum", "two-sum-ii", "subarray-sum-equals-k"],
        order=1,
        points=10
    ),
    
    Exercise(
        id="valid-palindrome",
        moduleId="arrays-strings",
        lessonId="two-pointers",
        title="Valid Palindrome",
        description="""Un string es un **palíndromo** si, después de convertir todas las mayúsculas a minúsculas y remover todos los caracteres no alfanuméricos, se lee igual de izquierda a derecha que de derecha a izquierda.

Los caracteres alfanuméricos incluyen letras y números.

Dado un string `s`, retorna `true` si es un palíndromo, o `false` en caso contrario.""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def is_palindrome(s: str) -> bool:
    """
    Verifica si el string es un palíndromo válido.
    
    Args:
        s: String de entrada
        
    Returns:
        True si es palíndromo, False si no
    """
    # Tu código aquí
    pass''',
        solution='''def is_palindrome(s: str) -> bool:
    """
    Usa two pointers para comparar caracteres.
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
    
    return True''',
        hints=[
            "Two pointers: uno al inicio y otro al final",
            "Usa isalnum() para verificar si un caracter es alfanumérico",
            "Usa lower() para comparar sin importar mayúsculas"
        ],
        testCases=[
            TestCase(input={"s": "A man, a plan, a canal: Panama"}, expected=True, isHidden=False),
            TestCase(input={"s": "race a car"}, expected=False, isHidden=False),
            TestCase(input={"s": " "}, expected=True, isHidden=False),
            TestCase(input={"s": "Madam"}, expected=True, isHidden=True),
            TestCase(input={"s": "0P"}, expected=False, isHidden=True),
        ],
        constraints=[
            "1 ≤ s.length ≤ 2 × 10⁵",
            "s consiste solo de caracteres ASCII imprimibles"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Facebook", "Microsoft", "Amazon"],
        similarProblems=["valid-palindrome-ii", "palindrome-linked-list"],
        order=2,
        points=10
    ),
    
    Exercise(
        id="container-with-most-water",
        moduleId="arrays-strings",
        lessonId="two-pointers",
        title="Container With Most Water",
        description="""Se te da un array de enteros `height` de longitud `n`. Hay `n` líneas verticales dibujadas tales que los dos endpoints de la línea `i` están en `(i, 0)` y `(i, height[i])`.

Encuentra dos líneas que junto con el eje X formen un contenedor, tal que el contenedor contenga la mayor cantidad de agua.

Retorna la **máxima cantidad de agua** que un contenedor puede almacenar.

**Nota:** No puedes inclinar el contenedor.""",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedMinutes=25,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def max_area(height: list[int]) -> int:
    """
    Encuentra el contenedor con más agua.
    
    Args:
        height: Lista con las alturas de las líneas
        
    Returns:
        Área máxima de agua
    """
    # Tu código aquí
    pass''',
        solution='''def max_area(height: list[int]) -> int:
    """
    Two pointers: empieza con el contenedor más ancho.
    Mueve el puntero con menor altura (único que puede mejorar).
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
    
    return max_water''',
        hints=[
            "El área se calcula como: min(height[left], height[right]) × (right - left)",
            "Empieza con los punteros en los extremos (máximo ancho)",
            "¿Qué puntero deberías mover para tener chance de encontrar un área mayor?"
        ],
        testCases=[
            TestCase(input={"height": [1, 8, 6, 2, 5, 4, 8, 3, 7]}, expected=49, isHidden=False),
            TestCase(input={"height": [1, 1]}, expected=1, isHidden=False),
            TestCase(input={"height": [4, 3, 2, 1, 4]}, expected=16, isHidden=True),
            TestCase(input={"height": [1, 2, 1]}, expected=2, isHidden=True),
        ],
        constraints=[
            "n == height.length",
            "2 ≤ n ≤ 10⁵",
            "0 ≤ height[i] ≤ 10⁴"
        ],
        patterns=[AlgorithmPattern.TWO_POINTERS],
        companies=["Amazon", "Google", "Facebook", "Bloomberg"],
        similarProblems=["trapping-rain-water"],
        order=3,
        points=20
    ),
    
    Exercise(
        id="maximum-subarray",
        moduleId="arrays-strings",
        lessonId="sliding-window",
        title="Maximum Subarray",
        description="""Dado un array de enteros `nums`, encuentra el subarray contiguo (conteniendo al menos un número) que tenga la **suma más grande** y retorna su suma.

Un **subarray** es una parte contigua del array.""",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedMinutes=20,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def max_subarray(nums: list[int]) -> int:
    """
    Encuentra la suma máxima de un subarray contiguo.
    
    Args:
        nums: Lista de enteros
        
    Returns:
        Suma máxima
    """
    # Tu código aquí
    pass''',
        solution='''def max_subarray(nums: list[int]) -> int:
    """
    Algoritmo de Kadane: mantén el mejor subarray que termina en cada posición.
    Complejidad: O(n) tiempo, O(1) espacio
    """
    max_sum = nums[0]
    current_sum = nums[0]
    
    for i in range(1, len(nums)):
        # ¿Es mejor empezar de nuevo o continuar el subarray?
        current_sum = max(nums[i], current_sum + nums[i])
        max_sum = max(max_sum, current_sum)
    
    return max_sum''',
        hints=[
            "Piensa en cada posición: ¿conviene continuar el subarray anterior o empezar uno nuevo?",
            "Algoritmo de Kadane: current_sum = max(nums[i], current_sum + nums[i])",
            "Si current_sum se vuelve negativo, es mejor empezar de nuevo"
        ],
        testCases=[
            TestCase(input={"nums": [-2, 1, -3, 4, -1, 2, 1, -5, 4]}, expected=6, isHidden=False),
            TestCase(input={"nums": [1]}, expected=1, isHidden=False),
            TestCase(input={"nums": [5, 4, -1, 7, 8]}, expected=23, isHidden=False),
            TestCase(input={"nums": [-1]}, expected=-1, isHidden=True),
            TestCase(input={"nums": [-2, -1]}, expected=-1, isHidden=True),
        ],
        constraints=[
            "1 ≤ nums.length ≤ 10⁵",
            "-10⁴ ≤ nums[i] ≤ 10⁴"
        ],
        patterns=[AlgorithmPattern.DYNAMIC_PROGRAMMING],
        companies=["Amazon", "Microsoft", "LinkedIn", "Apple"],
        similarProblems=["maximum-product-subarray", "degree-of-an-array"],
        order=4,
        points=20
    ),
    
    Exercise(
        id="longest-substring-without-repeating",
        moduleId="arrays-strings",
        lessonId="sliding-window",
        title="Longest Substring Without Repeating Characters",
        description="""Dado un string `s`, encuentra la longitud del **substring más largo** sin caracteres repetidos.""",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedMinutes=25,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def length_of_longest_substring(s: str) -> int:
    """
    Encuentra el substring más largo sin caracteres repetidos.
    
    Args:
        s: String de entrada
        
    Returns:
        Longitud del substring más largo
    """
    # Tu código aquí
    pass''',
        solution='''def length_of_longest_substring(s: str) -> int:
    """
    Sliding window con diccionario para rastrear posiciones.
    Complejidad: O(n) tiempo, O(min(n, m)) espacio
    """
    char_index = {}  # caracter -> último índice visto
    max_length = 0
    left = 0
    
    for right, char in enumerate(s):
        # Si el caracter está en la ventana actual, mover left
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length''',
        hints=[
            "Usa sliding window: expande a la derecha, contrae desde la izquierda cuando hay repetición",
            "Un diccionario puede guardar la última posición de cada caracter",
            "Cuando encuentres un caracter repetido, mueve left justo después de su última aparición"
        ],
        testCases=[
            TestCase(input={"s": "abcabcbb"}, expected=3, isHidden=False),
            TestCase(input={"s": "bbbbb"}, expected=1, isHidden=False),
            TestCase(input={"s": "pwwkew"}, expected=3, isHidden=False),
            TestCase(input={"s": ""}, expected=0, isHidden=True),
            TestCase(input={"s": "dvdf"}, expected=3, isHidden=True),
        ],
        constraints=[
            "0 ≤ s.length ≤ 5 × 10⁴",
            "s consiste de letras, dígitos, símbolos y espacios"
        ],
        patterns=[AlgorithmPattern.SLIDING_WINDOW],
        companies=["Amazon", "Google", "Facebook", "Microsoft", "Bloomberg"],
        similarProblems=["longest-substring-with-at-most-two-distinct", "longest-repeating-character-replacement"],
        order=5,
        points=20
    ),
    
    Exercise(
        id="group-anagrams",
        moduleId="hash-tables",
        lessonId=None,
        title="Group Anagrams",
        description="""Dado un array de strings `strs`, agrupa los **anagramas** juntos. Puedes retornar la respuesta en **cualquier orden**.

Un **anagrama** es una palabra formada al reordenar las letras de otra palabra, usando todas las letras originales exactamente una vez.""",
        difficulty=Difficulty.INTERMEDIATE,
        estimatedMinutes=25,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    Agrupa los anagramas.
    
    Args:
        strs: Lista de strings
        
    Returns:
        Lista de grupos de anagramas
    """
    # Tu código aquí
    pass''',
        solution='''from collections import defaultdict

def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    Usa la palabra ordenada como clave del grupo.
    Complejidad: O(n × k log k) tiempo, O(n × k) espacio
    donde n = cantidad de palabras, k = longitud máxima
    """
    groups = defaultdict(list)
    
    for word in strs:
        # Los anagramas tienen las mismas letras ordenadas
        key = tuple(sorted(word))
        groups[key].append(word)
    
    return list(groups.values())''',
        hints=[
            "Los anagramas comparten algo en común cuando los ordenas...",
            "¿Qué pasa si ordenas las letras de cada palabra?",
            "Usa un diccionario donde la clave sea la palabra ordenada"
        ],
        testCases=[
            TestCase(input={"strs": ["eat", "tea", "tan", "ate", "nat", "bat"]}, expected=[["eat", "tea", "ate"], ["tan", "nat"], ["bat"]], isHidden=False),
            TestCase(input={"strs": [""]}, expected=[[""]], isHidden=False),
            TestCase(input={"strs": ["a"]}, expected=[["a"]], isHidden=False),
            TestCase(input={"strs": ["abc", "cba", "bac", "xyz", "zyx"]}, expected=[["abc", "cba", "bac"], ["xyz", "zyx"]], isHidden=True),
        ],
        constraints=[
            "1 ≤ strs.length ≤ 10⁴",
            "0 ≤ strs[i].length ≤ 100",
            "strs[i] consiste de letras minúsculas"
        ],
        patterns=[AlgorithmPattern.HASH_MAP],
        companies=["Amazon", "Facebook", "Microsoft", "Google"],
        similarProblems=["valid-anagram", "find-all-anagrams-in-a-string"],
        order=6,
        points=20
    ),
    
    Exercise(
        id="valid-parentheses",
        moduleId="stacks-queues",
        lessonId=None,
        title="Valid Parentheses",
        description="""Dado un string `s` que contiene solo los caracteres `'('`, `')'`, `'{'`, `'}'`, `'['` y `']'`, determina si el string de entrada es **válido**.

Un string de entrada es válido si:
1. Los paréntesis abiertos deben cerrarse con el mismo tipo de paréntesis.
2. Los paréntesis abiertos deben cerrarse en el orden correcto.
3. Cada paréntesis de cierre tiene un paréntesis de apertura correspondiente del mismo tipo.""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def is_valid(s: str) -> bool:
    """
    Verifica si los paréntesis están balanceados.
    
    Args:
        s: String con paréntesis
        
    Returns:
        True si es válido, False si no
    """
    # Tu código aquí
    pass''',
        solution='''def is_valid(s: str) -> bool:
    """
    Usa un stack para rastrear paréntesis abiertos.
    Complejidad: O(n) tiempo, O(n) espacio
    """
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in pairs:
            # Es un cierre: debe coincidir con el tope del stack
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:
            # Es una apertura: agregar al stack
            stack.append(char)
    
    # El stack debe estar vacío al final
    return len(stack) == 0''',
        hints=[
            "Un stack es perfecto para este problema - LIFO",
            "Cuando veas un paréntesis de apertura, agrégalo al stack",
            "Cuando veas uno de cierre, verifica que coincida con el tope del stack"
        ],
        testCases=[
            TestCase(input={"s": "()"}, expected=True, isHidden=False),
            TestCase(input={"s": "()[]{}"}, expected=True, isHidden=False),
            TestCase(input={"s": "(]"}, expected=False, isHidden=False),
            TestCase(input={"s": "([)]"}, expected=False, isHidden=True),
            TestCase(input={"s": "{[]}"}, expected=True, isHidden=True),
        ],
        constraints=[
            "1 ≤ s.length ≤ 10⁴",
            "s consiste solo de paréntesis '()[]{}'"
        ],
        patterns=[AlgorithmPattern.STACK],
        companies=["Amazon", "Google", "Facebook", "Microsoft"],
        similarProblems=["generate-parentheses", "longest-valid-parentheses"],
        order=7,
        points=10
    ),
    
    Exercise(
        id="climbing-stairs",
        moduleId="dynamic-programming",
        lessonId=None,
        title="Climbing Stairs",
        description="""Estás subiendo una escalera. Se necesitan `n` pasos para llegar a la cima.

Cada vez puedes subir 1 o 2 escalones. ¿De cuántas formas distintas puedes subir a la cima?""",
        difficulty=Difficulty.BEGINNER,
        estimatedMinutes=15,
        status=ExerciseStatus.NOT_STARTED,
        starterCode='''def climb_stairs(n: int) -> int:
    """
    Cuenta las formas de subir n escalones.
    
    Args:
        n: Número de escalones
        
    Returns:
        Número de formas distintas
    """
    # Tu código aquí
    pass''',
        solution='''def climb_stairs(n: int) -> int:
    """
    Es Fibonacci: formas(n) = formas(n-1) + formas(n-2)
    Complejidad: O(n) tiempo, O(1) espacio
    """
    if n <= 2:
        return n
    
    # Solo necesitamos los últimos 2 valores
    prev2, prev1 = 1, 2
    
    for i in range(3, n + 1):
        current = prev1 + prev2
        prev2 = prev1
        prev1 = current
    
    return prev1''',
        hints=[
            "Para llegar al escalón n, puedes venir del n-1 o del n-2",
            "formas(n) = formas(n-1) + formas(n-2) - ¡Es Fibonacci!",
            "No necesitas guardar todos los valores, solo los últimos 2"
        ],
        testCases=[
            TestCase(input={"n": 2}, expected=2, isHidden=False),
            TestCase(input={"n": 3}, expected=3, isHidden=False),
            TestCase(input={"n": 4}, expected=5, isHidden=True),
            TestCase(input={"n": 5}, expected=8, isHidden=True),
        ],
        constraints=[
            "1 ≤ n ≤ 45"
        ],
        patterns=[AlgorithmPattern.DYNAMIC_PROGRAMMING],
        companies=["Amazon", "Google", "Adobe"],
        similarProblems=["min-cost-climbing-stairs", "fibonacci-number"],
        order=8,
        points=10
    )
]


@router.get("/", response_model=List[Exercise])
async def get_all_exercises():
    """Obtiene todos los ejercicios."""
    return EXERCISES_DATA


@router.get("/{exercise_id}", response_model=Exercise)
async def get_exercise(exercise_id: str):
    """Obtiene un ejercicio específico por su ID."""
    for exercise in EXERCISES_DATA:
        if exercise.id == exercise_id:
            return exercise
    raise HTTPException(status_code=404, detail=f"Ejercicio '{exercise_id}' no encontrado")


@router.get("/module/{module_id}", response_model=List[Exercise])
async def get_exercises_by_module(module_id: str):
    """Obtiene los ejercicios de un módulo específico."""
    exercises = [e for e in EXERCISES_DATA if e.moduleId == module_id]
    return exercises


@router.get("/lesson/{lesson_id}", response_model=List[Exercise])
async def get_exercises_by_lesson(lesson_id: str):
    """Obtiene los ejercicios de una lección específica."""
    exercises = [e for e in EXERCISES_DATA if e.lessonId == lesson_id]
    return exercises


# ============================================
# GENERADORES DE EJERCICIOS ALEATORIOS
# ============================================
import random
from typing import Callable, Dict, Any


def generate_two_sum_data() -> Dict[str, Any]:
    """Genera datos aleatorios para Two Sum."""
    n = random.randint(4, 8)
    nums = [random.randint(-20, 50) for _ in range(n)]
    
    # Asegurar que hay solución única
    i, j = random.sample(range(n), 2)
    target = nums[i] + nums[j]
    
    return {
        "input": {"nums": nums, "target": target},
        "expected": sorted([i, j])
    }


def generate_contains_duplicate_data() -> Dict[str, Any]:
    """Genera datos aleatorios para Contains Duplicate."""
    has_duplicate = random.choice([True, False])
    n = random.randint(4, 10)
    
    if has_duplicate:
        nums = list(range(1, n))
        dup = random.choice(nums)
        nums.append(dup)
        random.shuffle(nums)
    else:
        nums = list(range(1, n + 1))
        random.shuffle(nums)
    
    return {
        "input": {"nums": nums},
        "expected": has_duplicate
    }


def generate_single_number_data() -> Dict[str, Any]:
    """Genera datos para Single Number."""
    n_pairs = random.randint(2, 5)
    pairs = [random.randint(1, 100) for _ in range(n_pairs)]
    single = random.randint(1, 100)
    while single in pairs:
        single = random.randint(1, 100)
    
    nums = pairs + pairs + [single]
    random.shuffle(nums)
    
    return {
        "input": {"nums": nums},
        "expected": single
    }


def generate_valid_anagram_data() -> Dict[str, Any]:
    """Genera datos para Valid Anagram."""
    is_anagram = random.choice([True, False])
    length = random.randint(3, 8)
    
    s = ''.join(random.choices('abcdefghij', k=length))
    
    if is_anagram:
        t = ''.join(random.sample(s, len(s)))
    else:
        t = ''.join(random.choices('abcdefghij', k=length))
        # Asegurar que NO es anagrama
        while sorted(t) == sorted(s):
            t = ''.join(random.choices('abcdefghij', k=length))
    
    return {
        "input": {"s": s, "t": t},
        "expected": is_anagram
    }


def generate_max_subarray_data() -> Dict[str, Any]:
    """Genera datos para Maximum Subarray."""
    n = random.randint(5, 10)
    nums = [random.randint(-10, 20) for _ in range(n)]
    
    # Calcular respuesta con Kadane
    max_sum = current_sum = nums[0]
    for num in nums[1:]:
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return {
        "input": {"nums": nums},
        "expected": max_sum
    }


def generate_find_duplicate_data() -> Dict[str, Any]:
    """Genera datos para Find Duplicate."""
    n = random.randint(4, 8)
    # Array de [1, n] con un duplicado
    nums = list(range(1, n + 1))
    duplicate = random.randint(1, n)
    nums.append(duplicate)
    random.shuffle(nums)
    
    return {
        "input": {"nums": nums},
        "expected": duplicate
    }


def generate_climbing_stairs_data() -> Dict[str, Any]:
    """Genera datos para Climbing Stairs."""
    n = random.randint(2, 15)
    
    # Calcular Fibonacci
    if n == 1:
        expected = 1
    elif n == 2:
        expected = 2
    else:
        a, b = 1, 2
        for _ in range(3, n + 1):
            a, b = b, a + b
        expected = b
    
    return {
        "input": {"n": n},
        "expected": expected
    }


# Mapeo de ejercicios a sus generadores
EXERCISE_GENERATORS: Dict[str, Callable] = {
    "two-sum": generate_two_sum_data,
    "contains-duplicate": generate_contains_duplicate_data,
    "single-number": generate_single_number_data,
    "valid-anagram": generate_valid_anagram_data,
    "max-subarray": generate_max_subarray_data,
    "find-duplicate-number": generate_find_duplicate_data,
    "climbing-stairs": generate_climbing_stairs_data,
}


@router.get("/{exercise_id}/fresh-tests")
async def get_fresh_test_cases(exercise_id: str, count: int = 3):
    """
    Genera test cases frescos y aleatorios para un ejercicio.
    Útil para practicar sin memorizar los mismos casos.
    """
    # Normalizar ID
    normalized_id = exercise_id.lower().replace("_", "-")
    
    # Buscar generador
    generator = None
    for key, gen in EXERCISE_GENERATORS.items():
        if key in normalized_id or normalized_id in key:
            generator = gen
            break
    
    if not generator:
        raise HTTPException(
            status_code=404, 
            detail=f"No hay generador para '{exercise_id}'. Ejercicios disponibles: {list(EXERCISE_GENERATORS.keys())}"
        )
    
    # Generar casos de prueba
    test_cases = []
    for i in range(count):
        data = generator()
        test_cases.append({
            "input": data["input"],
            "expected": data["expected"],
            "isHidden": i >= 2  # Los primeros 2 son visibles
        })
    
    return {
        "exerciseId": exercise_id,
        "testCases": test_cases,
        "message": f"🎲 {count} test cases generados aleatoriamente. ¡Cada vez son diferentes!"
    }


@router.get("/{exercise_id}/practice-mode")
async def get_practice_mode(exercise_id: str, difficulty_boost: int = 0):
    """
    Modo práctica: Devuelve el ejercicio con tests aleatorios.
    difficulty_boost: 0=normal, 1=más casos, 2=casos edge más difíciles
    """
    # Obtener ejercicio base
    base_exercise = None
    for exercise in EXERCISES_DATA:
        if exercise.id == exercise_id:
            base_exercise = exercise
            break
    
    if not base_exercise:
        raise HTTPException(status_code=404, detail=f"Ejercicio '{exercise_id}' no encontrado")
    
    # Generar tests frescos
    normalized_id = exercise_id.lower().replace("_", "-")
    generator = None
    for key, gen in EXERCISE_GENERATORS.items():
        if key in normalized_id or normalized_id in key:
            generator = gen
            break
    
    test_cases = []
    num_tests = 3 + difficulty_boost * 2  # 3, 5, o 7 tests
    
    if generator:
        for i in range(num_tests):
            data = generator()
            test_cases.append(TestCase(
                input=data["input"],
                expected=data["expected"],
                isHidden=i >= 2
            ))
    else:
        # Usar los tests originales si no hay generador
        test_cases = base_exercise.testCases
    
    return {
        "exercise": {
            "id": base_exercise.id,
            "title": base_exercise.title,
            "description": base_exercise.description,
            "difficulty": base_exercise.difficulty,
            "starterCode": base_exercise.starterCode,
            "hints": base_exercise.hints,
            "constraints": base_exercise.constraints,
            "patterns": base_exercise.patterns,
        },
        "testCases": test_cases,
        "practiceMode": True,
        "message": "🎯 Modo práctica: Tests generados aleatoriamente. ¡Demuestra que dominas el concepto!"
    }
