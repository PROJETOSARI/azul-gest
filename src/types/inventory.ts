
export type InventoryCategory = 
  | 'Material de Escritório'
  | 'Eletrônicos'
  | 'Limpeza'
  | 'Mobiliário'
  | 'Manutenção'
  | 'Médico'
  | 'Outros';

export type Department = 
  | 'Administração'
  | 'Educação'
  | 'Saúde'
  | 'Infraestrutura'
  | 'Serviços Sociais'
  | 'Finanças'
  | 'Meio Ambiente'
  | 'Outros';

export interface HistoryRecord {
  id: string;
  timestamp: string;
  action: 'Adicionado' | 'Atualizado' | 'Removido' | 'Aberto' | 'Fechado';
  userName: string;
  itemId: string;
  details: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  department: Department;
  quantity: number;
  minQuantity: number;
  expirationDate: string | null;
  location: string;
  description: string;
  lastUpdated: string;
  isOpen: boolean;
  unitPrice: number;
  initialQuantity: number; // Adicionado o campo de quantidade inicial
}
