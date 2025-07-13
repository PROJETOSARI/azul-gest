
import { Protocol } from "@/types/protocol";

export const generatePDF = (protocol: Protocol) => {
  // Em um ambiente real, utilizaríamos uma biblioteca como jsPDF
  // Para fins de demonstração, vamos criar um arquivo de texto simples
  
  const getStatusLabel = (status: Protocol["status"]) => {
    switch(status) {
      case "pendente": return "Pendente";
      case "em_andamento": return "Em andamento";
      case "concluido": return "Concluído";
      case "rejeitado": return "Rejeitado";
      case "arquivado": return "Arquivado";
      default: return status;
    }
  };

  const content = `
PROTOCOLO #${protocol.id.substring(0, 8)}
-----------------------------------------
Nome: ${protocol.name}
Email: ${protocol.email}
CPF: ${protocol.cpf}
Telefone: ${protocol.phone}
Endereço: ${protocol.address}
-----------------------------------------
Assunto: ${protocol.subject}
Descrição: ${protocol.description}
-----------------------------------------
Status: ${getStatusLabel(protocol.status)}
Data de Criação: ${new Date(protocol.createdAt).toLocaleString()}
  `;

  // Criar um blob com o conteúdo
  const blob = new Blob([content], { type: 'text/plain' });
  
  // Criar uma URL para o blob
  const url = URL.createObjectURL(blob);
  
  // Criar um elemento anchor para download
  const a = document.createElement('a');
  a.href = url;
  a.download = `protocolo-${protocol.id.substring(0, 8)}.txt`;
  
  // Simular clique para iniciar o download
  document.body.appendChild(a);
  a.click();
  
  // Limpar
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
