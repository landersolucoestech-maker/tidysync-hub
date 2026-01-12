import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Phone,
  Calendar,
} from "lucide-react";

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  status: "connected" | "disconnected" | "available";
}

export function IntegrationsTab() {
  const [integrations] = useState<Integration[]>([
    // Communication
    { id: "ringcentral", name: "RingCentral", category: "communication", icon: <Phone className="w-5 h-5" />, status: "available" },
    // Scheduling
    { id: "google_calendar", name: "Google Calendar", category: "scheduling", icon: <Calendar className="w-5 h-5" />, status: "connected" },
  ]);

  const handleConnectIntegration = (id: string) => {
    toast.info("Integration connection flow would start here");
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
    </div>
  );
}
