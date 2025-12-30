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
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Zap,
  CheckCircle,
  RefreshCw,
  Link,
  Unlink,
  Clock,
  DollarSign,
  FileText,
  Send,
  Bell,
} from "lucide-react";
import { toast } from "sonner";

interface QBSettingsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QBSettingsModal({ open, onOpenChange }: QBSettingsModalProps) {
  const [settings, setSettings] = useState({
    connected: true,
    companyName: "CleanPro Services LLC",
    autoInvoicing: true,
    autoSendInvoices: true,
    defaultPaymentTerms: "net30",
    syncFrequency: "realtime",
    notifyOnPayment: true,
    notifyOnOverdue: true,
    defaultTaxRate: "0",
    invoicePrefix: "INV-",
  });

  const handleSave = () => {
    toast.success("QuickBooks settings saved successfully");
    onOpenChange(false);
  };

  const handleDisconnect = () => {
    toast.success("QuickBooks disconnected");
    setSettings({ ...settings, connected: false });
  };

  const handleConnect = () => {
    toast.success("QuickBooks connected successfully");
    setSettings({ ...settings, connected: true });
  };

  const handleSync = () => {
    toast.success("Syncing with QuickBooks...");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            QuickBooks Settings
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Connection Status */}
          <div className="p-4 rounded-lg border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.connected ? (
                  <CheckCircle className="w-5 h-5 text-success" />
                ) : (
                  <Unlink className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="font-medium text-foreground">
                    {settings.connected ? "Connected" : "Disconnected"}
                  </p>
                  {settings.connected && (
                    <p className="text-sm text-muted-foreground">
                      {settings.companyName}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {settings.connected && (
                  <Button variant="outline" size="sm" onClick={handleSync}>
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Sync Now
                  </Button>
                )}
                <Button
                  variant={settings.connected ? "destructive" : "default"}
                  size="sm"
                  onClick={settings.connected ? handleDisconnect : handleConnect}
                >
                  {settings.connected ? (
                    <>
                      <Unlink className="w-4 h-4 mr-2" />
                      Disconnect
                    </>
                  ) : (
                    <>
                      <Link className="w-4 h-4 mr-2" />
                      Connect
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {/* Auto Invoicing */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Invoice Settings
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Generate Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically create invoices when jobs are completed
                </p>
              </div>
              <Switch
                checked={settings.autoInvoicing}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoInvoicing: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Auto-Send Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Send invoices to customers automatically after generation
                </p>
              </div>
              <Switch
                checked={settings.autoSendInvoices}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoSendInvoices: checked })
                }
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Invoice Prefix</Label>
                <Input
                  value={settings.invoicePrefix}
                  onChange={(e) =>
                    setSettings({ ...settings, invoicePrefix: e.target.value })
                  }
                  placeholder="INV-"
                />
              </div>

              <div className="space-y-2">
                <Label>Default Tax Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.defaultTaxRate}
                  onChange={(e) =>
                    setSettings({ ...settings, defaultTaxRate: e.target.value })
                  }
                  placeholder="0"
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Settings */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Payment Settings
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Default Payment Terms</Label>
                <Select
                  value={settings.defaultPaymentTerms}
                  onValueChange={(value) =>
                    setSettings({ ...settings, defaultPaymentTerms: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="due_on_receipt">Due on Receipt</SelectItem>
                    <SelectItem value="net15">Net 15</SelectItem>
                    <SelectItem value="net30">Net 30</SelectItem>
                    <SelectItem value="net45">Net 45</SelectItem>
                    <SelectItem value="net60">Net 60</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Sync Frequency</Label>
                <Select
                  value={settings.syncFrequency}
                  onValueChange={(value) =>
                    setSettings({ ...settings, syncFrequency: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border">
                    <SelectItem value="realtime">Real-time</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="manual">Manual Only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notifications
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <Label>Payment Received</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when a payment is received
                </p>
              </div>
              <Switch
                checked={settings.notifyOnPayment}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyOnPayment: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Overdue Invoices</Label>
                <p className="text-sm text-muted-foreground">
                  Get notified when an invoice becomes overdue
                </p>
              </div>
              <Switch
                checked={settings.notifyOnOverdue}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, notifyOnOverdue: checked })
                }
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Settings</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
