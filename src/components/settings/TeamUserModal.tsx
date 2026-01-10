import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useLanguage } from "@/contexts/LanguageContext";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "inactive";
  phone?: string;
  country?: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface TeamUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  user: TeamMember | null;
  roles: Role[];
  onSave: (user: TeamMember) => void;
  onDelete?: (userId: string) => void;
}

export function TeamUserModal({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  onSave,
  onDelete,
}: TeamUserModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<TeamMember>({
    id: "",
    name: "",
    email: "",
    role: "",
    status: "pending",
    phone: "",
    country: "United States",
  });

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        ...user,
        phone: user.phone || "",
        country: user.country || "United States",
      });
    } else if (mode === "create") {
      setFormData({
        id: Date.now().toString(),
        name: "",
        email: "",
        role: "",
        status: "pending",
        phone: "",
        country: "United States",
      });
    }
  }, [mode, user, open]);

  const handleChange = (field: keyof TeamMember, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.role) {
      toast.error(t("settings.fillRequiredFields") || "Please fill in all required fields");
      return;
    }

    onSave(formData);
    toast.success(
      mode === "create" 
        ? t("settings.userCreated") || "User created successfully!" 
        : t("settings.userUpdated") || "User updated successfully!"
    );
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (user && onDelete) {
      onDelete(user.id);
      toast.success(t("settings.userDeleted") || "User deleted successfully!");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? t("settings.addTeamMember") || "Add Team Member" : t("settings.editTeamMember") || "Edit Team Member"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="country">{t("common.country") || "Country"} *</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => handleChange("country", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("settings.selectCountry") || "Select country"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="United States">United States</SelectItem>
                <SelectItem value="Brazil">Brazil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">{t("settings.fullName") || "Full Name"} *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder={t("settings.enterFullName") || "Enter full name"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("common.email") || "Email"} *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder={t("settings.enterEmail") || "Enter email address"}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">{t("common.phone") || "Phone"}</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder={formData.country === "Brazil" ? "(00) 00000-0000" : "(000) 000-0000"}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="role">{t("common.role") || "Role"} *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("settings.selectRole") || "Select role"} />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">{t("common.status") || "Status"}</Label>
            <Select
              value={formData.status}
              onValueChange={(value) => handleChange("status", value as TeamMember["status"])}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("common.selectStatus") || "Select status"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">{t("common.active") || "Active"}</SelectItem>
                <SelectItem value="pending">{t("settings.pending") || "Pending"}</SelectItem>
                <SelectItem value="inactive">{t("common.inactive") || "Inactive"}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter className="flex justify-between gap-3 pt-4">
            {mode === "edit" && onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button type="button" variant="destructive">
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t("common.delete") || "Delete"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>{t("settings.confirmDelete") || "Confirm Deletion"}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t("settings.deleteUserWarning") || `Are you sure you want to delete ${user?.name}? This action cannot be undone.`}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t("common.cancel") || "Cancel"}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      {t("common.delete") || "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}

            <div className="flex gap-3 ml-auto">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                {t("common.cancel") || "Cancel"}
              </Button>
              <Button type="submit">
                {mode === "create" ? t("settings.addMember") || "Add Member" : t("common.save") || "Save"}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
