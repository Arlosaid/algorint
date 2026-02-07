import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Clock,
  Code2,
  Lightbulb,
  Loader2,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  XCircle,
  HelpCircle,
  Eye,
  RotateCcw,
  Trophy,
  Brain,
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, Button, DifficultyBadge } from '../components/ui';
import { useProgress } from '../context/ProgressContext';
import { API_BASE_URL } from '../config';

// ============================================
// COMPONENTES MARKDOWN COMPARTIDOS
// ============================================

/**
 * Componentes de ReactMarkdown para renderizar contenido enriquecido
 * con soporte de tablas, blockquotes, código, listas, etc.
 */
const sharedMarkdownComponents: any = {
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const content = String(children);
    // react-markdown v10: inline puede ser undefined para inline code
    // Detectamos bloques por: tener language class O tener saltos de linea
    const isBlock = match || content.includes('\n');

    if (isBlock && match) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          {...props}
        >
          {content.replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
    if (isBlock) {
      return (
        <div className="my-4 bg-dark-900 rounded-lg p-4 font-mono text-sm text-dark-200 overflow-x-auto border border-dark-700">
          <pre className="whitespace-pre">{children}</pre>
        </div>
      );
    }
    return (
      <code className={`${className || ''} bg-dark-700 px-1.5 py-0.5 rounded text-primary-400`} {...props}>
        {children}
      </code>
    );
  },
  table({ children }: any) {
    return (
      <div className="my-4 overflow-x-auto rounded-lg border border-dark-600">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: any) {
    return (
      <thead className="bg-gradient-to-r from-dark-700 to-dark-700/80">
        {children}
      </thead>
    );
  },
  th({ children }: any) {
    return (
      <th className="px-4 py-3 text-left font-semibold text-dark-100 border-b border-dark-600 text-sm">
        {children}
      </th>
    );
  },
  td({ children }: any) {
    return (
      <td className="px-4 py-3 text-dark-300 border-b border-dark-700/50 text-sm">
        {children}
      </td>
    );
  },
  tr({ children, ...props }: any) {
    return (
      <tr className="hover:bg-dark-700/30 transition-colors" {...props}>
        {children}
      </tr>
    );
  },
  blockquote({ children }: any) {
    return (
      <blockquote className="my-4 border-l-4 border-primary-500 bg-primary-500/5 rounded-r-lg pl-4 pr-4 py-3 text-dark-300 italic">
        {children}
      </blockquote>
    );
  },
  h2({ children }: any) {
    return <h2 className="text-xl font-bold text-white mt-8 mb-4 pb-2 border-b border-dark-700">{children}</h2>;
  },
  h3({ children }: any) {
    return <h3 className="text-lg font-semibold text-dark-100 mt-6 mb-3">{children}</h3>;
  },
  h4({ children }: any) {
    return <h4 className="text-base font-semibold text-dark-200 mt-4 mb-2">{children}</h4>;
  },
  strong({ children }: any) {
    return <strong className="text-white font-semibold">{children}</strong>;
  },
  hr() {
    return <hr className="my-6 border-dark-700" />;
  },
  ul({ children }: any) {
    return <ul className="my-3 ml-1 space-y-1.5 list-none">{children}</ul>;
  },
  ol({ children }: any) {
    return <ol className="my-3 ml-1 space-y-1.5 list-decimal list-inside">{children}</ol>;
  },
  li({ children, ordered }: any) {
    return (
      <li className="text-dark-300 flex items-start gap-2">
        {!ordered && <span className="text-primary-400 mt-1.5 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary-400 inline-block" />}
        <span className="flex-1">{children}</span>
      </li>
    );
  },
  p({ children }: any) {
    return <p className="my-2 text-dark-300 leading-relaxed">{children}</p>;
  },
};

/** Componentes especiales para la sección de diagrama visual */
const diagramMarkdownComponents: any = {
  ...sharedMarkdownComponents,
  h2({ children }: any) {
    return (
      <h2 className="text-lg font-bold text-blue-300 mt-5 mb-3 flex items-center gap-2 first:mt-0">
        <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
        {children}
      </h2>
    );
  },
  h3({ children }: any) {
    return <h3 className="text-base font-semibold text-blue-200/90 mt-4 mb-2">{children}</h3>;
  },
  table({ children }: any) {
    return (
      <div className="my-3 overflow-x-auto rounded-lg border border-blue-500/20">
        <table className="w-full border-collapse text-sm">
          {children}
        </table>
      </div>
    );
  },
  thead({ children }: any) {
    return (
      <thead className="bg-blue-500/10">
        {children}
      </thead>
    );
  },
  th({ children }: any) {
    return (
      <th className="px-4 py-2.5 text-left font-semibold text-blue-200 border-b border-blue-500/20 text-sm">
        {children}
      </th>
    );
  },
  td({ children }: any) {
    return (
      <td className="px-4 py-2.5 text-dark-300 border-b border-dark-700/50 text-sm">
        {children}
      </td>
    );
  },
  code({ node, inline, className, children, ...props }: any) {
    const match = /language-(\w+)/.exec(className || '');
    const content = String(children);
    const isBlock = match || content.includes('\n');

    if (isBlock && match) {
      return (
        <SyntaxHighlighter
          style={oneDark}
          language={match[1]}
          PreTag="div"
          customStyle={{ borderRadius: '0.5rem', fontSize: '0.85rem' }}
          {...props}
        >
          {content.replace(/\n$/, '')}
        </SyntaxHighlighter>
      );
    }
    if (isBlock) {
      return (
        <div className="my-3 bg-dark-950 rounded-lg p-4 font-mono text-sm text-blue-200/80 overflow-x-auto border border-blue-500/10">
          <pre className="whitespace-pre leading-relaxed">{children}</pre>
        </div>
      );
    }
    return (
      <code className="bg-blue-500/10 px-1.5 py-0.5 rounded text-blue-300 text-sm font-mono" {...props}>
        {children}
      </code>
    );
  },
  strong({ children }: any) {
    return <strong className="text-blue-100 font-semibold">{children}</strong>;
  },
  blockquote({ children }: any) {
    return (
      <blockquote className="my-3 border-l-4 border-blue-500/40 bg-blue-500/5 rounded-r-lg pl-4 pr-4 py-2 text-dark-300 italic">
        {children}
      </blockquote>
    );
  },
  p({ children }: any) {
    return <p className="my-2 text-dark-300 leading-relaxed text-sm">{children}</p>;
  },
};

/**
 * LessonPage - Página de Lección Mejorada
 * ========================================
 * - Contenido en Markdown con syntax highlighting
 * - Quizzes interactivos con feedback inmediato
 * - Ejercicios fill-in-the-blank
 * - Explicaciones Feynman destacadas
 * - Diagramas visuales
 * - Progreso de lectura
 * - Navegación entre lecciones
 */

// ============================================
// TIPOS
// ============================================

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct_index: number;
  explanation: string;
  difficulty: string;
}

