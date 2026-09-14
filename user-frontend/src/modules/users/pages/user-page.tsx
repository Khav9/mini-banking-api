import { useEffect, useState } from "react";
import { usersApi, UserListResponse } from "../api/usersApi";
import { UsersTable } from "../components/UsersTable";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

const UserPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<UserListResponse["data"]["list"]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<
    "APPROVED" | "PENDING" | "BLOCKED" | "ALL"
  >("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const stats = [
    {
      title: "totalUsers",
      value: 0,
      change: "0%",
      color: "text-blue-400",
      badge: "bg-background text-blue-400",
    },
    {
      title: "activeUsers",
      value: 0,
      change: "0%",
      color: "text-green-400",
      badge: "bg-background text-green-400",
    },
    {
      title: "pendingUsers",
      value: 0,
      change: "0%",
      color: "text-yellow-400",
      badge: "bg-background text-yellow-400",
    },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await usersApi.getUserList({
        page,
        status: status === "ALL" ? undefined : status,
        query: searchQuery || undefined,
      });
      setUsers(data.data.list);
      setTotal(data.data.total);
      // Update stats
      const approvedCount = data.data.list.filter(
        (u) => u.status === "APPROVED"
      ).length;
      const pendingCount = data.data.list.filter(
        (u) => u.status === "PENDING"
      ).length;
      stats[0].value = data.data.total;
      stats[1].value = approvedCount;
      stats[2].value = pendingCount;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, status, searchQuery]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">{t("sidebar.users.title")}</h1>
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
                  {t(`sidebar.users.${stat.title}`)}
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString()}
                </div>
                <div className={`text-sm ${stat.color}`}>
                  {stat.change} {t("sidebar.users.change")}
                </div>
              </div>
            ))}
      </div>
      <UsersTable
        data={users}
        loading={loading}
        total={total}
        page={page}
        onPageChange={setPage}
        onRefresh={fetchUsers}
        onStatusChange={setStatus}
        onSearch={setSearchQuery}
      />
    </div>
  );
};

export default UserPage;
