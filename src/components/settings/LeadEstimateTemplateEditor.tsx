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
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { 
  Save, 
  Eye, 
  Building2,
  User,
  MapPin,
  MessageSquare,
  Palette,
  Layout,
  ChevronDown,
  ChevronUp,
  Home,
  Bath,
  Bed,
  Sofa,
  WashingMachine,
  Plus,
  Settings2,
} from "lucide-react";

// Room services configuration
const ROOM_SERVICES = {
  kitchen: {
    label: "KITCHEN",
    icon: Home,
    items: [
      "Clean major appliance exteriors (interior upon request)",
      "Dust window sills",
      "Clean table and chairs",
      "Clean microwave - interior & exterior",
      "Clean/disinfect/polish sinks & faucets",
      "Clean and disinfect counters & backsplash",
      "Clean floors (vacuum, sweep, mop)",
      "Wipe doors, handles & light switches",
      "Wipe outside cabinets & drawers",
      "Remove cobwebs",
      "Empty trash and replace liner",
      "Dust baseboards",
    ],
  },
  bathroom: {
    label: "BATHROOM",
    icon: Bath,
    items: [
      "Clean tub shower door and inside of the shower",
      "Clean and polish countertop, sinks, and faucets",
      "Clean mirrors",
      "Dust window sills",
      "Clean and disinfect towel bars",
      "Dust picture frames",
      "Fold and hang towels neatly",
      "Empty trash and replace liner",
      "Remove cobwebs",
      "Clean & sanitize toilets in/out",
      "Wipe doors, handles & light switches",
      "Clean floors (vacuum, sweep, mop)",
      "Clean exterior of vanities",
      "Dust baseboards",
    ],
  },
  bedroom: {
    label: "BEDROOM",
    icon: Bed,
    items: [
      "Clean floors (vacuum, sweep, mop)",
      "Dust baseboards",
      "Dust furniture within reach (top, front & underneath)",
      "Clean mirrors and glass surfaces",
      "Dust window sills",
      "Remove cobwebs",
      "Dust lamps and lamp shades",
      "Dust picture frames",
      "Wipe doors, handles & light switches",
      "Dust light fixtures, ceiling fans, and vents",
      "Empty trash and replace liner",
    ],
  },
  diningLiving: {
    label: "DINING ROOM / LIVING AREAS",
    icon: Sofa,
    items: [
      "Vacuum/dust upholstered furniture",
      "Dust lamps and lamp shades",
      "Dust furniture within reach (top, front & underneath)",
      "Dust picture frames",
      "Dust windowsills",
      "Clean counters & backsplash",
      "Clean mirrors and glass surfaces",
      "Empty trash and replace liner",
      "Clean floors (vacuum, sweep, mop)",
      "Remove cobwebs",
      "Wipe doors & light switches",
      "Dust baseboards",
    ],
  },
  laundryRoom: {
    label: "LAUNDRY ROOM",
    icon: WashingMachine,
    items: [
      "Dust windowsill",
      "Wipe tops of washer and dryer",
      "Empty trash and replace liner",
      "Clean floors (vacuum, sweep, mop)",
      "Remove cobwebs",
      "Wipe doors, handles & light switches",
      "Wipe outside cabinets and drawers",
      "Dust baseboards",
    ],
  },
  addOns: {
    label: "ADD-ON SERVICES",
    icon: Plus,
    items: [
      "Clean inside refrigerator",
      "Clean inside oven",
      "Clean the garage",
      "Clean inside cabinets",
      "*By request only",
    ],
  },
} as const;

interface LeadEstimateTemplateConfig {
  // Company section
  showCompanyLogo: boolean;
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;

  // Customer section visibility
  showCustomerName: boolean;
  showCustomerEmail: boolean;
  showCustomerPhone1: boolean;
  showCustomerPhone2: boolean;
  showOrigin: boolean;
  showExpiryDate: boolean;

  // Address section
  showAddressName: boolean;
  showAddress: boolean;
  showDate: boolean;
  showTime: boolean;
  showServiceType: boolean;
  showAmount: boolean;
  showNotes: boolean;
  showAdditionalNotes: boolean;

