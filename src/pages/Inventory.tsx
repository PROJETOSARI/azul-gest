
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Archive, Plus, Filter, Search, AlertCircle, Clock, Package, Eye } from 'lucide-react';
import { useInventory } from '@/contexts/InventoryContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { InventoryItem } from '@/types/inventory';
import { formatDate } from '@/lib/utils';

const Inventory = () => {
  const { 
    filteredItems, 
    categories, 
    departments, 
    activeFilters,
    setFilterCategory,
    setFilterDepartment,
    setSearchTerm
  } = useInventory();
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const getDaysUntilExpiration = (expirationDate: string | null): number | null => {
    if (!expirationDate) return null;
    
    const expirationTime = new Date(expirationDate).getTime();
    const currentTime = new Date().getTime();
    return Math.floor((expirationTime - currentTime) / (1000 * 3600 * 24));
  };

  const renderExpirationBadge = (item: InventoryItem) => {
    if (!item.expirationDate) return null;
    
    const daysUntil = getDaysUntilExpiration(item.expirationDate);
    
    if (daysUntil !== null) {
      if (daysUntil < 0) {
        return <Badge variant="destructive" className="ml-2">Expirado</Badge>;
      } else if (daysUntil < 30) {
        return <Badge variant="warning" className="ml-2 bg-yellow-500">Expira em {daysUntil} dias</Badge>;
      }
    }
    
    return null;
  };

  const renderQuantityStatus = (item: InventoryItem) => {
    if (item.quantity <= 0) {
      return <Badge variant="destructive">Sem estoque</Badge>;
    } else if (item.quantity < item.minQuantity) {
      return <Badge variant="warning" className="bg-yellow-500">Baixo estoque</Badge>;
    } else {
      return <Badge variant="secondary" className="bg-green-500 text-white">Estoque normal</Badge>;
    }
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Almoxarifado</h1>
          <p className="text-gray-600 dark:text-gray-300">Gerenciamento de estoque e inventário</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-2">
          <Button asChild>
            <Link to="/dashboard/inventory/new">
              <Plus className="mr-2 h-4 w-4" /> Novo Item
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="mr-2 h-4 w-4" /> Filtros
          </Button>
        </div>
      </div>
      
      {isFilterOpen && (
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle>Filtros</CardTitle>
            <CardDescription>Filtre os itens por categoria, departamento ou termo de busca</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select 
                  value={activeFilters.category} 
                  onValueChange={(value) => setFilterCategory(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as categorias" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Todas as categorias</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Departamento</label>
                <Select 
                  value={activeFilters.department} 
                  onValueChange={(value) => setFilterDepartment(value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os departamentos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">Todos os departamentos</SelectItem>
                    {departments.map(dept => (
                      <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Buscar</label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input 
                    placeholder="Buscar por nome ou descrição" 
                    className="pl-8"
                    value={activeFilters.search}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Quantidade</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center text-gray-500 dark:text-gray-400">
                        <Archive className="h-8 w-8 mb-2" />
                        <p>Nenhum item encontrado</p>
                        {(activeFilters.category !== 'All' || activeFilters.department !== 'All' || activeFilters.search !== '') && (
                          <Button 
                            variant="link" 
                            onClick={() => {
                              setFilterCategory('All');
                              setFilterDepartment('All');
                              setSearchTerm('');
                            }}
                          >
                            Limpar filtros
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredItems.map((item) => (
                    <TableRow key={item.id} className="group">
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium truncate">{item.name}</span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 truncate">{item.location}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{item.department}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span>{item.quantity}</span>
                          {item.isOpen && (
                            <Badge variant="secondary" className="ml-2 bg-blue-500 text-white">Aberto</Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col space-y-1">
                          {renderQuantityStatus(item)}
                          {renderExpirationBadge(item)}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="invisible group-hover:visible"
                          asChild
                        >
                          <Link to={`/dashboard/inventory/${item.id}`}>
                            <Eye className="h-4 w-4 mr-1" /> Visualizar
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Itens com baixo estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems.filter(item => item.quantity < item.minQuantity).slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b last:border-0">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.quantity}/{item.minQuantity}</span>
                </div>
              ))}
              {filteredItems.filter(item => item.quantity < item.minQuantity).length === 0 && (
                <div className="flex justify-center items-center p-4 text-gray-500">
                  <p>Nenhum item com baixo estoque</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Próximos a vencer</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems
                .filter(item => {
                  const daysUntil = getDaysUntilExpiration(item.expirationDate);
                  return daysUntil !== null && daysUntil < 30 && daysUntil >= 0;
                })
                .slice(0, 5)
                .map(item => (
                  <div key={item.id} className="flex justify-between items-center p-2 border-b last:border-0">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-yellow-500 mr-2" />
                      <span>{item.name}</span>
                    </div>
                    <span className="text-sm text-gray-500">
                      {getDaysUntilExpiration(item.expirationDate)} dias
                    </span>
                  </div>
                ))
              }
              {filteredItems.filter(item => {
                const daysUntil = getDaysUntilExpiration(item.expirationDate);
                return daysUntil !== null && daysUntil < 30 && daysUntil >= 0;
              }).length === 0 && (
                <div className="flex justify-center items-center p-4 text-gray-500">
                  <p>Nenhum item próximo ao vencimento</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Itens abertos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {filteredItems.filter(item => item.isOpen).slice(0, 5).map(item => (
                <div key={item.id} className="flex justify-between items-center p-2 border-b last:border-0">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-blue-500 mr-2" />
                    <span>{item.name}</span>
                  </div>
                  <span className="text-sm text-gray-500">{item.quantity} restantes</span>
                </div>
              ))}
              {filteredItems.filter(item => item.isOpen).length === 0 && (
                <div className="flex justify-center items-center p-4 text-gray-500">
                  <p>Nenhum item aberto</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
