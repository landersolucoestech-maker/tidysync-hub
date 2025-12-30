import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  scheduleVisibility?: string;
}

interface ViewPermissionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
}

const scheduleVisibilityOptions = [
  { value: "today_tomorrow_6pm", label: "Today + Tomorrow at 6pm" },
  { value: "all_days", label: "All Days" },
  { value: "current_week", label: "Current Week" },
];

const allPermissions = [
  { id: "start_finish", label: "Start/Finish", description: "Can start or finish cleanings", type: "toggle" },
  { id: "view_all_teams", label: "View all teams", description: "View other teams jobs", type: "toggle" },
  { id: "hidden_notes_view", label: "Hidden Notes", description: "View jobs hidden notes", type: "toggle" },
  { id: "hidden_notes_additional", label: "Hidden Notes", description: "Additional Information", type: "toggle" },
  { id: "set_payment", label: "Set Payment", description: "Can set up cleaning payments", type: "toggle" },
  { id: "view_price", label: "View Price", description: "View cleaning prices", type: "toggle" },
  { id: "schedule_visibility", label: "Schedule Visibility", description: "What days are visible for Cleaners", type: "dropdown" },
  { id: "view_schedule", label: "View Schedule", description: "View entire schedule", type: "toggle" },
  { id: "view_clients", label: "View Clients", description: "Access clients page", type: "toggle" },
  { id: "view_contact_info", label: "View Contact Information", description: "View client's contact information", type: "toggle" },
  { id: "view_charges", label: "View Charges", description: "View client's charge and invoice information", type: "toggle" },
  { id: "view_chats", label: "View Chats", description: "Can read client chats", type: "toggle" },
  { id: "reviews", label: "Reviews", description: "Has access to client reviews", type: "toggle" },
  { id: "accounting", label: "Accounting", description: "Has access to company accounting", type: "toggle" },
  { id: "employees", label: "Employees", description: "Can manage employees and profiles", type: "toggle" },
  { id: "system_preferences", label: "System Preferences", description: "Has access to system preferences", type: "toggle" },
  { id: "company_information", label: "Company Information", description: "Has access to company information", type: "toggle" },
  { id: "billing", label: "Billing", description: "Can manage billing information and plans", type: "toggle" },
];

export function ViewPermissionsModal({ open, onOpenChange, role }: ViewPermissionsModalProps) {
  if (!role) return null;

  const hasPermission = (permissionId: string) => {
    return role.permissions.includes("all") || role.permissions.includes(permissionId);
  };

  const getScheduleVisibilityLabel = () => {
    const option = scheduleVisibilityOptions.find(o => o.value === role.scheduleVisibility);
    return option?.label || "Not set";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Permissões: {role.name}
          </DialogTitle>
          <DialogDescription>
            Visualize as permissões atribuídas a esta função
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center gap-2 mb-4">
          <Badge variant={role.permissions.includes("all") ? "default" : "secondary"}>
            {role.permissions.includes("all") ? "Acesso Total" : `${role.permissions.length} permissões ativas`}
          </Badge>
        </div>

        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {allPermissions.map((permission) => {
              const isEnabled = hasPermission(permission.id);
              
              if (permission.type === "dropdown") {
                return (
                  <div
                    key={permission.id}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card"
                  >
                    <div className="flex-1">
                      <Label className="font-medium">{permission.label}</Label>
                      <p className="text-sm text-muted-foreground">{permission.description}</p>
                    </div>
                    <div className="flex items-center">
                      <Badge variant="outline" className="bg-background">
                        {getScheduleVisibilityLabel()}
                      </Badge>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={permission.id}
                  className="flex items-center justify-between p-3 rounded-lg border bg-card"
                >
                  <div className="flex-1">
                    <Label className="font-medium">{permission.label}</Label>
                    <p className="text-sm text-muted-foreground">{permission.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm font-medium ${isEnabled ? "text-green-600" : "text-muted-foreground"}`}>
                      {isEnabled ? "YES" : "NO"}
                    </span>
                    <Switch checked={isEnabled} disabled />
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}