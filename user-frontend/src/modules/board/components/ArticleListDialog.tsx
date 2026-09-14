import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileText } from "lucide-react";
import { boardApi } from "../api/boardApi";
import { Board, Article } from "../types/board";
import { toast } from "sonner";
import { EditArticleDialog } from "./EditArticleDialog";
import { DeleteArticleDialog } from "./DeleteArticleDialog";
import { ArticleDetailDialog } from "./ArticleDetailDialog";

interface ArticleListDialogProps {
  board: Board;
}

export function ArticleListDialog({ board }: ArticleListDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [articles, setArticles] = React.useState<Article[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const data = await boardApi.getArticles(board.id);
      setArticles(data.data.articles);
    } catch {
      toast.error("Failed to fetch articles");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchArticles();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="mr-2 h-4 w-4" />
          View Articles
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Articles - {board.names.en}</DialogTitle>
          <DialogDescription>List of articles in this board.</DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-48" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-64" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  </TableRow>
                ))
              ) : articles.length > 0 ? (
                articles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>{article.id}</TableCell>
                    <TableCell>{article.subject}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {article.content}
                    </TableCell>
                    <TableCell>
                      <ArticleDetailDialog board={board} article={article} />
                    </TableCell>
                    <TableCell className="space-x-2">
                      <EditArticleDialog
                        board={board}
                        article={article}
                        onSuccess={fetchArticles}
                      />
                      <DeleteArticleDialog
                        board={board}
                        article={article}
                        onSuccess={fetchArticles}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-24 text-center">
                    No articles found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
