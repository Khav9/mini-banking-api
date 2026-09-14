import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { usersApi } from "../api/usersApi";
import { settingsApi } from "../../settings/api/settingsApi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";

interface AddUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function AddUserDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddUserDialogProps) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [isRootUser, setIsRootUser] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [banks, setBanks] = useState<string[]>([]);
  const [phoneCarriers, setPhoneCarriers] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    nickname: "",
    phone: "",
    phoneCarrier: "",
    gender: "MALE" as "MALE" | "FEMALE",
    bank: "",
    accountNumber: "",
    accountOwner: "",
    birth: "",
    recommendCode: "",
  });

  useEffect(() => {
    if (open) {
      fetchSettings();
    }
  }, [open]);

  const fetchSettings = async () => {
    try {
      const [bankResponse, phoneCarrierResponse] = await Promise.all([
        settingsApi.getBankList(),
        settingsApi.getPhoneCarrierList(),
      ]);
      setBanks(bankResponse.data.banks);
      setPhoneCarriers(phoneCarrierResponse.data.phoneCarriers);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!formData.username || !formData.password || !formData.nickname) {
      toast.error(t("sidebar.users.addUserModal.errorMessage"));
      return;
    }

    try {
      setLoading(true);
      const response = await usersApi.addUser({
        ...formData,
        recommendCode: isRootUser ? "" : formData.recommendCode,
      });

      if (response.success) {
        toast.success(t("sidebar.users.addUserModal.successMessage"));
        onSuccess();
        onOpenChange(false);
        // Reset form
        setFormData({
          username: "",
          password: "",
          nickname: "",
          phone: "",
          phoneCarrier: "",
          gender: "MALE" as "MALE" | "FEMALE",
          bank: "",
          accountNumber: "",
          accountOwner: "",
          birth: "",
          recommendCode: "",
        });
        setIsRootUser(false);
      } else {
        toast.error(
          response.message || t("sidebar.users.addUserModal.errorMessage")
        );
      }
    } catch (error: unknown) {
      console.error("Failed to add user:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("sidebar.users.addUserModal.errorMessage");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Add validation for required fields
  const isFormValid = () => {
    return (
      formData.username.trim() !== "" &&
      formData.password.trim() !== "" &&
      formData.nickname.trim() !== ""
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{t("sidebar.users.addUserModal.title")}</DialogTitle>
          <DialogDescription>
            {t("sidebar.users.addUserModal.description")}
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <div className="space-y-2">
            <Label>{t("sidebar.users.addUserModal.username")} *</Label>
            <Input
              value={formData.username}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, username: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.addUserModal.password")} *</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
                <span className="sr-only">
                  {showPassword ? "Hide password" : "Show password"}
                </span>
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.addUserModal.nickname")} *</Label>
            <Input
              value={formData.nickname}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, nickname: e.target.value }))
              }
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.phone")}</Label>
            <Input
              value={formData.phone}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.phoneCarrier")}</Label>
            <Select
              value={formData.phoneCarrier}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, phoneCarrier: value }))
              }
            >
              <SelectTrigger>
                <SelectValue
                  placeholder={t("sidebar.users.selectPhoneCarrier")}
                />
              </SelectTrigger>
              <SelectContent>
                {phoneCarriers.map((carrier) => (
                  <SelectItem key={carrier} value={carrier}>
                    {carrier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.gender.title")}</Label>
            <Select
              value={formData.gender}
              onValueChange={(value: "MALE" | "FEMALE") =>
                setFormData((prev) => ({ ...prev, gender: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("sidebar.users.selectGender")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">
                  {t("sidebar.users.gender.male")}
                </SelectItem>
                <SelectItem value="FEMALE">
                  {t("sidebar.users.gender.female")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.bank")}</Label>
            <Select
              value={formData.bank}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, bank: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("sidebar.users.selectBank")} />
              </SelectTrigger>
              <SelectContent>
                {banks.map((bank) => (
                  <SelectItem key={bank} value={bank}>
                    {bank}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.accountNumber")}</Label>
            <Input
              value={formData.accountNumber}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountNumber: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.accountOwner")}</Label>
            <Input
              value={formData.accountOwner}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  accountOwner: e.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.birth")}</Label>
            <Input
              value={formData.birth}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, birth: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>{t("sidebar.users.recommendCode")}</Label>
            <Input
              value={formData.recommendCode}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  recommendCode: e.target.value,
                }))
              }
              disabled={isRootUser}
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch checked={isRootUser} onCheckedChange={setIsRootUser} />
              <Label>{t("sidebar.users.createAsRoot")}</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            {t("sidebar.users.addUserModal.cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={loading || !isFormValid()}>
            {loading
              ? t("sidebar.users.addUserModal.saving")
              : t("sidebar.users.addUserModal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
