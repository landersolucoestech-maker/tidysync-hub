import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Search,
  Filter,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Calendar,
  Pencil,
  MoreHorizontal,
} from "lucide-react";
import { CreateEstimateModal } from "@/components/estimates/CreateEstimateModal";
import { EditEstimateModal } from "@/components/estimates/EditEstimateModal";
import { EstimateDetailsModal, Interaction } from "@/components/estimates/EstimateDetailsModal";
import { AppointmentModal } from "@/components/schedule/AppointmentModal";
import { InvoiceModal } from "@/components/schedule/InvoiceModal";
import { toast } from "sonner";

interface AddressData {
  id: string;
  addressName: string;
  address: string;
  preferenceDays: string;
  preferenceTime: string;
  frequency: string;
  serviceType: string;
  firstCleaningAmount: string;
  regularAmount: string;
  notes: string;
  additionalNotes: string;
}

interface Estimate {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  phoneNumber2?: string;
  service: string;
  amount: string;
  date: string;
  expiryDate: string;
  status: string;
  address: string;
  validUntil: string;
  origin?: string;
  hasJob?: boolean;
  interactions?: Interaction[];
  addresses?: AddressData[];
}

const initialEstimatesData: Estimate[] = [
  {
    id: "EST-001",
    customer: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "(555) 123-4567",
    service: "Deep Clean",
    amount: "$180.00",
    date: "2024-01-12",
    expiryDate: "2024-02-12",
    status: "approved",
    address: "123 Oak Street",
    validUntil: "30 days",
    origin: "Website"
  },
  {
    id: "EST-002",
    customer: "Tech Startup Inc.",
    email: "contact@techstartup.com",
    phone: "(555) 987-6543",
    service: "Weekly Office Clean",
    amount: "$450.00",
    date: "2024-01-14",
    expiryDate: "2024-02-14",
    status: "pending",
    address: "456 Business Park",
    validUntil: "28 days",
    origin: "Referral"
  },
  {
    id: "EST-003",
    customer: "Miller Family",
    email: "miller@email.com",
    phone: "(555) 456-7890",
    service: "Move-out Clean",
    amount: "$280.00",
    date: "2024-01-08",
    expiryDate: "2024-01-08",
    status: "expired",
    address: "789 Maple Avenue",
    validUntil: "Expired",
    origin: "Phone Call"
  },
  {
    id: "EST-004",
    customer: "Downtown Restaurant",
    email: "info@downtownrest.com",
    phone: "(555) 321-0987",
    service: "Commercial Clean",
    amount: "$320.00",
    date: "2024-01-13",
    expiryDate: "2024-02-13",
    status: "pending",
    address: "321 Main Street",
    validUntil: "29 days",
    origin: "Google Ads"
  },
  {
    id: "EST-005",
    customer: "Lisa Anderson",
    email: "lisa.a@email.com",
    phone: "(555) 654-3210",
    service: "Standard Cleaning",
    amount: "$120.00",
    date: "2024-01-15",
    expiryDate: "2024-02-15",
    status: "draft",
    address: "555 Pine Road",
    validUntil: "30 days",
    origin: "Email"
  }
];

