
interface Contract {
  id: string;
  numero: string;
  empresa: string;
  objeto: string;
  valor: number;
  dataInicio: string;
  dataFim: string;
  status: string;
}

export const generateContractPDF = (contract: Contract) => {
  const content = `
CONTRATO #${contract.numero}
-----------------------------------------
Empresa: ${contract.empresa}
Objeto: ${contract.objeto}
Valor: ${new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(contract.valor)}
Data de Início: ${new Date(contract.dataInicio).toLocaleDateString('pt-BR')}
Data de Término: ${new Date(contract.dataFim).toLocaleDateString('pt-BR')}
Status: ${contract.status}
-----------------------------------------
`;

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `contrato-${contract.numero}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};
