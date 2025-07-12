import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useProtocol } from "@/contexts/ProtocolContext";
import { useToast } from "@/hooks/use-toast";
import { Upload, File, X } from "lucide-react";
import { Manifestation, ProtocolAttachment } from "@/types/protocol";

interface ManifestationFormProps {
  onClose: () => void;
  manifestation?: Manifestation;
}

export function ManifestationForm({ onClose, manifestation }: ManifestationFormProps) {
  const { addManifestation, updateManifestation, config } = useProtocol();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    type: manifestation?.type || "reclamacao" as Manifestation["type"],
    anonymous: manifestation?.anonymous || false,
    name: manifestation?.name || "",
    email: manifestation?.email || "",
    cpf: manifestation?.cpf || "",
    phone: manifestation?.phone || "",
    subject: manifestation?.subject || "",
    description: manifestation?.description || "",
    department: manifestation?.department || "",
    priority: manifestation?.priority || "media" as Manifestation["priority"],
  });
  
  const [attachments, setAttachments] = useState<ProtocolAttachment[]>(manifestation?.attachments || []);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const attachment: ProtocolAttachment = {
          id: crypto.randomUUID(),
          name: file.name,
          type: file.type,
          size: file.size,
          url: e.target?.result as string,
          uploadedAt: new Date().toISOString(),
        };
        setAttachments(prev => [...prev, attachment]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const calculateDueDate = (type: Manifestation["type"]): string => {
    const manifestationType = config.manifestationTypes.find(mt => mt.id === type);
    const daysToAdd = manifestationType?.deadline || 30;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + daysToAdd);
    return dueDate.toISOString();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (manifestation) {
      // Update existing manifestation
      updateManifestation(manifestation.id, {
        ...formData,
        attachments,
      });
      
      toast({
        title: "Manifestação atualizada",
        description: `Manifestação ${manifestation.number} foi atualizada com sucesso.`,
      });
    } else {
      // Create new manifestation
      const manifestationNumber = addManifestation({
        ...formData,
        status: "nova",
        dueDate: calculateDueDate(formData.type),
        attachments,
        responses: [],
      });
      
      toast({
        title: "Manifestação criada",
        description: `Manifestação ${manifestationNumber} foi criada com sucesso.`,
      });
    }
    
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tipo de Manifestação */}
      <Card>
        <CardHeader>
          <CardTitle>Tipo de Manifestação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="type">Tipo *</Label>
            <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reclamacao">Reclamação</SelectItem>
                <SelectItem value="elogio">Elogio</SelectItem>
                <SelectItem value="denuncia">Denúncia</SelectItem>
                <SelectItem value="sugestao">Sugestão</SelectItem>
                <SelectItem value="solicitacao">Solicitação</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500 mt-1">
              Prazo para resposta: {config.manifestationTypes.find(mt => mt.id === formData.type)?.deadline || 30} dias
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="anonymous" 
              checked={formData.anonymous}
              onCheckedChange={(checked) => handleInputChange("anonymous", checked)}
            />
            <Label htmlFor="anonymous">Manifestação anônima</Label>
          </div>
        </CardContent>
      </Card>

      {/* Dados do Manifestante */}
      {!formData.anonymous && (
        <Card>
          <CardHeader>
            <CardTitle>Dados do Manifestante</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Nome Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required={!formData.anonymous}
              />
            </div>
            
            <div>
              <Label htmlFor="email">E-mail *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                required={!formData.anonymous}
              />
            </div>
            
            <div>
              <Label htmlFor="cpf">CPF</Label>
              <Input
                id="cpf"
                value={formData.cpf}
                onChange={(e) => handleInputChange("cpf", e.target.value)}
                placeholder="000.000.000-00"
              />
            </div>
            
            <div>
              <Label htmlFor="phone">Telefone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                placeholder="(00) 00000-0000"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dados da Manifestação */}
      <Card>
        <CardHeader>
          <CardTitle>Dados da Manifestação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="department">Departamento Responsável *</Label>
            <Select value={formData.department} onValueChange={(value) => handleInputChange("department", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {config.departments.filter(dept => dept.active).map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="priority">Prioridade</Label>
            <Select value={formData.priority} onValueChange={(value) => handleInputChange("priority", value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="subject">Assunto *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleInputChange("subject", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={6}
              required
              placeholder="Descreva detalhadamente sua manifestação..."
            />
          </div>
        </CardContent>
      </Card>

      {/* Anexos */}
      <Card>
        <CardHeader>
          <CardTitle>Anexos</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="hidden"
              id="file-upload"
            />
            <Label htmlFor="file-upload" className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Clique para selecionar arquivos ou arraste aqui</p>
                <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)</p>
              </div>
            </Label>
          </div>
          
          {attachments.length > 0 && (
            <div className="space-y-2">
              {attachments.map(attachment => (
                <div key={attachment.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-2">
                    <File className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium">{attachment.name}</p>
                      <p className="text-xs text-gray-500">
                        {(attachment.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">
          {manifestation ? 'Atualizar Manifestação' : 'Criar Manifestação'}
        </Button>
      </div>
    </form>
  );
}