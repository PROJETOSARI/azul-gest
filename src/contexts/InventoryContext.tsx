
import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem, InventoryCategory, Department } from '../types/inventory';

// Sample data
const initialInventoryItems: InventoryItem[] = [
  {
    id: uuidv4(),
    name: "Papel A4",
    category: "Office Supplies",
    department: "Administration",
    quantity: 500,
    minQuantity: 100,
    expirationDate: null,
    location: "Depósito Principal - Prateleira A3",
    description: "Papel A4 branco para impressão",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 15.99
  },
  {
    id: uuidv4(),
    name: "Notebooks",
    category: "Electronics",
    department: "Education",
    quantity: 15,
    minQuantity: 5,
    expirationDate: null,
    location: "Almoxarifado TI - Armário 2",
    description: "Notebooks Dell Latitude para uso administrativo",
    lastUpdated: new Date().toISOString(),
    isOpen: true,
    unitPrice: 3500.00
  },
  {
    id: uuidv4(),
    name: "Álcool 70%",
    category: "Cleaning",
    department: "Health",
    quantity: 50,
    minQuantity: 20,
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    location: "Farmácia Central - Armário Produtos Químicos",
    description: "Álcool 70% para limpeza e desinfecção",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 8.50
  },
  {
    id: uuidv4(),
    name: "Medicamentos Básicos",
    category: "Medical",
    department: "Health",
    quantity: 200,
    minQuantity: 50,
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    location: "Farmácia Central - Seção Medicamentos",
    description: "Kit medicamentos básicos para primeiros socorros",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 45.00
  },
  {
    id: uuidv4(),
    name: "Cadeiras de Escritório",
    category: "Furniture",
    department: "Administration",
    quantity: 10,
    minQuantity: 2,
    expirationDate: null,
    location: "Depósito Principal - Seção Mobiliário",
    description: "Cadeiras ergonômicas para escritório",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 299.99
  }
];

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => void;
  updateInventoryItem: (item: InventoryItem) => void;
  deleteInventoryItem: (id: string) => void;
  getInventoryItem: (id: string) => InventoryItem | undefined;
  toggleItemOpen: (id: string) => void;
  categories: InventoryCategory[];
  departments: Department[];
  filteredItems: InventoryItem[];
  activeFilters: {
    category: InventoryCategory | 'All';
    department: Department | 'All';
    search: string;
  };
  setFilterCategory: (category: InventoryCategory | 'All') => void;
  setFilterDepartment: (department: Department | 'All') => void;
  setSearchTerm: (term: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [activeFilters, setActiveFilters] = useState({
    category: 'All' as InventoryCategory | 'All',
    department: 'All' as Department | 'All',
    search: ''
  });
  
  const categories: InventoryCategory[] = [
    'Office Supplies', 
    'Electronics', 
    'Cleaning', 
    'Furniture', 
    'Maintenance', 
    'Medical', 
    'Other'
  ];

  const departments: Department[] = [
    'Administration',
    'Education',
    'Health',
    'Infrastructure',
    'Social Services',
    'Finance',
    'Environment',
    'Other'
  ];

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = activeFilters.category === 'All' || item.category === activeFilters.category;
    const matchesDepartment = activeFilters.department === 'All' || item.department === activeFilters.department;
    const matchesSearch = activeFilters.search === '' || 
      item.name.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(activeFilters.search.toLowerCase());
    
    return matchesCategory && matchesDepartment && matchesSearch;
  });

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>) => {
    const newItem: InventoryItem = {
      ...item,
      id: uuidv4(),
      lastUpdated: new Date().toISOString()
    };
    
    setInventoryItems(prevItems => [...prevItems, newItem]);
  };

  const updateInventoryItem = (updatedItem: InventoryItem) => {
    setInventoryItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id 
          ? { ...updatedItem, lastUpdated: new Date().toISOString() } 
          : item
      )
    );
  };

  const deleteInventoryItem = (id: string) => {
    setInventoryItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const getInventoryItem = (id: string) => {
    return inventoryItems.find(item => item.id === id);
  };

  const toggleItemOpen = (id: string) => {
    setInventoryItems(prevItems => 
      prevItems.map(item => 
        item.id === id ? { ...item, isOpen: !item.isOpen } : item
      )
    );
  };

  const setFilterCategory = (category: InventoryCategory | 'All') => {
    setActiveFilters(prev => ({ ...prev, category }));
  };

  const setFilterDepartment = (department: Department | 'All') => {
    setActiveFilters(prev => ({ ...prev, department }));
  };

  const setSearchTerm = (term: string) => {
    setActiveFilters(prev => ({ ...prev, search: term }));
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        inventoryItems,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        getInventoryItem,
        toggleItemOpen,
        categories,
        departments,
        filteredItems,
        activeFilters,
        setFilterCategory,
        setFilterDepartment,
        setSearchTerm
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
};
