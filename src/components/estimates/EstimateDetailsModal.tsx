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
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

export interface Interaction {
  id: string;
  date: string;
  time: string;
  subject: string;
  attendedBy: string;
  notes: string;
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

export function EstimateDetailsModal({ 
  open, 
  onOpenChange, 
  estimate,
  onApprove,
  onReject 
}: EstimateDetailsModalProps) {
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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                    <p className="text-xs text-muted-foreground">Telefone</p>
                    <p className="font-medium">{estimate.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="font-medium">{estimate.address}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Detalhes do Serviço
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
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
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Criado em</p>
                  <p className="font-medium">{formatDate(estimate.date)}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Válido Até</p>
                  <p className="font-medium">{estimate.validUntil}</p>
                </div>
              </div>
            </div>
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
              <ScrollArea className="max-h-[200px]">
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
