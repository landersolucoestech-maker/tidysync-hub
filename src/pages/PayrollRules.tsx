import { useState } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Gift, Save, User } from "lucide-react";
import { toast } from "sonner";

type EmployeeRole = "Cleaner" | "Driver" | "Cleaning Team Manager" | "Office Manager";
type BonusType = "weekly" | "monthly" | "yearly_1" | "yearly_2" | "performance" | "christmas";

interface Employee {
  id: string;
  name: string;
  role: EmployeeRole;
  baseValue: number;
  extraValue?: number;
  bonuses: {
    type: BonusType;
    value: number;
  }[];
}

const bonusLabels: Record<BonusType, string> = {
  weekly: "Semanal",
  monthly: "Mensal",
  yearly_1: "1 Ano",
  yearly_2: "2 Anos",
  performance: "Performance",
  christmas: "Natal",
};

const defaultBonuses = (): { type: BonusType; value: number }[] => [
  { type: "weekly", value: 0 },
  { type: "monthly", value: 0 },
  { type: "yearly_1", value: 0 },
  { type: "yearly_2", value: 0 },
  { type: "performance", value: 0 },
  { type: "christmas", value: 0 },
];

export function PayrollRules() {
  // TODO: Substituir por dados do banco quando perfis de funcionários forem criados
  const [employees, setEmployees] = useState<Employee[]>([
    { id: "1", name: "João Silva", role: "Cleaner", baseValue: 50, bonuses: defaultBonuses() },
    { id: "2", name: "Maria Santos", role: "Driver", baseValue: 50, extraValue: 10, bonuses: defaultBonuses() },
    { id: "3", name: "Carlos Oliveira", role: "Cleaning Team Manager", baseValue: 500, bonuses: [] },
    { id: "4", name: "Ana Costa", role: "Office Manager", baseValue: 600, bonuses: [] },
  ]);

  const [selectedEmployee, setSelectedEmployee] = useState<string>(employees[0]?.id || "");

  const currentEmployee = employees.find((e) => e.id === selectedEmployee);


  const handleUpdateEmployee = (field: keyof Employee, value: any) => {
    setEmployees(
      employees.map((e) =>
        e.id === selectedEmployee ? { ...e, [field]: value } : e
      )
    );
  };

  const handleUpdateBonus = (bonusType: BonusType, value: number) => {
    setEmployees(
      employees.map((e) => {
        if (e.id !== selectedEmployee) return e;
        return {
          ...e,
          bonuses: e.bonuses.map((b) =>
            b.type === bonusType ? { ...b, value } : b
          ),
        };
      })
    );
  };

  const handleSave = () => {
    toast.success("Regras salvas com sucesso!");
  };

  const getRoleDescription = (role: EmployeeRole) => {
    switch (role) {
      case "Cleaner":
        return "Pagamento por serviço realizado";
      case "Driver":
        return "Pagamento por serviço + adicional por viagem";
      case "Cleaning Team Manager":
        return "Valor simbólico fixo";
      case "Office Manager":
        return "Valor simbólico fixo";
    }
  };

  const isEligibleForBonus = (role: EmployeeRole) => {
    return role === "Cleaner" || role === "Driver";
  };

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Regras de Pagamento e Bônus</h1>
            <p className="text-muted-foreground">Configure as regras por funcionário</p>
          </div>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Salvar Todas as Regras
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Funcionários */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <User className="h-5 w-5" />
                Funcionários
              </CardTitle>
            </CardHeader>
              {/* Lista */}
              <div className="space-y-2">
                {employees.map((emp) => (
                  <div
                    key={emp.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      selectedEmployee === emp.id
                        ? "bg-primary/10 border border-primary"
                        : "bg-muted/30 hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedEmployee(emp.id)}
                  >
                    <p className="font-medium text-sm">{emp.name}</p>
                    <Badge variant="outline" className="text-xs mt-1">
                      {emp.role}
                    </Badge>
                  </div>
                ))}
              </div>
          </Card>

          {/* Detalhes do Funcionário */}
          <Card className="lg:col-span-2">
            {currentEmployee ? (
              <>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <span>{currentEmployee.name}</span>
                    <Badge>{currentEmployee.role}</Badge>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {getRoleDescription(currentEmployee.role)}
                  </p>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="payment">
                    <TabsList className="grid w-full max-w-sm grid-cols-2">
                      <TabsTrigger value="payment" className="gap-2">
                        <DollarSign className="h-4 w-4" />
                        Pagamento
                      </TabsTrigger>
                      <TabsTrigger 
                        value="bonus" 
                        className="gap-2"
                        disabled={!isEligibleForBonus(currentEmployee.role)}
                      >
                        <Gift className="h-4 w-4" />
                        Bônus
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="payment" className="mt-6 space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>
                            {currentEmployee.role === "Cleaner" || currentEmployee.role === "Driver"
                              ? "Valor por Serviço ($)"
                              : "Valor Fixo ($)"}
                          </Label>
                          <Input
                            type="number"
                            value={currentEmployee.baseValue}
                            onChange={(e) => handleUpdateEmployee("baseValue", Number(e.target.value))}
                            min={0}
                            step={0.01}
                          />
                        </div>
                        {currentEmployee.role === "Driver" && (
                          <div className="space-y-2">
                            <Label>Adicional por Viagem ($)</Label>
                            <Input
                              type="number"
                              value={currentEmployee.extraValue || 0}
                              onChange={(e) => handleUpdateEmployee("extraValue", Number(e.target.value))}
                              min={0}
                              step={0.01}
                            />
                          </div>
                        )}
                      </div>

                      <div className="p-4 bg-muted/50 rounded-lg">
                        <h4 className="font-medium mb-2">Resumo do Pagamento:</h4>
                        {currentEmployee.role === "Cleaner" && (
                          <p className="text-sm text-muted-foreground">
                            • Recebe <strong>${currentEmployee.baseValue}</strong> por cada serviço realizado
                          </p>
                        )}
                        {currentEmployee.role === "Driver" && (
                          <p className="text-sm text-muted-foreground">
                            • Recebe <strong>${currentEmployee.baseValue}</strong> por serviço + <strong>${currentEmployee.extraValue || 0}</strong> adicional = <strong>${currentEmployee.baseValue + (currentEmployee.extraValue || 0)}</strong> total por serviço
                          </p>
                        )}
                        {(currentEmployee.role === "Cleaning Team Manager" || currentEmployee.role === "Office Manager") && (
                          <p className="text-sm text-muted-foreground">
                            • Recebe valor simbólico fixo de <strong>${currentEmployee.baseValue}</strong>
                          </p>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="bonus" className="mt-6 space-y-6">
                      {isEligibleForBonus(currentEmployee.role) ? (
                        <>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {currentEmployee.bonuses.map((bonus) => (
                              <div key={bonus.type} className="space-y-2">
                                <Label className="flex items-center gap-2">
                                  <Badge variant="outline" className="text-xs">
                                    {bonusLabels[bonus.type]}
                                  </Badge>
                                </Label>
                                <Input
                                  type="number"
                                  value={bonus.value}
                                  onChange={(e) => handleUpdateBonus(bonus.type, Number(e.target.value))}
                                  min={0}
                                  step={0.01}
                                  placeholder="Valor ($)"
                                />
                              </div>
                            ))}
                          </div>

                          <div className="p-4 bg-muted/50 rounded-lg">
                            <h4 className="font-medium mb-2">Tipos de Bônus:</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                              <p>• <strong>Semanal:</strong> Recompensa semanal</p>
                              <p>• <strong>Mensal:</strong> Recompensa mensal</p>
                              <p>• <strong>1 Ano:</strong> Aniversário de empresa</p>
                              <p>• <strong>2 Anos:</strong> 2 anos de empresa</p>
                              <p>• <strong>Performance:</strong> Alta performance</p>
                              <p>• <strong>Natal:</strong> Bônus natalino</p>
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg">
                          <p className="text-sm text-amber-800 dark:text-amber-200">
                            <strong>Nota:</strong> Funcionários do tipo <strong>{currentEmployee.role}</strong> não são elegíveis para bônus.
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-64">
                <p className="text-muted-foreground">Selecione um funcionário para ver as regras</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </PageLayout>
  );
}
