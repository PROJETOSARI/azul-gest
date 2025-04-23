
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Employee type definition
export interface Employee {
  id: string;
  name: string;
  age: number;
  address: string;
  role: string;
  contractType: 'CLT' | 'PJ' | 'Temporary';
  salary: number;
  startDate: string;
  department: string;
  photo?: string;
}

interface EmployeeContextType {
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  deleteEmployee: (id: string) => void;
  getEmployee: (id: string) => Employee | undefined;
  calculateSalaryDeductions: (salary: number) => {
    inss: number;
    irrf: number;
    netSalary: number;
  };
  simulateSalary: (baseSalary: number, contractType: 'CLT' | 'PJ' | 'Temporary', benefitsValue?: number) => {
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
  };
}

// Create the context
const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

// Local storage key
const EMPLOYEES_STORAGE_KEY = 'rh-system-employees';

// Sample data
const sampleEmployees: Employee[] = [
  {
    id: '1',
    name: 'João Silva',
    age: 35,
    address: 'Rua das Flores, 123 - São Paulo',
    role: 'Desenvolvedor Front-end',
    contractType: 'CLT',
    salary: 7500,
    startDate: '2022-03-15',
    department: 'Tecnologia',
  },
  {
    id: '2',
    name: 'Maria Oliveira',
    age: 28,
    address: 'Av. Paulista, 1000 - São Paulo',
    role: 'UI/UX Designer',
    contractType: 'PJ',
    salary: 6800,
    startDate: '2022-01-10',
    department: 'Design',
  },
  {
    id: '3',
    name: 'Carlos Santos',
    age: 42,
    address: 'Rua Augusta, 789 - São Paulo',
    role: 'Gerente de Projetos',
    contractType: 'CLT',
    salary: 12000,
    startDate: '2021-11-05',
    department: 'Gerência',
  }
];

