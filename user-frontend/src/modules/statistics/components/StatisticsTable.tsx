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
import { format } from "date-fns";

interface Statistic {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalBetAmount: number;
  totalWinAmount: number;
  totalDepositAmount: number;
  totalWithdrawAmount: number;
  rollingAmount: number;
  profitAmount: number;
}

interface StatisticsTableProps {
  data: Statistic[];
  loading: boolean;
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const StatisticsTable = ({
  data,
  loading,
  total,
  page,
  pageSize = 20,
  onPageChange,
}: StatisticsTableProps) => {
  const { t } = useTranslation();
  const totalPages = Math.ceil(total / pageSize);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KRW",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("dashboard.stats.date")}</TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.newUsers")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.activeUsers")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.totalBetAmount")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.totalWinAmount")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.totalDepositAmount")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.totalWithdrawAmount")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.rollingAmount")}
              </TableHead>
              <TableHead className="text-right">
                {t("dashboard.stats.profitAmount")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 9 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-8">
                  {t("common.noData")}
                </TableCell>
              </TableRow>
            ) : (
              data.map((stat) => (
                <TableRow key={stat.date}>
                  <TableCell className="font-medium">
                    {format(new Date(stat.date), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.newUsers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.activeUsers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalBetAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalWinAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalDepositAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalWithdrawAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.rollingAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.profitAmount)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("common.page")} {page} {t("common.of")} {totalPages}
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
            disabled={page >= totalPages}
          >
            {t("common.next")}
          </Button>
        </div>
      </div>
    </div>
  );
};
