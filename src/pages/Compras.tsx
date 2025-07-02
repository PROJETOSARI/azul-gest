
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Package, Search, Plus, Edit, Trash, ShoppingCart, Box, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Produto {
  id: string;
  codigo: string;
  nome: string;
  categoria: string;
  qtdEstoque: number;
  estoqueMinimo: number;
  unidade: string;
  valorUnitario: number;
  fornecedor: string;
  ultimaCompra: string;
}

interface Compra {
  id: string;
  numeroCompra: string;
  dataPedido: string;
  dataEntrega: string | null;
  fornecedor: string;
  valorTotal: number;
  status: "Pendente" | "Aprovada" | "Entregue" | "Cancelada";
  itens: {
    produtoId: string;
    produtoNome: string;
    quantidade: number;
    valorUnitario: number;
  }[];
}

// Dados de exemplo
const produtosMock: Produto[] = [
  {
    id: "1",
    codigo: "MAT001",
    nome: "Papel A4",
    categoria: "Material de Escritório",
    qtdEstoque: 50,
    estoqueMinimo: 20,
    unidade: "Resma",
    valorUnitario: 22.90,
    fornecedor: "Papelaria Central",
    ultimaCompra: "2025-03-15"
  },
  {
    id: "2",
    codigo: "INF002",
    nome: "Toner Impressora",
    categoria: "Informática",
    qtdEstoque: 8,
    estoqueMinimo: 5,
    unidade: "Unidade",
    valorUnitario: 189.90,
    fornecedor: "Tech Supply",
    ultimaCompra: "2025-02-20"
  },
  {
    id: "3",
    codigo: "LIM003",
    nome: "Desinfetante",
    categoria: "Limpeza",
    qtdEstoque: 15,
    estoqueMinimo: 10,
    unidade: "Galão",
    valorUnitario: 9.75,
    fornecedor: "Clean Max",
    ultimaCompra: "2025-03-28"
  },
  {
    id: "4",
    codigo: "MAT004",
    nome: "Canetas Esferográficas",
    categoria: "Material de Escritório",
    qtdEstoque: 120,
    estoqueMinimo: 50,
    unidade: "Caixa",
    valorUnitario: 34.50,
    fornecedor: "Papelaria Central",
    ultimaCompra: "2025-01-10"
  },
  {
    id: "5",
    codigo: "MOV005",
    nome: "Cadeira de Escritório",
    categoria: "Móveis",
    qtdEstoque: 3,
    estoqueMinimo: 2,
    unidade: "Unidade",
    valorUnitario: 459.90,
    fornecedor: "Office Móveis",
    ultimaCompra: "2025-02-05"
  }
];

const comprasMock: Compra[] = [
  {
    id: "1",
    numeroCompra: "PC2025-001",
    dataPedido: "2025-03-20",
    dataEntrega: "2025-03-28",
    fornecedor: "Papelaria Central",
    valorTotal: 678.50,
    status: "Entregue",
    itens: [
      {
        produtoId: "1",
        produtoNome: "Papel A4",
        quantidade: 20,
        valorUnitario: 22.90
      },
      {
        produtoId: "4",
        produtoNome: "Canetas Esferográficas",
        quantidade: 5,
        valorUnitario: 34.50
      }
    ]
  },
  {
    id: "2",
    numeroCompra: "PC2025-002",
    dataPedido: "2025-04-02",
    dataEntrega: null,
    fornecedor: "Tech Supply",
    valorTotal: 1139.40,
    status: "Pendente",
    itens: [
      {
        produtoId: "2",
        produtoNome: "Toner Impressora",
        quantidade: 6,
        valorUnitario: 189.90
      }
    ]
  },
  {
    id: "3",
    numeroCompra: "PC2025-003",
    dataPedido: "2025-04-05",
    dataEntrega: null,
    fornecedor: "Clean Max",
    valorTotal: 97.50,
    status: "Aprovada",
    itens: [
      {
        produtoId: "3",
        produtoNome: "Desinfetante",
        quantidade: 10,
        valorUnitario: 9.75
      }
    ]
  }
];

