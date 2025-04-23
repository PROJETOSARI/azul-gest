
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, X } from "lucide-react";

const EmployeeForm = () => {
  const navigate = useNavigate();
  const { addEmployee } = useEmployees();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    address: "",
    role: "",
    contractType: "CLT", // Default value
    salary: "",
    startDate: new Date().toISOString().split('T')[0], // Today as default
    department: "",
  });

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Convert string values to appropriate types
    const newEmployee = {
      name: formData.name,
      age: parseInt(formData.age),
      address: formData.address,
      role: formData.role,
      contractType: formData.contractType as 'CLT' | 'PJ' | 'Temporary',
      salary: parseFloat(formData.salary),
      startDate: formData.startDate,
      department: formData.department,
    };
    
    // Add employee
    addEmployee(newEmployee);
    
    // Navigate back to employees list
    navigate('/dashboard/employees');
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Cadastrar Funcionário</h1>
        <p className="text-gray-600">Preencha os dados para adicionar um novo funcionário</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              Dados básicos do funcionário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome Completo</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="João da Silva"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  name="age"
                  type="number"
                  placeholder="30"
                  min="18"
                  max="100"
                  value={formData.age}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Endereço</Label>
                <Input
                  id="address"
                  name="address"
                  placeholder="Rua das Flores, 123 - Bairro - Cidade/UF"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Informações Profissionais</CardTitle>
            <CardDescription>
              Dados relacionados à função e salário
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Cargo</Label>
                <Input
                  id="role"
                  name="role"
                  placeholder="Desenvolvedor, Designer, etc."
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="department">Departamento</Label>
                <Input
                  id="department"
                  name="department"
                  placeholder="TI, Marketing, RH, etc."
                  value={formData.department}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="contractType">Tipo de Contrato</Label>
                <Select
                  value={formData.contractType}
                  onValueChange={(value) => handleSelectChange("contractType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo de contrato" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLT">CLT</SelectItem>
                    <SelectItem value="PJ">PJ</SelectItem>
                    <SelectItem value="Temporary">Temporário</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="salary">Salário</Label>
                <Input
                  id="salary"
                  name="salary"
                  type="number"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  value={formData.salary}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startDate">Data de Início</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button 
              type="button" 
              variant="outline"
              onClick={() => navigate('/dashboard/employees')}
            >
              <X size={16} className="mr-2" />
              Cancelar
            </Button>
            <Button type="submit" className="gradient-btn">
              <Save size={16} className="mr-2" />
              Salvar
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default EmployeeForm;
