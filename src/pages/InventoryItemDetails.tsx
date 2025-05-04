
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MotionContainer } from '@/components/animations/MotionContainer';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash, Package, Calendar, MapPin, Info, BarChart3, Building } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Mock data - would come from API in real app
const demoItems = [
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
    notes: "Papel branco, gramatura 75g/m², tamanho A4 (210mm x 297mm).",
    history: [
      { date: "2025-05-01", type: "Entrada", quantity: 500, user: "João Silva" },
      { date: "2025-04-15", type: "Saída", quantity: 50, user: "Maria Souza" },
      { date: "2025-04-10", type: "Entrada", quantity: 200, user: "João Silva" }
    ]
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
    lastUpdated: "2025-04-29",
    notes: "Canetas esferográficas azuis",
    history: [
      { date: "2025-04-29", type: "Entrada", quantity: 150, user: "Pedro Santos" },
      { date: "2025-04-20", type: "Saída", quantity: 25, user: "Ana Oliveira" }
    ]
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
    lastUpdated: "2025-05-02",
    notes: "Álcool em gel 70% para higienização",
    history: [
      { date: "2025-05-02", type: "Entrada", quantity: 20, user: "Carlos Lima" },
      { date: "2025-04-15", type: "Saída", quantity: 5, user: "Fernanda Costa" }
    ]
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
    lastUpdated: "2025-04-15",
    notes: "Máscaras cirúrgicas descartáveis",
    history: [
      { date: "2025-04-15", type: "Entrada", quantity: 100, user: "Carlos Lima" },
      { date: "2025-04-10", type: "Saída", quantity: 20, user: "Mariana Costa" }
    ]
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
    lastUpdated: "2025-04-20",
    notes: "Cartuchos de tinta preta para impressora HP",
    history: [
      { date: "2025-04-20", type: "Entrada", quantity: 10, user: "Roberto Alves" },
      { date: "2025-04-18", type: "Saída", quantity: 2, user: "Julia Mendes" }
    ]
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
    lastUpdated: "2025-04-25",
    notes: "Cimento Portland CP IV-32",
    history: [
      { date: "2025-04-25", type: "Entrada", quantity: 30, user: "Marcos Silva" },
      { date: "2025-04-22", type: "Saída", quantity: 5, user: "Paulo Rocha" }
    ]
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
    lastUpdated: "2025-05-03",
    notes: "Folders com informações turísticas do município",
    history: [
      { date: "2025-05-03", type: "Entrada", quantity: 500, user: "Carla Santos" },
      { date: "2025-04-25", type: "Saída", quantity: 100, user: "Miguel Costa" }
    ]
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
    lastUpdated: "2025-04-10",
    notes: "Sementes de árvores nativas para reflorestamento",
    history: [
      { date: "2025-04-10", type: "Entrada", quantity: 350, user: "Luiza Ferreira" },
      { date: "2025-04-05", type: "Saída", quantity: 50, user: "Gabriel Santos" }
    ]
  }
];

const InventoryItemDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [item, setItem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    setTimeout(() => {
      const foundItem = demoItems.find(item => item.id === id);
      if (foundItem) {
        setItem(foundItem);
      } else {
        toast({
          title: "Item não encontrado",
          description: "O item solicitado não foi encontrado.",
          variant: "destructive"
        });
        navigate('/dashboard/almoxarifado');
      }
      setLoading(false);
    }, 300);
  }, [id, navigate, toast]);

  const handleDelete = () => {
    // Simulate deletion
    toast({
      title: "Item excluído",
      description: `${item.name} foi removido do estoque.`,
      variant: "destructive"
    });
    navigate('/dashboard/almoxarifado');
  };
  
  if (loading) {
    return (
      <MotionContainer>
        <div className="flex justify-center items-center h-64">
          <div className="animate-pulse text-center">
            <p className="text-lg text-gray-500">Carregando detalhes do item...</p>
          </div>
        </div>
      </MotionContainer>
    );
  }
  
  if (!item) return null;
  
  const isLowStock = item.quantity <= item.minStock;

  return (
    <MotionContainer>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="icon" 
            className="mr-4" 
            onClick={() => navigate('/dashboard/almoxarifado')}
          >
            <ArrowLeft size={18} />
          </Button>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h1 className="text-2xl font-bold">{item.name}</h1>
            <p className="text-gray-500">Detalhes do item</p>
          </motion.div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => navigate(`/dashboard/almoxarifado/edit/${item.id}`)}>
            <Edit size={18} className="mr-2" />
            Editar
          </Button>
          <Button variant="destructive" onClick={handleDelete}>
            <Trash size={18} className="mr-2" />
            Excluir
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          className="col-span-1 md:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Informações do Item</CardTitle>
              <CardDescription>Detalhes e especificações</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="details">
                <TabsList className="mb-4">
                  <TabsTrigger value="details">Detalhes</TabsTrigger>
                  <TabsTrigger value="history">Histórico</TabsTrigger>
                  <TabsTrigger value="stats">Estatísticas</TabsTrigger>
                </TabsList>
                
                <TabsContent value="details">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Nome</p>
                        <p>{item.name}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Categoria</p>
                        <p>{item.category}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Secretaria</p>
                        <p>{item.department}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Quantidade</p>
                        <p className={isLowStock ? "text-orange-600 font-medium" : ""}>
                          {item.quantity} {item.unit}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Estoque Mínimo</p>
                        <p>{item.minStock} {item.unit}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Localização</p>
                        <p>{item.location}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Data de Validade</p>
                        <p>{item.expirationDate || 'Não se aplica'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Última Atualização</p>
                        <p>{item.lastUpdated}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <p className="text-sm font-medium text-gray-500">Observações</p>
                    <p className="mt-1">{item.notes || 'Nenhuma observação.'}</p>
                  </div>
                </TabsContent>
                
                <TabsContent value="history">
                  <div className="border rounded-md">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-3">Data</th>
                          <th className="text-left p-3">Tipo</th>
                          <th className="text-left p-3">Quantidade</th>
                          <th className="text-left p-3">Usuário</th>
                        </tr>
                      </thead>
                      <tbody>
                        {item.history.map((entry: any, i: number) => (
                          <motion.tr 
                            key={i}
                            className="border-b hover:bg-gray-50"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: i * 0.1 }}
                          >
                            <td className="p-3">{entry.date}</td>
                            <td className="p-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                entry.type === 'Entrada' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-red-100 text-red-800'
                              }`}>
                                {entry.type}
                              </span>
                            </td>
                            <td className="p-3">{entry.quantity} {item.unit}</td>
                            <td className="p-3">{entry.user}</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </TabsContent>
                
                <TabsContent value="stats">
                  <div className="flex justify-center items-center h-64 text-gray-500">
                    <div className="text-center">
                      <BarChart3 size={48} className="mx-auto mb-2" />
                      <p>Estatísticas detalhadas estarão disponíveis após a implementação completa do sistema.</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Informações Rápidas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Package className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Quantidade Atual</p>
                      <p className={`font-medium ${isLowStock ? 'text-orange-600' : ''}`}>{item.quantity} {item.unit}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Validade</p>
                      <p>{item.expirationDate || 'N/A'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Localização</p>
                      <p>{item.location}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-500">Secretaria</p>
                      <p>{item.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className={isLowStock ? "border-orange-300 bg-orange-50" : ""}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Info className={`h-5 w-5 mr-2 ${isLowStock ? 'text-orange-500' : 'text-green-500'}`} />
                  <div>
                    {isLowStock ? (
                      <p className="text-orange-700 font-medium">Estoque Baixo</p>
                    ) : (
                      <p className="text-green-700 font-medium">Estoque Normal</p>
                    )}
                    
                    {isLowStock ? (
                      <p className="text-sm text-orange-600">Abaixo do estoque mínimo de {item.minStock} {item.unit}</p>
                    ) : (
                      <p className="text-sm text-green-600">O estoque está em níveis adequados</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </MotionContainer>
  );
};

export default InventoryItemDetails;
