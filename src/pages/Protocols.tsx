import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ClipboardList, FileText, Info, Printer, Download, Search, X, LayoutGrid, LayoutList, LayoutDashboard } from "lucide-react";
import { Protocol } from "@/types/protocol";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { generatePDF } from "@/utils/generatePDF";
import { v4 as uuidv4 } from 'uuid';

type ViewMode = "card" | "table" | "list";

const Protocols = () => {
  const navigate = useNavigate();
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [showNewProtocolForm, setShowNewProtocolForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const [viewMode, setViewMode] = useState<ViewMode>("card");
  
  const [newProtocol, setNewProtocol] = useState<Omit<Protocol, "id" | "createdAt">>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    address: "",
    subject: "",
    description: "",
    status: "pending"
  });

  useEffect(() => {
    const savedProtocols = localStorage.getItem("protocols");
    if (savedProtocols) {
      setProtocols(JSON.parse(savedProtocols));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("protocols", JSON.stringify(protocols));
  }, [protocols]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProtocol(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitProtocol = () => {
    const protocolToAdd: Protocol = {
      ...newProtocol,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    
    setProtocols(prev => [...prev, protocolToAdd]);
    setShowNewProtocolForm(false);
    setNewProtocol({
      name: "",
      email: "",
      cpf: "",
      phone: "",
      address: "",
      subject: "",
      description: "",
      status: "pending"
    });
    
    toast({
      title: "Protocolo registrado com sucesso",
      description: `Protocolo #${protocolToAdd.id.substring(0, 8)} foi criado.`,
    });
  };

  const openProtocolDetails = (protocol: Protocol) => {
    setSelectedProtocol(protocol);
    setShowUserDetails(true);
  };

  const handleUpdateStatus = (id: string, status: Protocol["status"]) => {
    setProtocols(prev => 
      prev.map(protocol => 
        protocol.id === id ? { ...protocol, status } : protocol
      )
    );
    
    toast({
      title: "Status atualizado",
      description: `Status do protocolo atualizado para ${getStatusLabel(status)}.`,
    });
  };

  const handlePrint = (protocol: Protocol) => {
    const printContent = `
      <html>
        <head>
          <title>Protocolo #${protocol.id.substring(0, 8)}</title>
          <style>
            body { font-family: Arial; padding: 20px; }
            h1 { color: #333; }
            .info { margin-bottom: 8px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Protocolo #${protocol.id.substring(0, 8)}</h1>
          <div class="info"><span class="label">Nome:</span> ${protocol.name}</div>
          <div class="info"><span class="label">Email:</span> ${protocol.email}</div>
          <div class="info"><span class="label">CPF:</span> ${protocol.cpf}</div>
          <div class="info"><span class="label">Telefone:</span> ${protocol.phone}</div>
          <div class="info"><span class="label">Endereço:</span> ${protocol.address}</div>
          <div class="info"><span class="label">Assunto:</span> ${protocol.subject}</div>
          <div class="info"><span class="label">Descrição:</span> ${protocol.description}</div>
          <div class="info"><span class="label">Status:</span> ${getStatusLabel(protocol.status)}</div>
          <div class="info"><span class="label">Data de criação:</span> ${new Date(protocol.createdAt).toLocaleString()}</div>
        </body>
      </html>
    `;
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const handleGeneratePDF = (protocol: Protocol) => {
    generatePDF(protocol);
    toast({
      title: "PDF gerado com sucesso",
      description: "O download do PDF começará em instantes.",
    });
  };

  const getStatusLabel = (status: Protocol["status"]) => {
    switch(status) {
      case "pending": return "Pendente";
      case "in_progress": return "Em andamento";
      case "completed": return "Concluído";
      case "rejected": return "Rejeitado";
      default: return status;
    }
  };

  const getStatusColor = (status: Protocol["status"]) => {
    switch(status) {
      case "pending": return "bg-yellow-500";
      case "in_progress": return "bg-blue-500";
      case "completed": return "bg-green-500";
      case "rejected": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const filteredProtocols = protocols.filter(protocol => 
    protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    protocol.cpf.includes(searchQuery) ||
    protocol.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderProtocolsAsCards = () => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredProtocols.length > 0 ? (
        filteredProtocols.map((protocol) => (
          <Card key={protocol.id} className="overflow-hidden">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  #{protocol.id.substring(0, 8)}
                </CardTitle>
                <Badge className={getStatusColor(protocol.status)}>
                  {getStatusLabel(protocol.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <div className="text-sm">
                  <span className="font-medium">Nome:</span> {protocol.name}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Assunto:</span> {protocol.subject}
                </div>
                <div className="text-sm">
                  <span className="font-medium">Data:</span>{" "}
                  {new Date(protocol.createdAt).toLocaleDateString()}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openProtocolDetails(protocol)}
                >
                  <Info className="h-4 w-4 mr-1" />
                  Detalhes
                </Button>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePrint(protocol)}
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleGeneratePDF(protocol)}
                  >
                    <FileText className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-gray-500">
          {searchQuery ? "Nenhum protocolo encontrado para esta busca." : "Nenhum protocolo registrado ainda."}
        </div>
      )}
    </div>
  );

  const renderProtocolsAsTable = () => (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded-md shadow-sm border">
        <thead>
          <tr>
            <th className="py-2 px-3 border-b text-left">#</th>
            <th className="py-2 px-3 border-b text-left">Nome</th>
            <th className="py-2 px-3 border-b text-left">Assunto</th>
            <th className="py-2 px-3 border-b text-left">Data</th>
            <th className="py-2 px-3 border-b text-left">Status</th>
            <th className="py-2 px-3 border-b text-left">Ações</th>
          </tr>
        </thead>
        <tbody>
          {filteredProtocols.length > 0 ? (
            filteredProtocols.map((protocol) => (
              <tr key={protocol.id} className="hover:bg-gray-50 transition">
                <td className="py-2 px-3 border-b">#{protocol.id.substring(0,8)}</td>
                <td className="py-2 px-3 border-b">{protocol.name}</td>
                <td className="py-2 px-3 border-b">{protocol.subject}</td>
                <td className="py-2 px-3 border-b">{new Date(protocol.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-3 border-b">
                  <Badge className={getStatusColor(protocol.status)}>
                    {getStatusLabel(protocol.status)}
                  </Badge>
                </td>
                <td className="py-2 px-3 border-b">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openProtocolDetails(protocol)}
                    >
                      <Info className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handlePrint(protocol)}
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleGeneratePDF(protocol)}
                    >
                      <FileText className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="text-center text-gray-500 py-6" colSpan={6}>
                {searchQuery ? "Nenhum protocolo encontrado para esta busca." : "Nenhum protocolo registrado ainda."}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  const renderProtocolsAsList = () => (
    <ul className="space-y-3">
      {filteredProtocols.length > 0 ? (
        filteredProtocols.map((protocol) => (
          <li
            key={protocol.id}
            className="border rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between bg-white shadow"
          >
            <div className="flex-1">
              <div className="font-medium">#{protocol.id.substring(0, 8)} - {protocol.name}</div>
              <div className="text-sm text-gray-500">
                {protocol.subject} &middot; {new Date(protocol.createdAt).toLocaleDateString()}
              </div>
              <div className="mt-1">
                <Badge className={getStatusColor(protocol.status)}>
                  {getStatusLabel(protocol.status)}
                </Badge>
              </div>
            </div>
            <div className="flex gap-1 mt-3 sm:mt-0 sm:ml-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => openProtocolDetails(protocol)}
              >
                <Info className="h-4 w-4 mr-1" />
                Detalhes
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePrint(protocol)}
              >
                <Printer className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleGeneratePDF(protocol)}
              >
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </li>
        ))
      ) : (
        <li className="text-center text-gray-500 py-10">
          {searchQuery ? "Nenhum protocolo encontrado para esta busca." : "Nenhum protocolo registrado ainda."}
        </li>
      )}
    </ul>
  );

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h1 className="text-2xl font-bold">Protocolos</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "card" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("card")}
            aria-label="Exibir cartões"
            className={viewMode === "card" ? "bg-brand-blue text-white" : ""}
          >
            <LayoutGrid />
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("table")}
            aria-label="Exibir tabela"
            className={viewMode === "table" ? "bg-brand-blue text-white" : ""}
          >
            <LayoutDashboard />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="icon"
            onClick={() => setViewMode("list")}
            aria-label="Exibir lista"
            className={viewMode === "list" ? "bg-brand-blue text-white" : ""}
          >
            <LayoutList />
          </Button>
          <Button onClick={() => setShowNewProtocolForm(true)}>Novo Protocolo</Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Buscar protocolos..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {viewMode === "card" && renderProtocolsAsCards()}
      {viewMode === "table" && renderProtocolsAsTable()}
      {viewMode === "list" && renderProtocolsAsList()}

      <Dialog open={showUserDetails} onOpenChange={setShowUserDetails}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Detalhes do Protocolo
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowUserDetails(false)}
                className="h-6 w-6 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          {selectedProtocol && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>ID do Protocolo</Label>
                  <div className="font-medium">#{selectedProtocol.id.substring(0, 8)}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div>
                    <Badge className={getStatusColor(selectedProtocol.status)}>
                      {getStatusLabel(selectedProtocol.status)}
                    </Badge>
                  </div>
                </div>
                <div className="col-span-2">
                  <Label>Nome</Label>
                  <div className="font-medium">{selectedProtocol.name}</div>
                </div>
                <div className="col-span-2">
                  <Label>Email</Label>
                  <div>{selectedProtocol.email}</div>
                </div>
                <div>
                  <Label>CPF</Label>
                  <div>{selectedProtocol.cpf}</div>
                </div>
                <div>
                  <Label>Telefone</Label>
                  <div>{selectedProtocol.phone}</div>
                </div>
                <div className="col-span-2">
                  <Label>Endereço</Label>
                  <div>{selectedProtocol.address}</div>
                </div>
                <div className="col-span-2">
                  <Label>Assunto</Label>
                  <div className="font-medium">{selectedProtocol.subject}</div>
                </div>
                <div className="col-span-2">
                  <Label>Descrição</Label>
                  <div className="whitespace-pre-wrap text-sm">{selectedProtocol.description}</div>
                </div>
                <div className="col-span-2">
                  <Label>Criado em</Label>
                  <div>{new Date(selectedProtocol.createdAt).toLocaleString()}</div>
                </div>
              </div>
              
              <div className="pt-2">
                <Label>Atualizar Status</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button 
                    variant={selectedProtocol.status === "pending" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedProtocol.id, "pending")}
                  >
                    Pendente
                  </Button>
                  <Button 
                    variant={selectedProtocol.status === "in_progress" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedProtocol.id, "in_progress")}
                  >
                    Em andamento
                  </Button>
                  <Button 
                    variant={selectedProtocol.status === "completed" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedProtocol.id, "completed")}
                  >
                    Concluído
                  </Button>
                  <Button 
                    variant={selectedProtocol.status === "rejected" ? "default" : "outline"} 
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedProtocol.id, "rejected")}
                  >
                    Rejeitado
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectedProtocol && handlePrint(selectedProtocol)}
              >
                <Printer className="h-4 w-4 mr-1" />
                Imprimir
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => selectedProtocol && handleGeneratePDF(selectedProtocol)}
              >
                <FileText className="h-4 w-4 mr-1" />
                Gerar PDF
              </Button>
            </div>
            <Button 
              variant="default" 
              onClick={() => setShowUserDetails(false)}
            >
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNewProtocolForm} onOpenChange={setShowNewProtocolForm}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Novo Protocolo</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                name="name"
                value={newProtocol.name}
                onChange={handleInputChange}
                placeholder="Nome completo"
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={newProtocol.email}
                onChange={handleInputChange}
                placeholder="email@exemplo.com"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="cpf">CPF</Label>
                <Input
                  id="cpf"
                  name="cpf"
                  value={newProtocol.cpf}
                  onChange={handleInputChange}
                  placeholder="000.000.000-00"
                />
              </div>
              <div>
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={newProtocol.phone}
                  onChange={handleInputChange}
                  placeholder="(00) 00000-0000"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                name="address"
                value={newProtocol.address}
                onChange={handleInputChange}
                placeholder="Endereço completo"
              />
            </div>
            <div>
              <Label htmlFor="subject">Assunto</Label>
              <Input
                id="subject"
                name="subject"
                value={newProtocol.subject}
                onChange={handleInputChange}
                placeholder="Assunto do protocolo"
              />
            </div>
            <div>
              <Label htmlFor="description">Descrição</Label>
              <textarea
                id="description"
                name="description"
                value={newProtocol.description}
                onChange={handleInputChange}
                placeholder="Descreva o motivo do protocolo..."
                className="flex h-24 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={newProtocol.status}
                onChange={handleInputChange}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="pending">Pendente</option>
                <option value="in_progress">Em andamento</option>
                <option value="completed">Concluído</option>
                <option value="rejected">Rejeitado</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowNewProtocolForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmitProtocol}>Salvar Protocolo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Protocols;
