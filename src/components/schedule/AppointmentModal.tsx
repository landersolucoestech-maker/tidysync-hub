import { useState } from "react";
import { toast } from "sonner";
import { InvoiceModal } from "./InvoiceModal";
import { AppointmentDetailsView } from "./AppointmentDetailsView";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Briefcase, 
  Users, 
  Phone, 
  Mail, 
  Edit, 
  Trash2,
  CheckCircle,
  AlertCircle,
  Timer,
  FileText,
  Send,
  Play,
  Square,
  Star,
  Receipt,
  StickyNote,
  Navigation,
  Check,
  ChevronsUpDown
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrefilledData {
  customer?: string;
  address?: string;
  service?: string;
  amount?: string;
  estimateId?: string;
}

interface AppointmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    id: number;
    time: string;
    customer: string;
    address: string;
    service: string;
    staff: string;
    status: string;
    duration: string;
  } | null;
  mode: "create" | "view" | "edit";
  prefilledData?: PrefilledData;
  onJobCreated?: (invoiceData: { customer: string; address: string; service: string; amount: number }) => void;
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

// Mock addresses data - associated with customers (notes per address)
const customerAddresses: Record<
  string,
  { id: string; address: string; type: string; notes: string; additionalNotes: string }[]
> = {
  "Ana Garcia": [
    {
      id: "a1",
      address: "123 Oak Street, Boston, MA 02101",
      type: "Home",
      notes: "Ring doorbell twice. Dog friendly.",
      additionalNotes: "Preferred time: mornings. Use microfiber cloths.",
    },
    {
      id: "a2",
      address: "456 Business Ave, Boston, MA 02102",
      type: "Work",
      notes: "Check in at reception. Parking available in back.",
      additionalNotes: "Focus: bathrooms + lobby. Avoid meeting room A.",
    },
  ],
  "Carlos Santos": [
    {
      id: "a3",
      address: "789 Maple Lane, Cambridge, MA 02139",
      type: "Home",
      notes: "Use side entrance. Key under mat.",
      additionalNotes: "Trash pickup is Tuesday—replace bags.",
    },
  ],
  "David Johnson": [
    {
      id: "a4",
      address: "321 Pine Road, Somerville, MA 02143",
      type: "Home",
      notes: "Alarm code: 1234. Cat inside - keep doors closed.",
      additionalNotes: "No shoes inside. Extra attention to windows.",
    },
    {
      id: "a5",
      address: "654 Corporate Blvd, Boston, MA 02110",
      type: "Office",
      notes: "After hours access required. Contact security.",
      additionalNotes: "Use building loading dock for supplies.",
    },
  ],
  "Emma Wilson": [
    {
      id: "a6",
      address: "987 Cedar Court, Brookline, MA 02445",
      type: "Home",
      notes: "Prefer eco-friendly products. No strong scents.",
      additionalNotes: "Please empty dishwasher if full.",
    },
  ],
  "John Doe": [
    {
      id: "a7",
      address: "147 Elm Street, Newton, MA 02458",
      type: "Home",
      notes: "Garage code: 5678. Extra attention to kitchen.",
      additionalNotes: "Polish stainless steel appliances.",
    },
    {
      id: "a8",
      address: "258 Tech Park, Cambridge, MA 02142",
      type: "Work",
      notes: "Building B, Suite 200. Elevator access.",
      additionalNotes: "Clean glass doors + sanitize desks.",
    },
  ],
  "Lisa Chen": [
    {
      id: "a9",
      address: "369 Birch Avenue, Quincy, MA 02169",
      type: "Home",
      notes: "Elderly resident. Be mindful of noise.",
      additionalNotes: "Keep all doors locked when leaving.",
    },
  ],
  "Maria Silva": [
    {
      id: "a10",
      address: "741 Willow Way, Medford, MA 02155",
      type: "Home",
      notes: "Kids room needs extra care. Toys organized by type.",
      additionalNotes: "Use fragrance-free detergent.",
    },
    {
      id: "a11",
      address: "852 Downtown Plaza, Boston, MA 02108",
      type: "Work",
      notes: "Conference room priority. Whiteboards cleaned.",
      additionalNotes: "Restock paper towels in kitchen.",
    },
  ],
  "Michael Brown": [
    {
      id: "a12",
      address: "963 Spruce Drive, Arlington, MA 02474",
      type: "Home",
      notes: "Home office - don't move papers on desk.",
      additionalNotes: "Vacuum stairs thoroughly.",
    },
  ],
  "Sarah Miller": [
    {
      id: "a13",
      address: "159 Ash Lane, Lexington, MA 02420",
      type: "Home",
      notes: "Allergic to bleach. Use hypoallergenic products.",
      additionalNotes: "Do not use aerosols.",
    },
    {
      id: "a14",
      address: "267 Mill Road, Waltham, MA 02451",
      type: "Vacation",
      notes: "Seasonal property. Check thermostat settings.",
      additionalNotes: "Run water in unused bathrooms.",
    },
  ],
  "Sean Eldridge": [
    {
      id: "a15",
      address: "8227 Lake Norman Pl Apartment 1, Lake Norman of Catawba, NC 28031",
      type: "Home",
      notes: "Gate code: 9999. Lakefront property - clean windows.",
      additionalNotes: "Use elevator—no stairs with supplies.",
    },
    {
      id: "a16",
      address: "1500 Corporate Center, Charlotte, NC 28202",
      type: "Work",
      notes: "Executive floor. Premium service required.",
      additionalNotes: "Ask front desk for parking validation.",
    },
  ],
};

