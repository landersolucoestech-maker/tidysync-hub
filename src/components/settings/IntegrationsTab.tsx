import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
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
  MessageCircle,
  FileText,
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
    <div className="space-y-6">
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
