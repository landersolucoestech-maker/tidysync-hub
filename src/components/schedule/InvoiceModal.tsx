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
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Receipt, 
  Send, 
  Download, 
  Printer,
  Calendar,
  User,
  MapPin,
  DollarSign,
  Plus,
  Trash2
} from "lucide-react";
import { toast } from "sonner";

interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  appointment?: {
    customer: string;
    address: string;
    service: string;
    time: string;
  } | null;
  depositAmount?: number;
  isDepositInvoice?: boolean;
}

export function InvoiceModal({ open, onOpenChange, appointment, depositAmount, isDepositInvoice }: InvoiceModalProps) {
  const defaultItems = isDepositInvoice && depositAmount
    ? [{ id: 1, description: `${appointment?.service || "Service"} - 50% Deposit`, quantity: 1, rate: depositAmount, amount: depositAmount }]
    : [
        { id: 1, description: "Deep Clean Service", quantity: 1, rate: 150, amount: 150 },
        { id: 2, description: "Supplies & Materials", quantity: 1, rate: 20, amount: 20 },
      ];
  
  const [items, setItems] = useState<InvoiceItem[]>(defaultItems);

  const [newItem, setNewItem] = useState({ description: "", quantity: 1, rate: 0 });

  const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleAddItem = () => {
    if (!newItem.description || newItem.rate <= 0) {
      toast.error("Please fill in item description and rate");
      return;
    }
    
    const item: InvoiceItem = {
      id: Date.now(),
      description: newItem.description,
      quantity: newItem.quantity,
      rate: newItem.rate,
      amount: newItem.quantity * newItem.rate,
    };
    
    setItems([...items, item]);
    setNewItem({ description: "", quantity: 1, rate: 0 });
  };

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };

  const handleSendInvoice = () => {
    // TODO: Integrate with QuickBooks API when Cloud is enabled
    toast.success(isDepositInvoice 
      ? "50% deposit invoice sent successfully! QuickBooks integration pending."
      : "Invoice sent successfully!");
    onOpenChange(false);
  };

  const handleDownload = () => {
    toast.success("Invoice downloaded!");
  };

  const handlePrint = () => {
    toast.success("Printing invoice...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="w-5 h-5 text-primary" />
            {isDepositInvoice ? "50% Deposit Invoice" : "Create Invoice"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invoice Header Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground text-xs">Invoice Number</Label>
              <p className="font-mono font-semibold">INV-{Date.now().toString().slice(-6)}</p>
            </div>
            <div>
              <Label className="text-muted-foreground text-xs">Date</Label>
              <p className="font-medium">{new Date().toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div className="space-y-2">
            <Label className="text-muted-foreground text-xs">Bill To</Label>
            <div className="p-3 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2 mb-1">
                <User className="w-4 h-4 text-primary" />
                <span className="font-medium">{appointment?.customer || "Sean Eldridge"}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-3 h-3" />
                <span>{appointment?.address || "123 Main Street, Boston, MA 02101"}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Line Items */}
          <div className="space-y-3">
            <Label className="text-muted-foreground text-xs">Line Items</Label>
            
            <div className="space-y-2">
              {items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/20 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-sm">{item.description}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} x ${item.rate.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-semibold">${item.amount.toFixed(2)}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-8 w-8 text-destructive"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Add New Item */}
            <div className="p-3 border border-dashed border-border rounded-lg space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-3">
                  <Input
                    placeholder="Item description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <Input
                  type="number"
                  placeholder="Qty"
                  min={1}
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                />
                <Input
                  type="number"
                  placeholder="Rate"
                  min={0}
                  step={0.01}
                  value={newItem.rate || ""}
                  onChange={(e) => setNewItem({ ...newItem, rate: parseFloat(e.target.value) || 0 })}
                />
                <Button variant="outline" onClick={handleAddItem}>
                  <Plus className="w-4 h-4 mr-1" />
                  Add
                </Button>
              </div>
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
              <span className="text-muted-foreground">Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <Separator />
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span className="text-primary">${total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" onClick={handlePrint}>
              <Printer className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload}>
              <Download className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-2 flex-1 justify-end">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendInvoice}>
              <Send className="w-4 h-4 mr-2" />
              Send Invoice
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
