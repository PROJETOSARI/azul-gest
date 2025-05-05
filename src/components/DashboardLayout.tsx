
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Footer from './Footer';
import Sidebar from './dashboard/Sidebar';
import BackButton from './dashboard/BackButton';
import MobileMenuButton from './dashboard/MobileMenuButton';

const DashboardLayout = () => {
  const { isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Back arrow button */}
      <div className="fixed top-4 left-16 z-30 lg:left-24">
        <BackButton />
      </div>

      <div className="lg:hidden fixed top-4 left-4 z-30">
        <MobileMenuButton 
          isMobileMenuOpen={isMobileMenuOpen} 
          toggleMobileMenu={toggleMobileMenu} 
        />
      </div>

      <Sidebar 
        isHovering={isHovering}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsHovering={setIsHovering}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
      />

      <div className={`flex-1 flex flex-col overflow-hidden transition-all duration-300 ease-in-out ${isHovering ? 'lg:ml-64' : 'lg:ml-20'}`}>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-950 p-4 md:p-6">
          <Outlet />
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
