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
  ChevronUp,
  Keyboard
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Card, Button, DifficultyBadge } from '../components/ui';
import { useProgress } from '../context/ProgressContext';
import { API_BASE_URL } from '../config';
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

  // Atajo de teclado: Ctrl+Enter para ejecutar
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isRunning) {
          handleRunCode();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [code, isRunning]);

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

      const response = await fetch(`${API_BASE_URL}/api/v1/code/run`, {
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
    
    // Auto-scroll para que el usuario vea los resultados
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
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
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* Header */}
      <div className="border-b border-dark-700 bg-dark-800/50 flex-shrink-0">
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
      <div className="flex flex-1 min-h-0">
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
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Code2 className="text-dark-500" size={18} />
                <span className="text-dark-400 text-sm">Python 3</span>
              </div>
              <span className="text-dark-600 text-xs hidden md:inline-flex items-center gap-1">
                <Keyboard size={12} />
                Ctrl+Enter para ejecutar
              </span>
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
          <div className="flex-1 min-h-[200px] max-h-[700px]">
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
              {output && testResults.length > 0 && (
                <div className="flex items-center gap-3">
                  {/* Mini progress bar de tests */}
                  <div className="flex gap-1">
                    {testResults.map((r, i) => (
                      <div 
                        key={i} 
                        className={`w-3 h-3 rounded-sm transition-all duration-300 ${
                          r.passed 
                            ? 'bg-green-500 shadow-sm shadow-green-500/30' 
                            : 'bg-red-500 shadow-sm shadow-red-500/30'
                        }`} 
                        title={`Test ${i+1}: ${r.passed ? 'Pasó' : 'Falló'}`}
                      />
                    ))}
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    testResults.every(r => r.passed) 
                      ? 'bg-green-500/20 text-green-400' 
                      : testResults.some(r => r.passed)
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                  }`}>
                    {testResults.filter(r => r.passed).length}/{testResults.length} tests
                  </span>
                </div>
              )}
            </div>
            <div className="p-4 min-h-[200px]">
              {output ? (
                <div className="space-y-3">
                  {/* Resumen visual grande */}
                  {testResults.length > 0 && (
                    <div className={`flex items-center gap-4 p-3 rounded-xl border ${
                      testResults.every(r => r.passed)
                        ? 'bg-gradient-to-r from-green-500/10 to-emerald-500/5 border-green-500/30'
                        : testResults.some(r => r.passed)
                          ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/5 border-yellow-500/30'
                          : 'bg-gradient-to-r from-red-500/10 to-rose-500/5 border-red-500/30'
                    }`}>
                      {/* Círculo de progreso */}
                      <div className="relative w-14 h-14 flex-shrink-0">
                        <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                          <circle cx="28" cy="28" r="24" fill="none" stroke="currentColor" strokeWidth="4" className="text-dark-700" />
                          <circle 
                            cx="28" cy="28" r="24" fill="none" 
                            strokeWidth="4" 
                            strokeLinecap="round"
                            className={testResults.every(r => r.passed) ? 'text-green-500' : testResults.some(r => r.passed) ? 'text-yellow-500' : 'text-red-500'}
                            strokeDasharray={`${(testResults.filter(r => r.passed).length / testResults.length) * 150.8} 150.8`}
                            style={{ transition: 'stroke-dasharray 0.5s ease-out' }}
                          />
                        </svg>
                        <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${
                          testResults.every(r => r.passed) ? 'text-green-400' : testResults.some(r => r.passed) ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {Math.round((testResults.filter(r => r.passed).length / testResults.length) * 100)}%
                        </span>
                      </div>
                      <div>
                        <h4 className={`font-bold text-sm ${
                          testResults.every(r => r.passed) ? 'text-green-400' : testResults.some(r => r.passed) ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {testResults.every(r => r.passed) 
                            ? 'Todos los tests pasaron!' 
                            : testResults.some(r => r.passed)
                              ? `${testResults.filter(r => r.passed).length} de ${testResults.length} tests pasaron`
                              : 'Ningun test paso'}
                        </h4>
                        <p className="text-dark-400 text-xs mt-0.5">
                          {testResults.every(r => r.passed)
                            ? 'Excelente trabajo! Tu solucion es correcta.'
                            : testResults.some(r => r.passed)
                              ? 'Vas por buen camino. Revisa los tests fallidos abajo.'
                              : 'Revisa tu logica y los casos de prueba.'}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Error general */}
                  {output.startsWith('Error') && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                      <div className="flex items-start gap-2">
                        <XCircle className="text-red-400 flex-shrink-0 mt-0.5" size={16} />
                        <div>
                          <p className="text-red-400 text-sm font-medium">Error de ejecucion</p>
                          <pre className="text-red-300/80 text-xs mt-1 font-mono whitespace-pre-wrap">{output.replace('Error: ', '')}</pre>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Test results detallados */}
                  {testResults.length > 0 && (
                    <div className="space-y-2">
                      {testResults.map((result, index) => (
                        <div 
                          key={index}
                          className={`test-result-item rounded-lg border overflow-hidden transition-all duration-200 ${
                            result.passed 
                              ? 'border-green-500/20 bg-green-500/5' 
                              : 'border-red-500/20 bg-red-500/5'
                          }`}
                        >
                          {/* Header del test */}
                          <div className={`flex items-center gap-2 px-3 py-2 ${
                            result.passed ? 'bg-green-500/10' : 'bg-red-500/10'
                          }`}>
                            {result.passed ? (
                              <CheckCircle className="text-green-400" size={14} />
                            ) : (
                              <XCircle className="text-red-400" size={14} />
                            )}
                            <span className={`text-xs font-semibold ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                              Test {index + 1} — {result.passed ? 'Correcto' : 'Incorrecto'}
                            </span>
                          </div>
                          
                          {/* Detalles del test */}
                          <div className="px-3 py-2 space-y-1.5">
                            {/* Input */}
                            <div className="flex items-start gap-2">
                              <span className="text-dark-500 text-xs w-16 flex-shrink-0 pt-0.5">Input:</span>
                              <code className="text-dark-300 text-xs font-mono bg-dark-800/50 px-1.5 py-0.5 rounded break-all">
                                {result.input}
                              </code>
                            </div>
                            
                            {/* Expected - siempre mostrar si no es oculto */}
                            {result.expected !== '[Oculto]' && (
                              <div className="flex items-start gap-2">
                                <span className="text-dark-500 text-xs w-16 flex-shrink-0 pt-0.5">Esperado:</span>
                                <code className="text-green-400 text-xs font-mono bg-green-500/5 px-1.5 py-0.5 rounded break-all">
                                  {result.expected}
                                </code>
                              </div>
                            )}
                            
                            {/* Actual - mostrar si no pasó */}
                            {!result.passed && result.actual && (
                              <div className="flex items-start gap-2">
                                <span className="text-dark-500 text-xs w-16 flex-shrink-0 pt-0.5">Obtenido:</span>
                                <code className="text-red-400 text-xs font-mono bg-red-500/5 px-1.5 py-0.5 rounded break-all">
                                  {result.actual}
                                </code>
                              </div>
                            )}

                            {/* Error del test si lo hay */}
                            {(result as any).error && (
                              <div className="flex items-start gap-2 mt-1">
                                <span className="text-dark-500 text-xs w-16 flex-shrink-0 pt-0.5">Error:</span>
                                <pre className="text-red-300/80 text-xs font-mono break-all whitespace-pre-wrap">
                                  {(result as any).error}
                                </pre>
                              </div>
                            )}

                            {/* Hidden test indicator */}
                            {result.expected === '[Oculto]' && (
                              <div className="flex items-center gap-2">
                                <span className="text-dark-500 text-xs italic flex items-center gap-1">
                                  <EyeOff size={12} />
                                  Test oculto — {result.passed ? 'tu solucion paso correctamente' : 'tu solucion no paso este caso'}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tip contextual si hay fallos */}
                  {testResults.length > 0 && !testResults.every(r => r.passed) && !output.startsWith('Error') && (
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/5 border border-blue-500/20">
                      <Lightbulb className="text-blue-400 flex-shrink-0 mt-0.5" size={14} />
                      <p className="text-blue-300/80 text-xs leading-relaxed">
                        {testResults.filter(r => r.passed).length === 0 
                          ? 'Tu funcion retorna un resultado diferente al esperado. Verifica tu logica paso a paso con el primer ejemplo.'
                          : testResults.filter(r => r.passed).length >= testResults.length / 2
                            ? 'Casi lo tienes! Revisa los casos edge (listas vacias, un solo elemento, valores negativos).'
                            : 'Algunos tests pasan. Compara tu resultado con el esperado para encontrar el patron del error.'}
                      </p>
                    </div>
                  )}
                </div>
              ) : isRunning ? (
                <div className="flex items-center justify-center py-8 gap-3">
                  <div className="w-5 h-5 border-2 border-primary-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-dark-400 text-sm">Ejecutando tests...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Play className="text-dark-600 mb-2" size={24} />
                  <p className="text-dark-500 text-sm">
                    Presiona <kbd className="px-1.5 py-0.5 bg-dark-700 rounded text-xs text-dark-300 font-mono">Ejecutar</kbd> para ver los resultados
                  </p>
                </div>
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
      { input: { s: ["h","e","l","l","o"] }, expected: ["o","l","l","e","h"], isHidden: false },
      { input: { s: ["H","a","n","n","a","h"] }, expected: ["h","a","n","n","a","H"], isHidden: false },
      { input: { s: ["a"] }, expected: ["a"], isHidden: true },
      { input: { s: ["a","b"] }, expected: ["b","a"], isHidden: true },
    ],
    isInPlace: true,
    inPlaceParam: 's',
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
      { input: { nums1: [1,2,3,0,0,0], m: 3, nums2: [2,5,6], n: 3 }, expected: [1,2,2,3,5,6], isHidden: false },
      { input: { nums1: [1], m: 1, nums2: [], n: 0 }, expected: [1], isHidden: false },
      { input: { nums1: [0], m: 0, nums2: [1], n: 1 }, expected: [1], isHidden: true },
    ],
    isInPlace: true,
    inPlaceParam: 'nums1',
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

  'container-water': {
    id: 'container-water',
    title: 'Container With Most Water',
    difficulty: 'medium',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'max_area',
    description: `Se te da un array de enteros height de longitud n. Hay n líneas verticales dibujadas tales que los dos endpoints de la línea i están en (i, 0) y (i, height[i]).

Encuentra dos líneas que junto con el eje X formen un contenedor que contenga la mayor cantidad de agua.

Retorna la máxima cantidad de agua que un contenedor puede almacenar.

Nota: No puedes inclinar el contenedor.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Las líneas en índice 1 (h=8) y 8 (h=7) forman el contenedor más grande: min(8,7) × 7 = 49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'min(1,1) × 1 = 1.' },
    ],
    constraints: [
      '2 <= height.length <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    hints: [
      '💡 Nivel 1: El área se calcula como min(height[left], height[right]) × (right - left)',
      '💡 Nivel 2: Empieza con los punteros en los extremos (máximo ancho)',
      '💡 Nivel 3: ¿Qué puntero deberías mover? El que tiene MENOR altura',
      '💡 Nivel 4: Mover el menor es la única forma de potencialmente mejorar',
    ],
    starterCode: `def max_area(height: list[int]) -> int:
    """
    Encuentra el contenedor con más agua.
    
    Ejemplo:
    >>> max_area([1,8,6,2,5,4,8,3,7])
    49
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Two Pointers',
        approach: 'Empezamos con el ancho máximo y movemos el puntero más corto.',
        code: `def max_area(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_water = 0
    
    while left < right:
        width = right - left
        h = min(height[left], height[right])
        max_water = max(max_water, width * h)
        
        if height[left] < height[right]:
            left += 1
        else:
            right -= 1
    
    return max_water`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🏊 Imagina dos paredes en una piscina:

El agua solo llega hasta la pared MÁS BAJA.
El ancho es la distancia entre paredes.

Empezamos con las paredes más lejanas (máximo ancho):
[1, 8, 6, 2, 5, 4, 8, 3, 7]
 L                       R

¿Cuál movemos? La más baja (L=1), porque mover la alta no puede mejorar nada (el agua está limitada por la baja).`,
    testCases: [
      { input: { height: [1,8,6,2,5,4,8,3,7] }, expected: 49, isHidden: false },
      { input: { height: [1,1] }, expected: 1, isHidden: false },
      { input: { height: [4,3,2,1,4] }, expected: 16, isHidden: true },
      { input: { height: [1,2,1] }, expected: 2, isHidden: true },
    ],
  },

  'word-break': {
    id: 'word-break',
    title: 'Word Break',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    functionName: 'word_break',
    description: `Dado un string s y un diccionario de palabras wordDict, retorna true si s puede ser segmentado en una secuencia separada por espacios de una o más palabras del diccionario.

La misma palabra puede usarse múltiples veces en la segmentación.`,
    examples: [
      { input: 's = "leetcode", wordDict = ["leet","code"]', output: 'true', explanation: '"leetcode" = "leet" + "code".' },
      { input: 's = "applepenapple", wordDict = ["apple","pen"]', output: 'true', explanation: '"apple" + "pen" + "apple".' },
      { input: 's = "catsandog", wordDict = ["cats","dog","sand","and","cat"]', output: 'false', explanation: 'No se puede segmentar completamente.' },
    ],
    constraints: [
      '1 <= s.length <= 300',
      '1 <= wordDict.length <= 1000',
      'Todas las strings consisten de letras minúsculas',
    ],
    hints: [
      '💡 Nivel 1: Piensa en cada posición del string como un posible corte',
      '💡 Nivel 2: dp[i] = true si s[0:i] se puede segmentar',
      '💡 Nivel 3: Para cada posición i, verifica si hay algún j < i donde dp[j]=true y s[j:i] está en wordDict',
      '💡 Nivel 4: dp[0] = true (string vacío es válido)',
    ],
    starterCode: `def word_break(s: str, wordDict: list[str]) -> bool:
    """
    Determina si s puede segmentarse en palabras del diccionario.
    
    Ejemplo:
    >>> word_break("leetcode", ["leet", "code"])
    True
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Dynamic Programming',
        approach: 'dp[i] indica si s[0:i] puede segmentarse.',
        code: `def word_break(s: str, wordDict: list[str]) -> bool:
    word_set = set(wordDict)
    dp = [False] * (len(s) + 1)
    dp[0] = True  # String vacío
    
    for i in range(1, len(s) + 1):
        for j in range(i):
            if dp[j] and s[j:i] in word_set:
                dp[i] = True
                break
    
    return dp[len(s)]`,
        complexity: { time: 'O(n² × k)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🧩 Imagina armar un rompecabezas con piezas de diferentes tamaños:

"leetcode" con piezas ["leet", "code"]

Verificamos cada posición:
- dp[0] = true (inicio)
- dp[4] = dp[0] + "leet" ∈ dict ✓
- dp[8] = dp[4] + "code" ∈ dict ✓

Si llegamos al final con true, ¡el rompecabezas se completó!`,
    testCases: [
      { input: { s: "leetcode", wordDict: ["leet","code"] }, expected: true, isHidden: false },
      { input: { s: "applepenapple", wordDict: ["apple","pen"] }, expected: true, isHidden: false },
      { input: { s: "catsandog", wordDict: ["cats","dog","sand","and","cat"] }, expected: false, isHidden: false },
      { input: { s: "a", wordDict: ["a"] }, expected: true, isHidden: true },
    ],
  },

  'trapping-rain-water': {
    id: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'hard',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'trap',
    description: `Dado n enteros no negativos representando una elevación donde el ancho de cada barra es 1, calcula cuánta agua puede atrapar después de llover.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: 'Se atrapan 6 unidades de agua.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: 'Se atrapan 9 unidades.' },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 × 10^4',
      '0 <= height[i] <= 10^5',
    ],
    hints: [
      '💡 Nivel 1: El agua en cada posición depende de la altura máxima a su izquierda y derecha',
      '💡 Nivel 2: agua[i] = min(max_izq[i], max_der[i]) - height[i]',
      '💡 Nivel 3: Puedes usar two pointers para hacerlo en O(1) espacio',
      '💡 Nivel 4: Mueve el puntero con menor max_height, porque ese lado limita el agua',
    ],
    starterCode: `def trap(height: list[int]) -> int:
    """
    Calcula cuánta agua se puede atrapar.
    
    Ejemplo:
    >>> trap([0,1,0,2,1,0,1,3,2,1,2,1])
    6
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Two Pointers (Óptima)',
        approach: 'Mantenemos max_left y max_right mientras movemos punteros.',
        code: `def trap(height: list[int]) -> int:
    left, right = 0, len(height) - 1
    max_left = max_right = 0
    water = 0
    
    while left < right:
        if height[left] < height[right]:
            if height[left] >= max_left:
                max_left = height[left]
            else:
                water += max_left - height[left]
            left += 1
        else:
            if height[right] >= max_right:
                max_right = height[right]
            else:
                water += max_right - height[right]
            right -= 1
    
    return water`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🌧️ Imagina barras de diferentes alturas. El agua se acumula en los "valles":

    |
|   | |   |
| | | | | | |
0 1 0 2 1 0 1 3

En cada posición, el agua = min(máxima_izq, máxima_der) - altura_actual.

Con two pointers: siempre procesamos el lado MÁS BAJO porque sabemos que el otro lado tiene al menos esa altura (o más), así que el agua está limitada por nuestro lado.`,
    testCases: [
      { input: { height: [0,1,0,2,1,0,1,3,2,1,2,1] }, expected: 6, isHidden: false },
      { input: { height: [4,2,0,3,2,5] }, expected: 9, isHidden: false },
      { input: { height: [1,0,1] }, expected: 1, isHidden: true },
      { input: { height: [3,0,0,2,0,4] }, expected: 10, isHidden: true },
    ],
  },

  'longest-palindrome-substring': {
    id: 'longest-palindrome-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'medium',
    category: 'String',
    pattern: 'Dynamic Programming',
    functionName: 'longest_palindrome',
    description: `Dado un string s, retorna la subcadena palindrómica más larga en s.`,
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" también es válida.' },
      { input: 's = "cbbd"', output: '"bb"', explanation: '' },
    ],
    constraints: [
      '1 <= s.length <= 1000',
      's consiste solo de dígitos y letras',
    ],
    hints: [
      '💡 Nivel 1: Un palíndromo se expande desde su centro',
      '💡 Nivel 2: Hay 2n-1 centros posibles (cada caracter + entre caracteres)',
      '💡 Nivel 3: Para cada centro, expande mientras sea palíndromo',
      '💡 Nivel 4: Guarda el más largo encontrado',
    ],
    starterCode: `def longest_palindrome(s: str) -> str:
    """
    Encuentra la subcadena palindrómica más larga.
    
    Ejemplo:
    >>> longest_palindrome("babad")
    "bab"
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Expand Around Center',
        approach: 'Para cada posible centro, expandimos mientras sea palíndromo.',
        code: `def longest_palindrome(s: str) -> str:
    result = ""
    
    def expand(left, right):
        while left >= 0 and right < len(s) and s[left] == s[right]:
            left -= 1
            right += 1
        return s[left+1:right]
    
    for i in range(len(s)):
        # Palíndromo impar (centro en i)
        odd = expand(i, i)
        # Palíndromo par (centro entre i e i+1)
        even = expand(i, i + 1)
        
        longest = odd if len(odd) > len(even) else even
        if len(longest) > len(result):
            result = longest
    
    return result`,
        complexity: { time: 'O(n²)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔍 Un palíndromo es simétrico alrededor de su centro.

"racecar" → centro es 'e', expande: c=c, a=a, r=r ✓

Para cada caracter como centro potencial:
- Expande a izquierda y derecha
- Mientras los caracteres coincidan, sigue
- Guarda el más largo

Hay dos tipos de centro:
- Impar: "aba" (centro en 'b')
- Par: "abba" (centro entre las dos 'b')`,
    testCases: [
      { input: { s: "babad" }, expected: "bab", isHidden: false },
      { input: { s: "cbbd" }, expected: "bb", isHidden: false },
      { input: { s: "a" }, expected: "a", isHidden: false },
      { input: { s: "racecar" }, expected: "racecar", isHidden: true },
    ],
  },

  'median-sorted-arrays': {
    id: 'median-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard',
    category: 'Array',
    pattern: 'Binary Search',
    functionName: 'find_median_sorted_arrays',
    description: `Dados dos arrays ordenados nums1 y nums2 de tamaño m y n respectivamente, retorna la mediana de los dos arrays combinados.

La complejidad total debe ser O(log(m+n)).`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'Combinado = [1,2,3], mediana = 2.0.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'Combinado = [1,2,3,4], mediana = (2+3)/2 = 2.5.' },
    ],
    constraints: [
      'nums1.length == m, nums2.length == n',
      '0 <= m <= 1000, 0 <= n <= 1000',
      '1 <= m + n <= 2000',
    ],
    hints: [
      '💡 Nivel 1: La mediana divide el array combinado en dos mitades iguales',
      '💡 Nivel 2: Usa binary search en el array más corto',
      '💡 Nivel 3: Para cada partición en nums1, calcula la partición correspondiente en nums2',
      '💡 Nivel 4: Verifica que max_left1 <= min_right2 y max_left2 <= min_right1',
    ],
    starterCode: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    """
    Encuentra la mediana de dos arrays ordenados.
    
    Ejemplo:
    >>> find_median_sorted_arrays([1,3], [2])
    2.0
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Binary Search',
        approach: 'Binary search en el array más corto para encontrar la partición correcta.',
        code: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    # Asegurar que nums1 es el más corto
    if len(nums1) > len(nums2):
        nums1, nums2 = nums2, nums1
    
    m, n = len(nums1), len(nums2)
    lo, hi = 0, m
    
    while lo <= hi:
        i = (lo + hi) // 2  # Partición en nums1
        j = (m + n + 1) // 2 - i  # Partición en nums2
        
        left1 = nums1[i-1] if i > 0 else float('-inf')
        right1 = nums1[i] if i < m else float('inf')
        left2 = nums2[j-1] if j > 0 else float('-inf')
        right2 = nums2[j] if j < n else float('inf')
        
        if left1 <= right2 and left2 <= right1:
            if (m + n) % 2 == 0:
                return (max(left1, left2) + min(right1, right2)) / 2
            return float(max(left1, left2))
        elif left1 > right2:
            hi = i - 1
        else:
            lo = i + 1
    
    return 0.0`,
        complexity: { time: 'O(log(min(m,n)))', space: 'O(1)' },
      },
    ],
    whyItWorks: `📊 La mediana divide todos los elementos en dos mitades.

[1, 3] y [2] → combinado [1, 2, 3]
Mitad izq: [1, 2], Mitad der: [3]

En vez de combinar (O(n+m)), usamos binary search:
- Particionamos nums1 en algún punto i
- nums2 se particiona automáticamente en j = (total/2) - i
- Verificamos que todo lo de la izquierda ≤ todo lo de la derecha

Solo buscamos en el array más corto → O(log(min(m,n)))`,
    testCases: [
      { input: { nums1: [1,3], nums2: [2] }, expected: 2.0, isHidden: false },
      { input: { nums1: [1,2], nums2: [3,4] }, expected: 2.5, isHidden: false },
      { input: { nums1: [], nums2: [1] }, expected: 1.0, isHidden: true },
      { input: { nums1: [1,2,3], nums2: [4,5,6] }, expected: 3.5, isHidden: true },
    ],
  },

  'move-zeroes': {
    id: 'move-zeroes',
    title: 'Mover Ceros',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'move_zeroes',
    description: `Dado un array de enteros nums, mueve todos los 0 al final mientras mantienes el orden relativo de los elementos no-cero.

Debes hacerlo in-place sin hacer una copia del array.`,
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', explanation: '' },
      { input: 'nums = [0]', output: '[0]', explanation: '' },
    ],
    constraints: [
      '1 <= nums.length <= 10^4',
      '-2^31 <= nums[i] <= 2^31 - 1',
    ],
    hints: [
      '💡 Nivel 1: Usa dos punteros: fast para leer, slow para escribir',
      '💡 Nivel 2: Copia los no-ceros al frente manteniendo su orden',
      '💡 Nivel 3: Rellena el resto con ceros',
    ],
    starterCode: `def move_zeroes(nums: list[int]) -> None:
    """
    Mueve todos los ceros al final in-place.
    
    Ejemplo:
    >>> nums = [0,1,0,3,12]
    >>> move_zeroes(nums)
    >>> nums
    [1,3,12,0,0]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Two Pointers',
        approach: 'Un puntero lee (fast), otro escribe (slow).',
        code: `def move_zeroes(nums: list[int]) -> None:
    slow = 0
    
    for fast in range(len(nums)):
        if nums[fast] != 0:
            nums[slow] = nums[fast]
            slow += 1
    
    while slow < len(nums):
        nums[slow] = 0
        slow += 1`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `📝 Imagina que copias una lista saltando los ceros:

Original: [0, 1, 0, 3, 12]
           f→

slow escribe, fast lee:
fast=1 → nums[slow=0] = 1 → [1, 1, 0, 3, 12]
fast=3 → nums[slow=1] = 3 → [1, 3, 0, 3, 12]  
fast=4 → nums[slow=2] = 12 → [1, 3, 12, 3, 12]

Rellena ceros: [1, 3, 12, 0, 0] ✓`,
    testCases: [
      { input: { nums: [0,1,0,3,12] }, expected: [1,3,12,0,0], isHidden: false },
      { input: { nums: [0] }, expected: [0], isHidden: false },
      { input: { nums: [1,2,3] }, expected: [1,2,3], isHidden: true },
      { input: { nums: [0,0,1] }, expected: [1,0,0], isHidden: true },
    ],
    isInPlace: true,
    inPlaceParam: 'nums',
  },

  'rotate-array': {
    id: 'rotate-array',
    title: 'Rotar Array',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'rotate',
    description: `Dado un array de enteros nums, rota el array hacia la derecha k pasos.

Debes hacerlo in-place con O(1) espacio extra.`,
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotar 3 pasos a la derecha.' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]', explanation: '' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      'k >= 0',
    ],
    hints: [
      '💡 Nivel 1: ¿Qué pasa si reviertes todo el array primero?',
      '💡 Nivel 2: Después de revertir todo, revierte los primeros k y el resto',
      '💡 Nivel 3: Triple reverso: reverse(todo) → reverse(0:k) → reverse(k:n)',
    ],
    starterCode: `def rotate(nums: list[int], k: int) -> None:
    """
    Rota el array k posiciones a la derecha in-place.
    
    Ejemplo:
    >>> nums = [1,2,3,4,5,6,7]
    >>> rotate(nums, 3)
    >>> nums
    [5,6,7,1,2,3,4]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Triple Reverso',
        approach: 'Revertir todo, luego las dos partes por separado.',
        code: `def rotate(nums: list[int], k: int) -> None:
    n = len(nums)
    k = k % n
    
    def reverse(start, end):
        while start < end:
            nums[start], nums[end] = nums[end], nums[start]
            start += 1
            end -= 1
    
    reverse(0, n - 1)      # [7,6,5,4,3,2,1]
    reverse(0, k - 1)      # [5,6,7,4,3,2,1]
    reverse(k, n - 1)      # [5,6,7,1,2,3,4]`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔄 El truco del triple reverso:

[1, 2, 3, 4, 5, 6, 7], k=3

1. Revertir todo:     [7, 6, 5, 4, 3, 2, 1]
2. Revertir 0..k-1:   [5, 6, 7, 4, 3, 2, 1]  
3. Revertir k..n-1:   [5, 6, 7, 1, 2, 3, 4] ✓

¡Funciona porque revertir dos veces restaura el orden!`,
    testCases: [
      { input: { nums: [1,2,3,4,5,6,7], k: 3 }, expected: [5,6,7,1,2,3,4], isHidden: false },
      { input: { nums: [-1,-100,3,99], k: 2 }, expected: [3,99,-1,-100], isHidden: false },
      { input: { nums: [1,2], k: 3 }, expected: [2,1], isHidden: true },
    ],
    isInPlace: true,
    inPlaceParam: 'nums',
  },

  'fizz-buzz': {
    id: 'fizz-buzz',
    title: 'FizzBuzz',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Sorting',
    functionName: 'fizz_buzz',
    description: `Dado un entero n, retorna un array de strings answer (1-indexed) donde:
- answer[i] == "FizzBuzz" si i es divisible por 3 y 5
- answer[i] == "Fizz" si i es divisible por 3
- answer[i] == "Buzz" si i es divisible por 5
- answer[i] == i (como string) si ninguna de las anteriores`,
    examples: [
      { input: 'n = 5', output: '["1","2","Fizz","4","Buzz"]', explanation: '' },
      { input: 'n = 15', output: '["1","2","Fizz",...,"FizzBuzz"]', explanation: '15 es divisible por 3 y 5.' },
    ],
    constraints: ['1 <= n <= 10^4'],
    hints: [
      '💡 Nivel 1: Verifica primero si es divisible por 15 (3 y 5)',
      '💡 Nivel 2: El orden de las condiciones importa',
      '💡 Nivel 3: Puedes usar comprehension con condiciones',
    ],
    starterCode: `def fizz_buzz(n: int) -> list[str]:
    """
    Genera la secuencia FizzBuzz hasta n.
    
    Ejemplo:
    >>> fizz_buzz(5)
    ["1", "2", "Fizz", "4", "Buzz"]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Condicionales',
        approach: 'Verificamos divisibilidad en orden de prioridad.',
        code: `def fizz_buzz(n: int) -> list[str]:
    result = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            result.append("FizzBuzz")
        elif i % 3 == 0:
            result.append("Fizz")
        elif i % 5 == 0:
            result.append("Buzz")
        else:
            result.append(str(i))
    return result`,
        complexity: { time: 'O(n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🎮 Es un juego clásico de programación:

1 → "1"
2 → "2"  
3 → divisible por 3 → "Fizz"
4 → "4"
5 → divisible por 5 → "Buzz"
...
15 → divisible por AMBOS → "FizzBuzz"

El truco: verificar 15 primero (3×5), sino se imprime "Fizz" o "Buzz" cuando debería ser "FizzBuzz".`,
    testCases: [
      { input: { n: 3 }, expected: ["1","2","Fizz"], isHidden: false },
      { input: { n: 5 }, expected: ["1","2","Fizz","4","Buzz"], isHidden: false },
      { input: { n: 15 }, expected: ["1","2","Fizz","4","Buzz","Fizz","7","8","Fizz","Buzz","11","Fizz","13","14","FizzBuzz"], isHidden: false },
      { input: { n: 1 }, expected: ["1"], isHidden: true },
    ],
  },

  'group-anagrams': {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'medium',
    category: 'Hash Table',
    pattern: 'Hashing',
    functionName: 'group_anagrams',
    description: `Dado un array de strings strs, agrupa los anagramas juntos. Puedes retornar la respuesta en cualquier orden.

Un anagrama es una palabra formada al reordenar las letras de otra palabra, usando todas exactamente una vez.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["eat","tea","ate"],["tan","nat"],["bat"]]', explanation: '' },
      { input: 'strs = [""]', output: '[[""]]', explanation: '' },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
    ],
    hints: [
      '💡 Nivel 1: ¿Qué tienen en común los anagramas cuando los ordenas?',
      '💡 Nivel 2: "eat", "tea", "ate" → todos se ordenan a "aet"',
      '💡 Nivel 3: Usa un diccionario con la palabra ordenada como clave',
    ],
    starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    """
    Agrupa los anagramas.
    
    Ejemplo:
    >>> group_anagrams(["eat","tea","tan","ate","nat","bat"])
    [["eat","tea","ate"],["tan","nat"],["bat"]]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'HashMap con sorted key',
        approach: 'Usamos la palabra ordenada como clave para agrupar.',
        code: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    groups = defaultdict(list)
    
    for word in strs:
        key = tuple(sorted(word))
        groups[key].append(word)
    
    return list(groups.values())`,
        complexity: { time: 'O(n × k log k)', space: 'O(n × k)' },
      },
    ],
    whyItWorks: `📚 Los anagramas son como palabras con las mismas letras pero revueltas:

"eat" ordenado → "aet"
"tea" ordenado → "aet"  ← ¡Mismo grupo!
"ate" ordenado → "aet"  ← ¡Mismo grupo!
"tan" ordenado → "ant"
"nat" ordenado → "ant"  ← ¡Mismo grupo!

Usamos la versión ordenada como "firma" de cada grupo.`,
    testCases: [
      { input: { strs: ["eat","tea","tan","ate","nat","bat"] }, expected: [["eat","tea","ate"],["tan","nat"],["bat"]], isHidden: false },
      { input: { strs: [""] }, expected: [[""]], isHidden: false },
      { input: { strs: ["a"] }, expected: [["a"]], isHidden: false },
      { input: { strs: ["abc","cba","bac","xyz","zyx"] }, expected: [["abc","cba","bac"],["xyz","zyx"]], isHidden: true },
    ],
  },

  'first-unique-char': {
    id: 'first-unique-char',
    title: 'Primer Caracter Único',
    difficulty: 'easy',
    category: 'String',
    pattern: 'Hashing',
    functionName: 'first_uniq_char',
    description: `Dado un string s, encuentra el primer caracter que no se repite y retorna su índice. Si no existe, retorna -1.`,
    examples: [
      { input: 's = "leetcode"', output: '0', explanation: "'l' es el primer caracter único." },
      { input: 's = "loveleetcode"', output: '2', explanation: "'v' es el primer caracter único." },
      { input: 's = "aabb"', output: '-1', explanation: 'No hay caracter único.' },
    ],
    constraints: [
      '1 <= s.length <= 10^5',
      's consiste solo de letras minúsculas',
    ],
    hints: [
      '💡 Nivel 1: Primero cuenta la frecuencia de cada caracter',
      '💡 Nivel 2: Luego recorre el string buscando el primero con frecuencia 1',
      '💡 Nivel 3: Counter de collections hace el conteo fácil',
    ],
    starterCode: `def first_uniq_char(s: str) -> int:
    """
    Encuentra el índice del primer caracter único.
    
    Ejemplo:
    >>> first_uniq_char("leetcode")
    0
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Counter',
        approach: 'Contamos frecuencias y buscamos el primer caracter con count=1.',
        code: `def first_uniq_char(s: str) -> int:
    count = Counter(s)
    
    for i, char in enumerate(s):
        if count[char] == 1:
            return i
    
    return -1`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔍 Dos pasadas por el string:

"leetcode"
Paso 1 - Contar: {l:1, e:3, t:1, c:1, o:1, d:1}
Paso 2 - Buscar primer count=1:
  l → count=1 ✓ → retorna 0

El espacio es O(1) porque solo hay 26 letras posibles.`,
    testCases: [
      { input: { s: "leetcode" }, expected: 0, isHidden: false },
      { input: { s: "loveleetcode" }, expected: 2, isHidden: false },
      { input: { s: "aabb" }, expected: -1, isHidden: false },
      { input: { s: "z" }, expected: 0, isHidden: true },
    ],
  },

  'sort-array-by-parity': {
    id: 'sort-array-by-parity',
    title: 'Ordenar Array por Paridad',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Two Pointers',
    functionName: 'sort_array_by_parity',
    description: `Dado un array de enteros nums, mueve todos los números pares al inicio del array seguidos por todos los impares.

Retorna cualquier array que satisfaga esta condición.`,
    examples: [
      { input: 'nums = [3,1,2,4]', output: '[2,4,3,1]', explanation: 'Pares primero, luego impares.' },
      { input: 'nums = [0]', output: '[0]', explanation: '' },
    ],
    constraints: [
      '1 <= nums.length <= 5000',
      '0 <= nums[i] <= 5000',
    ],
    hints: [
      '💡 Nivel 1: Puedes usar sorted() con una función key',
      '💡 Nivel 2: x % 2 es 0 para pares y 1 para impares',
      '💡 Nivel 3: sorted() ordena de menor a mayor: 0 (pares) va primero',
    ],
    starterCode: `def sort_array_by_parity(nums: list[int]) -> list[int]:
    """
    Ordena: pares primero, luego impares.
    
    Ejemplo:
    >>> sort_array_by_parity([3,1,2,4])
    [2,4,3,1]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Lambda Sort',
        approach: 'Ordenar usando x % 2 como clave.',
        code: `def sort_array_by_parity(nums: list[int]) -> list[int]:
    return sorted(nums, key=lambda x: x % 2)`,
        complexity: { time: 'O(n log n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🎯 x % 2 devuelve:
- 0 para pares (2, 4, 6...)
- 1 para impares (1, 3, 5...)

sorted() ordena de menor a mayor:
- Los 0s (pares) van primero
- Los 1s (impares) después

¡Una línea elegante!`,
    testCases: [
      { input: { nums: [3,1,2,4] }, expected: [2,4,3,1], isHidden: false },
      { input: { nums: [0] }, expected: [0], isHidden: false },
      { input: { nums: [1,3,5] }, expected: [1,3,5], isHidden: true },
      { input: { nums: [2,4,6] }, expected: [2,4,6], isHidden: true },
    ],
  },

  'intersection-two-arrays': {
    id: 'intersection-two-arrays',
    title: 'Intersección de Dos Arrays',
    difficulty: 'easy',
    category: 'Array',
    pattern: 'Hashing',
    functionName: 'intersect',
    description: `Dados dos arrays de enteros nums1 y nums2, retorna un array con su intersección.

Cada elemento en el resultado debe aparecer tantas veces como aparece en ambos arrays.`,
    examples: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2,2]', explanation: '' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[4,9]', explanation: '' },
    ],
    constraints: [
      '1 <= nums1.length, nums2.length <= 1000',
      '0 <= nums1[i], nums2[i] <= 1000',
    ],
    hints: [
      '💡 Nivel 1: ¿Qué estructura te permite contar elementos?',
      '💡 Nivel 2: Counter del primer array, luego consume del segundo',
      '💡 Nivel 3: Counter(nums1) & Counter(nums2) también funciona',
    ],
    starterCode: `def intersect(nums1: list[int], nums2: list[int]) -> list[int]:
    """
    Encuentra la intersección de dos arrays.
    
    Ejemplo:
    >>> intersect([1,2,2,1], [2,2])
    [2,2]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Counter',
        approach: 'Contamos frecuencias y tomamos el mínimo.',
        code: `def intersect(nums1: list[int], nums2: list[int]) -> list[int]:
    count = Counter(nums1)
    result = []
    
    for num in nums2:
        if count[num] > 0:
            result.append(num)
            count[num] -= 1
    
    return result`,
        complexity: { time: 'O(n + m)', space: 'O(min(n, m))' },
      },
    ],
    whyItWorks: `🔢 Contamos cuántas veces aparece cada número en el primer array.

nums1 = [1,2,2,1] → {1:2, 2:2}

Recorremos nums2 y "consumimos" del contador:
- 2 → count[2]=2 > 0 → agregar, count[2]=1
- 2 → count[2]=1 > 0 → agregar, count[2]=0

Resultado: [2, 2]`,
    testCases: [
      { input: { nums1: [1,2,2,1], nums2: [2,2] }, expected: [2,2], isHidden: false },
      { input: { nums1: [4,9,5], nums2: [9,4,9,8,4] }, expected: [4,9], isHidden: false },
      { input: { nums1: [1,2,3], nums2: [4,5,6] }, expected: [], isHidden: true },
    ],
  },

  // =============================================
  // EJERCICIOS POR MÓDULO FALTANTE
  // =============================================

  'reverse-linked-list': {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy',
    category: 'Linked List',
    pattern: 'Linked List',
    functionName: 'reverse_list',
    description: `Dada la cabeza (head) de una singly linked list, invierte la lista y retorna la lista invertida.

Una linked list se representa como una secuencia de nodos donde cada nodo tiene un valor y un puntero al siguiente nodo.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'La lista se invierte completamente.' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: '' },
      { input: 'head = []', output: '[]', explanation: 'Lista vacía.' },
    ],
    constraints: [
      '0 <= número de nodos <= 5000',
      '-5000 <= Node.val <= 5000',
    ],
    hints: [
      '💡 Nivel 1: Necesitas cambiar la dirección de los punteros next',
      '💡 Nivel 2: Usa tres punteros: prev, curr, next_node',
      '💡 Nivel 3: En cada paso: guarda next, apunta curr a prev, avanza',
      '💡 Nivel 4: prev=None, curr=head. Mientras curr: next=curr.next, curr.next=prev, prev=curr, curr=next',
    ],
    starterCode: `def reverse_list(head):
    """
    Invierte una linked list.
    
    Args:
        head: ListNode - cabeza de la lista
        
    Returns:
        ListNode - cabeza de la lista invertida
    
    Ejemplo:
    >>> reverse_list([1,2,3,4,5])
    [5,4,3,2,1]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Iterativa (3 punteros)',
        approach: 'Usamos prev, curr y next para invertir los punteros uno a uno.',
        code: `def reverse_list(head):
    prev = None
    curr = head
    
    while curr:
        next_node = curr.next  # Guardar siguiente
        curr.next = prev       # Invertir puntero
        prev = curr            # Avanzar prev
        curr = next_node       # Avanzar curr
    
    return prev`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔗 Imagina una fila de personas tomadas de la mano:

1 → 2 → 3 → 4 → 5 → None

En cada paso, le dices a cada persona que suelte la mano derecha y tome la de la izquierda:

Paso 1: None ← 1   2 → 3 → 4 → 5
Paso 2: None ← 1 ← 2   3 → 4 → 5
Paso 3: None ← 1 ← 2 ← 3   4 → 5
...

Al final: None ← 1 ← 2 ← 3 ← 4 ← 5

¡prev apunta al nuevo head (5)!`,
    testCases: [
      { input: { head: [1,2,3,4,5] }, expected: [5,4,3,2,1], isHidden: false },
      { input: { head: [1,2] }, expected: [2,1], isHidden: false },
      { input: { head: [] }, expected: [], isHidden: false },
      { input: { head: [1] }, expected: [1], isHidden: true },
    ],
  },

  'max-depth-binary-tree': {
    id: 'max-depth-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'easy',
    category: 'Tree',
    pattern: 'DFS',
    functionName: 'max_depth',
    description: `Dado el nodo raíz (root) de un árbol binario, retorna su profundidad máxima.

La profundidad máxima es el número de nodos a lo largo del camino más largo desde el nodo raíz hasta la hoja más lejana.

El árbol se da como un array donde null representa nodos ausentes.`,
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'El camino más largo es 3→20→15 o 3→20→7.' },
      { input: 'root = [1,null,2]', output: '2', explanation: '' },
    ],
    constraints: [
      '0 <= número de nodos <= 10^4',
      '-100 <= Node.val <= 100',
    ],
    hints: [
      '💡 Nivel 1: Usa recursión: la profundidad de un nodo es 1 + max(izq, der)',
      '💡 Nivel 2: Caso base: si el nodo es None, la profundidad es 0',
      '💡 Nivel 3: max_depth(root) = 1 + max(max_depth(root.left), max_depth(root.right))',
    ],
    starterCode: `def max_depth(root) -> int:
    """
    Encuentra la profundidad máxima del árbol binario.
    
    Args:
        root: TreeNode - raíz del árbol
        
    Returns:
        int - profundidad máxima
    
    Ejemplo:
    >>> max_depth([3,9,20,null,null,15,7])
    3
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'DFS Recursivo',
        approach: 'La profundidad es 1 + la mayor profundidad de los hijos.',
        code: `def max_depth(root) -> int:
    if not root:
        return 0
    
    left_depth = max_depth(root.left)
    right_depth = max_depth(root.right)
    
    return 1 + max(left_depth, right_depth)`,
        complexity: { time: 'O(n)', space: 'O(h)' },
      },
    ],
    whyItWorks: `🌳 Pregúntale a cada nodo: "¿qué tan profundo eres?"

        3          profundidad = 1 + max(1, 2) = 3
       / \\
      9   20       9: 1+max(0,0)=1, 20: 1+max(1,1)=2
         / \\
        15   7     15: 1, 7: 1

Cada nodo pregunta a sus hijos y toma el máximo + 1.
Si no tiene hijos (None), responde 0.

Es como preguntar "¿cuál es el piso más alto?" bajando por escaleras.`,
    testCases: [
      { input: { root: [3,9,20,null,null,15,7] }, expected: 3, isHidden: false },
      { input: { root: [1,null,2] }, expected: 2, isHidden: false },
      { input: { root: [] }, expected: 0, isHidden: true },
      { input: { root: [1] }, expected: 1, isHidden: true },
    ],
  },

  'validate-bst': {
    id: 'validate-bst',
    title: 'Validate Binary Search Tree',
    difficulty: 'medium',
    category: 'BST',
    pattern: 'DFS',
    functionName: 'is_valid_bst',
    description: `Dado el nodo raíz de un árbol binario, determina si es un Binary Search Tree (BST) válido.

Un BST válido se define como:
- El subárbol izquierdo contiene solo nodos con valores MENORES que el nodo.
- El subárbol derecho contiene solo nodos con valores MAYORES que el nodo.
- Ambos subárboles también deben ser BSTs.`,
    examples: [
      { input: 'root = [2,1,3]', output: 'true', explanation: '1 < 2 < 3, es BST válido.' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'El nodo 4 está en el subárbol derecho de 5, pero 4 < 5 no es suficiente: 3 < 5 viola la regla.' },
    ],
    constraints: [
      '1 <= número de nodos <= 10^4',
      '-2^31 <= Node.val <= 2^31 - 1',
    ],
    hints: [
      '💡 Nivel 1: No basta comparar padre con hijos directos',
      '💡 Nivel 2: Cada nodo tiene un rango válido (min, max)',
      '💡 Nivel 3: Al ir a la izquierda, el max se actualiza. Al ir a la derecha, el min se actualiza.',
      '💡 Nivel 4: is_valid(node, min_val, max_val): node.val debe estar entre min_val y max_val',
    ],
    starterCode: `def is_valid_bst(root) -> bool:
    """
    Verifica si el árbol es un BST válido.
    
    Args:
        root: TreeNode - raíz del árbol
        
    Returns:
        bool - True si es BST válido
    
    Ejemplo:
    >>> is_valid_bst([2,1,3])
    True
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'DFS con rangos',
        approach: 'Cada nodo debe estar dentro de un rango (min, max) válido.',
        code: `def is_valid_bst(root) -> bool:
    def validate(node, min_val, max_val):
        if not node:
            return True
        
        if node.val <= min_val or node.val >= max_val:
            return False
        
        return (validate(node.left, min_val, node.val) and
                validate(node.right, node.val, max_val))
    
    return validate(root, float('-inf'), float('inf'))`,
        complexity: { time: 'O(n)', space: 'O(h)' },
      },
    ],
    whyItWorks: `🌲 Un BST no solo requiere hijo_izq < padre < hijo_der.
Requiere que TODO el subárbol izquierdo sea menor.

      5
     / \\
    1   4    ← 4 < 5 ✓ pero...
       / \\
      3   6  ← 3 está en subárbol DERECHO de 5, pero 3 < 5 ✗

La solución: cada nodo hereda un rango válido de sus ancestros.
- Raíz: (-∞, +∞)
- Izquierda de 5: (-∞, 5)
- Derecha de 5: (5, +∞)
- 4 está en (5, +∞) pero 4 < 5 → ¡INVÁLIDO!`,
    testCases: [
      { input: { root: [2,1,3] }, expected: true, isHidden: false },
      { input: { root: [5,1,4,null,null,3,6] }, expected: false, isHidden: false },
      { input: { root: [1] }, expected: true, isHidden: true },
      { input: { root: [5,4,6,null,null,3,7] }, expected: false, isHidden: true },
    ],
  },

  'kth-largest-element': {
    id: 'kth-largest-element',
    title: 'Kth Largest Element in Array',
    difficulty: 'medium',
    category: 'Heap',
    pattern: 'Sorting',
    functionName: 'find_kth_largest',
    description: `Dado un array de enteros nums y un entero k, retorna el k-ésimo elemento más grande del array.

Nota: es el k-ésimo más grande en orden ordenado, no el k-ésimo elemento distinto.`,
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: 'Ordenado: [6,5,4,3,2,1]. El 2do más grande es 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explanation: 'Ordenado: [6,5,5,4,3,3,2,2,1]. El 4to más grande es 4.' },
    ],
    constraints: [
      '1 <= k <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      '💡 Nivel 1: La solución más simple: ordena y toma el k-ésimo desde el final',
      '💡 Nivel 2: Más eficiente: usa un min-heap de tamaño k',
      '💡 Nivel 3: El tope del min-heap de tamaño k es el k-ésimo más grande',
      '💡 Nivel 4: heapq en Python implementa un min-heap',
    ],
    starterCode: `def find_kth_largest(nums: list[int], k: int) -> int:
    """
    Encuentra el k-ésimo elemento más grande.
    
    Ejemplo:
    >>> find_kth_largest([3,2,1,5,6,4], 2)
    5
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Min-Heap de tamaño k',
        approach: 'Mantenemos un min-heap con los k elementos más grandes.',
        code: `def find_kth_largest(nums: list[int], k: int) -> int:
    # Min-heap de tamaño k
    heap = []
    
    for num in nums:
        heappush(heap, num)
        if len(heap) > k:
            heappop(heap)  # Eliminar el más pequeño
    
    return heap[0]  # El tope es el k-ésimo más grande`,
        complexity: { time: 'O(n log k)', space: 'O(k)' },
      },
    ],
    whyItWorks: `📊 Imagina que solo tienes espacio para guardar k números:

nums = [3,2,1,5,6,4], k = 2

heap (guardamos los 2 más grandes vistos):
+3 → [3]
+2 → [2, 3]
+1 → [1, 2, 3] → pop(1) → [2, 3]  (1 no entra al top 2)
+5 → [2, 3, 5] → pop(2) → [3, 5]
+6 → [3, 5, 6] → pop(3) → [5, 6]
+4 → [4, 5, 6] → pop(4) → [5, 6]

El tope del heap (5) es el 2do más grande. ✓`,
    testCases: [
      { input: { nums: [3,2,1,5,6,4], k: 2 }, expected: 5, isHidden: false },
      { input: { nums: [3,2,3,1,2,4,5,5,6], k: 4 }, expected: 4, isHidden: false },
      { input: { nums: [1], k: 1 }, expected: 1, isHidden: true },
      { input: { nums: [7,6,5,4,3,2,1], k: 5 }, expected: 3, isHidden: true },
    ],
  },

  'subsets': {
    id: 'subsets',
    title: 'Subsets',
    difficulty: 'medium',
    category: 'Backtracking',
    pattern: 'Recursion',
    functionName: 'subsets',
    description: `Dado un array de enteros únicos nums, retorna todos los posibles subconjuntos (power set).

El conjunto solución NO debe contener subconjuntos duplicados. Retorna la solución en cualquier orden.`,
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: 'Todos los 2^3 = 8 subconjuntos.' },
      { input: 'nums = [0]', output: '[[],[0]]', explanation: '2 subconjuntos: vacío y {0}.' },
    ],
    constraints: [
      '1 <= nums.length <= 10',
      '-10 <= nums[i] <= 10',
      'Todos los elementos son únicos',
    ],
    hints: [
      '💡 Nivel 1: Para cada elemento, tienes 2 opciones: incluirlo o no',
      '💡 Nivel 2: Usa backtracking: explora ambas opciones recursivamente',
      '💡 Nivel 3: En cada nivel del árbol de decisión, decides sobre un elemento',
      '💡 Nivel 4: backtrack(start, current): para i desde start, agrega nums[i] y recursa con i+1',
    ],
    starterCode: `def subsets(nums: list[int]) -> list[list[int]]:
    """
    Genera todos los subconjuntos posibles.
    
    Ejemplo:
    >>> subsets([1,2,3])
    [[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Backtracking',
        approach: 'Para cada elemento decidimos: incluirlo o no.',
        code: `def subsets(nums: list[int]) -> list[list[int]]:
    result = []
    
    def backtrack(start, current):
        result.append(current[:])  # Copiar
        
        for i in range(start, len(nums)):
            current.append(nums[i])
            backtrack(i + 1, current)
            current.pop()  # Deshacer
    
    backtrack(0, [])
    return result`,
        complexity: { time: 'O(n × 2^n)', space: 'O(n)' },
      },
    ],
    whyItWorks: `🌳 Imagina un árbol de decisiones binarias:

Para [1, 2, 3]:
                    []
           /                  \\
         [1]                   []
       /     \\              /     \\
    [1,2]    [1]          [2]      []
    /  \\    /  \\        /  \\    /  \\
[1,2,3][1,2][1,3][1] [2,3][2] [3]  []

Cada hoja es un subconjunto válido.
Backtracking = explorar este árbol, agregando y quitando elementos.

2^n hojas = 2^3 = 8 subconjuntos.`,
    testCases: [
      { input: { nums: [1,2,3] }, expected: [[],[1],[1,2],[1,2,3],[1,3],[2],[2,3],[3]], isHidden: false },
      { input: { nums: [0] }, expected: [[],[0]], isHidden: false },
      { input: { nums: [1,2] }, expected: [[],[1],[1,2],[2]], isHidden: true },
    ],
  },

  'sort-colors': {
    id: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'medium',
    category: 'Sorting',
    pattern: 'Two Pointers',
    functionName: 'sort_colors',
    description: `Dado un array nums con n objetos coloreados de rojo (0), blanco (1) y azul (2), ordénalos in-place para que los objetos del mismo color estén adyacentes, en el orden: rojo, blanco, azul.

Debes resolverlo sin usar la función sort de la biblioteca.`,
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: '' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]', explanation: '' },
    ],
    constraints: [
      'n == nums.length',
      '1 <= n <= 300',
      'nums[i] es 0, 1, o 2',
    ],
    hints: [
      '💡 Nivel 1: Usa tres punteros: low, mid, high',
      '💡 Nivel 2: low marca el final de los 0s, high marca el inicio de los 2s',
      '💡 Nivel 3: mid recorre el array: si es 0 intercambia con low, si es 2 intercambia con high',
      '💡 Nivel 4: Este es el famoso algoritmo Dutch National Flag de Dijkstra',
    ],
    starterCode: `def sort_colors(nums: list[int]) -> None:
    """
    Ordena el array de colores (0, 1, 2) in-place.
    
    Ejemplo:
    >>> nums = [2,0,2,1,1,0]
    >>> sort_colors(nums)
    >>> nums
    [0,0,1,1,2,2]
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Dutch National Flag',
        approach: 'Tres punteros dividen el array en zonas: 0s, 1s, 2s.',
        code: `def sort_colors(nums: list[int]) -> None:
    low, mid, high = 0, 0, len(nums) - 1
    
    while mid <= high:
        if nums[mid] == 0:
            nums[low], nums[mid] = nums[mid], nums[low]
            low += 1
            mid += 1
        elif nums[mid] == 2:
            nums[mid], nums[high] = nums[high], nums[mid]
            high -= 1
        else:  # nums[mid] == 1
            mid += 1`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🇳🇱 Bandera holandesa: rojo (0), blanco (1), azul (2)

Tres zonas:
[0...low-1] = todos 0s (rojos)
[low...mid-1] = todos 1s (blancos)
[high+1...n-1] = todos 2s (azules)

mid recorre lo desconocido:
- Si ve 0: intercambia con low (manda a zona roja)
- Si ve 2: intercambia con high (manda a zona azul)
- Si ve 1: está bien, avanza

Una sola pasada, O(n), sin sort().`,
    testCases: [
      { input: { nums: [2,0,2,1,1,0] }, expected: [0,0,1,1,2,2], isHidden: false },
      { input: { nums: [2,0,1] }, expected: [0,1,2], isHidden: false },
      { input: { nums: [0] }, expected: [0], isHidden: true },
      { input: { nums: [1,0] }, expected: [0,1], isHidden: true },
    ],
    isInPlace: true,
    inPlaceParam: 'nums',
  },

  'number-of-1-bits': {
    id: 'number-of-1-bits',
    title: 'Number of 1 Bits (Hamming Weight)',
    difficulty: 'easy',
    category: 'Bit Manipulation',
    pattern: 'Hashing',
    functionName: 'hamming_weight',
    description: `Escribe una función que tome un entero sin signo y retorne el número de bits '1' que tiene (también conocido como Hamming Weight).`,
    examples: [
      { input: 'n = 11', output: '3', explanation: '11 en binario es 1011, que tiene tres bits 1.' },
      { input: 'n = 128', output: '1', explanation: '128 en binario es 10000000, que tiene un bit 1.' },
      { input: 'n = 255', output: '8', explanation: '255 en binario es 11111111, que tiene ocho bits 1.' },
    ],
    constraints: [
      '0 <= n <= 2^31 - 1',
    ],
    hints: [
      '💡 Nivel 1: n & 1 te dice si el último bit es 1',
      '💡 Nivel 2: n >> 1 desplaza todos los bits una posición a la derecha',
      '💡 Nivel 3: Repite hasta que n sea 0',
      '💡 Nivel 4: Truco: n & (n-1) elimina el bit 1 más bajo',
    ],
    starterCode: `def hamming_weight(n: int) -> int:
    """
    Cuenta el número de bits 1 en la representación binaria de n.
    
    Ejemplo:
    >>> hamming_weight(11)
    3
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'Brian Kernighan\'s Algorithm',
        approach: 'n & (n-1) elimina el bit 1 más bajo. Contamos cuántas veces podemos hacer esto.',
        code: `def hamming_weight(n: int) -> int:
    count = 0
    while n:
        n &= (n - 1)  # Elimina el bit 1 más bajo
        count += 1
    return count`,
        complexity: { time: 'O(k)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🔢 El truco mágico de n & (n-1):

n     = 1011000  (tiene un 1 en posición 3)
n-1   = 1010111  (los bits debajo del 1 más bajo se invierten)
n&n-1 = 1010000  (¡el 1 más bajo desapareció!)

Repetimos:
1011000 → 1010000 → 1000000 → 0000000

¡3 iteraciones = 3 bits 1!

Es más eficiente que revisar los 32 bits: solo itera k veces (k = número de 1s).`,
    testCases: [
      { input: { n: 11 }, expected: 3, isHidden: false },
      { input: { n: 128 }, expected: 1, isHidden: false },
      { input: { n: 255 }, expected: 8, isHidden: false },
      { input: { n: 0 }, expected: 0, isHidden: true },
      { input: { n: 1023 }, expected: 10, isHidden: true },
    ],
  },

  'implement-trie': {
    id: 'implement-trie',
    title: 'Implement Trie (Prefix Tree)',
    difficulty: 'medium',
    category: 'Trie',
    pattern: 'Hashing',
    functionName: 'Trie',
    description: `Implementa la clase Trie (prefix tree) con las siguientes operaciones:

- Trie(): Inicializa el objeto trie.
- insert(word): Inserta el string word en el trie.
- search(word): Retorna true si word está en el trie.
- starts_with(prefix): Retorna true si hay alguna palabra que empiece con prefix.`,
    examples: [
      { input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', output: '[null, true, false, true, null, true]', explanation: '' },
    ],
    constraints: [
      '1 <= word.length, prefix.length <= 2000',
      'word y prefix consisten de letras minúsculas',
      'Máximo 3 × 10^4 llamadas a insert, search, startsWith',
    ],
    hints: [
      '💡 Nivel 1: Un Trie es un árbol donde cada nodo tiene hasta 26 hijos (una por letra)',
      '💡 Nivel 2: Cada nodo puede usar un diccionario children = {}',
      '💡 Nivel 3: Marca el final de una palabra con un flag is_end',
      '💡 Nivel 4: insert/search/startsWith todos recorren el trie letra por letra',
    ],
    starterCode: `class Trie:
    """
    Implementa un Prefix Tree (Trie).
    
    Ejemplo:
    >>> trie = Trie()
    >>> trie.insert("apple")
    >>> trie.search("apple")   # True
    >>> trie.search("app")     # False
    >>> trie.starts_with("app") # True
    """
    
    def __init__(self):
        # Tu código aquí
        pass
    
    def insert(self, word: str) -> None:
        # Tu código aquí
        pass
    
    def search(self, word: str) -> bool:
        # Tu código aquí
        pass
    
    def starts_with(self, prefix: str) -> bool:
        # Tu código aquí
        pass`,
    solutions: [
      {
        title: 'Diccionario anidado',
        approach: 'Cada nodo es un diccionario con hijos y un flag de fin de palabra.',
        code: `class Trie:
    def __init__(self):
        self.children = {}
        self.is_end = False
    
    def insert(self, word: str) -> None:
        node = self
        for char in word:
            if char not in node.children:
                node.children[char] = Trie()
            node = node.children[char]
        node.is_end = True
    
    def search(self, word: str) -> bool:
        node = self._find(word)
        return node is not None and node.is_end
    
    def starts_with(self, prefix: str) -> bool:
        return self._find(prefix) is not None
    
    def _find(self, word: str):
        node = self
        for char in word:
            if char not in node.children:
                return None
            node = node.children[char]
        return node`,
        complexity: { time: 'O(m) por operación', space: 'O(n × m)' },
      },
    ],
    whyItWorks: `📝 Un Trie es como un diccionario visual:

Insertamos "apple", "app", "ape":

        root
         |
         a
         |
         p
        / \\
       p    e*
       |
       l
       |
       e*

* = fin de palabra

search("app"): a→p→p encontrado, pero ¿is_end? Solo si insertamos "app".
startsWith("ap"): a→p encontrado ✓

Es como navegar carpetas en un sistema de archivos.`,
    testCases: [
      { 
        input: { 
          operations: ["Trie", "insert", "search", "search", "starts_with", "insert", "search"],
          params: [[], ["apple"], ["apple"], ["app"], ["app"], ["app"], ["app"]]
        }, 
        expected: [null, null, true, false, true, null, true], 
        isHidden: false 
      },
    ],
  },

  'house-robber': {
    id: 'house-robber',
    title: 'House Robber',
    difficulty: 'medium',
    category: 'Dynamic Programming',
    pattern: 'Dynamic Programming',
    functionName: 'rob',
    description: `Eres un ladrón profesional planeando robar casas a lo largo de una calle. Cada casa tiene una cierta cantidad de dinero guardado. La única restricción es que casas adyacentes tienen sistemas de seguridad conectados: si dos casas adyacentes son robadas la misma noche, se activará la alarma.

Dado un array de enteros nums representando el dinero en cada casa, retorna la máxima cantidad que puedes robar sin activar alarmas.`,
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Roba casa 1 ($1) + casa 3 ($3) = $4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Roba casa 1 ($2) + casa 3 ($9) + casa 5 ($1) = $12.' },
    ],
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 400',
    ],
    hints: [
      '💡 Nivel 1: En cada casa decides: robarla o saltarla',
      '💡 Nivel 2: Si robas casa i, no puedes robar i-1',
      '💡 Nivel 3: dp[i] = max(dp[i-1], dp[i-2] + nums[i])',
      '💡 Nivel 4: Solo necesitas los últimos 2 valores (O(1) espacio)',
    ],
    starterCode: `def rob(nums: list[int]) -> int:
    """
    Encuentra el máximo dinero que puedes robar sin alarmas.
    
    Ejemplo:
    >>> rob([1,2,3,1])
    4
    """
    # Tu código aquí
    pass`,
    solutions: [
      {
        title: 'DP con 2 variables',
        approach: 'En cada casa: max(robar esta + prev2, no robar y quedarse con prev1).',
        code: `def rob(nums: list[int]) -> int:
    if not nums:
        return 0
    if len(nums) == 1:
        return nums[0]
    
    prev2 = 0  # dp[i-2]
    prev1 = 0  # dp[i-1]
    
    for num in nums:
        current = max(prev1, prev2 + num)
        prev2 = prev1
        prev1 = current
    
    return prev1`,
        complexity: { time: 'O(n)', space: 'O(1)' },
      },
    ],
    whyItWorks: `🏠 En cada casa preguntas: "¿Me conviene más robar ESTA o dejarla?"

Casas: [2, 7, 9, 3, 1]

Casa 1 ($2): Robo $2. Total: 2
Casa 2 ($7): max(robar $7, quedarme con $2) = $7
Casa 3 ($9): max(quedarme con $7, robar $9+$2=$11) = $11
Casa 4 ($3): max(quedarme con $11, robar $3+$7=$10) = $11
Casa 5 ($1): max(quedarme con $11, robar $1+$11=$12) = $12

Respuesta: $12

La clave: cada decisión solo depende de las 2 anteriores.`,
    testCases: [
      { input: { nums: [1,2,3,1] }, expected: 4, isHidden: false },
      { input: { nums: [2,7,9,3,1] }, expected: 12, isHidden: false },
      { input: { nums: [0] }, expected: 0, isHidden: true },
      { input: { nums: [2,1,1,2] }, expected: 4, isHidden: true },
      { input: { nums: [100] }, expected: 100, isHidden: true },
    ],
  },
};

export default ExercisePage;
