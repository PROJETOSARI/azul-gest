
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, Plus, Package, Box, Calendar, Eye, Edit, Trash2, PackageOpen, Users } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { InventoryItem, MOCK_INVENTORY_ITEMS, MOCK_CATEGORIES, MOCK_DEPARTMENTS, Category, Department } from "@/types/inventory";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Inventory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [items, setItems] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [filteredItems, setFilteredItems] = useState<InventoryItem[]>(MOCK_INVENTORY_ITEMS);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedDepartments, setSelectedDepartments] = useState<string[]>([]);
  const [showLowStock, setShowLowStock] = useState(false);
  const [showExpiring, setShowExpiring] = useState(false);

  useEffect(() => {
    let result = [...items];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategories.length > 0) {
      result = result.filter((item) => selectedCategories.includes(item.category.id));
    }

    // Apply department filter
    if (selectedDepartments.length > 0) {
      result = result.filter((item) => selectedDepartments.includes(item.department.id));
    }

    // Apply low stock filter
    if (showLowStock) {
      result = result.filter((item) => item.quantity <= item.minStock);
    }

    // Apply expiring filter (items expiring in the next 30 days)
    if (showExpiring) {
      const thirtyDaysFromNow = new Date();
      thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
      result = result.filter(
        (item) => item.expirationDate && item.expirationDate <= thirtyDaysFromNow
      );
    }

    setFilteredItems(result);
  }, [searchTerm, items, selectedCategories, selectedDepartments, showLowStock, showExpiring]);

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleToggleDepartment = (departmentId: string) => {
    setSelectedDepartments((prev) =>
      prev.includes(departmentId)
        ? prev.filter((id) => id !== departmentId)
        : [...prev, departmentId]
    );
  };

  const handleOpenItem = (id: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === id && !item.isOpen) {
          return {
            ...item,
            isOpen: true,
            openedAt: new Date(),
            openedBy: "Usuário Atual", // Idealmente viria do contexto de autenticação
          };
        }
        return item;
      })
    );
  };

  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "N/A";
    return format(date, "dd/MM/yyyy", { locale: ptBR });
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-3xl font-bold tracking-tight">Almoxarifado</h2>
          <p className="text-muted-foreground">
            Gerencie todos os itens do seu estoque de forma eficiente.
          </p>
        </div>
        <Button 
          onClick={() => navigate("/dashboard/inventory/new")} 
          className="w-full sm:w-auto"
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar Item
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-[1fr_auto] items-start">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar itens..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filtros
                  {(selectedCategories.length > 0 ||
                    selectedDepartments.length > 0 ||
                    showLowStock ||
                    showExpiring) && (
                    <Badge variant="secondary" className="ml-2 rounded-full px-1">
                      {selectedCategories.length +
                        selectedDepartments.length +
                        (showLowStock ? 1 : 0) +
                        (showExpiring ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80" align="end">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Categorias</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {MOCK_CATEGORIES.map((category) => (
                        <div key={category.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category.id}`}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleToggleCategory(category.id)}
                          />
                          <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Secretarias</h4>
                    <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto">
                      {MOCK_DEPARTMENTS.map((department) => (
                        <div key={department.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`department-${department.id}`}
                            checked={selectedDepartments.includes(department.id)}
                            onCheckedChange={() => handleToggleDepartment(department.id)}
                          />
                          <Label htmlFor={`department-${department.id}`}>{department.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Outros Filtros</h4>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="low-stock"
                          checked={showLowStock}
                          onCheckedChange={(checked) => setShowLowStock(checked as boolean)}
                        />
                        <Label htmlFor="low-stock">Estoque baixo</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="expiring"
                          checked={showExpiring}
                          onCheckedChange={(checked) => setShowExpiring(checked as boolean)}
                        />
                        <Label htmlFor="expiring">Prestes a vencer (30 dias)</Label>
                      </div>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Box className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold">Nenhum item encontrado</h3>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Não há itens que correspondam aos critérios de busca. Tente ajustar os filtros ou
                adicione novos itens ao estoque.
              </p>
              <Button className="mt-6" onClick={() => navigate("/dashboard/inventory/new")}>
                <Plus className="mr-2 h-4 w-4" /> Adicionar Item
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredItems.map((item) => (
                <Card key={item.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <Badge variant={item.isOpen ? "destructive" : "secondary"}>
                        {item.isOpen ? (
                          <><PackageOpen className="h-3 w-3 mr-1" /> Aberto</>
                        ) : (
                          <><Package className="h-3 w-3 mr-1" /> Fechado</>
                        )}
                      </Badge>
                      <Badge variant={item.quantity <= item.minStock ? "destructive" : "outline"}>
                        {item.quantity} unidades
                      </Badge>
                    </div>
                    <CardTitle className="mt-2">{item.name}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {item.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Categoria:</span>
                        <span className="font-medium">{item.category.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Secretaria:</span>
                        <span className="font-medium">{item.department.name}</span>
                      </div>
                      {item.expirationDate && (
                        <div className="flex justify-between">
                          <span className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" /> Vencimento:
                          </span>
                          <span className="font-medium">{formatDate(item.expirationDate)}</span>
                        </div>
                      )}
                      {item.isOpen && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Aberto em:</span>
                          <span className="font-medium">{formatDate(item.openedAt)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Localização:</span>
                        <span className="font-medium">{item.location}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between pt-2">
                    <div className="flex gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/inventory/${item.id}`)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => navigate(`/dashboard/inventory/${item.id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    {!item.isOpen && (
                      <Button 
                        variant="secondary" 
                        size="sm" 
                        onClick={() => handleOpenItem(item.id)}
                      >
                        Abrir Item
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>

        <Card className="w-full md:w-72 sticky top-6 self-start">
          <CardHeader>
            <CardTitle className="text-lg">Resumo do Estoque</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-1">
                <span>Total de Itens:</span>
                <span className="font-bold">{items.length}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span>Itens com Estoque Baixo:</span>
                <span className="font-bold text-destructive">
                  {items.filter(item => item.quantity <= item.minStock).length}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Itens Abertos:</span>
                <span className="font-bold">
                  {items.filter(item => item.isOpen).length}
                </span>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2 flex items-center gap-1">
                <Users className="h-4 w-4" /> Top Secretarias
              </h4>
              <div className="space-y-1">
                {MOCK_DEPARTMENTS.slice(0, 3).map(dept => (
                  <div key={dept.id} className="flex justify-between text-sm">
                    <span>{dept.name}</span>
                    <span className="font-medium">
                      {items.filter(item => item.department.id === dept.id).length} itens
                    </span>
                  </div>
                ))}
              </div>
            </div>
            
            <Separator />
            
            <Button variant="outline" className="w-full" onClick={() => navigate("/dashboard/inventory/report")}>
              Gerar Relatório
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Inventory;
