import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Zap, Edit, Send } from "lucide-react";

interface AutomationConfig {
  id: string;
  label: string;
  category: "job" | "invoice";
  trigger: string;
  delayType?: string;
  delayDays?: number;
  hour?: string;
  condition?: string;
  action: string;
  messageTo: string;
  message: string;
  enabled: boolean;
}

export function AutomationsTab() {
  const [automations, setAutomations] = useState<AutomationConfig[]>([
    {
      id: "1",
      label: "On Our Way",
      category: "job",
      trigger: "on_our_way",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\nOur cleaning team is heading your way.\n{CompanyName}",
      enabled: true,
    },
    {
      id: "2",
      label: "Job Started",
      category: "job",
      trigger: "started",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\nYour cleaning has started.\nThank you!\n{CompanyName}",
      enabled: true,
    },
    {
      id: "3",
      label: "Job Finished",
      category: "job",
      trigger: "finished",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\nYour cleaning is completed.\nThank you!\n{CompanyName}",
      enabled: true,
    },
    {
      id: "4",
      label: "Job Date Reminder",
      category: "job",
      trigger: "time_before",
      delayType: "days",
      delayDays: 2,
      hour: "10:00",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\nJust a reminder for your cleaning on {JobDate}.\nIf you have any questions, please contact us.\n{CompanyName}",
      enabled: true,
    },
    {
      id: "5",
      label: "Invoice Payment Reminder",
      category: "invoice",
      trigger: "time_after",
      delayType: "days",
      delayDays: 3,
      hour: "10:00",
      condition: "payment_no",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\nFriendly reminder: your invoice {InvoiceNumber} is still pending.\n{InvoiceLink}\nThank you!\n{CompanyName}",
      enabled: true,
    },
    {
      id: "6",
      label: "Invoice",
      category: "invoice",
      trigger: "invoice_created",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nHere is your cleaning invoice {InvoiceNumber}.\n{InvoiceLink}\n\nThank you!\n– {CompanyName}",
      enabled: true,
    },
    {
      id: "7",
      label: "Receipt",
      category: "invoice",
      trigger: "payment_received",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nHere is your cleaning receipt.\n{ReceiptLink}\n\nThank you!\n– {CompanyName}",
      enabled: true,
    },
    {
      id: "8",
      label: "Job Payment Reminder",
      category: "job",
      trigger: "time_after",
      delayType: "days",
      delayDays: 3,
      hour: "10:00",
      condition: "payment_no",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nFriendly reminder: your cleaning on {JobDate} is still pending for payment.\n\nThank you!\n– {CompanyName}",
      enabled: true,
    },
    {
      id: "9",
      label: "Review Request",
      category: "job",
      trigger: "finished",
      delayType: "days",
      delayDays: 1,
      hour: "10:00",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nPlease review our cleaning on {JobDate}.\n{ReviewLink}\n– {CompanyName}",
      enabled: true,
    },
    {
      id: "10",
      label: "Lead / Estimate",
      category: "job",
      trigger: "estimate_created",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nHere is your estimate.\n{EstimateLink}\n– {CompanyName}",
      enabled: true,
    },
    {
      id: "11",
      label: "Cleaning Agreement",
      category: "job",
      trigger: "contract_created",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nHere is your cleaning agreement.\n{ContractLink}\n– {CompanyName}",
      enabled: true,
    },
    {
      id: "12",
      label: "Cleaning Agreement Signed",
      category: "job",
      trigger: "contract_signed",
      action: "send_message",
      messageTo: "text_phone_1",
      message: "Hi {ClientName}!\n\nHere is your signed cleaning agreement.\n{ContractLink}\n– {CompanyName}",
      enabled: true,
    },
  ]);

  const [editingAutomation, setEditingAutomation] = useState<string | null>(null);

  const handleToggleAutomation = (id: string) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
    toast.success("Automation updated");
  };

  const handleUpdateAutomation = (id: string, field: string, value: any) => {
    setAutomations(automations.map(a => 
      a.id === id ? { ...a, [field]: value } : a
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          Automations
        </CardTitle>
        <CardDescription>
          All automations are enabled by default. Toggle to enable/disable each automation.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {automations.map((automation) => (
          <div key={automation.id} className="border border-border rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${automation.enabled ? "bg-success/10" : "bg-muted"}`}>
                  <Send className={`w-5 h-5 ${automation.enabled ? "text-success" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{automation.label}</h4>
                    <Badge variant="outline" className="text-xs">
                      {automation.enabled ? "Running by default" : "Disabled"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Category: {automation.category === "job" ? "Job" : "Invoice"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setEditingAutomation(editingAutomation === automation.id ? null : automation.id)}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Switch 
                  checked={automation.enabled} 
                  onCheckedChange={() => handleToggleAutomation(automation.id)} 
                />
              </div>
            </div>

            {editingAutomation === automation.id && (
              <div className="border-t border-border pt-4 space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>Trigger</Label>
                    <Select 
                      value={automation.trigger} 
                      onValueChange={(v) => handleUpdateAutomation(automation.id, "trigger", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="on_our_way">On Our Way</SelectItem>
                        <SelectItem value="started">Started</SelectItem>
                        <SelectItem value="finished">Finished</SelectItem>
                        <SelectItem value="time_before">Time Before</SelectItem>
                        <SelectItem value="time_after">Time After</SelectItem>
                        <SelectItem value="invoice_created">Invoice Created</SelectItem>
                        <SelectItem value="payment_received">Payment Received</SelectItem>
                        <SelectItem value="estimate_created">Estimate Created</SelectItem>
                        <SelectItem value="contract_created">Contract Created</SelectItem>
                        <SelectItem value="contract_signed">Contract Signed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {(automation.trigger === "time_before" || automation.trigger === "time_after") && (
                    <>
                      <div className="space-y-2">
                        <Label>Delay Type</Label>
                        <Select 
                          value={automation.delayType || "days"} 
                          onValueChange={(v) => handleUpdateAutomation(automation.id, "delayType", v)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="days">Days</SelectItem>
                            <SelectItem value="hours">Hours</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Days</Label>
                        <Input 
                          type="number" 
                          value={automation.delayDays || 2} 
                          onChange={(e) => handleUpdateAutomation(automation.id, "delayDays", parseInt(e.target.value))}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Hour</Label>
                        <Input 
                          type="time" 
                          value={automation.hour || "10:00"} 
                          onChange={(e) => handleUpdateAutomation(automation.id, "hour", e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {automation.category === "invoice" && (
                    <div className="space-y-2">
                      <Label>Condition</Label>
                      <Select 
                        value={automation.condition || ""} 
                        onValueChange={(v) => handleUpdateAutomation(automation.id, "condition", v)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select condition" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="payment_no">Payment = No</SelectItem>
                          <SelectItem value="payment_yes">Payment = Yes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label>Message To</Label>
                    <Select 
                      value={automation.messageTo} 
                      onValueChange={(v) => handleUpdateAutomation(automation.id, "messageTo", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="text_phone_1">Text Phone 1</SelectItem>
                        <SelectItem value="text_phone_2">Text Phone 2</SelectItem>
                        <SelectItem value="email">Email</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Message</Label>
                  <Textarea 
                    value={automation.message} 
                    onChange={(e) => handleUpdateAutomation(automation.id, "message", e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    Available variables: {"{ClientName}"}, {"{CompanyName}"}, {"{JobDate}"}, {"{InvoiceNumber}"}, {"{InvoiceLink}"}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