export function Leads() {
  const [searchTerm, setSearchTerm] = useState("");
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedEstimate, setSelectedEstimate] = useState<Estimate | null>(null);
  const [estimates, setEstimates] = useState<Estimate[]>(initialEstimatesData);
  const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
  const [estimateForAppointment, setEstimateForAppointment] = useState<Estimate | null>(null);
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [invoiceData, setInvoiceData] = useState<{ customer: string; address: string; service: string; amount: number } | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [estimateToEdit, setEstimateToEdit] = useState<Estimate | null>(null);
  const [serviceFilter, setServiceFilter] = useState("all");
  const [originFilter, setOriginFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Extrair opções únicas dos dados
  const serviceOptions = [...new Set(estimates.map(e => e.service))];
  const originOptions = [...new Set([...estimates.map(e => e.origin).filter(Boolean), "Influencer"])];
  const statusOptions = [...new Set(estimates.map(e => e.status))];

  const handleEditEstimate = (estimate: Estimate) => {
    setEstimateToEdit(estimate);
    setEditModalOpen(true);
  };

  const handleSaveEstimate = (updatedEstimate: Estimate) => {
    setEstimates(prev => 
      prev.map(est => 
        est.id === updatedEstimate.id ? updatedEstimate : est
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "expired": return "destructive";
      case "draft": return "outline";
      case "rejected": return "destructive";
      case "cancelled": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      case "cancelled": return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getOriginBadge = (origin: string) => {
    const colors: Record<string, string> = {
      "Google": "bg-primary/10 text-primary",
      "Phone Call": "bg-success/10 text-success",
      "Instagram": "bg-rose/10 text-rose",
      "Facebook": "bg-primary/10 text-primary",
      "Referral": "bg-warning/10 text-warning",
      "Nextdoor": "bg-secondary/10 text-secondary",
      "Website": "bg-primary/10 text-primary",
      "Google Ads": "bg-primary/10 text-primary",
      "Email": "bg-muted text-muted-foreground",
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[origin] || "bg-muted text-muted-foreground"}`}>
        {origin || "N/A"}
      </span>
    );
  };

  const handleViewDetails = (estimate: Estimate) => {
    setSelectedEstimate(estimate);
    setDetailsModalOpen(true);
  };

  const handleApprove = (id: string) => {
    setEstimates(prev => 
      prev.map(est => 
        est.id === id ? { ...est, status: "approved" } : est
      )
    );
    toast.success("Estimate approved! You can now create a job.");
  };

  const handleCreateJob = (estimate: Estimate) => {
    setEstimateForAppointment(estimate);
    setDetailsModalOpen(false);
    setAppointmentModalOpen(true);
  };

  const handleJobCreated = (data: { customer: string; address: string; service: string; amount: number }) => {
    if (estimateForAppointment) {
      const isFirstJob = !estimateForAppointment.hasJob;
      
      setEstimates(prev => 
        prev.map(est => 
          est.id === estimateForAppointment.id ? { ...est, hasJob: true } : est
        )
      );
      
      // Only show invoice modal for 50% deposit on first job
      if (isFirstJob) {
        const depositAmount = data.amount * 0.5;
        setInvoiceData({
          customer: data.customer,
          address: data.address,
          service: data.service,
          amount: depositAmount,
        });
        setInvoiceModalOpen(true);
      } else {
        toast.success("Job created successfully!");
      }
      
      setEstimateForAppointment(null);
    }
  };

  const handleReject = (id: string) => {
    setEstimates(prev => 
      prev.map(est => 
        est.id === id ? { ...est, status: "rejected" } : est
      )
    );
    toast.info("Estimate rejected.");
  };

  // Remove old quick approve/reject handlers - now handled inline

  const filteredEstimates = estimates.filter(est => {
    const matchesSearch = 
      est.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      est.service.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesService = serviceFilter === "all" || est.service === serviceFilter;
    const matchesOrigin = originFilter === "all" || est.origin === originFilter;
    const matchesStatus = statusFilter === "all" || est.status === statusFilter;
    
    return matchesSearch && matchesService && matchesOrigin && matchesStatus;
  });

  const stats = {
    total: estimates.length,
    approved: estimates.filter(e => e.status === "approved").length,
    pending: estimates.filter(e => e.status === "pending" || e.status === "draft").length,
    rejected: estimates.filter(e => e.status === "rejected").length,
  };

  const approvalRate = stats.total > 0 
    ? ((stats.approved / stats.total) * 100).toFixed(1) 
    : "0.0";

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Leads</h1>
              <p className="text-muted-foreground">
                Gerencie leads e orçamentos de clientes em potencial
              </p>
            </div>
            <Button 
              variant="hero" 
              size="lg" 
              className="flex items-center space-x-2"
              onClick={() => setCreateModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Novo Lead</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Total de Leads</p>
                    <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                    <p className="text-sm text-success">All time</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <FileText className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Aprovados</p>
                    <p className="text-2xl font-bold text-foreground">{stats.approved}</p>
                    <p className="text-sm text-success">{approvalRate}% taxa de aprovação</p>
                  </div>
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Pendentes</p>
                    <p className="text-2xl font-bold text-foreground">{stats.pending}</p>
                    <p className="text-sm text-warning">Aguardando resposta</p>
                  </div>
                  <div className="p-3 bg-warning/10 rounded-lg">
                    <Clock className="w-6 h-6 text-warning" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Rejeitados</p>
                    <p className="text-2xl font-bold text-foreground">{stats.rejected}</p>
                    <p className="text-sm text-destructive">Não aprovados</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <XCircle className="w-6 h-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Estimates Table */}
          <Card>
            <CardHeader>
              <CardTitle>Todos os Leads</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="relative flex-1 min-w-[200px] max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar leads..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={serviceFilter} onValueChange={setServiceFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Serviço" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="all">Todos os Serviços</SelectItem>
                    {serviceOptions.map(service => (
                      <SelectItem key={service} value={service}>{service}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={originFilter} onValueChange={setOriginFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Origem" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="all">Todas as Origens</SelectItem>
                    {originOptions.map(origin => (
                      <SelectItem key={origin} value={origin as string}>{origin}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    <SelectItem value="all">Todos os Status</SelectItem>
                    {statusOptions.map(status => (
                      <SelectItem key={status} value={status}>
                        <span className="capitalize">{status}</span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID do Lead</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Data de Criação</TableHead>
                    <TableHead>Válido Até</TableHead>
                    <TableHead>Origem</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredEstimates.map((estimate) => (
                    <TableRow key={estimate.id}>
                      <TableCell className="font-mono">{estimate.id}</TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium">{estimate.customer}</div>
                          <div className="text-sm text-muted-foreground">{estimate.address}</div>
                          {estimate.email && (
                            <div className="text-xs text-muted-foreground">{estimate.email}</div>
                          )}
                          {estimate.phone && (
                            <div className="text-xs text-muted-foreground">{estimate.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{estimate.service}</TableCell>
                      <TableCell className="font-semibold">{estimate.amount}</TableCell>
                      <TableCell>{estimate.date}</TableCell>
                      <TableCell>{estimate.expiryDate}</TableCell>
                      <TableCell>{getOriginBadge(estimate.origin || "")}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(estimate.status)} className="flex items-center gap-1 w-fit">
                          {getStatusIcon(estimate.status)}
                          <span className="capitalize">{estimate.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleViewDetails(estimate)}
                            >
                              <Eye className="w-4 h-4" />
                              Ver
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="flex items-center gap-2 cursor-pointer"
                              onClick={() => handleEditEstimate(estimate)}
                            >
                              <Pencil className="w-4 h-4" />
                              Editar
                            </DropdownMenuItem>
                            {(estimate.status === "pending" || estimate.status === "draft") && (
                              <>
                                <DropdownMenuItem 
                                  className="flex items-center gap-2 cursor-pointer text-green-600"
                                  onClick={() => handleApprove(estimate.id)}
                                >
                                  <CheckCircle className="w-4 h-4" />
                                  Aprovar
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="flex items-center gap-2 cursor-pointer text-destructive"
                                  onClick={() => handleReject(estimate.id)}
                                >
                                  <XCircle className="w-4 h-4" />
                                  Rejeitar
                                </DropdownMenuItem>
                              </>
                            )}
                            {estimate.status === "approved" && (
                              <DropdownMenuItem 
                                className="flex items-center gap-2 cursor-pointer"
                                onClick={() => handleCreateJob(estimate)}
                              >
                                <Calendar className="w-4 h-4" />
                                {estimate.hasJob ? "Novo Job" : "Criar Job"}
                              </DropdownMenuItem>
                            )}
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

      <CreateEstimateModal 
        open={createModalOpen} 
        onOpenChange={setCreateModalOpen} 
      />

      <EstimateDetailsModal
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
        estimate={selectedEstimate}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AppointmentModal
        open={appointmentModalOpen}
        onOpenChange={setAppointmentModalOpen}
        mode="create"
        prefilledData={estimateForAppointment ? {
          customer: estimateForAppointment.customer,
          address: estimateForAppointment.address,
          service: estimateForAppointment.service,
          amount: estimateForAppointment.amount.replace(/[^0-9.]/g, ''),
        } : undefined}
        onJobCreated={handleJobCreated}
      />

      <InvoiceModal
        open={invoiceModalOpen}
        onOpenChange={setInvoiceModalOpen}
        appointment={invoiceData ? {
          customer: invoiceData.customer,
          address: invoiceData.address,
          service: invoiceData.service,
          time: new Date().toLocaleTimeString(),
        } : null}
        depositAmount={invoiceData?.amount}
        isDepositInvoice={true}
      />

      <EditEstimateModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        estimate={estimateToEdit}
        onSave={handleSaveEstimate}
      />
    </div>
  );
}
