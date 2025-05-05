
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { LogOut, User, Calculator, Users, ClipboardList, FileText, ShoppingCart, ArrowLeft, Package, Moon, Sun } from 'lucide-react';
import { Link, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import Footer from './Footer';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Switch } from "@/components/ui/switch";

const DashboardLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { theme, setTheme } = useTheme();
  
  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);
  
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
      path: '/dashboard/almoxarifado',
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      {/* Back arrow button */}
      <motion.div 
        className="fixed top-4 left-16 z-30 lg:left-24"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-800 shadow-sm"
          onClick={handleGoBack}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
      </motion.div>

      <motion.div 
        className="lg:hidden fixed top-4 left-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Button
          variant="outline"
          size="icon"
          className="bg-white dark:bg-gray-800"
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
      </motion.div>

      <motion.div 
        className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isHovering ? 'lg:w-64' : 'lg:w-20'}
          transition-all duration-300 ease-in-out lg:flex lg:flex-col
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        initial={{ x: -100 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex flex-col h-full">
          <motion.div 
            className="p-4 border-b border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex justify-center items-center">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
          </motion.div>

          <motion.div 
            onClick={() => {
              navigate('/dashboard/profile');
              setIsMobileMenuOpen(false); // Close menu when clicking on profile
            }}
            className="px-4 py-4 border-b border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className={`ml-3 ${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
              </div>
            </div>
          </motion.div>

          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.05, duration: 0.3 }}
                >
                  <Link
                    to={item.path}
                    className={`flex items-center w-full px-4 py-3 text-sm font-medium rounded-md transition-colors text-left
                      ${isActive
                        ? 'bg-brand-blue text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>{item.name}</span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>

          {/* Theme toggle */}
          <motion.div
            className="px-4 py-3 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm text-gray-700 dark:text-gray-300 ${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>
                {theme === 'dark' ? 'Modo Escuro' : 'Modo Claro'}
              </span>
              <div className="flex items-center space-x-2">
                <Sun className={`h-4 w-4 ${theme === 'light' ? 'text-yellow-500' : 'text-gray-400'}`} />
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                />
                <Moon className={`h-4 w-4 ${theme === 'dark' ? 'text-blue-400' : 'text-gray-400'}`} />
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="p-4 border-t border-gray-200 dark:border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.3 }}
          >
            <Button
              variant="outline"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-start gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue ${!isHovering && 'lg:p-2'}`}
            >
              <LogOut size={16} />
              <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>Sair</span>
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {isMobileMenuOpen && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleMobileMenu}
          />
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 md:p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="min-h-[calc(100vh-150px)]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
