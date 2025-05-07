
import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { 
  Package, 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2, 
  ArrowLeft,
  AlertCircle,
  DollarSign,
  Clipboard
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const InventoryItemView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getInventoryItem, deleteInventoryItem, toggleItemOpen } = useInventory();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = React.useState(false);

  const item = getInventoryItem(id || '');

  if (!item) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-16">
        <AlertCircle className="h-16 w-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Item não encontrado</h2>
        <p className="text-gray-600 mb-6">O item que você está procurando não existe ou foi removido.</p>
        <Button asChild>
          <Link to="/dashboard/inventory">
            <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o Almoxarifado
          </Link>
        </Button>
      </div>
    );
  }

  const getDaysUntilExpiration = (expirationDate: string | null): number | null => {
    if (!expirationDate) return null;
    
    const expirationTime = new Date(expirationDate).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((expirationTime - currentTime) / (1000 * 3600 * 24));
  };

  const renderExpirationBadge = () => {
    if (!item.expirationDate) return <Badge variant="outline">Sem data de vencimento</Badge>;
    
    const daysUntil = getDaysUntilExpiration(item.expirationDate);
    
    if (daysUntil !== null) {
      if (daysUntil < 0) {
        return <Badge variant="destructive">Expirado</Badge>;
      } else if (daysUntil < 30) {
        return <Badge className="bg-yellow-500 text-white">Expira em {daysUntil} dias</Badge>;
      } else {
        return <Badge variant="outline">Vence em {formatDate(item.expirationDate)}</Badge>;
      }
    }
  };

  const renderQuantityStatus = () => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Sem estoque</Badge>;
    } else if (item.quantity < item.minQuantity) {
      return <Badge className="bg-yellow-500 text-white">Baixo estoque</Badge>;
    } else {
      return <Badge className="bg-green-500 text-white">Estoque normal</Badge>;
    }
  };

  const handleDelete = () => {
    deleteInventoryItem(item.id);
    toast({
      title: "Item removido",
      description: `${item.name} foi removido do inventário`,
    });
    navigate("/dashboard/inventory");
  };

  const handleToggleOpen = () => {
    toggleItemOpen(item.id);
    toast({
      title: item.isOpen ? "Item fechado" : "Item aberto",
      description: `${item.name} foi ${item.isOpen ? 'fechado' : 'aberto'} no inventário`,
    });
  };

  const totalValue = item.quantity * item.unitPrice;

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Header with back button and actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate("/dashboard/inventory")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
          <h1 className="text-2xl font-bold">{item.name}</h1>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={item.isOpen ? "outline" : "default"}
            onClick={handleToggleOpen}
            size="sm"
          >
            {item.isOpen ? 'Fechar Item' : 'Abrir Item'}
          </Button>
          
          <Button 
            variant="outline"
            size="sm"
            asChild
          >
            <Link to={`/dashboard/inventory/edit/${item.id}`}>
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Link>
          </Button>
          
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-1" /> Remover
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Confirmar remoção</DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja remover este item do inventário? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpenDialog(false)}>Cancelar</Button>
                <Button variant="destructive" onClick={handleDelete}>Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Main content */}
      <div className="space-y-6">
        {/* Basic Info Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Informações Básicas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Categoria</div>
                  <div className="font-medium">{item.category}</div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Departamento</div>
                  <div className="font-medium">{item.department}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Localização</div>
                  <div className="flex items-center font-medium">
                    <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                    {item.location}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {renderQuantityStatus()}
                    {item.isOpen && <Badge className="bg-blue-500 text-white">Aberto</Badge>}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Data de Vencimento</div>
                  <div className="flex items-center mt-1">
                    {item.expirationDate && <Calendar className="h-4 w-4 mr-2 text-gray-500" />}
                    {renderExpirationBadge()}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Última Atualização</div>
                  <div className="font-medium">{formatDate(item.lastUpdated)}</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stock and Value Cards in flex layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stock Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <Package className="h-5 w-5 mr-2" /> Estoque
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Quantidade atual</span>
                  <span className="text-2xl font-semibold">{item.quantity}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Quantidade mínima</span>
                  <span className="text-lg">{item.minQuantity}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-4 px-6">
              <div className="w-full">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
                <div>{renderQuantityStatus()}</div>
              </div>
            </CardFooter>
          </Card>

          {/* Value Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium flex items-center">
                <DollarSign className="h-5 w-5 mr-2" /> Valores
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Valor unitário</span>
                  <span className="font-medium text-lg">{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Valor total em estoque</span>
                  <span className="text-2xl font-semibold">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Description Card */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium flex items-center">
              <Clipboard className="h-5 w-5 mr-2" /> Descrição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 dark:text-gray-300">{item.description || "Sem descrição disponível."}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryItemView;
