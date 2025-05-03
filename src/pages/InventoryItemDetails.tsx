
import React from 'react';
import { motion } from 'framer-motion';
import { MotionContainer } from '@/components/animations/MotionContainer';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Edit, Trash, Package, Calendar, MapPin, Info, BarChart3 } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const InventoryItemDetails = () => {
  const navigate = useNavigate();
  
  // This would come from API or route params in a real app
  const item = {
    id: "1",
    name: "Papel A4",
    category: "Escritório",
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
  };
  
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
          <Button variant="destructive">
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
                        {item.history.map((entry, i) => (
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
