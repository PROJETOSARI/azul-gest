
import React from 'react';
import { motion } from 'framer-motion';
import { MotionContainer } from '@/components/animations/MotionContainer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { ArrowLeft, Save } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres"),
  category: z.string().min(1, "Selecione uma categoria"),
  quantity: z.string().transform(val => parseInt(val, 10)),
  unit: z.string().min(1, "Selecione uma unidade"),
  minStock: z.string().transform(val => parseInt(val, 10)),
  location: z.string().min(1, "Informe a localização"),
  expirationDate: z.string().optional(),
  notes: z.string().optional(),
});

const categories = [
  "Escritório",
  "Limpeza",
  "Informática",
  "Médico",
  "Manutenção",
  "Alimentação"
];

const units = [
  "Unidades",
  "Caixas",
  "Frascos",
  "Folhas",
  "Pacotes",
  "Metros",
  "Litros",
  "Quilos"
];

const InventoryItemForm = () => {
  const navigate = useNavigate();
  const isEditMode = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      quantity: "0",
      unit: "",
      minStock: "0",
      location: "",
      expirationDate: "",
      notes: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here we would submit the data
    console.log(values);
    
    // Show success message
    alert("Item salvo com sucesso!");
    
    // Navigate back to inventory
    navigate('/dashboard/almoxarifado');
  }

  return (
    <MotionContainer>
      <div className="mb-6 flex items-center">
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
          <h1 className="text-2xl font-bold">
            {isEditMode ? "Editar Item" : "Novo Item"}
          </h1>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Editar Item do Estoque" : "Adicionar Novo Item ao Estoque"}</CardTitle>
          <CardDescription>
            Preencha as informações do item que será adicionado ao estoque do almoxarifado.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
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
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantidade</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Unidade</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma unidade" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit}>
                              {unit}
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
                  name="minStock"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estoque Mínimo</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" {...field} />
                      </FormControl>
                      <FormDescription>
                        Quantidade mínima antes de notificar estoque baixo
                      </FormDescription>
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
                        <Input placeholder="Ex: Armário A1, Prateleira 3" {...field} />
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
                      <FormLabel>Data de Validade</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormDescription>
                        Deixe em branco caso não tenha data de validade
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observações</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Informações adicionais sobre o item..." 
                        className="h-24"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-end gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/almoxarifado')}
                >
                  Cancelar
                </Button>
                <Button type="submit">
                  <Save size={18} className="mr-2" />
                  Salvar
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </MotionContainer>
  );
};

export default InventoryItemForm;
