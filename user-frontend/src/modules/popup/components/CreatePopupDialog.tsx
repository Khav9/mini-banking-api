import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { popupApi } from "../api/popupApi";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

export const CreatePopupDialog = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [imageError, setImageError] = useState<string>("");
  const [visible, setVisible] = useState(false);

  const createPopupMutation = useMutation({
    mutationFn: popupApi.createPopup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["popups"] });
      toast.success(t("popup.createSuccessMessage"));
      setImage(null);
      setImageError("");
      setVisible(false);
      setOpen(false);
    },
    onError: (error) => {
      toast.error(error.message || t("popup.createErrorMessage"));
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageError("");

    if (!image) {
      setImageError(t("popup.imageRequired"));
      return;
    }

    createPopupMutation.mutate({
      visible,
      image,
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImageError("");
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        setImageError(t("popup.invalidImageType"));
        setImage(null);
        return;
      }

      // Validate file size (e.g., max 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        setImageError(t("popup.imageTooLarge"));
        setImage(null);
        return;
      }

      setImage(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{t("sidebar.popup.create")}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("sidebar.popup.create")}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex items-center space-x-2">
            <Switch
              id="visible"
              checked={visible}
              onCheckedChange={setVisible}
            />
            <Label htmlFor="visible">{t("sidebar.popup.visible")}</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">{t("sidebar.popup.image")}</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={imageError ? "border-red-500" : ""}
            />
            {imageError && <p className="text-sm text-red-500">{imageError}</p>}
          </div>

          <Button
            type="submit"
            disabled={createPopupMutation.isPending || !!imageError}
          >
            {createPopupMutation.isPending
              ? t("common.loading")
              : t("sidebar.popup.create")}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};
