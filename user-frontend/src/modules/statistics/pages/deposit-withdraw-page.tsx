import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/statsApi";
import { DepositWithdrawStatisticsTable } from "../components/DepositWithdrawStatisticsTable";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const DepositWithdrawPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [type, setType] = useState<"deposit" | "withdraw" | "all">("all");
  const [status, setStatus] = useState<
    "approved" | "pending" | "waiting" | "rejected" | "all"
  >("all");
  const [username, setUsername] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: [
      "deposit-withdraw-stats",
      page,
      startDate,
      endDate,
      type,
      status,
      username,
    ],
    queryFn: () =>
      statsApi.getDepositWithdrawStats({
        page,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        type,
        status,
        username: username || undefined,
      }),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t("sidebar.statistics.depositWithdraw")}
      </h1>
      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search username"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setPage(1);
          }}
          className="w-[200px]"
        />
        <Input
          type="date"
          value={startDate}
          onChange={(e) => {
            setStartDate(e.target.value);
            setPage(1);
          }}
          className="w-[180px]"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => {
            setEndDate(e.target.value);
            setPage(1);
          }}
          className="w-[180px]"
        />
        <select
          value={type}
          onChange={(e) => {
            setType(e.target.value as "deposit" | "withdraw" | "all");
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdraw">Withdraw</option>
        </select>
        <select
          value={status}
          onChange={(e) => {
            setStatus(
              e.target.value as
                | "approved"
                | "pending"
                | "waiting"
                | "rejected"
                | "all"
            );
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Status</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="waiting">Waiting</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
      <DepositWithdrawStatisticsTable
        data={data?.list || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        onPageChange={setPage}
      />
      <div className="mt-4 flex gap-8">
        <div>
          <span className="font-semibold">
            {t("dashboard.stats.totalDepositAmount")}:
          </span>{" "}
          {data ? data.totalDepositAmount.toLocaleString() : 0}
        </div>
        <div>
          <span className="font-semibold">
            {t("dashboard.stats.totalWithdrawAmount")}:
          </span>{" "}
          {data ? data.totalWithdrawAmount.toLocaleString() : 0}
        </div>
      </div>
    </div>
  );
};

export default DepositWithdrawPage;
