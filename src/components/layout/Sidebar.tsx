import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Settings,
  Home,
  Phone,
  ClipboardList,
  ChevronLeft,
  ChevronRight,
  Wallet,
  Calculator,
} from "lucide-react";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: Users, label: "Customers", href: "/customers" },
  { icon: Briefcase, label: "Jobs", href: "/jobs" },
  { icon: DollarSign, label: "Billing", href: "/billing" },
  { icon: Calculator, label: "Accounting", href: "/accounting" },
  { icon: ClipboardList, label: "Estimates", href: "/estimates" },
  { icon: Phone, label: "Communications", href: "/communications" },
  { icon: Wallet, label: "Payroll", href: "/payroll" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={cn(
        "relative flex flex-col h-screen bg-surface shadow-xl border-r border-border transition-all duration-300",
        isCollapsed ? "w-20" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
              <ClipboardList className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">CleanPro</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="ml-auto"
        >
          {isCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </Button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <Button
            key={item.label}
            variant="ghost"
            onClick={() => navigate(item.href)}
            className={cn(
              "w-full justify-start text-left h-12 transition-all duration-200",
              "hover:bg-primary/10 hover:text-primary",
              location.pathname === item.href && "bg-primary/10 text-primary border-r-2 border-primary",
              isCollapsed ? "px-3" : "px-4"
            )}
          >
            <item.icon className={cn("w-5 h-5", isCollapsed ? "mx-auto" : "mr-3")} />
            {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
          </Button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        {!isCollapsed && (
          <div className="text-xs text-muted-foreground text-center">
            CleanPro v1.0
          </div>
        )}
      </div>
    </div>
  );
}