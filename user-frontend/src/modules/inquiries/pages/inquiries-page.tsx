import { useEffect, useState } from "react";
import { Ticket } from "../types/ticket";
import { Skeleton } from "@/components/ui/skeleton";
import { inquiriesApi } from "../api/inquiriesApi";
import { TicketsDataTable } from "../components/TicketsTable";

const stats = [
  {
    title: "Replied Tickets",
    value: 0,
    change: "0%",
    color: "text-blue-400",
    badge: "bg-background text-blue-400",
  },
  {
    title: "Pending Tickets",
    value: 0,
    change: "0%",
    color: "text-yellow-400",
    badge: "bg-background text-yellow-400",
  },
  {
    title: "Total Tickets",
    value: 0,
    change: "0%",
    color: "text-purple-400",
    badge: "bg-background text-purple-400",
  },
];

const InquiriesPage = () => {
  const [page, setPage] = useState(1);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const data = await inquiriesApi.getTickets(page);
      setTickets(data.data.tickets);
      setTotal(data.data.count);
      // Update stats
      const repliedCount = data.data.tickets.filter(
        (t: Ticket) => t.reply
      ).length;
      const pendingCount = data.data.tickets.filter(
        (t: Ticket) => !t.reply
      ).length;
      stats[0].value = repliedCount;
      stats[1].value = pendingCount;
      stats[2].value = data.data.count;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, [page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tickets</h1>
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
      <TicketsDataTable
        data={tickets}
        loading={loading}
        total={total}
        page={page}
        onPageChange={setPage}
        onRefresh={fetchTickets}
      />
    </div>
  );
};

export default InquiriesPage;
