import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Shield, Save } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  scheduleVisibility?: string;
}

interface EditRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  role: Role | null;
  onSaveRole: (role: Role) => void;
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

export function EditRoleModal({ open, onOpenChange, role, onSaveRole }: EditRoleModalProps) {
  const [roleName, setRoleName] = useState("");
  const [roleDescription, setRoleDescription] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [scheduleVisibility, setScheduleVisibility] = useState("all_days");

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setRoleDescription(role.description || "");
      setSelectedPermissions(role.permissions);
      setScheduleVisibility(role.scheduleVisibility || "all_days");
    }
  }, [role]);

  const handleTogglePermission = (permissionId: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionId)
        ? prev.filter((p) => p !== permissionId)
        : [...prev, permissionId]
    );
  };

  const handleSubmit = () => {
    if (!roleName.trim()) {
      toast.error("Digite um nome para a função");
      return;
    }

    if (!role) return;

    const updatedRole: Role = {
      ...role,
      name: roleName,
      description: roleDescription || undefined,
      permissions: selectedPermissions,
      scheduleVisibility,
    };

    onSaveRole(updatedRole);
    onOpenChange(false);
    toast.success(`Função "${roleName}" atualizada com sucesso!`);
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  if (!role) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Editar Função
          </DialogTitle>
          <DialogDescription>
            Edite o nome, descrição e as permissões da função
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="roleName">Nome da Função</Label>
            <Input
              id="roleName"
              value={roleName}
              onChange={(e) => setRoleName(e.target.value)}
              placeholder="Ex: Cleaner, Supervisor, Manager..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="roleDescription">Descrição (opcional)</Label>
            <Textarea
              id="roleDescription"
              value={roleDescription}
              onChange={(e) => setRoleDescription(e.target.value)}
              placeholder="Descreva as responsabilidades desta função..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label>Permissões</Label>
            <ScrollArea className="h-[300px] pr-4 border rounded-lg p-2">
              <div className="space-y-2">
                {allPermissions.map((permission) => {
                  if (permission.type === "dropdown") {
                    return (
                      <div
                        key={permission.id}
                        className="flex items-center justify-between p-3 rounded-lg border bg-card"
                      >
                        <div className="flex-1 mr-4">
                          <Label className="font-medium">{permission.label}</Label>
                          <p className="text-sm text-muted-foreground">{permission.description}</p>
                        </div>
                        <Select value={scheduleVisibility} onValueChange={setScheduleVisibility}>
                          <SelectTrigger className="w-[180px] bg-background">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-popover z-50">
                            {scheduleVisibilityOptions.map((option) => (
                              <SelectItem key={option.value} value={option.value}>
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    );
                  }

                  const isEnabled = selectedPermissions.includes(permission.id) || selectedPermissions.includes("all");
                  return (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <Label className="font-medium cursor-pointer" onClick={() => handleTogglePermission(permission.id)}>
                          {permission.label}
                        </Label>
                        <p className="text-sm text-muted-foreground">{permission.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isEnabled ? "text-green-600" : "text-muted-foreground"}`}>
                          {isEnabled ? "YES" : "NO"}
                        </span>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={() => handleTogglePermission(permission.id)}
                          disabled={selectedPermissions.includes("all")}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} className="bg-primary hover:bg-primary/90">
            <Save className="w-4 h-4 mr-2" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
