import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { Users, DollarSign, Activity, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/statsApi";
import { useState } from "react";
import { StatisticsTable } from "../components/StatisticsTable";

const DailyMontlyPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [period] = useState<"daily" | "monthly">("daily");
  const [startDate] = useState<string>("");
  const [endDate] = useState<string>("");

  const { data: statsData, isLoading } = useQuery({
    queryKey: ["stats", page, period, startDate, endDate],
    queryFn: () =>
      statsApi.getDailyMonthlyStats({
        page,
        period,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
      }),
  });

  const calculateStats = () => {
    if (!statsData?.list) return [];

    const list = statsData.list;
    const totalNewUsers = list.reduce((sum, item) => sum + item.newUsers, 0);
    const totalActiveUsers = list.reduce(
      (sum, item) => sum + item.activeUsers,
      0
    );
    const totalBetAmount = list.reduce(
      (sum, item) => sum + item.totalBetAmount,
      0
    );
    const totalDepositAmount = list.reduce(
      (sum, item) => sum + item.totalDepositAmount,
      0
    );

    return [
      {
        title: t("dashboard.stats.newUsers"),
        value: totalNewUsers.toLocaleString(),
        change: "+12.3%",
        icon: Users,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
      },
      {
        title: t("dashboard.stats.totalDepositAmount"),
        value: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(totalDepositAmount),
        change: "+20.1%",
        icon: DollarSign,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
      },
      {
        title: t("dashboard.stats.activeUsers"),
        value: totalActiveUsers.toLocaleString(),
        change: "+5.2%",
        icon: Activity,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
      },
      {
        title: t("dashboard.stats.totalBetAmount"),
        value: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(totalBetAmount),
        change: "+8.4%",
        icon: TrendingUp,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
      },
    ];
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{t("sidebar.statistics.daily")}</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {calculateStats().map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Statistics Table */}
      <StatisticsTable
        data={statsData?.list || []}
        loading={isLoading}
        total={statsData?.total || 0}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default DailyMontlyPage;
