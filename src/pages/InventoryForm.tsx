
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { useInventory } from '@/contexts/InventoryContext';
import { InventoryItem } from '@/types/inventory';

const InventoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const { addInventoryItem, updateInventoryItem, getInventoryItemById } = useInventory();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState<Omit<InventoryItem, 'id'>>({
    name: '',
    description: '',
    category: '',
    quantity: 0,
    initialQuantity: 0,
    measurementUnit: '',
    location: '',
    minimumStock: 0,
    supplierName: '',
    supplierContact: '',
    purchaseDate: '',
    lastUpdated: new Date().toISOString(),
    notes: ''
  });

  useEffect(() => {
    if (isEditing && id) {
      const item = getInventoryItemById(id);
      if (item) {
        setFormData({
          name: item.name,
          description: item.description,
          category: item.category,
          quantity: item.quantity,
          initialQuantity: item.initialQuantity || item.quantity,
          measurementUnit: item.measurementUnit,
          location: item.location,
          minimumStock: item.minimumStock,
          supplierName: item.supplierName,
          supplierContact: item.supplierContact,
          purchaseDate: item.purchaseDate,
          lastUpdated: item.lastUpdated,
          notes: item.notes
        });
      } else {
        toast({
          title: "Erro",
          description: "Item não encontrado",
          variant: "destructive",
        });
        navigate('/dashboard/inventory');
      }
    }
  }, [id, isEditing, getInventoryItemById, navigate, toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Convert numerical fields
    if (['quantity', 'minimumStock', 'initialQuantity'].includes(name)) {
      setFormData({
        ...formData,
        [name]: parseFloat(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (isEditing && id) {
        updateInventoryItem({ ...formData, id });
        toast({
          title: "Sucesso",
          description: "Item atualizado com sucesso",
        });
      } else {
        addInventoryItem({
          ...formData,
          lastUpdated: new Date().toISOString()
        });
        toast({
          title: "Sucesso",
          description: "Item adicionado com sucesso",
        });
      }
      navigate('/dashboard/inventory');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao salvar o item. Verifique os dados e tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground">
          {isEditing ? 'Editar Item' : 'Novo Item'}
        </h1>
        <p className="text-muted-foreground">
          {isEditing ? 'Atualize as informações do item no estoque' : 'Adicione um novo item ao estoque'}
        </p>
      </div>

      <Card className="border-border bg-card">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Informações do Item</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Item *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria *</Label>
                <Input
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade Atual *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="initialQuantity">Quantidade Inicial *</Label>
                <Input
                  id="initialQuantity"
                  name="initialQuantity"
                  type="number"
                  value={formData.initialQuantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="measurementUnit">Unidade de Medida *</Label>
                <Input
                  id="measurementUnit"
                  name="measurementUnit"
                  value={formData.measurementUnit}
                  onChange={handleChange}
                  required
                  placeholder="ex: kg, unidade, litro"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minimumStock">Estoque Mínimo</Label>
                <Input
                  id="minimumStock"
                  name="minimumStock"
                  type="number"
                  value={formData.minimumStock}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Localização</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="ex: Prateleira A, Armário 3"
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="purchaseDate">Data de Compra</Label>
                <Input
                  id="purchaseDate"
                  name="purchaseDate"
                  type="date"
                  value={formData.purchaseDate}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Input
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="bg-background"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="supplierName">Nome do Fornecedor</Label>
                <Input
                  id="supplierName"
                  name="supplierName"
                  value={formData.supplierName}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierContact">Contato do Fornecedor</Label>
                <Input
                  id="supplierContact"
                  name="supplierContact"
                  value={formData.supplierContact}
                  onChange={handleChange}
                  className="bg-background"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Observações</Label>
              <Input
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="bg-background"
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate('/dashboard/inventory')}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {isEditing ? 'Atualizar' : 'Adicionar'} Item
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default InventoryForm;
