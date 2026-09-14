import { useEffect, useState } from "react";
import { providersApi } from "../api/providersApi";
import { Provider } from "../types/provider";
import { ProvidersDataTable } from "../components/ProvidersTable";
import { Skeleton } from "@/components/ui/skeleton";

interface Stat {
  title: string;
  value: number;
  change: string;
  color: string;
  badge: string;
}

const ProvidersPage = () => {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Total Providers",
      value: 0,
      change: "0%",
      color: "text-blue-400",
      badge: "bg-background text-blue-400",
    },
    {
      title: "Casino Providers",
      value: 0,
      change: "0%",
      color: "text-yellow-400",
      badge: "bg-background text-yellow-400",
    },
    {
      title: "Slot Providers",
      value: 0,
      change: "0%",
      color: "text-green-400",
      badge: "bg-background text-green-400",
    },
  ]);

  const fetchProviders = async () => {
    setLoading(true);
    try {
      const data = await providersApi.getProviders();
      setProviders(data.data.providers);

      // Update stats
      const casinoCount = data.data.providers.filter(
        (p) => p.type === "casino"
      ).length;
      const slotCount = data.data.providers.filter(
        (p) => p.type === "slot"
      ).length;

      setStats([
        {
          title: "Total Providers",
          value: data.data.providers.length,
          change: "0%",
          color: "text-blue-400",
          badge: "bg-background text-blue-400",
        },
        {
          title: "Casino Providers",
          value: casinoCount,
          change: "0%",
          color: "text-yellow-400",
          badge: "bg-background text-yellow-400",
        },
        {
          title: "Slot Providers",
          value: slotCount,
          change: "0%",
          color: "text-green-400",
          badge: "bg-background text-green-400",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Providers</h1>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-background p-6 flex flex-col gap-2 border"
              >
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl bg-background p-6 flex flex-col gap-2 border"
              >
                <div className="text-muted-foreground text-sm">
                  {stat.title}
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.color}`}>
                  {stat.change} from last period
                </div>
              </div>
            ))}
      </div>
      <ProvidersDataTable
        data={providers}
        loading={loading}
        onRefresh={fetchProviders}
      />
    </div>
  );
};

export default ProvidersPage;
