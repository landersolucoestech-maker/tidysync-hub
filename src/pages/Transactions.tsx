import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader, KPICard, SearchInput, FilterSelect, ActionDropdown } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Upload,
  Download,
  Settings2,
  Link2,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
  CalendarIcon,
  ArrowUpRight,
  ArrowDownLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock transactions data
const transactionsData = [
  {
    id: "1",
    name: "Serviço de Limpeza Residencial",
    date: "2024-01-15",
    category: "Receita de Serviços",
    status: "conciliado",
    amount: 250.00,
    type: "receita",
  },
  {
    id: "2",
    name: "Compra de Produtos de Limpeza",
    date: "2024-01-14",
    category: "Materiais",
    status: "pendente",
    amount: -85.50,
    type: "despesa",
  },
  {
    id: "3",
    name: "Serviço de Limpeza Comercial",
    date: "2024-01-13",
    category: "Receita de Serviços",
    status: "conciliado",
    amount: 450.00,
    type: "receita",
  },
  {
    id: "4",
    name: "Combustível - Frota",
    date: "2024-01-12",
    category: "Transporte",
    status: "conciliado",
    amount: -120.00,
    type: "despesa",
  },
  {
    id: "5",
    name: "Pagamento de Funcionário",
    date: "2024-01-11",
    category: "Folha de Pagamento",
    status: "pendente",
    amount: -1500.00,
    type: "despesa",
  },
  {
    id: "6",
    name: "Limpeza Pós-Obra",
    date: "2024-01-10",
    category: "Receita de Serviços",
    status: "conciliado",
    amount: 800.00,
    type: "receita",
  },
  {
    id: "7",
    name: "Manutenção de Equipamentos",
    date: "2024-01-09",
    category: "Manutenção",
    status: "conciliado",
    amount: -200.00,
    type: "despesa",
  },
  {
    id: "8",
    name: "Serviço de Limpeza de Vidros",
    date: "2024-01-08",
    category: "Receita de Serviços",
    status: "pendente",
    amount: 180.00,
    type: "receita",
  },
];

const typeOptions = [
  { value: "all", label: "Todos os Tipos" },
  { value: "receita", label: "Receita" },
  { value: "despesa", label: "Despesa" },
];

const statusOptions = [
  { value: "all", label: "Todos Status" },
  { value: "conciliado", label: "Conciliado" },
  { value: "pendente", label: "Pendente" },
];

