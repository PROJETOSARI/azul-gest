
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '../contexts/InventoryContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/contexts/AuthContext';

const InventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { 
    addInventoryItem, 
    updateInventoryItem,
    getInventoryItem,
    categories,
    departments
  } = useInventory();

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    department: '',
    quantity: 0,
    minQuantity: 0,
    expirationDate: '',
    location: '',
    description: '',
    unitPrice: 0,
    isOpen: false,
    initialQuantity: 0
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id && id !== 'new') {
      const item = getInventoryItem(id);
      if (item) {
        setFormData({
          name: item.name,
          category: item.category,
          department: item.department,
          quantity: item.quantity,
          minQuantity: item.minQuantity,
          expirationDate: item.expirationDate ? new Date(item.expirationDate).toISOString().split('T')[0] : '',
          location: item.location,
          description: item.description,
          unitPrice: item.unitPrice,
          isOpen: item.isOpen,
          initialQuantity: item.initialQuantity
        });
      }
    }
  }, [id, getInventoryItem]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'minQuantity' || name === 'unitPrice' || name === 'initialQuantity'
        ? parseFloat(value)
        : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (id && id !== 'new') {
        updateInventoryItem({
          ...formData,
          id,
          expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null,
        }, user?.name || 'Admin');
        
        toast({
          title: "Item atualizado com sucesso",
          description: `${formData.name} foi atualizado no inventário.`,
        });
      } else {
        addInventoryItem({
          ...formData,
          expirationDate: formData.expirationDate ? new Date(formData.expirationDate).toISOString() : null,
          initialQuantity: formData.quantity // Set initial quantity to current quantity for new items
        }, user?.name || 'Admin');
        
        toast({
          title: "Item adicionado com sucesso",
          description: `${formData.name} foi adicionado ao inventário.`,
        });
      }
      
      navigate('/dashboard/inventory');
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast({
        variant: "destructive",
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar o item.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">
        {id && id !== 'new' ? 'Editar Item' : 'Adicionar Novo Item'}
      </h1>
      
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Item</Label>
                <Input 
                  id="name" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('category', value)} 
                  value={formData.category}
                  required
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Select 
                  onValueChange={(value) => handleSelectChange('department', value)} 
                  value={formData.department}
                  required
                >
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Selecione um departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map(department => (
                      <SelectItem key={department} value={department}>
                        {department}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
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
              
              <div className="space-y-2">
                <Label htmlFor="minQuantity">Quantidade Mínima</Label>
                <Input 
                  id="minQuantity" 
                  name="minQuantity" 
                  type="number" 
                  min="0" 
                  value={formData.minQuantity} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
                <Input 
                  id="unitPrice" 
                  name="unitPrice" 
                  type="number" 
                  min="0" 
                  step="0.01" 
                  value={formData.unitPrice} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expirationDate">Data de Validade (opcional)</Label>
                <Input 
                  id="expirationDate" 
                  name="expirationDate" 
                  type="date" 
                  value={formData.expirationDate} 
                  onChange={handleInputChange} 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input 
                  id="location" 
                  name="location" 
                  value={formData.location} 
                  onChange={handleInputChange} 
                  required 
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea 
                id="description" 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange} 
                rows={3} 
                required 
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/dashboard/inventory')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={loading}
              >
                {loading ? 'Salvando...' : (id && id !== 'new' ? 'Atualizar' : 'Adicionar')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryForm;
