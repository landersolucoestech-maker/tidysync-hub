import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { User, Phone, Mail, MapPin, Calendar, Briefcase, CreditCard, Clock, FileText, MessageSquare, FileCheck, Send, ChevronDown, Receipt, CheckCircle, Download, Eye, PenLine } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface Address {
  name: string;
  address: string;
  notes?: string;
}

interface ChatMessage {
  id: number;
  sender: "customer" | "business";
  message: string;
  timestamp: string;
}

interface AdditionalNote {
  id: string;
  text: string;
  author: string;
}

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  phone2?: string;
  address: string;
  addresses?: Address[];
  status: string;
  lastService: string;
  totalJobs: number;
  rating: number;
  frequency?: string;
  preferredDay?: string;
  paymentMethod?: string;
  customerSince?: string;
  additionalInfo?: string;
}

interface CustomerDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: Customer | null;
}

export function CustomerDetailsModal({
  open,
  onOpenChange,
  customer
}: CustomerDetailsModalProps) {
  const [newMessage, setNewMessage] = useState("");
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 1, sender: "business", message: "Hi! Your cleaning is scheduled for tomorrow at 10am.", timestamp: "Jan 8, 2024 2:30 PM" },
    { id: 2, sender: "customer", message: "Perfect, thank you! Should I leave the key under the mat?", timestamp: "Jan 8, 2024 2:45 PM" },
    { id: 3, sender: "business", message: "Yes, that works great. We'll lock up when we're done.", timestamp: "Jan 8, 2024 3:00 PM" },
  ]);
  
  const [additionalNotes] = useState<AdditionalNote[]>([
    { id: "1", text: "Customer prefers morning appointments", author: "Admin" },
    { id: "2", text: "Has 2 dogs - please close gates", author: "Maria S." },
  ]);
  const [additionalNotesExpanded, setAdditionalNotesExpanded] = useState(true);
  const [notesExpanded, setNotesExpanded] = useState(true);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const newMsg: ChatMessage = {
      id: chatMessages.length + 1,
      sender: "business",
      message: newMessage,
      timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true })
    };
    
    setChatMessages([...chatMessages, newMsg]);
    setNewMessage("");
  };


  if (!customer) return null;

  return <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-bold text-lg">
                {customer.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl">{customer.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={customer.status === "Active" ? "default" : "secondary"}>
                  {customer.status}
                </Badge>
                
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-7 h-auto">
            <TabsTrigger value="overview" className="text-xs px-2 py-2">
              Overview
            </TabsTrigger>
            <TabsTrigger value="contact" className="text-xs px-2 py-2">
              Contact
            </TabsTrigger>
            <TabsTrigger value="addresses" className="text-xs px-2 py-2">
              Addresses
            </TabsTrigger>
            <TabsTrigger value="jobs" className="text-xs px-2 py-2">
              Jobs
            </TabsTrigger>
            <TabsTrigger value="invoices" className="text-xs px-2 py-2">
              Invoices
            </TabsTrigger>
            <TabsTrigger value="chat" className="text-xs px-2 py-2">
              Chat
            </TabsTrigger>
            <TabsTrigger value="contract" className="text-xs px-2 py-2">
              Contract
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <span className="text-xs">Email</span>
                </div>
                <p className="text-sm font-medium">{customer.email}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="w-4 h-4" />
                  <span className="text-xs">Phone</span>
                </div>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Last Service</span>
                </div>
                <p className="text-sm font-medium">{customer.lastService}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs">Total Jobs</span>
                </div>
                <p className="text-sm font-medium">{customer.totalJobs}</p>
              </div>
              {customer.frequency && <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span className="text-xs">Frequency</span>
                  </div>
                  <p className="text-sm font-medium">{customer.frequency}</p>
                </div>}
              {customer.paymentMethod && <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CreditCard className="w-4 h-4" />
                    <span className="text-xs">Payment Method</span>
                  </div>
                  <p className="text-sm font-medium">{customer.paymentMethod}</p>
                </div>}
            </div>
            {customer.additionalInfo && <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center gap-2 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setNotesExpanded((v) => !v)}
                  >
                    <ChevronDown className={`h-4 w-4 transition-transform ${notesExpanded ? "" : "-rotate-90"}`} />
                  </Button>
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm font-medium text-foreground">Notes</span>
                </div>
                {notesExpanded && (
                  <div className="ml-8">
                    <p className="text-xs text-foreground leading-relaxed">{customer.additionalInfo}</p>
                    <p className="text-[10px] text-muted-foreground italic">"Admin"</p>
                  </div>
                )}
              </div>}

            {/* Additional Notes Section - View Only */}
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6"
                  onClick={() => setAdditionalNotesExpanded((v) => !v)}
                >
                  <ChevronDown className={`h-4 w-4 transition-transform ${additionalNotesExpanded ? "" : "-rotate-90"}`} />
                </Button>
                <span className="text-sm font-medium text-foreground">Additional Notes</span>
              </div>

              {additionalNotesExpanded && (
                <div className="space-y-2">
                  {additionalNotes.length === 0 ? (
                    <p className="text-xs text-muted-foreground italic">No additional notes.</p>
                  ) : (
                    additionalNotes.map((n) => (
                      <div key={n.id} className="flex items-start gap-2">
                        <span className="text-sm shrink-0">⚠️</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs text-foreground leading-relaxed">{n.text}</p>
                          <p className="text-[10px] text-muted-foreground italic">"{n.author}"</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </TabsContent>

          {/* Contact Information Tab */}
          <TabsContent value="contact" className="space-y-3 mt-4">
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <Mail className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm font-medium">{customer.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
              <Phone className="w-5 h-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Phone 1</p>
                <p className="text-sm font-medium">{customer.phone}</p>
              </div>
            </div>
            {customer.phone2 && <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <Phone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Phone 2</p>
                  <p className="text-sm font-medium">{customer.phone2}</p>
                </div>
              </div>}
            {customer.customerSince && <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/30">
                <Calendar className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Customer Since</p>
                  <p className="text-sm font-medium">{customer.customerSince}</p>
                </div>
              </div>}
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-3 mt-4">
            {customer.addresses && customer.addresses.length > 0 ? customer.addresses.map((addr, index) => (
              <div key={index} className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">{addr.name || `Address ${index + 1}`}</p>
                    <p className="text-sm font-medium">{addr.address}</p>
                  </div>
                </div>
                {addr.notes && (
                  <div className="ml-8 pt-2 border-t border-border/50">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{addr.notes}</p>
                  </div>
                )}
              </div>
            )) : (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/30">
                <MapPin className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Primary Address</p>
                  <p className="text-sm font-medium">{customer.address}</p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* Jobs Tab */}
          <TabsContent value="jobs" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs">Last Service</span>
                </div>
                <p className="text-sm font-medium">{customer.lastService}</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Briefcase className="w-4 h-4" />
                  <span className="text-xs">Total Jobs Completed</span>
                </div>
                <p className="text-sm font-medium">{customer.totalJobs}</p>
              </div>
            </div>
            <div className="border rounded-lg divide-y">
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Regular Cleaning</p>
                      <p className="text-xs text-muted-foreground">{customer.lastService}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {customer.address}
                      </p>
                    </div>
                  </div>
                  <Badge>Completed</Badge>
                </div>
                <div className="ml-13 pl-13">
                  <div className="flex items-start gap-2 p-2 rounded bg-muted/40">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Feedback</p>
                      <p className="text-sm">Great service, very thorough cleaning!</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Briefcase className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Deep Cleaning</p>
                      <p className="text-xs text-muted-foreground">Dec 15, 2024</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {customer.address}
                      </p>
                    </div>
                  </div>
                  <Badge>Completed</Badge>
                </div>
                <div className="ml-13 pl-13">
                  <div className="flex items-start gap-2 p-2 rounded bg-muted/40">
                    <MessageSquare className="w-4 h-4 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-muted-foreground">Feedback</p>
                      <p className="text-sm">Excellent deep cleaning, exceeded expectations.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Invoices Tab */}
          <TabsContent value="invoices" className="space-y-4 mt-4">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">INV-001</TableCell>
                    <TableCell>Jan 5, 2025</TableCell>
                    <TableCell>$150.00</TableCell>
                    <TableCell>Jan 15, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Paid</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-002</TableCell>
                    <TableCell>Dec 20, 2024</TableCell>
                    <TableCell>$200.00</TableCell>
                    <TableCell>Dec 30, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">Paid</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-003</TableCell>
                    <TableCell>Jan 10, 2025</TableCell>
                    <TableCell>$175.00</TableCell>
                    <TableCell>Jan 20, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/20">Sent</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-004</TableCell>
                    <TableCell>Jan 12, 2025</TableCell>
                    <TableCell>$225.00</TableCell>
                    <TableCell>Jan 22, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20">Open</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-005</TableCell>
                    <TableCell>Nov 15, 2024</TableCell>
                    <TableCell>$180.00</TableCell>
                    <TableCell>Nov 25, 2024</TableCell>
                    <TableCell>
                      <Badge className="bg-red-500/10 text-red-600 hover:bg-red-500/20">Overdue</Badge>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">INV-006</TableCell>
                    <TableCell>Jan 14, 2025</TableCell>
                    <TableCell>$150.00</TableCell>
                    <TableCell>Jan 24, 2025</TableCell>
                    <TableCell>
                      <Badge className="bg-orange-500/10 text-orange-600 hover:bg-orange-500/20">Pending Payment</Badge>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Chat History Tab */}
          <TabsContent value="chat" className="mt-4">
            <div className="flex flex-col h-[350px]">
              {/* Chat messages */}
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 p-2">
                {chatMessages.length > 0 ? (
                  chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === "business" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-lg px-4 py-2 ${
                          msg.sender === "business"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={`text-xs mt-1 ${
                          msg.sender === "business" 
                            ? "text-primary-foreground/70" 
                            : "text-muted-foreground"
                        }`}>
                          {msg.timestamp}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
                      <MessageSquare className="w-6 h-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No messages yet</p>
                  </div>
                )}
              </div>
              
              {/* Message input */}
              <div className="flex gap-2 pt-3 border-t">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                  className="flex-1"
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Contract Tab */}
          <TabsContent value="contract" className="mt-4 space-y-4">
            {/* Signed Terms & Conditions */}
            <div className="border border-border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/30 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500/10 rounded-lg">
                      <FileCheck className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground">Terms & Conditions</h4>
                      <p className="text-xs text-muted-foreground">Service Agreement</p>
                    </div>
                  </div>
                  <Badge className="bg-green-500/10 text-green-600 hover:bg-green-500/20">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Signed
                  </Badge>
                </div>
              </div>
              
              <div className="p-4 space-y-4">
                {/* Signature Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Signed By</p>
                    <p className="text-sm font-medium">{customer.name}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30">
                    <p className="text-xs text-muted-foreground mb-1">Signed On</p>
                    <p className="text-sm font-medium">{customer.customerSince || "Jan 5, 2025"}</p>
                  </div>
                </div>

                {/* Terms Content Preview */}
                <div className="p-4 rounded-lg bg-muted/20 border border-border">
                  <h5 className="text-sm font-medium mb-2">Service Terms & Conditions</h5>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4">
                    By signing this agreement, the customer agrees to the terms and conditions of service provided by the cleaning company. 
                    This includes scheduling policies, payment terms, cancellation policies, and service guarantees. 
                    The customer acknowledges receipt of the full terms document and agrees to comply with all stated conditions.
                  </p>
                </div>

                {/* Signature Display */}
                <div className="p-4 rounded-lg bg-muted/30 border border-border">
                  <p className="text-xs text-muted-foreground mb-2">Customer Signature</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 p-3 bg-background rounded border border-border">
                      <p className="font-signature text-xl italic text-foreground">{customer.name}</p>
                    </div>
                    <PenLine className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-2" />
                    View Full Document
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </DialogContent>
    </Dialog>;
}