const categorias = [
  "Material de Escritório",
  "Informática",
  "Limpeza",
  "Móveis",
  "Equipamentos",
  "Alimentos",
  "Outros"
];

const fornecedores = [
  "Papelaria Central",
  "Tech Supply",
  "Clean Max",
  "Office Móveis",
  "Distribuidora Geral",
  "Informática Total"
];

const Compras = () => {
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock);
  const [compras, setCompras] = useState<Compra[]>(comprasMock);
  const [searchEstoque, setSearchEstoque] = useState("");
  const [searchCompras, setSearchCompras] = useState("");
  const [novoProduto, setNovoProduto] = useState<Partial<Produto>>({});
  const [novaCompra, setNovaCompra] = useState<Partial<Compra>>({
    itens: []
  });
  const [produtoSelecionado, setProdutoSelecionado] = useState<string>("");
  const [qtdProdutoSelecionado, setQtdProdutoSelecionado] = useState<number>(1);
  const [openDialogProduto, setOpenDialogProduto] = useState(false);
  const [openDialogCompra, setOpenDialogCompra] = useState(false);
  const [editingProduto, setEditingProduto] = useState<string | null>(null);
  const [detalhesCompra, setDetalhesCompra] = useState<string | null>(null);
  
  const { toast } = useToast();

  // Funções para estoque
  const filteredProdutos = produtos.filter(produto => 
    produto.nome.toLowerCase().includes(searchEstoque.toLowerCase()) || 
    produto.codigo.toLowerCase().includes(searchEstoque.toLowerCase()) ||
    produto.categoria.toLowerCase().includes(searchEstoque.toLowerCase())
  );

  const handleProdutoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovoProduto({
      ...novoProduto,
      [name]: name === 'valorUnitario' || name === 'qtdEstoque' || name === 'estoqueMinimo' 
        ? parseFloat(value) 
        : value
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setNovoProduto({
      ...novoProduto,
      [field]: value
    });
  };

  const handleProdutoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoProduto.codigo || !novoProduto.nome || !novoProduto.categoria || 
        novoProduto.qtdEstoque === undefined || !novoProduto.unidade || 
        novoProduto.valorUnitario === undefined) {
      toast({
        title: "Erro ao adicionar produto",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (editingProduto) {
      // Atualizar produto existente
      setProdutos(produtos.map(p => 
        p.id === editingProduto ? { ...p, ...novoProduto, id: p.id } : p
      ));
      toast({
        title: "Produto atualizado",
        description: `${novoProduto.nome} atualizado com sucesso.`
      });
      setEditingProduto(null);
    } else {
      // Adicionar novo produto
      const newProduto: Produto = {
        id: Date.now().toString(),
        codigo: novoProduto.codigo!,
        nome: novoProduto.nome!,
        categoria: novoProduto.categoria!,
        qtdEstoque: novoProduto.qtdEstoque!,
        estoqueMinimo: novoProduto.estoqueMinimo || 0,
        unidade: novoProduto.unidade!,
        valorUnitario: novoProduto.valorUnitario!,
        fornecedor: novoProduto.fornecedor || "Não especificado",
        ultimaCompra: novoProduto.ultimaCompra || new Date().toISOString().split('T')[0]
      };

      setProdutos([...produtos, newProduto]);
      toast({
        title: "Produto adicionado",
        description: `${newProduto.nome} adicionado ao estoque.`
      });
    }
    
    setNovoProduto({});
    setOpenDialogProduto(false);
  };

  const editarProduto = (id: string) => {
    const produto = produtos.find(p => p.id === id);
    if (produto) {
      setNovoProduto({ ...produto });
      setEditingProduto(id);
      setOpenDialogProduto(true);
    }
  };

  const excluirProduto = (id: string) => {
    setProdutos(produtos.filter(produto => produto.id !== id));
    toast({
      title: "Produto excluído",
      description: "O produto foi removido do estoque."
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Não definida";
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Funções para compras
  const filteredCompras = compras.filter(compra => 
    compra.numeroCompra.toLowerCase().includes(searchCompras.toLowerCase()) || 
    compra.fornecedor.toLowerCase().includes(searchCompras.toLowerCase())
  );

  const adicionarItemCompra = () => {
    if (!produtoSelecionado || qtdProdutoSelecionado <= 0) {
      toast({
        title: "Erro ao adicionar item",
        description: "Selecione um produto e quantidade válida.",
        variant: "destructive"
      });
      return;
    }

    const produto = produtos.find(p => p.id === produtoSelecionado);
    if (!produto) return;

    const itemExistente = novaCompra.itens?.find(item => item.produtoId === produtoSelecionado);
    
    if (itemExistente) {
      // Atualizar quantidade se o item já existe na lista
      const itensAtualizados = novaCompra.itens?.map(item => 
        item.produtoId === produtoSelecionado 
          ? { ...item, quantidade: item.quantidade + qtdProdutoSelecionado }
          : item
      );
      setNovaCompra({ ...novaCompra, itens: itensAtualizados });
    } else {
      // Adicionar novo item
      const novoItem = {
        produtoId: produto.id,
        produtoNome: produto.nome,
        quantidade: qtdProdutoSelecionado,
        valorUnitario: produto.valorUnitario
      };
      setNovaCompra({ 
        ...novaCompra, 
        itens: [...(novaCompra.itens || []), novoItem]
      });
    }

    setProdutoSelecionado("");
    setQtdProdutoSelecionado(1);
  };

  const removerItemCompra = (produtoId: string) => {
    const itensAtualizados = novaCompra.itens?.filter(item => item.produtoId !== produtoId);
    setNovaCompra({ ...novaCompra, itens: itensAtualizados });
  };

  const calcularTotalCompra = () => {
    return novaCompra.itens?.reduce((total, item) => 
      total + (item.quantidade * item.valorUnitario), 0
    ) || 0;
  };

  const handleCompraInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNovaCompra({
      ...novaCompra,
      [name]: value
    });
  };

  const handleCompraSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novaCompra.numeroCompra || !novaCompra.fornecedor || !novaCompra.dataPedido || 
        !novaCompra.itens || novaCompra.itens.length === 0) {
      toast({
        title: "Erro ao criar pedido de compra",
        description: "Preencha todos os campos obrigatórios e adicione pelo menos um item.",
        variant: "destructive"
      });
      return;
    }

    const newCompra: Compra = {
      id: Date.now().toString(),
      numeroCompra: novaCompra.numeroCompra!,
      dataPedido: novaCompra.dataPedido!,
      dataEntrega: null,
      fornecedor: novaCompra.fornecedor!,
      valorTotal: calcularTotalCompra(),
      status: "Pendente",
      itens: novaCompra.itens || []
    };

    setCompras([...compras, newCompra]);
    setNovaCompra({ itens: [] });
    setOpenDialogCompra(false);
    toast({
      title: "Pedido de compra criado",
      description: `Pedido ${newCompra.numeroCompra} criado com sucesso.`
    });
  };

  const excluirCompra = (id: string) => {
    setCompras(compras.filter(compra => compra.id !== id));
    toast({
      title: "Pedido excluído",
      description: "O pedido de compra foi cancelado e excluído."
    });
  };

  const atualizarStatusCompra = (id: string, novoStatus: "Pendente" | "Aprovada" | "Entregue" | "Cancelada") => {
    setCompras(compras.map(compra => {
      if (compra.id === id) {
        const updated = { 
          ...compra, 
          status: novoStatus,
          dataEntrega: novoStatus === "Entregue" ? new Date().toISOString().split('T')[0] : compra.dataEntrega
        };
        
        // Se status for "Entregue", atualizar o estoque
        if (novoStatus === "Entregue") {
          atualizarEstoqueAposEntrega(compra);
        }
        
        return updated;
      }
      return compra;
    }));
    
    toast({
      title: "Status atualizado",
      description: `Pedido atualizado para "${novoStatus}".`
    });
  };

  const atualizarEstoqueAposEntrega = (compra: Compra) => {
    // Atualizar quantidade em estoque dos produtos
    const produtosAtualizados = produtos.map(produto => {
      const itemCompra = compra.itens.find(item => item.produtoId === produto.id);
      if (itemCompra) {
        return {
          ...produto,
          qtdEstoque: produto.qtdEstoque + itemCompra.quantidade,
          ultimaCompra: new Date().toISOString().split('T')[0]
        };
      }
      return produto;
    });
    
    setProdutos(produtosAtualizados);
    
    toast({
      title: "Estoque atualizado",
      description: "Os produtos foram adicionados ao estoque."
    });
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Pendente": return "bg-yellow-100 text-yellow-800";
      case "Aprovada": return "bg-blue-100 text-blue-800";
      case "Entregue": return "bg-green-100 text-green-800";
      case "Cancelada": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const nivelEstoqueColor = (produto: Produto) => {
    if (produto.qtdEstoque <= 0) return "bg-red-100 text-red-800";
    if (produto.qtdEstoque <= produto.estoqueMinimo) return "bg-yellow-100 text-yellow-800";
    return "bg-green-100 text-green-800";
  };

  return (
    <div className="container mx-auto py-6 animate-fade-in">
      <h1 className="text-2xl font-bold mb-6">Compras e Estoque</h1>
      
      <Tabs defaultValue="estoque" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-4">
          <TabsTrigger value="estoque">Estoque</TabsTrigger>
          <TabsTrigger value="compras">Compras</TabsTrigger>
        </TabsList>
        
        {/* Aba de Estoque */}
        <TabsContent value="estoque">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Estoque de Produtos</CardTitle>
                  <CardDescription>
                    Gerenciamento de produtos e materiais em estoque
                  </CardDescription>
                </div>
                <Dialog open={openDialogProduto} onOpenChange={setOpenDialogProduto}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEditingProduto(null);
                      setNovoProduto({});
                    }}>
                      <Plus className="mr-2 h-4 w-4" /> Novo Produto
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[550px]">
                    <DialogHeader>
                      <DialogTitle>{editingProduto ? "Editar Produto" : "Adicionar Novo Produto"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleProdutoSubmit} className="grid gap-4 py-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="codigo">Código</Label>
                          <Input
                            id="codigo"
                            name="codigo"
                            value={novoProduto.codigo || ''}
                            onChange={handleProdutoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="categoria">Categoria</Label>
                          <Select 
                            onValueChange={(value) => handleSelectChange('categoria', value)}
                            defaultValue={novoProduto.categoria}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar categoria" />
                            </SelectTrigger>
                            <SelectContent>
                              {categorias.map((cat) => (
                                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="nome">Nome do Produto</Label>
                        <Input
                          id="nome"
                          name="nome"
                          value={novoProduto.nome || ''}
                          onChange={handleProdutoInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="qtdEstoque">Quantidade</Label>
                          <Input
                            id="qtdEstoque"
                            name="qtdEstoque"
                            type="number"
                            value={novoProduto.qtdEstoque || ''}
                            onChange={handleProdutoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="estoqueMinimo">Estoque Mínimo</Label>
                          <Input
                            id="estoqueMinimo"
                            name="estoqueMinimo"
                            type="number"
                            value={novoProduto.estoqueMinimo || ''}
                            onChange={handleProdutoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="unidade">Unidade</Label>
                          <Input
                            id="unidade"
                            name="unidade"
                            value={novoProduto.unidade || ''}
                            onChange={handleProdutoInputChange}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="valorUnitario">Valor Unitário (R$)</Label>
                          <Input
                            id="valorUnitario"
                            name="valorUnitario"
                            type="number"
                            step="0.01"
                            value={novoProduto.valorUnitario || ''}
                            onChange={handleProdutoInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fornecedor">Fornecedor Principal</Label>
                          <Select 
                            onValueChange={(value) => handleSelectChange('fornecedor', value)}
                            defaultValue={novoProduto.fornecedor}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar fornecedor" />
                            </SelectTrigger>
                            <SelectContent>
                              {fornecedores.map((forn) => (
                                <SelectItem key={forn} value={forn}>{forn}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button type="submit" className="mt-4">{editingProduto ? "Atualizar Produto" : "Adicionar Produto"}</Button>
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
                    placeholder="Buscar produtos..."
                    className="pl-8"
                    value={searchEstoque}
                    onChange={(e) => setSearchEstoque(e.target.value)}
                  />
                </div>
              </div>
              <Table>
                <TableCaption>Lista de produtos em estoque</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Estoque</TableHead>
                    <TableHead>Unidade</TableHead>
                    <TableHead>Valor Unit.</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Última Compra</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProdutos.map((produto) => (
                    <TableRow key={produto.id}>
                      <TableCell>{produto.codigo}</TableCell>
                      <TableCell>{produto.nome}</TableCell>
                      <TableCell>{produto.categoria}</TableCell>
                      <TableCell>
                        <Badge className={nivelEstoqueColor(produto)}>
                          {produto.qtdEstoque} {produto.qtdEstoque <= produto.estoqueMinimo && "(Baixo)"}
                        </Badge>
                      </TableCell>
                      <TableCell>{produto.unidade}</TableCell>
                      <TableCell>{formatCurrency(produto.valorUnitario)}</TableCell>
                      <TableCell>{produto.fornecedor}</TableCell>
                      <TableCell>{formatDate(produto.ultimaCompra)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => editarProduto(produto.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => excluirProduto(produto.id)}
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
        
        {/* Aba de Compras */}
        <TabsContent value="compras">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Pedidos de Compra</CardTitle>
                  <CardDescription>
                    Gerenciamento de pedidos de compra de materiais
                  </CardDescription>
                </div>
                <Dialog open={openDialogCompra} onOpenChange={setOpenDialogCompra}>
                  <DialogTrigger asChild>
                    <Button>
                      <ShoppingCart className="mr-2 h-4 w-4" /> Nova Compra
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[650px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Criar Novo Pedido de Compra</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCompraSubmit} className="grid gap-4 py-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="numeroCompra">Nº do Pedido</Label>
                          <Input
                            id="numeroCompra"
                            name="numeroCompra"
                            value={novaCompra.numeroCompra || ''}
                            onChange={handleCompraInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dataPedido">Data do Pedido</Label>
                          <Input
                            id="dataPedido"
                            name="dataPedido"
                            type="date"
                            value={novaCompra.dataPedido || ''}
                            onChange={handleCompraInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="fornecedor">Fornecedor</Label>
                          <Select 
                            onValueChange={(value) => setNovaCompra({...novaCompra, fornecedor: value})}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar fornecedor" />
                            </SelectTrigger>
                            <SelectContent>
                              {fornecedores.map((forn) => (
                                <SelectItem key={forn} value={forn}>{forn}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <h4 className="font-medium mb-2">Itens do Pedido</h4>
                        <div className="grid grid-cols-12 gap-2 mb-2">
                          <div className="col-span-6">
                            <Select onValueChange={setProdutoSelecionado} value={produtoSelecionado}>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecionar produto" />
                              </SelectTrigger>
                              <SelectContent>
                                {produtos.map((prod) => (
                                  <SelectItem key={prod.id} value={prod.id}>
                                    {prod.codigo} - {prod.nome}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              min="1"
                              placeholder="Qtd"
                              value={qtdProdutoSelecionado}
                              onChange={(e) => setQtdProdutoSelecionado(parseInt(e.target.value) || 1)}
                            />
                          </div>
                          <div className="col-span-3">
                            <Button 
                              type="button" 
                              onClick={adicionarItemCompra}
                              className="w-full"
                            >
                              Adicionar
                            </Button>
                          </div>
                        </div>
                        
                        {/* Tabela de itens */}
                        {novaCompra.itens && novaCompra.itens.length > 0 ? (
                          <div className="border rounded-md">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Produto</TableHead>
                                  <TableHead>Quantidade</TableHead>
                                  <TableHead>Valor Unit.</TableHead>
                                  <TableHead>Subtotal</TableHead>
                                  <TableHead></TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {novaCompra.itens.map((item) => (
                                  <TableRow key={item.produtoId}>
                                    <TableCell>{item.produtoNome}</TableCell>
                                    <TableCell>{item.quantidade}</TableCell>
                                    <TableCell>{formatCurrency(item.valorUnitario)}</TableCell>
                                    <TableCell>{formatCurrency(item.quantidade * item.valorUnitario)}</TableCell>
                                    <TableCell>
                                      <Button 
                                        variant="ghost" 
                                        size="icon"
                                        onClick={() => removerItemCompra(item.produtoId)}
                                      >
                                        <Trash className="h-4 w-4" />
                                      </Button>
                                    </TableCell>
                                  </TableRow>
                                ))}
                                <TableRow>
                                  <TableCell colSpan={3} className="text-right font-medium">
                                    Total:
                                  </TableCell>
                                  <TableCell className="font-bold">
                                    {formatCurrency(calcularTotalCompra())}
                                  </TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground">
                            Nenhum item adicionado
                          </div>
                        )}
                      </div>
                      
                      <Button type="submit" className="mt-4">Criar Pedido de Compra</Button>
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
                    placeholder="Buscar pedidos de compra..."
                    className="pl-8"
                    value={searchCompras}
                    onChange={(e) => setSearchCompras(e.target.value)}
                  />
                </div>
              </div>
              
              <Table>
                <TableCaption>Lista de pedidos de compra</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Número</TableHead>
                    <TableHead>Fornecedor</TableHead>
                    <TableHead>Data do Pedido</TableHead>
                    <TableHead>Data de Entrega</TableHead>
                    <TableHead>Valor Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCompras.map((compra) => (
                    <TableRow key={compra.id}>
                      <TableCell>{compra.numeroCompra}</TableCell>
                      <TableCell>{compra.fornecedor}</TableCell>
                      <TableCell>{formatDate(compra.dataPedido)}</TableCell>
                      <TableCell>{compra.dataEntrega ? formatDate(compra.dataEntrega) : "Pendente"}</TableCell>
                      <TableCell>{formatCurrency(compra.valorTotal)}</TableCell>
                      <TableCell>
                        <Badge className={statusColor(compra.status)}>
                          {compra.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => setDetalhesCompra(compra.id === detalhesCompra ? null : compra.id)}
                          >
                            {compra.id === detalhesCompra ? 
                              <Box className="h-4 w-4" /> : 
                              <Package className="h-4 w-4" />
                            }
                          </Button>
                          
                          {compra.status !== "Entregue" && compra.status !== "Cancelada" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => atualizarStatusCompra(
                                compra.id, 
                                compra.status === "Pendente" ? "Aprovada" : "Entregue"
                              )}
                            >
                              <RefreshCcw className="h-4 w-4" />
                            </Button>
                          )}
                          
                          {compra.status !== "Entregue" && (
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={() => excluirCompra(compra.id)}
                            >
                              <Trash className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Detalhes da Compra */}
              {detalhesCompra && (
                <div className="mt-4 border rounded-md p-4 bg-gray-50">
                  <h4 className="font-medium mb-2">Detalhes do Pedido</h4>
                  {compras.find(c => c.id === detalhesCompra)?.itens.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                      <div>
                        <span className="font-medium">{item.produtoNome}</span>
                        <span className="text-sm text-muted-foreground ml-2">
                          ({item.quantidade} {item.quantidade > 1 ? 'unidades' : 'unidade'})
                        </span>
                      </div>
                      <div>
                        <span className="text-sm text-muted-foreground mr-2">
                          {formatCurrency(item.valorUnitario)} cada
                        </span>
                        <span className="font-medium">
                          {formatCurrency(item.quantidade * item.valorUnitario)}
                        </span>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end mt-2 font-semibold">
                    Total: {formatCurrency(compras.find(c => c.id === detalhesCompra)?.valorTotal || 0)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Compras;
