import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Code2, 
  Brain,
  ArrowRight,
  Play,
  UserCircle,
  FileText,
  Sparkles
} from 'lucide-react';
import { Card } from '../components/ui';
import { useProgress } from '../context/ProgressContext';

/**
 * HomePage - Inicio limpio y directo
 * ===================================
 * Sin venta, sin ruido. Solo:
 * - Qué es Algorint (1 frase)
 * - 3 accesos directos a lo que puedes hacer
 * - Tu progreso si ya empezaste
 */
const HomePage: React.FC = () => {
  const { progress, getTotalProgress } = useProgress();
  const totalProgress = getTotalProgress();
  const hasStarted = totalProgress > 0 || Object.keys(progress.lessonProgress).length > 0;

  return (
    <div className="min-h-screen">
      {/* Hero - Simple y directo */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary-500/8 via-transparent to-transparent" />

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
              Aprende{' '}
              <span className="bg-gradient-to-r from-primary-400 to-secondary-400 bg-clip-text text-transparent">
                Algoritmos
              </span>
              {' '}de forma simple
            </h1>

            <p className="text-lg text-dark-300 mb-10 max-w-xl mx-auto">
              Explicaciones claras, ejercicios interactivos y practica para entrevistas tecnicas. 
              Todo gratis, sin cuenta, sin complicaciones.
            </p>

            <Link to="/modules">
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary-500/20">
                <Play size={20} />
                {hasStarted ? 'Continuar aprendiendo' : 'Empezar a aprender'}
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Qué puedes hacer - 3 tarjetas */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            {/* Aprender */}
            <Link to="/modules">
              <Card hover className="h-full group text-center py-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-primary-500/15 flex items-center justify-center group-hover:bg-primary-500/25 transition-colors">
                  <BookOpen className="text-primary-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Aprender</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  18 modulos desde lo basico hasta DP y grafos. Cada tema explicado simple con el Metodo Feynman.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-primary-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Ver modulos <ArrowRight size={14} />
                </div>
              </Card>
            </Link>

            {/* Practicar */}
            <Link to="/practice">
              <Card hover className="h-full group text-center py-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-secondary-500/15 flex items-center justify-center group-hover:bg-secondary-500/25 transition-colors">
                  <Code2 className="text-secondary-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Practicar</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  Ejercicios con editor de codigo integrado. Escribe, ejecuta y verifica tu solucion al instante.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-secondary-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Ir a practica <ArrowRight size={14} />
                </div>
              </Card>
            </Link>

            {/* Entrevistas */}
            <Link to="/interview">
              <Card hover className="h-full group text-center py-8">
                <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-accent-500/15 flex items-center justify-center group-hover:bg-accent-500/25 transition-colors">
                  <UserCircle className="text-accent-400" size={28} />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Entrevistas</h3>
                <p className="text-dark-400 text-sm leading-relaxed">
                  Simulacro de entrevista tecnica con timer, pistas y evaluacion. Practica como si fuera real.
                </p>
                <div className="mt-4 flex items-center justify-center gap-1 text-accent-400 text-sm font-medium group-hover:gap-2 transition-all">
                  Simular entrevista <ArrowRight size={14} />
                </div>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      {/* Progreso rápido - solo si ya empezó */}
      {hasStarted && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-500/15 flex items-center justify-center">
                    <Sparkles className="text-primary-400" size={22} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Tu progreso</h3>
                    <p className="text-dark-400 text-sm">
                      {progress.stats.totalLessonsCompleted} lecciones completadas
                      {progress.stats.totalExercisesSolved > 0 && ` · ${progress.stats.totalExercisesSolved} ejercicios resueltos`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="hidden sm:flex items-center gap-3">
                    <div className="w-32 h-2 bg-dark-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-primary-500 to-emerald-400 rounded-full transition-all duration-500"
                        style={{ width: `${totalProgress}%` }}
                      />
                    </div>
                    <span className="text-primary-400 text-sm font-medium">{totalProgress}%</span>
                  </div>
                  <Link to="/modules">
                    <button className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white text-sm rounded-lg transition-colors">
                      Continuar
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>
      )}

      {/* Recursos extra - compacto */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <Link to="/patterns">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-dark-600 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-purple-500/15 flex items-center justify-center">
                  <Brain className="text-purple-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium">Patrones de Algoritmos</h4>
                  <p className="text-dark-500 text-xs">Cheat sheet de los 15 patrones mas comunes</p>
                </div>
                <ArrowRight size={16} className="text-dark-600 group-hover:text-dark-400 transition-colors" />
              </div>
            </Link>
            <Link to="/career">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-dark-800 border border-dark-700 hover:border-dark-600 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-yellow-500/15 flex items-center justify-center">
                  <FileText className="text-yellow-400" size={20} />
                </div>
                <div className="flex-1">
                  <h4 className="text-white text-sm font-medium">Tips de Carrera</h4>
                  <p className="text-dark-500 text-xs">CV, portafolio y consejos para entrevistas</p>
                </div>
                <ArrowRight size={16} className="text-dark-600 group-hover:text-dark-400 transition-colors" />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
