import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { inquiriesApi } from "../api/inquiriesApi";
import { toast } from "sonner";

interface ReplyDialogProps {
  ticketId: number;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ReplyDialog({
  ticketId,
  isOpen,
  onClose,
  onSuccess,
}: ReplyDialogProps) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setLoading(true);
    try {
      await inquiriesApi.replyTicket(ticketId, content);
      toast.success("Reply sent successfully");
      onSuccess();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send reply");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reply to Ticket #{ticketId}</DialogTitle>
          <DialogDescription>
            Enter your reply message below. This will be sent to the user.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Type your reply here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : "Send Reply"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
