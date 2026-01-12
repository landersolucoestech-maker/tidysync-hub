import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Calendar,
  Megaphone,
  Shield,
  Globe,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "available";
}

export function IntegrationsTab() {
  const [integrations, setIntegrations] = useState<Integration[]>([
    // Scheduling
    { id: "google_calendar", name: "Google Calendar", description: "Sync job schedules with Google Calendar", category: "scheduling", icon: <Calendar className="w-5 h-5" />, status: "available" },
    // Lead Sources
    { id: "google_ads", name: "Google Ads", description: "Auto-import leads from Google Ads forms", category: "lead_sources", icon: <Megaphone className="w-5 h-5" />, status: "available" },
    { id: "google_lsa", name: "Google Local Services (LSA)", description: "Auto-import leads from Google Local Services", category: "lead_sources", icon: <Shield className="w-5 h-5" />, status: "available" },
    { id: "website_form", name: "Website Form", description: "Auto-import leads from your website forms", category: "lead_sources", icon: <Globe className="w-5 h-5" />, status: "available" },
  ]);

  const handleConnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: "connected" as const }
        : integration
    ));
    const integration = integrations.find(i => i.id === id);
    toast.success(`${integration?.name} connected successfully!`);
  };

  const handleDisconnectIntegration = (id: string) => {
    setIntegrations(prev => prev.map(integration => 
      integration.id === id 
        ? { ...integration, status: "available" as const }
        : integration
    ));
    const integration = integrations.find(i => i.id === id);
    toast.info(`${integration?.name} disconnected.`);
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
      scheduling: "Schedule",
      lead_sources: "Lead Sources",
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
    <div className="space-y-6">
      {Object.entries(groupedIntegrations).map(([category, items]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {getCategoryLabel(category)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
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
                      <p className="text-sm text-muted-foreground">{integration.description}</p>
                      <div className="mt-1">
                        {getStatusBadge(integration.status)}
                      </div>
                    </div>
                  </div>
                  {integration.status === "connected" ? (
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDisconnectIntegration(integration.id)}
                      >
                        Disconnect
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="default" 
                      size="sm"
                      onClick={() => handleConnectIntegration(integration.id)}
                    >
                      Connect
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
