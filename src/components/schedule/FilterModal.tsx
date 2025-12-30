import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Filter, Users, Briefcase, Calendar } from "lucide-react";

interface FilterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: FilterState) => void;
}

interface FilterState {
  staff: string[];
  services: string[];
  statuses: string[];
}

const staffMembers = [
  "Maria Silva",
  "John Doe",
  "Ana Garcia",
  "Carlos Santos",
  "Emma Wilson",
];

const services = [
  "Deep Clean",
  "Regular Clean",
  "Move-out Clean",
  "Office Clean",
  "Window Cleaning",
];

const statuses = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function FilterModal({
  open,
  onOpenChange,
  onApplyFilters,
}: FilterModalProps) {
  const [filters, setFilters] = useState<FilterState>({
    staff: [],
    services: [],
    statuses: [],
  });

  const toggleFilter = (
    category: keyof FilterState,
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((v) => v !== value)
        : [...prev[category], value],
    }));
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClear = () => {
    setFilters({ staff: [], services: [], statuses: [] });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-primary" />
            Filter Appointments
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-6 py-4">
          {/* Staff Filter */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Users className="w-4 h-4" />
              Staff Members
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {staffMembers.map((staff) => (
                <div key={staff} className="flex items-center space-x-2">
                  <Checkbox
                    id={`staff-${staff}`}
                    checked={filters.staff.includes(staff)}
                    onCheckedChange={() => toggleFilter("staff", staff)}
                  />
                  <Label
                    htmlFor={`staff-${staff}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {staff}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Services Filter */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Briefcase className="w-4 h-4" />
              Services
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <div key={service} className="flex items-center space-x-2">
                  <Checkbox
                    id={`service-${service}`}
                    checked={filters.services.includes(service)}
                    onCheckedChange={() => toggleFilter("services", service)}
                  />
                  <Label
                    htmlFor={`service-${service}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {service}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2 text-base font-semibold">
              <Calendar className="w-4 h-4" />
              Status
            </Label>
            <div className="grid grid-cols-2 gap-2">
              {statuses.map((status) => (
                <div key={status.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`status-${status.value}`}
                    checked={filters.statuses.includes(status.value)}
                    onCheckedChange={() => toggleFilter("statuses", status.value)}
                  />
                  <Label
                    htmlFor={`status-${status.value}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {status.label}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={handleClear}>
            Clear All
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApply}>Apply Filters</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
