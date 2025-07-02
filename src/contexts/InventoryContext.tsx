import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { InventoryItem, InventoryCategory, Department, HistoryRecord } from '../types/inventory';

// Dados de exemplo
const initialInventoryItems: InventoryItem[] = [
  {
    id: uuidv4(),
    name: "Papel A4",
    category: "Material de Escritório",
    department: "Administração",
    quantity: 500,
    minQuantity: 100,
    expirationDate: null,
    location: "Depósito Principal - Prateleira A3",
    description: "Papel A4 branco para impressão",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 15.99,
    initialQuantity: 500  // Adicionada quantidade inicial
  },
  {
    id: uuidv4(),
    name: "Notebooks",
    category: "Eletrônicos",
    department: "Educação",
    quantity: 15,
    minQuantity: 5,
    expirationDate: null,
    location: "Almoxarifado TI - Armário 2",
    description: "Notebooks Dell Latitude para uso administrativo",
    lastUpdated: new Date().toISOString(),
    isOpen: true,
    unitPrice: 3500.00,
    initialQuantity: 20  // Adicionada quantidade inicial
  },
  {
    id: uuidv4(),
    name: "Álcool 70%",
    category: "Limpeza",
    department: "Saúde",
    quantity: 50,
    minQuantity: 20,
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString(),
    location: "Farmácia Central - Armário Produtos Químicos",
    description: "Álcool 70% para limpeza e desinfecção",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 8.50,
    initialQuantity: 100  // Adicionada quantidade inicial
  },
  {
    id: uuidv4(),
    name: "Medicamentos Básicos",
    category: "Médico",
    department: "Saúde",
    quantity: 200,
    minQuantity: 50,
    expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 3)).toISOString(),
    location: "Farmácia Central - Seção Medicamentos",
    description: "Kit medicamentos básicos para primeiros socorros",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 45.00,
    initialQuantity: 250  // Adicionada quantidade inicial
  },
  {
    id: uuidv4(),
    name: "Cadeiras de Escritório",
    category: "Mobiliário",
    department: "Administração",
    quantity: 10,
    minQuantity: 2,
    expirationDate: null,
    location: "Depósito Principal - Seção Mobiliário",
    description: "Cadeiras ergonômicas para escritório",
    lastUpdated: new Date().toISOString(),
    isOpen: false,
    unitPrice: 299.99,
    initialQuantity: 15  // Adicionada quantidade inicial
  }
];

// Histórico inicial baseado nos itens
const initialHistoryRecords: HistoryRecord[] = initialInventoryItems.map(item => ({
  id: uuidv4(),
  timestamp: item.lastUpdated,
  action: 'Adicionado',
  userName: 'Admin',
  itemId: item.id,
  details: `Item "${item.name}" adicionado ao sistema`
}));

interface InventoryContextType {
  inventoryItems: InventoryItem[];
  historyRecords: HistoryRecord[];
  addInventoryItem: (item: Omit<InventoryItem, 'id' | 'lastUpdated'>, userName: string) => void;
  updateInventoryItem: (item: InventoryItem, userName: string) => void;
  deleteInventoryItem: (id: string, userName: string) => void;
  getInventoryItem: (id: string) => InventoryItem | undefined;
  toggleItemOpen: (id: string, userName: string) => void;
  getItemHistory: (itemId: string) => HistoryRecord[];
  categories: InventoryCategory[];
  departments: Department[];
  filteredItems: InventoryItem[];
  activeFilters: {
    category: InventoryCategory | 'Todos';
    department: Department | 'Todos';
    search: string;
  };
  setFilterCategory: (category: InventoryCategory | 'Todos') => void;
  setFilterDepartment: (department: Department | 'Todos') => void;
  setSearchTerm: (term: string) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export const useInventory = (): InventoryContextType => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory deve ser usado dentro de um InventoryProvider');
  }
  return context;
};

