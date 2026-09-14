import { useEffect, useState } from "react";
import { transactionsApi } from "../api/transactionsApi";
import { Deposit } from "../types/deposit";
import { DepositsDataTable } from "../components/DepositsTable";
import { Skeleton } from "@/components/ui/skeleton";

const stats = [
  {
    title: "Total Deposits",
    value: 0,
    change: "0%",
    color: "text-blue-400",
    badge: "bg-background text-blue-400",
  },
  {
    title: "Pending Deposits",
    value: 0,
    change: "0%",
    color: "text-yellow-400",
    badge: "bg-background text-yellow-400",
  },
  {
    title: "Accepted Deposits",
    value: 0,
    change: "0%",
    color: "text-green-400",
    badge: "bg-background text-green-400",
  },
];

const DepositPage = () => {
  const [page, setPage] = useState(1);
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const data = await transactionsApi.getDeposits(page);
      setDeposits(data.data.transactions);
      setTotal(data.data.count);
      // Update stats
      const pendingCount = data.data.transactions.filter(
        (d) => d.status === "PENDING"
      ).length;
      const acceptedCount = data.data.transactions.filter(
        (d) => d.status === "ACCEPTED"
      ).length;
      stats[0].value = data.data.count;
      stats[1].value = pendingCount;
      stats[2].value = acceptedCount;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeposits();
  }, [page]);

  return (
    <>
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
      <DepositsDataTable
        data={deposits}
        loading={loading}
        total={total}
        page={page}
        onPageChange={setPage}
        onRefresh={fetchDeposits}
      />
    </>
  );
};

export default DepositPage;
