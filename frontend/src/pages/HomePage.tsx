import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Code2, 
  BookOpen, 
  Trophy, 
  Zap,
  CheckCircle,
  ArrowRight,
  Play,
  Target,
  Brain,
  Rocket,
  Star,
  Clock,
  TrendingUp,
  BarChart3,
  FileText,
  Puzzle
} from 'lucide-react';
import { Button, Card, DifficultyBadge } from '../components/ui';

/**
 * HomePage - Landing Educativa
 * ============================
 * Página de inicio de Algorint que presenta:
 * - Hero section con CTA principal
 * - Propuesta de valor
 * - Roadmap visual simplificado
 * - Módulos destacados
 * - Testimonios/Estadísticas
 * - Call to action final
 */
const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* ============================
          HERO SECTION
          ============================ */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/10 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-secondary-500/10 via-transparent to-transparent" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-5" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-primary-500/10 border border-primary-500/30 rounded-full px-4 py-2 mb-8">
              <Star className="text-primary-400" size={16} />
              <span className="text-primary-400 text-sm font-medium">
                100% Gratuito • Preparación FAANG
              </span>
            </div>

            {/* Main heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Domina{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Algoritmos
              </span>
              <br />
              con el Método Feynman
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-dark-300 mb-10 max-w-2xl mx-auto">
              Aprende como explica{' '}
              <span className="text-white font-semibold">Richard Feynman</span>:
              {' '}conceptos complejos explicados de forma simple.
              Preparación completa para entrevistas FAANG.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/modules">
                <Button variant="primary" size="lg">
                  <Play size={20} />
                  Comenzar Ahora
                </Button>
              </Link>
              <Link to="/roadmap">
                <Button variant="outline" size="lg">
                  <BookOpen size={20} />
                  Ver Roadmap
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-8 mt-16 pt-8 border-t border-dark-700">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary-400">11</div>
                <div className="text-dark-400 mt-1">Módulos</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-secondary-400">15</div>
                <div className="text-dark-400 mt-1">Patrones FAANG</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-accent-400">200+</div>
                <div className="text-dark-400 mt-1">Ejercicios</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-green-400">100%</div>
                <div className="text-dark-400 mt-1">Gratis</div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-dark-600 flex items-start justify-center p-2">
            <div className="w-1 h-2 bg-primary-400 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ============================
          VALUE PROPOSITION
          ============================ */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              ¿Por qué Algorint?
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Diseñado con principios pedagógicos probados. Usamos el <strong className="text-white">Método Feynman</strong>:
              si no puedes explicarlo simple, no lo entiendes realmente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Feature 1 - Método Feynman */}
            <Card className="text-center group" hover>
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/20 flex items-center justify-center group-hover:bg-primary-500/30 transition-colors">
                <Brain className="text-primary-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Método Feynman
              </h3>
              <p className="text-dark-400">
                Cada concepto explicado como a un niño de 5 años. Si parece complejo, es que no está bien explicado.
              </p>
            </Card>

            {/* Feature 2 - Ejercicios Prácticos */}
            <Card className="text-center group" hover>
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary-500/20 flex items-center justify-center group-hover:bg-secondary-500/30 transition-colors">
                <Zap className="text-secondary-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Ejercicios Prácticos
              </h3>
              <p className="text-dark-400">
                Practica con ejercicios reales de entrevistas FAANG. Aprende haciendo.
              </p>
            </Card>

            {/* Feature 3 - 15 Patrones */}
            <Card className="text-center group" hover>
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent-500/20 flex items-center justify-center group-hover:bg-accent-500/30 transition-colors">
                <Target className="text-accent-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                15 Patrones FAANG
              </h3>
              <p className="text-dark-400">
                Los patrones exactos que preguntan en Google, Meta, Amazon. Domínalos y resuelve cualquier problema.
              </p>
            </Card>

            {/* Feature 4 - Repetición Espaciada */}
            <Card className="text-center group" hover>
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                <TrendingUp className="text-green-400" size={28} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Repetición Espaciada
              </h3>
              <p className="text-dark-400">
                Sistema científico de repaso. Recordarás cada algoritmo incluso meses después de aprenderlo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================
          LEARNING PATH PREVIEW
          ============================ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Tu Camino de Aprendizaje
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Un roadmap estructurado que te lleva desde los fundamentos hasta
              dominar algoritmos avanzados, listo para cualquier entrevista.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Learning Path Steps */}
            <div className="space-y-4">
              {learningPathSteps.map((step, index) => (
                <div key={index} className="flex gap-4 items-start group">
                  {/* Step indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold ${step.color}`}>
                      {step.number}
                    </div>
                    {index < learningPathSteps.length - 1 && (
                      <div className="w-0.5 h-16 bg-dark-700 mt-2" />
                    )}
                  </div>
                  
                  {/* Step content */}
                  <Card className="flex-1 group-hover:border-primary-500/30 transition-colors" padding="md">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {step.title}
                        </h3>
                        <p className="text-dark-400 text-sm">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-dark-500 text-sm">
                        <Clock size={14} />
                        {step.duration}
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      {step.topics.map((topic, i) => (
                        <span key={i} className="px-2 py-1 bg-dark-700 text-dark-300 text-xs rounded">
                          {topic}
                        </span>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link to="/roadmap">
                <Button variant="secondary">
                  Ver Roadmap Completo
                  <ArrowRight size={18} />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================
          FEATURED MODULES
          ============================ */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Módulos Destacados
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Explora nuestros módulos más populares y comienza tu preparación hoy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredModules.map((module, index) => (
              <Card key={index} hover className="group">
                {/* Module header */}
                <div className={`h-2 rounded-t-lg -mx-6 -mt-6 mb-4 ${module.gradient}`} />
                
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${module.iconBg}`}>
                    <module.icon size={24} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-white group-hover:text-primary-400 transition-colors">
                      {module.title}
                    </h3>
                    <p className="text-dark-400 text-sm mt-1">
                      {module.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-dark-700">
                  <div className="flex items-center gap-4 text-sm text-dark-500">
                    <span className="flex items-center gap-1">
                      <BookOpen size={14} />
                      {module.lessons} lecciones
                    </span>
                    <span className="flex items-center gap-1">
                      <Code2 size={14} />
                      {module.exercises} ejercicios
                    </span>
                  </div>
                  <ArrowRight size={18} className="text-dark-600 group-hover:text-primary-400 transition-colors" />
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/modules">
              <Button variant="primary">
                Ver Todos los Módulos
                <ArrowRight size={18} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ============================
          HOW IT WORKS
          ============================ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Cómo Funciona
            </h2>
            <p className="text-dark-400 text-lg max-w-2xl mx-auto">
              Un proceso de aprendizaje diseñado para maximizar tu retención y confianza.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative inline-block mb-6">
                  <div className={`w-20 h-20 rounded-2xl flex items-center justify-center ${step.bgColor}`}>
                    <step.icon size={36} className={step.iconColor} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-dark-700 border-2 border-dark-600 flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {step.title}
                </h3>
                <p className="text-dark-400">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================
          PRACTICE PREVIEW
          ============================ */}
      <section className="py-20 bg-dark-800/50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Practica con Ejercicios Reales
              </h2>
              <p className="text-dark-400 text-lg mb-8">
                Resuelve problemas tipo LeetCode con nuestro editor integrado.
                Recibe feedback instantáneo y mejora tu técnica con cada intento.
              </p>

              <ul className="space-y-4">
                {practiceFeatures.map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="text-primary-400 mt-1 flex-shrink-0" size={20} />
                    <span className="text-dark-200">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <Link to="/practice">
                  <Button variant="primary">
                    Empezar a Practicar
                    <ArrowRight size={18} />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Code editor preview */}
            <Card className="overflow-hidden" padding="none">
              <div className="bg-dark-900 px-4 py-3 border-b border-dark-700 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-dark-400 text-sm ml-2">two_sum.py</span>
                </div>
                <DifficultyBadge difficulty="easy" size="sm" />
              </div>
              <div className="p-4 font-mono text-sm">
                <pre className="text-dark-200">
                  <code>{codePreviewExample}</code>
                </pre>
              </div>
              <div className="bg-dark-900 px-4 py-3 border-t border-dark-700">
                <div className="flex items-center justify-between">
                  <span className="text-primary-400 text-sm flex items-center gap-2">
                    <CheckCircle size={16} />
                    ¡Todos los tests pasaron!
                  </span>
                  <span className="text-dark-500 text-sm">Runtime: 48ms</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* ============================
          CTA FINAL
          ============================ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="text-center py-16 px-8 bg-gradient-to-r from-primary-500/10 via-dark-800 to-secondary-500/10 border-primary-500/30">
            <div className="max-w-2xl mx-auto">
              <Rocket className="text-primary-400 mx-auto mb-6" size={48} />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¿Listo para Comenzar?
              </h2>
              <p className="text-dark-300 text-lg mb-8">
                No importa tu nivel actual. Desde fundamentos hasta algoritmos avanzados,
                Algorint te guía paso a paso hacia el dominio de la programación.
              </p>
              <Link to="/modules">
                <Button variant="primary" size="lg">
                  <Play size={20} />
                  Empezar Gratis
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};

// ============================================
// DATA
// ============================================

const learningPathSteps = [
  {
    number: 0,
    title: 'Fundamentos de Python',
    description: 'Variables, estructuras de control, funciones y POO básica.',
    duration: '4-6 horas',
    topics: ['Variables', 'Funciones', 'Clases', 'Manejo de errores'],
    color: 'bg-slate-600',
  },
  {
    number: 1,
    title: 'Análisis de Complejidad (Big O)',
    description: 'Aprende a evaluar la eficiencia de tus algoritmos.',
    duration: '2-3 horas',
    topics: ['Tiempo', 'Espacio', 'Notación', 'Comparaciones'],
    color: 'bg-blue-600',
  },
  {
    number: 2,
    title: 'Estructuras de Datos Básicas',
    description: 'Arrays, strings, stacks, queues y hash tables.',
    duration: '6-8 horas',
    topics: ['Arrays', 'Strings', 'Stacks', 'Hash Tables'],
    color: 'bg-green-600',
  },
  {
    number: 3,
    title: 'Estructuras Intermedias',
    description: 'Linked lists, árboles, grafos y heaps.',
    duration: '8-10 horas',
    topics: ['Linked Lists', 'Trees', 'Graphs', 'Heaps'],
    color: 'bg-yellow-600',
  },
  {
    number: 4,
    title: 'Algoritmos Clásicos',
    description: 'Sorting, searching, two pointers, sliding window.',
    duration: '8-10 horas',
    topics: ['Sorting', 'Binary Search', 'Two Pointers', 'Sliding Window'],
    color: 'bg-orange-600',
  },
  {
    number: 5,
    title: 'Algoritmos Avanzados',
    description: 'Recursión, backtracking, DP, grafos avanzados.',
    duration: '12-15 horas',
    topics: ['Recursión', 'DP', 'Backtracking', 'BFS/DFS'],
    color: 'bg-red-600',
  },
  {
    number: 6,
    title: 'Preparación para Entrevistas',
    description: 'Simulacros, patrones comunes y estrategias de comunicación.',
    duration: '6-8 horas',
    topics: ['Mock Interviews', 'Patrones', 'Comunicación', 'System Design'],
    color: 'bg-purple-600',
  },
];

const featuredModules = [
  {
    title: 'Big O Notation',
    description: 'Domina el análisis de complejidad temporal y espacial.',
    icon: BarChart3,
    gradient: 'bg-gradient-to-r from-blue-500 to-cyan-500',
    iconBg: 'bg-blue-500/20',
    lessons: 5,
    exercises: 10,
  },
  {
    title: 'Arrays & Strings',
    description: 'Fundamentos y técnicas avanzadas de manipulación.',
    icon: FileText,
    gradient: 'bg-gradient-to-r from-green-500 to-emerald-500',
    iconBg: 'bg-green-500/20',
    lessons: 8,
    exercises: 25,
  },
  {
    title: 'Dynamic Programming',
    description: 'De principiante a experto en programación dinámica.',
    icon: Puzzle,
    gradient: 'bg-gradient-to-r from-purple-500 to-pink-500',
    iconBg: 'bg-purple-500/20',
    lessons: 10,
    exercises: 30,
  },
];

const howItWorksSteps = [
  {
    title: 'Aprende el Concepto',
    description: 'Lee explicaciones claras con ejemplos visuales y analogías del mundo real.',
    icon: BookOpen,
    bgColor: 'bg-primary-500/20',
    iconColor: 'text-primary-400',
  },
  {
    title: 'Practica el Código',
    description: 'Escribe y ejecuta código en nuestro editor interactivo con feedback inmediato.',
    icon: Code2,
    bgColor: 'bg-secondary-500/20',
    iconColor: 'text-secondary-400',
  },
  {
    title: 'Domina el Patrón',
    description: 'Resuelve variaciones del problema hasta que el patrón sea segunda naturaleza.',
    icon: Trophy,
    bgColor: 'bg-accent-500/20',
    iconColor: 'text-accent-400',
  },
];

const practiceFeatures = [
  'Editor de código tipo VS Code con highlighting de sintaxis',
  'Ejecución de código en tiempo real con Python',
  'Tests automáticos para validar tu solución',
  'Sistema de pistas progresivas sin spoilers',
  'Comparación entre solución bruta y optimizada',
  'Análisis de complejidad automático',
];

const codePreviewExample = `def two_sum(nums: list[int], target: int) -> list[int]:
    """
    Encuentra dos números que sumen el target.
    Retorna sus índices.
    """
    seen = {}  # valor -> índice
    
    for i, num in enumerate(nums):
        complement = target - num
        
        if complement in seen:
            return [seen[complement], i]
        
        seen[num] = i
    
    return []  # No encontrado`;

export default HomePage;
