import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";
import { Deposit } from "../types/deposit";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { transactionsApi } from "../api/transactionsApi";
import { DepositStatus } from "../types/deposit";

interface DepositsDataTableProps {
  data: Deposit[];
  loading: boolean;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
}

export function DepositsDataTable({
  data,
  loading,
  total,
  page,
  onPageChange,
  onRefresh,
}: DepositsDataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [search, setSearch] = React.useState("");

  const handleStatusChange = React.useCallback(
    async (id: number, status: DepositStatus) => {
      try {
        await transactionsApi.changeTransactionStatus(id, status);
        toast.success("Status updated successfully");
        onRefresh();
      } catch (error) {
        console.error(error);
        toast.error("Failed to update status");
      }
    },
    [onRefresh]
  );

  const columns = React.useMemo<ColumnDef<Deposit>[]>(
    () => [
      {
        accessorKey: "id",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.getValue("id"),
      },
      {
        accessorKey: "username",
        header: "Username",
        cell: ({ row }) => row.getValue("username"),
      },
      {
        accessorKey: "nickname",
        header: "Nickname",
        cell: ({ row }) => row.getValue("nickname"),
      },
      {
        accessorKey: "beforeAmount",
        header: "Amount",
        cell: ({ row }) => {
          const amount = parseFloat(row.getValue("beforeAmount"));
          return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(amount);
        },
      },
      {
        accessorKey: "requestedAt",
        header: "Requested At",
        cell: ({ row }) => (
          <span>{new Date(row.getValue("requestedAt")).toLocaleString()}</span>
        ),
      },
      {
        accessorKey: "approvedAt",
        header: "Approved At",
        cell: ({ row }) => {
          const approvedAt = row.getValue("approvedAt");
          return approvedAt ? (
            <span>{new Date(approvedAt as string).toLocaleString()}</span>
          ) : (
            <span className="text-muted-foreground">-</span>
          );
        },
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          return (
            <Badge
              className={`${
                status === "ACCEPTED"
                  ? "text-white"
                  : status === "PENDING"
                  ? "text-white"
                  : "text-white"
              }`}
              variant={
                status === "ACCEPTED"
                  ? "default"
                  : status === "PENDING"
                  ? "secondary"
                  : "destructive"
              }
            >
              {status}
            </Badge>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const deposit = row.original;
          return (
            <div className="flex items-center gap-2">
              {deposit.status === "PENDING" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(deposit.id, "WAITING")}
                    className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 hover:text-blue-500"
                  >
                    Queue
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(deposit.id, "REJECTED")}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                  >
                    Reject
                  </Button>
                </>
              )}
              {deposit.status === "WAITING" && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(deposit.id, "ACCEPTED")}
                    className="bg-green-500/10 text-green-500 hover:bg-green-500/20 hover:text-green-500"
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleStatusChange(deposit.id, "REJECTED")}
                    className="bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-500"
                  >
                    Reject
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [handleStatusChange]
  );

  const table = useReactTable({
    data: data.filter(
      (d) =>
        d.username.toLowerCase().includes(search.toLowerCase()) ||
        d.nickname.toLowerCase().includes(search.toLowerCase())
    ),
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualPagination: true,
    pageCount: Math.ceil(total / 10),
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search username or nickname..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 8 }).map((_, i) => (
                <TableRow key={i}>
                  {columns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full rounded" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="cursor-pointer"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end mt-4 w-full">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                onClick={() => onPageChange(page - 1)}
                className={page <= 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>
            {Array.from({ length: Math.ceil(total / 10) }, (_, i) => i + 1).map(
              (pageNum) => (
                <PaginationItem key={pageNum}>
                  <PaginationLink
                    href="#"
                    onClick={() => onPageChange(pageNum)}
                    isActive={pageNum === page}
                  >
                    {pageNum}
                  </PaginationLink>
                </PaginationItem>
              )
            )}
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => onPageChange(page + 1)}
                className={
                  page >= Math.ceil(total / 10)
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
