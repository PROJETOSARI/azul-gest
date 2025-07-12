import { useState } from "react";
import { Protocol, ProtocolMovement } from "@/types/protocol";
import { useProtocol } from "@/contexts/ProtocolContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { 
  FileText, 
  Calendar, 
  User, 
  Building, 
  Tag, 
  Clock, 
  AlertTriangle,
  ArrowRight,
  Download,
  Printer,
  Edit
} from "lucide-react";

interface ProtocolDetailsProps {
  protocol: Protocol;
  onClose: () => void;
}

export function ProtocolDetails({ protocol, onClose }: ProtocolDetailsProps) {
  const { updateProtocol, config } = useProtocol();
  const { toast } = useToast();
  const [newMovement, setNewMovement] = useState({
    toDepartment: "",
    description: ""
  });

  const getStatusColor = (status: Protocol["status"]) => {
    switch(status) {
      case "pendente": return "bg-yellow-500";
      case "em_andamento": return "bg-blue-500";
      case "concluido": return "bg-green-500";
      case "rejeitado": return "bg-red-500";
      case "arquivado": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getUrgencyColor = (urgency: Protocol["urgency"]) => {
    switch(urgency) {
      case "baixa": return "bg-green-100 text-green-800";
      case "media": return "bg-yellow-100 text-yellow-800";
      case "alta": return "bg-orange-100 text-orange-800";
      case "urgente": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleStatusChange = (newStatus: Protocol["status"]) => {
    updateProtocol(protocol.id, { status: newStatus });
    toast({
      title: "Status atualizado",
      description: `Status alterado para ${newStatus}`,
    });
  };

  const handleAddMovement = () => {
    if (!newMovement.toDepartment || !newMovement.description) return;

    const movement: ProtocolMovement = {
      id: crypto.randomUUID(),
      fromDepartment: protocol.department,
      toDepartment: newMovement.toDepartment,
      description: newMovement.description,
      createdAt: new Date().toISOString(),
      userId: "current-user",
      userType: "admin"
    };

    updateProtocol(protocol.id, {
      movements: [...(protocol.movements || []), movement],
      department: newMovement.toDepartment
    });

    setNewMovement({ toDepartment: "", description: "" });
    
    toast({
      title: "Protocolo encaminhado",
      description: `Protocolo encaminhado para ${newMovement.toDepartment}`,
    });
  };

  const handlePrint = () => {
    const printContent = `
      <html>
        <head>
          <title>Protocolo #${protocol.number}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .section { margin-bottom: 20px; }
            .label { font-weight: bold; display: inline-block; width: 150px; }
            .movements { margin-top: 20px; }
            .movement { border-left: 3px solid #007bff; padding-left: 15px; margin-bottom: 15px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>PROTOCOLO #${protocol.number}</h1>
            <p>Gerado em: ${new Date().toLocaleString()}</p>
          </div>
          
          <div class="section">
            <h2>Dados do Solicitante</h2>
            <p><span class="label">Nome:</span> ${protocol.name}</p>
            <p><span class="label">E-mail:</span> ${protocol.email}</p>
            <p><span class="label">CPF:</span> ${protocol.cpf}</p>
            <p><span class="label">Telefone:</span> ${protocol.phone}</p>
            <p><span class="label">Endereço:</span> ${protocol.address}</p>
          </div>
          
          <div class="section">
            <h2>Dados do Protocolo</h2>
            <p><span class="label">Assunto:</span> ${protocol.subject}</p>
            <p><span class="label">Tipo:</span> ${protocol.type}</p>
            <p><span class="label">Categoria:</span> ${protocol.category}</p>
            <p><span class="label">Departamento:</span> ${protocol.department}</p>
            <p><span class="label">Urgência:</span> ${protocol.urgency}</p>
            <p><span class="label">Status:</span> ${protocol.status}</p>
            <p><span class="label">Criado em:</span> ${new Date(protocol.createdAt).toLocaleString()}</p>
            ${protocol.dueDate ? `<p><span class="label">Vencimento:</span> ${new Date(protocol.dueDate).toLocaleString()}</p>` : ''}
          </div>
          
          <div class="section">
            <h2>Descrição</h2>
            <p>${protocol.description}</p>
          </div>
          
          ${protocol.movements && protocol.movements.length > 0 ? `
          <div class="section">
            <h2>Histórico de Movimentações</h2>
            <div class="movements">
              ${protocol.movements.map(movement => `
                <div class="movement">
                  <p><strong>${new Date(movement.createdAt).toLocaleString()}</strong></p>
                  <p>De: ${movement.fromDepartment} → Para: ${movement.toDepartment}</p>
                  <p>${movement.description}</p>
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

  const isOverdue = protocol.dueDate && new Date(protocol.dueDate) < new Date() 
    && protocol.status !== "concluido" && protocol.status !== "arquivado";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">#{protocol.number}</h2>
          <p className="text-gray-600">{protocol.subject}</p>
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

      {/* Status and Priority */}
      <div className="flex gap-4 items-center">
        <Badge className={getStatusColor(protocol.status)}>
          {protocol.status}
        </Badge>
        <Badge variant="outline" className={getUrgencyColor(protocol.urgency)}>
          {protocol.urgency}
        </Badge>
        {isOverdue && (
          <Badge variant="destructive">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Vencido
          </Badge>
        )}
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="movements">Movimentações</TabsTrigger>
          <TabsTrigger value="attachments">Anexos</TabsTrigger>
          <TabsTrigger value="actions">Ações</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Dados do Solicitante
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Nome</Label>
                  <p>{protocol.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">E-mail</Label>
                  <p>{protocol.email || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">CPF</Label>
                  <p>{protocol.cpf || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Telefone</Label>
                  <p>{protocol.phone || "Não informado"}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Endereço</Label>
                  <p>{protocol.address || "Não informado"}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Dados do Protocolo
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <Label className="text-sm font-medium">Tipo</Label>
                  <p>{protocol.type}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Categoria</Label>
                  <p>{protocol.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Departamento</Label>
                  <p>{protocol.department}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <div>
                    <Label className="text-sm font-medium">Criado em</Label>
                    <p>{new Date(protocol.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                {protocol.dueDate && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <div>
                      <Label className="text-sm font-medium">Vencimento</Label>
                      <p>{new Date(protocol.dueDate).toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Descrição</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{protocol.description}</p>
            </CardContent>
          </Card>

          {protocol.tags && protocol.tags.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Tag className="h-5 w-5" />
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {protocol.tags.map(tag => (
                    <Badge key={tag} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="movements" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              {protocol.movements && protocol.movements.length > 0 ? (
                <div className="space-y-4">
                  {protocol.movements.map((movement, index) => (
                    <div key={movement.id} className="border-l-4 border-blue-500 pl-4 pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building className="h-4 w-4" />
                        <span className="font-medium">
                          {movement.fromDepartment}
                        </span>
                        <ArrowRight className="h-4 w-4" />
                        <span className="font-medium">
                          {movement.toDepartment}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{movement.description}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(movement.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhuma movimentação registrada.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Nova Movimentação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="toDepartment">Encaminhar para</Label>
                <Select 
                  value={newMovement.toDepartment} 
                  onValueChange={(value) => setNewMovement(prev => ({ ...prev, toDepartment: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o departamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.departments
                      .filter(dept => dept.active && dept.name !== protocol.department)
                      .map(dept => (
                        <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="description">Observações</Label>
                <Textarea
                  id="description"
                  value={newMovement.description}
                  onChange={(e) => setNewMovement(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descreva o motivo do encaminhamento..."
                  rows={3}
                />
              </div>
              
              <Button 
                onClick={handleAddMovement}
                disabled={!newMovement.toDepartment || !newMovement.description}
              >
                Encaminhar Protocolo
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anexos</CardTitle>
            </CardHeader>
            <CardContent>
              {protocol.attachments && protocol.attachments.length > 0 ? (
                <div className="space-y-2">
                  {protocol.attachments.map(attachment => (
                    <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-gray-500" />
                        <div>
                          <p className="font-medium">{attachment.name}</p>
                          <p className="text-sm text-gray-500">
                            {(attachment.size / 1024 / 1024).toFixed(2)} MB • {new Date(attachment.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Baixar
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Nenhum anexo encontrado.</p>
              )}
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
                <Label>Status Atual: {protocol.status}</Label>
                <Select onValueChange={handleStatusChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o novo status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="em_andamento">Em Andamento</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                    <SelectItem value="rejeitado">Rejeitado</SelectItem>
                    <SelectItem value="arquivado">Arquivado</SelectItem>
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
                <Edit className="h-4 w-4 mr-2" />
                Editar Protocolo
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Gerar Etiqueta
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