interface FillBlankQuestion {
  id: string;
  code_template: string;
  blank_answer: string;
  hint: string;
  explanation: string;
}

interface ContentBlock {
  type: string; // "text", "code", "info", "warning", "quiz", "fill-blank"
  content?: string;
  language?: string;
  quiz?: QuizQuestion;
  fill_blank?: FillBlankQuestion;
}

interface CodeExample {
  title: string;
  description: string;
  code: string;
  language: string;
}

interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  estimatedMinutes: number;
  difficulty: 'beginner' | 'easy' | 'intermediate' | 'medium' | 'advanced' | 'hard' | 'expert';
  order: number;
  content: ContentBlock[];
  codeExamples: CodeExample[];
  prerequisites: string[];
  nextLessonId?: string;
  visual_diagram?: string;
  core_code_snippet?: string;
  feynman_explanation?: string;
  quiz_questions?: QuizQuestion[];
}

// ============================================
// COMPONENTE QUIZ INTERACTIVO
// ============================================

const QuizComponent: React.FC<{ quiz: QuizQuestion }> = ({ quiz }) => {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCorrect = selectedAnswer === quiz.correct_index;

  const handleAnswer = (index: number) => {
    if (hasAnswered) return;
    setSelectedAnswer(index);
    setShowResult(true);
    setHasAnswered(true);
  };

  const handleRetry = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setHasAnswered(false);
  };

  return (
    <div className="my-6 rounded-xl border border-dark-600 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-b border-dark-600 px-5 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <HelpCircle className="text-purple-400" size={18} />
        </div>
        <span className="font-semibold text-white text-sm">Pregunta de Comprensión</span>
        {quiz.difficulty && (
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            quiz.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
            quiz.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {quiz.difficulty === 'easy' ? 'Fácil' : quiz.difficulty === 'medium' ? 'Media' : 'Difícil'}
          </span>
        )}
      </div>

      {/* Question */}
      <div className="p-5">
        <p className="text-white font-medium mb-4 text-base leading-relaxed">{quiz.question}</p>

        {/* Options */}
        <div className="space-y-2">
          {quiz.options.map((option, index) => {
            let optionStyle = 'border-dark-600 hover:border-dark-500 hover:bg-dark-700/50';
            
            if (showResult) {
              if (index === quiz.correct_index) {
                optionStyle = 'border-green-500/50 bg-green-500/10';
              } else if (index === selectedAnswer && !isCorrect) {
                optionStyle = 'border-red-500/50 bg-red-500/10';
              } else {
                optionStyle = 'border-dark-700 opacity-50';
              }
            } else if (selectedAnswer === index) {
              optionStyle = 'border-primary-500/50 bg-primary-500/10';
            }

            return (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={hasAnswered}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 flex items-center gap-3 ${optionStyle} ${
                  !hasAnswered ? 'cursor-pointer' : 'cursor-default'
                }`}
              >
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  showResult && index === quiz.correct_index
                    ? 'bg-green-500 text-white'
                    : showResult && index === selectedAnswer && !isCorrect
                    ? 'bg-red-500 text-white'
                    : 'bg-dark-600 text-dark-300'
                }`}>
                  {showResult && index === quiz.correct_index ? (
                    <CheckCircle size={16} />
                  ) : showResult && index === selectedAnswer && !isCorrect ? (
                    <XCircle size={16} />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
                </span>
                <span className={`text-sm ${
                  showResult && index === quiz.correct_index ? 'text-green-300 font-medium' :
                  showResult && index === selectedAnswer && !isCorrect ? 'text-red-300' :
                  'text-dark-200'
                }`}>
                  {option}
                </span>
              </button>
            );
          })}
        </div>

        {/* Resultado y explicación */}
        {showResult && (
          <div className={`mt-4 p-4 rounded-lg border animate-fade-in ${
            isCorrect 
              ? 'bg-green-500/5 border-green-500/30 quiz-correct' 
              : 'bg-red-500/5 border-red-500/30 quiz-incorrect'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="text-green-400" size={18} />
                  <span className="text-green-400 font-semibold text-sm">Correcto!</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400" size={18} />
                  <span className="text-red-400 font-semibold text-sm">Incorrecto</span>
                </>
              )}
            </div>
            <p className="text-dark-300 text-sm leading-relaxed">{quiz.explanation}</p>
            
            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="mt-3 flex items-center gap-2 text-primary-400 text-sm hover:text-primary-300 transition-colors"
              >
                <RotateCcw size={14} />
                Intentar de nuevo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE FILL-IN-THE-BLANK
// ============================================

const FillBlankComponent: React.FC<{ fillBlank: FillBlankQuestion }> = ({ fillBlank }) => {
  const [userAnswer, setUserAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [hasAnswered, setHasAnswered] = useState(false);

  const isCorrect = userAnswer.trim().toLowerCase() === fillBlank.blank_answer.trim().toLowerCase();

  const handleSubmit = () => {
    if (!userAnswer.trim()) return;
    setShowResult(true);
    setHasAnswered(true);
  };

  const handleRetry = () => {
    setUserAnswer('');
    setShowResult(false);
    setHasAnswered(false);
    setShowHint(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !hasAnswered) {
      handleSubmit();
    }
  };

  // Renderizar el template con el blank
  const parts = fillBlank.code_template.split('___');

  return (
    <div className="my-6 rounded-xl border border-dark-600 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border-b border-dark-600 px-5 py-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
          <Code2 className="text-blue-400" size={18} />
        </div>
        <span className="font-semibold text-white text-sm">Completa el Código</span>
      </div>

      <div className="p-5">
        {/* Código con blank */}
        <div className="bg-dark-900 rounded-lg p-4 font-mono text-sm mb-4 overflow-x-auto">
          <pre className="text-dark-200 whitespace-pre-wrap">
            {parts[0]}
            <span className={`inline-block min-w-[120px] px-2 py-0.5 rounded border-b-2 ${
              showResult 
                ? isCorrect 
                  ? 'border-green-500 bg-green-500/10 text-green-300' 
                  : 'border-red-500 bg-red-500/10 text-red-300'
                : 'border-primary-500 bg-primary-500/10'
            }`}>
              {showResult ? userAnswer || '___' : (
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="tu respuesta..."
                  className="bg-transparent border-none outline-none text-primary-300 placeholder-dark-500 w-full font-mono"
                  disabled={hasAnswered}
                />
              )}
            </span>
            {parts[1]}
          </pre>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {!hasAnswered && (
            <>
              <button
                onClick={handleSubmit}
                disabled={!userAnswer.trim()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 disabled:bg-dark-600 disabled:text-dark-500 text-white text-sm rounded-lg transition-colors font-medium"
              >
                Verificar
              </button>
              <button
                onClick={() => setShowHint(!showHint)}
                className="px-4 py-2 text-dark-400 hover:text-dark-200 text-sm transition-colors flex items-center gap-2"
              >
                <Eye size={14} />
                {showHint ? 'Ocultar pista' : 'Ver pista'}
              </button>
            </>
          )}
        </div>

        {/* Hint */}
        {showHint && !hasAnswered && (
          <div className="mt-3 p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-lg">
            <p className="text-yellow-300 text-sm flex items-center gap-2">
              <Lightbulb size={14} />
              {fillBlank.hint}
            </p>
          </div>
        )}

        {/* Result */}
        {showResult && (
          <div className={`mt-4 p-4 rounded-lg border ${
            isCorrect 
              ? 'bg-green-500/5 border-green-500/30' 
              : 'bg-red-500/5 border-red-500/30'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              {isCorrect ? (
                <>
                  <CheckCircle className="text-green-400" size={18} />
                  <span className="text-green-400 font-semibold text-sm">¡Correcto!</span>
                </>
              ) : (
                <>
                  <XCircle className="text-red-400" size={18} />
                  <span className="text-red-400 font-semibold text-sm">
                    Incorrecto — La respuesta es: <code className="bg-dark-700 px-1.5 py-0.5 rounded text-green-400">{fillBlank.blank_answer}</code>
                  </span>
                </>
              )}
            </div>
            <p className="text-dark-300 text-sm leading-relaxed">{fillBlank.explanation}</p>
            
            {!isCorrect && (
              <button
                onClick={handleRetry}
                className="mt-3 flex items-center gap-2 text-primary-400 text-sm hover:text-primary-300 transition-colors"
              >
                <RotateCcw size={14} />
                Intentar de nuevo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const LessonPage: React.FC = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  const { startLesson, completeLesson, getLessonStatus } = useProgress();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // quiz score state removed (not used)
  const [isCompleted, setIsCompleted] = useState(false);
  const [showCompletionAnimation, setShowCompletionAnimation] = useState(false);
  const [readingProgress, setReadingProgress] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);
  const startTimeRef = useRef<number>(Date.now());
  
  // Estado de secciones expandidas
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    feynman: true,
    diagram: true,
    coreCode: true,
    codeExamples: true,
    quizzes: true
  });

  // Cargar leccion
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/lessons/${lessonId}`);
        if (!response.ok) throw new Error('Leccion no encontrada');
        const data = await response.json();
        setLesson(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar la leccion');
      } finally {
        setLoading(false);
      }
    };

    if (lessonId) {
      fetchLesson();
      startTimeRef.current = Date.now();
    }
  }, [lessonId]);

  // Marcar como iniciada y verificar si ya fue completada
  useEffect(() => {
    if (lessonId && lesson) {
      const status = getLessonStatus(lessonId);
      if (status === 'not-started') {
        startLesson(lessonId);
      }
      setIsCompleted(status === 'completed');
    }
  }, [lessonId, lesson]);

  // Tracking de progreso de lectura con scroll
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      const element = contentRef.current;
      // previously used bounding rect removed (was unused)
      const totalHeight = element.scrollHeight - element.clientHeight;
      const scrolled = window.scrollY - element.offsetTop + window.innerHeight;
      const progress = Math.min(Math.max((scrolled / (totalHeight + window.innerHeight)) * 100, 0), 100);
      setReadingProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lesson]);

  // Manejar completar lección
  const handleCompleteLesson = () => {
    if (!lessonId) return;
    const timeSpent = Math.round((Date.now() - startTimeRef.current) / 1000);
    completeLesson(lessonId, timeSpent);
    setIsCompleted(true);
    setShowCompletionAnimation(true);
    setTimeout(() => setShowCompletionAnimation(false), 3000);
  };

  // Toggle seccion
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
          <p className="text-dark-400">Cargando lección...</p>
        </div>
      </div>
    );
  }

  if (error || !lesson) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <Card className="text-center p-8 max-w-md">
          <BookOpen className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Lección no encontrada</h2>
          <p className="text-dark-400 mb-4">{error || 'La lección solicitada no existe.'}</p>
          <Link to={`/modules/${moduleId}`}>
            <Button variant="primary">
              <ArrowLeft size={18} />
              Volver al módulo
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Contar quizzes en el contenido
  const quizCount = lesson.content.filter(b => b.type === 'quiz').length + (lesson.quiz_questions?.length || 0);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Animación de completado */}
      {showCompletionAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="animate-bounce-in bg-gradient-to-br from-primary-500 to-emerald-500 text-white px-8 py-6 rounded-2xl shadow-2xl shadow-primary-500/30 text-center">
            <Sparkles className="w-12 h-12 mx-auto mb-3 animate-pulse" />
            <h3 className="text-2xl font-bold mb-1">Leccion Completada!</h3>
            <p className="text-primary-100">Sigue asi, vas muy bien</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700 sticky top-0 z-20">
        {/* Barra de progreso de lectura */}
        <div className="h-1 bg-dark-700 w-full">
          <div 
            className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 transition-all duration-300 ease-out"
            style={{ width: `${readingProgress}%` }}
          />
        </div>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to={`/modules/${moduleId}`}
                className="p-2 rounded-lg bg-dark-700 hover:bg-dark-600 transition-colors"
              >
                <ArrowLeft size={20} className="text-dark-300" />
              </Link>
              <div>
                <h1 className="text-xl font-bold text-white">{lesson.title}</h1>
                <div className="flex items-center gap-3 mt-1">
                  <span className="flex items-center gap-1 text-dark-400 text-sm">
                    <Clock size={14} />
                    {lesson.estimatedMinutes} min
                  </span>
                  <DifficultyBadge difficulty={lesson.difficulty === 'beginner' ? 'easy' : lesson.difficulty === 'intermediate' ? 'medium' : lesson.difficulty === 'advanced' || lesson.difficulty === 'expert' ? 'hard' : lesson.difficulty} />
                  {quizCount > 0 && (
                    <span className="flex items-center gap-1 text-purple-400 text-sm">
                      <HelpCircle size={14} />
                      {quizCount} {quizCount === 1 ? 'quiz' : 'quizzes'}
                    </span>
                  )}
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-primary-400 text-sm font-medium">
                      <CheckCircle size={14} />
                      Completada
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Botón completar en el header */}
            {!isCompleted && (
              <button
                onClick={handleCompleteLesson}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-all hover:scale-105 active:scale-95"
              >
                <CheckCircle size={16} />
                Completar
              </button>
            )}
          </div>
        </div>
      </div>

      <div ref={contentRef} className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          
          {/* Explicación Feynman - Al inicio para captar atención */}
          {lesson.feynman_explanation && (
            <Card className="mb-6 border-green-500/20 feynman-glow animate-fade-in">
              <button
                onClick={() => toggleSection('feynman')}
                className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors rounded-t-xl lesson-section-toggle"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
                    <Brain className="text-green-400 animate-pulse-soft" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">Explicacion Simple (Metodo Feynman)</h3>
                    <p className="text-dark-500 text-xs mt-0.5">Como se lo explicarias a alguien que nunca programo</p>
                  </div>
                </div>
                {expandedSections.feynman ? (
                  <ChevronUp className="text-dark-400" size={20} />
                ) : (
                  <ChevronDown className="text-dark-400" size={20} />
                )}
              </button>
              {expandedSections.feynman && (
                <div className="px-5 pb-5 lesson-section-content">
                  <div className="p-4 bg-gradient-to-br from-green-500/5 to-emerald-500/5 rounded-lg border border-green-500/10">
                    <p className="text-dark-200 leading-relaxed text-base">{lesson.feynman_explanation}</p>
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Diagrama Visual */}
          {lesson.visual_diagram && (
            <div className="mb-6 border-blue-500/20 animate-fade-in" style={{ animationDelay: '0.1s' }}>
              <Card>
                <button
                  onClick={() => toggleSection('diagram')}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors rounded-t-xl lesson-section-toggle"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                      <Eye className="text-blue-400" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">Diagrama Visual</h3>
                      <p className="text-dark-500 text-xs mt-0.5">Visualizacion paso a paso del algoritmo</p>
                    </div>
                  </div>
                  {expandedSections.diagram ? (
                    <ChevronUp className="text-dark-400" size={20} />
                  ) : (
                    <ChevronDown className="text-dark-400" size={20} />
                  )}
                </button>

                {expandedSections.diagram && (
                  <div className="px-5 pb-5 lesson-section-content">
                    <div className="diagram-content bg-gradient-to-br from-dark-900 via-dark-900 to-blue-950/20 rounded-lg p-5 overflow-x-auto border border-blue-500/10 shadow-inner shadow-blue-500/5">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={diagramMarkdownComponents}
                      >
                        {lesson.visual_diagram}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Contenido principal */}
          <Card className="mb-6">
            <div className="prose prose-invert prose-lg max-w-none p-4">
              {lesson.content.map((block, index) => {
                if (block.type === 'text') {
                  return (
                    <ReactMarkdown
                      key={index}
                      remarkPlugins={[remarkGfm]}
                      components={sharedMarkdownComponents}
                    >
                      {block.content || ''}
                    </ReactMarkdown>
                  );
                }
                
                if (block.type === 'code') {
                  return (
                    <div key={index} className="my-4">
                      <SyntaxHighlighter
                        style={oneDark}
                        language={block.language || 'python'}
                        PreTag="div"
                        customStyle={{ borderRadius: '0.5rem' }}
                      >
                        {block.content || ''}
                      </SyntaxHighlighter>
                    </div>
                  );
                }
                
                if (block.type === 'info') {
                  return (
                    <div key={index} className="my-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg flex gap-3">
                      <Lightbulb className="text-blue-400 flex-shrink-0 mt-0.5" size={18} />
                      <div className="text-blue-300 text-sm leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="m-0">{children}</p>,
                            strong: ({ children }) => <strong className="text-blue-200">{children}</strong>,
                            code: ({ children }) => <code className="bg-blue-500/20 px-1 py-0.5 rounded text-blue-200 text-xs">{children}</code>,
                            table: ({ children }) => <table className="w-full border-collapse text-xs mt-2">{children}</table>,
                            th: ({ children }) => <th className="px-2 py-1 text-left text-blue-200 border-b border-blue-500/20 font-semibold">{children}</th>,
                            td: ({ children }) => <td className="px-2 py-1 border-b border-blue-500/10">{children}</td>,
                          }}
                        >
                          {block.content || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                }
                
                if (block.type === 'warning') {
                  return (
                    <div key={index} className="my-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg flex gap-3">
                      <AlertTriangle className="text-amber-400 flex-shrink-0 mt-0.5" size={18} />
                      <div className="text-amber-300 text-sm leading-relaxed">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="m-0">{children}</p>,
                            strong: ({ children }) => <strong className="text-amber-200">{children}</strong>,
                            code: ({ children }) => <code className="bg-amber-500/20 px-1 py-0.5 rounded text-amber-200 text-xs">{children}</code>,
                            table: ({ children }) => <table className="w-full border-collapse text-xs mt-2">{children}</table>,
                            th: ({ children }) => <th className="px-2 py-1 text-left text-amber-200 border-b border-amber-500/20 font-semibold">{children}</th>,
                            td: ({ children }) => <td className="px-2 py-1 border-b border-amber-500/10">{children}</td>,
                          }}
                        >
                          {block.content || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  );
                }

                // Quiz interactivo
                if (block.type === 'quiz' && block.quiz) {
                  return <QuizComponent key={index} quiz={block.quiz} />;
                }

                // Fill-in-the-blank
                if (block.type === 'fill-blank' && block.fill_blank) {
                  return <FillBlankComponent key={index} fillBlank={block.fill_blank} />;
                }
                
                return null;
              })}
            </div>
          </Card>

          {/* Código esencial */}
          {lesson.core_code_snippet && (
            <div className="mb-6 border-primary-500/20 animate-fade-in" style={{ animationDelay: '0.2s' }}>
              <Card>
                <button
                  onClick={() => toggleSection('coreCode')}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors rounded-t-xl lesson-section-toggle"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500/20 to-emerald-500/20 flex items-center justify-center">
                      <Code2 className="text-primary-400" size={20} />
                    </div>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">Codigo Esencial</h3>
                      <p className="text-dark-500 text-xs mt-0.5">El patron fundamental que debes memorizar</p>
                    </div>
                  </div>
                  {expandedSections.coreCode ? (
                    <ChevronUp className="text-dark-400" size={20} />
                  ) : (
                    <ChevronDown className="text-dark-400" size={20} />
                  )}
                </button>

                {expandedSections.coreCode && (
                  <div className="px-5 pb-5 lesson-section-content">
                    <div className="rounded-xl overflow-hidden border border-primary-500/20 shadow-lg shadow-primary-500/5">
                      <div className="bg-gradient-to-r from-primary-500/10 to-emerald-500/5 px-4 py-2 border-b border-primary-500/20 flex items-center gap-2">
                        <div className="flex gap-1.5">
                          <div className="w-3 h-3 rounded-full bg-red-500/60" />
                          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                          <div className="w-3 h-3 rounded-full bg-green-500/60" />
                        </div>
                        <span className="text-dark-400 text-xs font-mono ml-2">patron.py</span>
                      </div>
                      <SyntaxHighlighter
                        language="python"
                        style={oneDark}
                        customStyle={{ borderRadius: 0, margin: 0 }}
                      >
                        {lesson.core_code_snippet}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Ejemplos de código */}
          {lesson.codeExamples && lesson.codeExamples.length > 0 && (
            <div className="mb-6 animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <Card>
                <button
                  onClick={() => toggleSection('codeExamples')}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors rounded-t-xl lesson-section-toggle"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary-500/20 flex items-center justify-center">
                      <Code2 className="text-secondary-400" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">
                      Ejemplos de Codigo ({lesson.codeExamples.length})
                    </h3>
                  </div>
                  {expandedSections.codeExamples ? (
                    <ChevronUp className="text-dark-400" size={20} />
                  ) : (
                    <ChevronDown className="text-dark-400" size={20} />
                  )}
                </button>

                {expandedSections.codeExamples && (
                  <div className="px-4 pb-4 space-y-5 lesson-section-content">
                    {lesson.codeExamples.map((example, index) => (
                      <div key={index} className="code-example-card border border-dark-700 rounded-xl overflow-hidden">
                        <div className="bg-gradient-to-r from-dark-700/80 to-dark-700/50 px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-white flex items-center gap-2">
                              <span className="w-6 h-6 rounded-md bg-secondary-500/20 flex items-center justify-center text-secondary-400 text-xs font-bold">
                                {index + 1}
                              </span>
                              {example.title}
                            </h4>
                            {example.description && (
                              <p className="text-dark-400 text-sm mt-1 ml-8">{example.description}</p>
                            )}
                          </div>
                        </div>
                        <SyntaxHighlighter
                          language={example.language || "python"}
                          style={oneDark}
                          customStyle={{ margin: 0, borderRadius: 0 }}
                        >
                          {example.code}
                        </SyntaxHighlighter>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Quizzes adicionales al final */}
          {lesson.quiz_questions && lesson.quiz_questions.length > 0 && (
            <Card className="mb-6 border-purple-500/20">
              <button
                onClick={() => toggleSection('quizzes')}
                className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors rounded-t-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                    <Trophy className="text-purple-400" size={20} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-white">
                      Pon a Prueba tu Comprensión ({lesson.quiz_questions.length} preguntas)
                    </h3>
                    <p className="text-dark-500 text-xs mt-0.5">Responde estas preguntas para verificar que entendiste el tema</p>
                  </div>
                </div>
                {expandedSections.quizzes ? (
                  <ChevronUp className="text-dark-400" size={20} />
                ) : (
                  <ChevronDown className="text-dark-400" size={20} />
                )}
              </button>
              {expandedSections.quizzes && (
                <div className="px-4 pb-4">
                  {lesson.quiz_questions.map((quiz, index) => (
                    <QuizComponent key={index} quiz={quiz} />
                  ))}
                </div>
              )}
            </Card>
          )}

          {/* Completar lección */}
          <Card className={`mt-8 text-center border ${isCompleted ? 'border-primary-500/30 bg-primary-500/5' : 'border-dark-600'}`}>
            <div className="py-6">
              {isCompleted ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-primary-500/20 flex items-center justify-center">
                    <CheckCircle className="text-primary-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-primary-400">Leccion Completada</h3>
                  <p className="text-dark-400 text-sm">Has completado esta leccion. Sigue avanzando!</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-dark-700 flex items-center justify-center">
                    <Trophy className="text-dark-400" size={32} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Has terminado de leer?</h3>
                    <p className="text-dark-400 text-sm">Marca esta leccion como completada para registrar tu progreso</p>
                  </div>
                  <button
                    onClick={handleCompleteLesson}
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-emerald-500 hover:from-primary-600 hover:to-emerald-600 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/20"
                  >
                    <CheckCircle size={20} />
                    Completar Leccion
                  </button>
                </div>
              )}
            </div>
          </Card>

          {/* Navegación */}
          <div className="flex justify-between items-center mt-6">
            <Link to={`/modules/${moduleId}`}>
              <Button variant="secondary">
                <ArrowLeft size={18} />
                Volver al módulo
              </Button>
            </Link>
            {lesson.nextLessonId && (
              <Link to={`/modules/${moduleId}/lessons/${lesson.nextLessonId}`}>
                <Button variant="primary">
                  Siguiente lección
                  <ArrowRight size={18} />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
