
export interface Protocol {
  id: string;
  name: string;
  email: string;
  cpf: string;
  phone: string;
  address: string;
  subject: string;
  description: string;
  status: "pending" | "in_progress" | "completed" | "rejected";
  createdAt: string;
}
