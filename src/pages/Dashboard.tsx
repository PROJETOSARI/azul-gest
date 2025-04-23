
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEmployees } from '@/contexts/EmployeeContext';
import { User, DollarSign, CalendarCheck, Briefcase, Users, Calculator } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { employees, calculateSalaryDeductions } = useEmployees();

  // Calculate summary data
  const totalEmployees = employees.length;
  const totalSalary = employees.reduce((sum, emp) => sum + emp.salary, 0);
  const averageSalary = totalEmployees > 0 ? totalSalary / totalEmployees : 0;
  
  // Count contract types
  const contractTypes = employees.reduce(
    (acc, emp) => {
      acc[emp.contractType]++;
      return acc;
    },
    { CLT: 0, PJ: 0, Temporary: 0 }
  );

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Bem-vindo ao painel de gestão de funcionários</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Employees Card */}
        <Card className="hover:shadow-lg transition-shadow animate-slide-up delay-75">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total de Funcionários</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-blue-100 mr-3">
                <User className="h-5 w-5 text-brand-blue" />
              </div>
              <div className="text-2xl font-bold">{totalEmployees}</div>
            </div>
          </CardContent>
        </Card>

        {/* Total Payroll Card */}
        <Card className="hover:shadow-lg transition-shadow animate-slide-up delay-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Folha de Pagamento</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-green-100 mr-3">
                <DollarSign className="h-5 w-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(totalSalary)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Average Salary Card */}
        <Card className="hover:shadow-lg transition-shadow animate-slide-up delay-150">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Salário Médio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-purple-100 mr-3">
                <CalendarCheck className="h-5 w-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold">{formatCurrency(averageSalary)}</div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Types Card */}
        <Card className="hover:shadow-lg transition-shadow animate-slide-up delay-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Tipos de Contrato</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="p-2 rounded-full bg-amber-100 mr-3">
                <Briefcase className="h-5 w-5 text-amber-600" />
              </div>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <div className="font-semibold">{contractTypes.CLT}</div>
                  <div className="text-xs text-gray-500">CLT</div>
                </div>
                <div>
                  <div className="font-semibold">{contractTypes.PJ}</div>
                  <div className="text-xs text-gray-500">PJ</div>
                </div>
                <div>
                  <div className="font-semibold">{contractTypes.Temporary}</div>
                  <div className="text-xs text-gray-500">Temp</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link to="/dashboard/employees">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="mr-2 h-5 w-5 text-brand-blue" />
                  Listar Funcionários
                </CardTitle>
                <CardDescription>
                  Visualize todos os funcionários cadastrados no sistema
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link to="/dashboard/employees/new">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="mr-2 h-5 w-5 text-brand-blue" />
                  Cadastrar Funcionário
                </CardTitle>
                <CardDescription>
                  Adicione um novo funcionário ao sistema
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          
          <Link to="/dashboard/salary-simulator">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calculator className="mr-2 h-5 w-5 text-brand-blue" />
                  Simulador de Salário
                </CardTitle>
                <CardDescription>
                  Calcule salários com deduções e benefícios
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Employees Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Funcionários Recentes</h2>
        <Card>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Nome</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Cargo</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Departamento</th>
                  <th className="py-3 px-4 text-right font-medium text-gray-500">Salário</th>
                </tr>
              </thead>
              <tbody>
                {employees.slice(0, 5).map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{employee.name}</div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{employee.role}</td>
                    <td className="py-3 px-4 text-gray-600">{employee.department}</td>
                    <td className="py-3 px-4 text-right">{formatCurrency(employee.salary)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
