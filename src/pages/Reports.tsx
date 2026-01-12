import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { AnalyticsTab } from "@/components/reports/AnalyticsTab";
import { ReportPreviewModal } from "@/components/reports/ReportPreviewModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  FileSpreadsheet,
  DollarSign,
  Users,
  Calendar,
  FileText,
  Receipt,
  UserPlus,
  Wallet,
  ChevronDown,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";
import {
  customers,
  invoices,
  schedule,
} from "@/data/systemData";
import { useTeamStore } from "@/stores/team.store";

// Mock transactions data (same as Transactions page)
const transactionsData = [
  { id: "1", name: "Serviço de Limpeza Residencial", date: "2024-01-15", category: "Receita de Serviços", status: "conciliado", amount: 250.00, type: "receita" },
  { id: "2", name: "Compra de Produtos de Limpeza", date: "2024-01-14", category: "Materiais", status: "pendente", amount: -85.50, type: "despesa" },
  { id: "3", name: "Serviço de Limpeza Comercial", date: "2024-01-13", category: "Receita de Serviços", status: "conciliado", amount: 450.00, type: "receita" },
  { id: "4", name: "Combustível - Frota", date: "2024-01-12", category: "Transporte", status: "conciliado", amount: -120.00, type: "despesa" },
  { id: "5", name: "Pagamento de Funcionário", date: "2024-01-11", category: "Folha de Pagamento", status: "pendente", amount: -1500.00, type: "despesa" },
  { id: "6", name: "Limpeza Pós-Obra", date: "2024-01-10", category: "Receita de Serviços", status: "conciliado", amount: 800.00, type: "receita" },
  { id: "7", name: "Manutenção de Equipamentos", date: "2024-01-09", category: "Manutenção", status: "conciliado", amount: -200.00, type: "despesa" },
  { id: "8", name: "Serviço de Limpeza de Vidros", date: "2024-01-08", category: "Receita de Serviços", status: "pendente", amount: 180.00, type: "receita" },
];

// Mock leads data
const leadsData = [
  { id: "EST-001", customer: "Sarah Johnson", email: "sarah@email.com", phone: "(555) 123-4567", service: "Deep Clean", amount: "$180.00", date: "2024-01-12", status: "approved", origin: "Website" },
  { id: "EST-002", customer: "Tech Startup Inc.", email: "contact@techstartup.com", phone: "(555) 987-6543", service: "Weekly Office Clean", amount: "$450.00", date: "2024-01-14", status: "pending", origin: "Referral" },
  { id: "EST-003", customer: "Miller Family", email: "miller@email.com", phone: "(555) 456-7890", service: "Move-out Clean", amount: "$280.00", date: "2024-01-08", status: "expired", origin: "Phone Call" },
  { id: "EST-004", customer: "Downtown Restaurant", email: "info@downtownrest.com", phone: "(555) 321-0987", service: "Commercial Clean", amount: "$320.00", date: "2024-01-13", status: "pending", origin: "Google Ads" },
  { id: "EST-005", customer: "Lisa Anderson", email: "lisa.a@email.com", phone: "(555) 654-3210", service: "Standard Cleaning", amount: "$120.00", date: "2024-01-15", status: "draft", origin: "Email" },
];

// Mock payroll data
const payrollData = [
  { id: "1", employee: "Maria Silva", role: "Cleaner", baseSalary: 2500.00, bonus: 150.00, total: 2650.00, status: "Pago", period: "Jan 2024" },
  { id: "2", employee: "John Doe", role: "Cleaner", baseSalary: 2500.00, bonus: 100.00, total: 2600.00, status: "Pago", period: "Jan 2024" },
  { id: "3", employee: "Ana Garcia", role: "Cleaner", baseSalary: 2500.00, bonus: 200.00, total: 2700.00, status: "Pendente", period: "Jan 2024" },
  { id: "4", employee: "Carlos Santos", role: "Cleaner", baseSalary: 2500.00, bonus: 0.00, total: 2500.00, status: "Pago", period: "Jan 2024" },
];

