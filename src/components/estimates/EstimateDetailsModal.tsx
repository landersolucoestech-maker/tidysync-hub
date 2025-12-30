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
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface EstimateAddress {
  address: string;
  date: string;
  time: string;
  serviceType: string;
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
  addresses?: EstimateAddress[];
  origin?: string;
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
    toast.info(`Estimate ${estimate.id} has been rejected.`);
    onOpenChange(false);
  };

  const isPending = estimate.status === "pending" || estimate.status === "draft";
  const isApproved = estimate.status === "approved";
  const isRejected = estimate.status === "rejected";

  // Parse amount to number for calculations
  const amountValue = parseFloat(estimate.amount.replace(/[^0-9.]/g, ''));
  const depositAmount = (amountValue * 0.5).toFixed(2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              Estimate {estimate.id}
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
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Name</p>
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
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{estimate.phone}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="font-medium">{estimate.address}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Service Details */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Service Details
            </h3>
            <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Service</p>
                  <p className="font-medium">{estimate.service}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-medium text-lg">{estimate.amount}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="font-medium">{estimate.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Valid Until</p>
                  <p className="font-medium">{estimate.validUntil}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Approval Info */}
          {isPending && (
            <>
              <Separator />
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg space-y-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Approval Actions</h4>
                    <p className="text-sm text-muted-foreground">
                      Upon approval, the following will happen:
                    </p>
                  </div>
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 ml-7">
                  <li>• A job will be created in the Schedule</li>
                  <li>• A 50% deposit invoice (${depositAmount}) will be generated</li>
                  <li>• The customer will be notified via email</li>
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
                    <h4 className="font-semibold text-green-700">Estimate Approved</h4>
                    <p className="text-sm text-green-600">
                      Job created and 50% deposit invoice (${depositAmount}) generated.
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
                    <h4 className="font-semibold text-destructive">Estimate Rejected</h4>
                    <p className="text-sm text-destructive/80">
                      This estimate was not approved by the customer.
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
                Reject
              </Button>
              <Button 
                onClick={handleApprove}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="w-4 h-4" />
                Approve
              </Button>
            </>
          )}
          {!isPending && (
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
