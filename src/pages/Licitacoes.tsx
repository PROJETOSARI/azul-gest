
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { FileText, Search, Plus, Download, Trash, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { generateContractPDF } from '@/utils/generateContractPDF';

interface Contrato {
  id: string;
  numero: string;
  empresa: string;
  objeto: string;
  valor: number;
  dataInicio: string;
  dataFim: string;
  status: "Vigente" | "Finalizado" | "Cancelado";
}

interface Relatorio {
  id: string;
  titulo: string;
  tipo: string;
  dataGeracao: string;
  geradoPor: string;
  arquivo: string;
}

const contratosMock: Contrato[] = [
  {
    id: "1",
    numero: "001/2025",
    empresa: "Construções Ideais Ltda",
    objeto: "Pavimentação de ruas centrais",
    valor: 850000,
    dataInicio: "2025-01-15",
    dataFim: "2025-07-15",
    status: "Vigente"
  },
  {
    id: "2",
    numero: "002/2025",
    empresa: "Tecnologia Municipal S.A.",
    objeto: "Fornecimento de sistemas de gerenciamento",
    valor: 120000,
    dataInicio: "2025-02-01",
    dataFim: "2026-01-31",
    status: "Vigente"
  },
  {
    id: "3",
    numero: "003/2025",
    empresa: "Verde & Jardins",
    objeto: "Manutenção de áreas verdes",
    valor: 75000,
    dataInicio: "2025-03-01",
    dataFim: "2025-02-28",
    status: "Vigente"
  }
];

const relatoriosMock: Relatorio[] = [
  {
    id: "1",
    titulo: "Relatório Anual de Licitações",
    tipo: "Anual",
    dataGeracao: "2025-01-10",
    geradoPor: "Ana Silva",
    arquivo: "relatorio_anual_2024.pdf"
  },
  {
    id: "2",
    titulo: "Contratos Finalizados Q1",
    tipo: "Trimestral",
    dataGeracao: "2025-04-02",
    geradoPor: "Carlos Santos",
    arquivo: "contratos_finalizados_q1_2025.pdf"
  },
  {
    id: "3",
    titulo: "Licitações em Andamento",
    tipo: "Mensal",
    dataGeracao: "2025-04-15",
    geradoPor: "Maria Oliveira",
    arquivo: "licitacoes_andamento_abril_2025.pdf"
  }
];

const Licitacoes = () => {
  const [contratos, setContratos] = useState<Contrato[]>(contratosMock);
  const [relatorios, setRelatorios] = useState<Relatorio[]>(relatoriosMock);
  const [searchContrato, setSearchContrato] = useState("");
  const [searchRelatorio, setSearchRelatorio] = useState("");
  const [novoContrato, setNovoContrato] = useState<Partial<Contrato>>({});
  const [novoRelatorio, setNovoRelatorio] = useState<Partial<Relatorio>>({});
  const [openDialogContrato, setOpenDialogContrato] = useState(false);
  const [openDialogRelatorio, setOpenDialogRelatorio] = useState(false);
  const [selectedContract, setSelectedContract] = useState<Contrato | null>(null);
  const [openContractDialog, setOpenContractDialog] = useState(false);
  const { toast } = useToast();

  const filteredContratos = contratos.filter(contrato => 
    contrato.numero.toLowerCase().includes(searchContrato.toLowerCase()) || 
    contrato.empresa.toLowerCase().includes(searchContrato.toLowerCase()) ||
    contrato.objeto.toLowerCase().includes(searchContrato.toLowerCase())
  );

  const handleContratoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoContrato({
      ...novoContrato,
      [name]: name === 'valor' ? parseFloat(value) : value
    });
  };

  const handleEditContract = (contract: Contrato) => {
    setSelectedContract(contract);
    setNovoContrato({
      numero: contract.numero,
      empresa: contract.empresa,
      objeto: contract.objeto,
      valor: contract.valor,
      dataInicio: contract.dataInicio,
      dataFim: contract.dataFim
    });
    setOpenDialogContrato(true);
  };

  const handleContratoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoContrato.numero || !novoContrato.empresa || !novoContrato.objeto || 
        !novoContrato.valor || !novoContrato.dataInicio || !novoContrato.dataFim) {
      toast({
        title: "Erro ao salvar contrato",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (selectedContract) {
      const updatedContratos = contratos.map(contrato => 
        contrato.id === selectedContract.id ? {
          ...contrato,
          numero: novoContrato.numero!,
          empresa: novoContrato.empresa!,
          objeto: novoContrato.objeto!,
          valor: novoContrato.valor!,
          dataInicio: novoContrato.dataInicio!,
          dataFim: novoContrato.dataFim!
        } : contrato
      );
      setContratos(updatedContratos);
      toast({
        title: "Contrato atualizado",
        description: `Contrato ${novoContrato.numero} atualizado com sucesso.`
      });
    } else {
      const newContrato: Contrato = {
        id: Date.now().toString(),
        numero: novoContrato.numero!,
        empresa: novoContrato.empresa!,
        objeto: novoContrato.objeto!,
        valor: novoContrato.valor!,
        dataInicio: novoContrato.dataInicio!,
        dataFim: novoContrato.dataFim!,
        status: "Vigente"
      };
      setContratos([...contratos, newContrato]);
      toast({
        title: "Contrato adicionado",
        description: `Contrato ${newContrato.numero} adicionado com sucesso.`
      });
    }

    setNovoContrato({});
    setSelectedContract(null);
    setOpenDialogContrato(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const filteredRelatorios = relatorios.filter(relatorio => 
    relatorio.titulo.toLowerCase().includes(searchRelatorio.toLowerCase()) || 
    relatorio.tipo.toLowerCase().includes(searchRelatorio.toLowerCase())
  );

  const handleRelatorioInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoRelatorio({
      ...novoRelatorio,
      [name]: value
    });
  };

  const handleRelatorioSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoRelatorio.titulo || !novoRelatorio.tipo || !novoRelatorio.arquivo) {
      toast({
        title: "Erro ao adicionar relatório",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const newRelatorio: Relatorio = {
      id: Date.now().toString(),
      titulo: novoRelatorio.titulo!,
      tipo: novoRelatorio.tipo!,
      dataGeracao: new Date().toISOString().split('T')[0],
      geradoPor: "Usuário Atual",
      arquivo: novoRelatorio.arquivo!
    };

    setRelatorios([...relatorios, newRelatorio]);
    setNovoRelatorio({});
    setOpenDialogRelatorio(false);
    toast({
      title: "Relatório adicionado",
      description: `Relatório "${newRelatorio.titulo}" adicionado com sucesso.`
    });
  };

  const downloadRelatorio = (arquivo: string) => {
    toast({
      title: "Download iniciado",
      description: `Baixando ${arquivo}...`
    });
  };

  const excluirContrato = (id: string) => {
    setContratos(contratos.filter(contrato => contrato.id !== id));
    toast({
      title: "Contrato excluído",
      description: "O contrato foi excluído com sucesso."
    });
  };

  const excluirRelatorio = (id: string) => {
    setRelatorios(relatorios.filter(relatorio => relatorio.id !== id));
    toast({
      title: "Relatório excluído",
      description: "O relatório foi excluído com sucesso."
    });
  };

  const handleContractClick = (contract: Contrato) => {
    setSelectedContract(contract);
    setOpenContractDialog(true);
  };

  const handleDownloadContract = (contract: Contrato) => {
    generateContractPDF(contract);
    toast({
      title: "Download iniciado",
      description: `Baixando contrato ${contract.numero}...`
    });
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Licitações</h1>
      
      <Tabs defaultValue="contratos" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="contratos">Contratos</TabsTrigger>
          <TabsTrigger value="relatorios">Relatórios</TabsTrigger>
        </TabsList>
        
        <TabsContent value="contratos">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contratos</CardTitle>
                  <CardDescription>
                    Gerenciamento de contratos de licitações municipais
                  </CardDescription>
                </div>
                <Dialog open={openDialogContrato} onOpenChange={setOpenDialogContrato}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Novo Contrato
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>
                        {selectedContract ? "Editar Contrato" : "Adicionar Novo Contrato"}
                      </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleContratoSubmit} className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="numero">Número</Label>
                          <Input
                            id="numero"
                            name="numero"
                            value={novoContrato.numero || ''}
                            onChange={handleContratoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="empresa">Empresa</Label>
                          <Input
                            id="empresa"
                            name="empresa"
                            value={novoContrato.empresa || ''}
                            onChange={handleContratoInputChange}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="objeto">Objeto</Label>
                        <Input
                          id="objeto"
                          name="objeto"
                          value={novoContrato.objeto || ''}
                          onChange={handleContratoInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valor">Valor (R$)</Label>
                          <Input
                            id="valor"
                            name="valor"
                            type="number"
                            value={novoContrato.valor || ''}
                            onChange={handleContratoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataInicio">Data de Início</Label>
                          <Input
                            id="dataInicio"
                            name="dataInicio"
                            type="date"
                            value={novoContrato.dataInicio || ''}
                            onChange={handleContratoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataFim">Data de Término</Label>
                          <Input
                            id="dataFim"
                            name="dataFim"
                            type="date"
                            value={novoContrato.dataFim || ''}
                            onChange={handleContratoInputChange}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="mt-4">
                        {selectedContract ? "Salvar Alterações" : "Adicionar Contrato"}
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar contratos..."
                    className="pl-8"
                    value={searchContrato}
                    onChange={(e) => setSearchContrato(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <TableCaption>Lista de contratos ativos e finalizados</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Objeto</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Início</TableHead>
                    <TableHead>Término</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredContratos.map((contrato) => (
                    <TableRow 
                      key={contrato.id}
                      className="cursor-pointer"
                      onClick={() => handleContractClick(contrato)}
                    >
                      <TableCell>{contrato.numero}</TableCell>
                      <TableCell>{contrato.empresa}</TableCell>
                      <TableCell>{contrato.objeto}</TableCell>
                      <TableCell>{formatCurrency(contrato.valor)}</TableCell>
                      <TableCell>{formatDate(contrato.dataInicio)}</TableCell>
                      <TableCell>{formatDate(contrato.dataFim)}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            contrato.status === "Vigente"
                              ? "bg-green-100 text-green-800"
                              : contrato.status === "Finalizado"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {contrato.status}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditContract(contrato);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => {
                              e.stopPropagation();
                              excluirContrato(contrato.id);
                            }}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Dialog open={openContractDialog} onOpenChange={setOpenContractDialog}>
            <DialogContent className="sm:max-w-[600px]">
              {selectedContract && (
                <>
                  <DialogHeader>
                    <DialogTitle>Detalhes do Contrato #{selectedContract.numero}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium text-gray-500">Empresa</h3>
                        <p className="text-lg">{selectedContract.empresa}</p>
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-500">Objeto</h3>
                        <p className="text-lg">{selectedContract.objeto}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-gray-500">Valor</h3>
                          <p className="text-lg">{formatCurrency(selectedContract.valor)}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500">Status</h3>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-sm font-medium ${
                              selectedContract.status === "Vigente"
                                ? "bg-green-100 text-green-800"
                                : selectedContract.status === "Finalizado"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {selectedContract.status}
                          </span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-medium text-gray-500">Data de Início</h3>
                          <p className="text-lg">{formatDate(selectedContract.dataInicio)}</p>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-500">Data de Término</h3>
                          <p className="text-lg">{formatDate(selectedContract.dataFim)}</p>
                        </div>
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleDownloadContract(selectedContract)}
                      className="mt-4"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar Contrato
                    </Button>
                  </div>
                </>
              )}
            </DialogContent>
          </Dialog>
        </TabsContent>
        
        <TabsContent value="relatorios">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Relatórios</CardTitle>
                  <CardDescription>
                    Relatórios e documentos relacionados às licitações
                  </CardDescription>
                </div>
                <Dialog open={openDialogRelatorio} onOpenChange={setOpenDialogRelatorio}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" /> Novo Relatório
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Adicionar Novo Relatório</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleRelatorioSubmit} className="grid gap-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="titulo">Título</Label>
                        <Input
                          id="titulo"
                          name="titulo"
                          value={novoRelatorio.titulo || ''}
                          onChange={handleRelatorioInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="tipo">Tipo</Label>
                          <Input
                            id="tipo"
                            name="tipo"
                            value={novoRelatorio.tipo || ''}
                            onChange={handleRelatorioInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="arquivo">Nome do Arquivo</Label>
                          <Input
                            id="arquivo"
                            name="arquivo"
                            value={novoRelatorio.arquivo || ''}
                            onChange={handleRelatorioInputChange}
                          />
                        </div>
                      </div>
                      <Button type="submit" className="mt-4">Adicionar Relatório</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex mb-4">
                <div className="relative w-full max-w-sm">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar relatórios..."
                    className="pl-8"
                    value={searchRelatorio}
                    onChange={(e) => setSearchRelatorio(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <TableCaption>Lista de relatórios disponíveis</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Gerado por</TableHead>
                    <TableHead>Arquivo</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRelatorios.map((relatorio) => (
                    <TableRow key={relatorio.id}>
                      <TableCell>{relatorio.titulo}</TableCell>
                      <TableCell>{relatorio.tipo}</TableCell>
                      <TableCell>{formatDate(relatorio.dataGeracao)}</TableCell>
                      <TableCell>{relatorio.geradoPor}</TableCell>
                      <TableCell>
                        <span className="flex items-center">
                          <FileText className="mr-2 h-4 w-4 text-blue-500" />
                          {relatorio.arquivo}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => downloadRelatorio(relatorio.arquivo)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => excluirRelatorio(relatorio.id)}
                          >
                            <Trash className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Licitacoes;
