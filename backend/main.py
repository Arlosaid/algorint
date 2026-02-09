"""
Algorint Backend
================
Plataforma educativa GRATUITA para dominar Algoritmos y Estructuras de Datos.
Diseñada con principios pedagógicos (Método Feynman) para maximizar el aprendizaje.

Domina el código, conquista tu futuro - Preparación completa para entrevistas técnicas FAANG.
"""

import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import modules, lessons, exercises, code_execution

# ============================================
# CONFIGURACIÓN DE LA APLICACIÓN
# ============================================

app = FastAPI(
    title="Algorint API",
    description="""
    🎓 **Algorint** - Domina el código, conquista tu futuro
    
    Plataforma educativa **100% GRATUITA** diseñada para prepararte para entrevistas FAANG.
    
    ## 🧠 Metodología Pedagógica - Método Feynman:
    
    > "Si no puedes explicar algo de forma simple, no lo entiendes bien" - Richard Feynman
    
    El **Método Feynman** es nuestra base pedagógica:
    1. **Explicar como a un niño de 5 años**: Cada concepto tiene una analogía del mundo real
    2. **Identificar gaps**: Si no puedes explicarlo simple, necesitas estudiarlo más
    3. **Simplificar y usar analogías**: Comparamos algoritmos con situaciones cotidianas
    4. **Revisar y repetir**: Sistema de repetición espaciada para retención a largo plazo
    
    ## 📚 7 Módulos Esenciales (Regla 80/20):
    
    Nos enfocamos en el 20% de los temas que resuelven el 80% de las entrevistas:
    
    1. **Fundamentos de Python** - Prerequisito para todos los módulos
    2. **Arrays y Strings** - Two Pointers, Sliding Window
    3. **Hash Tables** - Frequency Counting, Caching
    4. **Linked Lists** - Fast/Slow Pointers, In-place Reversal
    5. **Trees y Recursión** - DFS, el "jefe final" de entrevistas
    6. **Graphs** - BFS/DFS aplicado
    7. **Dynamic Programming** - El boss raid final
    
    ## 🎯 10 Patrones que Resuelven el 90% de Entrevistas:
    
    `Two Pointers` | `Sliding Window` | `Fast & Slow Pointers`
    `Hash Map` | `Merge Intervals` | `BFS` | `DFS`
    `Top K Elements (Heap)` | `Backtracking` | `Dynamic Programming`
    
    ## 💡 Lo que nos diferencia de LeetCode:
    
    - **Enseñamos el "por qué"** antes del "cómo"
    - **Pattern Cheat Sheet**: Templates listos para usar
    - **Autoevaluación**: Checklist después de cada ejercicio
    - **Mock Interview**: Pizarra de notas + pseudocódigo
    - **Repetición Espaciada**: Sistema SM-2 para retención
    
    ## 🏢 Empresas Cubiertas:
    Google | Meta | Amazon | Apple | Microsoft | Netflix | Uber | Airbnb
    """,
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CONFIGURACIÓN DE CORS
# ============================================

# CORS: desarrollo + producción (Render, Vercel, etc.)
_cors_origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:3001",
    "https://algorint.vercel.app",  # ← AGREGA ESTA LÍNEA
]
if os.getenv("FRONTEND_URL"):
    _cors_origins.append(os.getenv("FRONTEND_URL").rstrip("/"))

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# ============================================
# REGISTRO DE ROUTERS
# ============================================

# Prefijo /api/v1 para versionado de la API
app.include_router(
    modules.router,
    prefix="/api/v1/modules",
    tags=["Módulos"],
)

app.include_router(
    lessons.router,
    prefix="/api/v1/lessons",
    tags=["Lecciones"],
)

app.include_router(
    exercises.router,
    prefix="/api/v1/exercises",
    tags=["Ejercicios"],
)

app.include_router(
    code_execution.router,
    prefix="/api/v1/code",
    tags=["Ejecución de Código"],
)



# ============================================
# ENDPOINTS RAÍZ
# ============================================

@app.get("/", tags=["Root"])
async def root():
    """
    Endpoint raíz que retorna información básica de la API.
    """
    return {
        "name": "Algorint API",
        "version": "2.0.0",
        "tagline": "Domina el código, conquista tu futuro",
        "description": "Plataforma educativa GRATUITA para dominar Algoritmos - Preparación FAANG",
        "feynman_method": {
            "description": "Si no puedes explicar algo de forma simple, no lo entiendes bien",
            "steps": [
                "Explicar como a un niño de 5 años",
                "Identificar gaps en tu conocimiento",
                "Simplificar usando analogías del mundo real",
                "Revisar y repetir con repetición espaciada"
            ]
        },
        "methodology": [
            "Método Feynman - Explicar como a un niño",
            "Repetición Espaciada (SM-2) - Retención a largo plazo",
            "Pattern Cheat Sheet - Templates de los 10 patrones",
            "Autoevaluación - Checklist post-ejercicio",
        ],
        "patterns": "10 patrones que resuelven el 90% de entrevistas",
        "modules": 7,
        "docs": "/docs",
        "health": "/health",
        "differentiators": [
            "Enseñamos el 'por qué' antes del 'cómo'",
            "No somos otro LeetCode - somos una escuela",
            "Pizarra de notas en Mock Interview",
            "Explicaciones con analogías del mundo real"
        ]
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """
    Verifica el estado de salud de la API.
    Útil para monitoreo y health checks de contenedores.
    """
    return {
        "status": "healthy",
        "service": "algorint-api",
    }


# ============================================
# PUNTO DE ENTRADA PARA DESARROLLO
# ============================================

if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Hot reload en desarrollo
    )
