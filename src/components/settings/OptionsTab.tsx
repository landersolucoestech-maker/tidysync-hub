import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Zap,
  MessageSquare,
  Link2,
  FileText,
  Edit,
  Send,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  CreditCard,
  FolderOpen,
  Brain,
  Megaphone,
  Globe,
  CheckCircle,
  XCircle,
  MessageCircle,
  Video,
} from "lucide-react";

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

interface MessageTemplate {
  id: string;
  label: string;
  message: string;
}

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "available";
}

interface Template {
  id: string;
  name: string;
  description: string;
  type: "estimate" | "contract" | "invoice" | "receipt";
}

export function OptionsTab() {
  // Automations State
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

  // Messages State
  const [messages, setMessages] = useState<MessageTemplate[]>([
    { id: "1", label: "Job Date Reminder", message: "Hi {ClientName}!\nJust a reminder for your cleaning on {JobDate}.\n\n– {CompanyName}\n(This is an automated message)" },
    { id: "2", label: "Invoice", message: "Hi {ClientName}!\nHere is your cleaning invoice {InvoiceNumber}.\n{InvoiceLink}\nThank you!\n– {CompanyName}" },
    { id: "3", label: "Receipt", message: "Hi {ClientName}!\nHere is your cleaning receipt.\n{ReceiptLink}\nThank you!\n– {CompanyName}" },
    { id: "4", label: "Job Payment Reminder", message: "Hi {ClientName}!\nFriendly reminder: your cleaning on {JobDate} is still pending for payment.\nThank you!\n– {CompanyName}" },
    { id: "5", label: "Invoice Payment Reminder", message: "Hi {ClientName}!\nFriendly reminder: your invoice {InvoiceNumber} is still pending.\n{InvoiceLink}\nThank you!\n– {CompanyName}" },
    { id: "6", label: "Review Request", message: "Hi {ClientName}!\nPlease review our cleaning on {JobDate}.\n{ReviewLink}\n– {CompanyName}" },
    { id: "7", label: "Lead / Estimate", message: "Hi {ClientName}!\nHere is your estimate.\n{EstimateLink}\n– {CompanyName}" },
    { id: "8", label: "Cleaning Agreement", message: "Hi {ClientName}!\nHere is your cleaning agreement.\n{ContractLink}\n– {CompanyName}" },
    { id: "9", label: "Cleaning Agreement Signed", message: "Hi {ClientName}!\nHere is your signed cleaning agreement.\n{ContractLink}\n– {CompanyName}" },
  ]);

  // Integrations State
  const [integrations] = useState<Integration[]>([
    // Communication
    { id: "twilio", name: "Twilio", category: "communication", icon: <Phone className="w-5 h-5" />, status: "connected" },
    { id: "sendgrid", name: "SendGrid", category: "communication", icon: <Mail className="w-5 h-5" />, status: "disconnected" },
    { id: "ringcentral", name: "RingCentral", category: "communication", icon: <Phone className="w-5 h-5" />, status: "available" },
    { id: "whatsapp", name: "WhatsApp", category: "communication", icon: <MessageCircle className="w-5 h-5" />, status: "available" },
    // Scheduling
    { id: "google_calendar", name: "Google Calendar", category: "scheduling", icon: <Calendar className="w-5 h-5" />, status: "connected" },
    // Marketing & Leads
    { id: "google_ads", name: "Google Ads (Lead Forms)", category: "marketing", icon: <Megaphone className="w-5 h-5" />, status: "available" },
    { id: "google_lsa", name: "Google Local Services (LSA)", category: "marketing", icon: <MapPin className="w-5 h-5" />, status: "available" },
    { id: "facebook_leads", name: "Facebook Leads", category: "marketing", icon: <Globe className="w-5 h-5" />, status: "available" },
    { id: "website_forms", name: "Website Forms", category: "marketing", icon: <FileText className="w-5 h-5" />, status: "connected" },
    // Maps & Distance
    { id: "google_maps", name: "Google Maps", category: "maps", icon: <MapPin className="w-5 h-5" />, status: "connected" },
    { id: "distance_matrix", name: "Distance Matrix", category: "maps", icon: <MapPin className="w-5 h-5" />, status: "connected" },
    // Reviews
    { id: "google_reviews", name: "Google Reviews", category: "reviews", icon: <Star className="w-5 h-5" />, status: "available" },
    { id: "yelp", name: "Yelp", category: "reviews", icon: <Star className="w-5 h-5" />, status: "available" },
    { id: "facebook_reviews", name: "Facebook", category: "reviews", icon: <Star className="w-5 h-5" />, status: "available" },
    // Payments
    { id: "stripe", name: "Stripe", category: "payments", icon: <CreditCard className="w-5 h-5" />, status: "connected" },
    // Storage
    { id: "google_drive", name: "Google Drive", category: "storage", icon: <FolderOpen className="w-5 h-5" />, status: "available" },
    // AI
    { id: "chatgpt", name: "ChatGPT", category: "ai", icon: <Brain className="w-5 h-5" />, status: "available" },
    { id: "claude", name: "Claude", category: "ai", icon: <Brain className="w-5 h-5" />, status: "available" },
    { id: "perplexity", name: "Perplexity", category: "ai", icon: <Brain className="w-5 h-5" />, status: "available" },
    { id: "gemini", name: "Gemini", category: "ai", icon: <Brain className="w-5 h-5" />, status: "available" },
  ]);

  // Templates State
  const [templates] = useState<Template[]>([
    { id: "1", name: "Lead / Estimate Template", description: "Used for sending estimates and converted leads", type: "estimate" },
    { id: "2", name: "Contract Template", description: "Used for contract sending and digital signatures", type: "contract" },
    { id: "3", name: "Invoice Template", description: "Used for billing and charging", type: "invoice" },
    { id: "4", name: "Receipt Template", description: "Used for payment confirmation", type: "receipt" },
  ]);

  const [editingAutomation, setEditingAutomation] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);

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

  const handleUpdateMessage = (id: string, message: string) => {
    setMessages(messages.map(m => 
      m.id === id ? { ...m, message } : m
    ));
  };

  const handleConnectIntegration = (id: string) => {
    toast.info("Integration connection flow would start here");
  };

  const handleEditTemplate = (id: string) => {
    toast.info("Template editor would open here");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "connected":
        return <Badge variant="default" className="bg-success text-success-foreground">Connected</Badge>;
      case "disconnected":
        return <Badge variant="outline" className="text-destructive border-destructive">Disconnected</Badge>;
      default:
        return <Badge variant="secondary">Available</Badge>;
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      communication: "Communication",
      scheduling: "Scheduling",
      marketing: "Marketing & Leads",
      maps: "Maps & Distance",
      reviews: "Reviews",
      payments: "Payments",
      storage: "Storage",
      ai: "AI",
    };
    return labels[category] || category;
  };

  const groupedIntegrations = integrations.reduce((acc, integration) => {
    if (!acc[integration.category]) {
      acc[integration.category] = [];
    }
    acc[integration.category].push(integration);
    return acc;
  }, {} as Record<string, Integration[]>);

  return (
    <Tabs defaultValue="automations" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="automations" className="flex items-center gap-2">
          <Zap className="w-4 h-4" />
          Automations
        </TabsTrigger>
        <TabsTrigger value="messages" className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Messages
        </TabsTrigger>
        <TabsTrigger value="integrations" className="flex items-center gap-2">
          <Link2 className="w-4 h-4" />
          Integrations
        </TabsTrigger>
        <TabsTrigger value="templates" className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          Templates
        </TabsTrigger>
      </TabsList>

      {/* AUTOMATIONS TAB */}
      <TabsContent value="automations" className="space-y-4">
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
      </TabsContent>

      {/* MESSAGES TAB */}
      <TabsContent value="messages" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Messages Library
            </CardTitle>
            <CardDescription>
              Reusable message templates for the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{msg.label}</h4>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setEditingMessage(editingMessage === msg.id ? null : msg.id)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </div>
                
                {editingMessage === msg.id ? (
                  <div className="space-y-2">
                    <Textarea 
                      value={msg.message} 
                      onChange={(e) => handleUpdateMessage(msg.id, e.target.value)}
                      rows={5}
                    />
                    <p className="text-xs text-muted-foreground">
                      Available variables: {"{ClientName}"}, {"{CompanyName}"}, {"{JobDate}"}, {"{InvoiceNumber}"}, {"{InvoiceLink}"}, {"{ReceiptLink}"}, {"{ReviewLink}"}, {"{EstimateLink}"}, {"{ContractLink}"}
                    </p>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        setEditingMessage(null);
                        toast.success("Message saved");
                      }}
                    >
                      Save
                    </Button>
                  </div>
                ) : (
                  <pre className="text-sm text-muted-foreground whitespace-pre-wrap bg-muted/50 p-3 rounded-md">
                    {msg.message}
                  </pre>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* INTEGRATIONS TAB */}
      <TabsContent value="integrations" className="space-y-4">
        {Object.entries(groupedIntegrations).map(([category, items]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryLabel(category)}
              </CardTitle>
              {category === "marketing" && (
                <CardDescription>
                  All leads will be automatically synced to the Leads list.
                </CardDescription>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {items.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${
                        integration.status === "connected" ? "bg-success/10 text-success" : "bg-muted text-muted-foreground"
                      }`}>
                        {integration.icon}
                      </div>
                      <div>
                        <h4 className="font-medium">{integration.name}</h4>
                        {getStatusBadge(integration.status)}
                      </div>
                    </div>
                    <Button 
                      variant={integration.status === "connected" ? "outline" : "default"} 
                      size="sm"
                      onClick={() => handleConnectIntegration(integration.id)}
                    >
                      {integration.status === "connected" ? "Configure" : "Connect"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </TabsContent>

      {/* TEMPLATES TAB */}
      <TabsContent value="templates" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Document Templates
            </CardTitle>
            <CardDescription>
              All templates must include in the header: Company Logo, Company Data, and Customer Data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template) => (
                <div key={template.id} className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-medium">{template.name}</h4>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template.id)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Template
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => toast.info("Preview would open here")}>
                      Preview
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Template Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-medium">Header Requirements (All Templates)</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>Company Logo</li>
                  <li>Company Information</li>
                  <li>Customer Information</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Template Uses</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li><strong>Estimate:</strong> Sending quotes, converted leads</li>
                  <li><strong>Contract:</strong> Contract sending, digital signatures</li>
                  <li><strong>Invoice:</strong> Billing, charging</li>
                  <li><strong>Receipt:</strong> Payment confirmation</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
