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
  ChevronDown,
  Wallet,
  Calculator,
  ArrowRightLeft,
  FileText,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

interface SidebarProps {
  className?: string;
}

interface NavItem {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href?: string;
  submenu?: { label: string; href: string; icon: React.ComponentType<{ className?: string }> }[];
}

const navigationItems: NavItem[] = [
  { icon: Home, label: "Dashboard", href: "/" },
  { icon: Calendar, label: "Schedule", href: "/schedule" },
  { icon: Users, label: "Customers", href: "/customers" },
  { 
    icon: Calculator, 
    label: "Accounting",
    submenu: [
      { label: "Transactions", href: "/transactions", icon: ArrowRightLeft },
      { label: "Invoices", href: "/invoices", icon: DollarSign },
      { label: "Leads", href: "/leads", icon: ClipboardList },
      { label: "Payroll", href: "/payroll", icon: Wallet },
      { label: "Payroll Rules", href: "/payroll-rules", icon: FileText },
    ]
  },
  { icon: Phone, label: "Communications", href: "/communications" },
  { icon: BarChart3, label: "Reports", href: "/reports" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar({ className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("Accounting");
  const navigate = useNavigate();
  const location = useLocation();

  const isActiveRoute = (item: NavItem) => {
    if (item.href) {
      return location.pathname === item.href;
    }
    if (item.submenu) {
      return item.submenu.some(sub => location.pathname === sub.href);
    }
    return false;
  };

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
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          if (item.submenu) {
            const isOpen = openSubmenu === item.label;
            
            return (
              <Collapsible
                key={item.label}
                open={isOpen}
                onOpenChange={(open) => setOpenSubmenu(open ? item.label : null)}
              >
                <CollapsibleTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start text-left h-12 transition-all duration-200",
                      "hover:bg-primary/10 hover:text-primary",
                      isActiveRoute(item) && "bg-primary/10 text-primary border-r-2 border-primary",
                      isCollapsed ? "px-3" : "px-4"
                    )}
                  >
                    <item.icon className={cn("w-5 h-5", isCollapsed ? "mx-auto" : "mr-3")} />
                    {!isCollapsed && (
                      <>
                        <span className="text-sm font-medium flex-1">{item.label}</span>
                        <ChevronDown className={cn(
                          "w-4 h-4 ml-auto transition-transform duration-200",
                          isOpen && "rotate-180"
                        )} />
                      </>
                    )}
                  </Button>
                </CollapsibleTrigger>
                {!isCollapsed && (
                  <CollapsibleContent className="pl-4 space-y-1 mt-1">
                    {item.submenu.map((subItem) => (
                      <Button
                        key={subItem.href}
                        variant="ghost"
                        onClick={() => navigate(subItem.href)}
                        className={cn(
                          "w-full justify-start text-left h-10 transition-all duration-200",
                          "hover:bg-primary/10 hover:text-primary",
                          location.pathname === subItem.href && "bg-primary/10 text-primary"
                        )}
                      >
                        <subItem.icon className="w-4 h-4 mr-3" />
                        <span className="text-sm">{subItem.label}</span>
                      </Button>
                    ))}
                  </CollapsibleContent>
                )}
              </Collapsible>
            );
          }

          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => item.href && navigate(item.href)}
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
          );
        })}
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
