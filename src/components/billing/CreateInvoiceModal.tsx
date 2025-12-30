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
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Trash2,
  Check,
  ChevronsUpDown,
  DollarSign,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { InvoicePreviewModal } from "./InvoicePreviewModal";
import { DatePickerString } from "@/components/ui/date-picker";

interface CreateInvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const customers = [
  { id: "1", name: "Sarah Johnson", email: "sarah.j@email.com" },
  { id: "2", name: "Tech Startup Inc.", email: "office@techstartup.com" },
  { id: "3", name: "Miller Family", email: "miller.family@email.com" },
  { id: "4", name: "Downtown Office Complex", email: "admin@downtown.com" },
  { id: "5", name: "Green Valley Apartments", email: "manager@greenvalley.com" },
].sort((a, b) => a.name.localeCompare(b.name));

const completedJobs = [
  { id: "JOB-001", customer: "Sarah Johnson", service: "Deep Clean", date: "2024-01-15", amount: 180 },
  { id: "JOB-002", customer: "Tech Startup Inc.", service: "Office Clean", date: "2024-01-15", amount: 120 },
  { id: "JOB-003", customer: "Miller Family", service: "Move-out Clean", date: "2024-01-10", amount: 280 },
  { id: "JOB-004", customer: "Downtown Office Complex", service: "Regular Clean", date: "2024-01-20", amount: 450 },
  { id: "JOB-005", customer: "Green Valley Apartments", service: "Post-construction Clean", date: "2024-01-22", amount: 325 },
];

const services = [
  { name: "Regular Clean", price: 120 },
  { name: "Deep Clean", price: 180 },
  { name: "Move-in Clean", price: 250 },
  { name: "Move-out Clean", price: 280 },
  { name: "Post-construction Clean", price: 350 },
  { name: "Office Clean", price: 200 },
];

const paymentTermsOptions = [
  { value: "due_on_receipt", label: "Due on Receipt" },
  { value: "net15", label: "Net 15" },
  { value: "net30", label: "Net 30" },
  { value: "net45", label: "Net 45" },
  { value: "net60", label: "Net 60" },
];

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

