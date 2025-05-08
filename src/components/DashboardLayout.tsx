import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Layout,
  Menu,
  Users,
  FileText,
  FileBadge,
  ShoppingCart,
  ClipboardList,
  Calculator,
  DatabaseBackup,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ModeToggle } from "./ModeToggle";
import { useToast } from "@/hooks/use-toast";

const navigationItems = [
  { label: "Dashboard", path: "/dashboard", icon: <Layout className="h-5 w-5" /> },
  { label: "Funcionários", path: "/dashboard/employees", icon: <Users className="h-5 w-5" /> },
  { label: "Protocolos", path: "/dashboard/protocols", icon: <FileText className="h-5 w-5" /> },
  { label: "Licitações", path: "/dashboard/licitacoes", icon: <FileBadge className="h-5 w-5" /> },
  { label: "Compras", path: "/dashboard/compras", icon: <ShoppingCart className="h-5 w-5" /> },
  { label: "Inventário", path: "/dashboard/inventory", icon: <ClipboardList className="h-5 w-5" /> },
  { label: "Simulador Salarial", path: "/dashboard/salary-simulator", icon: <Calculator className="h-5 w-5" /> },
  { label: "Gerenciamento de Dados", path: "/dashboard/data-management", icon: <DatabaseBackup className="h-5 w-5" /> },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
      toast({
        title: "Logout realizado com sucesso!",
        description: "Você foi redirecionado para a página de login.",
      });
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      toast({
        variant: "destructive",
        title: "Erro ao fazer logout",
        description: "Por favor, tente novamente.",
      });
    }
  };

  return (
    <div className="flex h-screen bg-background antialiased">
      {/* Mobile Menu */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            className="md:hidden absolute top-4 left-4 text-muted-foreground hover:text-foreground rounded-full p-2"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 pt-6 w-72">
          <SheetHeader className="px-4 pb-4">
            <SheetTitle>Menu</SheetTitle>
            <SheetDescription>
              Navegue pelo sistema.
            </SheetDescription>
          </SheetHeader>
          <Separator />
          <div className="flex flex-col gap-2 py-4 px-2">
            {navigationItems.map((item) => (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${location.pathname.startsWith(item.path)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
          </div>
          <Separator />
          <div className="flex flex-col gap-2 py-4 px-4">
            <ModeToggle />
            <Button variant="outline" onClick={handleLogout} className="mt-2 w-full">
              Sair
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-secondary/50 border-r-border">
        <div className="h-16 border-b border-b-border flex items-center px-4">
          <Link to="/dashboard" className="font-semibold text-lg">
            Dashboard
          </Link>
        </div>
        <div className="flex flex-col gap-2 py-4 px-2">
          {navigationItems.map((item) => (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground ${location.pathname.startsWith(item.path)
                ? "bg-secondary text-foreground"
                : "text-muted-foreground"
                }`}
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-b-border flex items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <p className="font-semibold text-lg">
              {navigationItems.find((item) =>
                location.pathname.startsWith(item.path)
              )?.label || "Dashboard"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <ModeToggle />
            <p className="text-sm text-muted-foreground hidden lg:block">
              {user?.email}
            </p>
            <Avatar className="size-8">
              <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <Button variant="outline" onClick={handleLogout}>
              Sair
            </Button>
          </div>
        </header>
        <div className="flex-1 p-6">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
