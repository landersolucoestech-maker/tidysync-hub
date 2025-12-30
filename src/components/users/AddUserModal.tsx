import { useState, type FormEvent } from "react";
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
type ProfileType =
  | "driver"
  | "cleaner"
  | "office_manager"
  | "cleaning_team_manager";
type PaymentMethod =
  | "bank_transfer"
  | "cash"
  | "check"
  | "quickbooks"
  | "zelle"
  | "venmo";
type PixKeyType = "cpf" | "email" | "phone" | "random";

export function AddUserModal({ open, onOpenChange }: AddUserModalProps) {
  const [country, setCountry] = useState<Country | "">("");
  const [profileType, setProfileType] = useState<ProfileType | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [pixKeyType, setPixKeyType] = useState<PixKeyType | "">("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Frontend-only: apenas fecha o modal por enquanto
    onOpenChange(false);
  };

  const resetForm = () => {
    setCountry("");
    setProfileType("");
    setPaymentMethod("");
    setPixKeyType("");
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  const formTitle =
    country === "us"
      ? "Formulário – Funcionários / Prestadores dos EUA"
      : country === "br"
        ? "Formulário – Funcionários / Prestadores do Brasil"
        : "Cadastro de usuários / equipe";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{formTitle}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[calc(90vh-140px)] px-6">
            <div className="space-y-6 pb-6">
              {/* País */}
              <div className="space-y-2">
                <Label>País *</Label>
                <Select
                  value={country}
                  onValueChange={(val) => setCountry(val as Country)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
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

                  {/* Dados pessoais */}
                  <section className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Dados pessoais
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="fullName">Nome completo *</Label>
                        <Input
                          id="fullName"
                          placeholder="Digite o nome completo"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Data de nascimento *</Label>
                        <Input id="birthDate" type="date" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Número de telefone *</Label>
                        <Input
                          id="phone"
                          placeholder={
                            country === "us"
                              ? "(555) 123-4567"
                              : "(11) 99999-9999"
                          }
                          required
                        />
                      </div>

                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@exemplo.com"
                          required
                        />
                      </div>

                      {country === "us" && (
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="ssn">SSN/ITIN *</Label>
                          <Input
                            id="ssn"
                            placeholder="XXX-XX-XXXX"
                            required
                          />
                        </div>
                      )}

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF *</Label>
                            <Input
                              id="cpf"
                              placeholder="000.000.000-00"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rg">RG *</Label>
                            <Input
                              id="rg"
                              placeholder="00.000.000-0"
                              required
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  <Separator />

                  {/* Endereço completo */}
                  <section className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Endereço completo
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="street">Rua *</Label>
                        <Input
                          id="street"
                          placeholder="Rua"
                          required
                        />
                      </div>

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="number">Número *</Label>
                            <Input id="number" placeholder="123" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="neighborhood">Bairro *</Label>
                            <Input
                              id="neighborhood"
                              placeholder="Bairro"
                              required
                            />
                          </div>
                        </>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="city">Cidade *</Label>
                        <Input id="city" placeholder="Cidade" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">Estado *</Label>
                        <Input
                          id="state"
                          placeholder={country === "us" ? "CA" : "SP"}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="zipCode">
                          {country === "us" ? "ZIP Code" : "CEP"} *
                        </Label>
                        <Input
                          id="zipCode"
                          placeholder={country === "us" ? "12345" : "00000-000"}
                          required
                        />
                      </div>
                    </div>
                  </section>

                  <Separator />

                  {/* Documentos pessoais */}
                  <section className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Documentos pessoais
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      {country === "br" && (
                        <div className="space-y-2">
                          <Label htmlFor="personalDocs">Documentos pessoais (PDF)</Label>
                          <Input
                            id="personalDocs"
                            type="file"
                            accept="application/pdf,.pdf"
                          />
                        </div>
                      )}

                      <div className="space-y-2">
                        <Label htmlFor="contracts">Contratos (PDF)</Label>
                        <Input
                          id="contracts"
                          type="file"
                          accept="application/pdf,.pdf"
                        />
                      </div>

                      {country === "us" && (
                        <div className="space-y-2">
                          <Label htmlFor="w9Form">Formulário W-9 (PDF)</Label>
                          <Input
                            id="w9Form"
                            type="file"
                            accept="application/pdf,.pdf"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  <Separator />

                  {/* Trabalho */}
                  <section className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Trabalho
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Data de início do trabalho *</Label>
                        <Input id="startDate" type="date" required />
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo de perfil *</Label>
                        <Select
                          value={profileType}
                          onValueChange={(val) => setProfileType(val as ProfileType)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="driver">driver</SelectItem>
                            <SelectItem value="cleaner">cleaner</SelectItem>
                            <SelectItem value="office_manager">office manager</SelectItem>
                            <SelectItem value="cleaning_team_manager">
                              cleaning team manager
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </section>

                  <Separator />

                  {/* Dados bancários */}
                  <section className="space-y-4">
                    <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                      Dados bancários
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">
                          {country === "us" ? "Nome do banco" : "Banco"} *
                        </Label>
                        <Input id="bankName" placeholder="Banco" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="branch">Agência *</Label>
                        <Input id="branch" placeholder="Agência" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountNumber">Número da conta *</Label>
                        <Input id="accountNumber" placeholder="Conta" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="accountHolder">Titular da conta *</Label>
                        <Input id="accountHolder" placeholder="Titular" required />
                      </div>

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label>Chave PIX</Label>
                            <Select
                              value={pixKeyType}
                              onValueChange={(val) => setPixKeyType(val as PixKeyType)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo de chave" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cpf">CPF</SelectItem>
                                <SelectItem value="email">E-mail</SelectItem>
                                <SelectItem value="phone">Telefone</SelectItem>
                                <SelectItem value="random">Chave aleatória</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {pixKeyType && (
                            <div className="space-y-2">
                              <Label htmlFor="pixKey">Valor da chave</Label>
                              <Input
                                id="pixKey"
                                placeholder={
                                  pixKeyType === "cpf"
                                    ? "000.000.000-00"
                                    : pixKeyType === "email"
                                      ? "email@exemplo.com"
                                      : pixKeyType === "phone"
                                        ? "(11) 99999-9999"
                                        : "Chave aleatória"
                                }
                              />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </section>

                  {country === "us" && (
                    <>
                      <Separator />

                      {/* Métodos de pagamento */}
                      <section className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Métodos de pagamento (seleção única)
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Método *</Label>
                            <Select
                              value={paymentMethod}
                              onValueChange={(val) =>
                                setPaymentMethod(val as PaymentMethod)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bank_transfer">
                                  Transferência bancária
                                </SelectItem>
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
                                {paymentMethod === "zelle"
                                  ? "Zelle (key / e-mail / phone)"
                                  : "Venmo (username)"}
                              </Label>
                              <Input
                                id="paymentKey"
                                placeholder={
                                  paymentMethod === "zelle"
                                    ? "Key / e-mail / phone"
                                    : "@username"
                                }
                              />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="paymentValue">
                              Valor do pagamento (fixo ou por serviço)
                            </Label>
                            <Input
                              id="paymentValue"
                              placeholder="Ex: $100 fixo ou $50 por serviço"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shoeSize">Tamanho do calçado</Label>
                            <Input id="shoeSize" placeholder="Ex: 10" />
                          </div>
                        </div>
                      </section>

                      <Separator />

                      {/* Observações */}
                      <section className="space-y-4">
                        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Observações
                        </h3>

                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações (campo livre)</Label>
                          <Textarea
                            id="notes"
                            placeholder="Digite observações..."
                            rows={3}
                          />
                        </div>
                      </section>
                    </>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 p-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={!country}>
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
