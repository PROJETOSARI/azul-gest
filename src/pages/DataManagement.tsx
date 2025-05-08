
import React, { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { 
  Database, 
  Download, 
  Upload, 
  AlertTriangle, 
  Trash2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useInventory } from '@/contexts/InventoryContext';

const DataManagement = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { 
    inventoryItems, 
    historyRecords,
    addInventoryItem,
    deleteInventoryItem
  } = useInventory();
  
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  // Create backup of all data
  const handleExportData = () => {
    try {
      setIsExporting(true);
      
      // Prepare data to export
      const dataToExport = {
        inventoryItems,
        historyRecords,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
      };
      
      // Convert to JSON and create blob
      const jsonData = JSON.stringify(dataToExport, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const dateStr = new Date().toISOString().split('T')[0];
      
      link.href = url;
      link.download = `inventory-backup-${dateStr}.json`;
      link.click();
      
      // Clean up
      URL.revokeObjectURL(url);
      
      toast({
        title: "Backup realizado com sucesso",
        description: "Seus dados foram exportados com segurança",
      });
    } catch (error) {
      console.error('Erro ao exportar dados:', error);
      toast({
        variant: "destructive",
        title: "Erro ao exportar dados",
        description: "Não foi possível criar o arquivo de backup",
      });
    } finally {
      setIsExporting(false);
    }
  };

  // Restore data from backup
  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setIsImporting(true);
      
      const file = e.target.files?.[0];
      if (!file) {
        toast({
          variant: "destructive",
          title: "Nenhum arquivo selecionado",
          description: "Por favor, selecione um arquivo de backup",
        });
        setIsImporting(false);
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const importedData = JSON.parse(event.target?.result as string);
          
          // Validate imported data
          if (!importedData.inventoryItems || !Array.isArray(importedData.inventoryItems)) {
            throw new Error('Formato de dados inválido');
          }
          
          // Confirm before restoring
          if (window.confirm('Tem certeza que deseja restaurar os dados? Isso substituirá todos os dados atuais.')) {
            // Delete current items first
            inventoryItems.forEach(item => {
              deleteInventoryItem(item.id, 'System');
            });
            
            // Import new items
            importedData.inventoryItems.forEach(item => {
              addInventoryItem({
                name: item.name,
                category: item.category,
                department: item.department,
                quantity: item.quantity,
                minQuantity: item.minQuantity,
                expirationDate: item.expirationDate,
                location: item.location,
                description: item.description,
                isOpen: item.isOpen,
                unitPrice: item.unitPrice,
                initialQuantity: item.initialQuantity
              }, 'System');
            });
            
            toast({
              title: "Dados restaurados com sucesso",
              description: `${importedData.inventoryItems.length} itens foram importados`,
            });

            // Refresh page to see changes
            navigate('/dashboard/inventory');
          }
        } catch (error) {
          console.error('Erro ao processar arquivo:', error);
          toast({
            variant: "destructive",
            title: "Erro ao importar dados",
            description: "O arquivo selecionado não é válido",
          });
        }
        setIsImporting(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Erro ao importar dados:', error);
      toast({
        variant: "destructive",
        title: "Erro ao importar dados",
        description: "Não foi possível processar o arquivo",
      });
      setIsImporting(false);
    }
  };

  // Reset all system data
  const handleResetSystem = () => {
    try {
      // Delete all inventory items
      inventoryItems.forEach(item => {
        deleteInventoryItem(item.id, 'System');
      });
      
      toast({
        title: "Sistema restaurado com sucesso",
        description: "Todos os dados foram removidos",
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Erro ao resetar sistema:', error);
      toast({
        variant: "destructive",
        title: "Erro ao resetar sistema",
        description: "Não foi possível remover todos os dados",
      });
    }
  };

  return (
    <div className="container p-6 mx-auto">
      <h1 className="text-3xl font-bold mb-8">Gerenciamento de Dados</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Backup Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Download className="h-6 w-6" />
              Backup de Dados
            </CardTitle>
            <CardDescription>
              Exporte todos os seus dados para um arquivo seguro
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Crie um arquivo de backup contendo todos os seus dados do sistema.
              Este arquivo pode ser armazenado com segurança e usado posteriormente para restaurar suas informações.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleExportData}
              disabled={isExporting}
              className="w-full"
            >
              {isExporting ? (
                <>Exportando dados...</>
              ) : (
                <>Exportar Dados</>
              )}
            </Button>
          </CardFooter>
        </Card>

        {/* Restore Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Upload className="h-6 w-6" />
              Restaurar Dados
            </CardTitle>
            <CardDescription>
              Importe dados de um backup anterior
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              Restaure seus dados a partir de um arquivo de backup criado anteriormente.
              Isso substituirá todos os dados atuais do sistema.
            </p>
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <input
                type="file"
                id="import-file"
                accept=".json"
                onChange={handleImportData}
                className="hidden"
                disabled={isImporting}
              />
              <Button 
                onClick={() => document.getElementById('import-file')?.click()}
                disabled={isImporting}
                variant="outline"
                className="w-full"
              >
                {isImporting ? (
                  <>Importando dados...</>
                ) : (
                  <>Selecionar Arquivo</>
                )}
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* System Reset Card - Danger Zone */}
        <Card className="border-destructive/20 bg-destructive/5 shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl text-destructive flex items-center gap-2">
              <AlertTriangle className="h-6 w-6" />
              Área de Perigo
            </CardTitle>
            <CardDescription>
              Ações irreversíveis para o sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              As ações nesta área são permanentes e não podem ser desfeitas.
              Certifique-se de fazer backup dos seus dados antes de prosseguir.
            </p>
          </CardContent>
          <CardFooter>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="destructive"
                  className="w-full gap-2"
                >
                  <Trash2 className="h-5 w-5" />
                  Excluir Todos os Dados
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Esta ação não pode ser desfeita. Isso removerá permanentemente todos
                    os seus dados do sistema, incluindo inventário e histórico de ações.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleResetSystem}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    Sim, excluir tudo
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </CardFooter>
        </Card>

        {/* Database Info Card */}
        <Card className="shadow-md hover:shadow-lg transition-shadow md:col-span-2 lg:col-span-3">
          <CardHeader className="pb-3">
            <CardTitle className="text-xl flex items-center gap-2">
              <Database className="h-6 w-6" />
              Informações do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Total de Itens</h3>
                <p className="text-2xl font-bold">{inventoryItems.length}</p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Registros de Histórico</h3>
                <p className="text-2xl font-bold">{historyRecords.length}</p>
              </div>
              <div className="bg-secondary/50 p-4 rounded-lg">
                <h3 className="font-medium mb-1">Último Backup</h3>
                <p className="text-lg">Nenhum</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DataManagement;
