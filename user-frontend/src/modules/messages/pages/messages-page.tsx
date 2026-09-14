import { useEffect, useState } from "react";
import { messagesApi } from "../api/messagesApi";
import { Message } from "../types/message";
import { MessagesTable } from "../components/MessagesTable";
import { WriteMessageDialog } from "../components/WriteMessageDialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const stats = [
  {
    title: "Read Messages",
    value: 0,
    change: "0%",
    color: "text-blue-400",
    badge: "bg-background text-blue-400",
  },
  {
    title: "Unread Messages",
    value: 0,
    change: "0%",
    color: "text-yellow-400",
    badge: "bg-background text-yellow-400",
  },
  {
    title: "Total Messages",
    value: 0,
    change: "0%",
    color: "text-purple-400",
    badge: "bg-background text-purple-400",
  },
];

const MessagesPage = () => {
  const [page, setPage] = useState(1);
  const [messages, setMessages] = useState<Message[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [writeDialogOpen, setWriteDialogOpen] = useState(false);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = await messagesApi.getMessages({
        page,
        ...(searchQuery && { username: searchQuery }),
      });
      setMessages(data.data.messages);
      setTotal(data.data.total);

      // Update stats
      const readCount = data.data.messages.filter((m) => m.readAt).length;
      const unreadCount = data.data.messages.filter((m) => !m.readAt).length;
      stats[0].value = readCount;
      stats[1].value = unreadCount;
      stats[2].value = data.data.total;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, searchQuery]);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Messages</h1>
        <Button onClick={() => setWriteDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Write Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {loading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl bg-background p-6 flex flex-col gap-2 border"
              >
                <Skeleton className="h-4 w-1/2 mb-2" />
                <Skeleton className="h-8 w-1/3 mb-2" />
                <Skeleton className="h-6 w-1/4" />
              </div>
            ))
          : stats.map((stat) => (
              <div
                key={stat.title}
                className="rounded-xl bg-background p-6 flex flex-col gap-2 border"
              >
                <div className="text-muted-foreground text-sm">
                  {stat.title}
                </div>
                <div className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.color}`}>
                  {stat.change} from last period
                </div>
              </div>
            ))}
      </div>

      <MessagesTable
        data={messages}
        loading={loading}
        total={total}
        page={page}
        onPageChange={setPage}
        onRefresh={fetchMessages}
        onSearch={setSearchQuery}
      />

      <WriteMessageDialog
        open={writeDialogOpen}
        onOpenChange={setWriteDialogOpen}
        onSuccess={fetchMessages}
      />
    </div>
  );
};

export default MessagesPage;
