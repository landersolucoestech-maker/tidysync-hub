import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, CreditCard, Plus, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";
import XLSX from "xlsx-js-style";

interface Employee {
  id: string;
  name: string;
  baseValue: number;
}

interface PayrollCalculation {
  employeeId: string;
  employeeName: string;
  baseValue: number;
  bonuses: EmployeeBonus[];
  totalBonus: number;
  finalValue: number;
}

interface EmployeeBonus {
  id: string;
  type: string;
  description: string;
  value: number;
}

interface CalculatePayrollModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employees: Employee[];
  startDate: Date;
  endDate: Date;
  onConfirm: (calculations: PayrollCalculation[]) => void;
}

const bonusTypes = [
  "Bônus da Semana",
  "Bônus Mensal",
  "Bônus de Um Ano",
  "Bônus de Performance",
  "Bônus de Natal",
  "Outro"
];

export function CalculatePayrollModal({
  open,
  onOpenChange,
  employees,
  startDate,
  endDate,
  onConfirm
}: CalculatePayrollModalProps) {
  const [calculations, setCalculations] = useState<PayrollCalculation[]>(() =>
    employees.map(emp => ({
      employeeId: emp.id,
      employeeName: emp.name,
      baseValue: emp.baseValue,
      bonuses: [],
      totalBonus: 0,
      finalValue: emp.baseValue
    }))
  );

  // Update calculations when employees change
  useMemo(() => {
    setCalculations(
      employees.map(emp => {
        const existing = calculations.find(c => c.employeeId === emp.id);
        if (existing) {
          return existing;
        }
        return {
          employeeId: emp.id,
          employeeName: emp.name,
          baseValue: emp.baseValue,
          bonuses: [],
          totalBonus: 0,
          finalValue: emp.baseValue
        };
      })
    );
  }, [employees]);

  const [addingBonusFor, setAddingBonusFor] = useState<string | null>(null);
  const [newBonusType, setNewBonusType] = useState("");
  const [newBonusDescription, setNewBonusDescription] = useState("");
  const [newBonusValue, setNewBonusValue] = useState("");

  const periodStr = `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;

  const handleAddBonus = (employeeId: string) => {
    if (!newBonusType || !newBonusValue) {
      toast({
        title: "Erro",
        description: "Preencha tipo e valor do bônus.",
        variant: "destructive"
      });
      return;
    }

    const numericValue = parseFloat(newBonusValue.replace(",", "."));
    if (isNaN(numericValue) || numericValue <= 0) {
      toast({
        title: "Erro",
        description: "Valor inválido.",
        variant: "destructive"
      });
      return;
    }

    const newBonus: EmployeeBonus = {
      id: `bonus-${Date.now()}`,
      type: newBonusType,
      description: newBonusDescription || newBonusType,
      value: numericValue
    };

    setCalculations(prev =>
      prev.map(calc => {
        if (calc.employeeId === employeeId) {
          const updatedBonuses = [...calc.bonuses, newBonus];
          const totalBonus = updatedBonuses.reduce((sum, b) => sum + b.value, 0);
          return {
            ...calc,
            bonuses: updatedBonuses,
            totalBonus,
            finalValue: calc.baseValue + totalBonus
          };
        }
        return calc;
      })
    );

    // Reset form
    setAddingBonusFor(null);
    setNewBonusType("");
    setNewBonusDescription("");
    setNewBonusValue("");
  };

  const handleRemoveBonus = (employeeId: string, bonusId: string) => {
    setCalculations(prev =>
      prev.map(calc => {
        if (calc.employeeId === employeeId) {
          const updatedBonuses = calc.bonuses.filter(b => b.id !== bonusId);
          const totalBonus = updatedBonuses.reduce((sum, b) => sum + b.value, 0);
          return {
            ...calc,
            bonuses: updatedBonuses,
            totalBonus,
            finalValue: calc.baseValue + totalBonus
          };
        }
        return calc;
      })
    );
  };

  const totalPayroll = calculations.reduce((sum, c) => sum + c.finalValue, 0);

  const handleDownloadExcel = () => {
    const workbook = XLSX.utils.book_new();

    const border = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };

    calculations.forEach(calc => {
      const allRows: (string | number)[][] = [
        ["", "", "", "", "PAYROLL"],
        ["", "", "", "", calc.employeeName],
        ["", "", "", "", periodStr],
        ["", "", "", "", ""],
        ["Tipo", "Descrição", "", "Valor", ""]
      ];

      // Add base value row
      allRows.push(["Salário Base", "Valor base do período", "", calc.baseValue, ""]);

      // Add bonuses
      calc.bonuses.forEach(bonus => {
        allRows.push([bonus.type, bonus.description, "", bonus.value, ""]);
      });

      // Add totals
      allRows.push(["", "", "", "", ""]);
      allRows.push(["Total Bônus", "", "", calc.totalBonus, ""]);
      allRows.push(["VALOR FINAL", "", "", calc.finalValue, ""]);

      const worksheet = XLSX.utils.aoa_to_sheet(allRows);

      // Style header
      for (let row = 0; row <= 2; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: row === 0, sz: row === 0 ? 14 : 11 },
            alignment: { horizontal: "left", vertical: "center" }
          };
        }
      }

      // Style table headers
      for (let col = 0; col <= 4; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 4, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            border,
            font: { bold: true, sz: 11 },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "D9D9D9" } }
          };
        }
      }

      worksheet["!cols"] = [
        { wch: 18 },
        { wch: 25 },
        { wch: 5 },
        { wch: 15 },
        { wch: 15 }
      ];

      const sheetName = calc.employeeName.substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, `payroll_calculation_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast({
      title: "Download iniciado",
      description: "Arquivo Excel gerado com sucesso."
    });
  };

  const handleQuickBooksPayment = () => {
    toast({
      title: "QuickBooks Payment",
      description: `Processando pagamento de ${totalPayroll.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} para ${calculations.length} funcionário(s).`
    });
    onConfirm(calculations);
    onOpenChange(false);
  };

  const handleConfirm = () => {
    onConfirm(calculations);
    onOpenChange(false);
    toast({
      title: "Payroll calculado",
      description: `${calculations.length} registros criados para o período ${periodStr}.`
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
        <DialogHeader>
          <DialogTitle>Calcular Payroll - {periodStr}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Funcionário</TableHead>
                <TableHead className="w-[120px]">Valor Base</TableHead>
                <TableHead>Bônus</TableHead>
                <TableHead className="w-[120px]">Total Bônus</TableHead>
                <TableHead className="w-[120px]">Valor Final</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calculations.map(calc => (
                <TableRow key={calc.employeeId}>
                  <TableCell className="font-medium">{calc.employeeName}</TableCell>
                  <TableCell>
                    {calc.baseValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      {calc.bonuses.map(bonus => (
                        <div key={bonus.id} className="flex items-center gap-2 text-sm bg-muted/50 p-2 rounded">
                          <span className="flex-1">
                            <strong>{bonus.type}</strong>: {bonus.value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                          </span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => handleRemoveBonus(calc.employeeId, bonus.id)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}

                      {addingBonusFor === calc.employeeId ? (
                        <div className="space-y-2 p-2 border rounded bg-background">
                          <Select value={newBonusType} onValueChange={setNewBonusType}>
                            <SelectTrigger className="h-8">
                              <SelectValue placeholder="Tipo de bônus" />
                            </SelectTrigger>
                            <SelectContent className="bg-popover">
                              {bonusTypes.map(type => (
                                <SelectItem key={type} value={type}>{type}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Descrição (opcional)"
                            value={newBonusDescription}
                            onChange={e => setNewBonusDescription(e.target.value)}
                            className="h-8"
                          />
                          <Input
                            placeholder="Valor"
                            value={newBonusValue}
                            onChange={e => setNewBonusValue(e.target.value)}
                            className="h-8"
                          />
                          <div className="flex gap-2">
                            <Button size="sm" onClick={() => handleAddBonus(calc.employeeId)}>
                              Adicionar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setAddingBonusFor(null)}>
                              Cancelar
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() => setAddingBonusFor(calc.employeeId)}
                        >
                          <Plus className="h-3 w-3" /> Adicionar Bônus
                        </Button>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-green-600 font-medium">
                    {calc.totalBonus > 0 && "+"}
                    {calc.totalBonus.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                  <TableCell className="font-bold">
                    {calc.finalValue.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>

        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-lg font-semibold">
            Total Payroll: {totalPayroll.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="outline" onClick={handleDownloadExcel} className="gap-2">
            <Download className="w-4 h-4" />
            Download Excel
          </Button>
          <Button onClick={handleQuickBooksPayment} className="gap-2 bg-green-600 hover:bg-green-700">
            <CreditCard className="w-4 h-4" />
            Pay with QuickBooks
          </Button>
          <Button onClick={handleConfirm}>
            Confirmar Payroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export type { PayrollCalculation, Employee };
