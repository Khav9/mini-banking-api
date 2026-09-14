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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Upstream } from "../types/upstream";
import { upstreamApi } from "../api/upstreamApi";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface UpstreamTableProps {
  data: Upstream[];
  loading: boolean;
  onRefresh: () => void;
}

export function UpstreamTable({
  data,
  loading,
  onRefresh,
}: UpstreamTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [search, setSearch] = React.useState("");
  const [updating, setUpdating] = React.useState<Record<number, boolean>>({});
  const [editingUpstream, setEditingUpstream] = React.useState<Upstream | null>(
    null
  );
  const [allowedIps, setAllowedIps] = React.useState("");

  // Memoize filtered data
  const filteredData = React.useMemo(() => {
    if (!search) return data;
    const searchLower = search.toLowerCase();
    return data.filter((upstream) =>
      upstream.name.toLowerCase().includes(searchLower)
    );
  }, [data, search]);

  const handleUpdateUpstream = async (upstreamId: number, enabled: boolean) => {
    try {
      setUpdating((prev) => ({ ...prev, [upstreamId]: true }));
      const upstream = data.find((u) => u.id === upstreamId);
      if (!upstream) return;

      await upstreamApi.updateUpstream(upstreamId, {
        apiKey: upstream.apiKey,
        apiSecret: upstream.apiSecret || "",
        allowedIp: upstream.allowedIp,
        enabled,
      });
      toast.success("Upstream updated successfully");
      onRefresh();
    } catch {
      toast.error("Failed to update upstream");
    } finally {
      setUpdating((prev) => ({ ...prev, [upstreamId]: false }));
    }
  };

  const handleEditUpstream = async () => {
    if (!editingUpstream) return;

    try {
      setUpdating((prev) => ({ ...prev, [editingUpstream.id]: true }));
      await upstreamApi.updateUpstream(editingUpstream.id, {
        apiKey: editingUpstream.apiKey,
        apiSecret: editingUpstream.apiSecret || "",
        allowedIp: allowedIps
          .split(",")
          .map((ip) => ip.trim())
          .filter(Boolean),
        enabled: editingUpstream.enabled,
      });
      toast.success("Upstream updated successfully");
      setEditingUpstream(null);
      onRefresh();
    } catch {
      toast.error("Failed to update upstream");
    } finally {
      setUpdating((prev) => ({ ...prev, [editingUpstream.id]: false }));
    }
  };

  const columns = React.useMemo<ColumnDef<Upstream>[]>(
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
        accessorKey: "name",
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => row.getValue("name"),
      },
      {
        accessorKey: "apiKey",
        header: "API Key",
        cell: ({ row }) => row.getValue("apiKey"),
      },
      {
        accessorKey: "allowedIp",
        header: "Allowed IP",
        cell: ({ row }) => {
          const ips = row.getValue("allowedIp") as string[];
          return ips.length > 0 ? ips.join(", ") : "-";
        },
      },
      {
        accessorKey: "enabled",
        header: "Status",
        cell: ({ row }) => {
          const upstream = row.original;
          const enabled = row.getValue("enabled") as boolean;
          return (
            <div className="flex items-center gap-2">
              <Switch
                checked={enabled}
                disabled={updating[upstream.id]}
                onCheckedChange={(checked) =>
                  handleUpdateUpstream(upstream.id, checked)
                }
              />
              <span
                className={`text-sm ${
                  enabled ? "text-green-500" : "text-red-500"
                }`}
              >
                {enabled ? "Enabled" : "Disabled"}
              </span>
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const upstream = row.original;
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => {
                    setEditingUpstream(upstream);
                    setAllowedIps(upstream.allowedIp.join(", "));
                  }}
                >
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    navigator.clipboard.writeText(String(upstream.id))
                  }
                >
                  Copy ID
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(upstream.name)}
                >
                  Copy Name
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(upstream.apiKey)}
                >
                  Copy API Key
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    try {
                      await upstreamApi.syncUpstream(upstream.id);
                      toast.success("Successfully synced upstream");
                      onRefresh();
                    } catch {
                      toast.error("Failed to sync upstream");
                    }
                  }}
                >
                  Sync Games & Providers
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ],
    [updating, onRefresh]
  );

  const table = useReactTable({
    data: filteredData,
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
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4 gap-2">
        <Input
          placeholder="Search upstream..."
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
                onClick={() => table.previousPage()}
                className={
                  !table.getCanPreviousPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                onClick={() => table.nextPage()}
                className={
                  !table.getCanNextPage()
                    ? "pointer-events-none opacity-50"
                    : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>

      <Dialog
        open={!!editingUpstream}
        onOpenChange={() => setEditingUpstream(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Upstream</DialogTitle>
          </DialogHeader>
          {editingUpstream && (
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <div>{editingUpstream.name}</div>
              </div>
              <div className="space-y-2">
                <Label>API Key</Label>
                <Input
                  value={editingUpstream.apiKey}
                  onChange={(e) =>
                    setEditingUpstream((prev) =>
                      prev ? { ...prev, apiKey: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>API Secret</Label>
                <Input
                  value={editingUpstream.apiSecret || ""}
                  onChange={(e) =>
                    setEditingUpstream((prev) =>
                      prev ? { ...prev, apiSecret: e.target.value } : null
                    )
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Allowed IPs (comma-separated)</Label>
                <Textarea
                  value={allowedIps}
                  onChange={(e) => setAllowedIps(e.target.value)}
                  placeholder="Enter IPs separated by commas"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Switch
                  checked={editingUpstream.enabled}
                  onCheckedChange={(checked) =>
                    setEditingUpstream((prev) =>
                      prev ? { ...prev, enabled: checked } : null
                    )
                  }
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingUpstream(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleEditUpstream}
              disabled={updating[editingUpstream?.id || 0]}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
