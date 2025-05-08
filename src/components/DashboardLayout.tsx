
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { LogOut, User, Calculator, Users, ClipboardList, FileText, ShoppingCart, ArrowLeft, Package } from 'lucide-react';
import { Link, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Footer from './Footer';
import { useTheme } from '@/contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const DashboardLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { theme, toggleTheme } = useTheme();
  
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isMobileMenuOpen]);

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const menuItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: <Calculator size={20} />
    },
    {
      name: 'Funcionários',
      path: '/dashboard/employees',
      icon: <Users size={20} />
    },
    {
      name: 'Protocolos',
      path: '/dashboard/protocols',
      icon: <ClipboardList size={20} />
    },
    {
      name: 'Licitações',
      path: '/dashboard/licitacoes',
      icon: <FileText size={20} />
    },
    {
      name: 'Compras',
      path: '/dashboard/compras',
      icon: <ShoppingCart size={20} />
    },
    {
      name: 'Almoxarifado',
      path: '/dashboard/inventory',
      icon: <Package size={20} />
    },
    {
      name: 'Simulador de Salário',
      path: '/dashboard/salary-simulator',
      icon: <Calculator size={20} />
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Check if a path is active
  const isActive = (path: string) => {
    if (path === '/dashboard') {
      // Only match dashboard exactly
      return location.pathname === '/dashboard';
    }
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Back arrow button */}
      <div className="fixed top-4 left-16 z-30 lg:left-24">
        <Button
          variant="outline"
          size="icon"
          className="bg-card shadow-sm"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </div>

      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          className="bg-card"
          onClick={toggleMobileMenu}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"}
            />
          </svg>
        </Button>
      </div>

      <div 
        className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isHovering ? 'lg:w-64' : 'lg:w-20'}
          transition-all duration-300 ease-in-out lg:flex lg:flex-col
          bg-card border-r border-border shadow-sm`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-border">
            <div className="flex justify-center items-center h-12">
              <AnimatePresence initial={false}>
                {isHovering || isMobileMenuOpen ? (
                  <motion.div
                    key="full-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <img
                      src="/lovable-uploads/548e9647-6dbb-4efd-85de-1f3c66260f57.png"
                      alt="Logo Completa"
                      className="h-auto w-auto max-h-12 object-contain"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="icon-logo"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center justify-center"
                  >
                    <img
                      src="/lovable-uploads/9c4a204d-1c51-4b2f-906b-3c317974f925.png"
                      alt="Logo Ícone"
                      className="h-auto w-auto max-h-12 object-contain"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div 
            onClick={() => {
              navigate('/dashboard/profile');
              setIsMobileMenuOpen(false);
            }}
            className="px-4 py-4 border-b border-border cursor-pointer hover:bg-accent/50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className={`ml-3 ${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>
                <p className="text-sm font-medium text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.path);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors`,
                    active
                      ? 'bg-brand-blue text-white'
                      : 'text-foreground hover:bg-accent'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <Button
                variant="outline"
                onClick={toggleTheme}
                className={`w-full flex items-center justify-center gap-2 text-foreground ${!isHovering && 'lg:p-2'}`}
                size="sm"
              >
                {theme === 'dark' ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sun">
                      <circle cx="12" cy="12" r="4"/>
                      <path d="M12 2v2"/>
                      <path d="M12 20v2"/>
                      <path d="M4.93 4.93l1.41 1.41"/>
                      <path d="M17.66 17.66l1.41 1.41"/>
                      <path d="M2 12h2"/>
                      <path d="M20 12h2"/>
                      <path d="M6.34 17.66l-1.41 1.41"/>
                      <path d="M19.07 4.93l-1.41 1.41"/>
                    </svg>
                    <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>Modo Claro</span>
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-moon">
                      <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>
                    </svg>
                    <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>Modo Escuro</span>
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  logout();
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-center gap-2 text-foreground ${!isHovering && 'lg:p-2'}`}
              >
                <LogOut size={16} />
                <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>Sair</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-accent p-4 md:p-6">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
