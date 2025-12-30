import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DatePickerString } from "@/components/ui/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface JobModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (job: JobFormData) => void;
  job?: JobFormData | null;
}

export interface JobFormData {
  id?: string;
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
}

// Mock customers data - sorted alphabetically
const customers = [
  { id: "1", name: "Ana Garcia", email: "ana@email.com" },
  { id: "2", name: "Carlos Santos", email: "carlos@email.com" },
  { id: "3", name: "David Johnson", email: "david@email.com" },
  { id: "4", name: "Emma Wilson", email: "emma@email.com" },
  { id: "5", name: "John Doe", email: "john@email.com" },
  { id: "6", name: "Lisa Chen", email: "lisa@email.com" },
  { id: "7", name: "Maria Silva", email: "maria@email.com" },
  { id: "8", name: "Michael Brown", email: "michael@email.com" },
  { id: "9", name: "Sarah Miller", email: "sarah@email.com" },
  { id: "10", name: "Sean Eldridge", email: "sean@email.com" },
].sort((a, b) => a.name.localeCompare(b.name));

// Mock addresses data - associated with customers
const customerAddresses: Record<string, { id: string; address: string; type: string }[]> = {
  "Ana Garcia": [
    { id: "a1", address: "123 Oak Street, Boston, MA 02101", type: "Home" },
    { id: "a2", address: "456 Business Ave, Boston, MA 02102", type: "Work" },
  ],
  "Carlos Santos": [
    { id: "a3", address: "789 Maple Lane, Cambridge, MA 02139", type: "Home" },
  ],
  "David Johnson": [
    { id: "a4", address: "321 Pine Road, Somerville, MA 02143", type: "Home" },
    { id: "a5", address: "654 Corporate Blvd, Boston, MA 02110", type: "Office" },
  ],
  "Emma Wilson": [
    { id: "a6", address: "987 Cedar Court, Brookline, MA 02445", type: "Home" },
  ],
  "John Doe": [
    { id: "a7", address: "147 Elm Street, Newton, MA 02458", type: "Home" },
    { id: "a8", address: "258 Tech Park, Cambridge, MA 02142", type: "Work" },
  ],
  "Lisa Chen": [
    { id: "a9", address: "369 Birch Avenue, Quincy, MA 02169", type: "Home" },
  ],
  "Maria Silva": [
    { id: "a10", address: "741 Willow Way, Medford, MA 02155", type: "Home" },
    { id: "a11", address: "852 Downtown Plaza, Boston, MA 02108", type: "Work" },
  ],
  "Michael Brown": [
    { id: "a12", address: "963 Spruce Drive, Arlington, MA 02474", type: "Home" },
  ],
  "Sarah Miller": [
    { id: "a13", address: "159 Ash Lane, Lexington, MA 02420", type: "Home" },
    { id: "a14", address: "267 Mill Road, Waltham, MA 02451", type: "Vacation" },
  ],
  "Sean Eldridge": [
    { id: "a15", address: "8227 Lake Norman Pl Apartment 1, Lake Norman of Catawba, NC 28031", type: "Home" },
    { id: "a16", address: "1500 Corporate Center, Charlotte, NC 28202", type: "Work" },
  ],
};

const services = [
  "Deep Cleaning",
  "Regular Cleaning 2weeks",
  "Regular Cleaning 3weeks",
  "Regular Cleaning 4weeks",
  "Regular Cleaning weekly",
  "Regular Cleaning 3times a week",
  "Once a Month",
  "Clean Extra",
  "Cleaning For Reason",
  "Deep Move-in Cleaning",
  "Deep Move-Out Cleaning",
  "Once Every 2 Months",
  "Regular Cleaning 8weeks",
];

const staffMembers = [
  "Maria Silva",
  "John Doe",
  "Ana Garcia",
  "Carlos Santos",
  "Lisa Chen",
];

const statusOptions = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

export function JobModal({ open, onOpenChange, onSave, job }: JobModalProps) {
  const [formData, setFormData] = useState<JobFormData>(
    job || {
      customer: "",
      service: "",
      date: "",
      time: "",
      staff1: "",
      staff2: "",
      status: "scheduled",
      duration: "",
      amount: "",
      address: "",
      notes: "",
    }
  );
  const [customerOpen, setCustomerOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  // Get addresses for selected customer
  const availableAddresses = formData.customer ? customerAddresses[formData.customer] || [] : [];

  // Clear address when customer changes
  const handleCustomerChange = (customerName: string) => {
    handleChange("customer", customerName);
    handleChange("address", ""); // Reset address when customer changes
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onOpenChange(false);
    setFormData({
      customer: "",
      service: "",
      date: "",
      time: "",
      staff1: "",
      staff2: "",
      status: "scheduled",
      duration: "",
      amount: "",
      address: "",
      notes: "",
    });
  };

  const handleChange = (field: keyof JobFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job ? "Edit Job" : "Create New Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer Name *</Label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between font-normal"
                  >
                    {formData.customer
                      ? customers.find((c) => c.name === formData.customer)?.name
                      : "Select customer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search customer..." />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={(currentValue) => {
                              handleCustomerChange(currentValue === formData.customer ? "" : currentValue);
                              setCustomerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.customer === customer.name ? "opacity-100" : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{customer.name}</span>
                              <span className="text-xs text-muted-foreground">{customer.email}</span>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="service">Service Type *</Label>
              <Select
                value={formData.service}
                onValueChange={(value) => handleChange("service", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select service" />
                </SelectTrigger>
                <SelectContent>
                  {services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Popover open={addressOpen} onOpenChange={setAddressOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={addressOpen}
                  className="w-full justify-between font-normal text-left h-auto min-h-10"
                  disabled={!formData.customer}
                >
                  <span className="truncate">
                    {formData.address || (formData.customer ? "Select address..." : "Select a customer first")}
                  </span>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[520px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search address..." />
                  <CommandList>
                    <CommandEmpty>No address found for this customer.</CommandEmpty>
                    <CommandGroup>
                      {availableAddresses.map((addr) => (
                        <CommandItem
                          key={addr.id}
                          value={addr.address}
                          onSelect={(currentValue) => {
                            handleChange("address", currentValue === formData.address ? "" : currentValue);
                            setAddressOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              formData.address === addr.address ? "opacity-100" : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span className="truncate">{addr.address}</span>
                            <span className="text-xs text-muted-foreground">{addr.type}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <DatePickerString
                id="date"
                value={formData.date}
                onChange={(value) => handleChange("date", value)}
                placeholder="Select date"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time *</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleChange("time", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff1">Staff Member 1 *</Label>
              <Select
                value={formData.staff1}
                onValueChange={(value) => handleChange("staff1", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff2">Staff Member 2</Label>
              <Select
                value={formData.staff2}
                onValueChange={(value) => handleChange("staff2", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers
                    .filter((staff) => staff !== formData.staff1)
                    .map((staff) => (
                      <SelectItem key={staff} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
                placeholder="e.g., 2h, 3h 30m"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                placeholder="e.g., $150"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional notes or instructions..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {job ? "Save Changes" : "Create Job"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
