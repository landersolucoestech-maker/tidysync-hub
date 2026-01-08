import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AnalyticsTab } from "@/components/reports/AnalyticsTab";
import { ReportPreviewModal } from "@/components/reports/ReportPreviewModal";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Download,
  Eye,
  Printer,
  DollarSign,
  Users,
  Disc,
  FileText,
  Package,
  MessageSquare,
  BarChart3,
  Sparkles,
  ClipboardList,
  ChevronDown,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface ReportData {
  id: number;
  name: string;
  description: string;
  type: string;
  records: number;
  status: string;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}
import {
  customers,
  jobs,
  invoices,
  estimates,
  schedule,
  staff,
  calculateTotalRevenue,
} from "@/data/systemData";

export function Reports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [activeTab, setActiveTab] = useState("relatorios");
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleViewReport = (report: ReportData) => {
    setSelectedReport(report);
    setIsPreviewOpen(true);
  };

  const handlePrintReport = (report: ReportData) => {
    console.log("Printing report:", report.name);
    window.print();
  };

  // Calculate real data from system
  const reportsData = useMemo(() => {
    const totalRevenue = calculateTotalRevenue();
    const paidInvoices = invoices.filter(
      (inv) => inv.status === "paid" || inv.status === "complete"
    ).length;

    return [
      {
        id: 1,
        name: "Relatório Financeiro",
        description: `Faturamento total: $${totalRevenue.toFixed(2)} | ${paidInvoices} faturas pagas`,
        type: "Financeiro",
        records: invoices.length,
        status: "Disponível",
        icon: DollarSign,
        iconColor: "text-green-500",
        iconBg: "bg-green-500/10",
      },
      {
        id: 2,
        name: "Clientes Cadastrados",
        description: `${customers.filter((c) => c.status === "Active").length} ativos, ${customers.filter((c) => c.status === "Inactive").length} inativos`,
        type: "Clientes",
        records: customers.length,
        status: "Disponível",
        icon: Users,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
      },
      {
        id: 3,
        name: "Jobs Realizados",
        description: `${jobs.filter((j) => j.status === "completed").length} concluídos, ${jobs.filter((j) => j.status === "in-progress").length} em andamento, ${jobs.filter((j) => j.status === "scheduled").length} agendados`,
        type: "Jobs",
        records: jobs.length,
        status: "Disponível",
        icon: FileText,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-500/10",
      },
      {
        id: 4,
        name: "Agendamentos",
        description: `${schedule.filter((s) => s.status === "scheduled").length} agendados, ${schedule.filter((s) => s.status === "in-progress").length} em progresso, ${schedule.filter((s) => s.status === "completed").length} concluídos`,
        type: "Agenda",
        records: schedule.length,
        status: "Disponível",
        icon: Disc,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-500/10",
      },
      {
        id: 5,
        name: "Orçamentos Enviados",
        description: `${estimates.filter((e) => e.status === "approved").length} aprovados, ${estimates.filter((e) => e.status === "pending").length} pendentes, ${estimates.filter((e) => e.status === "expired" || e.status === "rejected").length} expirados/rejeitados`,
        type: "Orçamentos",
        records: estimates.length,
        status: "Disponível",
        icon: FileText,
        iconColor: "text-cyan-500",
        iconBg: "bg-cyan-500/10",
      },
      {
        id: 6,
        name: "Payroll",
        description: "Folha de pagamento e bonificações dos funcionários",
        type: "Payroll",
        records: staff.filter((s) => s.role === "Cleaner").length,
        status: "Disponível",
        icon: DollarSign,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-500/10",
      },
      {
        id: 7,
        name: "Equipe de Funcionários",
        description: `${staff.filter((s) => s.status === "Active").length} funcionários ativos no sistema`,
        type: "Usuários",
        records: staff.length,
        status: "Disponível",
        icon: Users,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-500/10",
      },
      {
        id: 8,
        name: "Comunicações",
        description: "Histórico de mensagens e notificações enviadas",
        type: "Comunicação",
        records: 0,
        status: "Disponível",
        icon: MessageSquare,
        iconColor: "text-pink-500",
        iconBg: "bg-pink-500/10",
      },
      {
        id: 9,
        name: "Reservas Online",
        description: "Bookings realizados via portal de agendamento",
        type: "Booking",
        records: schedule.filter((s) => s.status === "scheduled").length,
        status: "Disponível",
        icon: Package,
        iconColor: "text-teal-500",
        iconBg: "bg-teal-500/10",
      },
    ];
  }, []);

  const filteredReports = reportsData.filter((report) => {
    const matchesSearch =
      report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType =
      selectedType === "all" || report.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  const uniqueTypes = [...new Set(reportsData.map((r) => r.type))];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Relatórios</h1>
              <p className="text-muted-foreground">
                Gere relatórios com dados reais do sistema
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <Printer className="w-4 h-4 mr-2" />
                  Imprimir Relatório
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background">
                {reportsData.map((report) => (
                  <DropdownMenuItem
                    key={report.id}
                    onClick={() => handlePrintReport(report)}
                    className="cursor-pointer"
                  >
                    <report.icon className={`w-4 h-4 mr-2 ${report.iconColor}`} />
                    {report.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="relatorios" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="ia-insights" className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                IA & Insights
              </TabsTrigger>
              <TabsTrigger value="auditoria" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Auditoria
              </TabsTrigger>
            </TabsList>

            <TabsContent value="analytics" className="mt-6">
              <AnalyticsTab />
            </TabsContent>

            <TabsContent value="relatorios" className="mt-6 space-y-6">

          {/* Search and Filter */}
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar relatórios..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {uniqueTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Reports Title */}
          <div>
            <h2 className="text-xl font-semibold text-foreground">
              Relatórios Disponíveis ({filteredReports.length})
            </h2>
          </div>

          {/* Reports Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="w-[400px]">Relatório</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead className="text-center">Registros</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center ${report.iconBg}`}
                        >
                          <report.icon className={`w-5 h-5 ${report.iconColor}`} />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{report.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {report.description}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-normal">
                        {report.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className="bg-red-500 hover:bg-red-600 text-white rounded-full min-w-[40px]">
                        {report.records}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewReport(report)}>
                          <Eye className="w-4 h-4 mr-1" />
                          Ver
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredReports.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <p className="text-muted-foreground">
                        Nenhum relatório encontrado
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
            </TabsContent>
          </Tabs>

          {/* Report Preview Modal */}
          <ReportPreviewModal
            open={isPreviewOpen}
            onOpenChange={setIsPreviewOpen}
            report={selectedReport}
          />
        </main>
      </div>
    </div>
  );
}
