
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import { LogOut, User, Calculator, Users, ClipboardList } from 'lucide-react';
import { Link, useLocation, Navigate, useNavigate, Outlet } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const DashboardLayout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  // Effect to handle body overflow when mobile menu is open
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
      name: 'Simulador de Salário',
      path: '/dashboard/salary-simulator',
      icon: <Calculator size={20} />
    }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-30">
        <Button
          variant="outline"
          size="icon"
          className="bg-white"
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

      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 z-20
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isHovering ? 'lg:w-64' : 'lg:w-20'}
          transition-all duration-300 ease-in-out lg:flex lg:flex-col
          bg-white border-r border-gray-200 shadow-sm`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-center items-center">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>

          {/* User Profile Section */}
          <div 
            onClick={() => {
              navigate('/dashboard/profile');
              setIsMobileMenuOpen(false);
            }}
            className="px-4 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
                <User size={20} />
              </div>
              <div className={`ml-3 ${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>
                <p className="text-sm font-medium text-gray-700">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
                    ${isActive
                      ? 'bg-brand-blue text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <span className="mr-3">{item.icon}</span>
                  <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="outline"
              onClick={() => {
                logout();
                setIsMobileMenuOpen(false);
              }}
              className={`w-full flex items-center justify-center gap-2 text-gray-700 hover:text-brand-blue ${!isHovering && 'lg:p-2'}`}
            >
              <LogOut size={16} />
              <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with overlay */}
      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Mobile menu overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
            onClick={toggleMobileMenu}
          />
        )}
        
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
