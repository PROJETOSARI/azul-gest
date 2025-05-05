
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Package, ArrowLeft, Calendar, Edit, Trash2, 
  Box, PackageOpen, Clock, User, MapPin
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { InventoryItem, MOCK_INVENTORY_ITEMS } from "@/types/inventory";

const InventoryItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<InventoryItem | null>(
    MOCK_INVENTORY_ITEMS.find(item => item.id === id) || null
  );

  const handleOpenItem = () => {
    if (!item) return;
    
    setItem({
      ...item,
      isOpen: true,
      openedAt: new Date(),
      openedBy: "Usuário Atual" // Idealmente viria do contexto de autenticação
    });
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <h3 className="text-xl font-semibold">Item não encontrado</h3>
        <p className="text-muted-foreground mt-2">
          O item que você está procurando não existe ou foi removido.
        </p>
        <Button 
          className="mt-6" 
          onClick={() => navigate('/dashboard/inventory')}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o inventário
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboard/inventory')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{item.name}</h2>
            <p className="text-muted-foreground">
              {item.category.name} | {item.department.name}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => navigate(`/dashboard/inventory/${id}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" /> Editar
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" /> Excluir
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O item será removido permanentemente do inventário.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    // Aqui seria feita a integração com API para excluir
                    navigate('/dashboard/inventory');
                  }}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Informações do Item</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Badge variant={item.isOpen ? "destructive" : "secondary"}>
                  {item.isOpen ? (
                    <><PackageOpen className="h-3 w-3 mr-1" /> Aberto</>
                  ) : (
                    <><Package className="h-3 w-3 mr-1" /> Fechado</>
                  )}
                </Badge>
                <Badge variant={item.quantity <= item.minStock ? "destructive" : "outline"} className="ml-2">
                  {item.quantity} unidades
                </Badge>
              </div>
              
              {item.description && (
                <div>
                  <h3 className="font-medium mb-1">Descrição</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              )}
              
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium mb-1 flex items-center gap-1">
                    <Box className="h-4 w-4" /> Estoque
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-sm text-muted-foreground">Quantidade Atual</p>
                      <p className="font-medium text-lg">{item.quantity}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estoque Mínimo</p>
                      <p className="font-medium text-lg">{item.minStock}</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1 flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> Localização
                  </h3>
                  <p className="text-muted-foreground">{item.location || "Não especificada"}</p>
                </div>
                
                <div>
                  <h3 className="font-medium mb-1 flex items-center gap-1">
                    <Calendar className="h-4 w-4" /> Data de Vencimento
                  </h3>
                  <p className="text-muted-foreground">
                    {item.expirationDate ? formatDate(item.expirationDate) : "Não se aplica"}
                  </p>
                </div>
                
                {item.isOpen && (
                  <div>
                    <h3 className="font-medium mb-1 flex items-center gap-1">
                      <Clock className="h-4 w-4" /> Aberto em
                    </h3>
                    <p className="text-muted-foreground">{formatDate(item.openedAt)}</p>
                    {item.openedBy && (
                      <p className="text-xs flex items-center mt-1">
                        <User className="h-3 w-3 mr-1" /> Por: {item.openedBy}
                      </p>
                    )}
                  </div>
                )}
              </div>
              
              <Separator />
              
              <div>
                <h3 className="font-medium mb-1">Histórico do Item</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Data de Cadastro:
                    </span>
                    <span className="font-medium">{formatDate(item.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Última Atualização:
                    </span>
                    <span className="font-medium">{formatDate(item.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ações</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!item.isOpen && (
              <Button className="w-full" onClick={handleOpenItem}>
                <PackageOpen className="mr-2 h-4 w-4" /> Abrir Item
              </Button>
            )}
            <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard/inventory/${id}/movement`)}>
              Registrar Movimento
            </Button>
            <Button variant="outline" className="w-full" onClick={() => navigate(`/dashboard/inventory/${id}/history`)}>
              Ver Histórico Completo
            </Button>
            <Separator />
            <div className="space-y-2">
              <h3 className="font-medium">Secretaria Responsável</h3>
              <div className="flex items-center gap-2 p-2 border rounded-md">
                <div className="bg-primary/10 rounded-full p-2">
                  <User className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-medium">{item.department.name}</p>
                  {item.department.code && (
                    <p className="text-xs text-muted-foreground">Código: {item.department.code}</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryItemDetails;
