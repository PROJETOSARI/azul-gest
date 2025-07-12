import { useState } from "react";
import { Plus, Search, Filter, FileText, Eye, Calendar, Clock, Tag, Building, AlertTriangle } from "lucide-react";
import { Protocol } from "@/types/protocol";
import { useProtocol } from "@/contexts/ProtocolContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProtocolForm } from "@/components/ProtocolForm";
import { ProtocolDetails } from "@/components/ProtocolDetails";

export default function ProtocolManagement() {
  const { protocols, config } = useProtocol();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [urgencyFilter, setUrgencyFilter] = useState<string>("all");
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [showProtocolForm, setShowProtocolForm] = useState(false);
  const [showProtocolDetails, setShowProtocolDetails] = useState(false);

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

  const getStatusLabel = (status: Protocol["status"]) => {
    switch(status) {
      case "pendente": return "Pendente";
      case "em_andamento": return "Em Andamento";
      case "concluido": return "Concluído";
      case "rejeitado": return "Rejeitado";
      case "arquivado": return "Arquivado";
      default: return status;
    }
  };

  const getUrgencyLabel = (urgency: Protocol["urgency"]) => {
    switch(urgency) {
      case "baixa": return "Baixa";
      case "media": return "Média";
      case "alta": return "Alta";
      case "urgente": return "Urgente";
      default: return urgency;
    }
  };

  const filteredProtocols = protocols.filter(protocol => {
    const matchesSearch = 
      protocol.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      protocol.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || protocol.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || protocol.department === departmentFilter;
    const matchesUrgency = urgencyFilter === "all" || protocol.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesDepartment && matchesUrgency;
  });

  const getOverdueProtocols = () => {
    return protocols.filter(protocol => {
      if (!protocol.dueDate) return false;
      const dueDate = new Date(protocol.dueDate);
      const now = new Date();
      return dueDate < now && protocol.status !== "concluido" && protocol.status !== "arquivado";
    });
  };

  const getProtocolsByStatus = () => {
    return {
      pendente: protocols.filter(p => p.status === "pendente").length,
      em_andamento: protocols.filter(p => p.status === "em_andamento").length,
      concluido: protocols.filter(p => p.status === "concluido").length,
      rejeitado: protocols.filter(p => p.status === "rejeitado").length,
      arquivado: protocols.filter(p => p.status === "arquivado").length,
    };
  };

  const statusCounts = getProtocolsByStatus();
  const overdueProtocols = getOverdueProtocols();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Gestão de Protocolos</h1>
        <Button onClick={() => setShowProtocolForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Novo Protocolo
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Protocolos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{protocols.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{statusCounts.em_andamento}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidos</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueProtocols.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Concluídos</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.concluido}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="em_andamento">Em Andamento</SelectItem>
                <SelectItem value="concluido">Concluído</SelectItem>
                <SelectItem value="rejeitado">Rejeitado</SelectItem>
                <SelectItem value="arquivado">Arquivado</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Departamentos</SelectItem>
                {config.departments.map(dept => (
                  <SelectItem key={dept.id} value={dept.name}>{dept.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={urgencyFilter} onValueChange={setUrgencyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Urgência" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as Urgências</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="urgente">Urgente</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
                setDepartmentFilter("all");
                setUrgencyFilter("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Protocols List */}
      <Card>
        <CardHeader>
          <CardTitle>Protocolos ({filteredProtocols.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredProtocols.length > 0 ? (
              filteredProtocols.map((protocol) => (
                <div 
                  key={protocol.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedProtocol(protocol);
                    setShowProtocolDetails(true);
                  }}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">#{protocol.number}</h3>
                        <Badge className={getStatusColor(protocol.status)}>
                          {getStatusLabel(protocol.status)}
                        </Badge>
                        <Badge variant="outline" className={getUrgencyColor(protocol.urgency)}>
                          {getUrgencyLabel(protocol.urgency)}
                        </Badge>
                      </div>
                      
                      <p className="font-medium text-gray-900 mb-1">{protocol.subject}</p>
                      <p className="text-sm text-gray-600 mb-2">{protocol.name}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {protocol.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {protocol.category}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(protocol.createdAt).toLocaleDateString()}
                        </div>
                        {protocol.dueDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            Vence: {new Date(protocol.dueDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {protocol.attachments && protocol.attachments.length > 0 && (
                        <Badge variant="secondary">
                          {protocol.attachments.length} anexo(s)
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                Nenhum protocolo encontrado.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showProtocolForm} onOpenChange={setShowProtocolForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Novo Protocolo</DialogTitle>
          </DialogHeader>
          <ProtocolForm onClose={() => setShowProtocolForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showProtocolDetails} onOpenChange={setShowProtocolDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes do Protocolo</DialogTitle>
          </DialogHeader>
          {selectedProtocol && (
            <ProtocolDetails 
              protocol={selectedProtocol} 
              onClose={() => setShowProtocolDetails(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}