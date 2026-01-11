import { useState, useEffect, useRef } from "react";
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
import { Trash2, RefreshCw, Upload, X, User } from "lucide-react";
import { toast } from "sonner";

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "inactive";
  phone?: string;
  username?: string;
  profileImage?: string;
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
  profileImage: string;
  profileImageFile: File | null;
}

// Generate a random password
const generatePassword = (): string => {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

const getInitialFormData = (): FormData => ({
  id: Date.now().toString(),
  fullName: "",
  email: "",
  phoneNumber: "",
  username: "",
  password: generatePassword(),
  role: "",
  profileImage: "",
  profileImageFile: null,
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
  const imageInputRef = useRef<HTMLInputElement>(null);

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
        profileImage: user.profileImage || "",
        profileImageFile: null,
      });
    } else if (mode === "create") {
      setFormData(getInitialFormData());
    }
  }, [mode, user, open]);

  const handleChange = <K extends keyof FormData>(field: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegeneratePassword = () => {
    handleChange("password", generatePassword());
    toast.success("New password generated!");
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profileImage: reader.result as string,
          profileImageFile: file,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData((prev) => ({
      ...prev,
      profileImage: "",
      profileImageFile: null,
    }));
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (mode === "create" && !formData.username) {
      toast.error("Username is required");
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
      profileImage: formData.profileImage,
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
          {/* Profile Image Upload */}
          <div className="space-y-2">
            <Label>Profile Image</Label>
            <div className="flex items-center gap-4">
              <div className="relative">
                {formData.profileImage ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-border">
                    <img 
                      src={formData.profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
                    <User className="w-8 h-8 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <input
                  type="file"
                  ref={imageInputRef}
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  className="gap-2"
                >
                  <Upload className="w-4 h-4" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground mt-1">
                  JPG, PNG or GIF. Max 5MB.
                </p>
              </div>
            </div>
          </div>

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

          {/* Password - Auto-generated and visible */}
          {mode === "create" && (
            <div className="space-y-2">
              <Label>Password (Auto-generated)</Label>
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Auto-generated password"
                  className="font-mono"
                  readOnly
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleRegeneratePassword}
                  title="Generate new password"
                >
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                This password will be sent to the user. They must change it on first login.
              </p>
            </div>
          )}

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
