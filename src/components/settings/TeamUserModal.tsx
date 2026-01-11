import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { DatePickerString } from "@/components/ui/date-picker";
import { Trash2, Upload, FileText, X } from "lucide-react";
import { toast } from "sonner";

// Extended interface for full team member data
interface TeamMemberFormData {
  id: string;
  country: "United States" | "Brazil";
  fullName: string;
  dateOfBirth: string;
  phoneNumber: string;
  email: string;
  address: string;
  // US specific
  ssnItin?: string;
  shoeSize?: string;
  // Brazil specific
  cpf?: string;
  rg?: string;
  // Documents
  contractFile?: File | null;
  contractFileName?: string;
  w9File?: File | null;
  w9FileName?: string;
  // Employment
  dateStarted: string;
  role: string;
  paymentType: "zelle" | "wire_transfer" | "quickbooks" | "";
  // Zelle fields
  zelleKey?: string;
  zelleHolderName?: string;
  // Wire transfer fields (US)
  bankName?: string;
  accountNumber?: string;
  routingNumber?: string;
  branch?: string;
  // Wire transfer fields (Brazil)
  pixKey?: string;
  pixHolderName?: string;
  // Payment rate
  paymentRate: "fixed" | "hourly" | "daily" | "per_job" | "";
  paymentRateValue?: string;
  // Status
  status: "active" | "inactive";
}

// Simplified interface for parent component compatibility
export interface TeamMember {
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

const FUNCTION_ROLES = [
  { value: "admin", label: "Admin" },
  { value: "cleaner", label: "Cleaner" },
  { value: "driver", label: "Driver" },
  { value: "cleaning_manager", label: "Cleaning Manager Team" },
  { value: "office_manager", label: "Office Manager" },
  { value: "virtual_assistant", label: "Virtual Assistant" },
];

const getInitialFormData = (): TeamMemberFormData => ({
  id: Date.now().toString(),
  country: "United States",
  fullName: "",
  dateOfBirth: "",
  phoneNumber: "",
  email: "",
  address: "",
  ssnItin: "",
  shoeSize: "",
  cpf: "",
  rg: "",
  contractFile: null,
  contractFileName: "",
  w9File: null,
  w9FileName: "",
  dateStarted: "",
  role: "",
  paymentType: "wire_transfer",
  zelleKey: "",
  zelleHolderName: "",
  bankName: "",
  accountNumber: "",
  routingNumber: "",
  branch: "",
  pixKey: "",
  pixHolderName: "",
  paymentRate: "",
  paymentRateValue: "",
  status: "active",
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
  const [formData, setFormData] = useState<TeamMemberFormData>(getInitialFormData());
  
  const contractInputRef = useRef<HTMLInputElement>(null);
  const w9InputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (mode === "edit" && user) {
      setFormData({
        ...getInitialFormData(),
        id: user.id,
        fullName: user.name,
        email: user.email,
        role: user.role,
        status: user.status === "pending" ? "active" : user.status,
        phoneNumber: user.phone || "",
        country: (user.country as "United States" | "Brazil") || "United States",
      });
    } else if (mode === "create") {
      setFormData(getInitialFormData());
    }
  }, [mode, user, open]);

  const handleChange = <K extends keyof TeamMemberFormData>(field: K, value: TeamMemberFormData[K]) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      
      // Reset payment type fields when country changes
      if (field === "country") {
        // Default to Wire Transfer so os detalhes bancários já aparecem
        updated.paymentType = "wire_transfer";
        updated.zelleKey = "";
        updated.zelleHolderName = "";
        updated.bankName = "";
        updated.accountNumber = "";
        updated.routingNumber = "";
        updated.branch = "";
        updated.pixKey = "";
        updated.pixHolderName = "";
      }
      
      // Reset payment-specific fields when payment type changes
      if (field === "paymentType") {
        updated.zelleKey = "";
        updated.zelleHolderName = "";
        updated.bankName = "";
        updated.accountNumber = "";
        updated.routingNumber = "";
        updated.branch = "";
      }
      