  // Room services
  enableRoomServices: boolean;
  enabledRooms: {
    kitchen: boolean;
    bathroom: boolean;
    bedroom: boolean;
    diningLiving: boolean;
    laundryRoom: boolean;
    addOns: boolean;
  };
  roomServicesItems: {
    kitchen: string[];
    bathroom: string[];
    bedroom: string[];
    diningLiving: string[];
    laundryRoom: string[];
    addOns: string[];
  };

  // Interactions section
  showInteractions: boolean;

  // Styling
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;

  // Footer
  footerText: string;
  termsAndConditions: string;
}

const defaultConfig: LeadEstimateTemplateConfig = {
  showCompanyLogo: true,
  companyName: "CleanPro Services",
  companyAddress: "123 Business Center, City, State 12345",
  companyPhone: "(555) 987-6543",
  companyEmail: "info@cleanpro.com",

  showCustomerName: true,
  showCustomerEmail: true,
  showCustomerPhone1: true,
  showCustomerPhone2: true,
  showOrigin: true,
  showExpiryDate: true,

  showAddressName: true,
  showAddress: true,
  showDate: true,
  showTime: true,
  showServiceType: true,
  showAmount: true,
  showNotes: true,
  showAdditionalNotes: true,

  enableRoomServices: true,
  enabledRooms: {
    kitchen: true,
    bathroom: true,
    bedroom: true,
    diningLiving: true,
    laundryRoom: true,
    addOns: true,
  },
  roomServicesItems: {
    kitchen: [...ROOM_SERVICES.kitchen.items],
    bathroom: [...ROOM_SERVICES.bathroom.items],
    bedroom: [...ROOM_SERVICES.bedroom.items],
    diningLiving: [...ROOM_SERVICES.diningLiving.items],
    laundryRoom: [...ROOM_SERVICES.laundryRoom.items],
    addOns: [...ROOM_SERVICES.addOns.items],
  },

  showInteractions: true,

  primaryColor: "#dc2626",
  secondaryColor: "#1f2937",
  fontFamily: "Inter",

  footerText: "Thank you for your interest in our services!",
  termsAndConditions: "This estimate is valid for 30 days. Final pricing may vary based on actual conditions.",
};

interface LeadEstimateTemplateEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Store saved config
let savedLeadEstimateConfig: LeadEstimateTemplateConfig | null = null;

