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

interface PartnerStats {
  partnerUsername: string;
  partnerNickname: string;
  totalMembers: number;
  activeMembers: number;
  totalBetAmount: number;
  totalWinAmount: number;
  rollingAmount: number;
  commissionAmount: number;
  profitAmount: number;
}

interface PartnerStatisticsTableProps {
  data: PartnerStats[];
  loading: boolean;
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const PartnerStatisticsTable = ({
  data,
  loading,
  total,
  page,
  pageSize = 20,
  onPageChange,
}: PartnerStatisticsTableProps) => {
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
              <TableHead className="text-right">Total Members</TableHead>
              <TableHead className="text-right">Active Members</TableHead>
              <TableHead className="text-right">Total Bet</TableHead>
              <TableHead className="text-right">Total Win</TableHead>
              <TableHead className="text-right">Rolling</TableHead>
              <TableHead className="text-right">Commission</TableHead>
              <TableHead className="text-right">Profit</TableHead>
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
                <TableRow key={stat.partnerUsername}>
                  <TableCell>{stat.partnerUsername}</TableCell>
                  <TableCell>{stat.partnerNickname}</TableCell>
                  <TableCell className="text-right">
                    {stat.totalMembers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {stat.activeMembers.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalBetAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.totalWinAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.rollingAmount)}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.commissionAmount)}
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
