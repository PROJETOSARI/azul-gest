
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useInventory } from '@/contexts/InventoryContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { InventoryCategory, Department } from '@/types/inventory';

const InventoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    addInventoryItem, 
    updateInventoryItem, 
    getInventoryItem,
    categories,
    departments
  } = useInventory();

  // Initialize form with empty values
  const [formData, setFormData] = useState<Omit<any, "id">>({
    name: '',
    category: categories[0],
    department: departments[0],
    quantity: 0,
    minQuantity: 0,
    expirationDate: null,
    location: '',
    description: '',
    isOpen: false,
    unitPrice: 0,
    initialQuantity: 0,
  });

  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!id;
  
  // Load item data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      const item = getInventoryItem(id);
      if (item) {
        setFormData({
          name: item.name,
          category: item.category,
          department: item.department,
          quantity: item.quantity,
          minQuantity: item.minQuantity,
          expirationDate: item.expirationDate,
          location: item.location,
          description: item.description,
          isOpen: item.isOpen,
          unitPrice: item.unitPrice,
          initialQuantity: item.initialQuantity,
        });
      }
    }
  }, [id, isEditMode, getInventoryItem]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isEditMode) {
        updateInventoryItem({
          ...formData,
          id: id as string,
          lastUpdated: new Date().toISOString(),
        }, 'Admin');
        
        toast({
          title: "Item atualizado",
          description: `O item ${formData.name} foi atualizado com sucesso.`,
        });
      } else {
        addInventoryItem(formData, 'Admin');
        
        toast({
          title: "Item adicionado",
          description: `O item ${formData.name} foi adicionado ao inventário.`,
        });
      }
      
      // Navigate back to inventory list
      navigate('/dashboard/inventory');
    } catch (error) {
      console.error('Erro ao salvar item:', error);
      toast({
        variant: "destructive",
        title: "Erro",
        description: `Não foi possível ${isEditMode ? 'atualizar' : 'adicionar'} o item.`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  };

  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-6">
        {isEditMode ? 'Editar Item' : 'Adicionar Novo Item'}
      </h1>
      
      <div className="bg-card rounded-lg p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Item</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nome do item"
                required
              />
            </div>
            
            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => handleSelectChange('category', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Departamento</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => handleSelectChange('department', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departments.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                id="quantity"
                name="quantity"
                type="number"
                value={formData.quantity}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            
            {/* Min Quantity */}
            <div className="space-y-2">
              <Label htmlFor="minQuantity">Quantidade Mínima</Label>
              <Input
                id="minQuantity"
                name="minQuantity"
                type="number"
                value={formData.minQuantity}
                onChange={handleChange}
                min={0}
                required
              />
            </div>
            
            {/* Unit Price */}
            <div className="space-y-2">
              <Label htmlFor="unitPrice">Preço Unitário (R$)</Label>
              <Input
                id="unitPrice"
                name="unitPrice"
                type="number"
                value={formData.unitPrice}
                onChange={handleChange}
                min={0}
                step="0.01"
                required
              />
            </div>
            
            {/* Initial Quantity - only shown when adding new items */}
            {!isEditMode && (
              <div className="space-y-2">
                <Label htmlFor="initialQuantity">Quantidade Inicial</Label>
                <Input
                  id="initialQuantity"
                  name="initialQuantity"
                  type="number"
                  value={formData.initialQuantity}
                  onChange={handleChange}
                  min={0}
                  required
                />
              </div>
            )}
            
            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="Local de armazenamento"
              />
            </div>
            
            {/* Expiration Date */}
            <div className="space-y-2">
              <Label htmlFor="expirationDate">Data de Validade (opcional)</Label>
              <Input
                id="expirationDate"
                name="expirationDate"
                type="date"
                value={formData.expirationDate ? new Date(formData.expirationDate).toISOString().split('T')[0] : ''}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descrição detalhada do item"
              rows={4}
            />
          </div>
          
          <div className="flex justify-end space-x-4 pt-4">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/inventory')}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : isEditMode ? 'Atualizar Item' : 'Adicionar Item'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InventoryForm;
