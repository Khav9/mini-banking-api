import { useEffect, useState } from "react";
import { settingsApi } from "../api/settingsApi";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const BankList = () => {
  const [banks, setBanks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBanks = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getBankList();
      if (response.success) {
        setBanks(response.data.banks);
      } else {
        toast.error(response.message || "Failed to fetch bank list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch bank list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-8 w-full" />
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Bank Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {banks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={1} className="text-center py-8">
                No banks found
              </TableCell>
            </TableRow>
          ) : (
            banks.map((bank, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{bank}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