export function LeadEstimateTemplateEditor({ open, onOpenChange }: LeadEstimateTemplateEditorProps) {
  const [config, setConfig] = useState<LeadEstimateTemplateConfig>(
    savedLeadEstimateConfig || defaultConfig
  );
  const [activeTab, setActiveTab] = useState("company");
  const [expandedRooms, setExpandedRooms] = useState<Record<string, boolean>>({});

  const updateConfig = <K extends keyof LeadEstimateTemplateConfig>(
    key: K, 
    value: LeadEstimateTemplateConfig[K]
  ) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleRoom = (roomKey: keyof typeof config.enabledRooms) => {
    setConfig(prev => ({
      ...prev,
      enabledRooms: {
        ...prev.enabledRooms,
        [roomKey]: !prev.enabledRooms[roomKey],
      },
    }));
  };

  const toggleRoomExpand = (roomKey: string) => {
    setExpandedRooms(prev => ({
      ...prev,
      [roomKey]: !prev[roomKey],
    }));
  };

  const handleSave = () => {
    savedLeadEstimateConfig = config;
    toast.success("Lead/Estimate template saved successfully!");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center gap-2">
            <Settings2 className="w-5 h-5" />
            Edit Lead / Estimate Template
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex-1 flex overflow-hidden">
          {/* Editor Panel */}
          <div className="w-1/2 border-r border-border overflow-y-auto p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="company" className="text-xs">
                  <Building2 className="w-3 h-3 mr-1" />
                  Company
                </TabsTrigger>
                <TabsTrigger value="customer" className="text-xs">
                  <User className="w-3 h-3 mr-1" />
                  Customer
                </TabsTrigger>
                <TabsTrigger value="address" className="text-xs">
                  <MapPin className="w-3 h-3 mr-1" />
                  Address
                </TabsTrigger>
                <TabsTrigger value="rooms" className="text-xs">
                  <Home className="w-3 h-3 mr-1" />
                  Rooms
                </TabsTrigger>
                <TabsTrigger value="styling" className="text-xs">
                  <Palette className="w-3 h-3 mr-1" />
                  Styling
                </TabsTrigger>
              </TabsList>

              {/* Company Tab */}
              <TabsContent value="company" className="space-y-4">
                <h3 className="font-semibold">Company Information</h3>
                
                <div className="flex items-center justify-between">
                  <Label>Show Company Logo</Label>
                  <Switch 
                    checked={config.showCompanyLogo} 
                    onCheckedChange={(v) => updateConfig("showCompanyLogo", v)} 
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
                  <Label>Address</Label>
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

                <Separator className="my-4" />

                <div className="space-y-2">
                  <Label>Footer Text</Label>
                  <Textarea 
                    value={config.footerText}
                    onChange={(e) => updateConfig("footerText", e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Terms & Conditions</Label>
                  <Textarea 
                    value={config.termsAndConditions}
                    onChange={(e) => updateConfig("termsAndConditions", e.target.value)}
                    rows={3}
                  />
                </div>
              </TabsContent>

              {/* Customer Tab */}
              <TabsContent value="customer" className="space-y-4">
                <h3 className="font-semibold">Customer Information Fields</h3>
                <p className="text-sm text-muted-foreground">Choose which fields to display in the template</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Customer Name</Label>
                    <Switch 
                      checked={config.showCustomerName} 
                      onCheckedChange={(v) => updateConfig("showCustomerName", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Email</Label>
                    <Switch 
                      checked={config.showCustomerEmail} 
                      onCheckedChange={(v) => updateConfig("showCustomerEmail", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Phone 1</Label>
                    <Switch 
                      checked={config.showCustomerPhone1} 
                      onCheckedChange={(v) => updateConfig("showCustomerPhone1", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Phone 2</Label>
                    <Switch 
                      checked={config.showCustomerPhone2} 
                      onCheckedChange={(v) => updateConfig("showCustomerPhone2", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Origin</Label>
                    <Switch 
                      checked={config.showOrigin} 
                      onCheckedChange={(v) => updateConfig("showOrigin", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Expiry Date</Label>
                    <Switch 
                      checked={config.showExpiryDate} 
                      onCheckedChange={(v) => updateConfig("showExpiryDate", v)} 
                    />
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <Label>Lead Interactions</Label>
                    <p className="text-xs text-muted-foreground">Show interaction history section</p>
                  </div>
                  <Switch 
                    checked={config.showInteractions} 
                    onCheckedChange={(v) => updateConfig("showInteractions", v)} 
                  />
                </div>
              </TabsContent>

              {/* Address Tab */}
              <TabsContent value="address" className="space-y-4">
                <h3 className="font-semibold">Service Address Fields</h3>
                <p className="text-sm text-muted-foreground">Choose which address fields to display</p>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Address Name</Label>
                    <Switch 
                      checked={config.showAddressName} 
                      onCheckedChange={(v) => updateConfig("showAddressName", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Full Address</Label>
                    <Switch 
                      checked={config.showAddress} 
                      onCheckedChange={(v) => updateConfig("showAddress", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Date</Label>
                    <Switch 
                      checked={config.showDate} 
                      onCheckedChange={(v) => updateConfig("showDate", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Time</Label>
                    <Switch 
                      checked={config.showTime} 
                      onCheckedChange={(v) => updateConfig("showTime", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Service Type</Label>
                    <Switch 
                      checked={config.showServiceType} 
                      onCheckedChange={(v) => updateConfig("showServiceType", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Amount</Label>
                    <Switch 
                      checked={config.showAmount} 
                      onCheckedChange={(v) => updateConfig("showAmount", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Notes</Label>
                    <Switch 
                      checked={config.showNotes} 
                      onCheckedChange={(v) => updateConfig("showNotes", v)} 
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <Label>Additional Notes</Label>
                    <Switch 
                      checked={config.showAdditionalNotes} 
                      onCheckedChange={(v) => updateConfig("showAdditionalNotes", v)} 
                    />
                  </div>
                </div>
              </TabsContent>

              {/* Rooms Tab */}
              <TabsContent value="rooms" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Room Services</h3>
                    <p className="text-sm text-muted-foreground">Configure room service cards for each address</p>
                  </div>
                  <Switch 
                    checked={config.enableRoomServices} 
                    onCheckedChange={(v) => updateConfig("enableRoomServices", v)} 
                  />
                </div>

                {config.enableRoomServices && (
                  <div className="space-y-3">
                    {(Object.keys(ROOM_SERVICES) as Array<keyof typeof ROOM_SERVICES>).map((roomKey) => {
                      const room = ROOM_SERVICES[roomKey];
                      const RoomIcon = room.icon;
                      const isExpanded = expandedRooms[roomKey];
                      const isEnabled = config.enabledRooms[roomKey];

                      return (
                        <div
                          key={roomKey}
                          className={`border rounded-lg transition-all ${
                            isEnabled ? "border-primary bg-primary/5" : "border-border"
                          }`}
                        >
                          <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                              <Checkbox
                                checked={isEnabled}
                                onCheckedChange={() => toggleRoom(roomKey)}
                              />
                              <RoomIcon className="w-4 h-4 text-primary" />
                              <span className="font-medium text-sm">{room.label}</span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleRoomExpand(roomKey)}
                            >
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>

                          {isExpanded && (
                            <div className="px-3 pb-3 border-t">
                              <p className="text-xs text-muted-foreground py-2">
                                Services included in this room:
                              </p>
                              <div className="space-y-1 max-h-[200px] overflow-y-auto">
                                {config.roomServicesItems[roomKey].map((item, idx) => (
                                  <div key={idx} className="flex items-start gap-2 text-xs">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{item}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
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
          <div className="w-1/2 bg-muted/30 overflow-y-auto">
            <div className="sticky top-0 bg-background border-b p-4 flex items-center gap-2">
              <Eye className="w-4 h-4" />
              <span className="font-medium">Live Preview</span>
            </div>
            
            <ScrollArea className="h-[calc(100%-57px)]">
              <div className="p-6">
                <div 
                  className="bg-white rounded-lg shadow-lg p-6 space-y-6"
                  style={{ fontFamily: config.fontFamily }}
                >
                  {/* Company Header */}
                  <div className="border-b pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        {config.showCompanyLogo && (
                          <div 
                            className="w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold mb-2"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            LOGO
                          </div>
                        )}
                        <h1 
                          className="text-xl font-bold"
                          style={{ color: config.primaryColor }}
                        >
                          {config.companyName}
                        </h1>
                        <p className="text-sm text-gray-600">{config.companyAddress}</p>
                        <p className="text-sm text-gray-600">{config.companyPhone} • {config.companyEmail}</p>
                      </div>
                      <div className="text-right">
                        <h2 
                          className="text-2xl font-bold"
                          style={{ color: config.secondaryColor }}
                        >
                          ESTIMATE
                        </h2>
                        <p className="text-sm text-gray-500">EST-2024-001</p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="space-y-2">
                    <h3 
                      className="text-sm font-semibold uppercase tracking-wide"
                      style={{ color: config.primaryColor }}
                    >
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {config.showCustomerName && (
                        <div>
                          <span className="text-gray-500">Name:</span>
                          <span className="ml-2 font-medium">John Smith</span>
                        </div>
                      )}
                      {config.showCustomerEmail && (
                        <div>
                          <span className="text-gray-500">Email:</span>
                          <span className="ml-2">john@email.com</span>
                        </div>
                      )}
                      {config.showCustomerPhone1 && (
                        <div>
                          <span className="text-gray-500">Phone 1:</span>
                          <span className="ml-2">(555) 123-4567</span>
                        </div>
                      )}
                      {config.showCustomerPhone2 && (
                        <div>
                          <span className="text-gray-500">Phone 2:</span>
                          <span className="ml-2">(555) 987-6543</span>
                        </div>
                      )}
                      {config.showOrigin && (
                        <div>
                          <span className="text-gray-500">Origin:</span>
                          <span className="ml-2">Google</span>
                        </div>
                      )}
                      {config.showExpiryDate && (
                        <div>
                          <span className="text-gray-500">Valid Until:</span>
                          <span className="ml-2">Feb 15, 2024</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service Address */}
                  <div className="space-y-3">
                    <h3 
                      className="text-sm font-semibold uppercase tracking-wide"
                      style={{ color: config.primaryColor }}
                    >
                      Service Address
                    </h3>
                    <div 
                      className="p-4 rounded-lg border"
                      style={{ borderColor: `${config.primaryColor}30` }}
                    >
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        {config.showAddressName && (
                          <div>
                            <span className="text-gray-500">Location:</span>
                            <span className="ml-2 font-medium">Home</span>
                          </div>
                        )}
                        {config.showAddress && (
                          <div className="col-span-2">
                            <span className="text-gray-500">Address:</span>
                            <span className="ml-2">456 Customer St, City, State 12345</span>
                          </div>
                        )}
                        {config.showDate && (
                          <div>
                            <span className="text-gray-500">Date:</span>
                            <span className="ml-2">Jan 15, 2024</span>
                          </div>
                        )}
                        {config.showTime && (
                          <div>
                            <span className="text-gray-500">Time:</span>
                            <span className="ml-2">9:00 AM</span>
                          </div>
                        )}
                        {config.showServiceType && (
                          <div>
                            <span className="text-gray-500">Service:</span>
                            <span className="ml-2">Deep Cleaning</span>
                          </div>
                        )}
                        {config.showAmount && (
                          <div>
                            <span className="text-gray-500">Amount:</span>
                            <span className="ml-2 font-bold" style={{ color: config.primaryColor }}>$350.00</span>
                          </div>
                        )}
                      </div>

                      {/* Room Services Preview */}
                      {config.enableRoomServices && (
                        <div className="mt-4 pt-4 border-t">
                          <p className="text-xs font-medium text-gray-500 mb-2">SERVICE AREAS</p>
                          <div className="grid grid-cols-3 gap-2">
                            {(Object.keys(config.enabledRooms) as Array<keyof typeof config.enabledRooms>).map((roomKey) => {
                              if (!config.enabledRooms[roomKey]) return null;
                              const room = ROOM_SERVICES[roomKey];
                              return (
                                <div 
                                  key={roomKey}
                                  className="text-xs p-2 rounded border flex items-center gap-1"
                                  style={{ 
                                    borderColor: config.primaryColor,
                                    backgroundColor: `${config.primaryColor}10`
                                  }}
                                >
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: config.primaryColor }} />
                                  <span className="truncate">{room.label}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {config.showNotes && (
                        <div className="mt-3 text-sm">
                          <span className="text-gray-500">Notes:</span>
                          <p className="mt-1 text-gray-600 italic">Special attention to kitchen appliances</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Interactions */}
                  {config.showInteractions && (
                    <div className="space-y-2">
                      <h3 
                        className="text-sm font-semibold uppercase tracking-wide"
                        style={{ color: config.primaryColor }}
                      >
                        Lead Interactions
                      </h3>
                      <div className="space-y-2">
                        <div className="p-3 bg-gray-50 rounded text-sm">
                          <div className="flex justify-between text-gray-500 text-xs mb-1">
                            <span>Jan 10, 2024 • 10:30 AM</span>
                            <span>Maria Silva</span>
                          </div>
                          <p className="font-medium">Initial Contact</p>
                          <p className="text-gray-600 text-xs">Customer interested in deep cleaning service</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="border-t pt-4 space-y-2">
                    {config.footerText && (
                      <p className="text-sm text-gray-600 text-center">{config.footerText}</p>
                    )}
                    {config.termsAndConditions && (
                      <p className="text-xs text-gray-400 text-center">{config.termsAndConditions}</p>
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