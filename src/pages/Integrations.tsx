import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Globe,
  CreditCard,
  Smartphone,
  Mail,
  Zap,
  Calendar,
  DollarSign,
  Users,
  Settings,
  Plus,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  Star,
  HardDrive,
  Megaphone,
} from "lucide-react";
import { toast } from "sonner";
import { QBSettingsModal } from "@/components/billing/QBSettingsModal";

export function Integrations() {
  const [quickbooksEnabled, setQuickbooksEnabled] = useState(true);
  const [twilioEnabled, setTwilioEnabled] = useState(true);
  const [zapierWebhook, setZapierWebhook] = useState("");
  const [autoInvoicing, setAutoInvoicing] = useState(true);
  const [qbSettingsOpen, setQbSettingsOpen] = useState(false);
  const [googleWorkspaceConnected, setGoogleWorkspaceConnected] = useState(false);

  const handleConnectGoogleWorkspace = () => {
    // Simulate OAuth connection flow
    setGoogleWorkspaceConnected(true);
    toast.success("Google Workspace connected successfully! Gmail, Calendar, Reviews, Ads, and Drive are now linked.");
  };

  const handleDisconnectGoogleWorkspace = () => {
    setGoogleWorkspaceConnected(false);
    toast.info("Google Workspace disconnected.");
  };

  const integrations = {
    accounting: [
      {
        name: "QuickBooks Online",
        description: "Automatic invoice sync, expense tracking, and financial reporting",
        icon: CreditCard,
        status: "connected",
        features: ["Auto Invoice Generation", "Expense Tracking", "Tax Reports", "Payment Sync"],
        enabled: quickbooksEnabled,
        onToggle: setQuickbooksEnabled
      },
      {
        name: "Xero",
        description: "Cloud-based accounting software integration",
        icon: DollarSign,
        status: "available",
        features: ["Invoice Management", "Bank Reconciliation", "Financial Reports"],
        enabled: false
      }
    ],
    communication: [
      {
        name: "Twilio SMS",
        description: "Send automated SMS notifications to customers and staff",
        icon: Smartphone,
        status: "connected",
        features: ["Job Reminders", "Appointment Confirmations", "Payment Alerts"],
        enabled: twilioEnabled,
        onToggle: setTwilioEnabled
      },
      {
        name: "Mailchimp",
        description: "Email marketing campaigns and customer newsletters",
        icon: Mail,
        status: "available",
        features: ["Email Campaigns", "Customer Segmentation", "Analytics"],
        enabled: false
      },
      {
        name: "SendGrid",
        description: "Transactional email delivery service",
        icon: Mail,
        status: "available",
        features: ["Invoice Emails", "Receipt Delivery", "Notifications"],
        enabled: false
      }
    ],
    automation: [
      {
        name: "Zapier",
        description: "Connect with 5000+ apps to automate workflows",
        icon: Zap,
        status: "configured",
        features: ["Workflow Automation", "Data Sync", "Custom Triggers"],
        enabled: true,
        webhookUrl: zapierWebhook
      },
      {
        name: "Microsoft Power Automate",
        description: "Automate business processes with Microsoft tools",
        icon: Settings,
        status: "available",
        features: ["Office 365 Integration", "SharePoint Sync", "Teams Notifications"],
        enabled: false
      }
    ],
    scheduling: [
      {
        name: "Calendly",
        description: "Online booking and scheduling integration",
        icon: Clock,
        status: "available",
        features: ["Online Booking", "Availability Management", "Buffer Times"],
        enabled: false
      }
    ],
    google: [
      {
        name: "Gmail",
        description: "Email communication and notifications",
        icon: Mail,
        status: googleWorkspaceConnected ? "connected" : "available",
        features: ["Email Sync", "Customer Communication", "Notifications"],
        enabled: googleWorkspaceConnected,
        isGoogleService: true
      },
      {
        name: "Google Calendar",
        description: "Sync appointments with Google Calendar",
        icon: Calendar,
        status: googleWorkspaceConnected ? "connected" : "available",
        features: ["Two-way Sync", "Availability Checking", "Meeting Links"],
        enabled: googleWorkspaceConnected,
        isGoogleService: true
      },
      {
        name: "Google Reviews",
        description: "Manage and respond to customer reviews",
        icon: Star,
        status: googleWorkspaceConnected ? "connected" : "available",
        features: ["Review Monitoring", "Auto Responses", "Rating Analytics"],
        enabled: googleWorkspaceConnected,
        isGoogleService: true
      },
      {
        name: "Google Ads",
        description: "Manage advertising campaigns",
        icon: Megaphone,
        status: googleWorkspaceConnected ? "connected" : "available",
        features: ["Campaign Management", "Lead Tracking", "ROI Analytics"],
        enabled: googleWorkspaceConnected,
        isGoogleService: true
      },
      {
        name: "Google Drive",
        description: "Cloud storage for documents and files",
        icon: HardDrive,
        status: googleWorkspaceConnected ? "connected" : "available",
        features: ["Document Storage", "File Sharing", "Backup"],
        enabled: googleWorkspaceConnected,
        isGoogleService: true
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "connected": return "default";
      case "configured": return "secondary";
      case "available": return "outline";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "connected": return <CheckCircle className="w-4 h-4 text-success" />;
      case "configured": return <Settings className="w-4 h-4 text-primary" />;
      case "available": return <Plus className="w-4 h-4 text-muted-foreground" />;
      default: return <AlertCircle className="w-4 h-4 text-warning" />;
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Integrations</h1>
              <p className="text-muted-foreground">
                Connect your favorite tools and automate your cleaning business
              </p>
            </div>
            <Button variant="hero" size="lg" className="flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Browse All Apps</span>
            </Button>
          </div>

          {/* Integration Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Integrations</p>
                    <p className="text-2xl font-bold text-foreground">5</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-success" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Available Apps</p>
                    <p className="text-2xl font-bold text-foreground">15+</p>
                  </div>
                  <Globe className="w-8 h-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Automated Tasks</p>
                    <p className="text-2xl font-bold text-foreground">238</p>
                  </div>
                  <Zap className="w-8 h-8 text-warning" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Time Saved</p>
                    <p className="text-2xl font-bold text-foreground">12h</p>
                  </div>
                  <Clock className="w-8 h-8 text-accent" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* QB Settings Modal */}
          <QBSettingsModal open={qbSettingsOpen} onOpenChange={setQbSettingsOpen} />

          {/* Integration Categories */}
          <Tabs defaultValue="google" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="google">Google Workspace</TabsTrigger>
              <TabsTrigger value="accounting">Accounting</TabsTrigger>
              <TabsTrigger value="communication">Communication</TabsTrigger>
              <TabsTrigger value="automation">Automation</TabsTrigger>
              <TabsTrigger value="scheduling">Scheduling</TabsTrigger>
            </TabsList>

            {/* Google Workspace Tab */}
            <TabsContent value="google" className="space-y-4">
              {/* Google Workspace Connection Card */}
              <Card className={`border-2 ${googleWorkspaceConnected ? 'border-success/50 bg-success/5' : 'border-primary/20 bg-primary/5'}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-3 rounded-lg ${googleWorkspaceConnected ? 'bg-success/10' : 'bg-primary/10'}`}>
                        <Mail className={`w-6 h-6 ${googleWorkspaceConnected ? 'text-success' : 'text-primary'}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">Google Workspace Integration</h3>
                        <p className="text-sm text-muted-foreground">
                          Connect your Gmail account to automatically link Calendar, Reviews, Ads, and Drive
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {googleWorkspaceConnected ? "Connected" : "Not Connected"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {googleWorkspaceConnected ? "5 services linked" : "Click to connect"}
                        </p>
                      </div>
                      {googleWorkspaceConnected ? (
                        <Button variant="outline" size="sm" onClick={handleDisconnectGoogleWorkspace}>
                          Disconnect
                        </Button>
                      ) : (
                        <Button variant="hero" size="sm" onClick={handleConnectGoogleWorkspace}>
                          <Plus className="w-4 h-4 mr-1" />
                          Connect Gmail
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Google Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {integrations.google.map((integration) => {
                  const IconComponent = integration.icon;
                  return (
                    <Card key={integration.name} className={`relative ${googleWorkspaceConnected ? 'border-success/20' : ''}`}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`p-3 rounded-lg ${googleWorkspaceConnected ? 'bg-success/10' : 'bg-primary/10'}`}>
                              <IconComponent className={`w-6 h-6 ${googleWorkspaceConnected ? 'text-success' : 'text-primary'}`} />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="flex items-center space-x-2">
                          {googleWorkspaceConnected ? (
                            <>
                              <CheckCircle className="w-4 h-4 text-success" />
                              <Badge variant="default" className="bg-success text-success-foreground">Connected</Badge>
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 text-muted-foreground" />
                              <Badge variant="outline">Available</Badge>
                            </>
                          )}
                        </div>

                        <div>
                          <h4 className="text-sm font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {integration.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {googleWorkspaceConnected ? (
                            <Button variant="outline" size="sm" className="w-full">
                              <Settings className="w-4 h-4 mr-1" />
                              Configure
                            </Button>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full"
                              onClick={handleConnectGoogleWorkspace}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Connect via Gmail
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {/* Accounting Tab with QuickBooks Auto-Invoicing Card */}
            <TabsContent value="accounting" className="space-y-4">
              {/* QuickBooks Auto-Invoicing Card */}
              <Card className="border-primary/20 bg-primary/5">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Zap className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">QuickBooks Auto-Invoicing</h3>
                        <p className="text-sm text-muted-foreground">
                          Automatically generate and send invoices when cleaning jobs are completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {autoInvoicing ? "Active" : "Inactive"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {autoInvoicing ? "Connected to QuickBooks" : "Disconnected"}
                        </p>
                      </div>
                      <Switch
                        checked={autoInvoicing}
                        onCheckedChange={setAutoInvoicing}
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setQbSettingsOpen(true)}
                      >
                        <Settings className="w-4 h-4 mr-1" />
                        QB Settings
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {integrations.accounting.map((integration) => {
                  const IconComponent = integration.icon;
                  return (
                    <Card key={integration.name} className="relative">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="p-3 bg-primary/10 rounded-lg">
                              <IconComponent className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{integration.name}</CardTitle>
                              <p className="text-sm text-muted-foreground">
                                {integration.description}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(integration.status)}
                            <Badge variant={getStatusColor(integration.status)}>
                              {integration.status}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium mb-2">Features</h4>
                          <div className="flex flex-wrap gap-2">
                            {integration.features.map((feature) => (
                              <Badge key={feature} variant="outline" className="text-xs">
                                {feature}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          {integration.onToggle && (
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={integration.enabled}
                                onCheckedChange={integration.onToggle}
                              />
                              <span className="text-sm">
                                {integration.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </div>
                          )}
                          
                          <div className="flex space-x-2">
                            {integration.status === "connected" || integration.status === "configured" ? (
                              <>
                                <Button variant="outline" size="sm">
                                  <Settings className="w-4 h-4 mr-1" />
                                  Configure
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <ExternalLink className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                              </>
                            ) : (
                              <Button variant="outline" size="sm" className="w-full">
                                <Plus className="w-4 h-4 mr-1" />
                                Connect
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            {Object.entries(integrations).filter(([category]) => category !== 'accounting' && category !== 'google').map(([category, apps]) => (
              <TabsContent key={category} value={category} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {apps.map((integration) => {
                    const IconComponent = integration.icon;
                    return (
                      <Card key={integration.name} className="relative">
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="p-3 bg-primary/10 rounded-lg">
                                <IconComponent className="w-6 h-6 text-primary" />
                              </div>
                              <div>
                                <CardTitle className="text-lg">{integration.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">
                                  {integration.description}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              {getStatusIcon(integration.status)}
                              <Badge variant={getStatusColor(integration.status)}>
                                {integration.status}
                              </Badge>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          <div>
                            <h4 className="text-sm font-medium mb-2">Features</h4>
                            <div className="flex flex-wrap gap-2">
                              {integration.features.map((feature) => (
                                <Badge key={feature} variant="outline" className="text-xs">
                                  {feature}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {integration.name === "Zapier" && integration.status === "configured" && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Webhook URL</label>
                              <Input
                                value={zapierWebhook}
                                onChange={(e) => setZapierWebhook(e.target.value)}
                                placeholder="https://hooks.zapier.com/hooks/catch/..."
                              />
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-2">
                            {integration.onToggle && (
                              <div className="flex items-center space-x-2">
                                <Switch
                                  checked={integration.enabled}
                                  onCheckedChange={integration.onToggle}
                                />
                                <span className="text-sm">
                                  {integration.enabled ? "Enabled" : "Disabled"}
                                </span>
                              </div>
                            )}
                            
                            <div className="flex space-x-2">
                              {integration.status === "connected" || integration.status === "configured" ? (
                                <>
                                  <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-1" />
                                    Configure
                                  </Button>
                                  <Button variant="ghost" size="sm">
                                    <ExternalLink className="w-4 h-4 mr-1" />
                                    View
                                  </Button>
                                </>
                              ) : (
                                <Button variant="outline" size="sm" className="w-full">
                                  <Plus className="w-4 h-4 mr-1" />
                                  Connect
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </div>
  );
}