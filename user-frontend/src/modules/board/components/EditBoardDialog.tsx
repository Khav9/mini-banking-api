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
import { Input } from "@/components/ui/input";
import { Pencil } from "lucide-react";
import { boardApi } from "../api/boardApi";
import { Board } from "../types/board";
import { toast } from "sonner";

interface EditBoardDialogProps {
  board: Board;
  onSuccess: () => void;
}

export function EditBoardDialog({ board, onSuccess }: EditBoardDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    id: board.id,
    names: {
      en: board.names.en,
      ko: board.names.ko,
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await boardApi.updateBoard(board.id, formData);
      toast.success("Board updated successfully");
      setOpen(false);
      onSuccess();
    } catch {
      toast.error("Failed to update board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Board</DialogTitle>
          <DialogDescription>Update board information.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="id"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ID
            </label>
            <Input
              id="id"
              type="number"
              value={formData.id}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  id: parseInt(e.target.value),
                }))
              }
              disabled
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="en"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              English Name
            </label>
            <Input
              id="en"
              value={formData.names.en}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  names: {
                    ...prev.names,
                    en: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="ko"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Korean Name
            </label>
            <Input
              id="ko"
              value={formData.names.ko}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  names: {
                    ...prev.names,
                    ko: e.target.value,
                  },
                }))
              }
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
