import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  Send,
  MessageSquare,
  CheckCircle,
  AlertTriangle,
  Trophy,
  Brain,
  Lightbulb,
  FileText,
  Target,
  BookOpen,
  Mic,
  HelpCircle,
  PenLine,
  Timer,
  CheckSquare
} from 'lucide-react';
import Editor from '@monaco-editor/react';
import { Card, Button, DifficultyBadge } from '../components/ui';
import { API_BASE_URL } from '../config';

/**
 * InterviewModePage
 * =================
 * Simula una entrevista técnica real:
 * - Problema aleatorio o seleccionado
 * - Cronómetro
 * - Sin pistas al inicio
 * - Evaluación final
 * - Feedback detallado
 */
const InterviewModePage: React.FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeLimit, setTimeLimit] = useState(45 * 60); // 45 minutos
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [currentProblem, setCurrentProblem] = useState<any>(null);
  const [code, setCode] = useState('');
  const [thinking, setThinking] = useState('');
  const [pseudocode, setPseudocode] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [feedback, setFeedback] = useState<any>(null);
  const [showTips, setShowTips] = useState(true);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [isRunning, setIsRunning] = useState(false); // Ejecutando código (sin enviar)
  const [runResults, setRunResults] = useState<any[] | null>(null); // Resultados de ejecución parcial
  const [showRunPanel, setShowRunPanel] = useState(false);
  
  // Sistema de hints
  const [hintsUsed, setHintsUsed] = useState<number[]>([]); // índices de hints usados
  const [showHintConfirm, setShowHintConfirm] = useState(false);

  // Tips de comunicacion para entrevistas (Metodo Feynman)
  const communicationTips = [
    {
      icon: Mic,
      title: 'Habla en voz alta',
      description: 'El entrevistador quiere ver tu proceso de pensamiento, no solo el resultado.'
    },
    {
      icon: HelpCircle,
      title: 'Clarifica requisitos ANTES de codificar',
      description: 'Pregunta sobre casos de borde, tamano del input, y restricciones.'
    },
    {
      icon: PenLine,
      title: 'Escribe pseudocodigo primero',
      description: '2 minutos aqui ahorran 10 despues. Planifica antes de implementar.'
    },
    {
      icon: Timer,
      title: 'Si te atascas, comunica',
      description: 'Di "Estoy pensando en..." en lugar de quedarte en silencio.'
    },
    {
      icon: CheckSquare,
      title: 'Prueba mentalmente antes de ejecutar',
      description: 'Recorre tu codigo con un ejemplo simple antes de correrlo.'
    },
  ];

  // Timer
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isStarted && !isPaused && !isFinished) {
      interval = setInterval(() => {
        setTimeElapsed(prev => {
          if (prev >= timeLimit) {
            handleFinish();
            return prev;
          }
          return prev + 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isStarted, isPaused, isFinished, timeLimit]);

  // Scroll to top when interview starts
  useEffect(() => {
    if (isStarted) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isStarted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    const remaining = timeLimit - timeElapsed;
    if (remaining < 5 * 60) return 'text-red-400';
    if (remaining < 15 * 60) return 'text-yellow-400';
    return 'text-primary-400';
  };

  const handleStart = () => {
    // Seleccionar problema aleatorio según dificultad
    const problems = interviewProblems.filter(p => p.difficulty === selectedDifficulty);
    const randomProblem = problems[Math.floor(Math.random() * problems.length)];
    
    setCurrentProblem(randomProblem);
    setCode(randomProblem.starterCode);
    setIsStarted(true);
    setTimeElapsed(0);
    setHintsUsed([]);
  };

  const handleRequestHint = () => {
    setShowHintConfirm(true);
  };

  const handleConfirmHint = () => {
    const nextHintIndex = hintsUsed.length;
    if (currentProblem?.hints && nextHintIndex < currentProblem.hints.length) {
      setHintsUsed([...hintsUsed, nextHintIndex]);
    }
    setShowHintConfirm(false);
  };

  const getHintPenalty = (_hintIndex: number) => {
    // Cada pista cuesta 10 puntos
    return 10;
  };

  const getTotalHintPenalty = () => {
    return hintsUsed.reduce((total, idx) => total + getHintPenalty(idx), 0);
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
  };

  // Ejecutar código contra tests visibles SIN terminar la entrevista
  const handleRunCode = async () => {
    setIsRunning(true);
    setShowRunPanel(true);
    setRunResults(null);

    try {
      // Solo enviar test cases visibles
      const visibleTests = currentProblem?.testCases
        ?.filter((tc: any) => !tc.isHidden)
        ?.map((tc: any) => ({
          input: tc.input,
          expected: tc.expected,
          isHidden: false
        })) || [];

      const response = await fetch(`${API_BASE_URL}/api/v1/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          functionName: currentProblem?.functionName || extractFunctionName(code),
          testCases: visibleTests,
          timeout: 5
        })
      });

      if (!response.ok) {
        throw new Error(`Error del servidor: ${response.status}`);
      }

      const result = await response.json();
      const results = result.testResults.map((tr: any) => ({
        passed: tr.passed,
        input: JSON.stringify(tr.input),
        expected: JSON.stringify(tr.expected),
        actual: JSON.stringify(tr.actual),
        error: tr.error
      }));
      setRunResults(results);
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      setRunResults([{ passed: false, input: '-', expected: '-', actual: '-', error: errorMsg }]);
    } finally {
      setIsRunning(false);
    }
  };

  const handleFinish = async () => {
    console.log('🚀 Iniciando envío de código...');
    setIsFinished(true);

    try {
      // Preparar test cases para el backend
      const testCasesForBackend = currentProblem?.testCases?.map((tc: any) => ({
        input: tc.input,
        expected: tc.expected,
        isHidden: tc.isHidden || false
      })) || [];

      console.log('📤 Enviando petición al backend:', {
        code: code.substring(0, 100) + '...',
        functionName: currentProblem?.functionName || extractFunctionName(code),
        testCasesCount: testCasesForBackend.length
      });

      const response = await fetch(`${API_BASE_URL}/api/v1/code/run`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: code,
          functionName: currentProblem?.functionName || extractFunctionName(code),
          testCases: testCasesForBackend,
          timeout: 5
        })
      });

      console.log('📥 Respuesta del backend:', response.status, response.statusText);

      if (!response.ok) {
        throw new Error(`Error de conexión con el servidor: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('✅ Resultados del backend:', result);

      // Mapear resultados del backend
      const results = result.testResults.map((tr: any) => ({
        passed: tr.passed,
        input: JSON.stringify(tr.input),
        expected: tr.expected === "hidden" ? "[Oculto]" : JSON.stringify(tr.expected),
        actual: JSON.stringify(tr.actual),
        error: tr.error
      }));

      setTestResults(results);

      // Generar feedback con resultados reales
      setFeedback(generateFeedback(code, thinking, timeElapsed, timeLimit, pseudocode, hintsUsed, currentProblem?.starterCode, results));
    } catch (error: unknown) {
      console.error('Error ejecutando código:', error);
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido';
      // Mostrar error al usuario
      setFeedback({
        score: 0,
        correctness: 0,
        efficiency: 0,
        codeQuality: 0,
        timeManagement: 0,
        strengths: [],
        improvements: [`Error al ejecutar el código: ${errorMsg}. Revisa la conexión con el servidor.`],
        interviewTips: ['Asegúrate de que el servidor backend esté ejecutándose.'],
        recommendation: 'Hubo un error técnico. Inténtalo de nuevo.',
        totalHintPenalty: getTotalHintPenalty(),
        hintsUsed: hintsUsed.length,
        timeElapsed: timeElapsed
      });
      setIsFinished(false); // Permitir reintentar
    }
  };

  // Extraer nombre de función del código
  const extractFunctionName = (code: string): string => {
    const match = code.match(/def\s+(\w+)\s*\(/);
    return match ? match[1] : 'solution';
  };

  const handleReset = () => {
    setIsStarted(false);
    setIsPaused(false);
    setTimeElapsed(0);
    setCurrentProblem(null);
    setCode('');
    setThinking('');
    setPseudocode('');
    setIsFinished(false);
    setFeedback(null);
    setHintsUsed([]);
    setShowHintConfirm(false);
    setTestResults([]);
    setRunResults(null);
    setShowRunPanel(false);
    setIsRunning(false);
  };

  // Vista de configuración inicial
  if (!isStarted) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-12">
            <Brain className="text-primary-400 mx-auto mb-4" size={64} />
            <h1 className="text-4xl font-bold text-white mb-4">
              Modo Entrevista
            </h1>
            <p className="text-dark-400 text-lg">
              Simula una entrevista técnica real. Practica bajo presión de tiempo
              y recibe feedback detallado sobre tu desempeño.
            </p>
          </div>

          <Card className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-6">Configuración</h2>
            
            {/* Difficulty selection */}
            <div className="mb-6">
              <label className="block text-dark-400 mb-3">Dificultad del problema</label>
              <div className="flex gap-3">
                {(['easy', 'medium', 'hard'] as const).map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setSelectedDifficulty(diff)}
                    className={`
                      flex-1 py-3 rounded-lg font-medium transition-all
                      ${selectedDifficulty === diff 
                        ? diff === 'easy' 
                          ? 'bg-green-500/20 text-green-400 border-2 border-green-500'
                          : diff === 'medium'
                            ? 'bg-yellow-500/20 text-yellow-400 border-2 border-yellow-500'
                            : 'bg-red-500/20 text-red-400 border-2 border-red-500'
                        : 'bg-dark-700 text-dark-400 border-2 border-transparent hover:border-dark-500'
                      }
                    `}
                  >
                    {diff === 'easy' ? 'Fácil' : diff === 'medium' ? 'Medio' : 'Difícil'}
                  </button>
                ))}
              </div>
            </div>

            {/* Time selection */}
            <div className="mb-6">
              <label className="block text-dark-400 mb-3">Tiempo límite</label>
              <div className="flex gap-3">
                {[
                  { value: 30 * 60, label: '30 min' },
                  { value: 45 * 60, label: '45 min' },
                  { value: 60 * 60, label: '60 min' },
                ].map(({ value, label }) => (
                  <button
                    key={value}
                    onClick={() => setTimeLimit(value)}
                    className={`
                      flex-1 py-3 rounded-lg font-medium transition-all
                      ${timeLimit === value 
                        ? 'bg-secondary-500/20 text-secondary-400 border-2 border-secondary-500'
                        : 'bg-dark-700 text-dark-400 border-2 border-transparent hover:border-dark-500'
                      }
                    `}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Rules */}
            <div className="bg-dark-900 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-white font-medium flex items-center gap-2">
                  <Lightbulb className="text-accent-400" size={18} />
                  Tips de Comunicación (¡Lee antes de empezar!)
                </h3>
                <button
                  onClick={() => setShowTips(!showTips)}
                  className="text-dark-400 text-sm hover:text-white"
                >
                  {showTips ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
              
              {showTips && (
                <div className="space-y-3">
                  {communicationTips.map((tip, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-dark-800 rounded-lg">
                      <tip.icon className="text-primary-400 flex-shrink-0 mt-0.5" size={20} />
                      <div>
                        <p className="text-white font-medium text-sm">{tip.title}</p>
                        <p className="text-dark-400 text-xs mt-0.5">{tip.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="mt-4 p-3 bg-accent-500/10 border border-accent-500/30 rounded-lg">
                <p className="text-accent-400 text-sm flex items-center gap-2">
                  <Brain size={16} />
                  <strong>Método Feynman:</strong> Si no puedes explicar tu solución de forma simple, probablemente no la entiendes bien.
                </p>
              </div>
            </div>

            <Button variant="primary" className="w-full" onClick={handleStart}>
              <Play size={20} />
              Comenzar Entrevista
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  // Vista de feedback final
  if (isFinished && feedback) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="text-center mb-8">
            <Trophy className={`mx-auto mb-4 ${feedback.score >= 70 ? 'text-primary-400' : 'text-yellow-400'}`} size={64} />
            <h1 className="text-4xl font-bold text-white mb-2">
              Entrevista Completada
            </h1>
            <p className="text-white font-medium mb-1">{currentProblem?.title}</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              <DifficultyBadge difficulty={currentProblem?.difficulty} />
              {currentProblem?.category && (
                <span className="px-2 py-0.5 bg-secondary-500/15 text-secondary-400 text-xs rounded-full border border-secondary-500/30">
                  {currentProblem.category}
                </span>
              )}
              {currentProblem?.pattern && (
                <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 text-xs rounded-full border border-primary-500/30">
                  {currentProblem.pattern}
                </span>
              )}
            </div>
            <p className="text-dark-400">
              Tiempo: {formatTime(timeElapsed)} / {formatTime(timeLimit)}
            </p>
          </div>

          {/* Score */}
          <Card className="mb-6">
            <div className="text-center">
              <div className="text-6xl font-bold mb-2">
                <span className={feedback.score >= 70 ? 'text-primary-400' : feedback.score >= 50 ? 'text-yellow-400' : 'text-red-400'}>
                  {feedback.score}
                </span>
                <span className="text-dark-500">/100</span>
              </div>
              
              {/* Mostrar desglose si hubo penalización */}
              {feedback.totalHintPenalty > 0 && (
                <div className="mt-2 text-sm">
                  <span className="text-dark-500">Score base: {feedback.rawScore}</span>
                  <span className="text-accent-400 ml-2">- {feedback.totalHintPenalty} pts ({feedback.hintsUsed} pistas)</span>
                </div>
              )}
              
              <p className="text-dark-400 mt-2">{feedback.recommendation}</p>
            </div>
          </Card>

          {/* Detailed scores */}
          <Card className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Evaluación Detallada</h3>
            <p className="text-dark-500 text-xs mb-4">Ponderación: Correctitud 40% | Eficiencia 25% | Calidad 20% | Tiempo 15%</p>
            <div className="space-y-4">
              {[
                { label: 'Correctitud', value: feedback.correctness, icon: CheckCircle },
                { label: 'Eficiencia', value: feedback.efficiency, icon: Target },
                { label: 'Calidad de Código', value: feedback.codeQuality, icon: Brain },
                { label: 'Manejo del Tiempo', value: feedback.timeManagement, icon: Clock },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-4">
                  <item.icon className="text-dark-500" size={20} />
                  <span className="text-dark-300 w-36">{item.label}</span>
                  <div className="flex-1 h-2 bg-dark-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        item.value >= 70 ? 'bg-primary-500' : item.value >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.value}%` }}
                    />
                  </div>
                  <span className="text-dark-400 w-12 text-right">{item.value}%</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Card className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="text-secondary-400" size={20} />
                Resultados de Tests
                <span className="text-sm font-normal text-dark-400 ml-2">
                  {testResults.filter((r: any) => r.passed).length}/{testResults.length} pasados
                </span>
              </h3>
              <div className="space-y-2">
                {testResults.map((result: any, i: number) => (
                  <div key={i} className={`p-3 rounded-lg border text-sm ${
                    result.passed 
                      ? 'bg-green-500/10 border-green-500/30' 
                      : 'bg-red-500/10 border-red-500/30'
                  }`}>
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <CheckCircle size={16} className="text-green-400 flex-shrink-0" />
                      ) : (
                        <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
                      )}
                      <span className={`font-medium ${result.passed ? 'text-green-400' : 'text-red-400'}`}>
                        Test {i + 1}: {result.passed ? 'Pasado' : 'Fallido'}
                      </span>
                      {result.expected === '[Oculto]' && (
                        <span className="text-dark-500 text-xs">(oculto)</span>
                      )}
                    </div>
                    {!result.passed && result.expected !== '[Oculto]' && (
                      <div className="mt-2 ml-6 space-y-1 text-xs text-dark-400">
                        {result.error ? (
                          <p className="text-red-300 font-mono">{result.error}</p>
                        ) : (
                          <>
                            <p>Input: <span className="text-dark-300 font-mono">{result.input}</span></p>
                            <p>Esperado: <span className="text-green-300 font-mono">{result.expected}</span></p>
                            <p>Obtenido: <span className="text-red-300 font-mono">{result.actual}</span></p>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Interview Tips - Coaching section */}
          {feedback.interviewTips && feedback.interviewTips.length > 0 && (
            <Card className="mb-6 bg-accent-500/5 border border-accent-500/20">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Lightbulb className="text-accent-400" size={20} />
                Tips para Entrevistas Reales
              </h3>
              <div className="space-y-3">
                {feedback.interviewTips.map((tip: string, i: number) => (
                  <p key={i} className="text-dark-300 text-sm leading-relaxed">
                    {tip}
                  </p>
                ))}
              </div>
            </Card>
          )}

          {/* Strengths & Improvements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <CheckCircle className="text-primary-400" size={20} />
                Fortalezas
              </h3>
              <ul className="space-y-2">
                {feedback.strengths.map((s: string, i: number) => (
                  <li key={i} className="text-dark-300 text-sm flex items-start gap-2">
                    <span className="text-primary-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>

            <Card>
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertTriangle className="text-yellow-400" size={20} />
                Áreas de Mejora
              </h3>
              <ul className="space-y-2">
                {feedback.improvements.map((s: string, i: number) => (
                  <li key={i} className="text-dark-300 text-sm flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          {/* Actions */}
          <div className="flex gap-4 justify-center">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw size={18} />
              Nueva Entrevista
            </Button>
            <Link to="/practice">
              <Button variant="primary">
                Practicar Más
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Vista de entrevista activa
  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header with timer */}
      <div className="border-b border-dark-700 bg-dark-800/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-white">
                {currentProblem?.title}
              </h1>
              <DifficultyBadge difficulty={currentProblem?.difficulty} />
            </div>

            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className={`flex items-center gap-2 font-mono text-2xl ${getTimeColor()}`}>
                <Clock size={24} />
                {formatTime(timeLimit - timeElapsed)}
              </div>

              {/* Controls */}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handlePause}
              >
                {isPaused ? <Play size={18} /> : <Pause size={18} />}
              </Button>

              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleRunCode}
                disabled={isRunning || isFinished}
                className={isRunning ? "opacity-50" : ""}
              >
                <Play size={18} />
                {isRunning ? "Ejecutando..." : "Ejecutar"}
              </Button>

              <Button 
                variant="primary" 
                size="sm"
                onClick={handleFinish}
                disabled={isFinished}
                className={isFinished ? "opacity-50 cursor-not-allowed" : ""}
              >
                <Send size={18} />
                {isFinished ? "Enviando..." : "Enviar"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Paused overlay */}
      {isPaused && (
        <div className="fixed inset-0 bg-dark-900/90 z-50 flex items-center justify-center">
          <Card className="text-center p-8">
            <Pause className="text-secondary-400 mx-auto mb-4" size={48} />
            <h2 className="text-2xl font-bold text-white mb-4">Entrevista Pausada</h2>
            <p className="text-dark-400 mb-6">
              El cronómetro está detenido. Continúa cuando estés listo.
            </p>
            <Button variant="primary" onClick={handlePause}>
              <Play size={18} />
              Continuar
            </Button>
          </Card>
        </div>
      )}

      {/* Main content */}
      <div className="flex h-[calc(100vh-60px)]">
        {/* Problem description - 25% */}
        <div className="w-1/4 border-r border-dark-700 overflow-y-auto p-4">
          <div className="space-y-4">
            <section>
              <h2 className="text-md font-semibold text-white mb-2 flex items-center gap-2">
                <Target size={16} className="text-primary-400" />
                Problema
              </h2>
              {/* Tags de categoría y patrón */}
              {(currentProblem?.category || currentProblem?.pattern) && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {currentProblem?.category && (
                    <span className="px-2 py-0.5 bg-secondary-500/15 text-secondary-400 text-xs rounded-full border border-secondary-500/30">
                      {currentProblem.category}
                    </span>
                  )}
                  {currentProblem?.pattern && (
                    <span className="px-2 py-0.5 bg-primary-500/15 text-primary-400 text-xs rounded-full border border-primary-500/30">
                      {currentProblem.pattern}
                    </span>
                  )}
                </div>
              )}
              <p className="text-dark-300 text-sm leading-relaxed whitespace-pre-line">
                {currentProblem?.description}
              </p>
            </section>

            <section>
              <h2 className="text-md font-semibold text-white mb-2">Ejemplos</h2>
              <div className="space-y-3">
                {currentProblem?.examples.map((ex: any, i: number) => (
                  <Card key={i} className="bg-dark-900 p-3">
                    <div className="space-y-1 text-xs">
                      <div>
                        <span className="text-dark-500">Input:</span>
                        <code className="block text-secondary-400 font-mono mt-0.5">{ex.input}</code>
                      </div>
                      <div>
                        <span className="text-dark-500">Output:</span>
                        <code className="block text-primary-400 font-mono mt-0.5">{ex.output}</code>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-md font-semibold text-white mb-2">Restricciones</h2>
              <ul className="space-y-1">
                {currentProblem?.constraints.map((c: string, i: number) => (
                  <li key={i} className="text-dark-400 text-xs font-mono">• {c}</li>
                ))}
              </ul>
            </section>

            {/* Sección de Hints */}
            <section className="border-t border-dark-700 pt-4">
              <h2 className="text-md font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb size={16} className="text-accent-400" />
                Pistas
                {hintsUsed.length > 0 && (
                  <span className="text-xs text-dark-500">
                    ({hintsUsed.length}/{currentProblem?.hints?.length || 3} usadas)
                  </span>
                )}
              </h2>

              {/* Hints ya revelados */}
              {hintsUsed.length > 0 && (
                <div className="space-y-2 mb-3">
                  {hintsUsed.map((hintIdx) => (
                    <div key={hintIdx} className="p-2 bg-accent-500/10 border border-accent-500/30 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-accent-400 text-xs font-medium">
                          Pista {hintIdx + 1}
                        </span>
                        <span className="text-dark-500 text-xs">
                          (-{getHintPenalty(hintIdx)} pts)
                        </span>
                      </div>
                      <p className="text-dark-300 text-xs">
                        {currentProblem?.hints?.[hintIdx]}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Botón para pedir hint */}
              {currentProblem?.hints && hintsUsed.length < currentProblem.hints.length ? (
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full bg-accent-500/20 border-2 border-accent-500/50 hover:bg-accent-500/30 text-accent-300 font-semibold shadow-lg"
                  onClick={handleRequestHint}
                >
                  <HelpCircle size={16} className="mr-2" />
                  Pedir pista (-{getHintPenalty(hintsUsed.length)} pts)
                </Button>
              ) : hintsUsed.length > 0 ? (
                <p className="text-dark-500 text-xs text-center bg-dark-800/50 p-2 rounded">
                  Has usado todas las pistas disponibles
                </p>
              ) : null}

              {/* Penalización total */}
              {hintsUsed.length > 0 && (
                <p className="text-dark-500 text-xs mt-2 text-center">
                  Penalización total: -{getTotalHintPenalty()} puntos
                </p>
              )}
            </section>
          </div>
        </div>

        {/* Hint confirmation modal */}
        {showHintConfirm && (
          <div className="fixed inset-0 bg-dark-900/80 z-50 flex items-center justify-center">
            <Card className="max-w-md p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-accent-500/20 flex items-center justify-center">
                  <Lightbulb className="text-accent-400" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">¿Pedir pista?</h3>
                  <p className="text-dark-400 text-sm">
                    Esto restará <span className="text-accent-400 font-medium">{getHintPenalty(hintsUsed.length)} puntos</span> de tu score final
                  </p>
                </div>
              </div>
              
              <p className="text-dark-300 text-sm mb-4">
                En entrevistas reales, pedir pistas es válido y muestra que sabes cuándo pedir ayuda. 
                Sin embargo, es mejor intentar primero por tu cuenta.
              </p>

              <div className="flex gap-3">
                <Button
                  variant="ghost"
                  className="flex-1"
                  onClick={() => setShowHintConfirm(false)}
                >
                  Seguir intentando
                </Button>
                <Button
                  variant="primary"
                  className="flex-1 bg-accent-500 hover:bg-accent-600"
                  onClick={handleConfirmHint}
                >
                  <Lightbulb size={16} />
                  Ver pista
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Whiteboard/Notes - 25% (Pizarra de Notas - Método Feynman) */}
        <div className="w-1/4 border-r border-dark-700 flex flex-col bg-dark-850">
          {/* Pseudocode section */}
          <div className="flex-1 p-4 border-b border-dark-700">
            <label className="block text-dark-400 text-sm mb-2 flex items-center gap-2">
              <FileText size={14} className="text-secondary-400" />
              Pseudocodigo (Planifica primero)
            </label>
            <textarea
              className="input resize-none text-sm font-mono h-[calc(100%-2rem)]"
              placeholder={`1. Entender el problema
2. Identificar el patrón
3. Definir estructura de datos
4. Escribir los pasos
5. Complejidad esperada: O(?)`}
              value={pseudocode}
              onChange={(e) => setPseudocode(e.target.value)}
            />
          </div>

          {/* Thinking out loud section */}
          <div className="flex-1 p-4">
            <label className="block text-dark-400 text-sm mb-2 flex items-center gap-2">
              <MessageSquare size={14} className="text-accent-400" />
              Piensa en voz alta
            </label>
            <textarea
              className="input resize-none text-sm h-[calc(100%-2rem)]"
              placeholder={`Escribe aquí como si hablaras con el entrevistador:

"Estoy pensando en usar un hash map porque..."
"El caso de borde sería cuando..."
"La complejidad de mi solución es O(n) porque..."`}
              value={thinking}
              onChange={(e) => setThinking(e.target.value)}
            />
          </div>

          {/* Quick tips reminder */}
          <div className="p-3 bg-dark-800 border-t border-dark-700">
            <p className="text-dark-500 text-xs flex items-center gap-2">
              <Lightbulb size={12} className="text-accent-400" />
              Tip: Escribe tu razonamiento antes de codificar
            </p>
          </div>
        </div>

        {/* Editor - 50% */}
        <div className="w-1/2 flex flex-col">
          {/* Editor header */}
          <div className="px-4 py-2 border-b border-dark-700 bg-dark-800 flex items-center justify-between">
            <span className="text-dark-400 text-sm flex items-center gap-2">
              <BookOpen size={14} />
              Python 3
            </span>
            <span className="text-dark-500 text-xs">
              Tiempo restante: <span className={getTimeColor()}>{formatTime(timeLimit - timeElapsed)}</span>
            </span>
          </div>

          {/* Editor */}
          <div className={showRunPanel ? "h-[60%]" : "flex-1"}>
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
              }}
            />
          </div>

          {/* Panel de resultados de ejecución */}
          {showRunPanel && (
            <div className="h-[40%] border-t border-dark-700 bg-dark-800 overflow-y-auto">
              <div className="flex items-center justify-between px-4 py-2 border-b border-dark-700">
                <span className="text-dark-300 text-sm font-medium flex items-center gap-2">
                  <Target size={14} className="text-secondary-400" />
                  Resultados de Ejecución
                </span>
                <button
                  onClick={() => setShowRunPanel(false)}
                  className="text-dark-500 hover:text-dark-300 text-xs"
                >
                  Cerrar
                </button>
              </div>
              <div className="p-3 space-y-2">
                {isRunning ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
                    <span className="ml-3 text-dark-400 text-sm">Ejecutando tests...</span>
                  </div>
                ) : runResults ? (
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`text-sm font-medium ${
                        runResults.every((r: any) => r.passed) ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {runResults.filter((r: any) => r.passed).length}/{runResults.length} tests pasados
                      </span>
                    </div>
                    {runResults.map((result: any, i: number) => (
                      <div key={i} className={`p-2 rounded-lg border text-xs ${
                        result.passed 
                          ? 'bg-green-500/10 border-green-500/30' 
                          : 'bg-red-500/10 border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          {result.passed ? (
                            <CheckCircle size={14} className="text-green-400" />
                          ) : (
                            <AlertTriangle size={14} className="text-red-400" />
                          )}
                          <span className={result.passed ? 'text-green-400' : 'text-red-400'}>
                            Test {i + 1}: {result.passed ? 'Pasado' : 'Fallido'}
                          </span>
                        </div>
                        {!result.passed && (
                          <div className="ml-6 space-y-1 text-dark-400">
                            {result.error ? (
                              <p className="text-red-300 font-mono">{result.error}</p>
                            ) : (
                              <>
                                <p>Input: <span className="text-dark-300 font-mono">{result.input}</span></p>
                                <p>Esperado: <span className="text-green-300 font-mono">{result.expected}</span></p>
                                <p>Obtenido: <span className="text-red-300 font-mono">{result.actual}</span></p>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateFeedback(code: string, thinking: string, timeElapsed: number, timeLimit: number, pseudocode?: string, hintsUsed: number[] = [], starterCode?: string, testResults?: any[]) {
  // ============================================
  // EVALUACIÓN INTELIGENTE DE CÓDIGO
  // ============================================
  
  const starterLength = starterCode?.length || 50;
  const codeWritten = code.slice(starterLength); // Solo el código que escribió el usuario
  
  const hasThinking = thinking.length > 50;
  const hasPseudocode = (pseudocode?.length || 0) > 30;
  const timeUsedPercent = (timeElapsed / timeLimit) * 100;
  
  // Calcular penalización por hints
  const hintPenalties = [10, 10, 10, 10]; // 10 puntos por pista
  const totalHintPenalty = hintsUsed.reduce((total, idx) => total + (hintPenalties[idx] || 10), 0);

  // ============================================
  // ANÁLISIS DE CALIDAD DEL CÓDIGO
  // ============================================
  
  const codeAnalysis = analyzeCodeQuality(codeWritten, code);
  
  // DEBUG
  console.log('📊 Code Analysis:', codeAnalysis);

  // ============================================
  // CALCULAR SCORES BASADOS EN ANÁLISIS O TESTS REALES
  // ============================================
  
  let correctness: number = 0;
  let efficiency: number = 0;
  let codeQuality: number = 0;
  let timeManagement: number = 50;

  // Si tenemos resultados de tests reales, usarlos para correctness
  if (testResults && testResults.length > 0) {
    const testsPassed = testResults.filter(r => r.passed).length;
    const totalTests = testResults.length;
    correctness = Math.floor((testsPassed / totalTests) * 100);
    
    if (correctness === 100) {
      // Todos los tests pasan: evaluar calidad real del código y proceso
      
      // Eficiencia: analizar patrones algorítmicos usados
      const efficiencyBase = 70; // Base por pasar todos los tests
      const patternBonus = codeAnalysis.patternScore * 20; // Hasta +20 por patrones óptimos
      const dsBonus = codeAnalysis.hasDataStructure ? 10 : 0; // +10 por usar estructuras adecuadas
      efficiency = Math.min(100, Math.floor(efficiencyBase + patternBonus + dsBonus));
      
      // Calidad de código: evaluar estructura, legibilidad
      const qualityBase = 65;
      const structureBonus = codeAnalysis.structureScore * 15;
      const syntaxBonus = codeAnalysis.syntaxScore * 10;
      const pseudocodeBonus = hasPseudocode ? 5 : 0;
      const thinkingBonus = hasThinking ? 5 : 0;
      codeQuality = Math.min(100, Math.floor(qualityBase + structureBonus + syntaxBonus + pseudocodeBonus + thinkingBonus));
      
      // Manejo del tiempo: evaluar según porcentaje usado
      if (timeUsedPercent <= 40) {
        timeManagement = 100; // Excelente manejo del tiempo
      } else if (timeUsedPercent <= 60) {
        timeManagement = 90; // Buen manejo
      } else if (timeUsedPercent <= 80) {
        timeManagement = 75; // Aceptable
      } else {
        timeManagement = 60; // Apurado
      }
    } else {
      // Cuando NO pasan todos los tests, verificar si se escribió código
      if (codeAnalysis.isEmpty) {
        // No se escribió código: score muy bajo
        efficiency = 0;
        codeQuality = 0;
        timeManagement = 50;
      } else {
        // Se escribió código pero no pasa todos los tests: usar heurística
        if (codeAnalysis.isGarbage) {
          efficiency = Math.floor(Math.random() * 10) + 5;
          codeQuality = Math.floor(Math.random() * 10) + 5;
          timeManagement = 50;
        } else if (codeAnalysis.isMinimal) {
          efficiency = 10 + codeAnalysis.patternScore * 20;
          codeQuality = 15 + codeAnalysis.syntaxScore * 20;
          timeManagement = 70;
        } else {
          efficiency = 20 + codeAnalysis.patternScore * 30 + codeAnalysis.structureScore * 10;
          codeQuality = 25 + codeAnalysis.syntaxScore * 25 + codeAnalysis.structureScore * 15;
          timeManagement = timeUsedPercent < 20 ? 90 : timeUsedPercent < 70 ? 85 : 70;
        }

        efficiency = Math.min(100, Math.floor(efficiency));
        codeQuality = Math.min(100, Math.floor(codeQuality));
      }
    }
  } else {
    // Fallback al análisis heurístico completo cuando no hay tests
    const codeAnalysis = analyzeCodeQuality(codeWritten, code);
    
    if (codeAnalysis.isGarbage) {
      correctness = Math.floor(Math.random() * 5) + 5;
      efficiency = Math.floor(Math.random() * 5) + 5;
      codeQuality = Math.floor(Math.random() * 5) + 5;
      timeManagement = 50;
    } else if (codeAnalysis.isEmpty) {
      correctness = 0;
      efficiency = 0;
      codeQuality = 0;
      timeManagement = 50;
    } else if (codeAnalysis.isMinimal) {
      correctness = 15 + codeAnalysis.structureScore * 15;
      efficiency = 10 + codeAnalysis.patternScore * 20;
      codeQuality = 15 + codeAnalysis.syntaxScore * 20;
      timeManagement = 70;
    } else {
      correctness = 35 + codeAnalysis.structureScore * 30 + codeAnalysis.patternScore * 20;
      efficiency = 30 + codeAnalysis.patternScore * 35 + codeAnalysis.structureScore * 15;
      codeQuality = 35 + codeAnalysis.syntaxScore * 30 + codeAnalysis.structureScore * 20;
      timeManagement = 70;
    }

    correctness = Math.min(100, Math.floor(correctness));
    efficiency = Math.min(100, Math.floor(efficiency));
    codeQuality = Math.min(100, Math.floor(codeQuality));
  }

  // Limitar a 100
  correctness = Math.min(100, Math.floor(correctness));
  efficiency = Math.min(100, Math.floor(efficiency));
  codeQuality = Math.min(100, Math.floor(codeQuality));
  timeManagement = Math.min(100, Math.floor(timeManagement));

  // Score final ponderado: correctitud es lo más importante
  // Correctitud 40%, Eficiencia 25%, Calidad 20%, Tiempo 15%
  let rawScore: number;
  let score: number;
  
  if (codeAnalysis.isEmpty) {
    rawScore = 0;
    score = Math.max(0, 5 - totalHintPenalty);
  } else {
    rawScore = Math.floor(
      correctness * 0.40 + 
      efficiency * 0.25 + 
      codeQuality * 0.20 + 
      timeManagement * 0.15
    );
    score = Math.max(0, rawScore - totalHintPenalty);
  }

  // ============================================
  // GENERAR FEEDBACK CONTEXTUAL
  // ============================================
  
  const strengths: string[] = [];
  const improvements: string[] = [];
  const interviewTips: string[] = [];

  // Fortalezas
  if (codeAnalysis.isGarbage) {
    // Nada positivo que decir
  } else if (codeAnalysis.isEmpty) {
    if (hasPseudocode) strengths.push('Intentaste planificar con pseudocódigo');
    if (hasThinking) strengths.push('Documentaste tu proceso de pensamiento');
  } else {
    if (codeAnalysis.hasFunction) strengths.push('Estructura de función correcta');
    if (codeAnalysis.hasLoop) strengths.push('Uso de iteración');
    if (codeAnalysis.hasConditional) strengths.push('Lógica condicional implementada');
    if (codeAnalysis.hasDataStructure) strengths.push(`Uso de estructuras de datos (${codeAnalysis.dataStructuresUsed.join(', ')})`);
    if (codeAnalysis.hasReturn) strengths.push('Retorna un resultado');
    if (codeAnalysis.patternScore > 0.5) strengths.push('Buen uso de patrones algorítmicos');
    if (timeUsedPercent >= 20 && timeUsedPercent <= 70) strengths.push('Buen manejo del tiempo');
    if (hasPseudocode) strengths.push('Planificaste antes de codificar');
    if (hasThinking) strengths.push('Documentaste tu razonamiento');
    if (hintsUsed.length === 0 && !codeAnalysis.isMinimal) strengths.push('Resolviste sin usar pistas');
  }

  // Áreas de mejora
  if (codeAnalysis.isGarbage) {
    improvements.push('El código no parece ser válido - escribe código Python real');
    improvements.push('Evita escribir texto aleatorio o caracteres sin sentido');
    improvements.push('Intenta al menos definir la estructura básica de la solución');
  } else if (codeAnalysis.isEmpty) {
    improvements.push('Escribe código - aunque no sea perfecto, intenta una solución');
    improvements.push('Empieza con un enfoque brute force si no ves la solución óptima');
  } else {
    if (!codeAnalysis.hasReturn) improvements.push('Asegúrate de retornar el resultado');
    if (!codeAnalysis.hasLoop && !codeAnalysis.hasRecursion) improvements.push('Considera usar un loop o recursión para iterar');
    if (!codeAnalysis.hasDataStructure) improvements.push('Considera usar estructuras de datos (dict, set) para optimizar');
    if (codeAnalysis.syntaxScore < 0.5) improvements.push('Revisa la sintaxis de tu código');
    improvements.push('Considera casos borde (array vacío, un elemento, duplicados)');
    if (codeAnalysis.patternScore < 0.3) improvements.push('Estudia patrones algorítmicos comunes (two pointers, sliding window, etc.)');
  }

  // Tips de entrevista
  if (codeAnalysis.isGarbage) {
    interviewTips.push('⚠️ En una entrevista real, escribir código sin sentido es peor que no escribir nada. El entrevistador notará inmediatamente que no es código válido.');
  } else if (codeAnalysis.isEmpty) {
    interviewTips.push('⚠️ En una entrevista real, no entregar código es una señal muy negativa. Siempre intenta escribir algo.');
  } else {
    if (!hasPseudocode) {
      interviewTips.push('💡 Escribe pseudocódigo antes de codificar. Los entrevistadores valoran ver tu proceso.');
    }
    if (!hasThinking) {
      interviewTips.push('💡 Practica "pensar en voz alta". El silencio puede interpretarse negativamente.');
    }
    if (hasPseudocode && hasThinking && !codeAnalysis.isMinimal) {
      interviewTips.push('✨ Usaste las herramientas de planificación - excelente hábito.');
    }
    if (hintsUsed.length > 0) {
      interviewTips.push('💡 Pedir pistas está bien en entrevistas reales. Es mejor preguntar que quedarse bloqueado.');
    }
  }

  // Recomendación
  let recommendation: string;
  if (codeAnalysis.isGarbage) {
    recommendation = 'El código enviado no es válido. Enfócate en escribir código Python real que intente resolver el problema.';
  } else if (codeAnalysis.isEmpty) {
    recommendation = 'No enviaste código. Siempre intenta escribir algo - incluso una solución parcial es mejor que nada.';
  } else if (score >= 75) {
    recommendation = '¡Excelente! Tu código demuestra buen entendimiento del problema.';
  } else if (score >= 55) {
    recommendation = 'Buen intento. Enfócate en completar la lógica del algoritmo.';
  } else if (score >= 35) {
    recommendation = 'Buen comienzo. Practica más para mejorar tu implementación.';
  } else {
    recommendation = 'Sigue practicando. Intenta resolver el problema paso a paso.';
  }

  return {
    score,
    rawScore,
    totalHintPenalty,
    hintsUsed: hintsUsed.length,
    correctness,
    efficiency,
    codeQuality,
    timeManagement,
    noCodeWritten: codeAnalysis.isEmpty,
    isGarbage: codeAnalysis.isGarbage,
    strengths: strengths.length > 0 ? strengths : ['Te presentaste al ejercicio - el primer paso es intentarlo'],
    improvements,
    interviewTips,
    recommendation,
    codeAnalysis, // Para debugging
  };
}

// ============================================
// FUNCIÓN DE ANÁLISIS DE CÓDIGO
// ============================================

function analyzeCodeQuality(codeWritten: string, fullCode: string) {
  const trimmedCode = codeWritten.trim();
  
  // Detectar si está vacío
  if (trimmedCode.length < 10) {
    return {
      isEmpty: true,
      isGarbage: false,
      isMinimal: false,
      syntaxScore: 0,
      structureScore: 0,
      patternScore: 0,
      hasFunction: false,
      hasLoop: false,
      hasConditional: false,
      hasReturn: false,
      hasRecursion: false,
      hasDataStructure: false,
      dataStructuresUsed: [],
    };
  }

  // ============================================
  // DETECTAR CÓDIGO BASURA/INCOHERENTE
  // ============================================
  
  // Patrón: muchos caracteres repetidos
  const repeatedCharsPattern = /(.)\1{10,}/;
  const hasRepeatedChars = repeatedCharsPattern.test(trimmedCode);
  
  // Patrón: muy pocas palabras clave de Python
  const pythonKeywords = ['def', 'for', 'while', 'if', 'else', 'elif', 'return', 'in', 'range', 'len', 'class', 'import', 'from', 'try', 'except', 'with', 'as', 'and', 'or', 'not', 'True', 'False', 'None'];
  const keywordCount = pythonKeywords.filter(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g');
    return regex.test(fullCode);
  }).length;
  
  // Patrón: ratio de letras vs caracteres especiales muy bajo
  const letters = (trimmedCode.match(/[a-zA-Z]/g) || []).length;
  const total = trimmedCode.length;
  const letterRatio = letters / total;
  
  // Patrón: sin estructura de código (sin dos puntos, sin indentación significativa)
  const hasColons = (trimmedCode.match(/:/g) || []).length >= 1;
  const hasIndentation = /\n\s{2,}/.test(trimmedCode) || /\n\t/.test(trimmedCode);
  
  // Detectar si parece código real o basura
  const isGarbage = (
    hasRepeatedChars ||
    (letterRatio < 0.4 && trimmedCode.length > 30) ||
    (keywordCount < 2 && trimmedCode.length > 50) ||
    (!hasColons && !hasIndentation && trimmedCode.length > 30)
  );

  if (isGarbage) {
    return {
      isEmpty: false,
      isGarbage: true,
      isMinimal: false,
      syntaxScore: 0.1,
      structureScore: 0.1,
      patternScore: 0,
      hasFunction: false,
      hasLoop: false,
      hasConditional: false,
      hasReturn: false,
      hasRecursion: false,
      hasDataStructure: false,
      dataStructuresUsed: [],
    };
  }

  // ============================================
  // ANÁLISIS DE CÓDIGO VÁLIDO
  // ============================================
  
  // Detectar estructuras de código
  const hasFunction = /def\s+\w+\s*\(/.test(fullCode);
  const hasForLoop = /for\s+\w+\s+in\s+/.test(fullCode);
  const hasWhileLoop = /while\s+/.test(fullCode);
  const hasLoop = hasForLoop || hasWhileLoop;
  const hasConditional = /if\s+.+:/.test(fullCode);
  const hasReturn = /return\s+/.test(fullCode);
  const hasRecursion = /def\s+(\w+)\s*\([^)]*\)[\s\S]*\1\s*\(/.test(fullCode);
  
  // Detectar estructuras de datos
  const dataStructuresUsed: string[] = [];
  if (/dict\s*\(|{\s*}|{\s*\w+\s*:/.test(fullCode)) dataStructuresUsed.push('dict/hash map');
  if (/set\s*\(|{\s*\w+\s*,/.test(fullCode)) dataStructuresUsed.push('set');
  if (/\[\s*\]|\[\s*\w+/.test(fullCode)) dataStructuresUsed.push('list/array');
  if (/deque|heapq|heap/.test(fullCode)) dataStructuresUsed.push('queue/heap');
  if (/ListNode|TreeNode|\.next|\.left|\.right/.test(fullCode)) dataStructuresUsed.push('linked list/tree');
  
  const hasDataStructure = dataStructuresUsed.length > 0;
  
  // Detectar patrones algorítmicos
  let patternScore = 0;
  
  // Two pointers
  if (/left.*right|lo.*hi|i.*j.*while|start.*end/.test(fullCode)) patternScore += 0.3;
  
  // Sliding window
  if (/window|slide|left.*right.*while/.test(fullCode)) patternScore += 0.3;
  
  // Hash map lookup
  if (/(in\s+\w+)|(\w+\s*\[.*\]\s*=)|get\s*\(/.test(fullCode) && dataStructuresUsed.includes('dict/hash map')) patternScore += 0.3;
  
  // Binary search
  if (/mid\s*=|\/\/\s*2|binary/.test(fullCode)) patternScore += 0.3;
  
  // Dynamic programming
  if (/dp\s*\[|memo|cache|@lru_cache/.test(fullCode)) patternScore += 0.3;
  
  // BFS/DFS
  if (/queue|stack|visited|bfs|dfs|append.*pop/.test(fullCode)) patternScore += 0.3;
  
  patternScore = Math.min(1, patternScore);
  
  // Calcular scores
  const syntaxScore = Math.min(1, (
    (hasColons ? 0.3 : 0) +
    (hasIndentation ? 0.2 : 0) +
    (keywordCount >= 3 ? 0.3 : keywordCount >= 2 ? 0.2 : 0.1) +
    (letterRatio >= 0.5 ? 0.2 : 0.1)
  ));
  
  const structureScore = Math.min(1, (
    (hasFunction ? 0.2 : 0) +
    (hasLoop ? 0.25 : 0) +
    (hasConditional ? 0.2 : 0) +
    (hasReturn ? 0.2 : 0) +
    (hasDataStructure ? 0.15 : 0)
  ));
  
  // Determinar si es código mínimo
  const isMinimal = trimmedCode.length < 50 || structureScore < 0.4;

  return {
    isEmpty: false,
    isGarbage: false,
    isMinimal,
    syntaxScore,
    structureScore,
    patternScore,
    hasFunction,
    hasLoop,
    hasConditional,
    hasReturn,
    hasRecursion,
    hasDataStructure,
    dataStructuresUsed,
  };
}

// ============================================
// DATA
// ============================================

const interviewProblems = [
  // ==================== EASY ====================
  {
    id: 'two-sum-interview',
    title: 'Two Sum',
    difficulty: 'easy' as const,
    category: 'Hash Table',
    pattern: 'Hashing',
    description: `Dado un array de enteros nums y un entero target, retorna los índices de los dos números que suman target.

Puedes asumir que cada input tiene exactamente una solución, y no puedes usar el mismo elemento dos veces.`,
    examples: [
      { input: 'nums = [2, 7, 11, 15], target = 9', output: '[0, 1]' },
      { input: 'nums = [3, 2, 4], target = 6', output: '[1, 2]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
    ],
    hints: [
      'Piensa en cómo podrías buscar el complemento (target - num) de forma eficiente.',
      'Un Hash Map te permite buscar en O(1). ¿Qué guardarías como key y value?',
      'Itera el array una vez, guardando cada número y su índice. Para cada número, busca si (target - num) ya existe en el map.',
      'Recuerda que no puedes usar el mismo elemento dos veces, así que los índices deben ser diferentes.',
    ],
    starterCode: `def two_sum(nums: list[int], target: int) -> list[int]:
    # Tu código aquí
    pass`,
    functionName: 'two_sum',
    testCases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1], isHidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2], isHidden: false },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1], isHidden: false },
      { input: { nums: [1, 2, 3, 4, 5], target: 10 }, expected: [3, 4], isHidden: true },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected: [2, 4], isHidden: true },
    ],
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'easy' as const,
    category: 'Stack',
    pattern: 'Stack',
    description: `Dado un string s que contiene solo los caracteres '(', ')', '{', '}', '[' y ']', determina si el string es válido.

Un string es válido si:
- Los paréntesis abiertos se cierran con el mismo tipo.
- Los paréntesis abiertos se cierran en el orden correcto.
- Cada paréntesis cerrado tiene un correspondiente abierto del mismo tipo.`,
    examples: [
      { input: 's = "()"', output: 'true' },
      { input: 's = "()[]{}"', output: 'true' },
      { input: 's = "(]"', output: 'false' },
    ],
    constraints: [
      '1 <= s.length <= 10^4',
      's consiste solo de paréntesis',
    ],
    hints: [
      'Piensa en qué estructura de datos es LIFO (Last In, First Out) - perfecta para este problema.',
      'Usa un Stack. Cuando veas un paréntesis abierto, push. Cuando veas uno cerrado, verifica que el top coincida.',
      'Crea un diccionario de matching: {")":"(", "]":"[", "}":"{"}. Para cada char cerrado, verifica que stack.pop() == matching[char].',
    ],
    starterCode: `def is_valid(s: str) -> bool:
    # Tu código aquí
    pass`,
    functionName: 'is_valid',
    testCases: [
      { input: { s: "()" }, expected: true, isHidden: false },
      { input: { s: "()[]{}" }, expected: true, isHidden: false },
      { input: { s: "(]" }, expected: false, isHidden: false },
      { input: { s: "([)]" }, expected: false, isHidden: false },
      { input: { s: "{[]}" }, expected: true, isHidden: true },
      { input: { s: "" }, expected: true, isHidden: true },
      { input: { s: "((()))" }, expected: true, isHidden: true },
    ],
  },
  {
    id: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'easy' as const,
    category: 'Linked List',
    pattern: 'In-Place Reversal',
    description: `Dada la cabeza de una lista enlazada simple, invierte la lista y retorna la nueva cabeza.`,
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]' },
      { input: 'head = [1,2]', output: '[2,1]' },
    ],
    constraints: [
      '0 <= número de nodos <= 5000',
      '-5000 <= Node.val <= 5000',
    ],
    hints: [
      'Necesitas cambiar la dirección de cada puntero next. ¿Qué variables necesitas trackear?',
      'Usa tres punteros: prev (inicialmente None), current (head), y next_temp para guardar el siguiente antes de modificar.',
      'En cada paso: guarda next_temp = current.next, luego current.next = prev, luego prev = current, current = next_temp. Retorna prev.',
    ],
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def reverse_list(head: ListNode) -> ListNode:
    # Tu código aquí
    pass`,
    functionName: 'reverse_list',
    testCases: [
      { input: { head: [1, 2, 3, 4, 5] }, expected: [5, 4, 3, 2, 1], isHidden: false },
      { input: { head: [1, 2] }, expected: [2, 1], isHidden: false },
      { input: { head: [] }, expected: [], isHidden: false },
      { input: { head: [1] }, expected: [1], isHidden: true },
      { input: { head: [1, 2, 3] }, expected: [3, 2, 1], isHidden: true },
    ],
  },
  {
    id: 'max-subarray',
    title: 'Maximum Subarray',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'Dynamic Programming (Kadane)',
    description: `Dado un array de enteros nums, encuentra el subarray contiguo con la suma más grande y retorna esa suma.`,
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6 (subarray [4,-1,2,1])' },
      { input: 'nums = [1]', output: '1' },
    ],
    constraints: [
      '1 <= nums.length <= 10^5',
      '-10^4 <= nums[i] <= 10^4',
    ],
    hints: [
      'Esto es el algoritmo de Kadane. En cada posición, decide: ¿empiezo nuevo subarray o continúo el anterior?',
      'Mantén dos variables: current_sum (suma del subarray actual) y max_sum (mejor encontrada).',
      'current_sum = max(nums[i], current_sum + nums[i]). Si current_sum < 0, es mejor empezar de nuevo.',
    ],
    starterCode: `def max_subarray(nums: list[int]) -> int:
    # Tu código aquí
    pass`,
    functionName: 'max_subarray',
    testCases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected: 6, isHidden: false },
      { input: { nums: [1] }, expected: 1, isHidden: false },
      { input: { nums: [5, 4, -1, 7, 8] }, expected: 23, isHidden: false },
      { input: { nums: [-1] }, expected: -1, isHidden: true },
      { input: { nums: [-2, -1] }, expected: -1, isHidden: true },
      { input: { nums: [1, 2, 3, 4] }, expected: 10, isHidden: true },
    ],
  },
  {
    id: 'merge-sorted-arrays',
    title: 'Merge Sorted Array',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'Two Pointers',
    description: `Dados dos arrays ordenados nums1 y nums2, combínalos en un solo array ordenado.

nums1 tiene espacio suficiente al final para contener todos los elementos.`,
    examples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]' },
    ],
    constraints: [
      'nums1.length == m + n',
      'nums2.length == n',
    ],
    hints: [
      '¿Y si empiezas desde el final en lugar del principio? Así no sobrescribes elementos.',
      'Usa tres punteros: p1 al final de nums1 válidos (m-1), p2 al final de nums2 (n-1), p al final total (m+n-1).',
      'Compara nums1[p1] con nums2[p2], coloca el mayor en nums1[p], decrementa los punteros correspondientes.',
    ],
    starterCode: `def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> None:
    # Modifica nums1 in-place
    pass`,
    functionName: 'merge',
    testCases: [
      { input: { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 }, expected: [1, 2, 2, 3, 5, 6], isHidden: false },
      { input: { nums1: [1], m: 1, nums2: [], n: 0 }, expected: [1], isHidden: false },
      { input: { nums1: [0], m: 0, nums2: [1], n: 1 }, expected: [1], isHidden: false },
      { input: { nums1: [2, 0], m: 1, nums2: [1], n: 1 }, expected: [1, 2], isHidden: true },
      { input: { nums1: [4, 5, 6, 0, 0, 0], m: 3, nums2: [1, 2, 3], n: 3 }, expected: [1, 2, 3, 4, 5, 6], isHidden: true },
    ],
  },
  {
    id: 'best-time-buy-sell',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'easy' as const,
    category: 'Array',
    pattern: 'Greedy / Sliding Window',
    description: `Dado un array prices donde prices[i] es el precio de una acción en el día i.

Quieres maximizar tu ganancia eligiendo un día para comprar y otro día futuro para vender.

Retorna la máxima ganancia posible. Si no hay ganancia posible, retorna 0.`,
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5 (comprar día 2, vender día 5)' },
      { input: 'prices = [7,6,4,3,1]', output: '0 (no hay ganancia posible)' },
    ],
    constraints: [
      '1 <= prices.length <= 10^5',
      '0 <= prices[i] <= 10^4',
    ],
    hints: [
      'Necesitas encontrar el mínimo precio para comprar ANTES del máximo para vender.',
      'Itera una vez: mantén el precio mínimo visto hasta ahora y la ganancia máxima.',
      'Para cada precio: actualiza min_price = min(min_price, price), luego max_profit = max(max_profit, price - min_price).',
    ],
    starterCode: `def max_profit(prices: list[int]) -> int:
    # Tu código aquí
    pass`,
    functionName: 'max_profit',
    testCases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expected: 5, isHidden: false },
      { input: { prices: [7, 6, 4, 3, 1] }, expected: 0, isHidden: false },
      { input: { prices: [1, 2, 3, 4, 5] }, expected: 4, isHidden: false },
      { input: { prices: [2, 4, 1] }, expected: 2, isHidden: true },
      { input: { prices: [3, 2, 6, 5, 0, 3] }, expected: 4, isHidden: true },
      { input: { prices: [1] }, expected: 0, isHidden: true },
    ],
  },

  // ==================== MEDIUM ====================
  {
    id: 'longest-substring-interview',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'medium' as const,
    category: 'String',
    pattern: 'Sliding Window',
    description: `Dado un string s, encuentra la longitud de la subcadena más larga sin caracteres repetidos.`,
    examples: [
      { input: 's = "abcabcbb"', output: '3' },
      { input: 's = "bbbbb"', output: '1' },
    ],
    constraints: [
      '0 <= s.length <= 5 * 10^4',
      's consiste de caracteres ASCII',
    ],
    hints: [
      'Este es un problema clásico de Sliding Window. ¿Cómo manejas los duplicados?',
      'Usa un Set para trackear caracteres en la ventana actual. Expande la derecha, contrae la izquierda si hay duplicado.',
      'O usa un HashMap con el último índice de cada char: cuando encuentres duplicado, mueve left a max(left, lastIndex[char] + 1).',
    ],
    starterCode: `def length_of_longest_substring(s: str) -> int:
    # Tu código aquí
    pass`,
    functionName: 'length_of_longest_substring',
    testCases: [
      { input: { s: "abcabcbb" }, expected: 3, isHidden: false },
      { input: { s: "bbbbb" }, expected: 1, isHidden: false },
      { input: { s: "pwwkew" }, expected: 3, isHidden: false },
      { input: { s: "" }, expected: 0, isHidden: true },
      { input: { s: "abcdef" }, expected: 6, isHidden: true },
      { input: { s: "abba" }, expected: 2, isHidden: true },
    ],
  },
  {
    id: 'merge-intervals-interview',
    title: 'Merge Intervals',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'Sorting + Intervals',
    description: `Dado un array de intervalos donde intervals[i] = [start_i, end_i], combina todos los intervalos que se solapan y retorna un array de intervalos que no se solapan.`,
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]' },
    ],
    constraints: [
      '1 <= intervals.length <= 10^4',
      'intervals[i].length == 2',
    ],
    hints: [
      'Primero ordena los intervalos. ¿Por qué esto ayuda a detectar solapamientos?',
      'Después de ordenar por start, dos intervalos se solapan si interval[i].start <= merged[-1].end.',
      'Si se solapan, actualiza el end del último merged: merged[-1].end = max(merged[-1].end, interval[i].end).',
    ],
    starterCode: `def merge(intervals: list[list[int]]) -> list[list[int]]:
    # Tu código aquí
    pass`,
    functionName: 'merge',
    testCases: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected: [[1, 6], [8, 10], [15, 18]], isHidden: false },
      { input: { intervals: [[1, 4], [4, 5]] }, expected: [[1, 5]], isHidden: false },
      { input: { intervals: [[1, 4], [0, 4]] }, expected: [[0, 4]], isHidden: false },
      { input: { intervals: [[1, 4], [2, 3]] }, expected: [[1, 4]], isHidden: true },
      { input: { intervals: [[2, 3], [4, 5], [6, 7], [8, 9], [1, 10]] }, expected: [[1, 10]], isHidden: true },
    ],
  },
  {
    id: '3sum-interview',
    title: '3Sum',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'Two Pointers',
    description: `Dado un array de enteros nums, retorna todos los tripletes [nums[i], nums[j], nums[k]] tal que i != j, i != k, j != k, y nums[i] + nums[j] + nums[k] == 0.

La solución no debe contener tripletes duplicados.`,
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]' },
      { input: 'nums = [0,0,0]', output: '[[0,0,0]]' },
    ],
    constraints: [
      '3 <= nums.length <= 3000',
      '-10^5 <= nums[i] <= 10^5',
    ],
    hints: [
      'Ordena el array primero. Luego fija un elemento y usa Two Pointers para encontrar los otros dos.',
      'Para evitar duplicados: salta elementos repetidos. Si nums[i] == nums[i-1], continúa.',
      'Fija i, usa left=i+1 y right=n-1. Si suma < 0, left++. Si suma > 0, right--. Si suma == 0, guarda y salta duplicados.',
    ],
    starterCode: `def three_sum(nums: list[int]) -> list[list[int]]:
    # Tu código aquí
    pass`,
    functionName: 'three_sum',
    testCases: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected: [[-1, -1, 2], [-1, 0, 1]], isHidden: false },
      { input: { nums: [0, 0, 0] }, expected: [[0, 0, 0]], isHidden: false },
      { input: { nums: [0, 1, 1] }, expected: [], isHidden: false },
      { input: { nums: [-1, 0, 1, 0] }, expected: [[-1, 0, 1]], isHidden: true },
      { input: { nums: [-2, 0, 0, 2, 2] }, expected: [[-2, 0, 2]], isHidden: true },
    ],
  },
  {
    id: 'product-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'Prefix/Suffix',
    description: `Dado un array nums, retorna un array answer donde answer[i] es el producto de todos los elementos de nums excepto nums[i].

Debes hacerlo en O(n) sin usar división.`,
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]' },
    ],
    constraints: [
      '2 <= nums.length <= 10^5',
      '-30 <= nums[i] <= 30',
    ],
    hints: [
      'Para cada posición, necesitas el producto de todo lo que está a la izquierda Y a la derecha.',
      'Usa dos pasadas: primero calcula prefix products (izquierda a derecha), luego suffix products (derecha a izquierda).',
      'answer[i] = prefix[i] * suffix[i]. Puedes optimizar usando solo una variable para suffix y actualizar answer in-place.',
    ],
    starterCode: `def product_except_self(nums: list[int]) -> list[int]:
    # Tu código aquí (sin usar división)
    pass`,
    functionName: 'product_except_self',
    testCases: [
      { input: { nums: [1, 2, 3, 4] }, expected: [24, 12, 8, 6], isHidden: false },
      { input: { nums: [-1, 1, 0, -3, 3] }, expected: [0, 0, 9, 0, 0], isHidden: false },
      { input: { nums: [2, 3] }, expected: [3, 2], isHidden: false },
      { input: { nums: [1, 2, 3, 4, 5] }, expected: [120, 60, 40, 30, 24], isHidden: true },
      { input: { nums: [-1, -2, -3, -4] }, expected: [-24, -12, -8, -6], isHidden: true },
    ],
  },
  {
    id: 'container-water',
    title: 'Container With Most Water',
    difficulty: 'medium' as const,
    category: 'Array',
    pattern: 'Two Pointers',
    description: `Dado un array height de n enteros, donde height[i] representa la altura de una línea vertical.

Encuentra dos líneas que junto con el eje X formen un contenedor que almacene la mayor cantidad de agua.`,
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49' },
    ],
    constraints: [
      'n == height.length',
      '2 <= n <= 10^5',
      '0 <= height[i] <= 10^4',
    ],
    hints: [
      'El área = min(height[left], height[right]) * (right - left). ¿Cómo maximizas esto?',
      'Usa Two Pointers: left=0, right=n-1. El área está limitada por la altura menor.',
      'Siempre mueve el puntero de la altura menor: si height[left] < height[right], left++, sino right--.',
    ],
    starterCode: `def max_area(height: list[int]) -> int:
    # Tu código aquí
    pass`,
    functionName: 'max_area',
    testCases: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49, isHidden: false },
      { input: { height: [1, 1] }, expected: 1, isHidden: false },
      { input: { height: [4, 3, 2, 1, 4] }, expected: 16, isHidden: false },
      { input: { height: [1, 2, 1] }, expected: 2, isHidden: true },
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected: 49, isHidden: true },
    ],
  },
  {
    id: 'coin-change',
    title: 'Coin Change',
    difficulty: 'medium' as const,
    category: 'Dynamic Programming',
    pattern: 'Bottom-Up DP',
    description: `Dado un array de monedas de diferentes denominaciones y un monto total, retorna el número mínimo de monedas necesarias para formar ese monto.

Si no es posible formar el monto, retorna -1.`,
    examples: [
      { input: 'coins = [1, 2, 5], amount = 11', output: '3 (5 + 5 + 1)' },
      { input: 'coins = [2], amount = 3', output: '-1' },
    ],
    constraints: [
      '1 <= coins.length <= 12',
      '1 <= coins[i] <= 2^31 - 1',
      '0 <= amount <= 10^4',
    ],
    hints: [
      'Este es un problema clásico de Dynamic Programming. Define dp[i] = mínimas monedas para formar i.',
      'dp[0] = 0 (base case). Para cada monto i, prueba cada moneda c: dp[i] = min(dp[i], dp[i-c] + 1).',
      'Inicializa dp con infinito. Si dp[amount] sigue siendo infinito, retorna -1.',
    ],
    starterCode: `def coin_change(coins: list[int], amount: int) -> int:
    # Tu código aquí
    pass`,
    functionName: 'coin_change',
    testCases: [
      { input: { coins: [1, 2, 5], amount: 11 }, expected: 3, isHidden: false },
      { input: { coins: [2], amount: 3 }, expected: -1, isHidden: false },
      { input: { coins: [1], amount: 0 }, expected: 0, isHidden: false },
      { input: { coins: [1, 3, 4, 5], amount: 7 }, expected: 2, isHidden: true },
      { input: { coins: [186, 419, 83, 408], amount: 6249 }, expected: 20, isHidden: true },
    ],
  },
  {
    id: 'lru-cache',
    title: 'LRU Cache',
    difficulty: 'medium' as const,
    category: 'Design',
    pattern: 'Hash Map + Doubly Linked List',
    description: `Diseña una estructura de datos que siga las restricciones de un cache LRU (Least Recently Used).

Implementa la clase LRUCache:
- LRUCache(capacity) inicializa el cache con capacidad positiva
- get(key) retorna el valor si existe, sino -1
- put(key, value) actualiza o inserta. Si excede capacidad, elimina el menos usado.`,
    examples: [
      { input: 'LRUCache(2), put(1,1), put(2,2), get(1), put(3,3), get(2)', output: '1, -1' },
    ],
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      'get y put deben ser O(1)',
    ],
    hints: [
      'Necesitas O(1) para búsqueda (HashMap) y O(1) para ordenar por uso reciente (Doubly Linked List).',
      'HashMap: key -> nodo. DLL: head es más reciente, tail es menos reciente.',
      'En Python puedes usar OrderedDict que combina ambas. O implementa tu propia DLL con nodos dummy head/tail.',
      'Para get: si key existe, mueve el nodo a head y retorna el valor. Para put: actualiza valor y mueve a head, o inserta nuevo. Si excede capacidad, elimina el tail.',
    ],
    starterCode: `class LRUCache:
    def __init__(self, capacity: int):
        # Tu código aquí
        pass

    def get(self, key: int) -> int:
        # Tu código aquí
        pass

    def put(self, key: int, value: int) -> None:
        # Tu código aquí
        pass`,
    testCases: [
      { input: { operations: ["LRUCache", "put", "put", "get", "put", "get", "put", "get", "get", "get"], params: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]], expected: [null, null, null, 1, null, -1, null, -1, 3, 4] }, isHidden: false },
      { input: { operations: ["LRUCache", "get", "put", "get", "put", "put", "get"], params: [[2], [2], [2, 6], [1], [1, 5], [1, 2], [1]], expected: [null, -1, null, -1, null, null, 2] }, isHidden: false },
      { input: { operations: ["LRUCache", "put", "put", "get", "get", "put", "get", "get", "get"], params: [[3], [1, 1], [2, 2], [1], [2], [3, 3], [1], [2], [3]], expected: [null, null, null, 1, 2, null, 1, 2, 3] }, isHidden: true },
    ],
  },
  {
    id: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'medium' as const,
    category: 'String',
    pattern: 'Hashing',
    description: `Dado un array de strings, agrupa los anagramas juntos. Puedes retornar la respuesta en cualquier orden.

Un anagrama es una palabra formada reordenando las letras de otra palabra.`,
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
    ],
    constraints: [
      '1 <= strs.length <= 10^4',
      '0 <= strs[i].length <= 100',
      'strs[i] consiste de letras minúsculas',
    ],
    hints: [
      '¿Cómo identificas que dos palabras son anagramas? Tienen las mismas letras en diferente orden.',
      'Si ordenas las letras de un anagrama, obtienes la misma "firma". Usa eso como key en un HashMap.',
      'Para cada palabra: key = "".join(sorted(word)). Agrupa palabras con la misma key. Retorna dict.values().',
    ],
    starterCode: `def group_anagrams(strs: list[str]) -> list[list[str]]:
    # Tu código aquí
    pass`,
    functionName: 'group_anagrams',
    testCases: [
      { input: { strs: ["eat", "tea", "tan", "ate", "nat", "bat"] }, expected: [["bat"], ["nat", "tan"], ["ate", "eat", "tea"]], isHidden: false },
      { input: { strs: [""] }, expected: [[""]], isHidden: false },
      { input: { strs: ["a"] }, expected: [["a"]], isHidden: false },
      { input: { strs: ["bdddddddddd", "bbbbbbbbbbc"] }, expected: [["bbbbbbbbbbc"], ["bdddddddddd"]], isHidden: true },
      { input: { strs: ["ddddddddddg", "dgggggggggg"] }, expected: [["ddddddddddg"], ["dgggggggggg"]], isHidden: true },
    ],
  },

  // ==================== HARD ====================
  {
    id: 'trapping-rain-water-interview',
    title: 'Trapping Rain Water',
    difficulty: 'hard' as const,
    category: 'Array',
    pattern: 'Two Pointers',
    description: `Dado n enteros no negativos representando un mapa de elevación donde el ancho de cada barra es 1, calcula cuánta agua puede atrapar después de llover.`,
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6' },
    ],
    constraints: [
      'n == height.length',
      '1 <= n <= 2 * 10^4',
      '0 <= height[i] <= 10^5',
    ],
    hints: [
      'Para cada posición, el agua = min(maxLeft, maxRight) - height[i]. ¿Cómo calculas maxLeft y maxRight?',
      'Puedes precalcular arrays leftMax[] y rightMax[]. O usar Two Pointers con O(1) espacio.',
      'Two Pointers: si leftMax < rightMax, el agua en left depende de leftMax. Procesa left y mueve left++. Viceversa para right.',
    ],
    starterCode: `def trap(height: list[int]) -> int:
    # Tu código aquí
    pass`,
    functionName: 'trap',
    testCases: [
      { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected: 6, isHidden: false },
      { input: { height: [4, 2, 0, 3, 2, 5] }, expected: 9, isHidden: false },
      { input: { height: [3, 0, 2, 0, 4] }, expected: 7, isHidden: false },
      { input: { height: [1, 0, 1] }, expected: 1, isHidden: true },
      { input: { height: [5, 4, 1, 2] }, expected: 1, isHidden: true },
    ],
  },
  {
    id: 'median-two-sorted',
    title: 'Median of Two Sorted Arrays',
    difficulty: 'hard' as const,
    category: 'Array',
    pattern: 'Binary Search',
    description: `Dados dos arrays ordenados nums1 y nums2, retorna la mediana de los dos arrays combinados.

La complejidad debe ser O(log(m+n)).`,
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5' },
    ],
    hints: [
      'Binary Search en el array más pequeño. Buscas una partición donde todos los elementos de la izquierda <= todos los de la derecha.',
      'Si particionas nums1 en i elementos, necesitas (m+n+1)/2 - i elementos de nums2 para la mitad izquierda.',
      'Ajusta la partición: si nums1[i-1] > nums2[j], mueve i a la izquierda. Si nums2[j-1] > nums1[i], mueve i a la derecha.',
    ],
    constraints: [
      '0 <= nums1.length, nums2.length <= 1000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6',
    ],
    starterCode: `def find_median_sorted_arrays(nums1: list[int], nums2: list[int]) -> float:
    # Tu código aquí - O(log(m+n))
    pass`,
    functionName: 'find_median_sorted_arrays',
    testCases: [
      { input: { nums1: [1, 3], nums2: [2] }, expected: 2.0, isHidden: false },
      { input: { nums1: [1, 2], nums2: [3, 4] }, expected: 2.5, isHidden: false },
      { input: { nums1: [0, 0], nums2: [0, 0] }, expected: 0.0, isHidden: false },
      { input: { nums1: [], nums2: [1] }, expected: 1.0, isHidden: true },
      { input: { nums1: [2], nums2: [] }, expected: 2.0, isHidden: true },
    ],
  },
  {
    id: 'merge-k-sorted',
    title: 'Merge k Sorted Lists',
    difficulty: 'hard' as const,
    category: 'Linked List / Heap',
    pattern: 'Min Heap',
    description: `Dado un array de k listas enlazadas ordenadas, combínalas en una sola lista enlazada ordenada y retorna su cabeza.`,
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]' },
    ],
    constraints: [
      'k == lists.length',
      '0 <= k <= 10^4',
      'El total de nodos no excede 10^4',
    ],
    hints: [
      'Enfoque naive: merge de a pares. Pero hay algo más eficiente usando una estructura que te da el mínimo rápido.',
      'Usa un Min Heap (Priority Queue). Inserta el primer nodo de cada lista. Extrae el mínimo, agrégalo al resultado, e inserta su siguiente.',
      'En Python: heapq. Guarda tuplas (val, index, node) para evitar comparar nodos. El index es para desempatar.',
    ],
    starterCode: `class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_k_lists(lists: list[ListNode]) -> ListNode:
    # Tu código aquí
    pass`,
    functionName: 'merge_k_lists',
    testCases: [
      { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expected: [1, 1, 2, 3, 4, 4, 5, 6], isHidden: false },
      { input: { lists: [] }, expected: [], isHidden: false },
      { input: { lists: [[]] }, expected: [], isHidden: false },
      { input: { lists: [[1, 4, 5], [1, 3, 4], [2, 6]] }, expected: [1, 1, 2, 3, 4, 4, 5, 6], isHidden: true },
      { input: { lists: [[1, 2, 3], [4, 5, 6, 7], [8, 9]] }, expected: [1, 2, 3, 4, 5, 6, 7, 8, 9], isHidden: true },
    ],
  },
  {
    id: 'word-ladder',
    title: 'Word Ladder',
    difficulty: 'hard' as const,
    category: 'Graph',
    pattern: 'BFS',
    description: `Dado beginWord, endWord, y un diccionario wordList, retorna la longitud de la secuencia de transformación más corta de beginWord a endWord.

Reglas:
- Solo una letra puede cambiar a la vez
- Cada palabra intermedia debe existir en wordList`,
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5 (hit -> hot -> dot -> dog -> cog)' },
    ],
    constraints: [
      '1 <= beginWord.length <= 10',
      'Todas las palabras tienen la misma longitud',
      'Todas las palabras son letras minúsculas',
    ],
    hints: [
      'Piensa en esto como un grafo. Cada palabra es un nodo. Hay edge si difieren en una letra. ¿Qué algoritmo encuentra el camino más corto?',
      'BFS encuentra el camino más corto en grafos no ponderados. Empieza desde beginWord, explora vecinos nivel por nivel.',
      'Para encontrar vecinos eficientemente: para cada posición, prueba las 26 letras. O crea un patrón wildcard h*t -> [hot, hit, hat...].',
    ],
    starterCode: `def ladder_length(beginWord: str, endWord: str, wordList: list[str]) -> int:
    # Tu código aquí
    pass`,
    functionName: 'ladder_length',
    testCases: [
      { input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log", "cog"] }, expected: 5, isHidden: false },
      { input: { beginWord: "hit", endWord: "cog", wordList: ["hot", "dot", "dog", "lot", "log"] }, expected: 0, isHidden: false },
      { input: { beginWord: "a", endWord: "c", wordList: ["a", "b", "c"] }, expected: 2, isHidden: false },
      { input: { beginWord: "hot", endWord: "dog", wordList: ["hot", "dog"] }, expected: 0, isHidden: true },
      { input: { beginWord: "qa", endWord: "sq", wordList: ["si", "go", "se", "cm", "so", "ph", "mt", "db", "mb", "sb", "kr", "ln", "tm", "le", "av", "sm", "ar", "ci", "ca", "br", "ti", "ba", "to", "ra", "fa", "yo", "ow", "sn", "ya", "cr", "po", "fe", "ho", "ma", "re", "or", "rn", "au", "ur", "rh", "sr", "tc", "lt", "lo", "as", "fr", "nb", "yb", "if", "pb", "ge", "th", "pm", "rb", "sh", "co", "ga", "li", "ha", "hz", "no", "bi", "di", "hi", "qa", "pi", "os", "uh", "wm", "an", "me", "mo", "na", "la", "st", "er", "sc", "ne", "mn", "mi", "am", "ex", "pt", "io", "be", "fm", "ta", "tb", "ni", "mr", "pa", "he", "lr", "sq", "ye"] }, expected: 5, isHidden: true },
    ],
  },
  {
    id: 'alien-dictionary',
    title: 'Alien Dictionary',
    difficulty: 'hard' as const,
    category: 'Graph',
    pattern: 'Topological Sort',
    description: `Hay un nuevo lenguaje alienígena que usa letras del alfabeto inglés pero en orden diferente.

Dado un diccionario de palabras ordenadas según ese lenguaje, deriva el orden de las letras.

Si no existe orden válido, retorna "".`,
    examples: [
      { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"' },
      { input: 'words = ["z","x"]', output: '"zx"' },
    ],
    constraints: [
      '1 <= words.length <= 100',
      '1 <= words[i].length <= 100',
      'words[i] consiste de letras minúsculas',
    ],
    hints: [
      'Compara palabras adyacentes para encontrar relaciones de orden. La primera letra diferente te dice: letra1 < letra2.',
      'Construye un grafo dirigido con estas relaciones. El orden de letras es un Topological Sort del grafo.',
      'Usa Kahn\'s algorithm (BFS con in-degree) o DFS. Si hay ciclo (no puedes visitar todos), retorna "".',
    ],
    starterCode: `def alien_order(words: list[str]) -> str:
    # Tu código aquí (topological sort)
    pass`,
    functionName: 'alien_order',
    testCases: [
      { input: { words: ["wrt", "wrf", "er", "ett", "rftt"] }, expected: "wertf", isHidden: false },
      { input: { words: ["z", "x"] }, expected: "zx", isHidden: false },
      { input: { words: ["z", "x", "z"] }, expected: "", isHidden: false },
      { input: { words: ["abc", "ab"] }, expected: "", isHidden: true },
      { input: { words: ["wrt", "wrf", "er", "ett", "rftt"] }, expected: "wertf", isHidden: true },
    ],
  },
  {
    id: 'serialize-binary-tree',
    title: 'Serialize and Deserialize Binary Tree',
    difficulty: 'hard' as const,
    category: 'Tree',
    pattern: 'DFS / BFS',
    description: `Diseña un algoritmo para serializar y deserializar un árbol binario.

No hay restricción en cómo debe funcionar la serialización/deserialización, solo que un árbol pueda ser serializado a un string y luego deserializado al mismo árbol.`,
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]' },
    ],
    constraints: [
      'El número de nodos está en [0, 10^4]',
      '-1000 <= Node.val <= 1000',
    ],
    hints: [
      'Puedes usar BFS (level order) o DFS (preorder). La clave es representar los nodos null para reconstruir la estructura.',
      'Preorder DFS: serializa como "val,left,right" recursivamente. Usa un marcador especial para null (ej: "N" o "#").',
      'Para deserializar preorder: usa un índice global o una cola. El primer valor es root, los siguientes son left y right recursivamente.',
    ],
    starterCode: `class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

class Codec:
    def serialize(self, root: TreeNode) -> str:
        # Tu código aquí
        pass

    def deserialize(self, data: str) -> TreeNode:
        # Tu código aquí
        pass`,
    testCases: [
      {
        input: {
          operations: ["Codec", "serialize"],
          params: [[], [[1, 2, 3, null, null, 4, 5]]]
        },
        expected: ["1,2,3,#,#,4,5"],
        isHidden: false
      },
      {
        input: {
          operations: ["Codec", "serialize"],
          params: [[], [[]]]
        },
        expected: ["#"],
        isHidden: false
      },
      {
        input: {
          operations: ["Codec", "serialize"],
          params: [[], [[1]]]
        },
        expected: ["1,#,#"],
        isHidden: true
      },
    ],
  },
];

export default InterviewModePage;
