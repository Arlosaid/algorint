"""
Code Execution Router
=====================
Endpoints para ejecución segura de código Python.
"""

from fastapi import APIRouter, HTTPException
from ..models import CodeExecutionRequest, CodeExecutionResult, TestResult
import sys
import io
import traceback
from typing import Any
import ast
import time

router = APIRouter()


def is_code_safe(code: str) -> tuple[bool, str]:
    """
    Verifica que el código no contenga operaciones peligrosas.
    """
    dangerous_patterns = [
        'import os',
        'import sys',
        'import subprocess',
        'import shutil',
        '__import__',
        'eval(',
        'exec(',
        'open(',
        'file(',
        'input(',
        'compile(',
        'globals(',
        'locals(',
        'vars(',
        'dir(',
        'getattr(',
        'setattr(',
        'delattr(',
        '__builtins__',
        '__class__',
        '__bases__',
        '__subclasses__',
        '__code__',
        '__globals__',
    ]
    
    code_lower = code.lower()
    for pattern in dangerous_patterns:
        if pattern.lower() in code_lower:
            return False, f"Código no permitido: uso de '{pattern}'"
    
    return True, ""


def run_code_safely(code: str, test_input: dict, function_name: str, timeout: float = 5.0) -> dict:
    """
    Ejecuta código de forma segura en un contexto aislado.
    """
    # Capturar stdout
    old_stdout = sys.stdout
    old_stderr = sys.stderr
    sys.stdout = io.StringIO()
    sys.stderr = io.StringIO()
    
    result = {
        "success": False,
        "output": None,
        "stdout": "",
        "stderr": "",
        "error": None,
        "execution_time": 0
    }
    
    try:
        # Contexto de ejecución limitado
        exec_globals = {
            "__builtins__": {
                "len": len,
                "range": range,
                "enumerate": enumerate,
                "zip": zip,
                "map": map,
                "filter": filter,
                "sorted": sorted,
                "reversed": reversed,
                "list": list,
                "dict": dict,
                "set": set,
                "tuple": tuple,
                "str": str,
                "int": int,
                "float": float,
                "bool": bool,
                "sum": sum,
                "min": min,
                "max": max,
                "abs": abs,
                "all": all,
                "any": any,
                "print": print,
                "isinstance": isinstance,
                "type": type,
                "hasattr": hasattr,
                "ValueError": ValueError,
                "TypeError": TypeError,
                "IndexError": IndexError,
                "KeyError": KeyError,
                "True": True,
                "False": False,
                "None": None,
            }
        }
        
        # Agregar imports seguros
        from collections import defaultdict, Counter, deque
        from heapq import heappush, heappop, heapify
        from itertools import permutations, combinations
        from functools import lru_cache
        
        exec_globals["defaultdict"] = defaultdict
        exec_globals["Counter"] = Counter
        exec_globals["deque"] = deque
        exec_globals["heappush"] = heappush
        exec_globals["heappop"] = heappop
        exec_globals["heapify"] = heapify
        exec_globals["permutations"] = permutations
        exec_globals["combinations"] = combinations
        exec_globals["lru_cache"] = lru_cache
        
        # Definir ListNode para problemas de linked lists
        class ListNode:
            def __init__(self, val=0, next=None):
                self.val = val
                self.next = next
        
        exec_globals["ListNode"] = ListNode
        
        start_time = time.time()
        
        # Ejecutar el código para definir la función
        exec(code, exec_globals)
        
        # Verificar que la función/clase existe
        if function_name not in exec_globals:
            result["error"] = f"Función/Clase '{function_name}' no encontrada"
            return result
        
        func_or_class = exec_globals[function_name]
        processed_input = preprocess_test_input(test_input)
        
        # Verificar si es un test de clase (tiene operations)
        if 'operations' in test_input and 'params' in test_input:
            # Test de clase: instanciar y ejecutar operaciones
            try:
                # El primer parámetro es para la instanciación
                instance_params = test_input['params'][0] if test_input['params'] else []
                instance = func_or_class(*instance_params)
                
                results = []
                operations = test_input['operations'][1:]  # Saltar la instanciación
                params = test_input['params'][1:]
                
                for op, param in zip(operations, params):
                    method = getattr(instance, op)
                    if isinstance(param, list) and len(param) == 1 and isinstance(param[0], list):
                        # Parámetro es un árbol representado como array
                        tree = array_to_treenode(param[0])
                        result_val = method(tree)
                    else:
                        result_val = method(*param) if param else method()
                    results.append(result_val)
                
                output = results
            except Exception as e:
                result["error"] = f"Error ejecutando operaciones de clase: {str(e)}"
                return result
        else:
            # Test de función normal
            output = func_or_class(**processed_input)
        
        # Postprocesar el output para comparación
        output = postprocess_output(output)
        
        result["execution_time"] = time.time() - start_time
        result["output"] = output
        result["success"] = True
        
    except Exception as e:
        result["error"] = f"{type(e).__name__}: {str(e)}"
        result["stderr"] = traceback.format_exc()
        
    finally:
        result["stdout"] = sys.stdout.getvalue()
        sys.stdout = old_stdout
        sys.stderr = old_stderr
    
    return result


