import { useState } from "react";
import { Plus, Search, Filter, MessageSquare, Clock, User, Building } from "lucide-react";
import { Manifestation } from "@/types/protocol";
import { useProtocol } from "@/contexts/ProtocolContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ManifestationForm } from "@/components/ManifestationForm";
import { ManifestationDetails } from "@/components/ManifestationDetails";

export default function Ouvidoria() {
  const { manifestations, config } = useProtocol();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedManifestation, setSelectedManifestation] = useState<Manifestation | null>(null);
  const [showManifestationForm, setShowManifestationForm] = useState(false);
  const [showManifestationDetails, setShowManifestationDetails] = useState(false);

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

  const filteredManifestations = manifestations.filter(manifestation => {
    const matchesSearch = 
      manifestation.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (manifestation.name && manifestation.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      manifestation.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      manifestation.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === "all" || manifestation.type === typeFilter;
    const matchesStatus = statusFilter === "all" || manifestation.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const getManifestationsByStatus = () => {
    return {
      nova: manifestations.filter(m => m.status === "nova").length,
      em_analise: manifestations.filter(m => m.status === "em_analise").length,
      respondida: manifestations.filter(m => m.status === "respondida").length,
      finalizada: manifestations.filter(m => m.status === "finalizada").length,
    };
  };

  const getOverdueManifestations = () => {
    return manifestations.filter(manifestation => {
      const dueDate = new Date(manifestation.dueDate);
      const now = new Date();
      return dueDate < now && manifestation.status !== "finalizada";
    });
  };

  const statusCounts = getManifestationsByStatus();
  const overdueManifestations = getOverdueManifestations();

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Ouvidoria</h1>
        <Button onClick={() => setShowManifestationForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Manifestação
        </Button>
      </div>

      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Manifestações</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{manifestations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Em Análise</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{statusCounts.em_analise}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vencidas</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueManifestations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Finalizadas</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{statusCounts.finalizada}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Buscar manifestações..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="reclamacao">Reclamação</SelectItem>
                <SelectItem value="elogio">Elogio</SelectItem>
                <SelectItem value="denuncia">Denúncia</SelectItem>
                <SelectItem value="sugestao">Sugestão</SelectItem>
                <SelectItem value="solicitacao">Solicitação</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="nova">Nova</SelectItem>
                <SelectItem value="em_analise">Em Análise</SelectItem>
                <SelectItem value="respondida">Respondida</SelectItem>
                <SelectItem value="finalizada">Finalizada</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchQuery("");
                setTypeFilter("all");
                setStatusFilter("all");
              }}
            >
              <Filter className="h-4 w-4 mr-2" />
              Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Manifestations List */}
      <Card>
        <CardHeader>
          <CardTitle>Manifestações ({filteredManifestations.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredManifestations.length > 0 ? (
              filteredManifestations.map((manifestation) => (
                <div 
                  key={manifestation.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedManifestation(manifestation);
                    setShowManifestationDetails(true);
                  }}
                >
                  <div className="flex flex-wrap justify-between items-start gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{manifestation.number}</h3>
                        <Badge className={getStatusColor(manifestation.status)}>
                          {getStatusLabel(manifestation.status)}
                        </Badge>
                        <Badge variant="outline" className={getTypeColor(manifestation.type)}>
                          {getTypeLabel(manifestation.type)}
                        </Badge>
                        {manifestation.anonymous && (
                          <Badge variant="secondary">Anônima</Badge>
                        )}
                      </div>
                      
                      <p className="font-medium text-gray-900 mb-1">{manifestation.subject}</p>
                      <p className="text-sm text-gray-600 mb-2">
                        {manifestation.anonymous ? "Manifestação anônima" : manifestation.name}
                      </p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          {manifestation.department}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Criada: {new Date(manifestation.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          Prazo: {new Date(manifestation.dueDate).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {manifestation.responses && manifestation.responses.length > 0 && (
                        <Badge variant="secondary">
                          {manifestation.responses.length} resposta(s)
                        </Badge>
                      )}
                      <Button variant="outline" size="sm">
                        Ver Detalhes
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10 text-gray-500">
                Nenhuma manifestação encontrada.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Dialogs */}
      <Dialog open={showManifestationForm} onOpenChange={setShowManifestationForm}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nova Manifestação</DialogTitle>
          </DialogHeader>
          <ManifestationForm onClose={() => setShowManifestationForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={showManifestationDetails} onOpenChange={setShowManifestationDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Detalhes da Manifestação</DialogTitle>
          </DialogHeader>
          {selectedManifestation && (
            <ManifestationDetails 
              manifestation={selectedManifestation} 
              onClose={() => setShowManifestationDetails(false)} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}