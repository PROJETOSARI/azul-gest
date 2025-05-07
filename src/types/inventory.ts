
export type InventoryCategory = 
  | 'Office Supplies'
  | 'Electronics'
  | 'Cleaning'
  | 'Furniture'
  | 'Maintenance'
  | 'Medical'
  | 'Other';

export type Department = 
  | 'Administration'
  | 'Education'
  | 'Health'
  | 'Infrastructure'
  | 'Social Services'
  | 'Finance'
  | 'Environment'
  | 'Other';

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
}