def array_to_treenode(arr: list) -> Any:
    """Convierte un array a TreeNode para tests."""
    if not arr or arr[0] is None:
        return None
    
    # Crear la clase TreeNode si no existe
    class TreeNode:
        def __init__(self, val=0, left=None, right=None):
            self.val = val
            self.left = left
            self.right = right
    
    if not arr:
        return None
    
    root = TreeNode(arr[0])
    queue = [root]
    i = 1
    while queue and i < len(arr):
        node = queue.pop(0)
        if i < len(arr) and arr[i] is not None:
            node.left = TreeNode(arr[i])
            queue.append(node.left)
        i += 1
        if i < len(arr) and arr[i] is not None:
            node.right = TreeNode(arr[i])
            queue.append(node.right)
        i += 1
    return root


def treenode_to_array(node: Any) -> list:
    """Convierte TreeNode a array para comparación."""
    if node is None:
        return []
    
    result = []
    queue = [node]
    while queue:
        current = queue.pop(0)
        if current:
            result.append(current.val)
            queue.append(current.left)
            queue.append(current.right)
        else:
            result.append(None)
    
    # Remover None al final
    while result and result[-1] is None:
        result.pop()
    
    return result


def preprocess_test_input(test_input: dict) -> dict:
    """Preprocesa inputs para convertir arrays a estructuras apropiadas."""
    processed = {}
    for key, value in test_input.items():
        if key == 'head' and isinstance(value, list):
            # Convertir array a ListNode
            processed[key] = array_to_listnode(value)
        elif key == 'root' and isinstance(value, list):
            # Convertir array a TreeNode
            processed[key] = array_to_treenode(value)
        else:
            processed[key] = value
    return processed


def postprocess_output(output: Any) -> Any:
    """Postprocesa outputs para convertir estructuras a formas comparables."""
    if output is None:
        return []
    if hasattr(output, 'val') and hasattr(output, 'next'):
        # Es un ListNode, convertir a array
        return listnode_to_array(output)
    if hasattr(output, 'val') and hasattr(output, 'left'):
        # Es un TreeNode, convertir a array
        return treenode_to_array(output)
    return output


def compare_outputs(actual: Any, expected: Any) -> bool:
    """
    Compara dos outputs manejando casos especiales.
    """
    # Manejar listas que pueden estar en diferente orden
    if isinstance(expected, list) and isinstance(actual, list):
        # Para algunos problemas el orden no importa
        if len(expected) > 0 and isinstance(expected[0], list):
            # Lista de listas - comparar como conjuntos de tuplas
            try:
                expected_set = set(tuple(sorted(x)) if isinstance(x, list) else x for x in expected)
                actual_set = set(tuple(sorted(x)) if isinstance(x, list) else x for x in actual)
                return expected_set == actual_set
            except:
                pass
        
        # Verificar si son iguales ordenados
        try:
            if sorted(expected) == sorted(actual):
                return True
        except:
            pass
    
    return actual == expected


@router.get("/health")
async def health_check():
    """Endpoint simple para verificar que el backend funciona."""
    return {"status": "ok", "message": "Backend is running"}

@router.post("/run", response_model=CodeExecutionResult)
async def run_code(request: CodeExecutionRequest):
    """
    Ejecuta código y lo prueba contra los test cases.
    """
    print(f"🔍 Ejecutando código para función: {request.functionName}")
    print(f"📝 Código: {request.code[:200]}...")
    print(f"🧪 Test cases: {len(request.testCases)}")
    
    # Verificar seguridad básica del código
    is_safe, error_msg = is_code_safe(request.code)
    if not is_safe:
        print(f"❌ Código no seguro: {error_msg}")
        return CodeExecutionResult(
            success=False,
            output=None,
            stdout="",
            executionTime=0,
            error=error_msg,
            testResults=[]
        )
    
    # Ejecutar contra cada test case
    test_results = []
    all_passed = True
    total_time = 0
    first_error = None
    
    for i, test_case in enumerate(request.testCases):
        print(f"🧪 Ejecutando test case {i+1}: {test_case.input}")
        result = run_code_safely(
            request.code, 
            test_case.input, 
            request.functionName
        )
        
        total_time += result["execution_time"]
        print(f"⏱️ Tiempo: {result['execution_time']:.3f}s, Éxito: {result['success']}")
        
        passed = False
        if result["success"]:
            passed = compare_outputs(result["output"], test_case.expected)
            print(f"✅ Test {'PASÓ' if passed else 'FALLÓ'}: esperado={test_case.expected}, obtenido={result['output']}")
        else:
            print(f"❌ Error ejecutando: {result['error']}")
            if first_error is None:
                first_error = result["error"]
        
        if not passed:
            all_passed = False
        
        test_results.append(TestResult(
            testCaseIndex=i,
            passed=passed,
            input=test_case.input if not test_case.isHidden else {"hidden": True},
            expected=test_case.expected if not test_case.isHidden else "hidden",
            actual=result["output"],
            executionTime=result["execution_time"],
            error=result["error"]
        ))
    
    print(f"📊 Resultado final: {sum(1 for tr in test_results if tr.passed)}/{len(test_results)} tests pasaron")
    
    return CodeExecutionResult(
        success=all_passed,
        output=test_results[0].actual if test_results else None,
        stdout="",
        executionTime=total_time,
        error=first_error,
        testResults=test_results
    )


@router.post("/validate")
async def validate_code(code: str):
    """
    Valida la sintaxis del código sin ejecutarlo.
    """
    try:
        ast.parse(code)
        return {"valid": True, "error": None}
    except SyntaxError as e:
        return {
            "valid": False, 
            "error": f"Error de sintaxis en línea {e.lineno}: {e.msg}"
        }
