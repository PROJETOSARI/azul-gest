
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/contexts/InventoryContext';

const InventoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addItemToInventory, updateInventoryItem, getInventoryItemById } = useInventory();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    location: '',
    quantity: 0,
    initialQuantity: 0,
    unit: '',
    minimumQuantity: 0,
    acquisitionDate: '',
    lastUpdate: new Date().toISOString().split('T')[0],
    responsible: '',
    status: 'Disponível',
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const item = getInventoryItemById(id);
      if (item) {
        // Convert dates to YYYY-MM-DD format for input fields
        const formattedItem = {
          ...item,
          acquisitionDate: item.acquisitionDate ? new Date(item.acquisitionDate).toISOString().split('T')[0] : '',
          lastUpdate: item.lastUpdate ? new Date(item.lastUpdate).toISOString().split('T')[0] : ''
        };
        
        setFormData(formattedItem);
      }
    }
  }, [id, getInventoryItemById]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // For number inputs, convert the string value to a number
    if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseFloat(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentDate = new Date().toISOString();

      // Make sure initialQuantity is set properly
      let updatedData = { ...formData };
      
      // If this is a new item, set initialQuantity equal to quantity
      if (!id) {
        updatedData.initialQuantity = formData.quantity;
      }
      
      // Set the last update timestamp
      updatedData.lastUpdate = currentDate;

      if (id) {
        await updateInventoryItem(id, updatedData);
        toast({
          title: "Item atualizado",
          description: "O item foi atualizado com sucesso.",
        });
      } else {
        await addItemToInventory(updatedData);
        toast({
          title: "Item adicionado",
          description: "O novo item foi adicionado com sucesso.",
        });
      }
      navigate('/dashboard/inventory');
    } catch (error) {
      console.error("Erro ao salvar o item:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao salvar o item. Por favor, tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="container max-w-2xl mx-auto">
      <Button 
        variant="ghost" 
        onClick={goBack} 
        className="mb-4 inline-flex items-center text-gray-600 hover:text-gray-800"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar
      </Button>
      
      <Card>
        <CardHeader>
          <CardTitle>{id ? 'Editar Item' : 'Adicionar Novo Item'}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">Nome</label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="category" className="block text-sm font-medium mb-1">Categoria</label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Papelaria">Papelaria</SelectItem>
                    <SelectItem value="Escritório">Escritório</SelectItem>
                    <SelectItem value="Limpeza">Limpeza</SelectItem>
                    <SelectItem value="Informática">Informática</SelectItem>
                    <SelectItem value="Móveis">Móveis</SelectItem>
                    <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                    <SelectItem value="Outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium mb-1">Quantidade</label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              {id && (
                <div>
                  <label htmlFor="initialQuantity" className="block text-sm font-medium mb-1">Quantidade Inicial</label>
                  <Input
                    id="initialQuantity"
                    name="initialQuantity"
                    type="number"
                    min="0"
                    value={formData.initialQuantity}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              )}
              
              <div>
                <label htmlFor="unit" className="block text-sm font-medium mb-1">Unidade</label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => handleSelectChange('unit', value)}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Selecione uma unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Unidade">Unidade</SelectItem>
                    <SelectItem value="Caixa">Caixa</SelectItem>
                    <SelectItem value="Pacote">Pacote</SelectItem>
                    <SelectItem value="Resma">Resma</SelectItem>
                    <SelectItem value="Litro">Litro</SelectItem>
                    <SelectItem value="Metro">Metro</SelectItem>
                    <SelectItem value="Kg">Kg</SelectItem>
                    <SelectItem value="Peça">Peça</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label htmlFor="minimumQuantity" className="block text-sm font-medium mb-1">Quantidade Mínima</label>
                <Input
                  id="minimumQuantity"
                  name="minimumQuantity"
                  type="number"
                  min="0"
                  value={formData.minimumQuantity}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-1">Localização</label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="acquisitionDate" className="block text-sm font-medium mb-1">Data de Aquisição</label>
                <Input
                  id="acquisitionDate"
                  name="acquisitionDate"
                  type="date"
                  value={formData.acquisitionDate}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="responsible" className="block text-sm font-medium mb-1">Responsável</label>
                <Input
                  id="responsible"
                  name="responsible"
                  value={formData.responsible}
                  onChange={handleInputChange}
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Selecione um status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Disponível">Disponível</SelectItem>
                    <SelectItem value="Baixo Estoque">Baixo Estoque</SelectItem>
                    <SelectItem value="Indisponível">Indisponível</SelectItem>
                    <SelectItem value="Em Manutenção">Em Manutenção</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <label htmlFor="description" className="block text-sm font-medium mb-1">Descrição</label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
              />
            </div>
            
            <div>
              <label htmlFor="notes" className="block text-sm font-medium mb-1">Observações</label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
              />
            </div>
          </CardContent>
          
          <CardFooter>
            <div className="flex justify-end gap-4 w-full">
              <Button
                type="button"
                variant="outline" 
                onClick={goBack}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {isSubmitting ? 'Salvando...' : 'Salvar'}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default InventoryForm;
