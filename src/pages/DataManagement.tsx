
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { useEmployees } from "@/contexts/EmployeeContext";
import { useInventory } from "@/contexts/InventoryContext";
import { AlertTriangle, Download, Upload, Trash2 } from "lucide-react";

const DataManagement = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const { toast } = useToast();
  const { employees } = useEmployees();
  const { inventoryItems, historyRecords } = useInventory();

  // Create backup file with all system data
  const handleExportData = () => {
    try {
      setIsExporting(true);
      
      // Collect all data from localStorage and contexts
      const backupData = {
        timestamp: new Date().toISOString(),
        employees: employees,
        inventoryItems: inventoryItems,
        inventoryHistory: historyRecords,
        // Add any additional data you want to backup
      };
      
      // Convert to JSON and create a downloadable file
      const jsonString = JSON.stringify(backupData, null, 2);
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create a download link and trigger it
      const downloadLink = document.createElement('a');
      const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      downloadLink.href = url;
      downloadLink.download = `sistema-backup-${date}.json`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      
      toast({
        title: "Backup realizado com sucesso",
        description: "Todos os dados foram exportados para um arquivo JSON.",
      });
    } catch (error) {
      console.error("Erro ao exportar dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar dados",
        description: "Não foi possível criar o arquivo de backup.",
      });
    } finally {
      setIsExporting(false);
    }
  };
  
  // Import data from backup file
  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const backupData = JSON.parse(content);
        
        // Store data in localStorage
        if (backupData.employees) {
          localStorage.setItem('rh-system-employees', JSON.stringify(backupData.employees));
        }
        
        if (backupData.inventoryItems) {
          localStorage.setItem('inventory-items', JSON.stringify(backupData.inventoryItems));
        }
        
        if (backupData.inventoryHistory) {
          localStorage.setItem('inventory-history', JSON.stringify(backupData.inventoryHistory));
        }
        
        // Add more data restore as needed
        
        toast({
          title: "Dados restaurados com sucesso",
          description: "Recarregue a página para ver os dados importados.",
        });
        
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } catch (error) {
        console.error("Erro ao importar dados:", error);
        toast({
          variant: "destructive",
          title: "Erro ao importar dados",
          description: "O arquivo de backup pode estar corrompido ou inválido.",
        });
      } finally {
        setIsImporting(false);
      }
    };
    
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "Erro ao ler arquivo",
        description: "Não foi possível ler o arquivo de backup.",
      });
      setIsImporting(false);
    };
    
    reader.readAsText(file);
  };
  
  // Delete all system data
  const handleDeleteAllData = () => {
    try {
      // Clear all localStorage data
      localStorage.removeItem('rh-system-employees');
      localStorage.removeItem('inventory-items');
      localStorage.removeItem('inventory-history');
      // Add more localStorage keys to clear as needed
      
      toast({
        title: "Dados excluídos com sucesso",
        description: "Todos os dados foram removidos do sistema. A página será recarregada.",
        variant: "destructive",
      });
      
      setIsConfirmingDelete(false);
      
      // Reload the page to refresh all contexts
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    } catch (error) {
      console.error("Erro ao excluir dados:", error);
      toast({
        variant: "destructive",
        title: "Erro ao excluir dados",
        description: "Ocorreu um erro ao tentar excluir os dados.",
      });
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <h1 className="text-2xl font-bold">Gerenciamento de Dados</h1>
      <p className="text-muted-foreground">
        Faça backup dos seus dados, restaure a partir de uma cópia de segurança ou redefina o sistema.
      </p>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Backup Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5 text-primary" />
              Backup de Dados
            </CardTitle>
            <CardDescription>
              Exporte todos os seus dados para um arquivo seguro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Crie um arquivo de backup contendo todos os dados do sistema, incluindo funcionários, inventário e histórico de movimentações.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleExportData} 
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? "Exportando..." : "Exportar Dados"}
            </Button>
          </CardFooter>
        </Card>
        
        {/* Restore Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Restaurar Dados
            </CardTitle>
            <CardDescription>
              Importe dados de um backup anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Restaure dados a partir de um arquivo de backup criado anteriormente. Todos os dados atuais serão substituídos.
            </p>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportData}
                disabled={isImporting}
                className="hidden"
              />
              <label htmlFor="import-file">
                <Button 
                  variant="outline" 
                  className="w-full cursor-pointer" 
                  disabled={isImporting}
                  asChild
                >
                  <span>
                    {isImporting ? "Importando..." : "Importar Dados"}
                  </span>
                </Button>
              </label>
            </div>
          </CardFooter>
        </Card>
        
        {/* Delete Card */}
        <Card className="border-destructive/20 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" />
              Área de Perigo
            </CardTitle>
            <CardDescription className="text-destructive/80">
              Excluir todo o conteúdo do sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Esta ação irá excluir permanentemente todos os dados do sistema. Essa operação não pode ser desfeita.
            </p>
          </CardContent>
          <CardFooter>
            <Dialog open={isConfirmingDelete} onOpenChange={setIsConfirmingDelete}>
              <DialogTrigger asChild>
                <Button 
                  variant="destructive" 
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir Todos os Dados
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Tem certeza?</DialogTitle>
                  <DialogDescription>
                    Esta ação irá excluir permanentemente todos os dados do sistema e não poderá ser desfeita.
                    Recomendamos fazer um backup antes de continuar.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2">
                  <Button variant="outline" onClick={() => setIsConfirmingDelete(false)}>
                    Cancelar
                  </Button>
                  <Button variant="destructive" onClick={handleDeleteAllData}>
                    Sim, excluir tudo
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default DataManagement;