// Provider component
export const EmployeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const { toast } = useToast();

  // Load data from localStorage on initial render
  useEffect(() => {
    const storedEmployees = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      // If no stored data, use sample data
      setEmployees(sampleEmployees);
    }
  }, []);

  // Save data to localStorage whenever employees state changes
  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
    }
  }, [employees]);

  // Add new employee
  const addEmployee = (employeeData: Omit<Employee, 'id'>) => {
    const newEmployee = {
      ...employeeData,
      id: Date.now().toString(),
    };
    
    const updatedEmployees = [...employees, newEmployee];
    setEmployees(updatedEmployees);
    
    toast({
      title: "Funcionário adicionado",
      description: `${newEmployee.name} foi cadastrado com sucesso.`,
    });
  };

  // Update employee
  const updateEmployee = (id: string, employeeData: Partial<Employee>) => {
    const updatedEmployees = employees.map((employee) =>
      employee.id === id ? { ...employee, ...employeeData } : employee
    );
    
    setEmployees(updatedEmployees);
    
    toast({
      title: "Funcionário atualizado",
      description: "As informações foram atualizadas com sucesso.",
    });
  };

  // Delete employee
  const deleteEmployee = (id: string) => {
    const employeeName = employees.find(e => e.id === id)?.name;
    const updatedEmployees = employees.filter((employee) => employee.id !== id);
    
    setEmployees(updatedEmployees);
    
    toast({
      title: "Funcionário removido",
      description: `${employeeName || 'O funcionário'} foi removido com sucesso.`,
      variant: "destructive",
    });
  };

  // Get employee by ID
  const getEmployee = (id: string) => {
    return employees.find((employee) => employee.id === id);
  };

  // Calculate salary deductions (Brazilian system)
  const calculateSalaryDeductions = (salary: number) => {
    // INSS calculation (simplified for demo)
    let inss = 0;
    if (salary <= 1320) {
      inss = salary * 0.075;
    } else if (salary <= 2571.29) {
      inss = salary * 0.09;
    } else if (salary <= 3856.94) {
      inss = salary * 0.12;
    } else if (salary <= 7507.49) {
      inss = salary * 0.14;
    } else {
      inss = 877.24; // Max INSS contribution
    }

    // Base for IRRF
    const baseIrrf = salary - inss;

    // IRRF calculation (simplified for demo)
    let irrf = 0;
    if (baseIrrf <= 2112) {
      irrf = 0;
    } else if (baseIrrf <= 2826.65) {
      irrf = (baseIrrf * 0.075) - 158.40;
    } else if (baseIrrf <= 3751.05) {
      irrf = (baseIrrf * 0.15) - 370.40;
    } else if (baseIrrf <= 4664.68) {
      irrf = (baseIrrf * 0.225) - 651.73;
    } else {
      irrf = (baseIrrf * 0.275) - 884.96;
    }

    // Net salary
    const netSalary = salary - inss - irrf;

    return {
      inss: Math.round(inss * 100) / 100,
      irrf: Math.round(irrf * 100) / 100,
      netSalary: Math.round(netSalary * 100) / 100
    };
  };

  // Simulate salary with contract type and benefits
  const simulateSalary = (baseSalary: number, contractType: 'CLT' | 'PJ' | 'Temporary', benefitsValue: number = 0) => {
    let grossSalary = baseSalary;
    let deductions = 0;
    let inss = 0;
    let irrf = 0;
    let fgts = 0;
    let otherBenefits = benefitsValue;

    // Calculate differently based on contract type
    if (contractType === 'CLT') {
      // INSS calculation (simplified)
      if (baseSalary <= 1320) {
        inss = baseSalary * 0.075;
      } else if (baseSalary <= 2571.29) {
        inss = baseSalary * 0.09;
      } else if (baseSalary <= 3856.94) {
        inss = baseSalary * 0.12;
      } else if (baseSalary <= 7507.49) {
        inss = baseSalary * 0.14;
      } else {
        inss = 877.24; // Max INSS contribution
      }

      // Base for IRRF
      const baseIrrf = baseSalary - inss;

      // IRRF calculation (simplified)
      if (baseIrrf <= 2112) {
        irrf = 0;
      } else if (baseIrrf <= 2826.65) {
        irrf = (baseIrrf * 0.075) - 158.40;
      } else if (baseIrrf <= 3751.05) {
        irrf = (baseIrrf * 0.15) - 370.40;
      } else if (baseIrrf <= 4664.68) {
        irrf = (baseIrrf * 0.225) - 651.73;
      } else {
        irrf = (baseIrrf * 0.275) - 884.96;
      }

      // FGTS (8%)
      fgts = baseSalary * 0.08;
      
      deductions = inss + irrf;
    } else if (contractType === 'PJ') {
      // PJ simplified tax calculation (assumed 6% simplified taxation)
      deductions = baseSalary * 0.06;
      inss = 0;
      irrf = deductions;
      fgts = 0;
    } else if (contractType === 'Temporary') {
      // Temporary workers have simpler tax structure 
      inss = baseSalary * 0.11;
      irrf = baseSalary * 0.05;
      deductions = inss + irrf;
      fgts = 0;
    }

    // Round values for better display
    inss = Math.round(inss * 100) / 100;
    irrf = Math.round(irrf * 100) / 100;
    fgts = Math.round(fgts * 100) / 100;
    deductions = Math.round(deductions * 100) / 100;
    
    // Calculate net salary
    const netSalary = Math.round((grossSalary - deductions + otherBenefits) * 100) / 100;

    return {
      grossSalary,
      deductions,
      benefits: otherBenefits,
      netSalary,
      details: {
        inss,
        irrf,
        fgts,
        otherBenefits
      }
    };
  };

  return (
    <EmployeeContext.Provider
      value={{
        employees,
        addEmployee,
        updateEmployee,
        deleteEmployee,
        getEmployee,
        calculateSalaryDeductions,
        simulateSalary,
      }}
    >
      {children}
    </EmployeeContext.Provider>
  );
};

// Custom hook to use the employee context
export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};
