
import { 
  Calculator, 
  Users, 
  ClipboardList, 
  FileText, 
  ShoppingCart,
  Box
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

type MenuItem = {
  name: string;
  path: string;
  icon: React.ReactNode;
};

type SidebarMenuItemsProps = {
  isHovering: boolean;
  closeMobileMenu: () => void;
};

const SidebarMenuItems = ({ isHovering, closeMobileMenu }: SidebarMenuItemsProps) => {
  const location = useLocation();
  
  const menuItems: MenuItem[] = [
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
      icon: <Box size={20} />
    },
    {
      name: 'Simulador de Salário',
      path: '/dashboard/salary-simulator',
      icon: <Calculator size={20} />
    }
  ];

  return (
    <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
      {menuItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center px-4 py-3 text-sm font-medium rounded-md transition-colors
              ${isActive
                ? 'bg-brand-blue text-white'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            onClick={closeMobileMenu}
          >
            <span className="mr-3">{item.icon}</span>
            <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
};

export default SidebarMenuItems;
