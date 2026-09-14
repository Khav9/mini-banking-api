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
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Eye } from "lucide-react";
import { boardApi } from "../api/boardApi";
import { Board, Article } from "../types/board";
import { toast } from "sonner";

interface ArticleDetailDialogProps {
  board: Board;
  article: Article;
}

export function ArticleDetailDialog({
  board,
  article,
}: ArticleDetailDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [articleDetail, setArticleDetail] = React.useState<Article | null>(
    null
  );
  const [loading, setLoading] = React.useState(false);

  const fetchArticleDetail = async () => {
    setLoading(true);
    try {
      const data = await boardApi.getArticle(board.id, article.id);
      setArticleDetail(data.data.article);
    } catch {
      toast.error("Failed to fetch article details");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchArticleDetail();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Eye className="mr-2 h-4 w-4" />
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Article Details</DialogTitle>
          <DialogDescription>
            Viewing article from {board.names.en}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[400px]">
          {loading ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-48" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ) : articleDetail ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  ID
                </h3>
                <p className="text-sm">{articleDetail.id}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Subject
                </h3>
                <p className="text-sm">{articleDetail.subject}</p>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Content
                </h3>
                <p className="text-sm whitespace-pre-wrap">
                  {articleDetail.content}
                </p>
              </div>
            </div>
          ) : (
            <div className="h-24 text-center">
              Failed to load article details.
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
