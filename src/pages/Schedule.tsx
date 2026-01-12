import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { AppointmentModal } from "@/components/schedule/AppointmentModal";
import { FilterModal } from "@/components/schedule/FilterModal";
import { EditJobModal } from "@/components/jobs/EditJobModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";
import { schedule } from "@/data/systemData";

export function Schedule() {
  const { t } = useLanguage();
  
  const [appointmentModal, setAppointmentModal] = useState<{
    open: boolean;
    mode: "create" | "view" | "edit";
    appointment: typeof schedule[0] | null;
  }>({
    open: false,
    mode: "create",
    appointment: null
  });
  const [filterModal, setFilterModal] = useState(false);
  const [editJobModal, setEditJobModal] = useState<{
    open: boolean;
    job: {
      id: string;
      customer: string;
      service: string;
      date: string;
      time: string;
      staff1: string;
      staff2: string;
      status: string;
      duration: string;
      amount: string;
      address: string;
      notes?: string;
    } | null;
  }>({
    open: false,
    job: null
  });
  const [appointments, setAppointments] = useState(schedule);

  const handleNewAppointment = () => {
    setAppointmentModal({
      open: true,
      mode: "create",
      appointment: null
    });
  };

  const handleViewAppointment = (appointment: typeof schedule[0]) => {
    setAppointmentModal({
      open: true,
      mode: "view",
      appointment
    });
  };

  const handleEditJob = (appointment: typeof schedule[0]) => {
    setEditJobModal({
      open: true,
      job: {
        id: appointment.id.toString(),
        customer: appointment.customer,
        service: appointment.service,
        date: new Date().toISOString().split("T")[0],
        time: appointment.time,
        staff1: appointment.staff,
        staff2: "",
        status: appointment.status,
        duration: appointment.duration,
        amount: "",
        address: appointment.address,
        notes: ""
      }
    });
  };

  const handleSaveJob = (job: typeof editJobModal.job) => {
    if (!job) return;
    setAppointments(prev => prev.map(apt => 
      apt.id.toString() === job.id 
        ? { ...apt, customer: job.customer, service: job.service, time: job.time, staff: job.staff1, status: job.status, duration: job.duration, address: job.address }
        : apt
    ));
  };

  const handleDeleteJob = (jobId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id.toString() !== jobId));
  };

  const handleApplyFilters = (filters: {
    staff: string[];
    services: string[];
    statuses: string[];
  }) => {
    toast.success(t("payroll.filterApplied"));
    console.log("Applied filters:", filters);
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
              <h1 className="text-3xl font-bold text-foreground">{t("schedule.title")}</h1>
              <p className="text-muted-foreground">
                {t("schedule.subtitle")}
              </p>
            </div>
            <Button variant="hero" size="lg" className="flex items-center space-x-2" onClick={handleNewAppointment}>
              <Plus className="w-4 h-4" />
              <span>Create Job</span>
            </Button>
          </div>

          {/* Calendar */}
          <Card>
            <CardContent className="p-0">
              <CalendarGrid appointments={appointments} onAppointmentClick={handleViewAppointment} onEditClick={handleEditJob} />
            </CardContent>
          </Card>
        </main>
      </div>

      {/* Modals */}
      <AppointmentModal 
        open={appointmentModal.open} 
        onOpenChange={open => setAppointmentModal(prev => ({
          ...prev,
          open
        }))} 
        appointment={appointmentModal.appointment} 
        mode={appointmentModal.mode}
        onRequestEdit={(apt) => {
          setAppointmentModal((prev) => ({ ...prev, open: false }));
          handleEditJob(apt);
        }}
      />

      <FilterModal 
        open={filterModal} 
        onOpenChange={setFilterModal} 
        onApplyFilters={handleApplyFilters} 
      />

      <EditJobModal
        open={editJobModal.open}
        onOpenChange={(open) => setEditJobModal(prev => ({ ...prev, open }))}
        job={editJobModal.job}
        onSave={handleSaveJob}
        onDelete={handleDeleteJob}
      />
    </div>
  );
}
