import React, { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { 
  Home, 
  BookOpen, 
  Code2, 
  UserCircle,
  Menu,
  X,
  Github,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Elementos de navegación
  const navItems = [
    { path: '/', label: 'Inicio', icon: Home },
    { path: '/modules', label: 'Módulos', icon: BookOpen },
    { path: '/patterns', label: 'Patrones', icon: FileText },
    { path: '/practice', label: 'Práctica', icon: Code2 },
    { path: '/interview', label: 'Entrevista', icon: UserCircle },
    { path: '/career', label: 'Carrera', icon: Briefcase },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col">
      {/* ============================
          HEADER
          ============================ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-dark-900/95 backdrop-blur-sm border-b border-dark-700">
        <div className="container mx-auto px-4">
          <div className="flex items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow">
                <Code2 className="text-white" size={24} />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white group-hover:text-primary-400 transition-colors">
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

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 text-dark-300 hover:text-white"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-dark-800 border-t border-dark-700">
            <nav className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) => `
                    flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium
                    transition-all duration-200
                    ${isActive 
                      ? 'bg-primary-500/20 text-primary-400' 
                      : 'text-dark-300 hover:text-white hover:bg-dark-700'
                    }
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* ============================
          MAIN CONTENT
          ============================ */}
      <main className="flex-1 pt-16">
        <div className="animate-in">
          <Outlet />
        </div>
      </main>

      {/* ============================
          FOOTER
          ============================ */}
      <footer className="bg-dark-800 border-t border-dark-700 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
                  <Code2 className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-white">Algorint</span>
              </div>
              <p className="text-dark-400 max-w-md">
                Domina el código, conquista tu futuro. Aprende Algoritmos y Estructuras de Datos con Python. 
                Prepárate para entrevistas técnicas en empresas FAANG.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-white font-semibold mb-4">Enlaces Rápidos</h3>
              <ul className="space-y-2">
                {navItems.slice(0, 4).map((item) => (
                  <li key={item.path}>
                    <Link 
                      to={item.path}
                      className="text-dark-400 hover:text-primary-400 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-white font-semibold mb-4">Recursos</h3>
              <ul className="space-y-2">
                <li>
                  <a 
                    href="https://leetcode.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-1"
                  >
                    LeetCode <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://python.org" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-1"
                  >
                    Python Docs <ExternalLink size={12} />
                  </a>
                </li>
                <li>
                  <a 
                    href="https://github.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-dark-400 hover:text-primary-400 transition-colors flex items-center gap-1"
                  >
                    <Github size={14} /> GitHub
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-dark-700 mt-8 pt-8 text-center text-dark-500 text-sm">
            <p>© 2026 Algorint. Domina el código, conquista tu futuro.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
