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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

interface CreateEstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AddressEntry {
  id: string;
  addressName: string;
  address: string;
  date: string;
  time: string;
  serviceType: string;
  amount: string;
  notes: string;
  additionalNotes: string;
}

const serviceTypes = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Move-in/Move-out Cleaning",
  "Office Cleaning",
  "Commercial Cleaning",
  "Window Cleaning",
  "Carpet Cleaning",
  "Post-Construction Cleaning",
  "Recurring Cleaning",
];

const originOptions = [
  "Website",
  "Phone Call",
  "Email",
  "Referral",
  "Social Media",
  "Google Ads",
  "Walk-in",
  "Other",
];


export function CreateEstimateModal({ open, onOpenChange }: CreateEstimateModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    origin: "",
  });

  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { id: "1", addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" },
  ]);

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { id: Date.now().toString(), addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" },
    ]);
  };

  const removeAddress = (id: string) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const number = parseFloat(numericValue);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleAmountBlur = (id: string, value: string) => {
    const formatted = formatCurrency(value);
    updateAddress(id, "amount", formatted);
  };

  const updateAddress = (id: string, field: keyof AddressEntry, value: string) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const handleCreateEstimate = () => {
    if (!formData.customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (addresses.every((addr) => !addr.address.trim())) {
      toast.error("Please add at least one address");
      return;
    }

    toast.success("Estimate created successfully!");
    onOpenChange(false);
    
    // Reset form
    setFormData({
      customerName: "",
      email: "",
      phoneNumber1: "",
      phoneNumber2: "",
      origin: "",
    });
    setAddresses([{ id: "1", addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" }]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Estimate</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="customer@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber1">Phone Number 1</Label>
                <Input
                  id="phoneNumber1"
                  value={formData.phoneNumber1}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber1: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber2">Phone Number 2</Label>
                <Input
                  id="phoneNumber2"
                  value={formData.phoneNumber2}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber2: e.target.value })
                  }
                  placeholder="(555) 987-6543"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origin</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) =>
                    setFormData({ ...formData, origin: value })
                  }
                >
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Select origin" />
                  </SelectTrigger>
                  <SelectContent>
                    {originOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Service Addresses
              </h3>
              <Button variant="outline" size="sm" onClick={addAddress}>
                <Plus className="w-4 h-4 mr-1" />
                Add Address
              </Button>
            </div>

            <div className="space-y-4">
              {addresses.map((addr, index) => (
                <div
                  key={addr.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      Address {index + 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAddress(addr.id)}
                      disabled={addresses.length === 1}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Address Name</Label>
                      <Input
                        value={addr.addressName}
                        onChange={(e) => updateAddress(addr.id, "addressName", e.target.value)}
                        placeholder="Home, Office, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Address</Label>
                      <Input
                        value={addr.address}
                        onChange={(e) => updateAddress(addr.id, "address", e.target.value)}
                        placeholder="123 Main Street, City, State, ZIP"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Date</Label>
                      <Input
                        type="date"
                        value={addr.date}
                        onChange={(e) => updateAddress(addr.id, "date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Time</Label>
                      <Input
                        type="time"
                        value={addr.time}
                        onChange={(e) => updateAddress(addr.id, "time", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Service Type</Label>
                      <Select
                        value={addr.serviceType}
                        onValueChange={(value) => updateAddress(addr.id, "serviceType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select service" />
                        </SelectTrigger>
                        <SelectContent>
                          {serviceTypes.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input
                        type="text"
                        value={addr.amount}
                        onChange={(e) => updateAddress(addr.id, "amount", e.target.value)}
                        onBlur={(e) => handleAmountBlur(addr.id, e.target.value)}
                        placeholder="$0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Notes</Label>
                    <Textarea
                      value={addr.notes}
                      onChange={(e) => updateAddress(addr.id, "notes", e.target.value)}
                      placeholder="Notes for this address..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Additional Notes</Label>
                    <Textarea
                      value={addr.additionalNotes}
                      onChange={(e) => updateAddress(addr.id, "additionalNotes", e.target.value)}
                      placeholder="Additional notes for this address..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateEstimate}>Create Estimate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