export function CreateInvoiceModal({ open, onOpenChange }: CreateInvoiceModalProps) {
  const [customerOpen, setCustomerOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState({
    customer: "",
    customerEmail: "",
    issueDate: new Date().toISOString().split("T")[0],
    dueDate: "",
    paymentTerms: "net30",
    jobId: "",
    notes: "",
    taxRate: 0,
    totalPayment: 0,
    createdDate: new Date().toISOString().split("T")[0],
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    { id: "1", description: "", quantity: 1, unitPrice: 0 },
  ]);

  const handleCustomerChange = (customerName: string) => {
    const customer = customers.find((c) => c.name === customerName);
    setFormData({
      ...formData,
      customer: customerName,
      customerEmail: customer?.email || "",
    });
  };

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 },
    ]);
  };

  const removeLineItem = (id: string) => {
    if (lineItems.length > 1) {
      setLineItems(lineItems.filter((item) => item.id !== id));
    }
  };

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setLineItems(
      lineItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const subtotal = lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  const handleCreateInvoice = () => {
    if (!formData.customer) {
      toast.error("Please select a customer");
      return;
    }

    if (lineItems.every((item) => !item.description || item.unitPrice === 0)) {
      toast.error("Please add at least one line item");
      return;
    }

    setShowPreview(true);
  };

  const handleSendInvoice = () => {
    setShowPreview(false);
    onOpenChange(false);
    // Reset form
    setFormData({
      customer: "",
      customerEmail: "",
      issueDate: new Date().toISOString().split("T")[0],
      dueDate: "",
      paymentTerms: "net30",
      jobId: "",
      notes: "",
      taxRate: 0,
      totalPayment: 0,
      createdDate: new Date().toISOString().split("T")[0],
    });
    setLineItems([{ id: "1", description: "", quantity: 1, unitPrice: 0 }]);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Show preview modal
  if (showPreview) {
    return (
      <InvoicePreviewModal
        open={showPreview}
        onOpenChange={(open) => {
          if (!open) setShowPreview(false);
        }}
        invoiceData={{
          ...formData,
          lineItems,
        }}
        onBack={() => setShowPreview(false)}
        onSend={handleSendInvoice}
      />
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-primary" />
            Create New Invoice
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Customer *</Label>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={customerOpen}
                    className="w-full justify-between font-normal"
                  >
                    {formData.customer || "Select customer..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search customer..." />
                    <CommandList>
                      <CommandEmpty>No customer found.</CommandEmpty>
                      <CommandGroup>
                        {customers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.name}
                            onSelect={(value) => {
                              handleCustomerChange(value);
                              setCustomerOpen(false);
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                formData.customer === customer.name
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            <div className="flex flex-col">
                              <span>{customer.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {customer.email}
                              </span>
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
              <Label>Job ID (completed jobs)</Label>
              <Select
                value={formData.jobId}
                onValueChange={(value) => {
                  const job = completedJobs.find((j) => j.id === value);
                  if (job) {
                    setLineItems([
                      { id: "1", description: job.service, quantity: 1, unitPrice: job.amount },
                    ]);
                  }
                  setFormData({ ...formData, jobId: value });
                }}
                disabled={!formData.customer}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData.customer ? "Select completed job..." : "Select a customer first"} />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {completedJobs
                    .filter((job) => job.customer === formData.customer)
                    .map((job) => (
                      <SelectItem key={job.id} value={job.id}>
                        <span className="font-mono">{job.id}</span>
                        <span className="text-muted-foreground ml-2">• {job.service}</span>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Issue Date *</Label>
              <DatePickerString
                value={formData.issueDate}
                onChange={(value) =>
                  setFormData({ ...formData, issueDate: value })
                }
                placeholder="Select issue date"
              />
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
              <DatePickerString
                value={formData.dueDate}
                onChange={(value) =>
                  setFormData({ ...formData, dueDate: value })
                }
                placeholder="Select due date"
              />
            </div>

            <div className="space-y-2">
              <Label>Payment Terms</Label>
              <Select
                value={formData.paymentTerms}
                onValueChange={(value) =>
                  setFormData({ ...formData, paymentTerms: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {paymentTermsOptions.map((term) => (
                    <SelectItem key={term.value} value={term.value}>
                      {term.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Line Items</Label>
              <Button variant="outline" size="sm" onClick={addLineItem}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {lineItems.map((item, index) => (
                <div
                  key={item.id}
                  className="grid grid-cols-12 gap-3 items-start"
                >
                  <div className="col-span-5 space-y-1">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Description
                      </Label>
                    )}
                    <Select
                      value={item.description}
                      onValueChange={(value) => {
                        const service = services.find((s) => s.name === value);
                        updateLineItem(item.id, "description", value);
                        if (service) {
                          updateLineItem(item.id, "unitPrice", service.price);
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select service..." />
                      </SelectTrigger>
                      <SelectContent className="bg-popover border-border">
                        {services.map((service) => (
                          <SelectItem key={service.name} value={service.name}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="col-span-2 space-y-1">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">Qty</Label>
                    )}
                    <Input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateLineItem(item.id, "quantity", parseInt(e.target.value) || 1)
                      }
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">
                        Unit Price
                      </Label>
                    )}
                    <Input
                      type="number"
                      min="0"
                      step="0.01"
                      value={item.unitPrice}
                      onChange={(e) =>
                        updateLineItem(item.id, "unitPrice", parseFloat(e.target.value) || 0)
                      }
                    />
                  </div>

                  <div className="col-span-2 space-y-1">
                    {index === 0 && (
                      <Label className="text-xs text-muted-foreground">Total</Label>
                    )}
                    <div className="h-10 flex items-center font-medium">
                      ${(item.quantity * item.unitPrice).toFixed(2)}
                    </div>
                  </div>

                  <div className="col-span-1 space-y-1">
                    {index === 0 && <Label className="text-xs invisible">X</Label>}
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLineItem(item.id)}
                      disabled={lineItems.length === 1}
                    >
                      <Trash2 className="w-4 h-4 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals Section */}
            <div className="pt-4 border-t space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Subtotal</span>
                <span className="font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Tax</span>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.taxRate}
                    onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                    className="w-16 h-7 text-xs"
                  />
                  <span className="text-sm text-muted-foreground">%</span>
                </div>
                <span className="font-medium">${(subtotal * formData.taxRate / 100).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Total Charges</span>
                <span className="font-semibold">${(subtotal + (subtotal * formData.taxRate / 100)).toFixed(2)}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Total Payment</span>
                <div className="flex items-center gap-1">
                  <span className="text-muted-foreground">$</span>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.totalPayment}
                    onChange={(e) => setFormData({ ...formData, totalPayment: parseFloat(e.target.value) || 0 })}
                    className="w-24 h-7 text-right"
                  />
                </div>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold">Total Due</span>
                <span className="text-lg font-bold text-foreground">
                  ${((subtotal + (subtotal * formData.taxRate / 100)) - formData.totalPayment).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Invoice Timeline - Read Only */}
          <div className="space-y-3">
            <Label className="text-base font-semibold">Invoice Timeline</Label>
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-xs font-medium">{formatDate(formData.createdDate)}</p>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground mb-1">Sent</p>
                <p className="text-xs font-medium">--</p>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground mb-1">Opened</p>
                <p className="text-xs font-medium">--</p>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground mb-1">Paid</p>
                <p className="text-xs font-medium">--</p>
              </div>
              <div className="text-center p-2 bg-muted/20 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground mb-1">Receipt</p>
                <p className="text-xs font-medium">--</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Additional notes or instructions for the customer..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreateInvoice}>Create Invoice</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
