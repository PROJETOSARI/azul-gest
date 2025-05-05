
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/contexts/AuthContext';

type SidebarUserProfileProps = {
  user: UserType | null;
  closeMobileMenu: () => void;
};

const SidebarUserProfile = ({ user, closeMobileMenu }: SidebarUserProfileProps) => {
  const navigate = useNavigate();
  
  return (
    <div 
      onClick={() => {
        navigate('/dashboard/profile');
        closeMobileMenu();
      }}
      className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center">
        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-brand-blue flex items-center justify-center text-white">
          <User size={20} />
        </div>
        <div className="ml-3 transition-opacity duration-300">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
        </div>
      </div>
    </div>
  );
};

export default SidebarUserProfile;
