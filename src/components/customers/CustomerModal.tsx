import { useState } from "react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { 
  User, 
  Phone, 
  MapPin,
  Plus,
  Trash2,
  CalendarIcon
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Address {
  id: string;
  name: string;
  address: string;
  notes: string;
  additionalNotes: string;
  frequency: string;
  preferredDay: string;
}

interface CustomerModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer?: {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    status: string;
  } | null;
  mode: "create" | "edit";
}

const frequencyOptions = [
  { value: "one-time", label: "One Time" },
  { value: "daily", label: "Daily" },
  { value: "every-other-day", label: "Every Other Day" },
  { value: "weekly", label: "Weekly" },
  { value: "every-2-weeks", label: "Every 2 Weeks" },
  { value: "every-3-weeks", label: "Every 3 Weeks" },
  { value: "every-4-weeks", label: "Every 4 Weeks" },
  { value: "every-5-weeks", label: "Every 5 Weeks" },
  { value: "every-6-weeks", label: "Every 6 Weeks" },
  { value: "every-7-weeks", label: "Every 7 Weeks" },
  { value: "every-8-weeks", label: "Every 8 Weeks" },
  { value: "first-of-month", label: "First of Month" },
  { value: "second-of-month", label: "Second of Month" },
  { value: "third-of-month", label: "Third of Month" },
  { value: "fourth-of-month", label: "Fourth of Month" },
  { value: "last-of-month", label: "Last of Month" },
];

const paymentMethods = [
  { value: "quickbooks", label: "QuickBooks (QB)" },
  { value: "cash", label: "Cash" },
  { value: "check", label: "Check" },
  { value: "venmo", label: "Venmo" },
  { value: "zelle", label: "Zelle" },
];

const daysOfWeek = [
  { value: "monday", label: "Monday" },
  { value: "tuesday", label: "Tuesday" },
  { value: "wednesday", label: "Wednesday" },
  { value: "thursday", label: "Thursday" },
  { value: "friday", label: "Friday" },
  { value: "saturday", label: "Saturday" },
  { value: "sunday", label: "Sunday" },
];

export function CustomerModal({
  open,
  onOpenChange,
  customer,
  mode,
}: CustomerModalProps) {
  const [formData, setFormData] = useState({
    firstName: customer?.name?.split(" ")[0] || "",
    lastName: customer?.name?.split(" ").slice(1).join(" ") || "",
    phone1: customer?.phone || "",
    phone2: "",
    status: customer?.status === "Active" ? "active" : "inactive",
    paymentMethod: "quickbooks",
    customerSince: new Date(),
  });

  const [addresses, setAddresses] = useState<Address[]>([
    { id: "1", name: "Home", address: customer?.address || "", notes: "", additionalNotes: "", frequency: "weekly", preferredDay: "monday" },
  ]);

  const title = mode === "create" ? "Add New Customer" : "Edit Customer";

  const handleSubmit = () => {
    console.log("Submitting customer:", { ...formData, addresses });
    onOpenChange(false);
  };

  const addAddress = () => {
    const newId = Date.now().toString();
    setAddresses([...addresses, { id: newId, name: "", address: "", notes: "", additionalNotes: "", frequency: "weekly", preferredDay: "monday" }]);
  };

  const removeAddress = (id: string) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const updateAddress = (id: string, field: keyof Omit<Address, "id">, value: string) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-2">
          {/* Customer Name */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                First Name *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                placeholder="John"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                placeholder="Doe"
              />
            </div>
          </div>

          {/* Phone Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="phone1" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number 1 *
              </Label>
              <Input
                id="phone1"
                value={formData.phone1}
                onChange={(e) =>
                  setFormData({ ...formData, phone1: e.target.value })
                }
                placeholder="(555) 123-4567"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="phone2" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                Phone Number 2
              </Label>
              <Input
                id="phone2"
                value={formData.phone2}
                onChange={(e) =>
                  setFormData({ ...formData, phone2: e.target.value })
                }
                placeholder="(555) 987-6543"
              />
            </div>
          </div>

          {/* Addresses */}
          <div className="grid gap-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Addresses
              </Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddress}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Address
              </Button>
            </div>
            
            {addresses.map((addr, index) => (
              <div key={addr.id} className="grid gap-2 p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">
                    Address {index + 1}
                  </span>
                  {addresses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeAddress(addr.id)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="grid gap-2">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor={`addr-name-${addr.id}`} className="text-xs">
                        Address Name
                      </Label>
                      <Input
                        id={`addr-name-${addr.id}`}
                        value={addr.name}
                        onChange={(e) => updateAddress(addr.id, "name", e.target.value)}
                        placeholder="Home, Business..."
                      />
                    </div>
                    <div className="grid gap-1 col-span-2">
                      <Label htmlFor={`addr-${addr.id}`} className="text-xs">
                        Full Address
                      </Label>
                      <Input
                        id={`addr-${addr.id}`}
                        value={addr.address}
                        onChange={(e) => updateAddress(addr.id, "address", e.target.value)}
                        placeholder="123 Main St, City, State, ZIP"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-1">
                      <Label htmlFor={`addr-frequency-${addr.id}`} className="text-xs">
                        Frequency of Cleaning
                      </Label>
                      <Select
                        value={addr.frequency}
                        onValueChange={(value) => updateAddress(addr.id, "frequency", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          {frequencyOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-1">
                      <Label htmlFor={`addr-day-${addr.id}`} className="text-xs">
                        Preferred Day
                      </Label>
                      <Select
                        value={addr.preferredDay}
                        onValueChange={(value) => updateAddress(addr.id, "preferredDay", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select day" />
                        </SelectTrigger>
                        <SelectContent>
                          {daysOfWeek.map((day) => (
                            <SelectItem key={day.value} value={day.value}>
                              {day.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor={`addr-notes-${addr.id}`} className="text-xs">
                      Notes
                    </Label>
                    <Textarea
                      id={`addr-notes-${addr.id}`}
                      value={addr.notes}
                      onChange={(e) => updateAddress(addr.id, "notes", e.target.value)}
                      placeholder="Gate code, parking instructions, special access..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label htmlFor={`addr-additional-notes-${addr.id}`} className="text-xs">
                      Additional Notes
                    </Label>
                    <Textarea
                      id={`addr-additional-notes-${addr.id}`}
                      value={addr.additionalNotes}
                      onChange={(e) => updateAddress(addr.id, "additionalNotes", e.target.value)}
                      placeholder="Customer preferences, special requests, warnings..."
                      rows={2}
                      className="resize-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Status */}
          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData({ ...formData, status: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Payment Method */}
          <div className="grid gap-2">
            <Label htmlFor="paymentMethod">Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, paymentMethod: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Customer Since */}
          <div className="grid gap-2">
            <Label>Customer Since</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.customerSince && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.customerSince ? (
                    format(formData.customerSince, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.customerSince}
                  onSelect={(date) =>
                    setFormData({ ...formData, customerSince: date || new Date() })
                  }
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {mode === "create" ? "Add Customer" : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
