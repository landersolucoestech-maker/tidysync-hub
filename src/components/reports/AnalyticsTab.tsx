import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  TrendingUp,
  Users,
  UserPlus,
  RefreshCw,
  Briefcase,
  XCircle,
  Car,
  Clock,
  CheckCircle,
  DollarSign,
  Receipt,
  PiggyBank,
  Percent,
  Gift,
  Building,
  RotateCw,
} from "lucide-react";

interface MetricCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  percentile: number;
  marketAverage?: string;
  topPerformers?: string;
  insight?: string;
  status?: string;
  statusType?: "success" | "warning" | "info";
}

function MetricCard({
  icon,
  title,
  value,
  percentile,
  marketAverage,
  topPerformers,
  insight,
  status,
  statusType = "success",
}: MetricCardProps) {
  const getPercentileColor = (p: number) => {
    if (p >= 80) return "text-green-500";
    if (p >= 60) return "text-blue-500";
    if (p >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const getProgressColor = (p: number) => {
    if (p >= 80) return "bg-green-500";
    if (p >= 60) return "bg-blue-500";
    if (p >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getStatusBadge = () => {
    if (!status) return null;
    const colors = {
      success: "bg-green-500/10 text-green-500 border-green-500/20",
      warning: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      info: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };
    return (
      <Badge variant="outline" className={colors[statusType]}>
        {status}
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-primary/10 rounded-lg shrink-0">{icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-muted-foreground font-medium">{title}</p>
            <p className="text-xl font-bold text-foreground mt-1">{value}</p>

            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Percentil</span>
                <span className={`font-semibold ${getPercentileColor(percentile)}`}>
                  {percentile}%
                </span>
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={`absolute left-0 top-0 h-full rounded-full transition-all ${getProgressColor(percentile)}`}
                  style={{ width: `${percentile}%` }}
                />
              </div>
            </div>

            {marketAverage && (
              <p className="text-xs text-muted-foreground mt-2">
                Média do mercado: <span className="font-medium">{marketAverage}</span>
              </p>
            )}
            {topPerformers && (
              <p className="text-xs text-muted-foreground">
                Top performers: <span className="font-medium">{topPerformers}</span>
              </p>
            )}
            {insight && (
              <p className="text-xs text-primary mt-2 font-medium">{insight}</p>
            )}
            {status && <div className="mt-2">{getStatusBadge()}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AnalyticsTab() {
  const overallScore = 72;
  const percentileRank = 28;

  return (
    <div className="space-y-8">
      {/* Overall Score Card */}
      <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-primary/20">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-primary" />
            <CardTitle className="text-xl">Overall Business Performance Score</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-8 border-primary/20 flex items-center justify-center bg-background">
                  <span className="text-4xl font-bold text-primary">{overallScore}</span>
                </div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Top {percentileRank}%
                  </Badge>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-sm">
                  Compared to similar service-based companies in your market.
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Crescimento de clientes
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Briefcase className="w-3 h-3 mr-1" />
                    Eficiência operacional
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <DollarSign className="w-3 h-3 mr-1" />
                    Rentabilidade
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <Receipt className="w-3 h-3 mr-1" />
                    Custos
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client Indicators */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Client Health Overview</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={<UserPlus className="w-5 h-5 text-primary" />}
            title="New Clients"
            value="34"
            percentile={78}
            marketAverage="20"
            topPerformers="60"
          />
          <MetricCard
            icon={<Users className="w-5 h-5 text-primary" />}
            title="Total Clients"
            value="412"
            percentile={85}
            marketAverage="180"
            status="Top 10%"
            statusType="success"
          />
          <MetricCard
            icon={<RefreshCw className="w-5 h-5 text-primary" />}
            title="Recurring Clients"
            value="68%"
            percentile={91}
            marketAverage="45%"
            insight="Strong client retention"
          />
        </div>
      </div>

      {/* Job Indicators */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Briefcase className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Operational Efficiency</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <MetricCard
            icon={<Briefcase className="w-5 h-5 text-primary" />}
            title="Jobs Completed"
            value="1,280"
            percentile={82}
            marketAverage="900"
          />
          <MetricCard
            icon={<XCircle className="w-5 h-5 text-primary" />}
            title="Cancellations"
            value="4.2%"
            percentile={88}
            marketAverage="9%"
            status="Excellent"
            statusType="success"
          />
          <MetricCard
            icon={<Car className="w-5 h-5 text-primary" />}
            title="Driving Time"
            value="22 min"
            percentile={64}
            marketAverage="30 min"
          />
          <MetricCard
            icon={<Clock className="w-5 h-5 text-primary" />}
            title="Completion Time"
            value="1h 35m"
            percentile={71}
            marketAverage="2h"
          />
          <MetricCard
            icon={<CheckCircle className="w-5 h-5 text-primary" />}
            title="On-time Completion"
            value="93%"
            percentile={90}
            status="Top performers"
            statusType="success"
          />
        </div>
      </div>

      {/* Financial Indicators */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Revenue & Profitability</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <MetricCard
            icon={<DollarSign className="w-5 h-5 text-primary" />}
            title="Revenue"
            value="$128,400"
            percentile={76}
            marketAverage="$85,000"
          />
          <MetricCard
            icon={<Receipt className="w-5 h-5 text-primary" />}
            title="Revenue per Job"
            value="$100"
            percentile={69}
            marketAverage="$82"
          />
          <MetricCard
            icon={<TrendingUp className="w-5 h-5 text-primary" />}
            title="Net Profit"
            value="$34,200"
            percentile={72}
          />
          <MetricCard
            icon={<Percent className="w-5 h-5 text-primary" />}
            title="Profit Margin"
            value="26.6%"
            percentile={81}
            marketAverage="18%"
          />
          <MetricCard
            icon={<Gift className="w-5 h-5 text-primary" />}
            title="Tips"
            value="$6,480"
            percentile={75}
            insight="Avg per job: $5.06"
          />
        </div>
      </div>

      {/* Expenses Analytics */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <PiggyBank className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Cost Structure</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <MetricCard
            icon={<Receipt className="w-5 h-5 text-primary" />}
            title="Total Expenses"
            value="$94,200"
            percentile={58}
          />
          <MetricCard
            icon={<Building className="w-5 h-5 text-primary" />}
            title="Fixed Expenses"
            value="$38,000"
            percentile={45}
            insight="Per job: $29.68"
            status="Above market average"
            statusType="warning"
          />
          <MetricCard
            icon={<RotateCw className="w-5 h-5 text-primary" />}
            title="Variable Expenses"
            value="$56,200"
            percentile={63}
            insight="Per job: $43.90"
          />
        </div>
      </div>
    </div>
  );
}
