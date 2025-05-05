import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Employee, useEmployees } from "@/contexts/EmployeeContext";
import { useState } from "react";
import { Calculator, Eye, Plus, Trash, User, FileText, FileSpreadsheet } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const EmployeesList = () => {
  const { employees, deleteEmployee, calculateSalaryDeductions } = useEmployees();
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const openDetails = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsDetailsOpen(true);
  };

  const getContractTypeColor = (type: string) => {
    switch (type) {
      case 'CLT':
        return 'bg-green-100 text-green-800';
      case 'PJ':
        return 'bg-blue-100 text-blue-800';
      case 'Temporary':
        return 'bg-amber-100 text-amber-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleExportPDF = (name: string) => {
    // Implement PDF export logic here
  };

  const handleExportExcel = (name: string) => {
    // Implement Excel export logic here
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Funcionários</h1>
          <p className="text-gray-600">Gerencie os funcionários da empresa</p>
        </div>
        <Link to="/dashboard/employees/new">
          <Button className="mt-4 md:mt-0 gradient-btn">
            <Plus size={16} className="mr-2" />
            Novo Funcionário
          </Button>
        </Link>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Filtros</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full">
            <Input
              placeholder="Buscar por nome, cargo ou departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Funcionários</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <User className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">Nenhum funcionário encontrado</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? "Tente mudar os termos da busca ou limpar os filtros." 
                  : "Cadastre um novo funcionário para vê-lo aqui."}
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm("")}>
                  Limpar Filtros
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b">
                    <th className="py-3 px-4 text-left font-medium text-gray-500">Nome</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 hidden md:table-cell">Cargo</th>
                    <th className="py-3 px-4 text-left font-medium text-gray-500 hidden lg:table-cell">Departamento</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-500 hidden md:table-cell">Contrato</th>
                    <th className="py-3 px-4 text-right font-medium text-gray-500">Salário</th>
                    <th className="py-3 px-4 text-center font-medium text-gray-500">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-gray-500 text-xs md:hidden">{employee.role}</div>
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden md:table-cell">
                        {employee.role}
                      </td>
                      <td className="py-3 px-4 text-gray-600 hidden lg:table-cell">
                        {employee.department}
                      </td>
                      <td className="py-3 px-4 text-center hidden md:table-cell">
                        <Badge variant="outline" className={getContractTypeColor(employee.contractType)}>
                          {employee.contractType}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-right">
                        {formatCurrency(employee.salary)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => openDetails(employee)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600"
                            onClick={() => deleteEmployee(employee.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Employee Details Dialog */}
      {selectedEmployee && (
        <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Detalhes do Funcionário</span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExportPDF(selectedEmployee.name)}
                    className="h-8 w-8"
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleExportExcel(selectedEmployee.name)}
                    className="h-8 w-8"
                  >
                    <FileSpreadsheet className="h-4 w-4" />
                  </Button>
                </div>
              </DialogTitle>
              <DialogDescription>
                Informações completas e cálculo de salário
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="flex justify-center mb-4">
                <div className="h-20 w-20 rounded-full bg-brand-blue text-white flex items-center justify-center text-xl font-bold">
                  {selectedEmployee.name.split(' ').map(part => part[0]).join('').substring(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{selectedEmployee.name}</h3>
                <p className="text-gray-500">{selectedEmployee.role}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="font-medium text-gray-500">Idade</div>
                  <div>{selectedEmployee.age} anos</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Departamento</div>
                  <div>{selectedEmployee.department}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Contrato</div>
                  <div>{selectedEmployee.contractType}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-500">Data de Início</div>
                  <div>{new Date(selectedEmployee.startDate).toLocaleDateString('pt-BR')}</div>
                </div>
                <div className="col-span-2">
                  <div className="font-medium text-gray-500">Endereço</div>
                  <div>{selectedEmployee.address}</div>
                </div>
              </div>
              
              <div className="mt-2">
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="flex items-center mb-3">
                    <Calculator className="h-5 w-5 mr-2 text-brand-blue" />
                    <div className="font-semibold">Cálculo de Salário</div>
                  </div>

                  {(() => {
                    const { inss, irrf, netSalary } = calculateSalaryDeductions(selectedEmployee.salary);
                    return (
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Salário Bruto:</span>
                          <span className="font-medium">{formatCurrency(selectedEmployee.salary)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>INSS:</span>
                          <span className="text-red-600">-{formatCurrency(inss)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>IRRF:</span>
                          <span className="text-red-600">-{formatCurrency(irrf)}</span>
                        </div>
                        <div className="border-t pt-2 mt-2 flex justify-between font-bold">
                          <span>Salário Líquido:</span>
                          <span className="text-green-600">{formatCurrency(netSalary)}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default EmployeesList;
