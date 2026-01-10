import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ViewPermissionsModal } from "@/components/settings/ViewPermissionsModal";
import { CreateRoleModal } from "@/components/settings/CreateRoleModal";
import { EditRoleModal } from "@/components/settings/EditRoleModal";
import { DeleteRoleDialog } from "@/components/settings/DeleteRoleDialog";
import { TeamUserModal } from "@/components/settings/TeamUserModal";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  User,
  Building2,
  Bell,
  CreditCard,
  Users,
  Shield,
  Globe,
  Smartphone,
  Mail,
  Zap,
  Save,
  Key,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Trash2,
  Edit,
  Clock,
  Phone,
  MapPin,
  Upload,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  Plus,
  Settings as SettingsIcon,
  Landmark,
  Link2,
} from "lucide-react";

type SettingsTab = "profile" | "company" | "notifications" | "billing" | "team" | "security" | "integrations";

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "pending" | "inactive";
}

interface PaymentMethod {
  id: string;
  type: "credit_card" | "bank_account";
  last4: string;
  expiryDate?: string;
  isDefault: boolean;
  bankName?: string;
}

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface Automation {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  trigger: string;
  sendTime?: string;
  condition?: string;
}

export function Settings() {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  
  // Profile Settings
  const [profileImage, setProfileImage] = useState("");
  const [fullName, setFullName] = useState("Deyvisson Lander");
  const [userEmail, setUserEmail] = useState("deyvisson@cleanpro.com");
  const [userPhone, setUserPhone] = useState("(00) 00000-0000");

  // Company Settings
  const [companyName, setCompanyName] = useState("CleanPro Services");
  const [businessAddress, setBusinessAddress] = useState("123 Business Center, City, State 12345");
  const [businessEmail, setBusinessEmail] = useState("info@cleanpro.com");
  const [businessPhone, setBusinessPhone] = useState("(555) 987-6543");
  const [timezone, setTimezone] = useState("est");
  const [currency, setCurrency] = useState("usd");
  const [language, setLanguage] = useState("en");
  const [businessHours, setBusinessHours] = useState([
    { day: "Monday", open: "08:00", close: "18:00", isOpen: true },
    { day: "Tuesday", open: "08:00", close: "18:00", isOpen: true },
    { day: "Wednesday", open: "08:00", close: "18:00", isOpen: true },
    { day: "Thursday", open: "08:00", close: "18:00", isOpen: true },
    { day: "Friday", open: "08:00", close: "18:00", isOpen: true },
    { day: "Saturday", open: "09:00", close: "16:00", isOpen: true },
    { day: "Sunday", open: "00:00", close: "00:00", isOpen: false },
  ]);

  // Email Notification Settings
  const [jobUpdatesEmail, setJobUpdatesEmail] = useState(true);
  const [paymentNotificationsEmail, setPaymentNotificationsEmail] = useState(true);
  const [weeklyReportsEmail, setWeeklyReportsEmail] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);

  // SMS & Push Notification Settings
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [jobRemindersSms, setJobRemindersSms] = useState(true);
  const [paymentAlertsSms, setPaymentAlertsSms] = useState(true);
  const [customerFeedbackSms, setCustomerFeedbackSms] = useState(true);
  const [systemAlertsSms, setSystemAlertsSms] = useState(true);

  // Billing Settings
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    { id: "1", type: "credit_card", last4: "4242", expiryDate: "12/25", isDefault: true },
    { id: "2", type: "bank_account", last4: "6789", isDefault: false, bankName: "Chase Bank" },
  ]);

  // Team Settings
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    { id: "1", name: "Deyvisson Lander", email: "deyvisson@cleanpro.com", role: "Admin", status: "active" },
    { id: "2", name: "Maria Silva", email: "maria@cleanpro.com", role: "Manager", status: "active" },
    { id: "3", name: "John Doe", email: "john@cleanpro.com", role: "Employee", status: "pending" },
  ]);
  const [roles, setRoles] = useState<Role[]>([
    { id: "1", name: "Admin", permissions: ["all"] },
    { id: "2", name: "Cleaner", permissions: ["start_finish", "view_schedule"] },
    { id: "3", name: "Cleaning Team Manager", permissions: ["start_finish", "view_all_teams", "view_schedule", "view_clients", "set_payment", "view_price", "hidden_notes_view"] },
    { id: "4", name: "Driver", permissions: ["start_finish", "view_schedule", "view_all_teams"] },
    { id: "5", name: "Office Manager", permissions: ["view_schedule", "view_clients", "view_contact_info", "view_charges", "accounting", "employees", "billing"] },
    { id: "6", name: "Virtual Assistant", permissions: ["view_schedule", "view_clients", "view_contact_info", "view_chats", "view_charges"] },
  ]);
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [newMemberRole, setNewMemberRole] = useState("all");
  const [viewPermissionsModalOpen, setViewPermissionsModalOpen] = useState(false);
  const [createRoleModalOpen, setCreateRoleModalOpen] = useState(false);
  const [editRoleModalOpen, setEditRoleModalOpen] = useState(false);
  const [deleteRoleDialogOpen, setDeleteRoleDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [teamUserModalOpen, setTeamUserModalOpen] = useState(false);
  const [teamUserModalMode, setTeamUserModalMode] = useState<"create" | "edit">("create");
  const [selectedTeamMember, setSelectedTeamMember] = useState<TeamMember | null>(null);

  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [twoFactorMethod, setTwoFactorMethod] = useState("sms");
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Integration Settings
  const [quickbooksConnected, setQuickbooksConnected] = useState(true);
  const [quickbooksSyncInvoices, setQuickbooksSyncInvoices] = useState(true);
  const [quickbooksSyncPayments, setQuickbooksSyncPayments] = useState(true);
  const [twilioConnected, setTwilioConnected] = useState(true);
  const [sendgridConnected, setSendgridConnected] = useState(false);

  // Automations
  const [automations, setAutomations] = useState<Automation[]>([
    { id: "1", name: "On Our Way", description: "When team is on the way → Send message", enabled: true, trigger: "on_the_way" },
    { id: "2", name: "Job Started", description: "When job is started → Send message", enabled: true, trigger: "job_started" },
    { id: "3", name: "Job Finished", description: "When job is finished → Send message", enabled: true, trigger: "job_finished" },
    { id: "4", name: "Job Date Reminder", description: "2 days before job", enabled: true, trigger: "job_reminder", sendTime: "10:00" },
    { id: "5", name: "Invoice Payment Reminder", description: "3 days after invoice due date", enabled: true, trigger: "payment_reminder", sendTime: "10:00", condition: "only_if_unpaid" },
  ]);

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully!");
  };

  const handleSaveCompany = () => {
    toast.success("Company settings saved successfully!");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved!");
  };

  const handleInviteTeamMember = () => {
    if (!newMemberEmail) {
      toast.error("Please enter an email address");
      return;
    }
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: newMemberEmail.split("@")[0],
      email: newMemberEmail,
      role: newMemberRole === "admin" ? "Admin" : newMemberRole === "manager" ? "Manager" : "Employee",
      status: "pending",
    };
    setTeamMembers([...teamMembers, newMember]);
    setNewMemberEmail("");
    toast.success(`Invitation sent to ${newMemberEmail}`);
  };

  const handleRemoveTeamMember = (id: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== id));
    toast.success("Team member removed");
  };

  const handleOpenCreateUser = () => {
    setTeamUserModalMode("create");
    setSelectedTeamMember(null);
    setTeamUserModalOpen(true);
  };

  const handleOpenEditUser = (member: TeamMember) => {
    setTeamUserModalMode("edit");
    setSelectedTeamMember(member);
    setTeamUserModalOpen(true);
  };

  const handleSaveTeamUser = (user: TeamMember) => {
    if (teamUserModalMode === "create") {
      setTeamMembers([...teamMembers, user]);
    } else {
      setTeamMembers(teamMembers.map((m) => m.id === user.id ? user : m));
    }
  };

  const handleDeleteTeamUser = (userId: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== userId));
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword.length < parseInt(passwordMinLength)) {
      toast.error(`Password must be at least ${passwordMinLength} characters`);
      return;
    }
    toast.success("Password changed successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdateBusinessHours = (index: number, field: string, value: string | boolean) => {
    const updated = [...businessHours];
    updated[index] = { ...updated[index], [field]: value };
    setBusinessHours(updated);
  };

  const handleRemovePaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.filter((m) => m.id !== id));
    toast.success("Payment method removed");
  };

  const handleSetDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(paymentMethods.map((m) => ({ ...m, isDefault: m.id === id })));
    toast.success("Default payment method updated");
  };

  const handleToggleAutomation = (id: string) => {
    setAutomations(automations.map((a) => 
      a.id === id ? { ...a, enabled: !a.enabled } : a
    ));
  };

  const handleConnectQuickbooks = () => {
    setQuickbooksConnected(!quickbooksConnected);
    toast.success(quickbooksConnected ? "QuickBooks disconnected" : "QuickBooks connected");
  };

  const handleConnectTwilio = () => {
    setTwilioConnected(!twilioConnected);
    toast.success(twilioConnected ? "Twilio disconnected" : "Twilio connected");
  };

  const handleConnectSendgrid = () => {
    setSendgridConnected(!sendgridConnected);
    toast.success(sendgridConnected ? "SendGrid disconnected" : "SendGrid connected");
  };

  const getIntegrationStatus = (connected: boolean) => {
    if (connected) return { label: "Connected", variant: "default" as const, icon: CheckCircle };
    return { label: "Disconnected", variant: "outline" as const, icon: XCircle };
  };

  const tabs = [
    { id: "profile" as SettingsTab, label: t("settings.profile"), icon: User },
    { id: "company" as SettingsTab, label: t("settings.company"), icon: Building2 },
    { id: "notifications" as SettingsTab, label: t("settings.notifications"), icon: Bell },
    { id: "billing" as SettingsTab, label: t("settings.billing"), icon: CreditCard },
    { id: "team" as SettingsTab, label: t("settings.team"), icon: Users },
    { id: "security" as SettingsTab, label: t("settings.security"), icon: Shield },
    { id: "integrations" as SettingsTab, label: t("settings.integrations"), icon: Link2 },
  ];

  const renderProfileSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {t("settings.personalInfo")}
        </CardTitle>
        <CardDescription>{t("settings.updateProfileInfo")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Profile Image */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-2xl font-semibold text-foreground">
            {fullName.charAt(0)}
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Upload className="w-4 h-4" />
            {t("settings.changePhoto")}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>{t("settings.fullName")}</Label>
            <Input 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("settings.enterFullName")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("common.email")}</Label>
            <Input 
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder={t("settings.enterEmail")}
            />
          </div>
        </div>

        <div className="space-y-2 max-w-md">
          <Label>{t("common.phone")}</Label>
          <Input 
            value={userPhone}
            onChange={(e) => setUserPhone(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>

        <Button onClick={handleSaveProfile} className="bg-destructive hover:bg-destructive/90">
          {t("settings.saveChanges")}
        </Button>
      </CardContent>
    </Card>
  );

  const renderCompanySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            {t("settings.companyInfo")}
          </CardTitle>
          <CardDescription>{t("settings.businessSettings")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings.companyName")}</Label>
            <Input 
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("settings.businessAddress")}</Label>
            <Textarea 
              value={businessAddress}
              onChange={(e) => setBusinessAddress(e.target.value)}
              rows={2}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("settings.businessEmail")}</Label>
              <Input 
                type="email"
                value={businessEmail}
                onChange={(e) => setBusinessEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>{t("settings.businessPhone")}</Label>
              <Input 
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>{t("settings.timezone")}</Label>
              <Select value={timezone} onValueChange={setTimezone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="est">Eastern Standard Time</SelectItem>
                  <SelectItem value="cst">Central Standard Time</SelectItem>
                  <SelectItem value="mst">Mountain Standard Time</SelectItem>
                  <SelectItem value="pst">Pacific Standard Time</SelectItem>
                  <SelectItem value="brt">Brasília Time (BRT)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.currency")}</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="usd">USD - Dollar</SelectItem>
                  <SelectItem value="eur">EUR - Euro</SelectItem>
                  <SelectItem value="gbp">GBP - Pound</SelectItem>
                  <SelectItem value="brl">BRL - Real</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.language")}</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="pt">Português</SelectItem>
                  <SelectItem value="es">Español</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card>
        <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t("settings.businessHours")}
          </CardTitle>
          <CardDescription>{t("settings.setOperatingHours")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {businessHours.map((schedule, index) => (
              <div key={schedule.day} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center gap-4 flex-1">
                  <Switch 
                    checked={schedule.isOpen}
                    onCheckedChange={(checked) => handleUpdateBusinessHours(index, "isOpen", checked)}
                  />
                  <span className="font-medium w-24">{schedule.day}</span>
                  {schedule.isOpen ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={schedule.open}
                        onChange={(e) => handleUpdateBusinessHours(index, "open", e.target.value)}
                        className="w-32"
                      />
                      <span className="text-muted-foreground">{t("settings.to")}</span>
                      <Input
                        type="time"
                        value={schedule.close}
                        onChange={(e) => handleUpdateBusinessHours(index, "close", e.target.value)}
                        className="w-32"
                      />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">{t("settings.closed")}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Button className="mt-4 bg-destructive hover:bg-destructive/90" onClick={handleSaveCompany}>
            {t("settings.saveChanges")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t("settings.emailNotifications")}
          </CardTitle>
          <CardDescription>{t("settings.controlEmailNotifications")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.jobUpdates")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.jobUpdatesDesc")}</p>
            </div>
            <Switch checked={jobUpdatesEmail} onCheckedChange={setJobUpdatesEmail} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.paymentNotifications")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.paymentNotificationsDesc")}</p>
            </div>
            <Switch checked={paymentNotificationsEmail} onCheckedChange={setPaymentNotificationsEmail} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.weeklyReports")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.weeklyReportsDesc")}</p>
            </div>
            <Switch checked={weeklyReportsEmail} onCheckedChange={setWeeklyReportsEmail} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.marketingEmails")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.marketingEmailsDesc")}</p>
            </div>
            <Switch checked={marketingEmails} onCheckedChange={setMarketingEmails} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Smartphone className="w-5 h-5" />
            {t("settings.smsPushNotifications")}
          </CardTitle>
          <CardDescription>{t("settings.configureMobileNotifications")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.smsNotifications")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.enableSmsNotifications")}</p>
            </div>
            <Switch checked={smsNotifications} onCheckedChange={setSmsNotifications} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.jobReminders")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.jobRemindersDesc")}</p>
            </div>
            <Switch checked={jobRemindersSms} onCheckedChange={setJobRemindersSms} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.paymentAlerts")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.paymentAlertsDesc")}</p>
            </div>
            <Switch checked={paymentAlertsSms} onCheckedChange={setPaymentAlertsSms} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.feedbackRequests")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.feedbackRequestsDesc")}</p>
            </div>
            <Switch checked={customerFeedbackSms} onCheckedChange={setCustomerFeedbackSms} />
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.systemAlerts")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.systemAlertsDesc")}</p>
            </div>
            <Switch checked={systemAlertsSms} onCheckedChange={setSystemAlertsSms} />
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSaveNotifications} className="bg-destructive hover:bg-destructive/90">
        {t("settings.saveChanges")}
      </Button>
    </div>
  );

  const renderBillingSettings = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          {t("settings.paymentMethods")}
        </CardTitle>
        <CardDescription>{t("settings.managePaymentMethods")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {paymentMethods.map((method) => (
          <div key={method.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                {method.type === "credit_card" ? (
                  <CreditCard className="w-5 h-5 text-primary" />
                ) : (
                  <Landmark className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h4 className="font-medium">
                  {method.type === "credit_card" ? t("settings.creditDebitCard") : t("settings.bankAccount")} {t("settings.ending")} {method.last4}
                </h4>
                {method.expiryDate && (
                  <p className="text-sm text-muted-foreground">{t("settings.expiresOn")} {method.expiryDate}</p>
                )}
                {method.bankName && (
                  <p className="text-sm text-muted-foreground">{method.bankName}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {method.isDefault ? (
                <Badge variant="default">{t("settings.default")}</Badge>
              ) : (
                <Button variant="outline" size="sm" onClick={() => handleSetDefaultPaymentMethod(method.id)}>
                  {t("settings.setAsDefault")}
                </Button>
              )}
              <Button variant="ghost" size="sm" onClick={() => toast.info(t("settings.featureInDevelopment"))}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleRemovePaymentMethod(method.id)}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </Button>
            </div>
          </div>
        ))}

        <div className="flex gap-2">
          <Button variant="outline" onClick={() => toast.info(t("settings.featureInDevelopment"))}>
            <CreditCard className="w-4 h-4 mr-2" />
            {t("settings.addCard")}
          </Button>
          <Button variant="outline" onClick={() => toast.info(t("settings.featureInDevelopment"))}>
            <Landmark className="w-4 h-4 mr-2" />
            {t("settings.addBankAccount")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderTeamSettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            {t("settings.manageTeamTitle")}
          </CardTitle>
          <CardDescription>{t("settings.userAccessManagement")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <Input 
                placeholder={t("settings.enterEmailAddress")}
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
              />
            </div>
            <Select value={newMemberRole} onValueChange={setNewMemberRole}>
              <SelectTrigger className="w-44">
                <SelectValue placeholder={t("settings.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("common.all")}</SelectItem>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.name.toLowerCase()}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleInviteTeamMember}>
              <UserPlus className="w-4 h-4 mr-2" />
              {t("settings.invite")}
            </Button>
            <Button onClick={handleOpenCreateUser} variant="hero">
              <Plus className="w-4 h-4 mr-2" />
              {t("settings.addTeamMember") || "Add User"}
            </Button>
          </div>

          <Separator />

          <div className="space-y-3">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-primary font-medium">
                      {member.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{member.name}</h4>
                    <p className="text-sm text-muted-foreground">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select defaultValue={member.role.toLowerCase()}>
                    <SelectTrigger className="w-44">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map((role) => (
                        <SelectItem key={role.id} value={role.name.toLowerCase()}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select defaultValue={member.status}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t("common.active")}</SelectItem>
                      <SelectItem value="pending">{t("settings.pending")}</SelectItem>
                      <SelectItem value="inactive">{t("common.inactive")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="ghost" size="sm" onClick={() => handleOpenEditUser(member)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleRemoveTeamMember(member.id)}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t("settings.rolesPermissions")}
          </CardTitle>
          <CardDescription>{t("settings.createEditRoles")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {roles.map((role) => (
            <div key={role.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div>
                <h4 className="font-medium">{role.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {role.permissions.includes("all") ? t("settings.fullAccess") : `${role.permissions.length} ${t("settings.xPermissions")}`}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => {
                  setSelectedRole(role);
                  setViewPermissionsModalOpen(true);
                }}>
                  {t("settings.viewPermissions")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedRole(role);
                  setEditRoleModalOpen(true);
                }}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => {
                  setSelectedRole(role);
                  setDeleteRoleDialogOpen(true);
                }}>
                  <Trash2 className="w-4 h-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          <Button variant="outline" onClick={() => setCreateRoleModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            {t("settings.createNewRole")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            {t("settings.changePassword")}
          </CardTitle>
          <CardDescription>{t("settings.updateAccountPassword")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("settings.currentPassword")}</Label>
            <div className="relative max-w-md">
              <Input 
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder={t("settings.enterCurrentPassword")}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("settings.newPassword")}</Label>
            <div className="relative max-w-md">
              <Input 
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("settings.enterNewPassword")}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("settings.confirmPassword")}</Label>
            <div className="relative max-w-md">
              <Input 
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("settings.confirmNewPassword")}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button onClick={handleChangePassword} className="bg-destructive hover:bg-destructive/90">
            {t("settings.changePassword")}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            {t("settings.twoFactor")}
          </CardTitle>
          <CardDescription>{t("settings.addExtraSecurity")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${twoFactorEnabled ? "bg-success/10" : "bg-muted"}`}>
                <Lock className={`w-5 h-5 ${twoFactorEnabled ? "text-success" : "text-muted-foreground"}`} />
              </div>
              <div>
                <h4 className="font-medium">{t("settings.enable2FA")}</h4>
                <p className="text-sm text-muted-foreground">
                  {twoFactorEnabled ? t("settings.accountProtected") : t("settings.protectWith2FA")}
                </p>
              </div>
            </div>
            <Switch checked={twoFactorEnabled} onCheckedChange={setTwoFactorEnabled} />
          </div>

          {twoFactorEnabled && (
            <div className="space-y-2 max-w-md">
              <Label>{t("settings.authMethod")}</Label>
              <Select value={twoFactorMethod} onValueChange={setTwoFactorMethod}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sms">SMS</SelectItem>
                  <SelectItem value="app">{t("settings.authenticatorApp")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            {t("settings.securityPolicies")}
          </CardTitle>
          <CardDescription>{t("settings.configureSecurityReqs")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("settings.sessionTimeoutMinutes")}</Label>
              <Select value={sessionTimeout} onValueChange={setSessionTimeout}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 {t("settings.minutes")}</SelectItem>
                  <SelectItem value="30">30 {t("settings.minutes")}</SelectItem>
                  <SelectItem value="60">1 {t("settings.hour")}</SelectItem>
                  <SelectItem value="120">2 {t("settings.hours")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>{t("settings.minPasswordLength")}</Label>
              <Select value={passwordMinLength} onValueChange={setPasswordMinLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 {t("settings.characters")}</SelectItem>
                  <SelectItem value="8">8 {t("settings.characters")}</SelectItem>
                  <SelectItem value="10">10 {t("settings.characters")}</SelectItem>
                  <SelectItem value="12">12 {t("settings.characters")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between p-3 border border-border rounded-lg">
            <div>
              <h4 className="font-medium">{t("settings.requireSpecialChars")}</h4>
              <p className="text-sm text-muted-foreground">{t("settings.passwordsMustInclude")}</p>
            </div>
            <Switch checked={requireSpecialChars} onCheckedChange={setRequireSpecialChars} />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      {/* Accounting */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            {t("settings.accounting")}
          </CardTitle>
          <CardDescription>{t("settings.connectAccountingSoftware")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 border border-border rounded-lg space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <CreditCard className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">QuickBooks</h4>
                  <p className="text-sm text-muted-foreground">{t("settings.syncInvoicesPayments")}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={getIntegrationStatus(quickbooksConnected).variant}>
                  {quickbooksConnected ? t("settings.connected") : t("settings.disconnected")}
                </Badge>
                <Button 
                  variant={quickbooksConnected ? "destructive" : "default"} 
                  size="sm"
                  onClick={handleConnectQuickbooks}
                >
                  {quickbooksConnected ? t("settings.disconnect") : t("settings.connect")}
                </Button>
              </div>
            </div>
            
            {quickbooksConnected && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-sm">{t("settings.syncInvoices")}</h5>
                      <p className="text-xs text-muted-foreground">{t("settings.autoSyncInvoices")}</p>
                    </div>
                    <Switch checked={quickbooksSyncInvoices} onCheckedChange={setQuickbooksSyncInvoices} />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h5 className="font-medium text-sm">{t("settings.syncPayments")}</h5>
                      <p className="text-xs text-muted-foreground">{t("settings.autoSyncPayments")}</p>
                    </div>
                    <Switch checked={quickbooksSyncPayments} onCheckedChange={setQuickbooksSyncPayments} />
                  </div>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Communication */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            {t("settings.communication")}
          </CardTitle>
          <CardDescription>{t("settings.smsEmailServices")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <Smartphone className="w-5 h-5 text-success" />
              </div>
              <div>
                <h4 className="font-medium">Twilio (SMS)</h4>
                <p className="text-sm text-muted-foreground">{t("settings.sendSmsNotifications")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getIntegrationStatus(twilioConnected).variant}>
                {twilioConnected ? t("settings.connected") : t("settings.disconnected")}
              </Badge>
              <Button 
                variant={twilioConnected ? "destructive" : "default"} 
                size="sm"
                onClick={handleConnectTwilio}
              >
                {twilioConnected ? t("settings.disconnect") : t("settings.connect")}
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Mail className="w-5 h-5 text-warning" />
              </div>
              <div>
                <h4 className="font-medium">SendGrid (Email)</h4>
                <p className="text-sm text-muted-foreground">{t("settings.sendEmailNotifications")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getIntegrationStatus(sendgridConnected).variant}>
                {sendgridConnected ? t("settings.connected") : t("settings.disconnected")}
              </Badge>
              <Button 
                variant={sendgridConnected ? "destructive" : "default"} 
                size="sm"
                onClick={handleConnectSendgrid}
              >
                {sendgridConnected ? t("settings.disconnect") : t("settings.connect")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Automations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {t("settings.automations")}
          </CardTitle>
          <CardDescription>{t("settings.configureAutoMessages")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {automations.map((automation) => (
            <div key={automation.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${automation.enabled ? "bg-success/10" : "bg-muted"}`}>
                  <Send className={`w-5 h-5 ${automation.enabled ? "text-success" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h4 className="font-medium">{automation.name}</h4>
                  <p className="text-sm text-muted-foreground">{automation.description}</p>
                  {automation.sendTime && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {t("settings.sendAt")} {automation.sendTime}
                      {automation.condition && ` • ${t("settings.onlyIfUnpaid")}`}
                    </p>
                  )}
                </div>
              </div>
              <Switch 
                checked={automation.enabled} 
                onCheckedChange={() => handleToggleAutomation(automation.id)} 
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return renderProfileSettings();
      case "company":
        return renderCompanySettings();
      case "notifications":
        return renderNotificationSettings();
      case "billing":
        return renderBillingSettings();
      case "team":
        return renderTeamSettings();
      case "security":
        return renderSecuritySettings();
      case "integrations":
        return renderIntegrationSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          <div className="space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-foreground">{t("settings.title")}</h1>
              <p className="text-muted-foreground">{t("settings.description")}</p>
            </div>

            {/* Horizontal Tabs */}
            <div className="flex items-center gap-2 border-b border-border pb-4 overflow-x-auto">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                      isActive
                        ? "bg-foreground text-background"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Content Area */}
            <div>
              {renderContent()}
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <ViewPermissionsModal
        open={viewPermissionsModalOpen}
        onOpenChange={setViewPermissionsModalOpen}
        role={selectedRole}
      />
      <CreateRoleModal
        open={createRoleModalOpen}
        onOpenChange={setCreateRoleModalOpen}
        onCreateRole={(newRole) => setRoles([...roles, newRole])}
      />
      <EditRoleModal
        open={editRoleModalOpen}
        onOpenChange={setEditRoleModalOpen}
        role={selectedRole}
        onSaveRole={(updatedRole) => {
          setRoles(roles.map((r) => r.id === updatedRole.id ? updatedRole : r));
        }}
      />
      <DeleteRoleDialog
        open={deleteRoleDialogOpen}
        onOpenChange={setDeleteRoleDialogOpen}
        role={selectedRole}
        onConfirmDelete={(roleId) => {
          setRoles(roles.filter((r) => r.id !== roleId));
          toast.success("Função excluída com sucesso!");
        }}
      />
      <TeamUserModal
        open={teamUserModalOpen}
        onOpenChange={setTeamUserModalOpen}
        mode={teamUserModalMode}
        user={selectedTeamMember}
        roles={roles}
        onSave={handleSaveTeamUser}
        onDelete={handleDeleteTeamUser}
      />
    </div>
  );
}
