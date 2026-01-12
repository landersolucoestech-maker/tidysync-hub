import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  MapPin, 
  User, 
  Phone, 
  Mail,
  Calendar,
  DollarSign,
  AlertCircle,
  MessageSquare,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export interface Interaction {
  id: string;
  date: string;
  time: string;
  subject: string;
  attendedBy: string;
  notes: string;
}

interface RoomSelection {
  kitchen: boolean;
  bathroom: boolean;
  bedroom: boolean;
  diningLiving: boolean;
  laundryRoom: boolean;
  addOns: boolean;
}

interface AddressData {
  id: string;
  addressName: string;
  address: string;
  preferenceDays: string;
  preferenceTime: string;
  frequency: string;
  serviceType: string;
  firstCleaningAmount: string;
  regularAmount: string;
  notes: string;
  additionalNotes: string;
  rooms?: RoomSelection;
}

interface Estimate {
  id: string;
  customer: string;
  email?: string;
  phone?: string;
  phoneNumber2?: string;
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
  addresses?: AddressData[];
}

interface EstimateDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  estimate: Estimate | null;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
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

export function EstimateDetailsModal({ 
  open, 
  onOpenChange, 
  estimate,
  onApprove,
  onReject 
}: EstimateDetailsModalProps) {
  const [expandedRooms, setExpandedRooms] = useState<Record<string, Record<string, boolean>>>({});

  if (!estimate) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved": return "default";
      case "pending": return "secondary";
      case "expired": return "destructive";
      case "draft": return "outline";
      case "rejected": return "destructive";
      default: return "default";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved": return <CheckCircle className="w-4 h-4" />;
      case "pending": return <Clock className="w-4 h-4" />;
      case "expired": return <XCircle className="w-4 h-4" />;
      case "rejected": return <XCircle className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const handleApprove = () => {
    onApprove(estimate.id);
    onOpenChange(false);
  };

  const handleReject = () => {
    onReject(estimate.id);
    toast.info(`Lead ${estimate.id} foi rejeitado.`);
    onOpenChange(false);
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

  const isPending = estimate.status === "pending" || estimate.status === "draft";
  const isApproved = estimate.status === "approved";
  const isRejected = estimate.status === "rejected";

  // Parse amount to number for calculations
  const amountValue = parseFloat(estimate.amount.replace(/[^0-9.]/g, ''));
  const depositAmount = (amountValue * 0.5).toFixed(2);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Lead {estimate.id}
            </DialogTitle>
            <Badge variant={getStatusColor(estimate.status)} className="flex items-center gap-1">
              {getStatusIcon(estimate.status)}
              <span className="capitalize">{estimate.status}</span>
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Informações do Cliente
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Nome</p>
                  <p className="font-medium">{estimate.customer}</p>
                </div>
              </div>
              {estimate.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{estimate.email}</p>
                  </div>
                </div>
              )}
              {estimate.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone 1</p>
                    <p className="font-medium">{estimate.phone}</p>
                  </div>
                </div>
              )}
              {estimate.phoneNumber2 && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Telefone 2</p>
                    <p className="font-medium">{estimate.phoneNumber2}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Origin and Dates */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalhes do Lead
            </h3>
            <div className="grid grid-cols-3 gap-4 p-4 bg-muted/30 rounded-lg">
              {estimate.origin && (
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Origem</p>
                    <p className="font-medium">{estimate.origin}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Data de Criação</p>
                  <p className="font-medium">{formatDate(estimate.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Válido Até</p>
                  <p className="font-medium">{estimate.validUntil || formatDate(estimate.expiryDate)}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Addresses */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Endereços de Serviço
            </h3>
            
            {estimate.addresses && estimate.addresses.length > 0 ? (
              <div className="space-y-4">
                {estimate.addresses.map((addr, index) => (
                  <div 
                    key={addr.id || index} 
                    className="p-4 bg-muted/30 rounded-lg border border-border/50 space-y-4"
                  >
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <MapPin className="w-4 h-4 text-primary" />
                      {addr.addressName || `Endereço ${index + 1}`}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Endereço</p>
                        <p className="text-sm font-medium">{addr.address}</p>
                      </div>
                      {addr.serviceType && (
                        <div>
                          <p className="text-xs text-muted-foreground">Tipo de Serviço</p>
                          <p className="text-sm font-medium">{addr.serviceType}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      {addr.preferenceDays && (
                        <div>
                          <p className="text-xs text-muted-foreground">Preference Days</p>
                          <p className="text-sm font-medium">{addr.preferenceDays}</p>
                        </div>
                      )}
                      {addr.preferenceTime && (
                        <div>
                          <p className="text-xs text-muted-foreground">Preference Time</p>
                          <p className="text-sm font-medium">{addr.preferenceTime}</p>
                        </div>
                      )}
                      {addr.frequency && (
                        <div>
                          <p className="text-xs text-muted-foreground">Frequency</p>
                          <p className="text-sm font-medium">{addr.frequency}</p>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {addr.firstCleaningAmount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">First Cleaning</p>
                            <p className="text-sm font-semibold text-primary">{addr.firstCleaningAmount}</p>
                          </div>
                        </div>
                      )}
                      {addr.regularAmount && (
                        <div className="flex items-center gap-2">
                          <DollarSign className="w-4 h-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Regular</p>
                            <p className="text-sm font-semibold text-primary">{addr.regularAmount}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Room Services */}
                    {addr.rooms && Object.values(addr.rooms).some(v => v) && (
                      <div className="space-y-2">
                        <p className="text-xs text-muted-foreground font-medium">Service Areas</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {(Object.keys(ROOM_SERVICES) as Array<keyof typeof ROOM_SERVICES>).map((roomKey) => {
                            const room = ROOM_SERVICES[roomKey];
                            const isChecked = addr.rooms?.[roomKey];
                            const isExpanded = expandedRooms[addr.id]?.[roomKey] || false;

                            if (!isChecked) return null;

                            return (
                              <div
                                key={roomKey}
                                className="border rounded-lg p-3 border-primary bg-primary/5"
                              >
                                <div className="flex items-start gap-2">
                                  <Checkbox
                                    checked={isChecked}
                                    disabled
                                    className="mt-0.5"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <span className="text-sm font-semibold block">
                                      {room.label}
                                    </span>
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
                    )}

                    {addr.notes && (
                      <div>
                        <p className="text-xs text-muted-foreground">Observações</p>
                        <p className="text-sm bg-background/50 p-2 rounded mt-1">{addr.notes}</p>
                      </div>
                    )}

                    {addr.additionalNotes && (
                      <div>
                        <p className="text-xs text-muted-foreground">Observações Adicionais</p>
                        <p className="text-sm bg-background/50 p-2 rounded mt-1">{addr.additionalNotes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Endereço</p>
                    <p className="font-medium">{estimate.address}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Serviço</p>
                      <p className="font-medium">{estimate.service}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Valor Total</p>
                      <p className="font-medium text-lg">{estimate.amount}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Interaction History */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Histórico de Interações
            </h3>
            
            {!estimate.interactions || estimate.interactions.length === 0 ? (
              <div className="p-4 bg-muted/30 rounded-lg text-center">
                <p className="text-sm text-muted-foreground">
                  Nenhuma interação registrada para este lead.
                </p>
              </div>
            ) : (
              <ScrollArea className="max-h-[250px]">
                <div className="space-y-3">
                  {estimate.interactions.map((interaction, index) => (
                    <div 
                      key={interaction.id} 
                      className="p-4 bg-muted/30 rounded-lg border-l-4 border-primary"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {formatDate(interaction.date)} às {interaction.time}
                          </Badge>
                          <span className="text-sm font-medium text-primary">
                            {interaction.subject || `Interação ${index + 1}`}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <User className="w-3 h-3" />
                        <span>Atendido por: <span className="font-medium text-foreground">{interaction.attendedBy || "-"}</span></span>
                      </div>
                      {interaction.notes && (
                        <p className="text-sm text-foreground bg-background/50 p-2 rounded">
                          {interaction.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Approval Info */}
          {isPending && (
            <>
              <Separator />
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Ações de Aprovação</h4>
                    <p className="text-sm text-muted-foreground">
                      Ao aprovar, o seguinte acontecerá:
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                  <li>• Um job será criado na Agenda</li>
                  <li>• Uma fatura de 50% de entrada (${depositAmount}) será gerada</li>
                  <li>• O cliente será notificado por email</li>
                </ul>
              </div>
            </>
          )}

          {isApproved && (
            <>
              <Separator />
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <h4 className="font-semibold text-green-700">Lead Aprovado</h4>
                    <p className="text-sm text-green-600">
                      Job criado e fatura de 50% de entrada (${depositAmount}) gerada.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {isRejected && (
            <>
              <Separator />
              <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <div className="flex items-center gap-2">
                  <XCircle className="w-5 h-5 text-destructive" />
                  <div>
                    <h4 className="font-semibold text-destructive">Lead Rejeitado</h4>
                    <p className="text-sm text-destructive/80">
                      Este lead não foi aprovado pelo cliente.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {isPending && (
            <>
              <Button 
                variant="destructive" 
                onClick={handleReject}
                className="flex items-center gap-2"
              >
                <XCircle className="w-4 h-4" />
                Rejeitar
              </Button>
              <Button 
                onClick={handleApprove}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Aprovar
              </Button>
            </>
          )}
          {!isPending && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fechar
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
