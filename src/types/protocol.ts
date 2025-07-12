export interface Protocol {
  id: string;
  number: string; // Número gerado automaticamente
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  subject: string;
  description: string;
  type: "documento" | "requerimento" | "solicitacao" | "recurso" | "outros";
  category: string;
  department: string;
  urgency: "baixa" | "media" | "alta" | "urgente";
  status: "pendente" | "em_andamento" | "concluido" | "rejeitado" | "arquivado";
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  attachments: ProtocolAttachment[];
  movements: ProtocolMovement[];
  tags: string[];
}

export interface ProtocolAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
  uploadedAt: string;
}

export interface ProtocolMovement {
  id: string;
  fromDepartment: string;
  toDepartment: string;
  description: string;
  createdAt: string;
  userId: string;
  userType: "admin" | "user";
}

export interface Manifestation {
  id: string;
  number: string;
  type: "reclamacao" | "elogio" | "denuncia" | "sugestao" | "solicitacao";
  anonymous: boolean;
  name?: string;
  email?: string;
  cpf?: string;
  phone?: string;
  subject: string;
  description: string;
  status: "nova" | "em_analise" | "respondida" | "finalizada";
  department: string;
  priority: "baixa" | "media" | "alta";
  createdAt: string;
  updatedAt: string;
  dueDate: string;
  responses: ManifestationResponse[];
  attachments: ProtocolAttachment[];
}

export interface ManifestationResponse {
  id: string;
  content: string;
  isOfficial: boolean;
  createdAt: string;
  userId: string;
}

export interface Department {
  id: string;
  name: string;
  email: string;
  responsible: string;
  active: boolean;
}

export interface ProtocolConfig {
  departments: Department[];
  categories: string[];
  manifestationTypes: {
    id: string;
    name: string;
    deadline: number; // dias
  }[];
}