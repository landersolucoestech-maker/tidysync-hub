import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";

import { CalendarIcon, Download, Calculator, Search, ChevronUp, ChevronDown, Check, ChevronsUpDown, X, CreditCard, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isWithinInterval, parse } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "@/hooks/use-toast";
import XLSX from "xlsx-js-style";
import { CalculatePayrollModal, PayrollCalculation, Employee } from "@/components/payroll/CalculatePayrollModal";
interface PayrollRecord {
  id: string;
  period: string;
  employeeName: string;
  cleaningType: string;
  client: string;
  baseValue: number;
  paymentType: "Direct Deposit" | "Check" | "Cash" | "QuickBooks";
  status: "Pending" | "Paid" | "Overdue";
}
const initialEmployees = [{
  id: "1",
  name: "João Silva",
  baseValue: 2500
}, {
  id: "2",
  name: "Maria Santos",
  baseValue: 2800
}, {
  id: "3",
  name: "Carlos Oliveira",
  baseValue: 3200
}, {
  id: "4",
  name: "Ana Costa",
  baseValue: 2600
}, {
  id: "5",
  name: "Pedro Souza",
  baseValue: 2900
}];
const initialPayrollData: PayrollRecord[] = [{
  id: "1",
  period: "01/12/2024 - 15/12/2024",
  employeeName: "João Silva",
  cleaningType: "Residential Cleaning",
  client: "ABC Company",
  baseValue: 2500,
  paymentType: "Direct Deposit",
  status: "Paid"
}, {
  id: "2",
  period: "01/12/2024 - 15/12/2024",
  employeeName: "Maria Santos",
  cleaningType: "Commercial Cleaning",
  client: "XYZ Office",
  baseValue: 2800,
  paymentType: "Direct Deposit",
  status: "Paid"
}, {
  id: "3",
  period: "01/12/2024 - 15/12/2024",
  employeeName: "Carlos Oliveira",
  cleaningType: "Post-Construction Cleaning",
  client: "Delta Construction",
  baseValue: 3200,
  paymentType: "Check",
  status: "Pending"
}, {
  id: "4",
  period: "01/12/2024 - 15/12/2024",
  employeeName: "Ana Costa",
  cleaningType: "Residential Cleaning",
  client: "Sun Residential",
  baseValue: 2600,
  paymentType: "Cash",
  status: "Overdue"
}, {
  id: "5",
  period: "16/12/2024 - 31/12/2024",
  employeeName: "João Silva",
  cleaningType: "Commercial Cleaning",
  client: "Shopping Center",
  baseValue: 2500,
  paymentType: "QuickBooks",
  status: "Pending"
}, {
  id: "6",
  period: "16/12/2024 - 31/12/2024",
  employeeName: "Maria Santos",
  cleaningType: "Residential Cleaning",
  client: "Green Condo",
  baseValue: 2800,
  paymentType: "Direct Deposit",
  status: "Pending"
}, {
  id: "7",
  period: "16/12/2024 - 31/12/2024",
  employeeName: "Pedro Souza",
  cleaningType: "Post-Construction Cleaning",
  client: "Industrial Site",
  baseValue: 2900,
  paymentType: "QuickBooks",
  status: "Pending"
}];
type SortField = "period" | "employeeName" | "baseValue" | "status";
type SortDirection = "asc" | "desc";

