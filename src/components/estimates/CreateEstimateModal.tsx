import { useState } from "react";
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
import { Plus, Trash2, MapPin, MessageSquare } from "lucide-react";
import { toast } from "sonner";

interface CreateEstimateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
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
}

export interface Interaction {
  id: string;
  date: string;
  time: string;
  subject: string;
  attendedBy: string;
  notes: string;
}

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
  "Website",
  "Phone Call",
  "Email",
  "Referral",
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

export function CreateEstimateModal({ open, onOpenChange }: CreateEstimateModalProps) {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phoneNumber1: "",
    phoneNumber2: "",
    origin: "",
  });

  const [addresses, setAddresses] = useState<AddressEntry[]>([
    { id: "1", addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" },
  ]);

  const [interactions, setInteractions] = useState<Interaction[]>([]);

  const addAddress = () => {
    setAddresses([
      ...addresses,
      { id: Date.now().toString(), addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" },
    ]);
  };

  const removeAddress = (id: string) => {
    if (addresses.length > 1) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
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

  const formatCurrency = (value: string): string => {
    const numericValue = value.replace(/[^0-9.]/g, "");
    const number = parseFloat(numericValue);
    if (isNaN(number)) return "";
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(number);
  };

  const handleAmountBlur = (id: string, value: string) => {
    const formatted = formatCurrency(value);
    updateAddress(id, "amount", formatted);
  };

  const updateAddress = (id: string, field: keyof AddressEntry, value: string) => {
    setAddresses(
      addresses.map((addr) =>
        addr.id === id ? { ...addr, [field]: value } : addr
      )
    );
  };

  const handleCreateEstimate = () => {
    if (!formData.customerName.trim()) {
      toast.error("Por favor, insira o nome do cliente");
      return;
    }
    if (addresses.every((addr) => !addr.address.trim())) {
      toast.error("Por favor, adicione pelo menos um endereço");
      return;
    }

    toast.success("Lead criado com sucesso!");
    onOpenChange(false);
    
    // Reset form
    setFormData({
      customerName: "",
      email: "",
      phoneNumber1: "",
      phoneNumber2: "",
      origin: "",
    });
    setAddresses([{ id: "1", addressName: "", address: "", date: "", time: "", serviceType: "", amount: "", notes: "", additionalNotes: "" }]);
    setInteractions([]);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Criar Novo Lead</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nome do Cliente *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  placeholder="Digite o nome do cliente"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="cliente@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber1">Telefone 1</Label>
                <Input
                  id="phoneNumber1"
                  value={formData.phoneNumber1}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber1: e.target.value })
                  }
                  placeholder="(11) 99999-9999"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber2">Telefone 2</Label>
                <Input
                  id="phoneNumber2"
                  value={formData.phoneNumber2}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber2: e.target.value })
                  }
                  placeholder="(11) 88888-8888"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origin">Origem</Label>
                <Select
                  value={formData.origin}
                  onValueChange={(value) =>
                    setFormData({ ...formData, origin: value })
                  }
                >
                  <SelectTrigger id="origin">
                    <SelectValue placeholder="Selecione a origem" />
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
          <Button onClick={handleCreateEstimate}>Criar Lead</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
