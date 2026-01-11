import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
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

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "inactive";
  phone?: string;
  username?: string;
  
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

const FUNCTION_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "cleaner", label: "Cleaner" },
  { value: "driver", label: "Driver" },
  { value: "cleaning_manager", label: "Cleaning Manager Team" },
  { value: "office_manager", label: "Office Manager" },
  { value: "virtual_assistant", label: "Virtual Assistant" },
];


interface FormData {
  id: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  username: string;
  password: string;
  role: string;
  
}

const getInitialFormData = (): FormData => ({
  id: Date.now().toString(),
  fullName: "",
  email: "",
  phoneNumber: "",
  username: "",
  password: "",
  role: "",
  
});

export function TeamUserModal({
  open,
  onOpenChange,
  mode,
  user,
  roles,
  onSave,
  onDelete,
}: TeamUserModalProps) {
  const [formData, setFormData] = useState<FormData>(getInitialFormData());

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        id: user.id,
        fullName: user.name,
        email: user.email,
        phoneNumber: user.phone || "",
        username: user.username || "",
        password: "",
        role: user.role,
        
      });
    } else if (mode === "create") {
      setFormData(getInitialFormData());
    }
  }, [mode, user, open]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "create" && !formData.password) {
      toast.error("Password is required for new team members");
      return;
    }

    const teamMember: TeamMember = {
      id: formData.id,
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      status: "active",
      phone: formData.phoneNumber,
      username: formData.username,
      
    };

    onSave(teamMember);
    toast.success(
      mode === "create" 
        ? "Team member created successfully!" 
        : "Team member updated successfully!"
    );
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (user && onDelete) {
      onDelete(user.id);
      toast.success("Team member deleted successfully!");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Team Member" : "Edit Team Member"}
          </DialogTitle>
          <DialogDescription>
            Fill in the team member information below
          </DialogDescription>
        </DialogHeader>

        <form id="team-user-form" onSubmit={handleSubmit} className="space-y-4 py-4">
          {/* Role */}
          <div className="space-y-2">
            <Label>Role *</Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange("role", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {FUNCTION_ROLES.map((role) => (
                  <SelectItem key={role.value} value={role.value}>
                    {role.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label>Full Name *</Label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              placeholder="Enter full name"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email *</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="Enter email address"
              required
            />
          </div>

          {/* Phone Number */}
          <div className="space-y-2">
            <Label>Phone Number</Label>
            <Input
              value={formData.phoneNumber}
              onChange={(e) => handleChange("phoneNumber", e.target.value)}
              placeholder="(000) 000-0000"
            />
          </div>

          {/* Login (Username) */}
          <div className="space-y-2">
            <Label>Login (Username) *</Label>
            <Input
              value={formData.username}
              onChange={(e) => handleChange("username", e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>{mode === "create" ? "Password *" : "Password (leave blank to keep current)"}</Label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) => handleChange("password", e.target.value)}
              placeholder={mode === "create" ? "Enter password" : "Enter new password"}
              required={mode === "create"}
            />
          </div>

        </form>

        <DialogFooter className="flex justify-between sm:justify-between">
          {mode === "edit" && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive" size="icon">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Delete Team Member</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete this team member? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
          <div className="flex gap-2 ml-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form="team-user-form">
              {mode === "create" ? "Add Member" : "Save Changes"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
