import React, { createContext, useContext, useState, useEffect } from 'react';
import { Protocol, Manifestation, Department, ProtocolConfig } from '@/types/protocol';

interface ProtocolContextType {
  protocols: Protocol[];
  manifestations: Manifestation[];
  config: ProtocolConfig;
  addProtocol: (protocol: Omit<Protocol, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => string;
  updateProtocol: (id: string, updates: Partial<Protocol>) => void;
  addManifestation: (manifestation: Omit<Manifestation, 'id' | 'number' | 'createdAt' | 'updatedAt'>) => string;
  updateManifestation: (id: string, updates: Partial<Manifestation>) => void;
  generateProtocolNumber: () => string;
  generateManifestationNumber: () => string;
}

const ProtocolContext = createContext<ProtocolContextType | null>(null);

export const useProtocol = () => {
  const context = useContext(ProtocolContext);
  if (!context) {
    throw new Error('useProtocol must be used within a ProtocolProvider');
  }
  return context;
};

export const ProtocolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [manifestations, setManifestations] = useState<Manifestation[]>([]);
  const [config] = useState<ProtocolConfig>({
    departments: [
      { id: '1', name: 'Administração', email: 'admin@prefeitura.gov.br', responsible: 'João Silva', active: true },
      { id: '2', name: 'Recursos Humanos', email: 'rh@prefeitura.gov.br', responsible: 'Maria Santos', active: true },
      { id: '3', name: 'Obras', email: 'obras@prefeitura.gov.br', responsible: 'Pedro Costa', active: true },
      { id: '4', name: 'Educação', email: 'educacao@prefeitura.gov.br', responsible: 'Ana Lima', active: true },
      { id: '5', name: 'Saúde', email: 'saude@prefeitura.gov.br', responsible: 'Carlos Oliveira', active: true },
    ],
    categories: [
      'Documentos Pessoais',
      'Licenças e Alvarás',
      'Tributos e Impostos',
      'Obras e Urbanismo',
      'Meio Ambiente',
      'Educação',
      'Saúde',
      'Assistência Social',
      'Outros'
    ],
    manifestationTypes: [
      { id: 'reclamacao', name: 'Reclamação', deadline: 30 },
      { id: 'elogio', name: 'Elogio', deadline: 15 },
      { id: 'denuncia', name: 'Denúncia', deadline: 60 },
      { id: 'sugestao', name: 'Sugestão', deadline: 30 },
      { id: 'solicitacao', name: 'Solicitação', deadline: 45 },
    ]
  });

  useEffect(() => {
    const savedProtocols = localStorage.getItem('protocols_v2');
    const savedManifestations = localStorage.getItem('manifestations');
    
    if (savedProtocols) {
      try {
        setProtocols(JSON.parse(savedProtocols));
      } catch (error) {
        console.error('Error loading protocols:', error);
      }
    }
    
    if (savedManifestations) {
      try {
        setManifestations(JSON.parse(savedManifestations));
      } catch (error) {
        console.error('Error loading manifestations:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('protocols_v2', JSON.stringify(protocols));
  }, [protocols]);

  useEffect(() => {
    localStorage.setItem('manifestations', JSON.stringify(manifestations));
  }, [manifestations]);

  const generateProtocolNumber = (): string => {
    const year = new Date().getFullYear();
    const count = protocols.length + 1;
    return `${count.toString().padStart(6, '0')}/${year}`;
  };

  const generateManifestationNumber = (): string => {
    const year = new Date().getFullYear();
    const count = manifestations.length + 1;
    return `OUV-${count.toString().padStart(4, '0')}/${year}`;
  };

  const addProtocol = (protocolData: Omit<Protocol, 'id' | 'number' | 'createdAt' | 'updatedAt'>): string => {
    const id = crypto.randomUUID();
    const number = generateProtocolNumber();
    const now = new Date().toISOString();
    
    const newProtocol: Protocol = {
      ...protocolData,
      id,
      number,
      createdAt: now,
      updatedAt: now,
    };
    
    setProtocols(prev => [...prev, newProtocol]);
    return number;
  };

  const updateProtocol = (id: string, updates: Partial<Protocol>) => {
    setProtocols(prev => prev.map(protocol => 
      protocol.id === id 
        ? { ...protocol, ...updates, updatedAt: new Date().toISOString() }
        : protocol
    ));
  };

  const addManifestation = (manifestationData: Omit<Manifestation, 'id' | 'number' | 'createdAt' | 'updatedAt'>): string => {
    const id = crypto.randomUUID();
    const number = generateManifestationNumber();
    const now = new Date().toISOString();
    
    const newManifestation: Manifestation = {
      ...manifestationData,
      id,
      number,
      createdAt: now,
      updatedAt: now,
    };
    
    setManifestations(prev => [...prev, newManifestation]);
    return number;
  };

  const updateManifestation = (id: string, updates: Partial<Manifestation>) => {
    setManifestations(prev => prev.map(manifestation => 
      manifestation.id === id 
        ? { ...manifestation, ...updates, updatedAt: new Date().toISOString() }
        : manifestation
    ));
  };

  return (
    <ProtocolContext.Provider value={{
      protocols,
      manifestations,
      config,
      addProtocol,
      updateProtocol,
      addManifestation,
      updateManifestation,
      generateProtocolNumber,
      generateManifestationNumber,
    }}>
      {children}
    </ProtocolContext.Provider>
  );
};