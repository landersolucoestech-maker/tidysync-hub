import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Appointment {
  id: number;
  time: string;
  customer: string;
  address: string;
  service: string;
  staff: string;
  status: string;
  duration: string;
  date?: string;
  team?: string;
}
interface CalendarGridProps {
  appointments: Appointment[];
  onAppointmentClick?: (appointment: Appointment) => void;
}
const cleaners = [{
  id: 1,
  name: "Maria Silva",
  color: "bg-blue-600",
  jobs: 4
}, {
  id: 2,
  name: "Ana Santos",
  color: "bg-purple-600",
  jobs: 6
}, {
  id: 3,
  name: "Joana Costa",
  color: "bg-emerald-600",
  jobs: 3
}, {
  id: 4,
  name: "Carla Oliveira",
  color: "bg-red-600",
  jobs: 5
}, {
  id: 5,
  name: "Paula Ferreira",
  color: "bg-amber-600",
  jobs: 2
}, {
  id: 6,
  name: "Lucia Pereira",
  color: "bg-cyan-600",
  jobs: 4
}, {
  id: 7,
  name: "Rosa Almeida",
  color: "bg-pink-600",
  jobs: 3
}, {
  id: 8,
  name: "Clara Rodrigues",
  color: "bg-indigo-600",
  jobs: 6
}];
const serviceStatuses = [{
  name: "Next cleaning",
  color: "bg-gray-400",
  icon: "🕐"
}, {
  name: "Cleaning done",
  color: "bg-green-400",
  icon: "✓"
}, {
  name: "Cleaning now",
  color: "bg-orange-400",
  icon: "🏠"
}, {
  name: "On the way",
  color: "bg-blue-400",
  icon: "🚗"
}];
const serviceTypeColors: Record<string, string> = {
  "Deep Cleaning": "bg-purple-500",
  "Regular Cleaning 2weeks": "bg-blue-500",
  "Regular Cleaning 3weeks": "bg-cyan-500",
  "Regular Cleaning 4weeks": "bg-teal-500",
  "Regular Cleaning weekly": "bg-green-500",
  "Regular Cleaning 3times a week": "bg-emerald-500",
  "Once a Month": "bg-amber-500",
  "Clean Extra": "bg-orange-500",
  "Cleaning For Reason": "bg-red-500",
  "Deep Move-in Cleaning": "bg-indigo-500",
  "Deep Move-Out Cleaning": "bg-violet-500",
  "Once Every 2 Months": "bg-pink-500",
  "Regular Cleaning 8weeks": "bg-rose-500"
};
const getServiceColor = (service: string): string => {
  return serviceTypeColors[service] || "bg-gray-500";
};
export function CalendarGrid({
  appointments,
  onAppointmentClick
}: CalendarGridProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const getWeekDays = (date: Date) => {
    const week = [];
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      week.push(day);
    }
    return week;
  };
  const navigateWeek = (direction: "prev" | "next") => {
    setCurrentWeek(prev => {
      const newDate = new Date(prev);
      const days = direction === "prev" ? -7 : 7;
      newDate.setDate(prev.getDate() + days);
      return newDate;
    });
  };
  const weekDays = getWeekDays(currentWeek);
  const monthYear = currentWeek.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
  const getAppointmentsForDate = (date: Date) => {
    // Return all appointments (in a real app, filter by date)
    return appointments;
  };
  const getStatusIcon = (status: string) => {
    const statusMap: Record<string, string> = {
      "scheduled": "🕐",
      "completed": "✓",
      "in-progress": "🏠",
      "on-the-way": "🚗"
    };
    return statusMap[status] || "🕐";
  };
  const handleAppointmentClick = (appointment: Appointment) => {
    if (onAppointmentClick) {
      onAppointmentClick(appointment);
    }
  };
  return <div className="flex h-full bg-background">
      {/* Left Sidebar */}
      <div className="w-48 bg-muted border-r border-border flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-border">
          <div className="text-lg font-bold text-foreground">
            {new Date().getDate()}
          </div>
          <div className="text-sm text-muted-foreground">
            {appointments.length} Jobs
          </div>
        </div>

        {/* Cleaners Toggle */}
        <div className="p-3 border-b border-border">
          <span className="text-sm font-medium">CLEANERS</span>
        </div>

        {/* Teams List */}
        <div className="flex-1 overflow-y-auto">
          {cleaners.map(cleaner => <div key={cleaner.id} className="p-3 border-b border-border/50 hover:bg-accent/20 cursor-pointer transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">{cleaner.name}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {cleaner.jobs} Jobs
                </span>
              </div>
            </div>)}
        </div>

        {/* Cleaning Types Legend - Only shows types from appointments */}
        {(() => {
        const usedServices = [...new Set(appointments.map(apt => apt.service))];
        return usedServices.length > 0 ? <div className="border-t border-border p-3">
              <div className="text-sm font-medium mb-2 text-muted-foreground">
                CLEANING TYPES
              </div>
              <div className="space-y-2">
                {usedServices.map(service => <div key={service} className="flex items-center space-x-2 text-xs">
                    <div className={`w-3 h-3 rounded-full ${getServiceColor(service)}`}></div>
                    <span className="text-muted-foreground">{service}</span>
                  </div>)}
              </div>
            </div> : null;
      })()}

        {/* Service Status */}
        <div className="border-t border-border p-3">
          <div className="text-sm font-medium mb-2 text-muted-foreground">
            SERVICE STATUS
          </div>
          <div className="space-y-2">
            {serviceStatuses.map((status, index) => <div key={index} className="flex items-center space-x-2 text-xs">
                <span>{status.icon}</span>
                <span className="text-muted-foreground">{status.name}</span>
              </div>)}
          </div>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col">
        {/* Calendar Header */}
        <div className="flex items-center p-4 border-b border-border relative">
          <h2 className="text-xl font-bold text-foreground absolute left-1/2 -translate-x-1/2">{monthYear}</h2>
          <div className="flex items-center space-x-2 ml-auto">
            <Button variant="outline" size="icon" onClick={() => navigateWeek("prev")}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => navigateWeek("next")}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Week Header */}
        <div className="grid grid-cols-7 border-b border-border">
          {weekDays.map((day, index) => <div key={index} className="p-3 text-center border-r border-border last:border-r-0">
              <div className="font-medium text-foreground">{day.getDate()}</div>
              <div className="text-xs text-muted-foreground">
                {day.toLocaleDateString("en-US", {
              weekday: "short"
            })}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {Math.floor(Math.random() * 20) + 5} Jobs
              </div>
            </div>)}
        </div>

        {/* Calendar Grid - All appointments stacked per day */}
        <div className="flex-1 overflow-y-auto grid grid-cols-7">
          {weekDays.map((day, dayIndex) => <div key={dayIndex} className="border-r border-border/50 last:border-r-0 space-y-0.5">
              {getAppointmentsForDate(day).map((appointment, aptIndex) => <div key={aptIndex} className={`
                      ${getServiceColor(appointment.service)} text-white text-xs cursor-pointer
                      hover:opacity-80 transition-opacity truncate flex items-center px-1
                    `} title={`${appointment.time} - ${appointment.customer} - ${appointment.service}`} onClick={() => handleAppointmentClick(appointment)}>
                    <span className="mr-1">{getStatusIcon(appointment.status)}</span>
                    <span>{appointment.customer}</span>
                  </div>)}
            </div>)}
        </div>
      </div>
    </div>;
}