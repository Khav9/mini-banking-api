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

export const PhoneCarrierList = () => {
  const [carriers, setCarriers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCarriers = async () => {
    setLoading(true);
    try {
      const response = await settingsApi.getPhoneCarrierList();
      if (response.success) {
        setCarriers(response.data.phoneCarriers);
      } else {
        toast.error(response.message || "Failed to fetch phone carrier list");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch phone carrier list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarriers();
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
            <TableHead>Phone Carrier</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {carriers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={1} className="text-center py-8">
                No phone carriers found
              </TableCell>
            </TableRow>
          ) : (
            carriers.map((carrier, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{carrier}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
