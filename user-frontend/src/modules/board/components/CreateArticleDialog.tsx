import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { boardApi } from "../api/boardApi";
import { toast } from "sonner";
import { Board } from "../types/board";

interface CreateArticleDialogProps {
  board: Board;
  onSuccess: () => void;
}

export function CreateArticleDialog({
  board,
  onSuccess,
}: CreateArticleDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [id, setId] = React.useState("");
  const [subject, setSubject] = React.useState("");
  const [content, setContent] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !subject || !content) return;

    setLoading(true);
    try {
      await boardApi.createArticle(board.id, {
        id: parseInt(id),
        subject,
        content,
      });
      toast.success("Article created successfully");
      setOpen(false);
      onSuccess();
      // Reset form
      setId("");
      setSubject("");
      setContent("");
    } catch {
      toast.error("Failed to create article");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="mr-2 h-4 w-4" />
          Write Article
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Write Article</DialogTitle>
          <DialogDescription>
            Write a new article for {board.names.en} board.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">Article ID</Label>
              <Input
                id="id"
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter article ID"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter article subject"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter article content"
                className="min-h-[200px]"
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
