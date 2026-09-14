import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { statsApi } from "../api/statsApi";
import { PLRTable } from "../components/PLRTable";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";

const PLRPage = () => {
  const { t } = useTranslation();
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [gameType, setGameType] = useState<
    "casino" | "slot" | "minigame" | "all"
  >("all");
  const [rankType, setRankType] = useState<"profit" | "loss">("profit");

  const { data, isLoading } = useQuery({
    queryKey: ["plr", page, startDate, endDate, gameType, rankType],
    queryFn: () =>
      statsApi.getProfitLossRank({
        page,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        gameType,
        rankType,
      }),
  });

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t("sidebar.statistics.bettingRank")}
      </h1>
      <div className="flex gap-4 mb-4">
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
          value={gameType}
          onChange={(e) => {
            setGameType(
              e.target.value as "casino" | "slot" | "minigame" | "all"
            );
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="all">All Games</option>
          <option value="casino">Casino</option>
          <option value="slot">Slot</option>
          <option value="minigame">Minigame</option>
        </select>
        <select
          value={rankType}
          onChange={(e) => {
            setRankType(e.target.value as "profit" | "loss");
            setPage(1);
          }}
          className="border rounded px-2 py-1"
        >
          <option value="profit">Profit</option>
          <option value="loss">Loss</option>
        </select>
      </div>
      <PLRTable
        data={data?.list || []}
        loading={isLoading}
        total={data?.total || 0}
        page={page}
        onPageChange={setPage}
      />
    </div>
  );
};

export default PLRPage;
