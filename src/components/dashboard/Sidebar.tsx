
import { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '@/contexts/AuthContext';
import SidebarUserProfile from './SidebarUserProfile';
import SidebarMenuItems from './SidebarMenuItems';
import ThemeToggle from './ThemeToggle';

type SidebarProps = {
  isHovering: boolean;
  isMobileMenuOpen: boolean;
  setIsHovering: (value: boolean) => void;
  setIsMobileMenuOpen: (value: boolean) => void;
};

const Sidebar = ({ 
  isHovering, 
  isMobileMenuOpen, 
  setIsHovering, 
  setIsMobileMenuOpen 
}: SidebarProps) => {
  const { user, logout } = useAuth();
  
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

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

  return (
    <>
      <div 
        className={`fixed inset-y-0 left-0 transform lg:relative lg:translate-x-0 z-50
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isHovering ? 'lg:w-64' : 'lg:w-20'}
          transition-all duration-300 ease-in-out lg:flex lg:flex-col
          bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 shadow-sm`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex justify-center items-center">
              <img
                src="/placeholder.svg"
                alt="Logo"
                className="h-12 w-auto"
              />
            </div>
          </div>

          <SidebarUserProfile user={user} closeMobileMenu={closeMobileMenu} />

          <SidebarMenuItems isHovering={isHovering} closeMobileMenu={closeMobileMenu} />

          <div className="p-4 border-t border-gray-200 dark:border-gray-800 space-y-2">
            <ThemeToggle isHovering={isHovering} />
            
            <Button
              variant="outline"
              onClick={() => {
                logout();
                closeMobileMenu();
              }}
              className={`w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue ${!isHovering && 'lg:p-2'}`}
            >
              <LogOut size={16} />
              <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>Sair</span>
            </Button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};

export default Sidebar;