      return updated;
    });
  };

  const handleFileChange = (field: "contractFile" | "w9File", file: File | null) => {
    const fileNameField = field === "contractFile" ? "contractFileName" : "w9FileName";
    setFormData((prev) => ({
      ...prev,
      [field]: file,
      [fileNameField]: file?.name || "",
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.role) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Convert to simplified TeamMember for parent
    const teamMember: TeamMember = {
      id: formData.id,
      name: formData.fullName,
      email: formData.email,
      role: formData.role,
      status: formData.status,
      phone: formData.phoneNumber,
      country: formData.country,
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

  const renderFileUpload = (
    label: string,
    field: "contractFile" | "w9File",
    inputRef: React.RefObject<HTMLInputElement>
  ) => {
    const fileName = field === "contractFile" ? formData.contractFileName : formData.w9FileName;
    
    return (
      <div className="space-y-2">
        <Label>{label}</Label>
        <input
          type="file"
          ref={inputRef}
          accept=".pdf"
          className="hidden"
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
        />
        {fileName ? (
          <div className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
            <FileText className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm flex-1 truncate">{fileName}</span>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0"
              onClick={() => handleFileChange(field, null)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            className="w-full justify-start gap-2"
            onClick={() => inputRef.current?.click()}
          >
            <Upload className="w-4 h-4" />
            Upload PDF
          </Button>
        )}
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Add Team Member" : "Edit Team Member"}
          </DialogTitle>
          <DialogDescription>
            Fill in the team member information below
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <form id="team-user-form" onSubmit={handleSubmit} className="space-y-4 py-4">
            {/* Country Selection */}
            <div className="space-y-2">
              <Label>Country *</Label>
              <Select
                value={formData.country}
                onValueChange={(value) => handleChange("country", value as "United States" | "Brazil")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select country" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="United States">United States (US)</SelectItem>
                  <SelectItem value="Brazil">Brasil</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <Label>Full Name *</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) => handleChange("fullName", e.target.value)}
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <DatePickerString
                  value={formData.dateOfBirth}
                  onChange={(value) => handleChange("dateOfBirth", value)}
                  placeholder="Select date"
                />
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input
                  value={formData.phoneNumber}
                  onChange={(e) => handleChange("phoneNumber", e.target.value)}
                  placeholder={formData.country === "Brazil" ? "(00) 00000-0000" : "(000) 000-0000"}
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Email *</Label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div className="space-y-2 col-span-2">
                <Label>Address</Label>
                <Input
                  value={formData.address}
                  onChange={(e) => handleChange("address", e.target.value)}
                  placeholder="Enter address"
                />
              </div>

              {/* US Specific Fields */}
              {formData.country === "United States" && (
                <>
                  <div className="space-y-2">
                    <Label>SSN/ITIN</Label>
                    <Input
                      value={formData.ssnItin}
                      onChange={(e) => handleChange("ssnItin", e.target.value)}
                      placeholder="XXX-XX-XXXX"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Shoe Size</Label>
                    <Input
                      value={formData.shoeSize}
                      onChange={(e) => handleChange("shoeSize", e.target.value)}
                      placeholder="Enter shoe size"
                    />
                  </div>
                </>
              )}

              {/* Brazil Specific Fields */}
              {formData.country === "Brazil" && (
                <>
                  <div className="space-y-2">
                    <Label>CPF</Label>
                    <Input
                      value={formData.cpf}
                      onChange={(e) => handleChange("cpf", e.target.value)}
                      placeholder="000.000.000-00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>RG</Label>
                    <Input
                      value={formData.rg}
                      onChange={(e) => handleChange("rg", e.target.value)}
                      placeholder="Enter RG"
                    />
                  </div>
                </>
              )}
            </div>

            {/* Document Uploads */}
            <div className="grid grid-cols-2 gap-4">
              {renderFileUpload("Contract (PDF)", "contractFile", contractInputRef)}
              {renderFileUpload("W-9 Form (PDF)", "w9File", w9InputRef)}
            </div>

            {/* Employment Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date Started</Label>
                <DatePickerString
                  value={formData.dateStarted}
                  onChange={(value) => handleChange("dateStarted", value)}
                  placeholder="Select date"
                />
              </div>

              <div className="space-y-2">
                <Label>Role/Function *</Label>
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
            </div>

            {/* Payment Type */}
            <div className="space-y-2">
              <Label>Payment Type</Label>
              {formData.country === "United States" ? (
                <Select
                  value={formData.paymentType}
                  onValueChange={(value) => handleChange("paymentType", value as TeamMemberFormData["paymentType"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zelle">Zelle</SelectItem>
                    <SelectItem value="wire_transfer">Wire Transfer</SelectItem>
                    <SelectItem value="quickbooks">QuickBooks</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Input value="Wire Transfer" disabled className="bg-muted" />
              )}
            </div>

            {/* Zelle Fields (US only) */}
            {formData.country === "United States" && formData.paymentType === "zelle" && (
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label>Zelle Key</Label>
                  <Input
                    value={formData.zelleKey}
                    onChange={(e) => handleChange("zelleKey", e.target.value)}
                    placeholder="Email or phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Zelle Holder Name</Label>
                  <Input
                    value={formData.zelleHolderName}
                    onChange={(e) => handleChange("zelleHolderName", e.target.value)}
                    placeholder="Account holder name"
                  />
                </div>
              </div>
            )}

            {/* Wire Transfer Fields (US) */}
            {formData.country === "United States" && formData.paymentType === "wire_transfer" && (
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => handleChange("accountNumber", e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Routing Number</Label>
                  <Input
                    value={formData.routingNumber}
                    onChange={(e) => handleChange("routingNumber", e.target.value)}
                    placeholder="Enter routing number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Branch</Label>
                  <Input
                    value={formData.branch}
                    onChange={(e) => handleChange("branch", e.target.value)}
                    placeholder="Enter branch"
                  />
                </div>
              </div>
            )}

            {/* Wire Transfer Fields (Brazil) */}
            {formData.country === "Brazil" && (
              <div className="grid grid-cols-2 gap-4 p-4 border rounded-lg bg-muted/30">
                <div className="space-y-2">
                  <Label>Bank Name</Label>
                  <Input
                    value={formData.bankName}
                    onChange={(e) => handleChange("bankName", e.target.value)}
                    placeholder="Enter bank name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Branch (Agência)</Label>
                  <Input
                    value={formData.branch}
                    onChange={(e) => handleChange("branch", e.target.value)}
                    placeholder="Enter branch"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Account Number</Label>
                  <Input
                    value={formData.accountNumber}
                    onChange={(e) => handleChange("accountNumber", e.target.value)}
                    placeholder="Enter account number"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Pix Key</Label>
                  <Input
                    value={formData.pixKey}
                    onChange={(e) => handleChange("pixKey", e.target.value)}
                    placeholder="CPF, email, phone or random key"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label>Pix Holder Name</Label>
                  <Input
                    value={formData.pixHolderName}
                    onChange={(e) => handleChange("pixHolderName", e.target.value)}
                    placeholder="Account holder name"
                  />
                </div>
              </div>
            )}

            {/* Payment Rate */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Rate Type</Label>
                <Select
                  value={formData.paymentRate}
                  onValueChange={(value) => handleChange("paymentRate", value as TeamMemberFormData["paymentRate"])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rate type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed (Valor Fixo)</SelectItem>
                    <SelectItem value="hourly">Hourly (Por Hora)</SelectItem>
                    <SelectItem value="daily">Daily (Diária)</SelectItem>
                    <SelectItem value="per_job">Per Job</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Rate Value</Label>
                <Input
                  type="number"
                  value={formData.paymentRateValue}
                  onChange={(e) => handleChange("paymentRateValue", e.target.value)}
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleChange("status", value as "active" | "inactive")}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </ScrollArea>

        <DialogFooter className="flex justify-between gap-3 pt-4 border-t">
          {mode === "edit" && onDelete && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button type="button" variant="destructive">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delete {user?.name}? This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

          <div className="flex gap-3 ml-auto">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" form="team-user-form">
              {mode === "create" ? "Add Member" : "Save"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