export function Transactions() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [showNewTransactionModal, setShowNewTransactionModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<typeof transactionsData[0] | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Calculate KPIs
  const totalReceita = transactionsData
    .filter((t) => t.type === "receita")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalDespesas = transactionsData
    .filter((t) => t.type === "despesa")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const lucroPrejuizo = totalReceita - totalDespesas;

  // Get unique categories
  const categories = [...new Set(transactionsData.map((t) => t.category))];
  const categoryOptions = [
    { value: "all", label: "Todas Categorias" },
    ...categories.map((cat) => ({ value: cat, label: cat })),
  ];

  // Filter transactions
  const filteredTransactions = transactionsData.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || t.type === typeFilter;
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || t.category === categoryFilter;
    
    // Date filters
    const transactionDate = new Date(t.date);
    const matchesStartDate = !startDate || transactionDate >= startDate;
    const matchesEndDate = !endDate || transactionDate <= endDate;
    
    return matchesSearch && matchesType && matchesStatus && matchesCategory && matchesStartDate && matchesEndDate;
  });

  const handleView = (transaction: typeof transactionsData[0]) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const handleEdit = (transaction: typeof transactionsData[0]) => {
    setSelectedTransaction(transaction);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    console.log("Delete transaction:", id);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "conciliado":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Conciliado</Badge>;
      case "pendente":
        return <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">Pendente</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <PageLayout>
      {/* Page Header */}
      <PageHeader
        title="Transactions"
        description="Manage all financial transactions, income and expenses"
        actions={
          <>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Importar OFX
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
            <Button variant="outline" size="sm" onClick={() => navigate("/rules")}>
              <Settings2 className="w-4 h-4 mr-2" />
              Regras
            </Button>
            <Button variant="outline" size="sm">
              <Link2 className="w-4 h-4 mr-2" />
              Integração Bancária
            </Button>
            <Button onClick={() => setShowNewTransactionModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Transação
            </Button>
          </>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Receita Total"
          value={formatCurrency(totalReceita)}
          valueClassName="text-green-600"
          iconClassName="bg-green-500/20"
          icon={<TrendingUp className="w-6 h-6 text-green-600" />}
        />
        <KPICard
          title="Despesas Totais"
          value={formatCurrency(totalDespesas)}
          valueClassName="text-red-600"
          iconClassName="bg-red-500/20"
          icon={<TrendingDown className="w-6 h-6 text-red-600" />}
        />
        <KPICard
          title="Lucro/Prejuízo"
          value={formatCurrency(lucroPrejuizo)}
          valueClassName={lucroPrejuizo >= 0 ? "text-green-600" : "text-red-600"}
          iconClassName={lucroPrejuizo >= 0 ? "bg-green-500/20" : "bg-red-500/20"}
          icon={<DollarSign className={`w-6 h-6 ${lucroPrejuizo >= 0 ? "text-green-600" : "text-red-600"}`} />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            placeholder="Buscar transações..."
            value={searchTerm}
            onChange={setSearchTerm}
          />
          <FilterSelect value={typeFilter} onValueChange={setTypeFilter} options={typeOptions} />
          <FilterSelect value={statusFilter} onValueChange={setStatusFilter} options={statusOptions} />
          <FilterSelect value={categoryFilter} onValueChange={setCategoryFilter} options={categoryOptions} className="w-full md:w-[200px]" />
        </div>
        
        {/* Date Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <span className="text-sm text-muted-foreground">Filtrar por data:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !startDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {startDate ? format(startDate, "dd/MM/yyyy") : "Data início"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !endDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? format(endDate, "dd/MM/yyyy") : "Data fim"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                initialFocus
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          
          {(startDate || endDate) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setStartDate(undefined);
                setEndDate(undefined);
              }}
            >
              Limpar datas
            </Button>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{transaction.name}</TableCell>
                  <TableCell>
                    {new Date(transaction.date).toLocaleDateString("pt-BR")}
                  </TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                  <TableCell className={`text-right font-medium ${transaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(transaction)}
                      onEdit={() => handleEdit(transaction)}
                      onDelete={() => handleDelete(transaction.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* New Transaction Modal */}
      <Dialog open={showNewTransactionModal} onOpenChange={setShowNewTransactionModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Transação</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome</label>
              <Input placeholder="Nome da transação" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  <SelectItem value="receita">Receita</SelectItem>
                  <SelectItem value="despesa">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor</label>
              <Input type="number" placeholder="0,00" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Categoria</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a categoria" />
                </SelectTrigger>
                <SelectContent className="bg-background border border-border">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Data</label>
              <Input type="date" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewTransactionModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowNewTransactionModal(false)}>
                Salvar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Transaction Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {selectedTransaction?.type === "receita" ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownLeft className="w-5 h-5 text-red-600" />
              )}
              Detalhes da Transação
            </DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              {/* Transaction Name */}
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Nome da Transação</p>
                <p className="text-lg font-semibold">{selectedTransaction.name}</p>
              </div>
              
              <Separator />
              
              {/* Main Info Grid */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">ID</p>
                  <p className="font-medium">#{selectedTransaction.id}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge className={selectedTransaction.type === "receita" ? "bg-green-500/20 text-green-600" : "bg-red-500/20 text-red-600"}>
                    {selectedTransaction.type === "receita" ? "Receita" : "Despesa"}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">
                    {new Date(selectedTransaction.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <Badge variant="outline">{selectedTransaction.category}</Badge>
                </div>
              </div>
              
              <Separator />
              
              {/* Status and Value */}
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Status</p>
                  {getStatusBadge(selectedTransaction.status)}
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Valor</p>
                  <p className={`text-xl font-bold ${selectedTransaction.amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(selectedTransaction.amount)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              {/* Footer Actions */}
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Fechar
                </Button>
                <Button onClick={() => {
                  setShowViewModal(false);
                  handleEdit(selectedTransaction);
                }}>
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Transaction Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome</label>
                <Input defaultValue={selectedTransaction.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select defaultValue={selectedTransaction.type}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    <SelectItem value="receita">Receita</SelectItem>
                    <SelectItem value="despesa">Despesa</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Valor</label>
                <Input type="number" defaultValue={Math.abs(selectedTransaction.amount)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Categoria</label>
                <Select defaultValue={selectedTransaction.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-background border border-border">
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Data</label>
                <Input type="date" defaultValue={selectedTransaction.date} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => setShowEditModal(false)}>
                  Salvar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
