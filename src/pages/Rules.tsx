import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Plus,
  MoreHorizontal,
  Eye,
  Pencil,
  Trash2,
  Settings2,
  Filter,
  Power,
  PowerOff,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Mock rules data
const initialRulesData = [
  {
    id: "1",
    name: "Combustível",
    description: "Categoriza automaticamente despesas com combustível",
    condition: "Contém 'posto' ou 'combustível'",
    category: "Transporte",
    type: "despesa",
    active: true,
    createdAt: "2024-01-10",
    appliedCount: 45,
  },
  {
    id: "2",
    name: "Salários",
    description: "Categoriza pagamentos de funcionários",
    condition: "Contém 'salário' ou 'folha'",
    category: "Folha de Pagamento",
    type: "despesa",
    active: true,
    createdAt: "2024-01-08",
    appliedCount: 12,
  },
  {
    id: "3",
    name: "Serviços de Limpeza",
    description: "Categoriza receitas de serviços de limpeza",
    condition: "Contém 'limpeza' ou 'cleaning'",
    category: "Receita de Serviços",
    type: "receita",
    active: true,
    createdAt: "2024-01-05",
    appliedCount: 89,
  },
  {
    id: "4",
    name: "Materiais de Escritório",
    description: "Categoriza compras de materiais de escritório",
    condition: "Contém 'papelaria' ou 'escritório'",
    category: "Materiais",
    type: "despesa",
    active: false,
    createdAt: "2024-01-03",
    appliedCount: 8,
  },
  {
    id: "5",
    name: "Manutenção",
    description: "Categoriza despesas de manutenção de equipamentos",
    condition: "Contém 'manutenção' ou 'reparo'",
    category: "Manutenção",
    type: "despesa",
    active: true,
    createdAt: "2024-01-01",
    appliedCount: 23,
  },
];

const categories = [
  "Receita de Serviços",
  "Transporte",
  "Folha de Pagamento",
  "Materiais",
  "Manutenção",
  "Marketing",
  "Impostos",
  "Outros",
];

