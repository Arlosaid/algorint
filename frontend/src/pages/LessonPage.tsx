import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Clock,
  Code2,
  Lightbulb,
  Loader2,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Card, Button, DifficultyBadge } from '../components/ui';

/**
 * LessonPage
 * ==========
 * Pagina de leccion individual con:
 * - Contenido en Markdown con syntax highlighting
 * - Navegacion entre lecciones
 */

// ============================================
// TIPOS
// ============================================

interface ContentBlock {
  type: string; // "text", "code", "info", "warning"
  content?: string;
  language?: string;
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
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================

const LessonPage: React.FC = () => {
  const { moduleId, lessonId } = useParams<{ moduleId: string; lessonId: string }>();
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Estado de secciones expandidas
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    keyPoints: true,
    codeExamples: true
  });

  // Cargar leccion
  useEffect(() => {
    const fetchLesson = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:8000/api/v1/lessons/${lessonId}`);
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
    }
  }, [lessonId]);

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
          <p className="text-dark-400">Cargando leccion...</p>
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

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <div className="bg-dark-800 border-b border-dark-700">
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Contenido principal */}
          <div>
            {/* Contenido en bloques */}
            <Card className="mb-6">
              <div className="prose prose-invert prose-lg max-w-none p-4">
                {lesson.content.map((block, index) => {
                  if (block.type === 'text') {
                    return (
                      <ReactMarkdown
                        key={index}
                        components={{
                          code({ node, inline, className, children, ...props }: any) {
                            const match = /language-(\w+)/.exec(className || '');
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={oneDark}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, '')}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={`${className} bg-dark-700 px-1.5 py-0.5 rounded text-primary-400`} {...props}>
                                {children}
                              </code>
                            );
                          }
                        }}
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
                      <div key={index} className="my-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-300">{block.content}</p>
                      </div>
                    );
                  }
                  
                  if (block.type === 'warning') {
                    return (
                      <div key={index} className="my-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
                        <p className="text-amber-300">{block.content}</p>
                      </div>
                    );
                  }
                  
                  return null;
                })}
              </div>
            </Card>

            {/* Explicación Feynman */}
            {lesson.feynman_explanation && (
              <Card className="mb-6">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                      <Lightbulb className="text-green-400" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Explicación Simple (Método Feynman)</h3>
                  </div>
                  <p className="text-dark-300">{lesson.feynman_explanation}</p>
                </div>
              </Card>
            )}

            {/* Código esencial */}
            {lesson.core_code_snippet && (
              <Card className="mb-6">
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <Code2 className="text-primary-400" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Código Esencial</h3>
                  </div>
                  <SyntaxHighlighter
                    language="python"
                    style={oneDark}
                    customStyle={{ borderRadius: '0.5rem' }}
                  >
                    {lesson.core_code_snippet}
                  </SyntaxHighlighter>
                </div>
              </Card>
            )}

            {/* Ejemplos de código */}
            {lesson.codeExamples && lesson.codeExamples.length > 0 && (
              <Card className="mb-6">
                <button
                  onClick={() => toggleSection('codeExamples')}
                  className="w-full flex items-center justify-between p-4 hover:bg-dark-700/50 transition-colors rounded-t-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary-500/20 flex items-center justify-center">
                      <Code2 className="text-primary-400" size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-white">Ejemplos de Código</h3>
                  </div>
                  {expandedSections.codeExamples ? (
                    <ChevronUp className="text-dark-400" size={20} />
                  ) : (
                    <ChevronDown className="text-dark-400" size={20} />
                  )}
                </button>
                {expandedSections.codeExamples && (
                  <div className="px-4 pb-4 space-y-6">
                    {lesson.codeExamples.map((example, index) => (
                      <div key={index} className="border border-dark-700 rounded-lg overflow-hidden">
                        <div className="bg-dark-700/50 px-4 py-2 border-b border-dark-700">
                          <h4 className="font-medium text-white">{example.title}</h4>
                          {example.description && (
                            <p className="text-dark-400 text-sm mt-1">{example.description}</p>
                          )}
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
            )}

            {/* Navegacion */}
            <div className="flex justify-center items-center mt-8">
              <Link to={`/modules/${moduleId}`}>
                <Button variant="secondary">
                  <ArrowLeft size={18} />
                  Volver al modulo
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPage;
