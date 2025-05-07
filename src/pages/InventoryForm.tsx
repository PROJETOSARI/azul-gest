import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { InventoryItem, InventoryCategory, Department } from '@/types/inventory';
import { useInventory } from '@/contexts/InventoryContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";

type FormData = Omit<InventoryItem, 'id' | 'lastUpdated'>;

const InventoryForm = () => {
  const { addItem, updateItem, getItemById } = useInventory();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isEditMode, setIsEditMode] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    category: 'Material de Escritório',
    department: 'Administração',
    quantity: 1,
    minQuantity: 1,
    expirationDate: null,
    location: '',
    description: '',
    isOpen: true,
    unitPrice: 0,
    initialQuantity: 1,
  });
  const [date, setDate] = useState<Date | undefined>(formData.expirationDate ? new Date(formData.expirationDate) : undefined);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const item = getItemById(id);
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
        setDate(item.expirationDate ? new Date(item.expirationDate) : undefined);
      }
    } else {
      setIsEditMode(false);
      setFormData({
        name: '',
        category: 'Material de Escritório',
        department: 'Administração',
        quantity: 1,
        minQuantity: 1,
        expirationDate: null,
        location: '',
        description: '',
        isOpen: true,
        unitPrice: 0,
        initialQuantity: 1,
      });
      setDate(undefined);
    }
  }, [id, getItemById]);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      expirationDate: date ? date.toISOString() : null
    }));
  }, [date]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    if (isEditMode) {
      updateExistingItem();
    } else {
      addItemToInventory();
    }
  };

  const addItemToInventory = () => {
    if (formData.name.trim() === '') {
      toast({
        title: "Erro",
        description: "O nome do item não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const newItem: Omit<InventoryItem, "id" | "lastUpdated"> = {
      name: formData.name.trim(),
      category: formData.category,
      department: formData.department,
      quantity: formData.quantity,
      minQuantity: formData.minQuantity,
      expirationDate: formData.expirationDate,
      location: formData.location,
      description: formData.description,
      isOpen: formData.isOpen,
      unitPrice: formData.unitPrice,
      initialQuantity: formData.quantity
    };

    addItem(newItem);
    toast({
      title: "Sucesso",
      description: "Item adicionado ao inventário com sucesso.",
    });
    navigate('/dashboard/inventory');
  };

  const updateExistingItem = () => {
    if (!id) {
      toast({
        title: "Erro",
        description: "ID do item não encontrado.",
        variant: "destructive",
      });
      return;
    }

    if (formData.name.trim() === '') {
      toast({
        title: "Erro",
        description: "O nome do item não pode estar vazio.",
        variant: "destructive",
      });
      return;
    }

    const updatedItem: InventoryItem = {
      id: id,
      name: formData.name.trim(),
      category: formData.category,
      department: formData.department,
      quantity: formData.quantity,
      minQuantity: formData.minQuantity,
      expirationDate: formData.expirationDate,
      location: formData.location,
      description: formData.description,
      isOpen: formData.isOpen,
      unitPrice: formData.unitPrice,
      lastUpdated: new Date().toISOString(),
      initialQuantity: formData.initialQuantity,
    };

    updateItem(updatedItem);
    toast({
      title: "Sucesso",
      description: "Item atualizado com sucesso.",
    });
    navigate('/dashboard/inventory');
  };

  const createItem = () => {
    const newItem: InventoryItem = {
      id: uuidv4(),
      name: formData.name.trim(),
      category: formData.category,
      department: formData.department,
      quantity: formData.quantity,
      minQuantity: formData.minQuantity,
      expirationDate: formData.expirationDate,
      location: formData.location,
      description: formData.description,
      isOpen: formData.isOpen,
      unitPrice: formData.unitPrice,
      lastUpdated: new Date().toISOString(),
      initialQuantity: formData.quantity // Adicionando initialQuantity com o valor inicial igual a quantity
    };
    
    return newItem;
  };

  const addItem2 = () => {
    const newItem: Omit<InventoryItem, "id" | "lastUpdated"> = {
      name: formData.name.trim(),
      category: formData.category,
      department: formData.department,
      quantity: formData.quantity,
      minQuantity: formData.minQuantity,
      expirationDate: formData.expirationDate,
      location: formData.location,
      description: formData.description,
      isOpen: formData.isOpen,
      unitPrice: formData.unitPrice,
      initialQuantity: formData.quantity // Adicionando initialQuantity com o valor inicial igual a quantity
    };
    
    return newItem
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? 'Editar Item do Inventário' : 'Adicionar Item ao Inventário'}</CardTitle>
          <CardDescription>Preencha os detalhes abaixo para {isEditMode ? 'atualizar' : 'adicionar'} um item ao inventário.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nome do Item</Label>
              <Input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="category">Categoria</Label>
              <Select onValueChange={(value) => handleSelectChange('category', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione uma categoria" defaultValue={formData.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Material de Escritório">Material de Escritório</SelectItem>
                  <SelectItem value="Eletrônicos">Eletrônicos</SelectItem>
                  <SelectItem value="Limpeza">Limpeza</SelectItem>
                  <SelectItem value="Mobiliário">Mobiliário</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Médico">Médico</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="department">Departamento</Label>
              <Select onValueChange={(value) => handleSelectChange('department', value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um departamento" defaultValue={formData.department} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Administração">Administração</SelectItem>
                  <SelectItem value="Educação">Educação</SelectItem>
                  <SelectItem value="Saúde">Saúde</SelectItem>
                  <SelectItem value="Infraestrutura">Infraestrutura</SelectItem>
                  <SelectItem value="Serviços Sociais">Serviços Sociais</SelectItem>
                  <SelectItem value="Finanças">Finanças</SelectItem>
                  <SelectItem value="Meio Ambiente">Meio Ambiente</SelectItem>
                  <SelectItem value="Outros">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="quantity">Quantidade</Label>
              <Input
                type="number"
                id="quantity"
                name="quantity"
                value={String(formData.quantity)}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="minQuantity">Quantidade Mínima</Label>
              <Input
                type="number"
                id="minQuantity"
                name="minQuantity"
                value={String(formData.minQuantity)}
                onChange={handleChange}
                required
                min="1"
              />
            </div>
            <div className="grid gap-2">
              <Label>Data de Expiração</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    {date ? format(date, "dd/MM/yyyy") : <span>Selecione a data</span>}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="center" side="bottom">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) =>
                      date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="unitPrice">Preço Unitário</Label>
              <Input
                type="number"
                id="unitPrice"
                name="unitPrice"
                value={String(formData.unitPrice)}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>
            <Button type="submit">{isEditMode ? 'Atualizar Item' : 'Adicionar Item'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryForm;