export function Rules() {
  const [rules, setRules] = useState(initialRulesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showNewRuleModal, setShowNewRuleModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<typeof initialRulesData[0] | null>(null);
  const [newRule, setNewRule] = useState({
    name: "",
    description: "",
    condition: "",
    category: "",
    type: "despesa",
  });

  // KPIs
  const totalRules = rules.length;
  const activeRules = rules.filter((r) => r.active).length;
  const totalApplied = rules.reduce((sum, r) => sum + r.appliedCount, 0);

  // Filter rules
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rule.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || rule.type === typeFilter;
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && rule.active) ||
      (statusFilter === "inactive" && !rule.active);
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddRule = () => {
    if (newRule.name && newRule.condition && newRule.category) {
      const rule = {
        id: String(rules.length + 1),
        ...newRule,
        active: true,
        createdAt: new Date().toISOString().split("T")[0],
        appliedCount: 0,
      };
      setRules([...rules, rule]);
      setNewRule({ name: "", description: "", condition: "", category: "", type: "despesa" });
      setShowNewRuleModal(false);
      toast({
        title: "Regra criada",
        description: `A regra "${rule.name}" foi criada com sucesso.`,
      });
    }
  };

  const handleEditRule = () => {
    if (selectedRule) {
      setRules(rules.map((r) => (r.id === selectedRule.id ? selectedRule : r)));
      setShowEditModal(false);
      toast({
        title: "Regra atualizada",
        description: `A regra "${selectedRule.name}" foi atualizada.`,
      });
    }
  };

  const handleToggleRule = (id: string) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, active: !rule.active } : rule
      )
    );
    const rule = rules.find((r) => r.id === id);
    toast({
      title: rule?.active ? "Regra desativada" : "Regra ativada",
      description: `A regra "${rule?.name}" foi ${rule?.active ? "desativada" : "ativada"}.`,
    });
  };

  const handleDeleteRule = (id: string) => {
    const rule = rules.find((r) => r.id === id);
    setRules(rules.filter((rule) => rule.id !== id));
    toast({
      title: "Regra excluída",
      description: `A regra "${rule?.name}" foi excluída.`,
    });
  };

  const handleView = (rule: typeof initialRulesData[0]) => {
    setSelectedRule(rule);
    setShowViewModal(true);
  };

  const handleEdit = (rule: typeof initialRulesData[0]) => {
    setSelectedRule({ ...rule });
    setShowEditModal(true);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Regras de Categorização</h1>
              <p className="text-muted-foreground">
                Configure regras para categorizar transações automaticamente
              </p>
            </div>

            <Button onClick={() => setShowNewRuleModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nova Regra
            </Button>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total de Regras</p>
                    <p className="text-2xl font-bold text-foreground">{totalRules}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center">
                    <Settings2 className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Regras Ativas</p>
                    <p className="text-2xl font-bold text-green-600">{activeRules}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Power className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Transações Categorizadas</p>
                    <p className="text-2xl font-bold text-blue-600">{totalApplied}</p>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <Filter className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar regras..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Todos os Tipos" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border">
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="receita">Receita</SelectItem>
                <SelectItem value="despesa">Despesa</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="Todos Status" />
              </SelectTrigger>
              <SelectContent className="bg-background border border-border">
                <SelectItem value="all">Todos Status</SelectItem>
                <SelectItem value="active">Ativas</SelectItem>
                <SelectItem value="inactive">Inativas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Rules Table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead>Nome</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Aplicações</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{rule.name}</p>
                          {rule.description && (
                            <p className="text-xs text-muted-foreground">{rule.description}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                        {rule.condition}
                      </TableCell>
                      <TableCell>{rule.category}</TableCell>
                      <TableCell>
                        <Badge variant={rule.type === "receita" ? "default" : "secondary"}>
                          {rule.type === "receita" ? "Receita" : "Despesa"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{rule.appliedCount}</span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            rule.active
                              ? "bg-green-500/20 text-green-600 hover:bg-green-500/30 cursor-pointer"
                              : "bg-gray-500/20 text-gray-600 hover:bg-gray-500/30 cursor-pointer"
                          }
                          onClick={() => handleToggleRule(rule.id)}
                        >
                          {rule.active ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border border-border">
                            <DropdownMenuItem onClick={() => handleView(rule)}>
                              <Eye className="w-4 h-4 mr-2" />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(rule)}>
                              <Pencil className="w-4 h-4 mr-2" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleRule(rule.id)}>
                              {rule.active ? (
                                <>
                                  <PowerOff className="w-4 h-4 mr-2" />
                                  Desativar
                                </>
                              ) : (
                                <>
                                  <Power className="w-4 h-4 mr-2" />
                                  Ativar
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteRule(rule.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </main>
      </div>

      {/* New Rule Modal */}
      <Dialog open={showNewRuleModal} onOpenChange={setShowNewRuleModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Regra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Regra</label>
              <Input
                placeholder="Ex: Combustível"
                value={newRule.name}
                onChange={(e) => setNewRule({ ...newRule, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Descrição (opcional)</label>
              <Input
                placeholder="Ex: Categoriza despesas com combustível"
                value={newRule.description}
                onChange={(e) => setNewRule({ ...newRule, description: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Condição</label>
              <Input
                placeholder="Ex: Contém 'posto' ou 'combustível'"
                value={newRule.condition}
                onChange={(e) => setNewRule({ ...newRule, condition: e.target.value })}
              />
              <p className="text-xs text-muted-foreground">
                Descreva quando esta regra deve ser aplicada
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select
                value={newRule.type}
                onValueChange={(value) => setNewRule({ ...newRule, type: value })}
              >
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
              <label className="text-sm font-medium">Categoria</label>
              <Select
                value={newRule.category}
                onValueChange={(value) => setNewRule({ ...newRule, category: value })}
              >
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
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowNewRuleModal(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAddRule}>Salvar Regra</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Rule Modal */}
      <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes da Regra</DialogTitle>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Nome</p>
                  <p className="font-medium">{selectedRule.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge
                    className={
                      selectedRule.active
                        ? "bg-green-500/20 text-green-600"
                        : "bg-gray-500/20 text-gray-600"
                    }
                  >
                    {selectedRule.active ? "Ativa" : "Inativa"}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Descrição</p>
                  <p className="font-medium">{selectedRule.description || "Sem descrição"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Condição</p>
                  <p className="font-medium">{selectedRule.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  <Badge variant={selectedRule.type === "receita" ? "default" : "secondary"}>
                    {selectedRule.type === "receita" ? "Receita" : "Despesa"}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{selectedRule.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criada em</p>
                  <p className="font-medium">
                    {new Date(selectedRule.createdAt).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Transações Aplicadas</p>
                  <p className="font-medium">{selectedRule.appliedCount}</p>
                </div>
              </div>
              <div className="flex justify-end pt-4">
                <Button variant="outline" onClick={() => setShowViewModal(false)}>
                  Fechar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Rule Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Regra</DialogTitle>
          </DialogHeader>
          {selectedRule && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nome da Regra</label>
                <Input
                  value={selectedRule.name}
                  onChange={(e) =>
                    setSelectedRule({ ...selectedRule, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Descrição</label>
                <Input
                  value={selectedRule.description}
                  onChange={(e) =>
                    setSelectedRule({ ...selectedRule, description: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Condição</label>
                <Input
                  value={selectedRule.condition}
                  onChange={(e) =>
                    setSelectedRule({ ...selectedRule, condition: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select
                  value={selectedRule.type}
                  onValueChange={(value) =>
                    setSelectedRule({ ...selectedRule, type: value })
                  }
                >
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
                <label className="text-sm font-medium">Categoria</label>
                <Select
                  value={selectedRule.category}
                  onValueChange={(value) =>
                    setSelectedRule({ ...selectedRule, category: value })
                  }
                >
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
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setShowEditModal(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleEditRule}>Salvar</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
