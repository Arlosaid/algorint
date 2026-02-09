import React from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Code2, 
  UserCircle,
  ExternalLink,
  FileText,
  Briefcase
} from 'lucide-react';

/**
 * MainLayout Component
 * ====================
 * Layout principal de la aplicación que incluye:
 * - Header con logo y navegación
 * - Sidebar de navegación (desktop)
 * - Mobile menu
 * - Footer
 * - Outlet para contenido de rutas
 */
const MainLayout: React.FC = () => {

  // Elementos de navegación
  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/modules', label: 'Módulos', icon: BookOpen },
    { path: '/patterns', label: 'Patrones', icon: FileText },
    { path: '/practice', label: 'Práctica', icon: Code2 },
    { path: '/interview', label: 'Entrevista', icon: UserCircle },
    { path: '/career', label: 'Carrera', icon: Briefcase },
  ];

  // Items para la barra inferior en móvil (los más importantes)
  const bottomNavItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/modules', label: 'Módulos', icon: BookOpen },
    { path: '/practice', label: 'Práctica', icon: Code2 },
    { path: '/interview', label: 'Entrevista', icon: UserCircle },
    { path: '/patterns', label: 'Patrones', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* ============================
          HEADER
          ============================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-14 md:h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 md:gap-3 group">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
                <Code2 className="text-white" size={18} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg md:text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
                  Algorint
                </h1>
              </div>
            </Link>

            {/* Desktop Navigation - Centered */}
            <nav className="hidden md:flex flex-1 items-center justify-center gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) => `
                    flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'text-dark-300 hover:text-white hover:bg-dark-800'
                    }
                  `}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            {/* Mobile: Carrera link (not in bottom nav) */}
            <div className="md:hidden ml-auto">
              <NavLink
                to="/career"
                className={({ isActive }) => `
                  flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all
                  ${isActive 
                    ? 'bg-primary-500/20 text-primary-400' 
                    : 'text-dark-400 hover:text-white hover:bg-dark-800'
                  }
                `}
              >
                <Briefcase size={14} />
                <span>Carrera</span>
              </NavLink>
            </div>
          </div>
        </div>
      </header>

      {/* ============================
          MOBILE BOTTOM NAV
          ============================ */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-t border-dark-700">
        <div className="flex justify-around items-center py-1.5 pb-[max(0.375rem,env(safe-area-inset-bottom))]">
          {bottomNavItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) => `
                flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg min-w-[3.5rem]
                transition-all duration-200
                ${isActive 
                  ? 'text-primary-400' 
                  : 'text-dark-500 hover:text-dark-300'
                }
              `}
            >
              <item.icon size={18} />
              <span className="text-[10px] font-medium leading-tight">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* ============================
          MAIN CONTENT
          ============================ */}
      <main className="flex-1 pt-14 md:pt-16 pb-16 md:pb-0">
        <div className="animate-in">
          <Outlet />
        </div>
      </main>

      {/* ============================
          FOOTER
          ============================ */}
      <footer className="hidden md:block bg-dark-800 border-t border-dark-700 py-6 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                <Code2 className="text-white" size={18} />
              </div>
              <span className="text-sm font-semibold text-dark-300">Algorint</span>
              <span className="text-dark-600 text-sm">— Aprende algoritmos de forma simple</span>
            </div>
            <div className="flex items-center gap-4 text-dark-500 text-sm">
              <a 
                href="https://leetcode.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-dark-300 transition-colors flex items-center gap-1"
              >
                LeetCode <ExternalLink size={10} />
              </a>
              <a 
                href="https://python.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-dark-300 transition-colors flex items-center gap-1"
              >
                Python <ExternalLink size={10} />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
