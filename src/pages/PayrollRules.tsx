import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Gift, Save, Users } from "lucide-react";
import { toast } from "sonner";

interface PaymentRule {
  role: string;
  type: "per_service" | "fixed";
  baseValue: number;
  extraValue?: number;
  description: string;
}

interface BonusRule {
  id: string;
  name: string;
  type: "weekly" | "monthly" | "yearly_1" | "yearly_2" | "performance" | "christmas";
  cleanerValue: number;
  driverValue: number;
  description: string;
}

export function PayrollRules() {
  const [paymentRules, setPaymentRules] = useState<PaymentRule[]>([
    { role: "Cleaner", type: "per_service", baseValue: 0, description: "Pagamento por serviço realizado" },
    { role: "Driver", type: "per_service", baseValue: 0, extraValue: 10, description: "Pagamento por serviço + $10 adicional" },
    { role: "Cleaning Team Manager", type: "fixed", baseValue: 0, description: "Valor simbólico fixo" },
    { role: "Office Manager", type: "fixed", baseValue: 0, description: "Valor simbólico fixo" },
  ]);

  const [bonusRules, setBonusRules] = useState<BonusRule[]>([
    { id: "weekly", name: "Bônus Semanal", type: "weekly", cleanerValue: 0, driverValue: 0, description: "Bônus por desempenho semanal" },
    { id: "monthly", name: "Bônus Mensal", type: "monthly", cleanerValue: 0, driverValue: 0, description: "Bônus por desempenho mensal" },
    { id: "yearly_1", name: "Bônus 1 Ano", type: "yearly_1", cleanerValue: 0, driverValue: 0, description: "Bônus por completar 1 ano" },
    { id: "yearly_2", name: "Bônus 2 Anos", type: "yearly_2", cleanerValue: 0, driverValue: 0, description: "Bônus por completar 2 anos" },
    { id: "performance", name: "Bônus Performance", type: "performance", cleanerValue: 0, driverValue: 0, description: "Bônus por alta performance" },
    { id: "christmas", name: "Bônus Natal", type: "christmas", cleanerValue: 0, driverValue: 0, description: "Bônus natalino" },
  ]);

  const handlePaymentRuleChange = (index: number, field: keyof PaymentRule, value: number) => {
    const updated = [...paymentRules];
    updated[index] = { ...updated[index], [field]: value };
    setPaymentRules(updated);
  };

  const handleBonusRuleChange = (index: number, field: keyof BonusRule, value: number) => {
    const updated = [...bonusRules];
    updated[index] = { ...updated[index], [field]: value };
    setBonusRules(updated);
  };

  const handleSavePaymentRules = () => {
    toast.success("Regras de pagamento salvas com sucesso!");
  };

  const handleSaveBonusRules = () => {
    toast.success("Regras de bônus salvas com sucesso!");
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Regras de Pagamento e Bônus</h1>
            <p className="text-muted-foreground">Configure as regras de pagamento e bônus por tipo de funcionário</p>
          </div>
        </div>

        <Tabs defaultValue="payments" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Pagamentos
            </TabsTrigger>
            <TabsTrigger value="bonuses" className="flex items-center gap-2">
              <Gift className="h-4 w-4" />
              Bônus
            </TabsTrigger>
          </TabsList>

          <TabsContent value="payments" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Regras de Pagamento por Função
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure os valores de pagamento para cada tipo de funcionário
                  </p>
                </div>
                <Button onClick={handleSavePaymentRules} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Regras
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Função</TableHead>
                      <TableHead>Tipo de Pagamento</TableHead>
                      <TableHead>Valor Base ($)</TableHead>
                      <TableHead>Adicional ($)</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentRules.map((rule, index) => (
                      <TableRow key={rule.role}>
                        <TableCell className="font-medium">{rule.role}</TableCell>
                        <TableCell>
                          <Badge variant={rule.type === "per_service" ? "default" : "secondary"}>
                            {rule.type === "per_service" ? "Por Serviço" : "Valor Fixo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={rule.baseValue}
                            onChange={(e) => handlePaymentRuleChange(index, "baseValue", Number(e.target.value))}
                            className="w-24"
                            min={0}
                            step={0.01}
                          />
                        </TableCell>
                        <TableCell>
                          {rule.extraValue !== undefined ? (
                            <Input
                              type="number"
                              value={rule.extraValue}
                              onChange={(e) => handlePaymentRuleChange(index, "extraValue", Number(e.target.value))}
                              className="w-24"
                              min={0}
                              step={0.01}
                            />
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{rule.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Resumo das Regras:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• <strong>Cleaner:</strong> Recebe o valor base por cada serviço realizado</li>
                    <li>• <strong>Driver:</strong> Recebe o valor base + $10 adicional por cada serviço</li>
                    <li>• <strong>Cleaning Team Manager:</strong> Recebe um valor simbólico fixo</li>
                    <li>• <strong>Office Manager:</strong> Recebe um valor simbólico fixo</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bonuses" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Regras de Bônus (Cleaner e Driver)
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure os valores de bônus apenas para Cleaners e Drivers
                  </p>
                </div>
                <Button onClick={handleSaveBonusRules} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  Salvar Regras
                </Button>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Tipo de Bônus</TableHead>
                      <TableHead>Valor Cleaner ($)</TableHead>
                      <TableHead>Valor Driver ($)</TableHead>
                      <TableHead>Descrição</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bonusRules.map((bonus, index) => (
                      <TableRow key={bonus.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="capitalize">
                              {bonus.type === "weekly" && "Semanal"}
                              {bonus.type === "monthly" && "Mensal"}
                              {bonus.type === "yearly_1" && "1 Ano"}
                              {bonus.type === "yearly_2" && "2 Anos"}
                              {bonus.type === "performance" && "Performance"}
                              {bonus.type === "christmas" && "Natal"}
                            </Badge>
                            {bonus.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={bonus.cleanerValue}
                            onChange={(e) => handleBonusRuleChange(index, "cleanerValue", Number(e.target.value))}
                            className="w-24"
                            min={0}
                            step={0.01}
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={bonus.driverValue}
                            onChange={(e) => handleBonusRuleChange(index, "driverValue", Number(e.target.value))}
                            className="w-24"
                            min={0}
                            step={0.01}
                          />
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">{bonus.description}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">Tipos de Bônus Disponíveis:</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p>• <strong>Bônus Semanal:</strong> Recompensa por desempenho semanal</p>
                      <p>• <strong>Bônus Mensal:</strong> Recompensa por desempenho mensal</p>
                      <p>• <strong>Bônus 1 Ano:</strong> Celebração de 1 ano na empresa</p>
                    </div>
                    <div>
                      <p>• <strong>Bônus 2 Anos:</strong> Celebração de 2 anos na empresa</p>
                      <p>• <strong>Bônus Performance:</strong> Alta performance excepcional</p>
                      <p>• <strong>Bônus Natal:</strong> Bônus natalino anual</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>Nota:</strong> Os bônus são aplicáveis apenas para funcionários do tipo <strong>Cleaner</strong> e <strong>Driver</strong>. 
                    Cleaning Team Manager e Office Manager não são elegíveis para bônus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageLayout>
  );
}
