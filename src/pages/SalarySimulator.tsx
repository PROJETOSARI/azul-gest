
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEmployees } from '@/contexts/EmployeeContext';
import { Calculator } from 'lucide-react';

const SalarySimulator = () => {
  const { simulateSalary } = useEmployees();
  const [baseSalary, setBaseSalary] = useState<number>(0);
  const [contractType, setContractType] = useState<'CLT' | 'PJ' | 'Temporary'>('CLT');
  const [benefits, setBenefits] = useState<number>(0);
  const [result, setResult] = useState<{
    grossSalary: number;
    deductions: number;
    benefits: number;
    netSalary: number;
    details: {
      inss: number;
      irrf: number;
      fgts: number;
      otherBenefits: number;
    };
  } | null>(null);

  const handleSimulate = () => {
    const simulationResult = simulateSalary(baseSalary, contractType, benefits);
    setResult(simulationResult);
  };

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
        <h1 className="text-3xl font-bold text-gray-800">Simulador de Salário</h1>
        <p className="text-gray-600">Calcule salários com deduções e benefícios</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calculator className="mr-2 h-5 w-5 text-brand-blue" />
                Dados para simulação
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="baseSalary">Salário Base</Label>
                <Input
                  id="baseSalary"
                  type="number"
                  placeholder="0,00"
                  value={baseSalary || ''}
                  onChange={(e) => setBaseSalary(Number(e.target.value))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractType">Tipo de Contrato</Label>
                <Select 
                  value={contractType} 
                  onValueChange={(value) => setContractType(value as 'CLT' | 'PJ' | 'Temporary')}
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
                <Label htmlFor="benefits">Benefícios</Label>
                <Input
                  id="benefits"
                  type="number"
                  placeholder="0,00"
                  value={benefits || ''}
                  onChange={(e) => setBenefits(Number(e.target.value))}
                />
              </div>

              <Button className="w-full" onClick={handleSimulate}>
                Simular Salário
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Resultado da Simulação</CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Salário Bruto</div>
                      <div className="text-xl font-bold">{formatCurrency(result.grossSalary)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Deduções</div>
                      <div className="text-xl font-bold text-red-500">-{formatCurrency(result.deductions)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Benefícios</div>
                      <div className="text-xl font-bold text-green-500">+{formatCurrency(result.benefits)}</div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-500">Salário Líquido</div>
                      <div className="text-xl font-bold text-brand-blue">{formatCurrency(result.netSalary)}</div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-3">Detalhamento</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span>INSS</span>
                        <span>{formatCurrency(result.details.inss)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>IRRF</span>
                        <span>{formatCurrency(result.details.irrf)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>FGTS (não descontado)</span>
                        <span>{formatCurrency(result.details.fgts)}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span>Outros Benefícios</span>
                        <span>{formatCurrency(result.details.otherBenefits)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Preencha os dados e clique em "Simular Salário" para ver o resultado.
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SalarySimulator;
