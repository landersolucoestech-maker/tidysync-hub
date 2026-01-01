import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageHeader, KPICard, SearchInput, FilterSelect, ActionDropdown } from "@/components/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
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
  Plus,
  Settings2,
  CheckCircle,
  XCircle,
} from "lucide-react";

// Mock rules data
const initialRulesData = [
  {
    id: "1",
    name: "Limpeza Residencial",
    condition: "Descrição contém 'limpeza residencial'",
    category: "Receita de Serviços",
    type: "receita",
    isActive: true,
    createdAt: "2024-01-10",
  },
  {
    id: "2",
    name: "Combustível",
    condition: "Descrição contém 'posto' ou 'combustível'",
    category: "Transporte",
    type: "despesa",
    isActive: true,
    createdAt: "2024-01-08",
  },
  {
    id: "3",
    name: "Materiais de Limpeza",
    condition: "Descrição contém 'produto' ou 'material'",
    category: "Materiais",
    type: "despesa",
    isActive: true,
    createdAt: "2024-01-05",
  },
  {
    id: "4",
    name: "Folha de Pagamento",
    condition: "Descrição contém 'salário' ou 'pagamento funcionário'",
    category: "Folha de Pagamento",
    type: "despesa",
    isActive: false,
    createdAt: "2024-01-03",
  },
  {
    id: "5",
    name: "Limpeza Comercial",
    condition: "Descrição contém 'comercial' ou 'empresa'",
    category: "Receita de Serviços",
    type: "receita",
    isActive: true,
    createdAt: "2024-01-01",
  },
];

const typeOptions = [
  { value: "all", label: "Todos os Tipos" },
  { value: "receita", label: "Receita" },
  { value: "despesa", label: "Despesa" },
];

const statusOptions = [
  { value: "all", label: "Todos Status" },
  { value: "active", label: "Ativas" },
  { value: "inactive", label: "Inativas" },
];

export function Rules() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [rulesData, setRulesData] = useState(initialRulesData);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedRule, setSelectedRule] = useState<typeof initialRulesData[0] | null>(null);

  // Calculate stats
  const totalRules = rulesData.length;
  const activeRules = rulesData.filter((r) => r.isActive).length;
  const inactiveRules = rulesData.filter((r) => !r.isActive).length;

  // Filter rules
  const filteredRules = rulesData.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.condition.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || r.type === typeFilter;
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" && r.isActive) ||
      (statusFilter === "inactive" && !r.isActive);
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleView = (rule: typeof initialRulesData[0]) => {
    setSelectedRule(rule);
    setShowViewModal(true);
  };

  const handleEdit = (rule: typeof initialRulesData[0]) => {
    setSelectedRule(rule);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    setRulesData(rulesData.filter((r) => r.id !== id));
  };

  const handleToggleStatus = (id: string) => {
    setRulesData(rulesData.map((r) => 
      r.id === id ? { ...r, isActive: !r.isActive } : r
    ));
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "receita":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Receita</Badge>;
      case "despesa":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Despesa</Badge>;
      default:
        return <Badge variant="secondary">{type}</Badge>;
    }
  };

  return (
    <PageLayout>
      {/* Page Header */}
      <PageHeader
        title="Regras de Categorização"
        description="Gerencie regras automáticas para categorizar transações"
        backTo="/accounting"
        actions={
          <Button onClick={() => setShowCreateModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Nova Regra
          </Button>
        }
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <KPICard
          title="Total de Regras"
          value={totalRules}
          iconClassName="bg-primary/20"
          icon={<Settings2 className="w-6 h-6 text-primary" />}
        />
        <KPICard
          title="Regras Ativas"
          value={activeRules}
          valueClassName="text-green-600"
          iconClassName="bg-green-500/20"
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        />
        <KPICard
          title="Regras Inativas"
          value={inactiveRules}
          valueClassName="text-muted-foreground"
          iconClassName="bg-muted"
          icon={<XCircle className="w-6 h-6 text-muted-foreground" />}
        />
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <SearchInput
          placeholder="Buscar regras..."
          value={searchTerm}
          onChange={setSearchTerm}
        />
        <FilterSelect value={typeFilter} onValueChange={setTypeFilter} options={typeOptions} />
        <FilterSelect value={statusFilter} onValueChange={setStatusFilter} options={statusOptions} />
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
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell className="font-medium">{rule.name}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {rule.condition}
                  </TableCell>
                  <TableCell>{rule.category}</TableCell>
                  <TableCell>{getTypeBadge(rule.type)}</TableCell>
                  <TableCell>
                    <Switch
                      checked={rule.isActive}
                      onCheckedChange={() => handleToggleStatus(rule.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <ActionDropdown
                      onView={() => handleView(rule)}
                      onEdit={() => handleEdit(rule)}
                      onDelete={() => handleDelete(rule.id)}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Create Rule Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Nova Regra</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nome da Regra</label>
              <Input placeholder="Ex: Combustível" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Condição</label>
              <Input placeholder="Ex: Descrição contém 'posto'" />
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
              <label className="text-sm font-medium">Categoria</label>
              <Input placeholder="Ex: Transporte" />
            </div>
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowCreateModal(false)}>
                Cancelar
              </Button>
              <Button onClick={() => setShowCreateModal(false)}>
                Criar Regra
              </Button>
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
                  <p className="text-sm text-muted-foreground">Tipo</p>
                  {getTypeBadge(selectedRule.type)}
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-muted-foreground">Condição</p>
                  <p className="font-medium">{selectedRule.condition}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Categoria</p>
                  <p className="font-medium">{selectedRule.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">{selectedRule.isActive ? "Ativa" : "Inativa"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Criada em</p>
                  <p className="font-medium">
                    {new Date(selectedRule.createdAt).toLocaleDateString("pt-BR")}
                  </p>
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
                <Input defaultValue={selectedRule.name} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Condição</label>
                <Input defaultValue={selectedRule.condition} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Tipo</label>
                <Select defaultValue={selectedRule.type}>
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
                <Input defaultValue={selectedRule.category} />
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