interface ReportData {
  id: string;
  name: string;
  description: string;
  type: string;
  records: number;
  icon: LucideIcon;
  iconColor: string;
  iconBg: string;
}

export function Reports() {
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const teamMembers = useTeamStore((state) => state.members);

  const handleExportReport = (report: ReportData) => {
    let data: Record<string, unknown>[] = [];
    let fileName = "";

    switch (report.id) {
      case "schedule":
        data = schedule.map((s) => ({
          "ID": s.id,
          "Hora": s.time,
          "Cliente": s.customer,
          "Endereço": s.address,
          "Serviço": s.service,
          "Funcionário": s.staff,
          "Status": s.status,
          "Duração": s.duration,
        }));
        fileName = "agendamentos";
        break;

      case "customers":
        data = customers.map((c) => ({
          "ID": c.id,
          "Nome": c.name,
          "Email": c.email,
          "Telefone": c.phone,
          "Telefone 2": c.phone2,
          "Endereço": c.address,
          "Status": c.status,
          "Último Serviço": c.lastService,
          "Total Jobs": c.totalJobs,
          "Receita": c.revenue,
          "Avaliação": c.rating,
          "Frequência": c.frequency,
          "Dia Preferido": c.preferredDay,
          "Método Pagamento": c.paymentMethod,
          "Cliente Desde": c.customerSince,
        }));
        fileName = "clientes";
        break;

      case "transactions":
        data = transactionsData.map((t) => ({
          "ID": t.id,
          "Nome": t.name,
          "Data": t.date,
          "Categoria": t.category,
          "Status": t.status,
          "Valor": t.amount,
          "Tipo": t.type,
        }));
        fileName = "transacoes";
        break;

      case "invoices":
        data = invoices.map((inv) => ({
          "ID": inv.id,
          "Cliente": inv.customer,
          "Valor": inv.amount,
          "Data": inv.date,
          "Vencimento": inv.dueDate,
          "Status": inv.status,
          "Job ID": inv.jobId,
        }));
        fileName = "faturas";
        break;

      case "leads":
        data = leadsData.map((l) => ({
          "ID": l.id,
          "Cliente": l.customer,
          "Email": l.email,
          "Telefone": l.phone,
          "Serviço": l.service,
          "Valor": l.amount,
          "Data": l.date,
          "Status": l.status,
          "Origem": l.origin,
        }));
        fileName = "leads";
        break;

      case "payroll":
        data = payrollData.map((p) => ({
          "ID": p.id,
          "Funcionário": p.employee,
          "Cargo": p.role,
          "Salário Base": `$${p.baseSalary.toFixed(2)}`,
          "Bônus": `$${p.bonus.toFixed(2)}`,
          "Total": `$${p.total.toFixed(2)}`,
          "Status": p.status,
          "Período": p.period,
        }));
        fileName = "folha_pagamento";
        break;

      case "team":
        data = teamMembers.map((m) => ({
          "ID": m.id,
          "Nome": m.name,
          "Email": m.email,
          "Telefone": m.phone || "N/A",
          "Cargo": m.role_name,
          "Status": m.status,
          "Entrou em": m.joined_at ? new Date(m.joined_at).toLocaleDateString() : "Pendente",
          "Última Atividade": m.last_active_at ? new Date(m.last_active_at).toLocaleDateString() : "N/A",
        }));
        fileName = "equipe";
        break;

      default:
        toast.error("Relatório não encontrado");
        return;
    }

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, report.name.substring(0, 31));

    // Generate file and download
    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `${fileName}_${dateStr}.xlsx`);
    
    toast.success(`${report.name} exportado com sucesso!`);
  };

  // Calculate real data from system
  const reportsData = useMemo(() => {
    const totalReceita = transactionsData.filter(t => t.type === "receita").reduce((sum, t) => sum + t.amount, 0);
    const totalDespesas = Math.abs(transactionsData.filter(t => t.type === "despesa").reduce((sum, t) => sum + t.amount, 0));

    return [
      {
        id: "schedule",
        name: "Agendamentos",
        description: `${schedule.filter((s) => s.status === "scheduled").length} agendados, ${schedule.filter((s) => s.status === "in-progress").length} em progresso, ${schedule.filter((s) => s.status === "completed").length} concluídos`,
        type: "Agenda",
        records: schedule.length,
        icon: Calendar,
        iconColor: "text-orange-500",
        iconBg: "bg-orange-500/10",
      },
      {
        id: "customers",
        name: "Clientes",
        description: `${customers.filter((c) => c.status === "Active").length} ativos, ${customers.filter((c) => c.status === "Inactive").length} inativos`,
        type: "Clientes",
        records: customers.length,
        icon: Users,
        iconColor: "text-blue-500",
        iconBg: "bg-blue-500/10",
      },
      {
        id: "transactions",
        name: "Transações",
        description: `Receita: $${totalReceita.toFixed(2)} | Despesas: $${totalDespesas.toFixed(2)}`,
        type: "Financeiro",
        records: transactionsData.length,
        icon: Wallet,
        iconColor: "text-green-500",
        iconBg: "bg-green-500/10",
      },
      {
        id: "invoices",
        name: "Faturas",
        description: `${invoices.filter((i) => i.status === "paid").length} pagas, ${invoices.filter((i) => i.status === "sent" || i.status === "payment_pending").length} pendentes, ${invoices.filter((i) => i.status === "overdue").length} vencidas`,
        type: "Faturamento",
        records: invoices.length,
        icon: Receipt,
        iconColor: "text-purple-500",
        iconBg: "bg-purple-500/10",
      },
      {
        id: "leads",
        name: "Leads",
        description: `${leadsData.filter((l) => l.status === "approved").length} aprovados, ${leadsData.filter((l) => l.status === "pending").length} pendentes, ${leadsData.filter((l) => l.status === "expired").length} expirados`,
        type: "Vendas",
        records: leadsData.length,
        icon: FileText,
        iconColor: "text-cyan-500",
        iconBg: "bg-cyan-500/10",
      },
      {
        id: "payroll",
        name: "Folha de Pagamento",
        description: `${payrollData.filter((p) => p.status === "Pago").length} pagos, ${payrollData.filter((p) => p.status === "Pendente").length} pendentes | Total: $${payrollData.reduce((sum, p) => sum + p.total, 0).toFixed(2)}`,
        type: "Payroll",
        records: payrollData.length,
        icon: DollarSign,
        iconColor: "text-yellow-500",
        iconBg: "bg-yellow-500/10",
      },
      {
        id: "team",
        name: "Membros da Equipe",
        description: `${teamMembers.filter((m) => m.status === "active").length} ativos, ${teamMembers.filter((m) => m.status === "invited").length} convidados, ${teamMembers.filter((m) => m.status === "suspended").length} suspensos`,
        type: "Equipe",
        records: teamMembers.length,
        icon: UserPlus,
        iconColor: "text-indigo-500",
        iconBg: "bg-indigo-500/10",
      },
    ];
  }, [teamMembers]);

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
                Exporte relatórios com dados reais do sistema
              </p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90">
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar Excel
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background">
                {reportsData
                  .filter((report) => report.records > 0)
                  .map((report) => (
                    <DropdownMenuItem
                      key={report.id}
                      onClick={() => handleExportReport(report)}
                      className="cursor-pointer"
                    >
                      <report.icon className={`w-4 h-4 mr-2 ${report.iconColor}`} />
                      {report.name}
                    </DropdownMenuItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Analytics Content */}
          <AnalyticsTab />

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