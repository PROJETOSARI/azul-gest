
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContainer, MotionCard, MotionTableRow } from '@/components/animations/MotionContainer';
import { Plus, Archive, Search, Package, FileDown, FileUp, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  department: string;
  quantity: number;
  unit: string;
  expirationDate: string | null;
  minStock: number;
  location: string;
  lastUpdated: string;
  notes?: string;
}

const demoItems: InventoryItem[] = [
  {
    id: "1",
    name: "Papel A4",
    category: "Escritório",
    department: "Administração",
    quantity: 500,
    unit: "Folhas",
    expirationDate: null,
    minStock: 100,
    location: "Armário A1",
    lastUpdated: "2025-05-01",
    notes: "Papel branco, gramatura 75g/m², tamanho A4 (210mm x 297mm)."
  },
  {
    id: "2",
    name: "Canetas Esferográficas",
    category: "Escritório",
    department: "Educação",
    quantity: 150,
    unit: "Unidades",
    expirationDate: null,
    minStock: 30,
    location: "Gaveta B2",
    lastUpdated: "2025-04-29"
  },
  {
    id: "3",
    name: "Álcool em Gel",
    category: "Limpeza",
    department: "Saúde",
    quantity: 20,
    unit: "Frascos",
    expirationDate: "2026-03-15",
    minStock: 5,
    location: "Prateleira C3",
    lastUpdated: "2025-05-02"
  },
  {
    id: "4",
    name: "Máscaras Descartáveis",
    category: "Médico",
    department: "Saúde",
    quantity: 80,
    unit: "Unidades",
    expirationDate: "2025-12-31",
    minStock: 50,
    location: "Armário D4",
    lastUpdated: "2025-04-15"
  },
  {
    id: "5",
    name: "Cartuchos de Tinta",
    category: "Informática",
    department: "Administração",
    quantity: 8,
    unit: "Unidades",
    expirationDate: "2025-11-01",
    minStock: 4,
    location: "Gaveta E5",
    lastUpdated: "2025-04-20"
  },
  {
    id: "6",
    name: "Cimento",
    category: "Manutenção",
    department: "Obras",
    quantity: 25,
    unit: "Pacotes",
    expirationDate: "2025-10-15",
    minStock: 10,
    location: "Depósito F6",
    lastUpdated: "2025-04-25"
  },
  {
    id: "7",
    name: "Folders Turísticos",
    category: "Escritório",
    department: "Turismo",
    quantity: 500,
    unit: "Unidades",
    expirationDate: null,
    minStock: 100,
    location: "Armário G7",
    lastUpdated: "2025-05-03"
  },
  {
    id: "8",
    name: "Sementes de Árvores",
    category: "Manutenção",
    department: "Meio Ambiente",
    quantity: 300,
    unit: "Pacotes",
    expirationDate: "2026-05-01",
    minStock: 50,
    location: "Estante H8",
    lastUpdated: "2025-04-10"
  }
];

