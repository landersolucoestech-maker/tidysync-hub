import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Save, 
  Eye, 
  Building2,
  User,
  FileText,
  Palette,
  Table,
  DollarSign,
  FileSignature,
  Upload,
  Settings2,
} from "lucide-react";

interface EstimateTemplateConfig {
  // Header / Company
  showLogo: boolean;
  logoPosition: "left" | "center" | "right";
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  documentTitle: string;

  // Estimate Info
  showEstimateNumber: boolean;
  estimateNumberPrefix: string;
  showEstimateDate: boolean;
  showExpirationDate: boolean;
  showReference: boolean;
  referenceLabel: string;

  // Client Block
  clientBlockTitle: string;
  showClientName: boolean;
  showClientCompany: boolean;
  showClientAddress: boolean;
  showClientPhone: boolean;
  showClientEmail: boolean;

  // Items Table
  tableColumns: {
    item: boolean;
    description: boolean;
    quantity: boolean;
    rate: boolean;
    amount: boolean;
  };
  itemColumnLabel: string;
  descriptionColumnLabel: string;
  quantityColumnLabel: string;
  rateColumnLabel: string;
  amountColumnLabel: string;

  // Totals
  showSubtotal: boolean;
  showTax: boolean;
  taxLabel: string;
  defaultTaxRate: number;
  showDiscount: boolean;
  discountLabel: string;
  showFees: boolean;
  feesLabel: string;
  totalLabel: string;

  // Terms & Conditions
  showTerms: boolean;
  termsTitle: string;
  termsContent: string;

  // Notes
  showNotes: boolean;
  notesTitle: string;
  notesPlaceholder: string;

  // Signature
  showSignature: boolean;
  showClientSignature: boolean;
  showAuthorizedSignature: boolean;
  signatureDate: boolean;

  // Styling
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  headerBgColor: string;
  tableBorderColor: string;
  tableHeaderBg: string;
}

const defaultConfig: EstimateTemplateConfig = {
  // Header
  showLogo: true,
  logoPosition: "left",
  companyName: "CleanPro Services",
  companyAddress: "123 Business Center, Suite 100\nCity, State 12345",
  companyPhone: "(555) 987-6543",
  companyEmail: "info@cleanpro.com",
  companyWebsite: "www.cleanpro.com",
  documentTitle: "ESTIMATE",

  // Estimate Info
  showEstimateNumber: true,
  estimateNumberPrefix: "EST-",
  showEstimateDate: true,
  showExpirationDate: true,
  showReference: false,
  referenceLabel: "Reference",

  // Client Block
  clientBlockTitle: "ESTIMATE FOR",
  showClientName: true,
  showClientCompany: true,
  showClientAddress: true,
  showClientPhone: true,
  showClientEmail: true,

  // Items Table
  tableColumns: {
    item: true,
    description: true,
    quantity: true,
    rate: true,
    amount: true,
  },
  itemColumnLabel: "Item",
  descriptionColumnLabel: "Description",
  quantityColumnLabel: "Qty",
  rateColumnLabel: "Rate",
  amountColumnLabel: "Amount",

  // Totals
  showSubtotal: true,
  showTax: true,
  taxLabel: "Tax",
  defaultTaxRate: 8,
  showDiscount: true,
  discountLabel: "Discount",
  showFees: false,
  feesLabel: "Fees",
  totalLabel: "TOTAL",

  // Terms & Conditions
  showTerms: true,
  termsTitle: "Terms & Conditions",
  termsContent: "• This estimate is valid for 30 days from the date of issue.\n• 50% deposit required to schedule service.\n• Final payment due upon completion.\n• Cancellation within 24 hours may incur a fee.",

  // Notes
  showNotes: true,
  notesTitle: "Notes",
  notesPlaceholder: "Additional notes or observations...",

  // Signature
  showSignature: true,
  showClientSignature: true,
  showAuthorizedSignature: true,
  signatureDate: true,

  // Styling
  primaryColor: "#dc2626",
  secondaryColor: "#1f2937",
  accentColor: "#f3f4f6",
  fontFamily: "Inter",
  headerBgColor: "#1f2937",
  tableBorderColor: "#e5e7eb",
  tableHeaderBg: "#f9fafb",
};

