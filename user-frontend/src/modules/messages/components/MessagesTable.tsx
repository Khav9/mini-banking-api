// messages table

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Message } from "../types/message";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useState } from "react";

interface MessagesTableProps {
  data: Message[];
  loading: boolean;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onSearch: (query: string) => void;
}

export const MessagesTable = ({
  data,
  loading,
  total,
  page,
  onPageChange,
  onRefresh,
  onSearch,
}: MessagesTableProps) => {
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);

  const totalPages = Math.ceil(total / 10); // Assuming page size is 10

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by username or nickname..."
          className="max-w-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Button variant="outline" onClick={onRefresh}>
          Refresh
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Content</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Nickname</TableHead>
              <TableHead>Sent At</TableHead>
              <TableHead>Read At</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[200px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[30px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No messages found
                </TableCell>
              </TableRow>
            ) : (
              data.map((message) => (
                <TableRow key={message.id}>
                  <TableCell className="font-medium">{message.title}</TableCell>
                  <TableCell className="max-w-[200px] truncate">
                    {message.content}
                  </TableCell>
                  <TableCell>{message.username}</TableCell>
                  <TableCell>{message.nickname}</TableCell>
                  <TableCell>
                    {format(new Date(message.sentAt), "MMM d, yyyy HH:mm")}
                  </TableCell>
                  <TableCell>
                    {message.readAt
                      ? format(new Date(message.readAt), "MMM d, yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={message.readAt ? "default" : "secondary"}
                      className="capitalize"
                    >
                      {message.readAt ? "Read" : "Unread"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedMessage(message)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data.length} of {total} messages
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            Next
          </Button>
        </div>
      </div>

      <Dialog
        open={!!selectedMessage}
        onOpenChange={() => setSelectedMessage(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedMessage?.title}</DialogTitle>
            <DialogDescription>Message details</DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Content</div>
                <div className="whitespace-pre-wrap">
                  {selectedMessage.content}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Username</div>
                  <div>{selectedMessage.username}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Nickname</div>
                  <div>{selectedMessage.nickname}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Sent At</div>
                  <div>
                    {format(
                      new Date(selectedMessage.sentAt),
                      "MMM d, yyyy HH:mm"
                    )}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Read At</div>
                  <div>
                    {selectedMessage.readAt
                      ? format(
                          new Date(selectedMessage.readAt),
                          "MMM d, yyyy HH:mm"
                        )
                      : "-"}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Status</div>
                  <Badge
                    variant={selectedMessage.readAt ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {selectedMessage.readAt ? "Read" : "Unread"}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">
                    Sent To All
                  </div>
                  <div>{selectedMessage.isSentToAll ? "Yes" : "No"}</div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