const Almoxarifado = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("todos");
  const { toast } = useToast();
  
  const handleViewItem = (id: string) => {
    navigate(`/dashboard/almoxarifado/item/${id}`);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv, .xlsx, .xls';
    
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Simulating file import
        setTimeout(() => {
          toast({
            title: "Importação Concluída",
            description: `Arquivo ${file.name} importado com sucesso!`,
          });
        }, 1500);
      }
    };
    
    input.click();
  };

  const handleExport = () => {
    // Simulating CSV export
    setTimeout(() => {
      toast({
        title: "Exportação Concluída",
        description: "Arquivo inventory_data.csv gerado com sucesso!",
      });
      
      // In a real app, this would generate and download a CSV file
      const fakeLink = document.createElement('a');
      fakeLink.setAttribute('href', 'data:text/csv;charset=utf-8,');
      fakeLink.setAttribute('download', 'inventory_data.csv');
      fakeLink.style.display = 'none';
      document.body.appendChild(fakeLink);
      fakeLink.click();
      document.body.removeChild(fakeLink);
    }, 1000);
  };
  
  const filteredItems = demoItems.filter(item => {
    // Filter by tab selection
    if (selectedTab !== "todos" && selectedTab !== "alerta") {
      // Check if we're filtering by category or by department
      if (selectedTab.startsWith("dept-")) {
        const dept = selectedTab.replace("dept-", "").toLowerCase();
        if (item.department.toLowerCase() !== dept) return false;
      } else if (item.category.toLowerCase() !== selectedTab) {
        return false;
      }
    }
    
    if (selectedTab === "alerta" && item.quantity > item.minStock) {
      return false;
    }
    
    // Filter by search term
    return (
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const uniqueCategories = Array.from(new Set(demoItems.map(item => item.category.toLowerCase())));
  const uniqueDepartments = Array.from(new Set(demoItems.map(item => item.department)));

  const lowStockCount = demoItems.filter(item => item.quantity <= item.minStock).length;
  const expiringCount = demoItems.filter(item => 
    item.expirationDate && 
    new Date(item.expirationDate) <= new Date(new Date().setMonth(new Date().getMonth() + 3))
  ).length;
  
  const totalItems = demoItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalCategories = uniqueCategories.length;

  return (
    <MotionContainer>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Almoxarifado</h1>
        <p className="text-gray-500">Gerencie o estoque de produtos, materiais e equipamentos.</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MotionCard delay={0.1}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Total de Itens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Package className="mr-2 h-4 w-4 text-blue-500" />
                <div className="text-2xl font-bold">{totalItems}</div>
              </div>
            </CardContent>
          </Card>
        </MotionCard>
        
        <MotionCard delay={0.2}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Categorias</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <Archive className="mr-2 h-4 w-4 text-green-500" />
                <div className="text-2xl font-bold">{totalCategories}</div>
              </div>
            </CardContent>
          </Card>
        </MotionCard>
        
        <MotionCard delay={0.3}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Estoque Baixo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-orange-500" />
                <div className="text-2xl font-bold">{lowStockCount}</div>
              </div>
            </CardContent>
          </Card>
        </MotionCard>
        
        <MotionCard delay={0.4}>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">A Vencer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center">
                <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                <div className="text-2xl font-bold">{expiringCount}</div>
              </div>
            </CardContent>
          </Card>
        </MotionCard>
      </div>

      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input 
            className="pl-10"
            placeholder="Buscar itens..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleImport} variant="outline">
            <FileUp size={18} className="mr-2" />
            Importar
          </Button>
          <Button onClick={handleExport} variant="outline">
            <FileDown size={18} className="mr-2" />
            Exportar
          </Button>
          <Button onClick={() => navigate('/dashboard/almoxarifado/new')}>
            <Plus size={18} className="mr-2" />
            Novo Item
          </Button>
        </div>
      </div>

      <Tabs defaultValue="todos" value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="todos">Todos</TabsTrigger>
          
          {/* Category filters */}
          {uniqueCategories.map(category => (
            <TabsTrigger value={category} key={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </TabsTrigger>
          ))}
          
          {/* Department filters */}
          {uniqueDepartments.map(department => (
            <TabsTrigger value={`dept-${department.toLowerCase()}`} key={department}>
              {department}
            </TabsTrigger>
          ))}
          
          <TabsTrigger value="alerta" className="text-orange-500">Alertas</TabsTrigger>
        </TabsList>
        
        <TabsContent value={selectedTab}>
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Secretaria</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Validade</TableHead>
                    <TableHead>Local</TableHead>
                    <TableHead>Última Atualização</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 text-gray-500">
                        Nenhum item encontrado
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredItems.map((item, index) => {
                      const isLowStock = item.quantity <= item.minStock;
                      const isExpiring = item.expirationDate && 
                        new Date(item.expirationDate) <= new Date(new Date().setMonth(new Date().getMonth() + 3));
                      
                      return (
                        <MotionTableRow 
                          key={item.id} 
                          index={index}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => handleViewItem(item.id)}
                        >
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.category}</TableCell>
                          <TableCell>{item.department}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{item.unit}</TableCell>
                          <TableCell>{item.expirationDate || 'N/A'}</TableCell>
                          <TableCell>{item.location}</TableCell>
                          <TableCell>{item.lastUpdated}</TableCell>
                          <TableCell>
                            {isLowStock && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
                                Estoque Baixo
                              </span>
                            )}
                            {isExpiring && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-red-100 text-red-800 ml-1">
                                Próximo ao Vencimento
                              </span>
                            )}
                            {!isLowStock && !isExpiring && (
                              <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-green-100 text-green-800">
                                Normal
                              </span>
                            )}
                          </TableCell>
                        </MotionTableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </MotionContainer>
  );
};

export default Almoxarifado;
