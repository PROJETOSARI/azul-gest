
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
  Clipboard,
  History,
  Clock,
  Layers,
  TrendingDown
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from '@/components/ui/badge';
import { formatDate, formatDateTime } from '@/lib/utils';
import { useToast } from '@/components/ui/use-toast';
import { Separator } from '@/components/ui/separator';

const InventoryItemView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getInventoryItem, deleteInventoryItem, toggleItemOpen, getItemHistory } = useInventory();
  const { toast } = useToast();
  const [openDialog, setOpenDialog] = React.useState(false);

  const item = getInventoryItem(id || '');
  const historyRecords = id ? getItemHistory(id) : [];

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
      return <Badge className="bg-yellow-500 text-white">Estoque baixo</Badge>;
    } else {
      return <Badge className="bg-green-500 text-white">Estoque normal</Badge>;
    }
  };

  const handleDelete = () => {
    if (user) {
      deleteInventoryItem(item.id, user.name);
      toast({
        title: "Item removido",
        description: `${item.name} foi removido do inventário`,
      });
      navigate("/dashboard/inventory");
    }
  };

  const handleToggleOpen = () => {
    if (user) {
      toggleItemOpen(item.id, user.name);
      toast({
        title: item.isOpen ? "Item fechado" : "Item aberto",
        description: `${item.name} foi ${item.isOpen ? 'fechado' : 'aberto'} no inventário`,
      });
    }
  };

  const totalValue = item.quantity * item.unitPrice;
  
  // Cálculo do valor gasto (quantidade consumida * preço unitário)
  const consumedQuantity = item.initialQuantity - item.quantity;
  const consumedValue = consumedQuantity * item.unitPrice;
  
  // Cálculo da porcentagem consumida
  const consumedPercentage = Math.round((consumedQuantity / item.initialQuantity) * 100);

  return (
    <div className="max-w-4xl mx-auto pb-8 animate-fade-in">
      {/* Cabeçalho com botão de voltar e ações */}
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

      {/* Conteúdo principal */}
      <Tabs defaultValue="info">
        <TabsList className="mb-6">
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="history">Histórico</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info" className="space-y-6">
          {/* Card de informações básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Informações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Categoria</div>
                      <div className="font-medium">{item.category}</div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Departamento</div>
                      <div className="font-medium">{item.department}</div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Localização</div>
                    <div className="flex items-center font-medium">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      {item.location}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-2 gap-4">
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
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Última Atualização</div>
                    <div className="font-medium">{formatDate(item.lastUpdated)}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center">
                  <DollarSign className="h-5 w-5 mr-2" /> Valores e Quantidades
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Quantidades</div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <div className="text-sm">Atual:</div>
                        <div className="text-xl font-bold">{item.quantity}</div>
                      </div>
                      <div>
                        <div className="text-sm">Inicial:</div>
                        <div className="text-md">{item.initialQuantity}</div>
                      </div>
                      <div>
                        <div className="text-sm">Consumido:</div>
                        <div className="text-md flex items-center">
                          {consumedQuantity} 
                          <span className="text-xs ml-2 text-gray-500">({consumedPercentage}%)</span>
                        </div>
                      </div>
                      <div>
                        <div className="text-sm">Mínima:</div>
                        <div className="text-md">{item.minQuantity}</div>
                      </div>
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Valores</div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      <div>
                        <div className="text-sm">Unitário:</div>
                        <div>{item.unitPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                      </div>
                      <div>
                        <div className="text-sm">Total em estoque:</div>
                        <div className="font-medium">{totalValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</div>
                      </div>
                      <div className="col-span-2 mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                        <div className="text-sm flex items-center mb-1">
                          <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                          Valor consumido:
                        </div>
                        <div className="text-xl font-bold text-red-600">
                          {consumedValue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Card de descrição */}
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
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <History className="h-5 w-5 mr-2" />
                Histórico de Alterações
              </CardTitle>
              <CardDescription>
                Registro completo de todas as alterações feitas neste item
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {historyRecords.length > 0 ? (
                  historyRecords.map(record => (
                    <div key={record.id} className="flex gap-4 pb-6 border-b last:border-0">
                      <div className={`mt-0.5 p-2 rounded-full ${
                        record.action === 'Adicionado' ? 'bg-green-100' : 
                        record.action === 'Atualizado' ? 'bg-blue-100' : 
                        record.action === 'Removido' ? 'bg-red-100' :
                        record.action === 'Aberto' ? 'bg-purple-100' : 'bg-orange-100'
                      }`}>
                        {record.action === 'Adicionado' && <Package size={16} className="text-green-600" />}
                        {record.action === 'Atualizado' && <Edit size={16} className="text-blue-600" />}
                        {record.action === 'Removido' && <Trash2 size={16} className="text-red-600" />}
                        {record.action === 'Aberto' && <Package size={16} className="text-purple-600" />}
                        {record.action === 'Fechado' && <Package size={16} className="text-orange-600" />}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <div>
                            <div className="font-medium">{record.action}</div>
                            <div className="text-sm text-gray-500">
                              Por: {record.userName}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-500">
                              {formatDateTime(record.timestamp)}
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-2 text-sm">
                          {record.details}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>Nenhum registro de atividade encontrado</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InventoryItemView;
