import { useState, useEffect } from "react";
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

interface Estimate {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  service: string;
  amount: string;
  date: string;
  expiryDate: string;
  status: string;
  address: string;
  validUntil: string;
  origin?: string;
  hasJob?: boolean;
}

interface EditEstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: Estimate | null;
  onSave: (updatedEstimate: Estimate) => void;
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
  "Google",
  "Phone Call",
  "Instagram",
  "Referral",
  "Facebook",
  "Nextdoor",
  "Website",
  "Email",
  "Social Media",
  "Google Ads",
  "Walk-in",
  "Other",
];

const formatCurrency = (value: string): string => {
  // Remove all non-numeric characters except decimal point
  const numericValue = value.replace(/[^0-9.]/g, "");
  
  // Parse as float
  const number = parseFloat(numericValue);
  
  if (isNaN(number)) {
    return "";
  }
  
  // Format as currency
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const parseCurrencyToNumber = (value: string): number => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  return parseFloat(numericValue) || 0;
};

export function EditEstimateModal({ open, onOpenChange, estimate, onSave }: EditEstimateModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    origin: "",
    expiryDate: "",
  });

  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { id: "1", addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" },
  ]);

  // Load estimate data when modal opens
  useEffect(() => {
    if (estimate && open) {
      setFormData({
        customerName: estimate.customer,
        email: estimate.email || "",
        phoneNumber1: estimate.phone || "",
        phoneNumber2: "",
        origin: estimate.origin || "",
        expiryDate: estimate.expiryDate,
      });
      
      setAddresses([{
        id: "1",
        addressName: "",
        address: estimate.address,
        date: estimate.date,
        time: "",
        serviceType: estimate.service,
        amount: estimate.amount,
        notes: "",
        additionalNotes: "",
      }]);
    }
  }, [estimate, open]);

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

  const updateAddress = (id: string, field: keyof AddressEntry, value: string) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const handleAmountBlur = (id: string, value: string) => {
    const formatted = formatCurrency(value);
    updateAddress(id, "amount", formatted);
  };

  const handleSaveEstimate = () => {
    if (!formData.customerName.trim()) {
      toast.error("Please enter customer name");
      return;
    }
    if (addresses.every((addr) => !addr.address.trim())) {
      toast.error("Please add at least one address");
      return;
    }

    // Validate amount format
    for (const addr of addresses) {
      if (addr.amount && parseCurrencyToNumber(addr.amount) <= 0) {
        toast.error("Please enter a valid amount for all addresses");
        return;
      }
    }

    if (estimate) {
      // Calculate total amount from all addresses
      const totalAmount = addresses.reduce((sum, addr) => {
        return sum + parseCurrencyToNumber(addr.amount);
      }, 0);

      const updatedEstimate: Estimate = {
        ...estimate,
        customer: formData.customerName,
        email: formData.email,
        phone: formData.phoneNumber1,
        address: addresses[0]?.address || estimate.address,
        service: addresses[0]?.serviceType || estimate.service,
        amount: formatCurrency(totalAmount.toString()),
        date: addresses[0]?.date || estimate.date,
        expiryDate: formData.expiryDate,
        origin: formData.origin,
      };

      onSave(updatedEstimate);
      toast.success("Estimate updated successfully!");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit Estimate {estimate?.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customerName">Customer Name *</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Enter customer name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="customer@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber1">Phone Number 1</Label>
                <Input
                  id="edit-phoneNumber1"
                  value={formData.phoneNumber1}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber1: e.target.value })
                  }
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber2">Phone Number 2</Label>
                <Input
                  id="edit-phoneNumber2"
                  value={formData.phoneNumber2}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber2: e.target.value })
                  }
                  placeholder="(555) 987-6543"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-origin">Origin</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) =>
                    setFormData({ ...formData, origin: value })
                  }
                >
                  <SelectTrigger id="edit-origin">
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
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Valid Until</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
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
          <Button onClick={handleSaveEstimate}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
