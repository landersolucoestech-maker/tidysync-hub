import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Trash2, MapPin, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

export interface Interaction {
  id: string;
  date: string;
  time: string;
  subject: string;
  attendedBy: string;
  notes: string;
}

interface Estimate {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  service: string;
  amount: string;
  date: string;
  expiryDate: string;
  status: string;
  address: string;
  validUntil: string;
  origin?: string;
  hasJob?: boolean;
  interactions?: Interaction[];
}

interface EditEstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: Estimate | null;
  onSave: (updatedEstimate: Estimate) => void;
}

interface RoomSelection {
  kitchen: boolean;
  bathroom: boolean;
  bedroom: boolean;
  diningLiving: boolean;
  laundryRoom: boolean;
  addOns: boolean;
}

interface AddressEntry {
  id: string;
  addressName: string;
  address: string;
  date: string;
  time: string;
  serviceType: string;
  amount: string;
  notes: string;
  additionalNotes: string;
  rooms: RoomSelection;
}

const ROOM_SERVICES = {
  kitchen: {
    label: "KITCHEN",
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
    items: [
      "Clean inside refrigerator",
      "Clean inside oven",
      "Clean the garage",
      "Clean inside cabinets",
      "*By request only",
    ],
  },
} as const;

const serviceTypes = [
  "Standard Cleaning",
  "Deep Cleaning",
  "Move-in/Move-out Cleaning",
  "Office Cleaning",
  "Commercial Cleaning",
  "Window Cleaning",
  "Carpet Cleaning",
  "Post-Construction Cleaning",
  "Recurring Cleaning",
];

const originOptions = [
  "Google",
  "Phone Call",
  "Instagram",
  "Referral",
  "Facebook",
  "Nextdoor",
  "Website",
  "Email",
  "Social Media",
  "Google Ads",
  "Walk-in",
  "Other",
];

const staffOptions = [
  "Maria Silva",
  "João Santos",
  "Ana Costa",
  "Pedro Oliveira",
  "Carla Souza",
];

