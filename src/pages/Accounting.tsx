import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TransactionsTab } from "@/components/accounting/TransactionsTab";
import { InvoicesTab } from "@/components/accounting/InvoicesTab";
import { ReportsTab } from "@/components/accounting/ReportsTab";
import { CategoriesTab } from "@/components/accounting/CategoriesTab";
import { PaymentsTab } from "@/components/accounting/PaymentsTab";
import { AccountingSettingsTab } from "@/components/accounting/AccountingSettingsTab";

export function Accounting() {
  const [activeTab, setActiveTab] = useState("transactions");

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6 pl-[10px] pb-0 pr-[10px] pt-px mx-[8px] py-0 my-[4px]">
          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Accounting</h1>
              <p className="text-muted-foreground">
                Manage finances, invoices, expenses and reports
              </p>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-muted/50 p-1">
              <TabsTrigger value="transactions" className="data-[state=active]:bg-background">
                Transações
              </TabsTrigger>
              <TabsTrigger value="invoices" className="data-[state=active]:bg-background">
                Invoices
              </TabsTrigger>
              <TabsTrigger value="reports" className="data-[state=active]:bg-background">
                Relatórios
              </TabsTrigger>
              <TabsTrigger value="categories" className="data-[state=active]:bg-background">
                Contas & Categorias
              </TabsTrigger>
              <TabsTrigger value="payments" className="data-[state=active]:bg-background">
                Pagamentos
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-background">
                Configurações
              </TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="space-y-6">
              <TransactionsTab />
            </TabsContent>

            <TabsContent value="invoices" className="space-y-6">
              <InvoicesTab />
            </TabsContent>

            <TabsContent value="reports" className="space-y-6">
              <ReportsTab />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <CategoriesTab />
            </TabsContent>

            <TabsContent value="payments" className="space-y-6">
              <PaymentsTab />
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <AccountingSettingsTab />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
