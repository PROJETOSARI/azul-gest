
import { Sun, Moon, Laptop } from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

type ThemeToggleProps = {
  isHovering: boolean;
};

const ThemeToggle = ({ isHovering }: ThemeToggleProps) => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm"
          className={`w-full flex items-center justify-center gap-2 text-gray-700 dark:text-gray-300 hover:text-brand-blue ${!isHovering && 'lg:p-2'}`}
        >
          {theme === "light" ? (
            <Sun className="h-4 w-4" />
          ) : theme === "dark" ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Laptop className="h-4 w-4" />
          )}
          <span className={`${!isHovering && 'lg:hidden'} transition-opacity duration-300`}>
            {theme === "light" ? "Claro" : theme === "dark" ? "Escuro" : "Sistema"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          <span>Claro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          <span>Escuro</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Laptop className="mr-2 h-4 w-4" />
          <span>Sistema</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
