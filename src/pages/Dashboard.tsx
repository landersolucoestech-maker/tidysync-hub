import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { UpcomingJobs } from "@/components/dashboard/UpcomingJobs";
import { useLanguage } from "@/contexts/LanguageContext";
import { DollarSign, Users, Calendar, TrendingUp, CheckCircle, Clock } from "lucide-react";
export function Dashboard() {
  const {
    t
  } = useLanguage();
  return <div className="flex h-screen bg-background">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        
        <main className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {t("dashboard.welcome")}, Admin!
            </h1>
            <p className="text-muted-foreground">
              {t("dashboard.subtitle")}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard title={t("dashboard.monthlyRevenue")} value="$12,450" change="+12.5% from last month" changeType="positive" icon={<DollarSign className="w-6 h-6 text-primary" />} />
            <StatsCard title={t("dashboard.activeCustomers")} value="147" change="+8 new this month" changeType="positive" icon={<Users className="w-6 h-6 text-primary" />} />
            <StatsCard title={t("dashboard.jobsThisWeek")} value="28" change="18 completed, 10 pending" changeType="neutral" icon={<Calendar className="w-6 h-6 text-primary" />} />
            <StatsCard title={t("dashboard.growthRate")} value="23%" change="+5% from last quarter" changeType="positive" icon={<TrendingUp className="w-6 h-6 text-primary" />} />
          </div>


          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentActivity />
            <UpcomingJobs />
          </div>
        </main>
      </div>
    </div>;
}