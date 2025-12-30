import { useEffect, useState, type FormEvent } from "react";
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

interface AddUserModalProps {
  open: boolean;
  country: Country | null;
  onOpenChange: (open: boolean) => void;
}

export function AddUserModal({ open, country, onOpenChange }: AddUserModalProps) {
  const [profileType, setProfileType] = useState<ProfileType | "">("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | "">("");
  const [pixKeyType, setPixKeyType] = useState<PixKeyType | "">("");

  useEffect(() => {
    // sempre que trocar país ou abrir/fechar, zera selects dependentes
    setProfileType("");
    setPaymentMethod("");
    setPixKeyType("");
  }, [country, open]);

  const title =
    country === "us"
      ? "Formulário – Funcionários / Prestadores dos EUA"
      : country === "br"
        ? "Formulário – Funcionários / Prestadores do Brasil"
        : "Cadastro de users / equipe";

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Frontend-only: por enquanto apenas fecha
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <ScrollArea className="max-h-[calc(90vh-140px)] px-6">
            <div className="space-y-6 pb-6">
              {!country ? (
                <div className="text-sm text-muted-foreground">
                  Selecione "United States" ou "Brazil" no botão "Add User".
                </div>
              ) : (
                <>
                  {/* Campos comuns (conforme o script) */}
                  <section className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="col-span-2 space-y-2">
                        <Label htmlFor="fullName">Nome completo</Label>
                        <Input id="fullName" placeholder="Nome completo" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="birthDate">Data de nascimento</Label>
                        <Input id="birthDate" type="date" required />
                      </div>
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold">Endereço completo</h3>

                    {/* EUA: Rua, Cidade, Estado, ZIP Code. */}
                    {country === "us" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="usStreet">Rua</Label>
                          <Input id="usStreet" placeholder="Rua" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="usCity">Cidade</Label>
                          <Input id="usCity" placeholder="Cidade" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="usState">Estado</Label>
                          <Input id="usState" placeholder="Estado" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="usZip">ZIP Code</Label>
                          <Input id="usZip" placeholder="ZIP Code" required />
                        </div>
                      </div>
                    )}

                    {/* BR: Rua, Número, Bairro, Cidade, Estado, CEP */}
                    {country === "br" && (
                      <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="brStreet">Rua</Label>
                          <Input id="brStreet" placeholder="Rua" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brNumber">Número</Label>
                          <Input id="brNumber" placeholder="Número" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brNeighborhood">Bairro</Label>
                          <Input id="brNeighborhood" placeholder="Bairro" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brCity">Cidade</Label>
                          <Input id="brCity" placeholder="Cidade" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brState">Estado</Label>
                          <Input id="brState" placeholder="Estado" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brCep">CEP</Label>
                          <Input id="brCep" placeholder="CEP" required />
                        </div>
                      </div>
                    )}
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Número de telefone</Label>
                        <Input
                          id="phone"
                          placeholder={
                            country === "us" ? "(555) 123-4567" : "(11) 99999-9999"
                          }
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="email@exemplo.com"
                          required
                        />
                      </div>

                      {country === "us" && (
                        <div className="col-span-2 space-y-2">
                          <Label htmlFor="ssn">SSN/ITIN</Label>
                          <Input id="ssn" placeholder="SSN/ITIN" required />
                        </div>
                      )}

                      {country === "br" && (
                        <>
                          <div className="space-y-2">
                            <Label htmlFor="cpf">CPF</Label>
                            <Input id="cpf" placeholder="CPF" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="rg">RG</Label>
                            <Input id="rg" placeholder="RG" required />
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold">Documentos pessoais</h3>
                    <div className="grid grid-cols-2 gap-4">
                      {country === "br" && (
                        <div className="space-y-2">
                          <Label htmlFor="brPersonalDocs">Documentos pessoais (PDF)</Label>
                          <Input
                            id="brPersonalDocs"
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
                          <Label htmlFor="w9">Formulário W-9 (PDF)</Label>
                          <Input
                            id="w9"
                            type="file"
                            accept="application/pdf,.pdf"
                          />
                        </div>
                      )}
                    </div>
                  </section>

                  <Separator />

                  <section className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="startDate">Data de início do trabalho</Label>
                        <Input id="startDate" type="date" required />
                      </div>

                      <div className="space-y-2">
                        <Label>Tipo de perfil</Label>
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

                  <section className="space-y-4">
                    <h3 className="text-sm font-semibold">Dados bancários</h3>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="bankName">
                          {country === "us" ? "Nome do banco" : "Banco"}
                        </Label>
                        <Input id="bankName" placeholder="Banco" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankBranch">Agência</Label>
                        <Input id="bankBranch" placeholder="Agência" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankAccount">Número da conta</Label>
                        <Input id="bankAccount" placeholder="Conta" required />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bankHolder">Titular da conta</Label>
                        <Input id="bankHolder" placeholder="Titular" required />
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
                                <SelectValue placeholder="Selecione" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cpf">CPF</SelectItem>
                                <SelectItem value="email">E-mail</SelectItem>
                                <SelectItem value="phone">Telefone</SelectItem>
                                <SelectItem value="random">Chave aleatória</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="pixKey">Valor da chave PIX</Label>
                            <Input
                              id="pixKey"
                              placeholder={
                                pixKeyType === "cpf"
                                  ? "CPF"
                                  : pixKeyType === "email"
                                    ? "E-mail"
                                    : pixKeyType === "phone"
                                      ? "Telefone"
                                      : pixKeyType === "random"
                                        ? "Chave aleatória"
                                        : ""
                              }
                            />
                          </div>
                        </>
                      )}
                    </div>
                  </section>

                  {country === "us" && (
                    <>
                      <Separator />

                      <section className="space-y-4">
                        <h3 className="text-sm font-semibold">
                          Métodos de pagamento (seleção única)
                        </h3>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label>Método</Label>
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

                          {paymentMethod === "zelle" && (
                            <div className="space-y-2">
                              <Label htmlFor="zelleKey">Zelle (key / e-mail / phone)</Label>
                              <Input id="zelleKey" placeholder="key / e-mail / phone" />
                            </div>
                          )}

                          <div className="space-y-2">
                            <Label htmlFor="paymentValue">
                              Valor do pagamento (fixo ou por serviço)
                            </Label>
                            <Input id="paymentValue" placeholder="Valor" />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="shoeSize">Tamanho do calçado</Label>
                            <Input id="shoeSize" placeholder="Tamanho" />
                          </div>
                        </div>
                      </section>

                      <Separator />

                      <section className="space-y-4">
                        <h3 className="text-sm font-semibold">Observações</h3>
                        <div className="space-y-2">
                          <Label htmlFor="notes">Observações (campo livre)</Label>
                          <Textarea id="notes" rows={3} placeholder="Observações" />
                        </div>
                      </section>
                    </>
                  )}
                </>
              )}
            </div>
          </ScrollArea>

          <div className="flex justify-end gap-3 p-6 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
