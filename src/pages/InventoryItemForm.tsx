
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Package, ArrowLeft, Calendar, Save, Trash2
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { 
  InventoryItem, 
  MOCK_INVENTORY_ITEMS, 
  MOCK_CATEGORIES, 
  MOCK_DEPARTMENTS 
} from "@/types/inventory";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";

const InventoryItemForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [item, setItem] = useState<InventoryItem | null>(
    isEditMode 
      ? MOCK_INVENTORY_ITEMS.find(item => item.id === id) || null
      : null
  );

  const form = useForm({
    defaultValues: {
      name: item?.name || "",
      description: item?.description || "",
      categoryId: item?.category.id || "",
      quantity: item?.quantity || 0,
      minStock: item?.minStock || 0,
      departmentId: item?.department.id || "",
      expirationDate: item?.expirationDate || null,
      location: item?.location || "",
    },
  });

  useEffect(() => {
    if (isEditMode && item) {
      form.reset({
        name: item.name,
        description: item.description || "",
        categoryId: item.category.id,
        quantity: item.quantity,
        minStock: item.minStock,
        departmentId: item.department.id,
        expirationDate: item.expirationDate || null,
        location: item.location || "",
      });
    }
  }, [isEditMode, item, form]);

  const onSubmit = (data: any) => {
    const category = MOCK_CATEGORIES.find(cat => cat.id === data.categoryId);
    const department = MOCK_DEPARTMENTS.find(dep => dep.id === data.departmentId);
    
    if (!category || !department) return;
    
    const newItem: InventoryItem = {
      id: item?.id || uuidv4(),
      name: data.name,
      description: data.description,
      category,
      quantity: Number(data.quantity),
      minStock: Number(data.minStock),
      department,
      expirationDate: data.expirationDate,
      location: data.location,
      createdAt: item?.createdAt || new Date(),
      updatedAt: new Date(),
      isOpen: item?.isOpen || false,
      openedAt: item?.openedAt || null,
      openedBy: item?.openedBy || null,
    };

    // Aqui seria feita a integração com API para salvar os dados
    console.log('Item salvo:', newItem);
    
    // Redirecionamento após salvar
    navigate('/dashboard/inventory');
  };

  if (isEditMode && !item) {
    return (
      <div className="flex flex-col items-center justify-center py-10 text-center">
        <h3 className="text-xl font-semibold">Item não encontrado</h3>
        <p className="text-muted-foreground mt-2">
          O item que você está tentando editar não existe ou foi removido.
        </p>
        <Button 
          className="mt-6" 
          onClick={() => navigate('/dashboard/inventory')}
          variant="outline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar para o inventário
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/dashboard/inventory')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isEditMode ? "Editar Item" : "Novo Item"}
            </h2>
            <p className="text-muted-foreground">
              {isEditMode 
                ? "Atualize as informações do item no inventário" 
                : "Adicione um novo item ao inventário"}
            </p>
          </div>
        </div>
        
        {isEditMode && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" /> Excluir Item
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja excluir?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. O item será removido permanentemente do inventário.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={() => {
                    // Aqui seria feita a integração com API para excluir
                    navigate('/dashboard/inventory');
                  }}
                >
                  Excluir
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      <Card className="p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "O nome do item é obrigatório" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Item</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Papel A4" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="categoryId"
                rules={{ required: "A categoria é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_CATEGORIES.map(category => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
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
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Descreva o item com detalhes..." 
                        rows={3} 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="quantity"
                rules={{ 
                  required: "A quantidade é obrigatória",
                  min: { value: 0, message: "A quantidade não pode ser negativa" }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estoque Mínimo</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                rules={{ required: "A secretaria é obrigatória" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secretaria</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma secretaria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {MOCK_DEPARTMENTS.map(department => (
                          <SelectItem key={department.id} value={department.id}>
                            {department.name}
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
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localização</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Prateleira A1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expirationDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Vencimento</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className="w-full flex justify-start text-left font-normal"
                          >
                            {field.value ? (
                              <span>{format(field.value, "dd/MM/yyyy", { locale: ptBR })}</span>
                            ) : (
                              <span className="text-muted-foreground">Selecione uma data</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
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
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? "Atualizar" : "Salvar"}
              </Button>
            </div>
          </form>
        </Form>
      </Card>
    </div>
  );
};

export default InventoryItemForm;
