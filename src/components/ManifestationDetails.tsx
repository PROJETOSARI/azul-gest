import { useState } from "react";
import { Manifestation, ManifestationResponse } from "@/types/protocol";
import { useProtocol } from "@/contexts/ProtocolContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { 
  MessageSquare, 
  Calendar, 
  User, 
  Building, 
  Clock, 
  AlertTriangle,
  Download,
  Printer,
  Send,
  Shield
} from "lucide-react";

interface ManifestationDetailsProps {
  manifestation: Manifestation;
  onClose: () => void;
}

export function ManifestationDetails({ manifestation, onClose }: ManifestationDetailsProps) {
  const { updateManifestation } = useProtocol();
  const { toast } = useToast();
  const [newResponse, setNewResponse] = useState("");
  const [isOfficialResponse, setIsOfficialResponse] = useState(false);

  const getStatusColor = (status: Manifestation["status"]) => {
    switch(status) {
      case "nova": return "bg-blue-500";
      case "em_analise": return "bg-yellow-500";
      case "respondida": return "bg-green-500";
      case "finalizada": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getTypeColor = (type: Manifestation["type"]) => {
    switch(type) {
      case "reclamacao": return "bg-red-100 text-red-800";
      case "elogio": return "bg-green-100 text-green-800";
      case "denuncia": return "bg-purple-100 text-purple-800";
      case "sugestao": return "bg-blue-100 text-blue-800";
      case "solicitacao": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: Manifestation["status"]) => {
    switch(status) {
      case "nova": return "Nova";
      case "em_analise": return "Em Análise";
      case "respondida": return "Respondida";
      case "finalizada": return "Finalizada";
      default: return status;
    }
  };

  const getTypeLabel = (type: Manifestation["type"]) => {
    switch(type) {
      case "reclamacao": return "Reclamação";
      case "elogio": return "Elogio";
      case "denuncia": return "Denúncia";
      case "sugestao": return "Sugestão";
      case "solicitacao": return "Solicitação";
      default: return type;
    }
  };

  const handleStatusChange = (newStatus: Manifestation["status"]) => {
    updateManifestation(manifestation.id, { status: newStatus });
    toast({
      title: "Status atualizado",
      description: `Status alterado para ${getStatusLabel(newStatus)}`,
    });
  };

  const handleAddResponse = () => {
    if (!newResponse.trim()) return;

    const response: ManifestationResponse = {
      id: crypto.randomUUID(),
      content: newResponse,
      isOfficial: isOfficialResponse,
      createdAt: new Date().toISOString(),
      userId: "current-user"
    };

    updateManifestation(manifestation.id, {
      responses: [...(manifestation.responses || []), response],
      status: isOfficialResponse ? "respondida" : manifestation.status
    });

    setNewResponse("");
    setIsOfficialResponse(false);
    
    toast({
      title: "Resposta adicionada",
      description: `Resposta ${isOfficialResponse ? 'oficial ' : ''}adicionada com sucesso`,
    });
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Manifestação ${manifestation.number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; display: inline-block; width: 150px; }
            .responses { margin-top: 20px; }
            .response { border-left: 3px solid #007bff; padding-left: 15px; margin-bottom: 15px; }
            .official-response { border-left-color: #28a745; background-color: #f8f9fa; padding: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MANIFESTAÇÃO ${manifestation.number}</h1>
            <p>Gerado em: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Dados da Manifestação</h2>
            <p><span class="label">Tipo:</span> ${getTypeLabel(manifestation.type)}</p>
            <p><span class="label">Status:</span> ${getStatusLabel(manifestation.status)}</p>
            <p><span class="label">Departamento:</span> ${manifestation.department}</p>
            <p><span class="label">Prioridade:</span> ${manifestation.priority}</p>
            <p><span class="label">Criado em:</span> ${new Date(manifestation.createdAt).toLocaleString()}</p>
            <p><span class="label">Prazo:</span> ${new Date(manifestation.dueDate).toLocaleString()}</p>
            ${manifestation.anonymous ? '<p><span class="label">Tipo:</span> Anônima</p>' : ''}
          </div>
          
          ${!manifestation.anonymous ? `
          <div class="section">
            <h2>Dados do Manifestante</h2>
            <p><span class="label">Nome:</span> ${manifestation.name || 'Não informado'}</p>
            <p><span class="label">E-mail:</span> ${manifestation.email || 'Não informado'}</p>
            <p><span class="label">CPF:</span> ${manifestation.cpf || 'Não informado'}</p>
            <p><span class="label">Telefone:</span> ${manifestation.phone || 'Não informado'}</p>
          </div>
          ` : ''}
          
          <div class="section">
            <h2>Assunto</h2>
            <p>${manifestation.subject}</p>
          </div>
          
          <div class="section">
            <h2>Descrição</h2>
            <p>${manifestation.description}</p>
          </div>
          
          ${manifestation.responses && manifestation.responses.length > 0 ? `
          <div class="section">
            <h2>Respostas</h2>
            <div class="responses">
              ${manifestation.responses.map(response => `
                <div class="${response.isOfficial ? 'official-response' : 'response'}">
                  ${response.isOfficial ? '<strong>RESPOSTA OFICIAL</strong><br>' : ''}
                  <p>${response.content}</p>
                  <small>${new Date(response.createdAt).toLocaleString()}</small>
                </div>
              `).join('')}
            </div>
          </div>
          ` : ''}
        </body>
      </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow?.document.write(printContent);
    printWindow?.document.close();
    printWindow?.print();
  };

  const isOverdue = new Date(manifestation.dueDate) < new Date() && manifestation.status !== "finalizada";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{manifestation.number}</h2>
          <p className="text-gray-600">{manifestation.subject}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            PDF
          </Button>
        </div>
      </div>

      {/* Status and Type */}
      <div className="flex gap-4 items-center">
        <Badge className={getStatusColor(manifestation.status)}>
          {getStatusLabel(manifestation.status)}
        </Badge>
        <Badge variant="outline" className={getTypeColor(manifestation.type)}>
          {getTypeLabel(manifestation.type)}
        </Badge>
        {manifestation.anonymous && (
          <Badge variant="secondary">Anônima</Badge>
        )}
        {isOverdue && (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Vencida
          </Badge>
        )}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="responses">Respostas</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {!manifestation.anonymous && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Dados do Manifestante
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label className="text-sm font-medium">Nome</Label>
                    <p>{manifestation.name || "Não informado"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">E-mail</Label>
                    <p>{manifestation.email || "Não informado"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">CPF</Label>
                    <p>{manifestation.cpf || "Não informado"}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Telefone</Label>
                    <p>{manifestation.phone || "Não informado"}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Dados da Manifestação
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p>{getTypeLabel(manifestation.type)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departamento</Label>
                  <p>{manifestation.department}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Prioridade</Label>
                  <p>{manifestation.priority}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <Label className="text-sm font-medium">Criado em</Label>
                    <p>{new Date(manifestation.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <div>
                    <Label className="text-sm font-medium">Prazo</Label>
                    <p>{new Date(manifestation.dueDate).toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{manifestation.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Respostas</CardTitle>
            </CardHeader>
            <CardContent>
              {manifestation.responses && manifestation.responses.length > 0 ? (
                <div className="space-y-4">
                  {manifestation.responses.map((response) => (
                    <div key={response.id} className={`border rounded-lg p-4 ${response.isOfficial ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
                      {response.isOfficial && (
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-green-600" />
                          <Badge variant="outline" className="bg-green-100 text-green-800">
                            Resposta Oficial
                          </Badge>
                        </div>
                      )}
                      <p className="mb-2">{response.content}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(response.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma resposta registrada.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nova Resposta</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="response">Resposta</Label>
                <Textarea
                  id="response"
                  value={newResponse}
                  onChange={(e) => setNewResponse(e.target.value)}
                  placeholder="Digite sua resposta..."
                  rows={4}
                />
              </div>
              
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isOfficialResponse}
                    onChange={(e) => setIsOfficialResponse(e.target.checked)}
                  />
                  <span className="text-sm">Resposta oficial (será enviada ao manifestante)</span>
                </label>
              </div>
              
              <Button 
                onClick={handleAddResponse}
                disabled={!newResponse.trim()}
                className="w-full"
              >
                <Send className="h-4 w-4 mr-2" />
                Enviar Resposta
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="actions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alterar Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Status Atual: {getStatusLabel(manifestation.status)}</Label>
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nova">Nova</SelectItem>
                    <SelectItem value="em_analise">Em Análise</SelectItem>
                    <SelectItem value="respondida">Respondida</SelectItem>
                    <SelectItem value="finalizada">Finalizada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Outras Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Building className="h-4 w-4 mr-2" />
                Encaminhar para outro departamento
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Exportar para Excel
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}