export const InventoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(initialInventoryItems);
  const [historyRecords, setHistoryRecords] = useState<HistoryRecord[]>(initialHistoryRecords);
  const [activeFilters, setActiveFilters] = useState({
    category: 'Todos' as InventoryCategory | 'Todos',
    department: 'Todos' as Department | 'Todos',
    search: ''
  });
  
  const categories: InventoryCategory[] = [
    'Material de Escritório', 
    'Eletrônicos', 
    'Limpeza', 
    'Mobiliário', 
    'Manutenção', 
    'Médico', 
    'Outros'
  ];

  const departments: Department[] = [
    'Administração',
    'Educação',
    'Saúde',
    'Infraestrutura',
    'Serviços Sociais',
    'Finanças',
    'Meio Ambiente',
    'Outros'
  ];

  const addHistoryRecord = (record: Omit<HistoryRecord, 'id'>) => {
    const newRecord: HistoryRecord = {
      ...record,
      id: uuidv4()
    };
    
    setHistoryRecords(prev => [newRecord, ...prev]);
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesCategory = activeFilters.category === 'Todos' || item.category === activeFilters.category;
    const matchesDepartment = activeFilters.department === 'Todos' || item.department === activeFilters.department;
    const matchesSearch = activeFilters.search === '' || 
      item.name.toLowerCase().includes(activeFilters.search.toLowerCase()) ||
      item.description.toLowerCase().includes(activeFilters.search.toLowerCase());
    
    return matchesCategory && matchesDepartment && matchesSearch;
  });

  const addInventoryItem = (item: Omit<InventoryItem, 'id' | 'lastUpdated'>, userName: string) => {
    const timestamp = new Date().toISOString();
    const newItemId = uuidv4();
    
    const newItem: InventoryItem = {
      ...item,
      id: newItemId,
      lastUpdated: timestamp,
      initialQuantity: item.quantity // Definindo a quantidade inicial como a quantidade atual ao criar
    };
    
    setInventoryItems(prevItems => [...prevItems, newItem]);
    
    // Adicionar ao histórico
    addHistoryRecord({
      timestamp,
      action: 'Adicionado',
      userName,
      itemId: newItemId,
      details: `Item "${item.name}" adicionado ao inventário`
    });
  };

  const updateInventoryItem = (updatedItem: InventoryItem, userName: string) => {
    const timestamp = new Date().toISOString();
    const oldItem = inventoryItems.find(item => item.id === updatedItem.id);
    
    setInventoryItems(prevItems => 
      prevItems.map(item => 
        item.id === updatedItem.id 
          ? { ...updatedItem, lastUpdated: timestamp } 
          : item
      )
    );
    
    // Adicionar ao histórico
    addHistoryRecord({
      timestamp,
      action: 'Atualizado',
      userName,
      itemId: updatedItem.id,
      details: `Item "${updatedItem.name}" atualizado`
    });
  };

  const deleteInventoryItem = (id: string, userName: string) => {
    const timestamp = new Date().toISOString();
    const itemToDelete = inventoryItems.find(item => item.id === id);
    
    if (itemToDelete) {
      setInventoryItems(prevItems => prevItems.filter(item => item.id !== id));
      
      // Adicionar ao histórico
      addHistoryRecord({
        timestamp,
        action: 'Removido',
        userName,
        itemId: id,
        details: `Item "${itemToDelete.name}" removido do inventário`
      });
    }
  };

  const getInventoryItem = (id: string) => {
    return inventoryItems.find(item => item.id === id);
  };

  const toggleItemOpen = (id: string, userName: string) => {
    const timestamp = new Date().toISOString();
    const item = inventoryItems.find(item => item.id === id);
    
    if (item) {
      setInventoryItems(prevItems => 
        prevItems.map(item => 
          item.id === id ? { ...item, isOpen: !item.isOpen, lastUpdated: timestamp } : item
        )
      );
      
      // Adicionar ao histórico
      addHistoryRecord({
        timestamp,
        action: item.isOpen ? 'Fechado' : 'Aberto',
        userName,
        itemId: id,
        details: `Item "${item.name}" ${item.isOpen ? 'fechado' : 'aberto'}`
      });
    }
  };

  const getItemHistory = (itemId: string) => {
    return historyRecords.filter(record => record.itemId === itemId).sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  };

  const setFilterCategory = (category: InventoryCategory | 'Todos') => {
    setActiveFilters(prev => ({ ...prev, category }));
  };

  const setFilterDepartment = (department: Department | 'Todos') => {
    setActiveFilters(prev => ({ ...prev, department }));
  };

  const setSearchTerm = (term: string) => {
    setActiveFilters(prev => ({ ...prev, search: term }));
  };

  return (
    <InventoryContext.Provider 
      value={{ 
        inventoryItems,
        historyRecords,
        addInventoryItem,
        updateInventoryItem,
        deleteInventoryItem,
        getInventoryItem,
        toggleItemOpen,
        getItemHistory,
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
