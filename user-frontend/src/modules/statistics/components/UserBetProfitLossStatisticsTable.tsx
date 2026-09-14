import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslation } from "react-i18next";

interface UserBetProfitLossStats {
  username: string;
  nickname: string;
  gameType: string;
  totalBetAmount: number;
  totalWinAmount: number;
  betCount: number;
  winCount: number;
  rollingAmount: number;
  profitLossAmount: number;
  winRatePercentage: number;
}

interface UserBetProfitLossStatisticsTableProps {
  data: UserBetProfitLossStats[];
  loading: boolean;
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const UserBetProfitLossStatisticsTable = ({
  data,
  loading,
  total,
  page,
  pageSize = 20,
  onPageChange,
}: UserBetProfitLossStatisticsTableProps) => {
  const { t } = useTranslation();
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Username</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Game Type</TableHead>
              <TableHead className="text-right">Total Bet</TableHead>
              <TableHead className="text-right">Total Win</TableHead>
              <TableHead className="text-right">Bet Count</TableHead>
              <TableHead className="text-right">Win Count</TableHead>
              <TableHead className="text-right">Rolling</TableHead>
              <TableHead className="text-right">Profit/Loss</TableHead>
              <TableHead className="text-right">Win Rate (%)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 10 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  {t("common.noData")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((stat) => (
                <TableRow key={stat.username + stat.gameType}>
                  <TableCell>{stat.username}</TableCell>
                  <TableCell>{stat.nickname}</TableCell>
                  <TableCell>{stat.gameType}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalBetAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalWinAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.betCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.winCount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.rollingAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.profitLossAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.winRatePercentage.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("common.page")} {page}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            {t("common.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page * pageSize >= total}
          >
            {t("common.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};
