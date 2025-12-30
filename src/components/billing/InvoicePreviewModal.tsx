import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Send,
  User,
  MapPin,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface InvoiceData {
  customer: string;
  customerEmail: string;
  issueDate: string;
  dueDate: string;
  paymentTerms: string;
  jobId: string;
  notes: string;
  taxRate: number;
  totalPayment: number;
  createdDate: string;
  lineItems: LineItem[];
}

interface InvoicePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  invoiceData: InvoiceData;
  onBack: () => void;
  onSend: () => void;
}

export function InvoicePreviewModal({
  open,
  onOpenChange,
  invoiceData,
  onBack,
  onSend,
}: InvoicePreviewModalProps) {
  const [syncToQB, setSyncToQB] = useState(true);

  const subtotal = invoiceData.lineItems.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const tax = subtotal * invoiceData.taxRate / 100;
  const totalCharges = subtotal + tax;
  const totalDue = totalCharges - invoiceData.totalPayment;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "--";
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleSendInvoice = () => {
    if (syncToQB) {
      toast.success("Invoice created and synced to QuickBooks!");
    } else {
      toast.success("Invoice sent successfully!");
    }
    onSend();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            Invoice Preview
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-muted-foreground">Invoice Number</p>
              <p className="font-mono font-semibold">INV-{Date.now().toString().slice(-6)}</p>
            </div>
            <Badge variant="outline">Draft</Badge>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">Bill To</p>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium">{invoiceData.customer}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-6">
                {invoiceData.customerEmail}
              </p>
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground">Issue Date</p>
              <p className="font-medium">{formatDate(invoiceData.issueDate)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Due Date</p>
              <p className="font-medium">{formatDate(invoiceData.dueDate) || "On Receipt"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Payment Terms</p>
              <p className="font-medium capitalize">{invoiceData.paymentTerms.replace("_", " ")}</p>
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Line Items</p>
            <div className="space-y-2">
              {invoiceData.lineItems.filter(item => item.description).map((item) => (
                <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-muted/20 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold">${(item.quantity * item.unitPrice).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Totals */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax ({invoiceData.taxRate}%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between">
              <span className="font-medium">Total Charges</span>
              <span className="font-semibold">${totalCharges.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Payment</span>
              <span>${invoiceData.totalPayment.toFixed(2)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-base">
              <span className="font-semibold">Total Due</span>
              <span className="font-bold text-foreground">${totalDue.toFixed(2)}</span>
            </div>
          </div>

          <Separator />

          {/* Invoice Timeline */}
          <div className="space-y-3">
            <p className="text-sm font-medium">Invoice Timeline</p>
            <div className="grid grid-cols-5 gap-3">
              <div className="text-center p-2 bg-muted/30 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Created</p>
                <p className="text-xs font-medium">{formatDate(invoiceData.createdDate)}</p>
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

          {invoiceData.notes && (
            <>
              <Separator />
              <div className="space-y-2">
                <p className="text-sm font-medium">Notes</p>
                <p className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-lg">
                  {invoiceData.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Sync Option */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Sync to QuickBooks</Label>
              <p className="text-sm text-muted-foreground">
                Automatically sync this invoice to QuickBooks
              </p>
            </div>
            <Switch
              checked={syncToQB}
              onCheckedChange={setSyncToQB}
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button onClick={handleSendInvoice}>
            <Send className="w-4 h-4 mr-2" />
            Send Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
