
export type Category = {
  id: string;
  name: string;
  description?: string;
};

export type Department = {
  id: string;
  name: string;
  code?: string;
};

export type InventoryItem = {
  id: string;
  name: string;
  description?: string;
  category: Category;
  quantity: number;
  minStock: number;
  department: Department;
  expirationDate?: Date | null;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
  isOpen?: boolean;
  openedAt?: Date | null;
  openedBy?: string | null;
};

export type InventoryItemFormData = Omit<InventoryItem, 'id' | 'createdAt' | 'updatedAt'>;

export const MOCK_CATEGORIES: Category[] = [
  { id: '1', name: 'Escritório', description: 'Material de escritório' },
  { id: '2', name: 'Limpeza', description: 'Material de limpeza' },
  { id: '3', name: 'Informática', description: 'Equipamentos de informática' },
  { id: '4', name: 'Alimentação', description: 'Itens alimentares' },
  { id: '5', name: 'Saúde', description: 'Material hospitalar e medicamentos' },
];

export const MOCK_DEPARTMENTS: Department[] = [
  { id: '1', name: 'Administração', code: 'ADM' },
  { id: '2', name: 'Recursos Humanos', code: 'RH' },
  { id: '3', name: 'Tecnologia da Informação', code: 'TI' },
  { id: '4', name: 'Financeiro', code: 'FIN' },
  { id: '5', name: 'Saúde', code: 'SAU' },
  { id: '6', name: 'Educação', code: 'EDU' },
  { id: '7', name: 'Infraestrutura', code: 'INF' },
];

export const MOCK_INVENTORY_ITEMS: InventoryItem[] = [
  {
    id: '1',
    name: 'Papel A4',
    description: 'Resma de papel A4 com 500 folhas',
    category: MOCK_CATEGORIES[0],
    quantity: 50,
    minStock: 10,
    department: MOCK_DEPARTMENTS[0],
    expirationDate: null,
    location: 'Prateleira A1',
    createdAt: new Date('2025-02-15'),
    updatedAt: new Date('2025-02-15'),
    isOpen: false,
  },
  {
    id: '2',
    name: 'Detergente',
    description: 'Detergente líquido neutro 500ml',
    category: MOCK_CATEGORIES[1],
    quantity: 30,
    minStock: 5,
    department: MOCK_DEPARTMENTS[0],
    expirationDate: new Date('2026-10-20'),
    location: 'Armário B2',
    createdAt: new Date('2025-01-10'),
    updatedAt: new Date('2025-01-10'),
    isOpen: false,
  },
  {
    id: '3',
    name: 'Mouse sem fio',
    description: 'Mouse óptico sem fio USB',
    category: MOCK_CATEGORIES[2],
    quantity: 15,
    minStock: 3,
    department: MOCK_DEPARTMENTS[2],
    expirationDate: null,
    location: 'Prateleira C3',
    createdAt: new Date('2025-03-05'),
    updatedAt: new Date('2025-03-05'),
    isOpen: false,
  },
  {
    id: '4',
    name: 'Café',
    description: 'Café em pó 500g',
    category: MOCK_CATEGORIES[3],
    quantity: 25,
    minStock: 8,
    department: MOCK_DEPARTMENTS[0],
    expirationDate: new Date('2025-12-15'),
    location: 'Prateleira D4',
    createdAt: new Date('2025-04-20'),
    updatedAt: new Date('2025-04-20'),
    isOpen: true,
    openedAt: new Date('2025-05-01'),
    openedBy: 'João Silva',
  },
  {
    id: '5',
    name: 'Máscara Descartável',
    description: 'Caixa com 50 máscaras descartáveis',
    category: MOCK_CATEGORIES[4],
    quantity: 40,
    minStock: 10,
    department: MOCK_DEPARTMENTS[4],
    expirationDate: new Date('2027-05-30'),
    location: 'Armário E5',
    createdAt: new Date('2025-02-01'),
    updatedAt: new Date('2025-02-01'),
    isOpen: false,
  },
];
