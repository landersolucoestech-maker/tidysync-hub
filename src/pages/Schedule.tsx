import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarGrid } from "@/components/calendar/CalendarGrid";
import { AppointmentModal } from "@/components/schedule/AppointmentModal";
import { FilterModal } from "@/components/schedule/FilterModal";
import { useLanguage } from "@/contexts/LanguageContext";
import { Calendar, Plus } from "lucide-react";
import { toast } from "sonner";

const scheduleData = [{
  id: 1,
  time: "09:00 AM",
  customer: "Sarah Johnson",
  address: "123 Oak Street",
  service: "Deep Cleaning",
  staff: "Maria Silva",
  status: "scheduled",
  duration: "3 hours"
}, {
  id: 2,
  time: "01:00 PM",
  customer: "Tech Startup Inc.",
  address: "456 Business Park",
  service: "Regular Cleaning 2weeks",
  staff: "John Doe",
  status: "in-progress",
  duration: "2 hours"
}, {
  id: 3,
  time: "04:00 PM",
  customer: "Miller Family",
  address: "789 Maple Avenue",
  service: "Deep Move-Out Cleaning",
  staff: "Ana Garcia",
  status: "completed",
  duration: "4 hours"
}, {
  id: 4,
  time: "10:00 AM",
  customer: "Emma Wilson",
  address: "987 Cedar Court",
  service: "Regular Cleaning 3weeks",
  staff: "Maria Silva",
  status: "scheduled",
  duration: "2 hours"
}, {
  id: 5,
  time: "02:00 PM",
  customer: "David Johnson",
  address: "321 Pine Road",
  service: "Regular Cleaning 4weeks",
  staff: "Carlos Santos",
  status: "scheduled",
  duration: "2 hours"
}, {
  id: 6,
  time: "08:00 AM",
  customer: "Lisa Chen",
  address: "369 Birch Avenue",
  service: "Regular Cleaning weekly",
  staff: "Joana Costa",
  status: "in-progress",
  duration: "2 hours"
}, {
  id: 7,
  time: "11:00 AM",
  customer: "Michael Brown",
  address: "963 Spruce Drive",
  service: "Regular Cleaning 3times a week",
  staff: "Carla Oliveira",
  status: "scheduled",
  duration: "1.5 hours"
}, {
  id: 8,
  time: "03:00 PM",
  customer: "Ana Garcia",
  address: "123 Oak Street",
  service: "Once a Month",
  staff: "Paula Ferreira",
  status: "completed",
  duration: "3 hours"
}, {
  id: 9,
  time: "09:30 AM",
  customer: "Carlos Santos",
  address: "789 Maple Lane",
  service: "Clean Extra",
  staff: "Lucia Pereira",
  status: "scheduled",
  duration: "1 hour"
}, {
  id: 10,
  time: "01:30 PM",
  customer: "Sean Eldridge",
  address: "8227 Lake Norman Pl",
  service: "Cleaning For Reason",
  staff: "Rosa Almeida",
  status: "in-progress",
  duration: "2 hours"
}, {
  id: 11,
  time: "10:30 AM",
  customer: "John Doe",
  address: "147 Elm Street",
  service: "Deep Move-in Cleaning",
  staff: "Clara Rodrigues",
  status: "scheduled",
  duration: "4 hours"
}, {
  id: 12,
  time: "02:30 PM",
  customer: "Sarah Miller",
  address: "159 Ash Lane",
  service: "Once Every 2 Months",
  staff: "Maria Silva",
  status: "completed",
  duration: "3 hours"
}, {
  id: 13,
  time: "04:30 PM",
  customer: "Emma Wilson",
  address: "987 Cedar Court",
  service: "Regular Cleaning 8weeks",
  staff: "Ana Santos",
  status: "scheduled",
  duration: "2 hours"
}];

export function Schedule() {
  const { t } = useLanguage();
  
  const [appointmentModal, setAppointmentModal] = useState<{
    open: boolean;
    mode: "create" | "view" | "edit";
    appointment: typeof scheduleData[0] | null;
  }>({
    open: false,
    mode: "create",
    appointment: null
  });
  const [filterModal, setFilterModal] = useState(false);

  const handleNewAppointment = () => {
    setAppointmentModal({
      open: true,
      mode: "create",
      appointment: null
    });
  };

  const handleViewAppointment = (appointment: typeof scheduleData[0]) => {
    setAppointmentModal({
      open: true,
      mode: "view",
      appointment
    });
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
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
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
              <CalendarGrid appointments={scheduleData} onAppointmentClick={handleViewAppointment} />
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
      />

      <FilterModal 
        open={filterModal} 
        onOpenChange={setFilterModal} 
        onApplyFilters={handleApplyFilters} 
      />
    </div>
  );
}