const staffMembers = [
  "Maria Silva",
  "John Doe",
  "Ana Garcia",
  "Carlos Santos",
  "Lisa Chen",
];

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

const statuses = [
  { value: "scheduled", label: "Scheduled" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const getStatusConfig = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return { 
        icon: CheckCircle, 
        color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
        label: "Completed"
      };
    case "in-progress":
      return { 
        icon: Timer, 
        color: "bg-amber-500/10 text-amber-600 border-amber-500/20",
        label: "In Progress"
      };
    case "cancelled":
      return { 
        icon: AlertCircle, 
        color: "bg-red-500/10 text-red-600 border-red-500/20",
        label: "Cancelled"
      };
    default:
      return { 
        icon: Clock, 
        color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
        label: "Scheduled"
      };
  }
};

export function AppointmentModal({
  open,
  onOpenChange,
  appointment,
  mode,
  prefilledData,
  onJobCreated,
}: AppointmentModalProps) {
  const initialCustomer = prefilledData?.customer || appointment?.customer || "";
  const initialAddress = prefilledData?.address || appointment?.address || "";
  const initialService = prefilledData?.service || appointment?.service || "";
  const initialAddressEntry = initialCustomer
    ? (customerAddresses[initialCustomer] || []).find((a) => a.address === initialAddress)
    : undefined;

  const [formData, setFormData] = useState({
    customer: initialCustomer,
    address: initialAddress,
    service: initialService,
    staff1: appointment?.staff || "",
    staff2: "",
    staff3: "",
    staff4: "",
    time: appointment?.time || "",
    date: "",
    duration: appointment?.duration || "",
    amount: prefilledData?.amount || "",
    status: appointment?.status || "scheduled",
    notes: initialAddressEntry?.notes || "",
    additionalNotes: initialAddressEntry?.additionalNotes || "",
  });
  const [invoiceModalOpen, setInvoiceModalOpen] = useState(false);
  const [customerOpen, setCustomerOpen] = useState(false);
  const [addressOpen, setAddressOpen] = useState(false);

  // Get addresses for selected customer
  const availableAddresses = formData.customer ? customerAddresses[formData.customer] || [] : [];

  // Clear address and address-notes when customer changes
  const handleCustomerChange = (customerName: string) => {
    setFormData((prev) => ({
      ...prev,
      customer: customerName,
      address: "",
      notes: "",
      additionalNotes: "",
    }));
  };

  // Update address-notes when address changes
  const handleAddressChange = (address: string) => {
    const selectedAddress = availableAddresses.find((addr) => addr.address === address);
    setFormData((prev) => ({
      ...prev,
      address,
      notes: selectedAddress?.notes || "",
      additionalNotes: selectedAddress?.additionalNotes || "",
    }));
  };

  const isViewMode = mode === "view";
  const title =
    mode === "create"
      ? "New Appointment"
      : mode === "edit"
      ? "Edit Appointment"
      : "Appointment Details";

  const handleSubmit = () => {
    console.log("Submitting:", formData);
    const amount = parseFloat(formData.amount.replace(/[^0-9.]/g, '')) || 0;
    if (onJobCreated) {
      onJobCreated({
        customer: formData.customer,
        address: formData.address,
        service: formData.service,
        amount: amount,
      });
    }
    onOpenChange(false);
  };

  const statusConfig = getStatusConfig(formData.status);
  const StatusIcon = statusConfig.icon;

  // View Mode - Details layout (matches reference screenshot)
  if (isViewMode) {
    if (!appointment) return null;

    return (
      <>
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden max-h-[90vh] overflow-y-auto" hideCloseButton>
            <AppointmentDetailsView
              appointment={appointment}
              onClose={() => onOpenChange(false)}
              onOpenInvoice={() => setInvoiceModalOpen(true)}
            />
          </DialogContent>
        </Dialog>

        <InvoiceModal
          open={invoiceModalOpen}
          onOpenChange={setInvoiceModalOpen}
          appointment={{
            customer: appointment.customer,
            address: appointment.address,
            service: appointment.service,
            time: appointment.time,
          }}
        />
      </>
    );
  }

  // Create/Edit Mode - Form interface
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "New Job" : "Edit Job"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-4 mt-4">
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
                onValueChange={(value) => setFormData({ ...formData, service: value })}
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
                            handleAddressChange(currentValue === formData.address ? "" : currentValue);
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

          {/* Address Notes - part of the address */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Notes for this address..."
              rows={2}
              className="bg-muted/30"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="additionalNotes">Additional Notes</Label>
            <Textarea
              id="additionalNotes"
              value={formData.additionalNotes}
              onChange={(e) => setFormData({ ...formData, additionalNotes: e.target.value })}
              placeholder="Additional notes for this address..."
              rows={2}
              className="bg-muted/30"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <DatePickerString
                id="date"
                value={formData.date}
                onChange={(value) => setFormData({ ...formData, date: value })}
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
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="staff1">Staff Member 1 *</Label>
              <Select
                value={formData.staff1}
                onValueChange={(value) => setFormData({ ...formData, staff1: value })}
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
                onValueChange={(value) => setFormData({ ...formData, staff2: value })}
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
              <Label htmlFor="staff3">Staff Member 3</Label>
              <Select
                value={formData.staff3}
                onValueChange={(value) => setFormData({ ...formData, staff3: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers
                    .filter((staff) => staff !== formData.staff1 && staff !== formData.staff2)
                    .map((staff) => (
                      <SelectItem key={staff} value={staff}>
                        {staff}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="staff4">Staff Member 4</Label>
              <Select
                value={formData.staff4}
                onValueChange={(value) => setFormData({ ...formData, staff4: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select staff member (optional)" />
                </SelectTrigger>
                <SelectContent>
                  {staffMembers
                    .filter((staff) => staff !== formData.staff1 && staff !== formData.staff2 && staff !== formData.staff3)
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
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g., 2h, 3h 30m"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount ($)</Label>
            <Input
              id="amount"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              placeholder="e.g., $150"
            />
          </div>



          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {mode === "create" ? "Create Appointment" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
