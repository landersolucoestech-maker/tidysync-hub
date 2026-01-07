import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Index from "./pages/Index";
import { Customers } from "./pages/Customers";
import { Schedule } from "./pages/Schedule";
import { Billing } from "./pages/Billing";
import { Transactions } from "./pages/Transactions";
import { Leads } from "./pages/Leads";
import { Communications } from "./pages/Communications";
import { Rules } from "./pages/Rules";
import { Reports } from "./pages/Reports";
import { Settings } from "./pages/Settings";
import { Integrations } from "./pages/Integrations";
import { Payroll } from "./pages/Payroll";
import { PayrollRules } from "./pages/PayrollRules";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/invoices" element={<Billing />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/rules" element={<Rules />} />
            <Route path="/communications" element={<Communications />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="/payroll-rules" element={<PayrollRules />} />
            <Route path="/leads" element={<Leads />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
