import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { messagesApi } from "../api/messagesApi";
import { toast } from "sonner";

interface WriteMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const WriteMessageDialog = ({
  open,
  onOpenChange,
  onSuccess,
}: WriteMessageDialogProps) => {
  const [loading, setLoading] = useState(false);
  const [sendToAll, setSendToAll] = useState(true);
  const [receiver, setReceiver] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await messagesApi.writeMessage({
        sendToAll,
        receiver: sendToAll ? undefined : receiver,
        title,
        content,
      });

      toast.success("Message sent successfully");

      // Reset form
      setSendToAll(true);
      setReceiver("");
      setTitle("");
      setContent("");
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Write Message</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="send-to-all"
              checked={sendToAll}
              onCheckedChange={setSendToAll}
            />
            <Label htmlFor="send-to-all">Send to all users</Label>
          </div>

          {!sendToAll && (
            <div className="space-y-2">
              <Label htmlFor="receiver">Receiver Username</Label>
              <Input
                id="receiver"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                placeholder="Enter username"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter message title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter message content"
              required
              rows={5}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Message"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
