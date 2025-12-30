import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Country = "us" | "br";
type ProfileType = "driver" | "cleaner" | "office_manager" | "cleaning_team_manager";
type PaymentMethod = "bank_transfer" | "cash" | "check" | "quickbooks" | "zelle" | "venmo";
type PixKeyType = "cpf" | "email" | "phone" | "random";

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [country, setCountry] = useState<Country | "">("");
  const [profileType, setProfileType] = useState<ProfileType | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [pixKeyType, setPixKeyType] = useState<PixKeyType | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    onOpenChange(false);
  };

  const resetForm = () => {
    setCountry("");
    setProfileType("");
    setPaymentMethod("");
    setPixKeyType("");
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) {
      resetForm();
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>Add New Team Member</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[calc(90vh-140px)] px-6">
            <div className="space-y-6 pb-6">
              {/* Country Selection */}
              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Select value={country} onValueChange={(val) => setCountry(val as Country)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="us">United States</SelectItem>
                    <SelectItem value="br">Brazil</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {country && (
                <>
                  <Separator />

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Personal Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="fullName">Full Name *</Label>
                        <Input id="fullName" placeholder="Enter full name" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Date of Birth *</Label>
                        <Input id="birthDate" type="date" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input id="phone" placeholder={country === "us" ? "(555) 123-4567" : "(11) 99999-9999"} required />
                      </div>
                      
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input id="email" type="email" placeholder="email@example.com" required />
                      </div>

                      {country === "us" && (
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="ssn">SSN / ITIN *</Label>
                          <Input id="ssn" placeholder="XXX-XX-XXXX" required />
                        </div>
                      )}

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF *</Label>
                            <Input id="cpf" placeholder="000.000.000-00" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rg">RG *</Label>
                            <Input id="rg" placeholder="00.000.000-0" required />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Address */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Address
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="street">Street *</Label>
                        <Input id="street" placeholder="Street address" required />
                      </div>

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="number">Number *</Label>
                            <Input id="number" placeholder="123" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="neighborhood">Neighborhood *</Label>
                            <Input id="neighborhood" placeholder="Neighborhood" required />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input id="city" placeholder="City" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Input id="state" placeholder={country === "us" ? "CA" : "SP"} required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="zipCode">{country === "us" ? "ZIP Code" : "CEP"} *</Label>
                        <Input id="zipCode" placeholder={country === "us" ? "12345" : "00000-000"} required />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Documents */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Documents
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      {country === "br" && (
                        <div className="space-y-2">
                          <Label htmlFor="personalDocs">Personal Documents (PDF)</Label>
                          <Input id="personalDocs" type="file" accept=".pdf" />
                        </div>
                      )}
                      
                      <div className="space-y-2">
                        <Label htmlFor="contracts">Contracts (PDF)</Label>
                        <Input id="contracts" type="file" accept=".pdf" />
                      </div>

                      {country === "us" && (
                        <div className="space-y-2">
                          <Label htmlFor="w9Form">W-9 Form (PDF)</Label>
                          <Input id="w9Form" type="file" accept=".pdf" />
                        </div>
                      )}
                    </div>
                  </div>

                  <Separator />

                  {/* Work Information */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Work Information
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Work Start Date *</Label>
                        <Input id="startDate" type="date" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="profileType">Profile Type *</Label>
                        <Select value={profileType} onValueChange={(val) => setProfileType(val as ProfileType)}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select profile type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="driver">Driver</SelectItem>
                            <SelectItem value="cleaner">Cleaner</SelectItem>
                            <SelectItem value="office_manager">Office Manager</SelectItem>
                            <SelectItem value="cleaning_team_manager">Cleaning Team Manager</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Bank Details */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Bank Details
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">{country === "us" ? "Bank Name" : "Bank"} *</Label>
                        <Input id="bankName" placeholder="Bank name" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="branch">Branch *</Label>
                        <Input id="branch" placeholder="Branch number" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Account Number *</Label>
                        <Input id="accountNumber" placeholder="Account number" required />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">Account Holder *</Label>
                        <Input id="accountHolder" placeholder="Account holder name" required />
                      </div>

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="pixKeyType">PIX Key Type</Label>
                            <Select value={pixKeyType} onValueChange={(val) => setPixKeyType(val as PixKeyType)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select PIX key type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cpf">CPF</SelectItem>
                                <SelectItem value="email">Email</SelectItem>
                                <SelectItem value="phone">Phone</SelectItem>
                                <SelectItem value="random">Random Key</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {pixKeyType && (
                            <div className="space-y-2">
                              <Label htmlFor="pixKey">PIX Key</Label>
                              <Input 
                                id="pixKey" 
                                placeholder={
                                  pixKeyType === "cpf" ? "000.000.000-00" :
                                  pixKeyType === "email" ? "email@example.com" :
                                  pixKeyType === "phone" ? "(11) 99999-9999" :
                                  "Random key"
                                } 
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {country === "us" && (
                    <>
                      <Separator />

                      {/* Payment Method (US Only) */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Payment Method
                        </h3>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="paymentMethod">Payment Method *</Label>
                            <Select value={paymentMethod} onValueChange={(val) => setPaymentMethod(val as PaymentMethod)}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select payment method" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                                <SelectItem value="cash">Cash</SelectItem>
                                <SelectItem value="check">Check</SelectItem>
                                <SelectItem value="quickbooks">QuickBooks</SelectItem>
                                <SelectItem value="zelle">Zelle</SelectItem>
                                <SelectItem value="venmo">Venmo</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {(paymentMethod === "zelle" || paymentMethod === "venmo") && (
                            <div className="space-y-2">
                              <Label htmlFor="paymentKey">
                                {paymentMethod === "zelle" ? "Zelle Key / Email / Phone" : "Venmo Username"}
                              </Label>
                              <Input 
                                id="paymentKey" 
                                placeholder={paymentMethod === "zelle" ? "Email, phone, or key" : "@username"} 
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="paymentValue">Payment Value</Label>
                            <Input id="paymentValue" placeholder="Fixed amount or per service" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shoeSize">Shoe Size</Label>
                            <Input id="shoeSize" placeholder="e.g., 10" />
                          </div>
                        </div>
                      </div>

                      <Separator />

                      {/* Notes (US Only) */}
                      <div className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Additional Notes
                        </h3>
                        
                        <div className="space-y-2">
                          <Label htmlFor="notes">Notes</Label>
                          <Textarea 
                            id="notes" 
                            placeholder="Any additional notes or observations..."
                            rows={3}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 p-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!country}>
              Add Team Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