// Sample data for preview
const sampleData = {
  estimateNumber: "EST-2024-0042",
  estimateDate: "January 12, 2026",
  expirationDate: "February 11, 2026",
  reference: "Deep Clean Project",
  client: {
    name: "John Smith",
    company: "Smith Enterprises LLC",
    address: "456 Customer Street\nCity, State 67890",
    phone: "(555) 123-4567",
    email: "john.smith@email.com",
  },
  items: [
    { item: "1", description: "Deep Cleaning - Kitchen", qty: 1, rate: 200, amount: 200 },
    { item: "2", description: "Deep Cleaning - Living Room", qty: 1, rate: 150, amount: 150 },
    { item: "3", description: "Deep Cleaning - Bedrooms", qty: 3, rate: 100, amount: 300 },
    { item: "4", description: "Window Cleaning (interior)", qty: 8, rate: 25, amount: 200 },
  ],
  subtotal: 850,
  tax: 68,
  discount: 50,
  fees: 0,
  total: 868,
};

interface LeadEstimateTemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

let savedEstimateConfig: EstimateTemplateConfig | null = null;

export function LeadEstimateTemplateEditor({ open, onOpenChange }: LeadEstimateTemplateEditorProps) {
  const [config, setConfig] = useState<EstimateTemplateConfig>(
    savedEstimateConfig || defaultConfig
  );
  const [activeTab, setActiveTab] = useState("header");

  const updateConfig = <K extends keyof EstimateTemplateConfig>(
    key: K, 
    value: EstimateTemplateConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const updateTableColumn = (column: keyof EstimateTemplateConfig['tableColumns'], value: boolean) => {
    setConfig(prev => ({
      ...prev,
      tableColumns: { ...prev.tableColumns, [column]: value },
    }));
  };

  const handleSave = () => {
    savedEstimateConfig = config;
    toast.success("Estimate template saved successfully!");
    onOpenChange(false);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Edit Estimate Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-1/2 border-r border-border overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6 mb-6">
                <TabsTrigger value="header" className="text-xs">
                  <Building2 className="w-3 h-3 mr-1" />
                  Header
                </TabsTrigger>
                <TabsTrigger value="client" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Client
                </TabsTrigger>
                <TabsTrigger value="table" className="text-xs">
                  <Table className="w-3 h-3 mr-1" />
                  Items
                </TabsTrigger>
                <TabsTrigger value="totals" className="text-xs">
                  <DollarSign className="w-3 h-3 mr-1" />
                  Totals
                </TabsTrigger>
                <TabsTrigger value="footer" className="text-xs">
                  <FileSignature className="w-3 h-3 mr-1" />
                  Footer
                </TabsTrigger>
                <TabsTrigger value="styling" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  Style
                </TabsTrigger>
              </TabsList>

              {/* Header Tab */}
              <TabsContent value="header" className="space-y-4">
                <h3 className="font-semibold">Company Header</h3>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>Show Logo</Label>
                  <Switch 
                    checked={config.showLogo} 
                    onCheckedChange={(v) => updateConfig("showLogo", v)} 
                  />
                </div>

                {config.showLogo && (
                  <div className="space-y-2">
                    <Label>Logo Position</Label>
                    <Select 
                      value={config.logoPosition} 
                      onValueChange={(v: "left" | "center" | "right") => updateConfig("logoPosition", v)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" size="sm" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Logo
                    </Button>
                  </div>
                )}

                <Separator />

                <div className="space-y-2">
                  <Label>Document Title</Label>
                  <Input 
                    value={config.documentTitle}
                    onChange={(e) => updateConfig("documentTitle", e.target.value)}
                    placeholder="ESTIMATE"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Name</Label>
                  <Input 
                    value={config.companyName}
                    onChange={(e) => updateConfig("companyName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Company Address</Label>
                  <Textarea 
                    value={config.companyAddress}
                    onChange={(e) => updateConfig("companyAddress", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Phone</Label>
                    <Input 
                      value={config.companyPhone}
                      onChange={(e) => updateConfig("companyPhone", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input 
                      value={config.companyEmail}
                      onChange={(e) => updateConfig("companyEmail", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Website</Label>
                  <Input 
                    value={config.companyWebsite}
                    onChange={(e) => updateConfig("companyWebsite", e.target.value)}
                  />
                </div>

                <Separator />
                <h4 className="font-medium text-sm">Estimate Info Block</h4>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Show Estimate Number</Label>
                    <Switch 
                      checked={config.showEstimateNumber} 
                      onCheckedChange={(v) => updateConfig("showEstimateNumber", v)} 
                    />
                  </div>
                  {config.showEstimateNumber && (
                    <div className="space-y-2 pl-4">
                      <Label>Number Prefix</Label>
                      <Input 
                        value={config.estimateNumberPrefix}
                        onChange={(e) => updateConfig("estimateNumberPrefix", e.target.value)}
                        placeholder="EST-"
                      />
                    </div>
                  )}
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Show Estimate Date</Label>
                    <Switch 
                      checked={config.showEstimateDate} 
                      onCheckedChange={(v) => updateConfig("showEstimateDate", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Show Expiration Date</Label>
                    <Switch 
                      checked={config.showExpirationDate} 
                      onCheckedChange={(v) => updateConfig("showExpirationDate", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Show Reference/Project</Label>
                    <Switch 
                      checked={config.showReference} 
                      onCheckedChange={(v) => updateConfig("showReference", v)} 
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Client Tab */}
              <TabsContent value="client" className="space-y-4">
                <h3 className="font-semibold">Client Information Block</h3>
                
                <div className="space-y-2">
                  <Label>Block Title</Label>
                  <Input 
                    value={config.clientBlockTitle}
                    onChange={(e) => updateConfig("clientBlockTitle", e.target.value)}
                    placeholder="ESTIMATE FOR"
                  />
                </div>

                <Separator />
                <p className="text-sm text-muted-foreground">Choose which client fields to display</p>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Client Name</Label>
                    <Switch 
                      checked={config.showClientName} 
                      onCheckedChange={(v) => updateConfig("showClientName", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Company Name</Label>
                    <Switch 
                      checked={config.showClientCompany} 
                      onCheckedChange={(v) => updateConfig("showClientCompany", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Address</Label>
                    <Switch 
                      checked={config.showClientAddress} 
                      onCheckedChange={(v) => updateConfig("showClientAddress", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Phone</Label>
                    <Switch 
                      checked={config.showClientPhone} 
                      onCheckedChange={(v) => updateConfig("showClientPhone", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Email</Label>
                    <Switch 
                      checked={config.showClientEmail} 
                      onCheckedChange={(v) => updateConfig("showClientEmail", v)} 
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Table Tab */}
              <TabsContent value="table" className="space-y-4">
                <h3 className="font-semibold">Items Table Configuration</h3>
                <p className="text-sm text-muted-foreground">Configure table columns and labels</p>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Item Column</Label>
                      {config.tableColumns.item && (
                        <Input 
                          value={config.itemColumnLabel}
                          onChange={(e) => updateConfig("itemColumnLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Item"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.tableColumns.item} 
                      onCheckedChange={(v) => updateTableColumn("item", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Description Column</Label>
                      {config.tableColumns.description && (
                        <Input 
                          value={config.descriptionColumnLabel}
                          onChange={(e) => updateConfig("descriptionColumnLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Description"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.tableColumns.description} 
                      onCheckedChange={(v) => updateTableColumn("description", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Quantity Column</Label>
                      {config.tableColumns.quantity && (
                        <Input 
                          value={config.quantityColumnLabel}
                          onChange={(e) => updateConfig("quantityColumnLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Qty"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.tableColumns.quantity} 
                      onCheckedChange={(v) => updateTableColumn("quantity", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Rate Column</Label>
                      {config.tableColumns.rate && (
                        <Input 
                          value={config.rateColumnLabel}
                          onChange={(e) => updateConfig("rateColumnLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Rate"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.tableColumns.rate} 
                      onCheckedChange={(v) => updateTableColumn("rate", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Amount Column</Label>
                      {config.tableColumns.amount && (
                        <Input 
                          value={config.amountColumnLabel}
                          onChange={(e) => updateConfig("amountColumnLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Amount"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.tableColumns.amount} 
                      onCheckedChange={(v) => updateTableColumn("amount", v)} 
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Totals Tab */}
              <TabsContent value="totals" className="space-y-4">
                <h3 className="font-semibold">Totals Configuration</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Show Subtotal</Label>
                    <Switch 
                      checked={config.showSubtotal} 
                      onCheckedChange={(v) => updateConfig("showSubtotal", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Show Tax</Label>
                      {config.showTax && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <Input 
                            value={config.taxLabel}
                            onChange={(e) => updateConfig("taxLabel", e.target.value)}
                            placeholder="Tax"
                          />
                          <Input 
                            type="number"
                            value={config.defaultTaxRate}
                            onChange={(e) => updateConfig("defaultTaxRate", parseFloat(e.target.value) || 0)}
                            placeholder="Rate %"
                          />
                        </div>
                      )}
                    </div>
                    <Switch 
                      checked={config.showTax} 
                      onCheckedChange={(v) => updateConfig("showTax", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Show Discount</Label>
                      {config.showDiscount && (
                        <Input 
                          value={config.discountLabel}
                          onChange={(e) => updateConfig("discountLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Discount"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.showDiscount} 
                      onCheckedChange={(v) => updateConfig("showDiscount", v)} 
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <Label>Show Fees</Label>
                      {config.showFees && (
                        <Input 
                          value={config.feesLabel}
                          onChange={(e) => updateConfig("feesLabel", e.target.value)}
                          className="mt-2"
                          placeholder="Fees"
                        />
                      )}
                    </div>
                    <Switch 
                      checked={config.showFees} 
                      onCheckedChange={(v) => updateConfig("showFees", v)} 
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>Total Label</Label>
                    <Input 
                      value={config.totalLabel}
                      onChange={(e) => updateConfig("totalLabel", e.target.value)}
                      placeholder="TOTAL"
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Footer Tab */}
              <TabsContent value="footer" className="space-y-4">
                <h3 className="font-semibold">Terms & Conditions</h3>
                
                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>Show Terms</Label>
                  <Switch 
                    checked={config.showTerms} 
                    onCheckedChange={(v) => updateConfig("showTerms", v)} 
                  />
                </div>

                {config.showTerms && (
                  <>
                    <div className="space-y-2">
                      <Label>Terms Title</Label>
                      <Input 
                        value={config.termsTitle}
                        onChange={(e) => updateConfig("termsTitle", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Terms Content</Label>
                      <Textarea 
                        value={config.termsContent}
                        onChange={(e) => updateConfig("termsContent", e.target.value)}
                        rows={5}
                      />
                    </div>
                  </>
                )}

                <Separator />
                <h3 className="font-semibold">Notes Section</h3>

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <Label>Show Notes</Label>
                  <Switch 
                    checked={config.showNotes} 
                    onCheckedChange={(v) => updateConfig("showNotes", v)} 
                  />
                </div>

                {config.showNotes && (
                  <div className="space-y-2">
                    <Label>Notes Title</Label>
                    <Input 
                      value={config.notesTitle}
                      onChange={(e) => updateConfig("notesTitle", e.target.value)}
                    />
                  </div>
                )}

                <Separator />
                <h3 className="font-semibold">Signature Area</h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Show Signature Section</Label>
                    <Switch 
                      checked={config.showSignature} 
                      onCheckedChange={(v) => updateConfig("showSignature", v)} 
                    />
                  </div>

                  {config.showSignature && (
                    <>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>Client Signature</Label>
                        <Switch 
                          checked={config.showClientSignature} 
                          onCheckedChange={(v) => updateConfig("showClientSignature", v)} 
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>Authorized Signature</Label>
                        <Switch 
                          checked={config.showAuthorizedSignature} 
                          onCheckedChange={(v) => updateConfig("showAuthorizedSignature", v)} 
                        />
                      </div>
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <Label>Signature Date</Label>
                        <Switch 
                          checked={config.signatureDate} 
                          onCheckedChange={(v) => updateConfig("signatureDate", v)} 
                        />
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Styling Tab */}
              <TabsContent value="styling" className="space-y-4">
                <h3 className="font-semibold">Visual Styling</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Primary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color"
                        value={config.primaryColor}
                        onChange={(e) => updateConfig("primaryColor", e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        value={config.primaryColor}
                        onChange={(e) => updateConfig("primaryColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Secondary Color</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color"
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        value={config.secondaryColor}
                        onChange={(e) => updateConfig("secondaryColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Header Background</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color"
                        value={config.headerBgColor}
                        onChange={(e) => updateConfig("headerBgColor", e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        value={config.headerBgColor}
                        onChange={(e) => updateConfig("headerBgColor", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Table Header Background</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="color"
                        value={config.tableHeaderBg}
                        onChange={(e) => updateConfig("tableHeaderBg", e.target.value)}
                        className="w-12 h-10 p-1 cursor-pointer"
                      />
                      <Input 
                        value={config.tableHeaderBg}
                        onChange={(e) => updateConfig("tableHeaderBg", e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Font Family</Label>
                  <Select 
                    value={config.fontFamily} 
                    onValueChange={(v) => updateConfig("fontFamily", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Inter">Inter</SelectItem>
                      <SelectItem value="Roboto">Roboto</SelectItem>
                      <SelectItem value="Open Sans">Open Sans</SelectItem>
                      <SelectItem value="Lato">Lato</SelectItem>
                      <SelectItem value="Montserrat">Montserrat</SelectItem>
                      <SelectItem value="Arial">Arial</SelectItem>
                      <SelectItem value="Georgia">Georgia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-6 border-t mt-6">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </Button>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="w-1/2 bg-muted/30 overflow-hidden flex flex-col">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">Live Preview</span>
            </div>
            
            <ScrollArea className="flex-1">
              <div className="p-6">
                <div 
                  className="bg-white rounded-lg shadow-lg overflow-hidden"
                  style={{ fontFamily: config.fontFamily }}
                >
                  {/* Header */}
                  <div 
                    className="p-6 text-white"
                    style={{ backgroundColor: config.headerBgColor }}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        {config.showLogo && (
                          <div 
                            className="w-16 h-16 rounded flex items-center justify-center font-bold text-sm"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            LOGO
                          </div>
                        )}
                        <div>
                          <h1 className="text-xl font-bold">{config.companyName}</h1>
                          <p className="text-sm opacity-80 whitespace-pre-line">{config.companyAddress}</p>
                          <p className="text-sm opacity-80">{config.companyPhone}</p>
                          <p className="text-sm opacity-80">{config.companyEmail}</p>
                          {config.companyWebsite && (
                            <p className="text-sm opacity-80">{config.companyWebsite}</p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <h2 
                          className="text-3xl font-bold tracking-wider"
                          style={{ color: config.primaryColor }}
                        >
                          {config.documentTitle}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Estimate Info & Client Block */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Estimate Info */}
                      <div className="space-y-2">
                        {config.showEstimateNumber && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Estimate #:</span>
                            <span className="font-medium">{sampleData.estimateNumber}</span>
                          </div>
                        )}
                        {config.showEstimateDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Date:</span>
                            <span>{sampleData.estimateDate}</span>
                          </div>
                        )}
                        {config.showExpirationDate && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Valid Until:</span>
                            <span>{sampleData.expirationDate}</span>
                          </div>
                        )}
                        {config.showReference && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">{config.referenceLabel}:</span>
                            <span>{sampleData.reference}</span>
                          </div>
                        )}
                      </div>

                      {/* Client Block */}
                      <div 
                        className="p-4 rounded-lg"
                        style={{ backgroundColor: config.accentColor }}
                      >
                        <h3 
                          className="text-xs font-bold tracking-wider mb-2"
                          style={{ color: config.primaryColor }}
                        >
                          {config.clientBlockTitle}
                        </h3>
                        <div className="space-y-1 text-sm">
                          {config.showClientName && (
                            <p className="font-semibold">{sampleData.client.name}</p>
                          )}
                          {config.showClientCompany && (
                            <p className="text-gray-600">{sampleData.client.company}</p>
                          )}
                          {config.showClientAddress && (
                            <p className="text-gray-600 whitespace-pre-line">{sampleData.client.address}</p>
                          )}
                          {config.showClientPhone && (
                            <p className="text-gray-600">{sampleData.client.phone}</p>
                          )}
                          {config.showClientEmail && (
                            <p className="text-gray-600">{sampleData.client.email}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    <div className="border rounded-lg overflow-hidden" style={{ borderColor: config.tableBorderColor }}>
                      <table className="w-full text-sm">
                        <thead>
                          <tr style={{ backgroundColor: config.tableHeaderBg }}>
                            {config.tableColumns.item && (
                              <th className="px-4 py-3 text-left font-semibold" style={{ color: config.secondaryColor }}>
                                {config.itemColumnLabel}
                              </th>
                            )}
                            {config.tableColumns.description && (
                              <th className="px-4 py-3 text-left font-semibold" style={{ color: config.secondaryColor }}>
                                {config.descriptionColumnLabel}
                              </th>
                            )}
                            {config.tableColumns.quantity && (
                              <th className="px-4 py-3 text-center font-semibold" style={{ color: config.secondaryColor }}>
                                {config.quantityColumnLabel}
                              </th>
                            )}
                            {config.tableColumns.rate && (
                              <th className="px-4 py-3 text-right font-semibold" style={{ color: config.secondaryColor }}>
                                {config.rateColumnLabel}
                              </th>
                            )}
                            {config.tableColumns.amount && (
                              <th className="px-4 py-3 text-right font-semibold" style={{ color: config.secondaryColor }}>
                                {config.amountColumnLabel}
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {sampleData.items.map((item, index) => (
                            <tr 
                              key={index} 
                              className="border-t"
                              style={{ borderColor: config.tableBorderColor }}
                            >
                              {config.tableColumns.item && (
                                <td className="px-4 py-3">{item.item}</td>
                              )}
                              {config.tableColumns.description && (
                                <td className="px-4 py-3">{item.description}</td>
                              )}
                              {config.tableColumns.quantity && (
                                <td className="px-4 py-3 text-center">{item.qty}</td>
                              )}
                              {config.tableColumns.rate && (
                                <td className="px-4 py-3 text-right">{formatCurrency(item.rate)}</td>
                              )}
                              {config.tableColumns.amount && (
                                <td className="px-4 py-3 text-right font-medium">{formatCurrency(item.amount)}</td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end">
                      <div className="w-64 space-y-2">
                        {config.showSubtotal && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Subtotal:</span>
                            <span>{formatCurrency(sampleData.subtotal)}</span>
                          </div>
                        )}
                        {config.showDiscount && sampleData.discount > 0 && (
                          <div className="flex justify-between text-sm text-green-600">
                            <span>{config.discountLabel}:</span>
                            <span>-{formatCurrency(sampleData.discount)}</span>
                          </div>
                        )}
                        {config.showTax && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{config.taxLabel} ({config.defaultTaxRate}%):</span>
                            <span>{formatCurrency(sampleData.tax)}</span>
                          </div>
                        )}
                        {config.showFees && sampleData.fees > 0 && (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">{config.feesLabel}:</span>
                            <span>{formatCurrency(sampleData.fees)}</span>
                          </div>
                        )}
                        <div 
                          className="flex justify-between pt-2 border-t-2 font-bold text-lg"
                          style={{ borderColor: config.primaryColor }}
                        >
                          <span>{config.totalLabel}:</span>
                          <span style={{ color: config.primaryColor }}>{formatCurrency(sampleData.total)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Terms & Conditions */}
                    {config.showTerms && (
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: config.secondaryColor }}>
                          {config.termsTitle}
                        </h4>
                        <p className="text-xs text-gray-600 whitespace-pre-line">
                          {config.termsContent}
                        </p>
                      </div>
                    )}

                    {/* Notes */}
                    {config.showNotes && (
                      <div className="pt-4 border-t">
                        <h4 className="font-semibold text-sm mb-2" style={{ color: config.secondaryColor }}>
                          {config.notesTitle}
                        </h4>
                        <div 
                          className="p-3 rounded text-xs text-gray-500 italic"
                          style={{ backgroundColor: config.accentColor }}
                        >
                          {config.notesPlaceholder}
                        </div>
                      </div>
                    )}

                    {/* Signature */}
                    {config.showSignature && (
                      <div className="pt-6 border-t grid grid-cols-2 gap-8">
                        {config.showClientSignature && (
                          <div className="space-y-2">
                            <div className="border-b border-gray-400 pb-8"></div>
                            <p className="text-xs text-gray-600">Client Signature</p>
                            {config.signatureDate && (
                              <p className="text-xs text-gray-400">Date: _______________</p>
                            )}
                          </div>
                        )}
                        {config.showAuthorizedSignature && (
                          <div className="space-y-2">
                            <div className="border-b border-gray-400 pb-8"></div>
                            <p className="text-xs text-gray-600">Authorized Signature</p>
                            {config.signatureDate && (
                              <p className="text-xs text-gray-400">Date: _______________</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}