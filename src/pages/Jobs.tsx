import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useLanguage } from "@/contexts/LanguageContext";
import { Search, Briefcase, Calendar, DollarSign, Clock, MoreHorizontal, Eye } from "lucide-react";
import { JobDetailsModal } from "@/components/jobs/JobDetailsModal";

const initialJobsData = [{
  id: "JOB-001",
  customer: "Sarah Johnson",
  service: "Deep Clean",
  date: "2024-01-15",
  time: "09:00 AM",
  staff1: "Maria Silva",
  staff2: "Ana Garcia",
  status: "completed",
  duration: "3h",
  amount: "$180",
  address: "123 Oak Street",
  notes: "Customer prefers eco-friendly products. Ring doorbell twice.",
  additionalNotes: ["Has 2 dogs - please close gates", "Alarm code: 1234"]
}, {
  id: "JOB-002",
  customer: "Tech Startup Inc.",
  service: "Regular Clean",
  date: "2024-01-15",
  time: "01:00 PM",
  staff1: "John Doe",
  staff2: "",
  status: "in-progress",
  duration: "2h",
  amount: "$120",
  address: "456 Business Park",
  notes: "Office cleaning after hours. Security will let you in.",
  additionalNotes: ["Need badge access - call security at front desk"]
}, {
  id: "JOB-003",
  customer: "Miller Family",
  service: "Move-out Clean",
  date: "2024-01-16",
  time: "10:00 AM",
  staff1: "Ana Garcia",
  staff2: "Carlos Santos",
  status: "scheduled",
  duration: "4h",
  amount: "$280",
  address: "789 Maple Avenue",
  notes: "Full deep clean for move-out inspection. Pay extra attention to kitchen and bathrooms.",
  additionalNotes: ["Keys under the mat", "Parking in garage only"]
}];

export function Jobs() {
  const { t } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [jobsData] = useState(initialJobsData);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<typeof initialJobsData[0] | null>(null);

  const handleViewDetails = (job: typeof initialJobsData[0]) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "default";
      case "in-progress":
        return "secondary";
      case "scheduled":
        return "outline";
      case "cancelled":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("jobs.title")}</h1>
              <p className="text-muted-foreground">
                {t("jobs.subtitle")}
              </p>
            </div>
          </div>

          {/* Job Details Modal */}
          <JobDetailsModal 
            open={isDetailsModalOpen} 
            onOpenChange={setIsDetailsModalOpen} 
            job={selectedJob} 
          />

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("jobs.totalJobs")}</p>
                    <p className="text-2xl font-bold text-foreground">342</p>
                    <p className="text-sm text-success">+12 {t("jobs.thisWeek")}</p>
                  </div>
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Briefcase className="w-6 h-6 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("jobs.completed")}</p>
                    <p className="text-2xl font-bold text-foreground">298</p>
                    <p className="text-sm text-success">87.1% {t("jobs.completionRate")}</p>
                  </div>
                  <div className="p-3 bg-success/10 rounded-lg">
                    <Calendar className="w-6 h-6 text-success" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{t("jobs.inProgress")}</p>
                    <p className="text-2xl font-bold text-foreground">28</p>
                    <p className="text-sm text-warning">{t("jobs.activeNow")}</p>
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
                    <p className="text-sm font-medium text-muted-foreground">{t("jobs.cancelled")}</p>
                    <p className="text-2xl font-bold text-foreground">16</p>
                    <p className="text-sm text-destructive">{t("jobs.thisMonth")}</p>
                  </div>
                  <div className="p-3 bg-destructive/10 rounded-lg">
                    <Briefcase className="w-6 h-6 text-destructive" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Jobs Table */}
          <Card>
            <CardHeader>
              <CardTitle>{t("jobs.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input 
                    placeholder={`${t("common.search")} by customer, service, staff or address...`}
                    value={searchTerm} 
                    onChange={e => setSearchTerm(e.target.value)} 
                    className="pl-10 bg-background border-border" 
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[180px] bg-background border-border">
                    <SelectValue placeholder={t("common.status")} />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="all">{t("common.all")}</SelectItem>
                    <SelectItem value="completed">{t("jobs.completed")}</SelectItem>
                    <SelectItem value="in-progress">{t("jobs.inProgress")}</SelectItem>
                    <SelectItem value="scheduled">{t("jobs.scheduled")}</SelectItem>
                    <SelectItem value="cancelled">{t("jobs.cancelled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("jobs.jobId")}</TableHead>
                    <TableHead>{t("jobs.customer")}</TableHead>
                    <TableHead>{t("jobs.service")}</TableHead>
                    <TableHead>{t("jobs.dateTime")}</TableHead>
                    <TableHead>{t("jobs.staff")}</TableHead>
                    <TableHead>{t("common.status")}</TableHead>
                    <TableHead>{t("jobs.duration")}</TableHead>
                    <TableHead>{t("jobs.amount")}</TableHead>
                    <TableHead>{t("common.actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobsData
                    .filter(job => {
                      const matchesSearch = searchTerm === "" || 
                        job.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.staff1.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.staff2.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        job.address.toLowerCase().includes(searchTerm.toLowerCase());
                      const matchesStatus = statusFilter === "all" || job.status === statusFilter;
                      return matchesSearch && matchesStatus;
                    })
                    .map(job => (
                    <TableRow key={job.id}>
                      <TableCell className="font-mono">{job.id}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{job.customer}</div>
                          <div className="text-sm text-muted-foreground">{job.address}</div>
                        </div>
                      </TableCell>
                      <TableCell>{job.service}</TableCell>
                      <TableCell>
                        <div>
                          <div>{job.date}</div>
                          <div className="text-sm text-muted-foreground">{job.time}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div>{job.staff1}</div>
                          {job.staff2 && <div className="text-sm text-muted-foreground">{job.staff2}</div>}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(job.status)}>
                          {job.status.replace('-', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{job.duration}</TableCell>
                      <TableCell className="font-medium">{job.amount}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover border-border">
                            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => handleViewDetails(job)}>
                              <Eye className="w-4 h-4" />
                              {t("common.viewDetails")}
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
    </div>
  );
}
