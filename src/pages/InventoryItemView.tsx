
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
  DollarSign
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
        return <Badge variant="warning" className="bg-yellow-500">Expira em {daysUntil} dias</Badge>;
      } else {
        return <Badge variant="outline">Vence em {formatDate(item.expirationDate)}</Badge>;
      }
    }
  };

  const renderQuantityStatus = () => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Sem estoque</Badge>;
    } else if (item.quantity < item.minQuantity) {
      return <Badge variant="warning" className="bg-yellow-500">Baixo estoque</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-500 text-white">Estoque normal</Badge>;
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
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-2"
            onClick={() => navigate("/dashboard/inventory")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Detalhes do Item</h1>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleToggleOpen}
          >
            {item.isOpen ? 'Fechar Item' : 'Abrir Item'}
          </Button>
          <Button 
            variant="outline"
            asChild
          >
            <Link to={`/dashboard/inventory/edit/${item.id}`}>
              <Edit className="h-4 w-4 mr-1" /> Editar
            </Link>
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl">{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium">Categoria</div>
                  <Badge variant="outline" className="mt-1">{item.category}</Badge>
                </div>
                <div>
                  <div className="text-sm font-medium">Departamento</div>
                  <Badge variant="outline" className="mt-1">{item.department}</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium mb-1">Localização</div>
                <div className="flex items-center text-gray-700 dark:text-gray-300">
                  <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                  {item.location}
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm font-medium mb-1">Status</div>
                  <div className="flex items-center space-x-2">
                    {renderQuantityStatus()}
                    {item.isOpen && <Badge className="bg-blue-500 text-white">Aberto</Badge>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-1">Data de Vencimento</div>
                  <div className="flex items-center">
                    {item.expirationDate && (
                      <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                    )}
                    {renderExpirationBadge()}
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <div className="text-sm font-medium mb-1">Última Atualização</div>
                <div className="text-gray-700 dark:text-gray-300">
                  {formatDate(item.lastUpdated)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quantidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm">Quantidade atual</div>
                  <div className="font-medium text-lg">{item.quantity}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">Quantidade mínima</div>
                  <div className="text-gray-700 dark:text-gray-300">{item.minQuantity}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">Status</div>
                  <div>{renderQuantityStatus()}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Valores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div className="text-sm">Valor unitário</div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-sm">Valor total em estoque</div>
                  <div className="flex items-center font-semibold">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default InventoryItemView;