export function Payroll() {
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedEmployee, setSelectedEmployee] = useState<string>("all");
  const [payrollData, setPayrollData] = useState<PayrollRecord[]>(initialPayrollData);
  const [filteredData, setFilteredData] = useState<PayrollRecord[]>(initialPayrollData);
  const [sortField, setSortField] = useState<SortField>("period");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  
  const [employeeOpen, setEmployeeOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [calculateModalOpen, setCalculateModalOpen] = useState(false);
  const [showClearButton, setShowClearButton] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const periodStatus = startDate && endDate ? "Open" : "Closed";
  // Helper function to parse dd/MM/yyyy format
  const parseDate = (dateStr: string) => {
    const [day, month, year] = dateStr.split("/").map(Number);
    return new Date(year, month - 1, day);
  };

  const handleFilter = () => {
    let filtered = [...payrollData];
    
    if (selectedEmployee && selectedEmployee !== "all") {
      filtered = filtered.filter(record => record.employeeName === selectedEmployee);
    }
    
    if (selectedStatus && selectedStatus !== "all") {
      filtered = filtered.filter(record => record.status === selectedStatus);
    }
    
    if (startDate && endDate) {
      // Filter records where the period overlaps with selected date range
      filtered = filtered.filter(record => {
        const [periodStartStr, periodEndStr] = record.period.split(" - ");
        const periodStart = parseDate(periodStartStr);
        const periodEnd = parseDate(periodEndStr);
        
        // Check if periods overlap
        return (
          (periodStart <= endDate && periodEnd >= startDate) ||
          isWithinInterval(periodStart, { start: startDate, end: endDate }) ||
          isWithinInterval(periodEnd, { start: startDate, end: endDate })
        );
      });
    }
    
    setFilteredData(sortData(filtered, sortField, sortDirection));
    setShowClearButton(true);
    toast({
      title: "Filter applied",
      description: `${filtered.length} records found.`
    });
  };

  const handleClearFilter = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedEmployee("all");
    setSelectedStatus("all");
    setFilteredData(sortData(payrollData, sortField, sortDirection));
    setShowClearButton(false);
    toast({
      title: "Filters cleared",
      description: "Showing all records."
    });
  };
  const sortData = (data: PayrollRecord[], field: SortField, direction: SortDirection) => {
    return [...data].sort((a, b) => {
      let comparison = 0;
      switch (field) {
        case "period":
          comparison = a.period.localeCompare(b.period);
          break;
        case "employeeName":
          comparison = a.employeeName.localeCompare(b.employeeName);
          break;
        case "baseValue":
          comparison = a.baseValue - b.baseValue;
          break;
        case "status":
          comparison = a.status.localeCompare(b.status);
          break;
      }
      return direction === "asc" ? comparison : -comparison;
    });
  };
  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setFilteredData(sortData(filteredData, field, newDirection));
  };
  const SortIcon = ({
    field
  }: {
    field: SortField;
  }) => {
    if (sortField !== field) return null;
    return sortDirection === "asc" ? <ChevronUp className="w-4 h-4 ml-1" /> : <ChevronDown className="w-4 h-4 ml-1" />;
  };
  const handleOpenCalculateModal = () => {
    if (!startDate || !endDate) {
      toast({
        title: "Erro",
        description: "Selecione o período para calcular o payroll.",
        variant: "destructive"
      });
      return;
    }
    setCalculateModalOpen(true);
  };

  const handleConfirmPayroll = (calculations: PayrollCalculation[]) => {
    if (!startDate || !endDate) return;
    
    const periodStr = `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`;
    const newRecords: PayrollRecord[] = calculations.map((calc, index) => ({
      id: `new-${Date.now()}-${index}`,
      period: periodStr,
      employeeName: calc.employeeName,
      cleaningType: "General Cleaning",
      client: "Default Client",
      baseValue: calc.finalValue,
      paymentType: "Direct Deposit" as const,
      status: "Pending" as const
    }));
    
    const updatedData = [...payrollData, ...newRecords];
    setPayrollData(updatedData);
    
    // Filter to show only records from the selected period
    const filteredByPeriod = updatedData.filter(record => record.period === periodStr);
    setFilteredData(sortData(filteredByPeriod, sortField, sortDirection));
  };
  const handleDownloadExcel = () => {
    // Get period for header
    const periodHeader = startDate && endDate 
      ? `${format(startDate, "dd/MM/yyyy")} - ${format(endDate, "dd/MM/yyyy")}`
      : filteredData.length > 0 ? filteredData[0].period : "";
    
    const workbook = XLSX.utils.book_new();
    
    // Group data by employee
    const groupedByEmployee: { [key: string]: PayrollRecord[] } = {};
    filteredData.forEach(record => {
      if (!groupedByEmployee[record.employeeName]) {
        groupedByEmployee[record.employeeName] = [];
      }
      groupedByEmployee[record.employeeName].push(record);
    });
    
    // Define border style
    const border = {
      top: { style: "thin", color: { rgb: "000000" } },
      bottom: { style: "thin", color: { rgb: "000000" } },
      left: { style: "thin", color: { rgb: "000000" } },
      right: { style: "thin", color: { rgb: "000000" } }
    };
    
    // Create a sheet for each employee
    Object.keys(groupedByEmployee).sort().forEach(employeeName => {
      const employeeRecords = groupedByEmployee[employeeName];
      
      
      // Bonus is now handled in the modal, so we set it to 0 for Excel export
      const totalBonus = 0;
      
      // Create header rows exactly like the image
      // Row 1: PAYROLL (column E - Daily Total)
      // Row 2: Employee Name (column E - Daily Total)
      // Row 3: Period (column E - Daily Total)
      // Row 4: Empty
      // Row 5: Table headers
      const allRows: (string | number)[][] = [
        ["", "", "", "", "PAYROLL"],           // Row 1
        ["", "", "", "", employeeName],        // Row 2
        ["", "", "", "", periodHeader],        // Row 3
        ["", "", "", "", ""],                  // Row 4 - Empty
        ["Date", "Payment Type", "Description", "Amount", "Daily Total"] // Row 5 - Headers
      ];
      
      // Group employee data by date
      const groupedByDate: { [key: string]: PayrollRecord[] } = {};
      employeeRecords.forEach(record => {
        const dateKey = record.period.split(" - ")[0];
        if (!groupedByDate[dateKey]) {
          groupedByDate[dateKey] = [];
        }
        groupedByDate[dateKey].push(record);
      });
      
      // Create data rows with daily totals
      let grandTotal = 0;
      const merges: { s: { r: number; c: number }; e: { r: number; c: number } }[] = [];
      let currentRow = 5; // Start after headers (0-indexed row 5)
      
      Object.keys(groupedByDate).sort().forEach(dateKey => {
        const records = groupedByDate[dateKey];
        const dailyTotal = records.reduce((sum, r) => sum + r.baseValue, 0);
        grandTotal += dailyTotal;
        const startRow = currentRow;
        
        records.forEach((record, index) => {
          allRows.push([
            index === 0 ? dateKey : "",
            record.cleaningType,
            record.client,
            `$                    ${record.baseValue.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`,
            index === 0 ? `$                    ${dailyTotal.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}` : ""
          ]);
          currentRow++;
        });
        
        // Add merge for Date column if multiple records
        if (records.length > 1) {
          merges.push({
            s: { r: startRow, c: 0 },
            e: { r: currentRow - 1, c: 0 }
          });
          merges.push({
            s: { r: startRow, c: 4 },
            e: { r: currentRow - 1, c: 4 }
          });
        }
      });
      
      // Add Total row - label merged from Date to Amount, value in Daily Total
      const totalRowIndex = currentRow;
      allRows.push([
        "Total",
        "",
        "",
        "",
        `$                    ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
      ]);
      currentRow++;
      
      // Merge Total label from column A to D
      merges.push({
        s: { r: totalRowIndex, c: 0 },
        e: { r: totalRowIndex, c: 3 }
      });
      
      // Add "Obs: Bônus da Semana" row - label merged from Date to Amount, value in Daily Total
      const bonusRowIndex = currentRow;
      allRows.push([
        "Obs: Bônus da Semana",
        "",
        "",
        "",
        `$                    ${totalBonus.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
      ]);
      currentRow++;
      
      // Merge Bonus label from column A to D
      merges.push({
        s: { r: bonusRowIndex, c: 0 },
        e: { r: bonusRowIndex, c: 3 }
      });
      
      // Add Subtotal row - label merged from Date to Amount, value in Daily Total
      const subtotal = grandTotal + totalBonus;
      const subtotalRowIndex = currentRow;
      allRows.push([
        "Subtotal",
        "",
        "",
        "",
        `$                    ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
      ]);
      currentRow++;
      
      // Merge Subtotal label from column A to D
      merges.push({
        s: { r: subtotalRowIndex, c: 0 },
        e: { r: subtotalRowIndex, c: 3 }
      });
      
      const worksheet = XLSX.utils.aoa_to_sheet(allRows);
      
      // Apply merges
      worksheet["!merges"] = merges;
      
      // Get the range of the worksheet
      const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1");
      
      // Style header cells (PAYROLL, name, period) - rows 0-2, column E
      for (let row = 0; row <= 2; row++) {
        const cellAddress = XLSX.utils.encode_cell({ r: row, c: 4 });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            font: { bold: row === 0, sz: row === 0 ? 14 : 11 },
            alignment: { horizontal: "left", vertical: "center" }
          };
        }
      }
      
      // Style table header row (row 4)
      for (let col = 0; col <= 4; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 4, c: col });
        if (worksheet[cellAddress]) {
          worksheet[cellAddress].s = {
            border: border,
            font: { bold: true, sz: 11 },
            alignment: { horizontal: "center", vertical: "center" },
            fill: { fgColor: { rgb: "D9D9D9" } }
          };
        }
      }
      
      // Style data rows (from row 5 to end)
      for (let row = 5; row <= range.e.r; row++) {
        for (let col = 0; col <= 4; col++) {
          const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
          if (!worksheet[cellAddress]) {
            worksheet[cellAddress] = { v: "", t: "s" };
          }
          
          const isLastThreeRows = row >= totalRowIndex;
          const isAmountOrTotal = col === 3 || col === 4;
          const isMergedLabelCell = isLastThreeRows && col === 0;
          
          worksheet[cellAddress].s = {
            border: border,
            font: { 
              bold: isLastThreeRows,
              sz: 11 
            },
            alignment: { 
              horizontal: isMergedLabelCell ? "right" : (isAmountOrTotal ? "right" : "left"), 
              vertical: "center" 
            }
          };
        }
      }
      
      // Set column widths to match the image
      worksheet["!cols"] = [
        { wch: 12 },  // Date
        { wch: 18 },  // Payment Type
        { wch: 22 },  // Description
        { wch: 22 },  // Amount
        { wch: 14 }   // Daily Total
      ];
      
      // Add sheet with employee name (limit to 31 chars for Excel)
      const sheetName = employeeName.substring(0, 31);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });

    XLSX.writeFile(workbook, `payroll_${format(new Date(), "yyyy-MM-dd")}.xlsx`);
    toast({
      title: "Download started",
      description: "Excel file generated successfully."
    });
  };
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Paid":
        return <Badge className="bg-green-500/20 text-green-600 hover:bg-green-500/30">Paid</Badge>;
      case "Pending":
        return <Badge className="bg-yellow-500/20 text-yellow-600 hover:bg-yellow-500/30">Pending</Badge>;
      case "Overdue":
        return <Badge className="bg-red-500/20 text-red-600 hover:bg-red-500/30">Overdue</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };
  const uniqueEmployees = [...new Set(payrollData.map(r => r.employeeName))];
  
  // Calculate employee periods based on filtered data
  const employeePeriods = useMemo(() => {
    const periods: { employeeName: string; startDate: Date; endDate: Date }[] = [];
    
    uniqueEmployees.forEach(employeeName => {
      const employeeRecords = filteredData.filter(r => r.employeeName === employeeName);
      if (employeeRecords.length > 0) {
        // Get the first period and parse dates
        const firstPeriod = employeeRecords[0].period;
        const [startStr, endStr] = firstPeriod.split(" - ");
        
        // Parse dd/MM/yyyy format
        const parseDate = (dateStr: string) => {
          const [day, month, year] = dateStr.split("/").map(Number);
          return new Date(year, month - 1, day);
        };
        
        periods.push({
          employeeName,
          startDate: parseDate(startStr),
          endDate: parseDate(endStr)
        });
      }
    });
    
    return periods;
  }, [uniqueEmployees, filteredData]);
  
  // Employees for calculate modal
  const employeesForModal: Employee[] = initialEmployees;

  const handleQuickBooksPayment = () => {
    if (selectedRows.length === 0) {
      toast({
        title: "No records selected",
        description: "Please select at least one payroll record to process payment.",
        variant: "destructive",
      });
      return;
    }
    
    const selectedRecords = filteredData.filter(r => selectedRows.includes(r.id));
    const totalAmount = selectedRecords.reduce((sum, r) => sum + r.baseValue, 0);
    
    // TODO: Integrate with QuickBooks API when Cloud is enabled
    toast({
      title: "QuickBooks Payment",
      description: `Processing payment of ${totalAmount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })} for ${selectedRows.length} record(s). QuickBooks integration pending.`,
    });
    
    // Mark selected records as Paid (mock)
    setPayrollData(prev => 
      prev.map(r => 
        selectedRows.includes(r.id) ? { ...r, status: "Paid" as const } : r
      )
    );
    setFilteredData(prev => 
      prev.map(r => 
        selectedRows.includes(r.id) ? { ...r, status: "Paid" as const } : r
      )
    );
    setSelectedRows([]);
  };
  return <div className="flex min-h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Page Title */}
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Payroll</h1>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/payroll-rules")} className="gap-2">
                <FileText className="w-4 h-4" />
                Payroll Rules
              </Button>
              <Button onClick={handleOpenCalculateModal} className="gap-2">
                <Calculator className="w-4 h-4" />
                Calculate Payroll
              </Button>
              <Button variant="outline" onClick={handleDownloadExcel} className="gap-2">
                <Download className="w-4 h-4" />
                Download Excel
              </Button>
              <Button 
                onClick={handleQuickBooksPayment} 
                variant="default"
                className="gap-2 bg-green-600 hover:bg-green-700"
                disabled={selectedRows.length === 0}
              >
                <CreditCard className="w-4 h-4" />
                Pay with QuickBooks
              </Button>
            </div>
          </div>

          {/* Filter Card */}
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="bg-white py-0 pt-0 px-4">
              <div className="flex-wrap items-end justify-start py-px gap-[16px] flex flex-row">
                {/* Employee Combobox */}
                <div className="space-y-2 min-w-[250px]">
                  <Label>Employee</Label>
                  <Popover open={employeeOpen} onOpenChange={setEmployeeOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" role="combobox" aria-expanded={employeeOpen} className="w-full justify-between font-normal">
                        {selectedEmployee === "all" ? "All employees" : selectedEmployee || "Type or select..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[250px] p-0 bg-popover z-50" align="start">
                      <Command>
                        <CommandInput placeholder="Search employee..." />
                        <CommandList>
                          <CommandEmpty>No employee found.</CommandEmpty>
                          <CommandGroup>
                            <CommandItem value="all" onSelect={() => {
                            setSelectedEmployee("all");
                            setEmployeeOpen(false);
                          }}>
                              <Check className={cn("mr-2 h-4 w-4", selectedEmployee === "all" ? "opacity-100" : "opacity-0")} />
                              All employees
                            </CommandItem>
                            {uniqueEmployees.map(name => <CommandItem key={name} value={name} onSelect={() => {
                            setSelectedEmployee(name);
                            setEmployeeOpen(false);
                          }}>
                                <Check className={cn("mr-2 h-4 w-4", selectedEmployee === name ? "opacity-100" : "opacity-0")} />
                                {name}
                              </CommandItem>)}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Status Dropdown */}
                <div className="space-y-2 min-w-[150px]">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger className="bg-background">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover z-50">
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="Paid">Paid</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Period Selector */}
                <div className="space-y-2">
                  <Label>Data Início</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !startDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Data Fim</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className={cn("w-[200px] justify-start text-left font-normal", !endDate && "text-muted-foreground")}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-popover z-50" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>

                <Button onClick={handleFilter} size="icon">
                  <Search className="w-4 h-4" />
                </Button>

                {showClearButton && (
                  <Button onClick={handleClearFilter} size="icon" variant="outline">
                    <X className="w-4 h-4" />
                  </Button>
                )}

                
              </div>
            </CardContent>
          </Card>

          {/* Payroll Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lista de Payroll</CardTitle>
            </CardHeader>
            <CardContent className="px-0">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[50px]">
                        <Checkbox
                          checked={filteredData.length > 0 && selectedRows.length === filteredData.length}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedRows(filteredData.map(r => r.id));
                            } else {
                              setSelectedRows([]);
                            }
                          }}
                        />
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("period")}>
                        <div className="flex items-center">
                          Período
                          <SortIcon field="period" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("employeeName")}>
                        <div className="flex items-center">
                          Nome do Funcionário
                          <SortIcon field="employeeName" />
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("baseValue")}>
                        <div className="flex items-center">
                          Valor
                          <SortIcon field="baseValue" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center">
                          Payment Type
                        </div>
                      </TableHead>
                      <TableHead className="cursor-pointer hover:bg-muted/50" onClick={() => handleSort("status")}>
                        <div className="flex items-center">
                          Status
                          <SortIcon field="status" />
                        </div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredData.length === 0 ? <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          Nenhum registro encontrado
                        </TableCell>
                      </TableRow> : filteredData.map(record => <TableRow key={record.id}>
                          <TableCell>
                            <Checkbox
                              checked={selectedRows.includes(record.id)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  setSelectedRows(prev => [...prev, record.id]);
                                } else {
                                  setSelectedRows(prev => prev.filter(id => id !== record.id));
                                }
                              }}
                            />
                          </TableCell>
                          <TableCell className="font-medium">{record.period}</TableCell>
                          <TableCell>{record.employeeName}</TableCell>
                          <TableCell>
                            {record.baseValue.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL"
                      })}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="font-normal">
                              {record.paymentType}
                            </Badge>
                          </TableCell>
                          <TableCell>{getStatusBadge(record.status)}</TableCell>
                        </TableRow>)}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="flex justify-end mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Total de registros: <span className="font-semibold text-foreground">{filteredData.length}</span>
                  {" | "}
                  Valor total:{" "}
                  <span className="font-semibold text-foreground">
                    {filteredData.reduce((sum, r) => sum + r.baseValue, 0).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL"
                  })}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Calculate Payroll Modal */}
          {startDate && endDate && (
            <CalculatePayrollModal
              open={calculateModalOpen}
              onOpenChange={setCalculateModalOpen}
              employees={employeesForModal}
              startDate={startDate}
              endDate={endDate}
              onConfirm={handleConfirmPayroll}
            />
          )}
        </main>
      </div>
    </div>;
}