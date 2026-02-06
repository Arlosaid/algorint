import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Play,
  Lightbulb,
  Eye,
  EyeOff,
  CheckCircle,
  XCircle,
  Clock,
  Zap,
  Code2,
  RotateCcw,
  ChevronRight,
  ClipboardCheck,
  Brain,
  HelpCircle,
  Award,
  FileText,
  BookOpen,
  Target,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Card, Button, DifficultyBadge } from '../components/ui';
import { useProgress } from '../context/ProgressContext';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

/**
 * ExercisePage
 * ============
 * Página de ejercicio individual con:
 * - Descripción del problema
 * - Editor de código
 * - Sistema de ejecución
 * - Pistas progresivas
 * - Solución comentada
 */
const ExercisePage: React.FC = () => {
  const { exerciseId } = useParams();
  const { 
    startExercise, 
    completeExercise,
    updateExercisePartial,
    useHint, 
    recordExerciseAttempt,
    getExerciseStatus,
    progress 
  } = useProgress();

  const [code, setCode] = useState('');
  const [output, setOutput] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [currentHint, setCurrentHint] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedSolution, setSelectedSolution] = useState(0);
  const [testResults, setTestResults] = useState<Array<{passed: boolean; input: string; expected: string; actual: string}>>([]);
  const [showSelfEvaluation, setShowSelfEvaluation] = useState(false);
  const [selfEvaluation, setSelfEvaluation] = useState<Record<string, boolean>>({});
  const [showWhyItWorks, setShowWhyItWorks] = useState(false);
  
  // UI State para tabs y colapso
  const [activeTab, setActiveTab] = useState<'description' | 'hints' | 'solution'>('description');
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(true);
  
  // Ref para auto-scroll a resultados
  const resultsRef = useRef<HTMLDivElement>(null);

  // Checklist de autoevaluación (Método Feynman)
  const selfEvaluationChecklist = [
    { id: 'complexity_time', label: '¿Expliqué la complejidad temporal O(n)?', category: 'complexity' },
    { id: 'complexity_space', label: '¿Expliqué la complejidad espacial?', category: 'complexity' },
    { id: 'edge_cases', label: '¿Consideré casos de borde (lista vacía, un elemento)?', category: 'edge_cases' },
    { id: 'pythonic', label: '¿Mi código es legible y Pythonic?', category: 'code_quality' },
    { id: 'no_solution', label: '¿Lo resolví sin ver la solución?', category: 'understanding' },
  ];

  // Obtener datos del ejercicio
  const exercise = exercisesData[exerciseId || ''];
  const exerciseProgress = progress.exerciseProgress[exerciseId || ''];

  // Inicializar código y marcar como iniciado
  useEffect(() => {
    if (exercise) {
      setCode(exercise.starterCode);
      if (exerciseId && getExerciseStatus(exerciseId) === 'not-started') {
        startExercise(exerciseId);
      }
    }
  }, [exercise, exerciseId]);

  if (!exercise) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="text-center p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Ejercicio no encontrado</h2>
          <Link to="/practice">
            <Button variant="primary">Volver a práctica</Button>
          </Link>
        </Card>
      </div>
    );
  }

  const handleRunCode = async () => {
    setIsRunning(true);
    setOutput(null);
    setTestResults([]);

    try {
      // Preparar test cases para el backend
      const testCasesForBackend = exercise.testCases.map((tc: any) => ({
        input: tc.input,
        expected: tc.expected,
        isHidden: tc.isHidden || false
      }));

      const response = await fetch('http://localhost:8000/api/v1/code/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          functionName: exercise.functionName || extractFunctionName(code),
          testCases: testCasesForBackend,
          timeout: 5
        })
      });

      if (!response.ok) {
        throw new Error('Error de conexión con el servidor');
      }

      const result = await response.json();
      
      // Mapear resultados del backend
      const results = result.testResults.map((tr: any, index: number) => ({
        passed: tr.passed,
        input: JSON.stringify(tr.input),
        expected: tr.expected === "hidden" ? "[Oculto]" : JSON.stringify(tr.expected),
        actual: JSON.stringify(tr.actual),
        error: tr.error
      }));

      setTestResults(results);
      recordExerciseAttempt(exerciseId || '');

      const passedCount = results.filter((r: any) => r.passed).length;
      const totalCount = results.length;
      const score = Math.round((passedCount / totalCount) * 100);

      if (result.success) {
        setOutput(`Todos los tests pasaron (${passedCount}/${totalCount}) - ¡Excelente!`);
        completeExercise(exerciseId || '', result.executionTime || 0);
      } else if (result.error) {
        setOutput(`Error: ${result.error}`);
        // Aún registrar el intento fallido
        updateExercisePartial(exerciseId || '', 0, result.executionTime || 0, (progress.exerciseProgress[exerciseId || '']?.attempts || 0) + 1);
      } else {
        setOutput(`${passedCount}/${totalCount} tests pasaron (${score}%)`);
        updateExercisePartial(exerciseId || '', score, result.executionTime || 0, (progress.exerciseProgress[exerciseId || '']?.attempts || 0) + 1);
      }
    } catch (error) {
      console.error('Error ejecutando código:', error);
      setOutput('Error de conexión. Verifica que el backend esté corriendo');
    }

    setIsRunning(false);
    
    // Auto-scroll a resultados después de ejecutar
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // Extraer nombre de función del código
  const extractFunctionName = (code: string): string => {
    const match = code.match(/def\s+(\w+)\s*\(/);
    return match ? match[1] : 'solution';
  };

  const handleShowHint = () => {
    setShowHints(true);
    useHint(exerciseId || '');
  };

  const handleNextHint = () => {
    if (currentHint < exercise.hints.length - 1) {
      setCurrentHint(currentHint + 1);
      useHint(exerciseId || '');
    }
  };

  const handleReset = () => {
    setCode(exercise.starterCode);
    setOutput(null);
    setTestResults([]);
  };

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="border-b border-dark-700 bg-dark-800/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/practice"
                className="text-dark-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={20} />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{exercise.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <DifficultyBadge difficulty={exercise.difficulty} size="sm" />
                  <span className="text-dark-500 text-sm">{exercise.category}</span>
                  <span className="text-secondary-400 text-sm">{exercise.pattern}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {exerciseProgress?.attempts && (
                <span className="text-dark-500 text-sm">
                  {exerciseProgress.attempts} intentos
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main content - Split view */}
      <div className="flex h-[calc(100vh-120px)]">
        {/* Left panel - Problem description (más compacto) */}
        <div className="w-2/5 border-r border-dark-700 flex flex-col">
          {/* Tabs de navegación */}
          <div className="flex border-b border-dark-700 bg-dark-800 px-2">
            <button
              onClick={() => setActiveTab('description')}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'description' 
                  ? 'text-primary-400 border-primary-400' 
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <FileText size={16} />
              Problema
            </button>
            <button
              onClick={() => { setActiveTab('hints'); handleShowHint(); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'hints' 
                  ? 'text-accent-400 border-accent-400' 
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <Lightbulb size={16} />
              Pistas
              {showHints && (
                <span className="bg-accent-500/30 text-accent-400 px-1.5 py-0.5 rounded text-xs">
                  {currentHint + 1}/{exercise.hints.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('solution'); setShowSolution(true); }}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === 'solution' 
                  ? 'text-secondary-400 border-secondary-400' 
                  : 'text-dark-400 border-transparent hover:text-white'
              }`}
            >
              <BookOpen size={16} />
              Solución
            </button>
          </div>

          {/* Contenido del tab activo */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-4 space-y-4">
              {/* TAB: Descripción */}
              {activeTab === 'description' && (
                <>
                  {/* Descripción colapsable */}
                  <section>
                    <button 
                      onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                      className="flex items-center justify-between w-full text-left"
                    >
                      <h2 className="text-base font-semibold text-white">Descripción</h2>
                      {isDescriptionExpanded ? (
                        <ChevronUp className="text-dark-400" size={18} />
                      ) : (
                        <ChevronDown className="text-dark-400" size={18} />
                      )}
                    </button>
                    {isDescriptionExpanded && (
                      <p className="text-dark-300 text-sm leading-relaxed mt-2 whitespace-pre-line">
                        {exercise.description}
                      </p>
                    )}
                  </section>

                  {/* Ejemplos - siempre visibles pero compactos */}
                  <section>
                    <h2 className="text-base font-semibold text-white mb-2">Ejemplos</h2>
                    <div className="space-y-2">
                      {exercise.examples.slice(0, 2).map((example: any, index: number) => (
                        <Card key={index} className="bg-dark-900 !p-3">
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div>
                              <span className="text-dark-500">Input:</span>
                              <code className="block text-secondary-400 font-mono mt-0.5 truncate">
                                {example.input}
                              </code>
                            </div>
                            <div>
                              <span className="text-dark-500">Output:</span>
                              <code className="block text-primary-400 font-mono mt-0.5">
                                {example.output}
                              </code>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </section>

                  {/* Restricciones compactas */}
                  <section>
                    <h2 className="text-base font-semibold text-white mb-2">Restricciones</h2>
                    <div className="flex flex-wrap gap-2">
                      {exercise.constraints.map((constraint: string, index: number) => (
                        <span 
                          key={index} 
                          className="text-dark-400 text-xs font-mono bg-dark-800 px-2 py-1 rounded"
                        >
                          {constraint}
                        </span>
                      ))}
                    </div>
                  </section>

                  {/* Autoevaluación compacta */}
                  <section className="border-t border-dark-700 pt-4">
                    <button 
                      onClick={() => setShowSelfEvaluation(!showSelfEvaluation)}
                      className="flex items-center gap-2 text-primary-400 hover:text-primary-300 text-sm"
                    >
                      <ClipboardCheck size={16} />
                      {showSelfEvaluation ? 'Ocultar autoevaluación' : 'Autoevaluación'}
                    </button>

                    {showSelfEvaluation && (
                      <Card className="bg-dark-900 border-primary-500/30 mt-3 !p-3">
                        <div className="space-y-2">
                          {selfEvaluationChecklist.map((item) => (
                            <label 
                              key={item.id}
                              className={`
                                flex items-center gap-2 p-2 rounded cursor-pointer text-xs transition-all
                                ${selfEvaluation[item.id] 
                                  ? 'bg-primary-500/20 text-white' 
                                  : 'text-dark-400 hover:bg-dark-700'
                                }
                              `}
                            >
                              <input
                                type="checkbox"
                                checked={selfEvaluation[item.id] || false}
                                onChange={(e) => setSelfEvaluation({
                                  ...selfEvaluation,
                                  [item.id]: e.target.checked
                                })}
                                className="sr-only"
                              />
                              <div className={`
                                w-4 h-4 rounded border flex items-center justify-center flex-shrink-0
                                ${selfEvaluation[item.id] 
                                  ? 'bg-primary-500 border-primary-500' 
                                  : 'border-dark-500'
                                }
                              `}>
                                {selfEvaluation[item.id] && <CheckCircle className="text-white" size={10} />}
                              </div>
                              {item.label}
                            </label>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-dark-500">
                          {Object.values(selfEvaluation).filter(Boolean).length}/{selfEvaluationChecklist.length} completados
                        </div>
                      </Card>
                    )}
                  </section>
                </>
              )}

              {/* TAB: Pistas */}
              {activeTab === 'hints' && (
                <section>
                  {/* Indicador de progreso de pistas */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-dark-500 text-xs">Nivel de ayuda:</span>
                      <div className="flex gap-1">
                        {exercise.hints.map((_: any, i: number) => (
                          <div 
                            key={i}
                            className={`w-6 h-1.5 rounded-full transition-colors ${
                              i <= currentHint 
                                ? i === 0 ? 'bg-green-500' 
                                  : i === 1 ? 'bg-yellow-500'
                                  : i === 2 ? 'bg-orange-500'
                                  : 'bg-red-500'
                                : 'bg-dark-700'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    {exercise.hints.slice(0, currentHint + 1).map((hint: string, index: number) => (
                      <Card 
                        key={index} 
                        className={`!p-3 border transition-all ${
                          index === 0 ? 'bg-green-500/10 border-green-500/30' 
                          : index === 1 ? 'bg-yellow-500/10 border-yellow-500/30'
                          : index === 2 ? 'bg-orange-500/10 border-orange-500/30'
                          : 'bg-red-500/10 border-red-500/30'
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          <div className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-green-500 text-white' 
                            : index === 1 ? 'bg-yellow-500 text-black'
                            : index === 2 ? 'bg-orange-500 text-white'
                            : 'bg-red-500 text-white'
                          }`}>
                            {index + 1}
                          </div>
                          <p className="text-dark-300 text-sm">{hint}</p>
                        </div>
                      </Card>
                    ))}
                    
                    {currentHint < exercise.hints.length - 1 && (
                      <Button variant="ghost" size="sm" onClick={handleNextHint} className="w-full">
                        Siguiente pista ({currentHint + 1}/{exercise.hints.length})
                        <ChevronRight size={16} />
                      </Button>
                    )}
                    
                    {currentHint === exercise.hints.length - 1 && (
                      <p className="text-dark-500 text-sm text-center py-2">
                        Has visto todas las pistas
                      </p>
                    )}
                  </div>
                </section>
              )}

              {/* TAB: Solución */}
              {activeTab === 'solution' && (
                <section>
                  {/* Solution tabs */}
                  <div className="flex gap-2 mb-4">
                    {exercise.solutions.map((sol: any, index: number) => (
                      <button
                        key={index}
                        onClick={() => setSelectedSolution(index)}
                        className={`
                          px-3 py-1.5 rounded-lg text-xs font-medium transition-colors
                          ${selectedSolution === index 
                            ? 'bg-secondary-500/20 text-secondary-400' 
                            : 'text-dark-400 hover:text-white hover:bg-dark-700'
                          }
                        `}
                      >
                        {sol.title}
                      </button>
                    ))}
                  </div>

                  {/* Selected solution */}
                  <Card className="bg-dark-900 !p-3">
                    <p className="text-dark-400 text-xs mb-3">
                      {exercise.solutions[selectedSolution].approach}
                    </p>
                    
                    <div className="rounded-lg overflow-hidden border border-dark-700 mb-3">
                      <SyntaxHighlighter
                        language="python"
                        style={oneDark}
                        customStyle={{
                          margin: 0,
                          padding: '0.75rem',
                          fontSize: '0.75rem',
                          background: '#1e1e1e',
                        }}
                      >
                        {exercise.solutions[selectedSolution].code}
                      </SyntaxHighlighter>
                    </div>

                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <Clock className="text-primary-400" size={12} />
                        <span className="text-primary-400 font-mono">
                          {exercise.solutions[selectedSolution].complexity.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap className="text-secondary-400" size={12} />
                        <span className="text-secondary-400 font-mono">
                          {exercise.solutions[selectedSolution].complexity.space}
                        </span>
                      </div>
                    </div>

                    {/* Botón "¿Por qué funciona?" */}
                    <button 
                      onClick={() => setShowWhyItWorks(!showWhyItWorks)}
                      className="mt-3 text-accent-400 hover:text-accent-300 text-xs flex items-center gap-1"
                    >
                      <HelpCircle size={14} />
                      {showWhyItWorks ? 'Ocultar' : '¿Por qué funciona?'}
                    </button>
                    
                    {showWhyItWorks && (
                      <div className="mt-2 p-3 bg-accent-500/10 border border-accent-500/30 rounded-lg">
                        <p className="text-dark-300 text-xs leading-relaxed">
                          {exercise.whyItWorks || `Imagina que tienes una agenda telefónica 📚. En lugar de buscar página por página (O(n)), guardas el nombre con el número de página donde está. Así cuando buscas a alguien, vas directo a esa página (O(1)).`}
                        </p>
                      </div>
                    )}
                  </Card>
                </section>
              )}
            </div>
          </div>
        </div>

        {/* Right panel - Code editor (más ancho) */}
        <div className="w-3/5 flex flex-col">
          {/* Editor toolbar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700 bg-dark-800">
            <div className="flex items-center gap-2">
              <Code2 className="text-dark-500" size={18} />
              <span className="text-dark-400 text-sm">Python 3</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={handleReset}>
                <RotateCcw size={16} />
                Reset
              </Button>
              <Button 
                variant="primary" 
                size="sm" 
                onClick={handleRunCode}
                loading={isRunning}
              >
                <Play size={16} />
                Ejecutar
              </Button>
            </div>
          </div>

          {/* Monaco Editor */}
          <div className="flex-1">
            <Editor
              height="100%"
              defaultLanguage="python"
              value={code}
              onChange={(value) => setCode(value || '')}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: 'JetBrains Mono, monospace',
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                automaticLayout: true,
              }}
            />
          </div>

          {/* Output panel - con ref para auto-scroll */}
          <div ref={resultsRef} className="border-t border-dark-700 bg-dark-800">
            <div className="px-4 py-2 border-b border-dark-700 flex items-center justify-between">
              <span className="text-dark-400 text-sm font-medium">Resultados</span>
              {output && (
                <span className={`text-xs px-2 py-0.5 rounded ${output.includes('pasaron') ? 'bg-primary-500/20 text-primary-400' : 'bg-red-500/20 text-red-400'}`}>
                  {testResults.filter(r => r.passed).length}/{testResults.length} tests
                </span>
              )}
            </div>
            <div className="p-4 min-h-[200px] max-h-[350px] overflow-y-auto">
              {output ? (
                <div className="space-y-3">
                  <p className={`text-sm font-medium ${output.includes('pasaron') ? 'text-primary-400' : 'text-red-400'}`}>
                    {output}
                  </p>
                  
                  {/* Test results */}
                  {testResults.length > 0 && (
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <div 
                          key={index}
                          className={`
                            flex items-center gap-3 p-2 rounded-lg text-sm
                            ${result.passed 
                              ? 'bg-primary-500/10 border border-primary-500/30' 
                              : 'bg-red-500/10 border border-red-500/30'
                            }
                          `}
                        >
                          {result.passed ? (
                            <CheckCircle className="text-primary-400" size={16} />
                          ) : (
                            <XCircle className="text-red-400" size={16} />
                          )}
                          <span className="text-dark-400">Test {index + 1}:</span>
                          <code className="text-dark-300 font-mono">{result.input}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-dark-500 text-sm">
                  Haz clic en "Ejecutar" para ver los resultados
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DATA
// ============================================

const exercisesData: Record<string, any> = {
  'two-sum': {
    id: 'two-sum',
    title: 'Two Sum',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Hash Map',
    functionName: 'two_sum',
    description: `Dado un array de enteros nums y un entero target, retorna los índices de los dos números que suman target.

Puedes asumir que cada input tiene exactamente una solución, y no puedes usar el mismo elemento dos veces.

Puedes retornar la respuesta en cualquier orden.`,
    examples: [
      {
        input: 'nums = [2, 7, 11, 15], target = 9',
        output: '[0, 1]',
        explanation: 'Porque nums[0] + nums[1] == 9, retornamos [0, 1].',
      },
      {
        input: 'nums = [3, 2, 4], target = 6',
        output: '[1, 2]',
        explanation: 'nums[1] + nums[2] == 6',
      },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Solo existe una respuesta válida.',
    ],
    hints: [
      '💡 Nivel 1: ¿Qué estructura te da búsqueda O(1)?',
      '💡 Nivel 2: Para cada número, ¿qué número necesitas para completar el target?',
      '💡 Nivel 3: Si target=9 y num=2, necesitas 7. ¿Ya viste el 7 antes?',
      '💡 Nivel 4: Guarda cada número con su índice: seen[num] = i',
    ],
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Encuentra dos números que sumen target.
    Retorna sus índices.
    
    Ejemplo:
    >>> two_sum([2, 7, 11, 15], 9)
    [0, 1]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Hash Table (Óptima)',
        approach: 'Usamos un diccionario para buscar complementos en O(1).',
        code: `def two_sum(nums: list[int], target: int) -> list[int]:
    seen = {}  # valor -> índice
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []`,
        complexity: { time: 'O(n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🎯 Imagina que buscas tu media naranja en una fiesta:

En lugar de preguntarle a CADA persona "¿eres mi complemento?" (O(n²)), escribes en una libreta cada persona que conoces.

Cuando conoces a alguien nuevo, miras tu libreta: "¿Ya conocí a alguien que me complemente?"

Si target=9 y conoces a "7", cuando llega "2" miras la libreta: "¿Tengo un 7? ¡Sí!" 🎉

El diccionario ES tu libreta: búsqueda instantánea.`,
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1], isHidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2], isHidden: false },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1], isHidden: false },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4], isHidden: true },
      { input: { nums: [1, 5, 5, 10], target: 10 }, expected: [1, 2], isHidden: true },
    ],
  },
  
  'find-duplicate-number': {
    id: 'find-duplicate-number',
    title: 'Encontrar el Duplicado',
    difficulty: 'medium',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'find_duplicate',
    description: `Dado un array de n+1 enteros donde cada entero está en el rango [1, n], existe exactamente un número duplicado.

Encuentra y retorna el número duplicado.

⚠️ Restricción: Sin modificar el array y usando O(1) espacio extra.`,
    examples: [
      { input: 'nums = [1, 3, 4, 2, 2]', output: '2', explanation: 'El 2 aparece dos veces.' },
      { input: 'nums = [3, 1, 3, 4, 2]', output: '3', explanation: 'El 3 aparece dos veces.' },
    ],
    constraints: [
      '1 ≤ n ≤ 10^5',
      'nums.length == n + 1',
      '1 ≤ nums[i] ≤ n',
    ],
    hints: [
      '💡 Nivel 1: Los valores están en [1,n], así que cada valor puede ser un "índice"',
      '💡 Nivel 2: Si sigues los valores como punteros, el duplicado crea un ciclo',
      '💡 Nivel 3: ¿Conoces el algoritmo de la tortuga y la liebre? 🐢🐇',
      '💡 Nivel 4: Floyd\'s Cycle Detection: slow=nums[slow], fast=nums[nums[fast]]',
    ],
    starterCode: `def find_duplicate(nums: list[int]) -> int:
    """
    Encuentra el único número duplicado.
    Sin modificar el array, O(1) espacio.
    
    Ejemplo:
    >>> find_duplicate([1, 3, 4, 2, 2])
    2
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Floyd\'s Cycle Detection',
        approach: 'Tratamos valores como punteros. El duplicado crea un ciclo.',
        code: `def find_duplicate(nums: list[int]) -> int:
    # Fase 1: Encontrar punto de encuentro
    slow = fast = nums[0]
    while True:
        slow = nums[slow]        # 1 paso
        fast = nums[nums[fast]]  # 2 pasos
        if slow == fast:
            break
    
    # Fase 2: Encontrar entrada del ciclo
    slow = nums[0]
    while slow != fast:
        slow = nums[slow]
        fast = nums[fast]
    
    return slow`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🐢🐇 Imagina una pista de carreras circular:

Si una tortuga y una liebre empiezan juntas, la liebre (que va al doble de velocidad) eventualmente alcanzará a la tortuga POR DETRÁS.

En nuestro array: si un valor se repite, al "seguir los punteros" entraremos en un loop.

El duplicado es donde EMPIEZA el ciclo, no donde se encuentran.

Por eso hay Fase 2: reset una variable al inicio y avanzar ambas a paso 1.`,
    testCases: [
      { input: { nums: [1, 3, 4, 2, 2] }, expected: 2, isHidden: false },
      { input: { nums: [3, 1, 3, 4, 2] }, expected: 3, isHidden: false },
      { input: { nums: [1, 1] }, expected: 1, isHidden: false },
      { input: { nums: [2, 2, 2, 2, 2] }, expected: 2, isHidden: true },
    ],
  },

  'valid-anagram': {
    id: 'valid-anagram',
    title: 'Anagrama Válido',
    difficulty: 'easy',
    category: 'String',
    pattern: 'Hash Map',
    functionName: 'is_anagram',
    description: `Dados dos strings s y t, retorna true si t es un anagrama de s, y false en caso contrario.

Un anagrama es una palabra formada reordenando las letras de otra, usando todas exactamente una vez.`,
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Mismas letras, diferente orden.' },
      { input: 's = "rat", t = "car"', output: 'false', explanation: 'Diferentes letras.' },
    ],
    constraints: [
      '1 <= s.length, t.length <= 5 × 10^4',
      's y t contienen solo letras minúsculas',
    ],
    hints: [
      '💡 Nivel 1: ¿Qué tienen en común los anagramas?',
      '💡 Nivel 2: Mismas letras, mismas cantidades',
      '💡 Nivel 3: Cuenta las letras de cada string',
      '💡 Nivel 4: Counter(s) == Counter(t)',
    ],
    starterCode: `def is_anagram(s: str, t: str) -> bool:
    """
    Verifica si t es anagrama de s.
    
    Ejemplo:
    >>> is_anagram("anagram", "nagaram")
    True
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Counter (Óptima)',
        approach: 'Comparamos frecuencias de caracteres.',
        code: `from collections import Counter

def is_anagram(s: str, t: str) -> bool:
    return Counter(s) == Counter(t)`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔤 Imagina que tienes letras de Scrabble:

"listen" y "silent" usan las MISMAS fichas, solo ordenadas diferente.

Si cuentas las fichas de cada palabra:
- listen: {l:1, i:1, s:1, t:1, e:1, n:1}
- silent: {s:1, i:1, l:1, e:1, n:1, t:1}

¡Son iguales! Eso es un anagrama.

Counter hace exactamente eso: cuenta cada ficha.`,
    testCases: [
      { input: { s: "anagram", t: "nagaram" }, expected: true, isHidden: false },
      { input: { s: "rat", t: "car" }, expected: false, isHidden: false },
      { input: { s: "a", t: "a" }, expected: true, isHidden: false },
      { input: { s: "ab", t: "ba" }, expected: true, isHidden: true },
      { input: { s: "aacc", t: "ccac" }, expected: false, isHidden: true },
    ],
  },

  'single-number': {
    id: 'single-number',
    title: 'Número Único',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Bit Manipulation',
    functionName: 'single_number',
    description: `Dado un array donde cada elemento aparece DOS veces excepto uno que aparece solo UNA vez, encuentra ese elemento único.

⚡ Reto: Hazlo con O(1) espacio extra (sin usar sets ni diccionarios).`,
    examples: [
      { input: 'nums = [2, 2, 1]', output: '1', explanation: 'El 1 no tiene pareja.' },
      { input: 'nums = [4, 1, 2, 1, 2]', output: '4', explanation: '1 y 2 tienen pareja, 4 no.' },
    ],
    constraints: [
      '1 <= nums.length <= 3 × 10^4',
      'Cada elemento aparece dos veces excepto uno',
    ],
    hints: [
      '💡 Nivel 1: XOR tiene propiedades mágicas',
      '💡 Nivel 2: a ^ a = 0 (cualquier número XOR consigo mismo es 0)',
      '💡 Nivel 3: a ^ 0 = a (cualquier número XOR 0 es él mismo)',
      '💡 Nivel 4: XOR de todo el array elimina los pares y deja el único',
    ],
    starterCode: `def single_number(nums: list[int]) -> int:
    """
    Encuentra el número que aparece solo una vez.
    O(1) espacio extra.
    
    Ejemplo:
    >>> single_number([2, 2, 1])
    1
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'XOR (Óptima)',
        approach: 'XOR cancela los números duplicados.',
        code: `def single_number(nums: list[int]) -> int:
    result = 0
    for num in nums:
        result ^= num
    return result`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `⚡ XOR es como un interruptor de luz:

- Prenderlo una vez → encendido
- Prenderlo dos veces → apagado (vuelve al inicio)

Si tienes [2, 2, 1]:
- 0 ^ 2 = 2 (prendemos el "2")
- 2 ^ 2 = 0 (lo apagamos)
- 0 ^ 1 = 1 (prendemos el "1")

¡Solo queda encendido el que no tiene pareja!`,
    testCases: [
      { input: { nums: [2, 2, 1] }, expected: 1, isHidden: false },
      { input: { nums: [4, 1, 2, 1, 2] }, expected: 4, isHidden: false },
      { input: { nums: [1] }, expected: 1, isHidden: false },
      { input: { nums: [1, 0, 1] }, expected: 0, isHidden: true },
    ],
  },

  'reverse-string': {
    id: 'reverse-string',
    title: 'Invertir String',
    difficulty: 'easy',
    category: 'String',
    pattern: 'Two Pointers',
    functionName: 'reverse_string',
    description: `Escribe una función que invierta un string. El input se da como un array de caracteres s.

Debes hacerlo IN-PLACE con O(1) memoria extra.`,
    examples: [
      { input: 's = ["h","e","l","l","o"]', output: '["o","l","l","e","h"]', explanation: '' },
      { input: 's = ["H","a","n","n","a","h"]', output: '["h","a","n","n","a","H"]', explanation: '' },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's[i] es un caracter ASCII imprimible',
    ],
    hints: [
      '💡 Nivel 1: Usa dos punteros',
      '💡 Nivel 2: Uno al inicio, otro al final',
      '💡 Nivel 3: Intercambia y mueve hacia el centro',
    ],
    starterCode: `def reverse_string(s: list[str]) -> None:
    """
    Invierte el array de caracteres in-place.
    No retornes nada, modifica s directamente.
    
    Ejemplo:
    >>> s = ["h","e","l","l","o"]
    >>> reverse_string(s)
    >>> s
    ["o","l","l","e","h"]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Two Pointers',
        approach: 'Intercambiamos desde los extremos hacia el centro.',
        code: `def reverse_string(s: list[str]) -> None:
    left, right = 0, len(s) - 1
    
    while left < right:
        s[left], s[right] = s[right], s[left]
        left += 1
        right -= 1`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔄 Imagina que tienes una fila de personas:

[Ana, Bob, Cat, Dan, Eva]

Para invertir la fila:
1. Ana ↔ Eva → [Eva, Bob, Cat, Dan, Ana]
2. Bob ↔ Dan → [Eva, Dan, Cat, Bob, Ana]
3. Cat está en el medio, no se mueve

¡Listo! Solo intercambiamos desde afuera hacia adentro.`,
    testCases: [
      { input: { s: ["h","e","l","l","o"] }, expected: null, isHidden: false },
      { input: { s: ["H","a","n","n","a","h"] }, expected: null, isHidden: false },
      { input: { s: ["a"] }, expected: null, isHidden: true },
    ],
  },

  'max-subarray': {
    id: 'max-subarray',
    title: 'Subarray Máximo (Kadane)',
    difficulty: 'medium',
    category: 'Array',
    pattern: 'Dynamic Programming',
    functionName: 'max_sub_array',
    description: `Dado un array de enteros nums, encuentra el subarray contiguo con la suma más grande y retorna su suma.

Un subarray es una parte contigua del array.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: '[4,-1,2,1] tiene suma 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'El array entero.' },
      { input: 'nums = [5,4,-1,7,8]', output: '23', explanation: 'El array entero suma 23.' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      '💡 Nivel 1: En cada posición, decide: ¿empiezo de nuevo o continúo?',
      '💡 Nivel 2: Si la suma acumulada es negativa, mejor empezar de cero',
      '💡 Nivel 3: current = max(num, current + num)',
      '💡 Nivel 4: Esto es el Algoritmo de Kadane',
    ],
    starterCode: `def max_sub_array(nums: list[int]) -> int:
    """
    Encuentra la suma máxima de un subarray contiguo.
    
    Ejemplo:
    >>> max_sub_array([-2,1,-3,4,-1,2,1,-5,4])
    6
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Kadane\'s Algorithm',
        approach: 'En cada paso decidimos si continuar el subarray actual o empezar uno nuevo.',
        code: `def max_sub_array(nums: list[int]) -> int:
    max_sum = current_sum = nums[0]
    
    for num in nums[1:]:
        # ¿Es mejor continuar o empezar de nuevo?
        current_sum = max(num, current_sum + num)
        max_sum = max(max_sum, current_sum)
    
    return max_sum`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `💰 Imagina que caminas por una calle recogiendo monedas (+ y -):

En cada paso te preguntas:
- "¿Lo que llevo hasta ahora me AYUDA o me PERJUDICA?"

Si llevas -5 en el bolsillo y encuentras un +3:
- Opción A: -5 + 3 = -2 (mantener el pasado)
- Opción B: 0 + 3 = +3 (tirar todo y empezar fresh)

¡Obviamente +3 es mejor! Eso es Kadane: siempre toma la mejor decisión LOCAL.`,
    testCases: [
      { input: { nums: [-2,1,-3,4,-1,2,1,-5,4] }, expected: 6, isHidden: false },
      { input: { nums: [1] }, expected: 1, isHidden: false },
      { input: { nums: [5,4,-1,7,8] }, expected: 23, isHidden: false },
      { input: { nums: [-1] }, expected: -1, isHidden: true },
      { input: { nums: [-2,-1] }, expected: -1, isHidden: true },
    ],
  },

  'contains-duplicate': {
    id: 'contains-duplicate',
    title: 'Contiene Duplicados',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Hash Map',
    functionName: 'contains_duplicate',
    description: `Dado un array de enteros nums, retorna true si algún valor aparece al menos dos veces, y false si todos los elementos son distintos.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: 'El 1 aparece dos veces.' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'Todos distintos.' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^9 <= nums[i] <= 10^9',
    ],
    hints: [
      '💡 Nivel 1: ¿Qué estructura elimina duplicados automáticamente?',
      '💡 Nivel 2: Un Set solo guarda elementos únicos',
      '💡 Nivel 3: Compara len(nums) con len(set(nums))',
    ],
    starterCode: `def contains_duplicate(nums: list[int]) -> bool:
    """
    Retorna True si hay elementos duplicados.
    
    Ejemplo:
    >>> contains_duplicate([1,2,3,1])
    True
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Set',
        approach: 'Un set elimina duplicados, comparamos longitudes.',
        code: `def contains_duplicate(nums: list[int]) -> bool:
    return len(nums) != len(set(nums))`,
        complexity: { time: 'O(n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🎒 Imagina una mochila mágica que solo guarda objetos ÚNICOS:

Si metes [🍎, 🍌, 🍎, 🍊]:
- La mochila queda: {🍎, 🍌, 🍊} (3 objetos)
- Pero tenías 4 objetos originalmente

3 ≠ 4 → ¡Había duplicados!

Eso es exactamente len(set(nums)) vs len(nums).`,
    testCases: [
      { input: { nums: [1,2,3,1] }, expected: true, isHidden: false },
      { input: { nums: [1,2,3,4] }, expected: false, isHidden: false },
      { input: { nums: [1,1,1,3,3,4,3,2,4,2] }, expected: true, isHidden: false },
      { input: { nums: [1] }, expected: false, isHidden: true },
    ],
  },

  'valid-palindrome': {
    id: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'easy',
    category: 'String',
    pattern: 'Two Pointers',
    functionName: 'is_palindrome',
    description: `Un string es un palíndromo si se lee igual de izquierda a derecha que de derecha a izquierda, considerando solo caracteres alfanuméricos e ignorando mayúsculas.

Dado un string s, retorna true si es un palíndromo válido, false en caso contrario.`,
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" es palíndromo.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" no es palíndromo.' },
    ],
    constraints: [
      '1 <= s.length <= 2 × 10^5',
      's consiste solo de caracteres ASCII imprimibles',
    ],
    hints: [
      '💡 Nivel 1: Primero limpia el string: solo letras/números, todo minúsculas',
      '💡 Nivel 2: Usa dos punteros: uno al inicio, otro al final',
      '💡 Nivel 3: Compara caracteres y mueve los punteros hacia el centro',
    ],
    starterCode: `def is_palindrome(s: str) -> bool:
    """
    Verifica si el string es un palíndromo válido.
    
    Ejemplo:
    >>> is_palindrome("A man, a plan, a canal: Panama")
    True
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Two Pointers',
        approach: 'Limpiamos el string y comparamos desde ambos extremos.',
        code: `def is_palindrome(s: str) -> bool:
    # Limpiar: solo alfanuméricos, minúsculas
    cleaned = ''.join(c.lower() for c in s if c.isalnum())
    
    # Two pointers
    left, right = 0, len(cleaned) - 1
    while left < right:
        if cleaned[left] != cleaned[right]:
            return False
        left += 1
        right -= 1
    
    return True`,
        complexity: { time: 'O(n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🪞 Un palíndromo es como un espejo:

"RADAR" → R-A-D-A-R
          ↑       ↑
        left    right

Comparamos los extremos y vamos hacia el centro:
- R == R ✓ → movemos
- A == A ✓ → movemos  
- D (centro) → ¡terminamos!

Si todos coinciden, es palíndromo.`,
    testCases: [
      { input: { s: "A man, a plan, a canal: Panama" }, expected: true, isHidden: false },
      { input: { s: "race a car" }, expected: false, isHidden: false },
      { input: { s: " " }, expected: true, isHidden: false },
      { input: { s: "aa" }, expected: true, isHidden: true },
    ],
  },

  'best-time-buy-sell': {
    id: 'best-time-buy-sell',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Sliding Window',
    functionName: 'max_profit',
    description: `Se te da un array prices donde prices[i] es el precio de una acción en el día i.

Quieres maximizar tu ganancia eligiendo UN día para comprar y UN día FUTURO diferente para vender.

Retorna la máxima ganancia posible. Si no es posible obtener ganancia, retorna 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Compra día 2 (precio=1), vende día 5 (precio=6). Ganancia = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'Precios solo bajan, no hay ganancia posible.' },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    hints: [
      '💡 Nivel 1: Necesitas comprar ANTES de vender',
      '💡 Nivel 2: Mantén track del precio mínimo visto hasta ahora',
      '💡 Nivel 3: En cada día, calcula: precio_actual - precio_mínimo',
      '💡 Nivel 4: Actualiza la ganancia máxima si encontraste algo mejor',
    ],
    starterCode: `def max_profit(prices: list[int]) -> int:
    """
    Encuentra la máxima ganancia comprando y vendiendo una acción.
    
    Ejemplo:
    >>> max_profit([7,1,5,3,6,4])
    5
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Un solo paso',
        approach: 'Mantenemos el mínimo hasta ahora y calculamos ganancia potencial.',
        code: `def max_profit(prices: list[int]) -> int:
    min_price = float('inf')
    max_profit = 0
    
    for price in prices:
        # ¿Es el nuevo mínimo?
        min_price = min(min_price, price)
        # ¿Ganancia si vendo hoy?
        profit = price - min_price
        # ¿Es la mejor ganancia?
        max_profit = max(max_profit, profit)
    
    return max_profit`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `📈 Imagina que viajas en el tiempo viendo precios de acciones:

Día:    1   2   3   4   5   6
Precio: 7   1   5   3   6   4

En cada día preguntas:
- "¿Cuál fue el precio MÁS BAJO hasta hoy?" (para comprar ahí)
- "Si vendo HOY, ¿cuánto gano?"

El día 5 (precio=6), el mínimo anterior fue 1.
Ganancia = 6 - 1 = 5 ← ¡Máximo!`,
    testCases: [
      { input: { prices: [7,1,5,3,6,4] }, expected: 5, isHidden: false },
      { input: { prices: [7,6,4,3,1] }, expected: 0, isHidden: false },
      { input: { prices: [1,2] }, expected: 1, isHidden: false },
      { input: { prices: [2,1,4] }, expected: 3, isHidden: true },
    ],
  },

  'valid-parentheses': {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy',
    category: 'Stack',
    pattern: 'Stack',
    functionName: 'is_valid',
    description: `Dado un string s que contiene solo los caracteres '(', ')', '{', '}', '[' y ']', determina si el string es válido.

Un string es válido si:
1. Cada paréntesis abierto tiene su correspondiente cierre del mismo tipo.
2. Los paréntesis se cierran en el orden correcto.
3. Cada paréntesis de cierre tiene su correspondiente apertura.`,
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: 'No coinciden los tipos.' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consiste solo de paréntesis: ()[]{}',
    ],
    hints: [
      '💡 Nivel 1: Usa una pila (stack) para este problema',
      '💡 Nivel 2: Cuando veas apertura, ponla en la pila',
      '💡 Nivel 3: Cuando veas cierre, verifica que coincida con el tope de la pila',
      '💡 Nivel 4: Al final, la pila debe estar vacía',
    ],
    starterCode: `def is_valid(s: str) -> bool:
    """
    Verifica si los paréntesis están balanceados.
    
    Ejemplo:
    >>> is_valid("()[]{}")
    True
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Stack',
        approach: 'Usamos una pila para emparejar aperturas con cierres.',
        code: `def is_valid(s: str) -> bool:
    stack = []
    pairs = {')': '(', '}': '{', ']': '['}
    
    for char in s:
        if char in pairs:  # Es cierre
            if not stack or stack[-1] != pairs[char]:
                return False
            stack.pop()
        else:  # Es apertura
            stack.append(char)
    
    return len(stack) == 0`,
        complexity: { time: 'O(n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `📚 Imagina que apilas libros:

"({[]})" 

( → apila [📕]
{ → apila [📕, 📗]
[ → apila [📕, 📗, 📘]
] → ¿el tope es [? Sí, quita [📕, 📗]
} → ¿el tope es {? Sí, quita [📕]
) → ¿el tope es (? Sí, quita []

Pila vacía → ¡Válido! ✅`,
    testCases: [
      { input: { s: "()" }, expected: true, isHidden: false },
      { input: { s: "()[]{}" }, expected: true, isHidden: false },
      { input: { s: "(]" }, expected: false, isHidden: false },
      { input: { s: "([)]" }, expected: false, isHidden: true },
      { input: { s: "{[]}" }, expected: true, isHidden: true },
    ],
  },

  'binary-search': {
    id: 'binary-search',
    title: 'Binary Search',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Binary Search',
    functionName: 'search',
    description: `Dado un array de enteros nums ordenado en orden ascendente, y un entero target, escribe una función que busque target en nums.

Si target existe, retorna su índice. Si no, retorna -1.

Debes escribir un algoritmo con complejidad O(log n).`,
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 existe en nums y su índice es 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 no existe en nums.' },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      'nums está ordenado en orden ascendente',
      'Todos los elementos son únicos',
    ],
    hints: [
      '💡 Nivel 1: El array está ORDENADO, aprovecha eso',
      '💡 Nivel 2: Compara con el elemento del medio',
      '💡 Nivel 3: Si target < medio, busca en la mitad izquierda',
      '💡 Nivel 4: Usa left, right, mid = (left + right) // 2',
    ],
    starterCode: `def search(nums: list[int], target: int) -> int:
    """
    Busca target en nums usando búsqueda binaria.
    
    Ejemplo:
    >>> search([-1,0,3,5,9,12], 9)
    4
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Binary Search Iterativo',
        approach: 'Dividimos el espacio de búsqueda a la mitad en cada paso.',
        code: `def search(nums: list[int], target: int) -> int:
    left, right = 0, len(nums) - 1
    
    while left <= right:
        mid = (left + right) // 2
        
        if nums[mid] == target:
            return mid
        elif nums[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    
    return -1`,
        complexity: { time: 'O(log n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `📖 Imagina buscar una palabra en el diccionario:

¿Buscas "Python"? No vas página por página.
1. Abres en la mitad → "M"
2. P > M → vas a la mitad derecha
3. Abres → "R" 
4. P < R → vas a la mitad izquierda
5. ¡Encontrado!

Cada paso elimina LA MITAD de las opciones.
1000 elementos → 10 pasos máximo (log₂1000 ≈ 10)`,
    testCases: [
      { input: { nums: [-1,0,3,5,9,12], target: 9 }, expected: 4, isHidden: false },
      { input: { nums: [-1,0,3,5,9,12], target: 2 }, expected: -1, isHidden: false },
      { input: { nums: [5], target: 5 }, expected: 0, isHidden: false },
      { input: { nums: [2,5], target: 5 }, expected: 1, isHidden: true },
    ],
  },

  'longest-substring': {
    id: 'longest-substring',
    title: 'Longest Substring Without Repeating',
    difficulty: 'medium',
    category: 'String',
    pattern: 'Sliding Window',
    functionName: 'length_of_longest_substring',
    description: `Dado un string s, encuentra la longitud de la subcadena más larga sin caracteres repetidos.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'La respuesta es "abc", con longitud 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'La respuesta es "b", con longitud 1.' },
      { input: 's = "pwwkew"', output: '3', explanation: 'La respuesta es "wke", con longitud 3.' },
    ],
    constraints: [
      '0 <= s.length <= 5 × 10^4',
      's consiste de letras, dígitos, símbolos y espacios',
    ],
    hints: [
      '💡 Nivel 1: Usa la técnica de Sliding Window',
      '💡 Nivel 2: Mantén un set de caracteres en la ventana actual',
      '💡 Nivel 3: Si encuentras repetido, mueve el inicio de la ventana',
      '💡 Nivel 4: Usa un diccionario para saber la última posición de cada caracter',
    ],
    starterCode: `def length_of_longest_substring(s: str) -> int:
    """
    Encuentra la longitud de la subcadena más larga sin repetidos.
    
    Ejemplo:
    >>> length_of_longest_substring("abcabcbb")
    3
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Sliding Window + HashMap',
        approach: 'Ventana deslizante que se contrae cuando hay repetidos.',
        code: `def length_of_longest_substring(s: str) -> int:
    char_index = {}  # caracter -> última posición
    max_length = 0
    left = 0
    
    for right, char in enumerate(s):
        # Si el caracter está en la ventana actual
        if char in char_index and char_index[char] >= left:
            left = char_index[char] + 1
        
        char_index[char] = right
        max_length = max(max_length, right - left + 1)
    
    return max_length`,
        complexity: { time: 'O(n)', space: 'O(min(n, m))' },
      },
    ],
    whyItWorks: `🪟 Imagina una ventana que se desliza por el texto:

"abcabcbb"
 ^^^      ventana "abc" (longitud 3)
 
Cuando llega la segunda 'a':
  ^^^     ¡'a' repetida! Mueve el inicio
   ^^^    ventana "bca" (longitud 3)

La ventana siempre tiene caracteres ÚNICOS.
Guardamos la longitud máxima que alcanzamos.`,
    testCases: [
      { input: { s: "abcabcbb" }, expected: 3, isHidden: false },
      { input: { s: "bbbbb" }, expected: 1, isHidden: false },
      { input: { s: "pwwkew" }, expected: 3, isHidden: false },
      { input: { s: "" }, expected: 0, isHidden: true },
    ],
  },

  'three-sum': {
    id: 'three-sum',
    title: '3Sum',
    difficulty: 'medium',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'three_sum',
    description: `Dado un array de enteros nums, retorna todos los tripletes [nums[i], nums[j], nums[k]] tales que i ≠ j ≠ k, y nums[i] + nums[j] + nums[k] == 0.

La solución no debe contener tripletes duplicados.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Los únicos tripletes que suman 0.' },
      { input: 'nums = [0,1,1]', output: '[]', explanation: 'No hay tripletes que sumen 0.' },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    hints: [
      '💡 Nivel 1: Ordena el array primero',
      '💡 Nivel 2: Fija un número, luego busca Two Sum en el resto',
      '💡 Nivel 3: Usa two pointers para el Two Sum',
      '💡 Nivel 4: Salta duplicados para evitar tripletes repetidos',
    ],
    starterCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    """
    Encuentra todos los tripletes únicos que suman 0.
    
    Ejemplo:
    >>> three_sum([-1,0,1,2,-1,-4])
    [[-1,-1,2],[-1,0,1]]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Sorting + Two Pointers',
        approach: 'Ordenar y usar two pointers para cada número fijo.',
        code: `def three_sum(nums: list[int]) -> list[list[int]]:
    nums.sort()
    result = []
    
    for i in range(len(nums) - 2):
        # Saltar duplicados
        if i > 0 and nums[i] == nums[i-1]:
            continue
        
        left, right = i + 1, len(nums) - 1
        
        while left < right:
            total = nums[i] + nums[left] + nums[right]
            
            if total < 0:
                left += 1
            elif total > 0:
                right -= 1
            else:
                result.append([nums[i], nums[left], nums[right]])
                # Saltar duplicados
                while left < right and nums[left] == nums[left+1]:
                    left += 1
                while left < right and nums[right] == nums[right-1]:
                    right -= 1
                left += 1
                right -= 1
    
    return result`,
        complexity: { time: 'O(n²)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🎯 3Sum = Fija uno + Two Sum:

Array ordenado: [-4, -1, -1, 0, 1, 2]

Fijamos -1 (primer -1):
Buscamos dos números que sumen +1 (para que total = 0)
  [-1, 0, 1, 2]
   L        R
   
-1 + 2 = 1 ✓ → [-1, -1, 2] encontrado!

Luego movemos L y R buscando más...`,
    testCases: [
      { input: { nums: [-1,0,1,2,-1,-4] }, expected: [[-1,-1,2],[-1,0,1]], isHidden: false },
      { input: { nums: [0,1,1] }, expected: [], isHidden: false },
      { input: { nums: [0,0,0] }, expected: [[0,0,0]], isHidden: false },
    ],
  },

  'merge-intervals': {
    id: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'medium',
    category: 'Array',
    pattern: 'Sorting',
    functionName: 'merge',
    description: `Dado un array de intervalos donde intervals[i] = [starti, endi], combina todos los intervalos que se solapan y retorna un array de intervalos no solapados que cubran todos los intervalos del input.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: '[1,3] y [2,6] se solapan, se combinan en [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: '[1,4] y [4,5] se tocan, se combinan.' },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
    ],
    hints: [
      '💡 Nivel 1: Ordena los intervalos por su inicio',
      '💡 Nivel 2: Recorre los intervalos comparando con el último agregado',
      '💡 Nivel 3: Si se solapan, extiende el final del último',
      '💡 Nivel 4: Si no se solapan, agrega el nuevo intervalo',
    ],
    starterCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    """
    Combina intervalos que se solapan.
    
    Ejemplo:
    >>> merge([[1,3],[2,6],[8,10],[15,18]])
    [[1,6],[8,10],[15,18]]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Sorting + Merge',
        approach: 'Ordenar por inicio y combinar intervalos adyacentes.',
        code: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    intervals.sort(key=lambda x: x[0])
    merged = [intervals[0]]
    
    for current in intervals[1:]:
        last = merged[-1]
        
        if current[0] <= last[1]:  # Se solapan
            last[1] = max(last[1], current[1])
        else:  # No se solapan
            merged.append(current)
    
    return merged`,
        complexity: { time: 'O(n log n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `📅 Imagina horarios de reuniones en una línea de tiempo:

[1,3]  ███
[2,6]    █████
[8,10]        ███

Ordenados por inicio, solo comparamos con el anterior:
- [1,3] empieza
- [2,6] empieza en 2, que está DENTRO de [1,3] → fusionar a [1,6]
- [8,10] empieza en 8, que está FUERA de [1,6] → nuevo intervalo`,
    testCases: [
      { input: { intervals: [[1,3],[2,6],[8,10],[15,18]] }, expected: [[1,6],[8,10],[15,18]], isHidden: false },
      { input: { intervals: [[1,4],[4,5]] }, expected: [[1,5]], isHidden: false },
      { input: { intervals: [[1,4],[0,4]] }, expected: [[0,4]], isHidden: true },
    ],
  },

  'coin-change': {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    functionName: 'coin_change',
    description: `Se te dan monedas de diferentes denominaciones y una cantidad total de dinero amount. Retorna el número MÍNIMO de monedas que necesitas para formar esa cantidad.

Si no es posible formar la cantidad con ninguna combinación, retorna -1.`,
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1 → 3 monedas' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'No se puede formar 3 con monedas de 2.' },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    hints: [
      '💡 Nivel 1: Para cada cantidad, pregunta: ¿cuál es el mínimo de monedas?',
      '💡 Nivel 2: dp[i] = mínimo de monedas para formar cantidad i',
      '💡 Nivel 3: dp[i] = min(dp[i], dp[i - coin] + 1) para cada moneda',
      '💡 Nivel 4: Empieza con dp[0] = 0 (0 monedas para cantidad 0)',
    ],
    starterCode: `def coin_change(coins: list[int], amount: int) -> int:
    """
    Encuentra el mínimo número de monedas para formar amount.
    
    Ejemplo:
    >>> coin_change([1,2,5], 11)
    3
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Dynamic Programming',
        approach: 'Construimos soluciones para cantidades pequeñas hasta amount.',
        code: `def coin_change(coins: list[int], amount: int) -> int:
    dp = [float('inf')] * (amount + 1)
    dp[0] = 0  # 0 monedas para cantidad 0
    
    for i in range(1, amount + 1):
        for coin in coins:
            if coin <= i:
                dp[i] = min(dp[i], dp[i - coin] + 1)
    
    return dp[amount] if dp[amount] != float('inf') else -1`,
        complexity: { time: 'O(amount × coins)', space: 'O(amount)' },
      },
    ],
    whyItWorks: `💰 Construimos la respuesta paso a paso:

Monedas: [1, 2, 5], Amount: 11

dp[0] = 0  (0 monedas para $0)
dp[1] = 1  (1 moneda de $1)
dp[2] = 1  (1 moneda de $2)
dp[5] = 1  (1 moneda de $5)
...
dp[11] = min(dp[10]+1, dp[9]+1, dp[6]+1)
       = min(2+1, 3+1, 2+1) = 3

Cada cantidad depende de cantidades menores.`,
    testCases: [
      { input: { coins: [1,2,5], amount: 11 }, expected: 3, isHidden: false },
      { input: { coins: [2], amount: 3 }, expected: -1, isHidden: false },
      { input: { coins: [1], amount: 0 }, expected: 0, isHidden: false },
      { input: { coins: [1,2,5], amount: 100 }, expected: 20, isHidden: true },
    ],
  },

  'number-islands': {
    id: 'number-islands',
    title: 'Number of Islands',
    difficulty: 'medium',
    category: 'Graph',
    pattern: 'DFS',
    functionName: 'num_islands',
    description: `Dada una matriz 2D grid de '1's (tierra) y '0's (agua), cuenta el número de islas.

Una isla está rodeada por agua y se forma conectando tierras adyacentes horizontalmente o verticalmente. Puedes asumir que los bordes de la matriz están rodeados de agua.`,
    examples: [
      { 
        input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', 
        output: '1', 
        explanation: 'Toda la tierra está conectada.' 
      },
      { 
        input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', 
        output: '3', 
        explanation: 'Hay 3 islas separadas.' 
      },
    ],
    constraints: [
      'm == grid.length',
      'n == grid[i].length',
      '1 <= m, n <= 300',
      'grid[i][j] es "0" o "1"',
    ],
    hints: [
      '💡 Nivel 1: Recorre cada celda de la matriz',
      '💡 Nivel 2: Cuando encuentres un "1", es una nueva isla',
      '💡 Nivel 3: Usa DFS para "hundir" toda la isla (marcar como visitada)',
      '💡 Nivel 4: Cuenta cuántas veces iniciaste un DFS',
    ],
    starterCode: `def num_islands(grid: list[list[str]]) -> int:
    """
    Cuenta el número de islas en la matriz.
    
    Ejemplo:
    >>> num_islands([["1","1","0"],["0","1","0"],["0","0","1"]])
    2
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'DFS',
        approach: 'Para cada "1" encontrado, usamos DFS para marcar toda la isla.',
        code: `def num_islands(grid: list[list[str]]) -> int:
    if not grid:
        return 0
    
    rows, cols = len(grid), len(grid[0])
    count = 0
    
    def dfs(r, c):
        if r < 0 or r >= rows or c < 0 or c >= cols:
            return
        if grid[r][c] != '1':
            return
        
        grid[r][c] = '0'  # Marcar como visitado
        dfs(r+1, c)
        dfs(r-1, c)
        dfs(r, c+1)
        dfs(r, c-1)
    
    for r in range(rows):
        for c in range(cols):
            if grid[r][c] == '1':
                count += 1
                dfs(r, c)
    
    return count`,
        complexity: { time: 'O(m × n)', space: 'O(m × n)' },
      },
    ],
    whyItWorks: `🏝️ Imagina que vuelas sobre un océano con islas:

1 1 0 0 0
1 1 0 0 0
0 0 1 0 0
0 0 0 1 1

Cuando ves tierra (1), aterrizas y caminas por TODA la isla,
pintando cada parte visitada de azul (0).

Cada vez que necesitas aterrizar de nuevo = nueva isla.
¡Contaste 3 aterrizajes = 3 islas!`,
    testCases: [
      { input: { grid: [["1","1","0"],["0","1","0"],["0","0","1"]] }, expected: 2, isHidden: false },
      { input: { grid: [["1","0"],["0","1"]] }, expected: 2, isHidden: false },
      { input: { grid: [["1"]] }, expected: 1, isHidden: true },
    ],
  },

  'merge-sorted-arrays': {
    id: 'merge-sorted-arrays',
    title: 'Merge Two Sorted Arrays',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'merge',
    description: `Se te dan dos arrays ordenados nums1 y nums2. Combínalos en un solo array ordenado.

nums1 tiene espacio suficiente al final para contener los elementos de nums2.`,
    examples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', explanation: '' },
    ],
    constraints: [
      'nums1.length == m + n',
      'nums2.length == n',
    ],
    hints: [
      '💡 Nivel 1: Empieza desde el FINAL de ambos arrays',
      '💡 Nivel 2: Compara los mayores y colócalos al final de nums1',
      '💡 Nivel 3: Esto evita sobrescribir elementos que aún no has procesado',
    ],
    starterCode: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    """
    Combina nums2 en nums1 in-place.
    
    Ejemplo:
    >>> nums1 = [1,2,3,0,0,0]
    >>> merge(nums1, 3, [2,5,6], 3)
    >>> nums1
    [1,2,2,3,5,6]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Two Pointers desde el final',
        approach: 'Llenamos nums1 desde atrás para no sobrescribir.',
        code: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    p1, p2, p = m - 1, n - 1, m + n - 1
    
    while p2 >= 0:
        if p1 >= 0 and nums1[p1] > nums2[p2]:
            nums1[p] = nums1[p1]
            p1 -= 1
        else:
            nums1[p] = nums2[p2]
            p2 -= 1
        p -= 1`,
        complexity: { time: 'O(m + n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔙 ¿Por qué desde el final?

nums1: [1, 2, 3, _, _, _]
nums2: [2, 5, 6]

Si empezamos por el inicio, sobrescribiríamos el 1, 2, 3.
Pero el final está vacío, así que:

Comparamos 3 vs 6 → 6 es mayor → colocar 6 al final
[1, 2, 3, _, _, 6]

¡Nunca perdemos datos!`,
    testCases: [
      { input: { nums1: [1,2,3,0,0,0], m: 3, nums2: [2,5,6], n: 3 }, expected: null, isHidden: false },
      { input: { nums1: [1], m: 1, nums2: [], n: 0 }, expected: null, isHidden: false },
    ],
  },

  'climbing-stairs': {
    id: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'easy',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    functionName: 'climb_stairs',
    description: `Estás subiendo una escalera de n escalones. En cada paso puedes subir 1 o 2 escalones.

¿De cuántas formas distintas puedes llegar a la cima?`,
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 o 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    constraints: [
      '1 <= n <= 45',
    ],
    hints: [
      '💡 Nivel 1: Para llegar al escalón n, puedes venir del n-1 o del n-2',
      '💡 Nivel 2: formas(n) = formas(n-1) + formas(n-2)',
      '💡 Nivel 3: ¡Es la secuencia de Fibonacci!',
    ],
    starterCode: `def climb_stairs(n: int) -> int:
    """
    Cuenta las formas de subir n escalones.
    
    Ejemplo:
    >>> climb_stairs(3)
    3
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Fibonacci',
        approach: 'Cada escalón depende de los dos anteriores.',
        code: `def climb_stairs(n: int) -> int:
    if n <= 2:
        return n
    
    a, b = 1, 2
    for _ in range(3, n + 1):
        a, b = b, a + b
    
    return b`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🪜 ¿Cómo llegas al escalón 5?

- Desde el 4 (un paso de 1) → todas las formas de llegar al 4
- Desde el 3 (un paso de 2) → todas las formas de llegar al 3

Así que: formas(5) = formas(4) + formas(3)

¡Es Fibonacci!
1, 2, 3, 5, 8, 13, 21...`,
    testCases: [
      { input: { n: 2 }, expected: 2, isHidden: false },
      { input: { n: 3 }, expected: 3, isHidden: false },
      { input: { n: 5 }, expected: 8, isHidden: false },
      { input: { n: 10 }, expected: 89, isHidden: true },
    ],
  },
};

export default ExercisePage;
