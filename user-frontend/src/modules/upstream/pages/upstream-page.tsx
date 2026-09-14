import { useEffect, useState } from "react";
import { upstreamApi } from "../api/upstreamApi";
import { UpstreamTable } from "../components/UpstreamTable";
import { Skeleton } from "@/components/ui/skeleton";
import { Upstream } from "../types/upstream";

interface Stat {
  title: string;
  value: number;
  change: string;
  color: string;
  badge: string;
}

const UpstreamPage = () => {
  const [upstreams, setUpstreams] = useState<Upstream[]>([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<Stat[]>([
    {
      title: "Total Upstreams",
      value: 0,
      change: "0%",
      color: "text-blue-400",
      badge: "bg-background text-blue-400",
    },
    {
      title: "Enabled Upstreams",
      value: 0,
      change: "0%",
      color: "text-green-400",
      badge: "bg-background text-green-400",
    },
    {
      title: "Disabled Upstreams",
      value: 0,
      change: "0%",
      color: "text-red-400",
      badge: "bg-background text-red-400",
    },
  ]);

  const fetchUpstreams = async () => {
    setLoading(true);
    try {
      const data = await upstreamApi.getUpstreams();
      setUpstreams(data.data.upstreams);

      const enabledCount = data.data.upstreams.filter((u) => u.enabled).length;
      const disabledCount = data.data.upstreams.filter(
        (u) => !u.enabled
      ).length;

      setStats([
        {
          title: "Total Upstreams",
          value: data.data.upstreams.length,
          change: "0%",
          color: "text-blue-400",
          badge: "bg-background text-blue-400",
        },
        {
          title: "Enabled Upstreams",
          value: enabledCount,
          change: "0%",
          color: "text-green-400",
          badge: "bg-background text-green-400",
        },
        {
          title: "Disabled Upstreams",
          value: disabledCount,
          change: "0%",
          color: "text-red-400",
          badge: "bg-background text-red-400",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUpstreams();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Upstreams</h1>
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
      <UpstreamTable
        data={upstreams}
        loading={loading}
        onRefresh={fetchUpstreams}
      />
    </div>
  );
};

export default UpstreamPage;
