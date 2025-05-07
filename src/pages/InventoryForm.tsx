import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useInventory } from '@/contexts/InventoryContext';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft } from 'lucide-react';
import { InventoryItem } from '@/types/inventory';

const formSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  category: z.string().min(1, 'Selecione uma categoria'),
  department: z.string().min(1, 'Selecione um departamento'),
  quantity: z.coerce.number().min(0, 'Quantidade não pode ser negativa'),
  minQuantity: z.coerce.number().min(0, 'Quantidade mínima não pode ser negativa'),
  expirationDate: z.string().nullable(),
  location: z.string().min(2, 'Localização deve ter pelo menos 2 caracteres'),
  description: z.string(),
  isOpen: z.boolean().default(false),
  unitPrice: z.coerce.number().min(0, 'Preço não pode ser negativo'),
});

type FormValues = z.infer<typeof formSchema>;

const InventoryForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { 
    getInventoryItem,
    addInventoryItem,
    updateInventoryItem,
    categories,
    departments
  } = useInventory();

  const inventoryItem = isEditing ? getInventoryItem(id || '') : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: inventoryItem?.name || '',
      category: inventoryItem?.category || '',
      department: inventoryItem?.department || '',
      quantity: inventoryItem?.quantity || 0,
      minQuantity: inventoryItem?.minQuantity || 0,
      expirationDate: inventoryItem?.expirationDate || null,
      location: inventoryItem?.location || '',
      description: inventoryItem?.description || '',
      isOpen: inventoryItem?.isOpen || false,
      unitPrice: inventoryItem?.unitPrice || 0,
    },
  });

  React.useEffect(() => {
    if (isEditing && !inventoryItem) {
      navigate('/dashboard/inventory');
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Item não encontrado",
      });
    }
  }, [isEditing, inventoryItem, navigate, toast]);

  const onSubmit = (data: FormValues) => {
    if (isEditing && inventoryItem) {
      const updatedItem: InventoryItem = {
        id: inventoryItem.id,
        name: data.name,
        category: data.category as InventoryCategory,
        department: data.department as Department,
        quantity: Number(data.quantity),
        minQuantity: Number(data.minQuantity),
        expirationDate: data.expirationDate,
        location: data.location,
        description: data.description,
        lastUpdated: new Date().toISOString(),
        isOpen: data.isOpen,
        unitPrice: Number(data.unitPrice),
      };
      
      updateInventoryItem(updatedItem);
      toast({
        title: "Item atualizado",
        description: `${data.name} foi atualizado com sucesso`,
      });
      navigate('/dashboard/inventory');
    } else {
      const newItem: Omit<InventoryItem, 'id' | 'lastUpdated'> = {
        name: data.name,
        category: data.category as InventoryCategory,
        department: data.department as Department,
        quantity: Number(data.quantity),
        minQuantity: Number(data.minQuantity),
        expirationDate: data.expirationDate,
        location: data.location,
        description: data.description,
        isOpen: data.isOpen,
        unitPrice: Number(data.unitPrice),
      };
      
      addInventoryItem(newItem);
      toast({
        title: "Item adicionado",
        description: `${data.name} foi adicionado ao inventário`,
      });
      navigate('/dashboard/inventory');
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          className="mr-2"
          onClick={() => navigate("/dashboard/inventory")}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
        </Button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {isEditing ? 'Editar Item' : 'Adicionar Item'}
        </h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? 'Editar Item do Inventário' : 'Adicionar Novo Item'}</CardTitle>
          <CardDescription>
            {isEditing 
              ? 'Atualize as informações do item no sistema'
              : 'Preencha os detalhes para adicionar um novo item ao inventário'
            }
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Item</FormLabel>
                      <FormControl>
                        <Input placeholder="Digite o nome do item" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Depósito Principal - Prateleira A3" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="department"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Departamento</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um departamento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {departments.map(dept => (
                            <SelectItem key={dept} value={dept}>
                              {dept}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="minQuantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade Mínima</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="unitPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Unitário (R$)</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} min="0" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento (se aplicável)</FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        {...field} 
                        value={field.value || ''}
                        onChange={(e) => {
                          field.onChange(e.target.value || null);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o item..." 
                        {...field}
                        rows={3} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isOpen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Item aberto</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Marque esta opção caso o item esteja com a embalagem aberta
                      </p>
                    </div>
                  </FormItem>
                )}
              />
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
                {isEditing ? 'Atualizar Item' : 'Adicionar Item'}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default InventoryForm;