const formatCurrency = (value: string): string => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  const number = parseFloat(numericValue);
  if (isNaN(number)) {
    return "";
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const parseCurrencyToNumber = (value: string): number => {
  const numericValue = value.replace(/[^0-9.]/g, "");
  return parseFloat(numericValue) || 0;
};

export function EditEstimateModal({ open, onOpenChange, estimate, onSave }: EditEstimateModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    origin: "",
    dateCreated: "",
    expiryDate: "",
  });

  const defaultRooms: RoomSelection = {
    kitchen: false,
    bathroom: false,
    bedroom: false,
    diningLiving: false,
    laundryRoom: false,
    addOns: false,
  };

  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { id: "1", addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "", rooms: { ...defaultRooms } },
  ]);

  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [expandedRooms, setExpandedRooms] = useState<Record<string, Record<string, boolean>>>({});

  // Load estimate data when modal opens
  useEffect(() => {
    if (estimate && open) {
      setFormData({
        customerName: estimate.customer,
        email: estimate.email || "",
        phoneNumber1: estimate.phone || "",
        phoneNumber2: "",
        origin: estimate.origin || "",
        dateCreated: estimate.date || "",
        expiryDate: estimate.expiryDate,
      });
      
      setAddresses([{
        id: "1",
        addressName: "",
        address: estimate.address,
        date: estimate.date,
        time: "",
        serviceType: estimate.service,
        amount: estimate.amount,
        notes: "",
        additionalNotes: "",
        rooms: { ...defaultRooms },
      }]);

      setInteractions(estimate.interactions || []);
    }
  }, [estimate, open]);

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { id: Date.now().toString(), addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "", rooms: { ...defaultRooms } },
    ]);
  };

  const toggleRoomExpand = (addressId: string, roomKey: string) => {
    setExpandedRooms(prev => ({
      ...prev,
      [addressId]: {
        ...prev[addressId],
        [roomKey]: !prev[addressId]?.[roomKey],
      }
    }));
  };

  const updateRoomSelection = (addressId: string, roomKey: keyof RoomSelection, checked: boolean) => {
    setAddresses(addresses.map(addr =>
      addr.id === addressId
        ? { ...addr, rooms: { ...addr.rooms, [roomKey]: checked } }
        : addr
    ));
  };

  const removeAddress = (id: string) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  const updateAddress = (id: string, field: keyof AddressEntry, value: string) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const handleAmountBlur = (id: string, value: string) => {
    const formatted = formatCurrency(value);
    updateAddress(id, "amount", formatted);
  };

  const addInteraction = () => {
    const now = new Date();
    setInteractions([
      ...interactions,
      {
        id: Date.now().toString(),
        date: now.toISOString().split("T")[0],
        time: now.toTimeString().slice(0, 5),
        subject: "",
        attendedBy: "",
        notes: "",
      },
    ]);
  };

  const removeInteraction = (id: string) => {
    setInteractions(interactions.filter((i) => i.id !== id));
  };

  const updateInteraction = (id: string, field: keyof Interaction, value: string) => {
    setInteractions(
      interactions.map((i) =>
        i.id === id ? { ...i, [field]: value } : i
      )
    );
  };

  const handleSaveEstimate = () => {
    if (!formData.customerName.trim()) {
      toast.error("Por favor, insira o nome do cliente");
      return;
    }
    if (addresses.every((addr) => !addr.address.trim())) {
      toast.error("Por favor, adicione pelo menos um endereço");
      return;
    }

    // Validate amount format
    for (const addr of addresses) {
      if (addr.amount && parseCurrencyToNumber(addr.amount) <= 0) {
        toast.error("Por favor, insira um valor válido para todos os endereços");
        return;
      }
    }

    if (estimate) {
      // Calculate total amount from all addresses
      const totalAmount = addresses.reduce((sum, addr) => {
        return sum + parseCurrencyToNumber(addr.amount);
      }, 0);

      const updatedEstimate: Estimate = {
        ...estimate,
        customer: formData.customerName,
        email: formData.email,
        phone: formData.phoneNumber1,
        address: addresses[0]?.address || estimate.address,
        service: addresses[0]?.serviceType || estimate.service,
        amount: formatCurrency(totalAmount.toString()),
        date: addresses[0]?.date || estimate.date,
        expiryDate: formData.expiryDate,
        origin: formData.origin,
        interactions: interactions,
      };

      onSave(updatedEstimate);
      toast.success("Lead atualizado com sucesso!");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Editar Lead {estimate?.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-customerName">Nome do Cliente *</Label>
                <Input
                  id="edit-customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Digite o nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber1">Telefone 1</Label>
                <Input
                  id="edit-phoneNumber1"
                  value={formData.phoneNumber1}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber1: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-phoneNumber2">Telefone 2</Label>
                <Input
                  id="edit-phoneNumber2"
                  value={formData.phoneNumber2}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber2: e.target.value })
                  }
                  placeholder="(11) 88888-8888"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-origin">Origem</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) =>
                    setFormData({ ...formData, origin: value })
                  }
                >
                  <SelectTrigger id="edit-origin">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border z-50">
                    {originOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-dateCreated">Data de Criação</Label>
                <Input
                  id="edit-dateCreated"
                  type="date"
                  value={formData.dateCreated}
                  onChange={(e) =>
                    setFormData({ ...formData, dateCreated: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-expiryDate">Válido Até</Label>
                <Input
                  id="edit-expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData({ ...formData, expiryDate: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Endereços de Serviço
              </h3>
              <Button variant="outline" size="sm" onClick={addAddress}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Endereço
              </Button>
            </div>

            <div className="space-y-4">
              {addresses.map((addr, index) => (
                <div
                  key={addr.id}
                  className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      Endereço {index + 1}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeAddress(addr.id)}
                      disabled={addresses.length === 1}
                      className="text-destructive hover:text-destructive h-8 w-8"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Nome do Endereço</Label>
                      <Input
                        value={addr.addressName}
                        onChange={(e) => updateAddress(addr.id, "addressName", e.target.value)}
                        placeholder="Casa, Escritório, etc."
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Endereço</Label>
                      <Input
                        value={addr.address}
                        onChange={(e) => updateAddress(addr.id, "address", e.target.value)}
                        placeholder="Rua Principal, 123, Cidade, Estado"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-2">
                      <Label>Data</Label>
                      <Input
                        type="date"
                        value={addr.date}
                        onChange={(e) => updateAddress(addr.id, "date", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Horário</Label>
                      <Input
                        type="time"
                        value={addr.time}
                        onChange={(e) => updateAddress(addr.id, "time", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Tipo de Serviço</Label>
                      <Select
                        value={addr.serviceType}
                        onValueChange={(value) => updateAddress(addr.id, "serviceType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover border-border z-50">
                          {serviceTypes.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Valor</Label>
                      <Input
                        type="text"
                        value={addr.amount}
                        onChange={(e) => updateAddress(addr.id, "amount", e.target.value)}
                        onBlur={(e) => handleAmountBlur(addr.id, e.target.value)}
                        placeholder="$0.00"
                      />
                    </div>
                  </div>

                  {/* Room Services Grid */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Service Areas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {(Object.keys(ROOM_SERVICES) as Array<keyof typeof ROOM_SERVICES>).map((roomKey) => {
                        const room = ROOM_SERVICES[roomKey];
                        const isExpanded = expandedRooms[addr.id]?.[roomKey] || false;
                        const isChecked = addr.rooms[roomKey];

                        return (
                          <div
                            key={roomKey}
                            className={`border rounded-lg p-3 transition-all ${
                              isChecked 
                                ? "border-primary bg-primary/5" 
                                : "border-border bg-muted/20 hover:border-muted-foreground/50"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              <Checkbox
                                id={`${addr.id}-${roomKey}`}
                                checked={isChecked}
                                onCheckedChange={(checked) => 
                                  updateRoomSelection(addr.id, roomKey, checked as boolean)
                                }
                                className="mt-0.5"
                              />
                              <div className="flex-1 min-w-0">
                                <label
                                  htmlFor={`${addr.id}-${roomKey}`}
                                  className="text-sm font-semibold cursor-pointer block"
                                >
                                  {room.label}
                                </label>
                                <button
                                  type="button"
                                  onClick={() => toggleRoomExpand(addr.id, roomKey)}
                                  className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1 mt-1"
                                >
                                  {isExpanded ? (
                                    <>
                                      <ChevronUp className="w-3 h-3" />
                                      Hide details
                                    </>
                                  ) : (
                                    <>
                                      <ChevronDown className="w-3 h-3" />
                                      View details
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            {isExpanded && (
                              <ul className="mt-3 space-y-1 text-xs text-muted-foreground border-t border-border/50 pt-2">
                                {room.items.map((item, idx) => (
                                  <li key={idx} className="flex items-start gap-1.5">
                                    <span className="text-primary mt-0.5">•</span>
                                    <span>{item}</span>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Observações</Label>
                    <Textarea
                      value={addr.notes}
                      onChange={(e) => updateAddress(addr.id, "notes", e.target.value)}
                      placeholder="Observações sobre este endereço..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Observações Adicionais</Label>
                    <Textarea
                      value={addr.additionalNotes}
                      onChange={(e) => updateAddress(addr.id, "additionalNotes", e.target.value)}
                      placeholder="Observações adicionais..."
                      rows={2}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Interações com o Lead
              </h3>
              <Button variant="outline" size="sm" onClick={addInteraction}>
                <Plus className="w-4 h-4 mr-1" />
                Adicionar Interação
              </Button>
            </div>

            {interactions.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4 bg-muted/30 rounded-lg">
                Nenhuma interação registrada. Clique em "Adicionar Interação" para registrar um contato.
              </p>
            ) : (
              <div className="space-y-4">
                {interactions.map((interaction, index) => (
                  <div
                    key={interaction.id}
                    className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-medium">
                        <MessageSquare className="w-4 h-4 text-primary" />
                        Interação {index + 1}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeInteraction(interaction.id)}
                        className="text-destructive hover:text-destructive h-8 w-8"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Data</Label>
                        <Input
                          type="date"
                          value={interaction.date}
                          onChange={(e) => updateInteraction(interaction.id, "date", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Horário</Label>
                        <Input
                          type="time"
                          value={interaction.time}
                          onChange={(e) => updateInteraction(interaction.id, "time", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Assunto</Label>
                        <Input
                          value={interaction.subject}
                          onChange={(e) => updateInteraction(interaction.id, "subject", e.target.value)}
                          placeholder="Ex: Primeiro contato"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Atendido por</Label>
                        <Select
                          value={interaction.attendedBy}
                          onValueChange={(value) => updateInteraction(interaction.id, "attendedBy", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent className="bg-popover border-border z-50">
                            {staffOptions.map((staff) => (
                              <SelectItem key={staff} value={staff}>
                                {staff}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Notas da Interação</Label>
                      <Textarea
                        value={interaction.notes}
                        onChange={(e) => updateInteraction(interaction.id, "notes", e.target.value)}
                        placeholder="Detalhes sobre a interação..."
                        rows={2}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSaveEstimate}>Salvar Alterações</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
