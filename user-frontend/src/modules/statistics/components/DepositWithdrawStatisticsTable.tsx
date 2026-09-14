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

interface DepositWithdrawStats {
  transactionId: number;
  username: string;
  type: string;
  amount: number;
  status: string;
  requestedDate: string;
  processedDate: string;
  bankName: string;
  accountNumber: string;
}

interface DepositWithdrawStatisticsTableProps {
  data: DepositWithdrawStats[];
  loading: boolean;
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
}

export const DepositWithdrawStatisticsTable = ({
  data,
  loading,
  total,
  page,
  pageSize = 20,
  onPageChange,
}: DepositWithdrawStatisticsTableProps) => {
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
              <TableHead>ID</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Requested</TableHead>
              <TableHead>Processed</TableHead>
              <TableHead>Bank</TableHead>
              <TableHead>Account</TableHead>
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
                <TableRow key={stat.transactionId}>
                  <TableCell>{stat.transactionId}</TableCell>
                  <TableCell>{stat.username}</TableCell>
                  <TableCell>{stat.type}</TableCell>
                  <TableCell className="text-right">
                    {formatCurrency(stat.amount)}
                  </TableCell>
                  <TableCell>{stat.status}</TableCell>
                  <TableCell>
                    {stat.requestedDate
                      ? format(new Date(stat.requestedDate), "yyyy-MM-dd HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    {stat.processedDate
                      ? format(new Date(stat.processedDate), "yyyy-MM-dd HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>{stat.bankName}</TableCell>
                  <TableCell>{stat.accountNumber}</TableCell>
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
