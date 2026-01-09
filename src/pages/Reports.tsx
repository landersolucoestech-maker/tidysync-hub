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
  Disc,
  FileText,
  Package,
  MessageSquare,
  ChevronDown,
} from "lucide-react";
import { LucideIcon } from "lucide-react";
import * as XLSX from "xlsx";
import { toast } from "sonner";

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
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const handleExportReport = (report: ReportData) => {
    let data: Record<string, unknown>[] = [];
    let fileName = "";

    switch (report.id) {
      case 1: // Relatório Financeiro
        data = invoices.map((inv) => ({
          "ID": inv.id,
          "Cliente": inv.customer,
          "Valor": inv.amount,
          "Data": inv.date,
          "Vencimento": inv.dueDate,
          "Status": inv.status,
          "Job ID": inv.jobId,
        }));
        fileName = "relatorio_financeiro";
        break;
      case 2: // Clientes
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
      case 3: // Jobs
        data = jobs.map((j) => ({
          "ID": j.id,
          "Cliente": j.customer,
          "Serviço": j.service,
          "Data": j.date,
          "Hora": j.time,
          "Funcionário 1": j.staff1,
          "Funcionário 2": j.staff2,
          "Status": j.status,
          "Duração": j.duration,
          "Valor": j.amount,
          "Endereço": j.address,
        }));
        fileName = "jobs";
        break;
      case 4: // Agendamentos
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
      case 5: // Orçamentos
        data = estimates.map((e) => ({
          "ID": e.id,
          "Cliente": e.customer,
          "Serviço": e.service,
          "Valor": e.amount,
          "Data": e.date,
          "Validade": e.expiryDate,
          "Status": e.status,
          "Endereço": e.address,
        }));
        fileName = "orcamentos";
        break;
      case 6: // Payroll
        data = staff
          .filter((s) => s.role === "Cleaner")
          .map((s) => ({
            "ID": s.id,
            "Nome": s.name,
            "Cargo": s.role,
            "Status": s.status,
          }));
        fileName = "payroll";
        break;
      case 7: // Equipe
        data = staff.map((s) => ({
          "ID": s.id,
          "Nome": s.name,
          "Cargo": s.role,
          "Status": s.status,
        }));
        fileName = "equipe";
        break;
      case 8: // Comunicações
        data = [{ "Mensagem": "Nenhum dado de comunicação disponível" }];
        fileName = "comunicacoes";
        break;
      case 9: // Reservas Online
        data = schedule
          .filter((s) => s.status === "scheduled")
          .map((s) => ({
            "ID": s.id,
            "Hora": s.time,
            "Cliente": s.customer,
            "Endereço": s.address,
            "Serviço": s.service,
            "Funcionário": s.staff,
            "Status": s.status,
            "Duração": s.duration,
          }));
        fileName = "reservas_online";
        break;
      default:
        toast.error("Relatório não encontrado");
        return;
    }

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, report.name.substring(0, 31)); // Max 31 chars for sheet name

    // Generate file and download
    const dateStr = new Date().toISOString().split("T")[0];
    XLSX.writeFile(wb, `${fileName}_${dateStr}.xlsx`);
    
    toast.success(`${report.name} exportado com sucesso!`);
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
                  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  Exportar Excel
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-background">
                {reportsData.map((report) => (
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
