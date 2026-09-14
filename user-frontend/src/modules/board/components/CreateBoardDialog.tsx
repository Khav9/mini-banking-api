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
import { Plus } from "lucide-react";
import { boardApi } from "../api/boardApi";
import { toast } from "sonner";

interface CreateBoardDialogProps {
  onSuccess: () => void;
}

export function CreateBoardDialog({ onSuccess }: CreateBoardDialogProps) {
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [id, setId] = React.useState("");
  const [enName, setEnName] = React.useState("");
  const [koName, setKoName] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !enName || !koName) return;

    setLoading(true);
    try {
      await boardApi.createBoard({
        id: parseInt(id),
        names: {
          en: enName,
          ko: koName,
        },
      });
      toast.success("Board created successfully");
      setOpen(false);
      onSuccess();
      // Reset form
      setId("");
      setEnName("");
      setKoName("");
    } catch {
      toast.error("Failed to create board");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Board
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Board</DialogTitle>
          <DialogDescription>
            Add a new board to the system. Fill in the details below.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="id">ID</Label>
              <Input
                id="id"
                type="number"
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="Enter board ID"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="enName">English Name</Label>
              <Input
                id="enName"
                value={enName}
                onChange={(e) => setEnName(e.target.value)}
                placeholder="Enter English name"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="koName">Korean Name</Label>
              <Input
                id="koName"
                value={koName}
                onChange={(e) => setKoName(e.target.value)}
                placeholder="Enter Korean name"
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
