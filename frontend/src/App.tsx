import React, { Suspense, Component, ReactNode, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams, Link, useLocation } from 'react-router-dom';

// Layout
import MainLayout from './components/layout/MainLayout';

// Pages
import HomePage from './pages/HomePage';
import ModulesPage from './pages/ModulesPage';
import ModuleDetailPage from './pages/ModuleDetailPage';
import LessonPage from './pages/LessonPage';
import PracticePage from './pages/PracticePage';
import ExercisePage from './pages/ExercisePage';
import InterviewModePage from './pages/InterviewModePage';
import PatternCheatSheetPage from './pages/PatternCheatSheetPage';
import CareerTipsPage from './pages/CareerTipsPage';

// Context
import { ProgressProvider } from './context/ProgressContext';

/**
 * ScrollToTop Component
 * =====================
 * Resetea el scroll al tope de la página cuando cambia la ruta.
 * Esto evita problemas de navegación donde la página se queda scrolleada.
 */
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

/**
 * Loading Component
 * =================
 * Componente de carga mientras se cargan las páginas
 */
const LoadingFallback = () => (
  <div className="min-h-screen bg-dark-900 flex items-center justify-center">
    <div className="text-center">
      <div className="w-12 h-12 border-4 border-primary-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-dark-400">Cargando...</p>
    </div>
  </div>
);

/**
 * Error Boundary Component
 * ========================
 * Captura errores en componentes hijos para evitar pantallas blancas/negras
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error capturado por ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
          <div className="bg-dark-800 rounded-xl p-8 max-w-md text-center border border-dark-700">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Algo salió mal</h2>
            <p className="text-dark-400 mb-6">Ha ocurrido un error inesperado. Por favor, intenta de nuevo.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
              >
                Recargar página
              </button>
              <Link
                to="/"
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
              >
                Ir al inicio
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

/**
 * ModuleDetailPageWrapper
 * =======================
 * Wrapper para forzar re-mount cuando cambia moduleId.
 */
const ModuleDetailPageWrapper = () => {
  const { moduleId } = useParams();
  return <ModuleDetailPage key={moduleId} />;
};

/**
 * LessonPageWrapper
 * =================
 * Wrapper que usa key para forzar re-mount cuando cambia lessonId.
 * Esto soluciona el problema de que la página se queda en blanco
 * al navegar entre lecciones sin recargar.
 */
const LessonPageWrapper = () => {
  const { moduleId, lessonId } = useParams();
  return <LessonPage key={`${moduleId}-${lessonId}`} />;
};

/**
 * ExercisePageWrapper
 * ===================
 * Wrapper similar para ejercicios.
 */
const ExercisePageWrapper = () => {
  const { exerciseId } = useParams();
  return <ExercisePage key={exerciseId} />;
};

/**
 * App Component
 * =============
 * Componente raíz de la aplicación AlgoMaster.
 * 
 * Estructura de rutas:
 * - / : Página de inicio
 * - /modules : Lista de todos los módulos
 * - /modules/:moduleId : Detalle de un módulo específico
 * - /modules/:moduleId/lessons/:lessonId : Lección individual
 * - /practice : Área de práctica con ejercicios
 * - /practice/:exerciseId : Ejercicio específico
 * - /interview : Modo entrevista simulada
 */
function App() {
  return (
    <ErrorBoundary>
      <ProgressProvider>
        <Router>
          <ScrollToTop />
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Ejercicios: fullscreen sin layout (sin footer) */}
              <Route path="practice/:exerciseId" element={<ExercisePageWrapper />} />

              {/* Todas las demás rutas usan el layout principal */}
              <Route path="/" element={<MainLayout />}>
                  {/* Página de inicio */}
                  <Route index element={<HomePage />} />
                  
                  {/* Módulos educativos */}
                  <Route path="modules" element={<ModulesPage />} />
                  <Route path="modules/:moduleId" element={<ModuleDetailPageWrapper />} />
                  <Route path="modules/:moduleId/lessons/:lessonId" element={<LessonPageWrapper />} />
                  
                  {/* Área de práctica */}
                  <Route path="practice" element={<PracticePage />} />
                  
                  {/* Modo entrevista */}
                  <Route path="interview" element={<InterviewModePage />} />
                  
                  {/* Pattern Cheat Sheet - Método Feynman */}
                  <Route path="patterns" element={<PatternCheatSheetPage />} />
                  
                  {/* Consejos de Carrera */}
                  <Route path="career" element={<CareerTipsPage />} />
                </Route>
              </Routes>
          </Suspense>
        </Router>
      </ProgressProvider>
    </ErrorBoundary>
  );
}

export default App;
