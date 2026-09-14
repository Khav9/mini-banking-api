import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { t } from "i18next";
import { Minus, MoreHorizontal, Eye, EyeOff } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  EditUserRequest,
  UserDetailResponse,
  UserListResponse,
  usersApi,
} from "../api/usersApi";
import { settingsApi } from "../../settings/api/settingsApi";
import { AddUserDialog } from "./AddUserDialog";

interface UsersTableProps {
  data: UserListResponse["data"]["list"];
  loading: boolean;
  total: number;
  page: number;
  onPageChange: (page: number) => void;
  onRefresh: () => void;
  onStatusChange: (status: "APPROVED" | "PENDING" | "BLOCKED" | "ALL") => void;
  onSearch: (query: string) => void;
}

const badgeVariants = {
  APPROVED: "default",
  PENDING: "secondary",
  BLOCKED: "destructive",
} as const;

export const UsersTable = ({
  data,
  loading,
  total,
  page,
  onPageChange,
  onRefresh,
  onStatusChange,
  onSearch,
}: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<
    UserDetailResponse["data"] | null
  >(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showBalanceDialog, setShowBalanceDialog] = useState(false);
  const [balanceAdjustment, setBalanceAdjustment] = useState("");
  const [adjustingBalance, setAdjustingBalance] = useState(false);
  const [showPointDialog, setShowPointDialog] = useState(false);
  const [pointAdjustment, setPointAdjustment] = useState("");
  const [adjustingPoint, setAdjustingPoint] = useState(false);
  const [balanceUser, setBalanceUser] = useState<
    UserDetailResponse["data"] | null
  >(null);
  const [pointUser, setPointUser] = useState<UserDetailResponse["data"] | null>(
    null
  );
  const [editingUser, setEditingUser] = useState<EditUserRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [banks, setBanks] = useState<string[]>([]);
  const [phoneCarriers, setPhoneCarriers] = useState<string[]>([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
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
    fetchSettings();
  }, []);

  const handleViewDetail = async (username: string) => {
    try {
      setLoadingDetail(true);
      const response = await usersApi.getUserDetail(username);
      setSelectedUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user detail:", error);
      toast.error("Failed to load user details");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleAdjustBalance = async () => {
    if (!balanceUser || !balanceAdjustment) return;

    try {
      setAdjustingBalance(true);
      await usersApi.adjustBalance(
        balanceUser.username,
        Number(balanceAdjustment)
      );
      setShowBalanceDialog(false);
      setBalanceAdjustment("");
      setBalanceUser(null);
      onRefresh();
      toast.success("Balance adjusted successfully");
    } catch (error) {
      console.error("Failed to adjust balance:", error);
      toast.error("Failed to adjust balance");
    } finally {
      setAdjustingBalance(false);
    }
  };

  const handleAdjustPoint = async () => {
    if (!pointUser || !pointAdjustment) return;

    try {
      setAdjustingPoint(true);
      await usersApi.adjustPoint(pointUser.username, Number(pointAdjustment));
      setShowPointDialog(false);
      setPointAdjustment("");
      setPointUser(null);
      onRefresh();
      toast.success("Points adjusted successfully");
    } catch (error) {
      console.error("Failed to adjust points:", error);
      toast.error("Failed to adjust points");
    } finally {
      setAdjustingPoint(false);
    }
  };

  const handleEdit = () => {
    if (!selectedUser) return;
    setEditingUser({
      nickname: selectedUser.nickname,
      status: selectedUser.status,
      recommendEnabled: selectedUser.recommendEnabled,
      recommendCode: selectedUser.recommendCode,
      partnerPageEnabled: selectedUser.partnerPageEnabled,
      level: selectedUser.level,
      phone: selectedUser.phone,
      phoneCarrier: selectedUser.phoneCarrier,
      gender: selectedUser.gender,
      bank: selectedUser.bank,
      accountNumber: selectedUser.accountNumber,
      accountOwner: selectedUser.accountOwner,
      birth: selectedUser.birth,
      casinoRollingRatio: selectedUser.casinoRollingRatio,
      slotRollingRatio: selectedUser.slotRollingRatio,
      password: "",
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!selectedUser || !editingUser) return;

    try {
      setSaving(true);
      const response = await usersApi.editUser(
        selectedUser.username,
        editingUser
      );
      setSelectedUser(response.data);
      setIsEditing(false);
      setEditingUser(null);
      onRefresh();
      toast.success(t("sidebar.users.editSuccess"));
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error(t("sidebar.users.editError"));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditingUser(null);
  };

  const totalPages = Math.ceil(total / 30); // Assuming page size is 30

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder={t("sidebar.users.searchPlaceholder")}
          className="max-w-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
        <Select onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t("sidebar.users.status.title")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">{t("sidebar.users.status.all")}</SelectItem>
            <SelectItem value="APPROVED">
              {t("sidebar.users.status.approved")}
            </SelectItem>
            <SelectItem value="PENDING">
              {t("sidebar.users.status.pending")}
            </SelectItem>
            <SelectItem value="BLOCKED">
              {t("sidebar.users.status.blocked")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" onClick={onRefresh}>
          {t("sidebar.users.refresh")}
        </Button>
        <Button onClick={() => setShowAddDialog(true)}>
          {t("sidebar.users.addUser")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("sidebar.users.username")}</TableHead>
              <TableHead>{t("sidebar.users.nickname")}</TableHead>
              <TableHead>{t("sidebar.users.parent")}</TableHead>
              <TableHead>{t("sidebar.users.balance")}</TableHead>
              <TableHead>{t("sidebar.users.point")}</TableHead>
              <TableHead>{t("sidebar.users.statusTitle")}</TableHead>
              <TableHead>{t("sidebar.users.joinDate")}</TableHead>
              <TableHead>{t("sidebar.users.lastLogin")}</TableHead>
              <TableHead>{t("sidebar.users.action")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-[80px] ml-auto" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[100px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[30px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center py-8">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell
                    className="font-medium cursor-pointer"
                    onClick={() => handleViewDetail(user.username)}
                  >
                    {user.username}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() => handleViewDetail(user.username)}
                  >
                    {user.nickname}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={() =>
                      user.parentUsername &&
                      handleViewDetail(user.parentUsername)
                    }
                  >
                    {user.parentUsername || "-"}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        setLoadingDetail(true);
                        const response = await usersApi.getUserDetail(
                          user.username
                        );
                        setBalanceUser(response.data);
                        setShowBalanceDialog(true);
                      } catch (error) {
                        console.error("Failed to fetch user detail:", error);
                        toast.error("Failed to load user details");
                      } finally {
                        setLoadingDetail(false);
                      }
                    }}
                  >
                    {user.balance.toLocaleString()}
                  </TableCell>
                  <TableCell
                    className="cursor-pointer"
                    onClick={async () => {
                      try {
                        setLoadingDetail(true);
                        const response = await usersApi.getUserDetail(
                          user.username
                        );
                        setPointUser(response.data);
                        setShowPointDialog(true);
                      } catch (error) {
                        console.error("Failed to fetch user detail:", error);
                        toast.error("Failed to load user details");
                      } finally {
                        setLoadingDetail(false);
                      }
                    }}
                  >
                    {user.point.toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={badgeVariants[user.status]}
                      className="capitalize"
                    >
                      {t(`sidebar.users.status.${user.status.toLowerCase()}`)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {format(new Date(user.joinDate), "yyyy-MM-dd")}
                  </TableCell>
                  <TableCell>
                    {user.lastLoginDate
                      ? format(new Date(user.lastLoginDate), "yyyy-MM-dd")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetail(user.username)}
                        >
                          {t("sidebar.users.viewDetail")}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              setLoadingDetail(true);
                              const response = await usersApi.getUserDetail(
                                user.username
                              );
                              setBalanceUser(response.data);
                              setShowBalanceDialog(true);
                            } catch (error) {
                              console.error(
                                "Failed to fetch user detail:",
                                error
                              );
                              toast.error("Failed to load user details");
                            } finally {
                              setLoadingDetail(false);
                            }
                          }}
                        >
                          {t("sidebar.users.adjustBalance")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => {
                            try {
                              setLoadingDetail(true);
                              const response = await usersApi.getUserDetail(
                                user.username
                              );
                              setPointUser(response.data);
                              setShowPointDialog(true);
                            } catch (error) {
                              console.error(
                                "Failed to fetch user detail:",
                                error
                              );
                              toast.error("Failed to load user details");
                            } finally {
                              setLoadingDetail(false);
                            }
                          }}
                        >
                          {t("sidebar.users.adjustPoint")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {t("sidebar.users.users")} {data.length}/{total}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
          >
            {t("sidebar.users.previous")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            {t("sidebar.users.next")}
          </Button>
        </div>
      </div>

      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-center justify-between w-full">
              <DialogTitle>
                {t("sidebar.users.userDetailsModalTitle")} -{" "}
                {selectedUser?.username}
              </DialogTitle>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  {t("sidebar.users.edit")}
                </Button>
              )}
            </div>
          </DialogHeader>
          {loadingDetail ? (
            <div className="space-y-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex justify-between items-center">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              ))}
            </div>
          ) : selectedUser ? (
            <div className="grid grid-cols-2 gap-4">
              {isEditing ? (
                <>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.password")}</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={editingUser?.password}
                        onChange={(e) =>
                          setEditingUser((prev) =>
                            prev ? { ...prev, password: e.target.value } : null
                          )
                        }
                        placeholder={t("sidebar.users.passwordPlaceholder")}
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
                    <Label>{t("sidebar.users.nickname")}</Label>
                    <Input
                      value={editingUser?.nickname}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, nickname: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.statusTitle")}</Label>
                    <Select
                      value={editingUser?.status}
                      onValueChange={(
                        value: "APPROVED" | "PENDING" | "BLOCKED"
                      ) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, status: value } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue>
                          <Badge
                            variant={
                              badgeVariants[editingUser?.status || "PENDING"]
                            }
                            className="capitalize"
                          >
                            {t(
                              `sidebar.users.status.${editingUser?.status.toLowerCase()}`
                            )}
                          </Badge>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="APPROVED">
                          <Badge variant="default" className="capitalize">
                            {t("sidebar.users.status.approved")}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="PENDING">
                          <Badge variant="secondary" className="capitalize">
                            {t("sidebar.users.status.pending")}
                          </Badge>
                        </SelectItem>
                        <SelectItem value="BLOCKED">
                          <Badge variant="destructive" className="capitalize">
                            {t("sidebar.users.status.blocked")}
                          </Badge>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.level")}</Label>
                    <Input
                      type="number"
                      value={editingUser?.level}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? { ...prev, level: parseInt(e.target.value) }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.phone")}</Label>
                    <Input
                      value={editingUser?.phone}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, phone: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.phoneCarrier")}</Label>
                    <Select
                      value={editingUser?.phoneCarrier}
                      onValueChange={(value) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, phoneCarrier: value } : null
                        )
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
                      value={editingUser?.gender}
                      onValueChange={(value) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, gender: value } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("sidebar.users.selectGender")}
                        />
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
                    <Label>{t("sidebar.users.birth")}</Label>
                    <Input
                      value={editingUser?.birth}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, birth: e.target.value } : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.bank")}</Label>
                    <Select
                      value={editingUser?.bank}
                      onValueChange={(value) =>
                        setEditingUser((prev) =>
                          prev ? { ...prev, bank: value } : null
                        )
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("sidebar.users.selectBank")}
                        />
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
                      value={editingUser?.accountNumber}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? { ...prev, accountNumber: e.target.value }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.accountOwner")}</Label>
                    <Input
                      value={editingUser?.accountOwner}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? { ...prev, accountOwner: e.target.value }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.recommendCode")}</Label>
                    <Input
                      value={editingUser?.recommendCode}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? { ...prev, recommendCode: e.target.value }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.casinoRollingRatio")}</Label>
                    <Input
                      type="number"
                      value={editingUser?.casinoRollingRatio}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                casinoRollingRatio: parseFloat(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.slotRollingRatio")}</Label>
                    <Input
                      type="number"
                      value={editingUser?.slotRollingRatio}
                      onChange={(e) =>
                        setEditingUser((prev) =>
                          prev
                            ? {
                                ...prev,
                                slotRollingRatio: parseFloat(e.target.value),
                              }
                            : null
                        )
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingUser?.recommendEnabled}
                        onCheckedChange={(checked) =>
                          setEditingUser((prev) =>
                            prev ? { ...prev, recommendEnabled: checked } : null
                          )
                        }
                      />
                      <Label>{t("sidebar.users.recommendEnabled")}</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={editingUser?.partnerPageEnabled}
                        onCheckedChange={(checked) =>
                          setEditingUser((prev) =>
                            prev
                              ? { ...prev, partnerPageEnabled: checked }
                              : null
                          )
                        }
                      />
                      <Label>{t("sidebar.users.partnerEnabled")}</Label>
                    </div>
                  </div>
                  <div className="col-span-2 flex justify-end space-x-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      {t("sidebar.users.cancel")}
                    </Button>
                    <Button onClick={handleSave} disabled={saving}>
                      {saving
                        ? t("sidebar.users.saving")
                        : t("sidebar.users.save")}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.nickname")}</Label>
                    <div>{selectedUser.nickname}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.statusTitle")}</Label>
                    <div>
                      <Badge
                        variant={badgeVariants[selectedUser.status]}
                        className="capitalize"
                      >
                        {t(
                          `sidebar.users.status.${selectedUser.status.toLowerCase()}`
                        )}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.level")}</Label>
                    <div>{selectedUser.level}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.phone")}</Label>
                    <div>{selectedUser.phone}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.phoneCarrier")}</Label>
                    <div>{selectedUser.phoneCarrier}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.gender.title")}</Label>
                    <div>{selectedUser.gender}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.birth")}</Label>
                    <div>{selectedUser.birth}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.bank")}</Label>
                    <div>{selectedUser.bank}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.accountNumber")}</Label>
                    <div>{selectedUser.accountNumber}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.accountOwner")}</Label>
                    <div>{selectedUser.accountOwner}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.recommendCode")}</Label>
                    <div>{selectedUser.recommendCode}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.casinoRollingRatio")}</Label>
                    <div>{selectedUser.casinoRollingRatio}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.slotRollingRatio")}</Label>
                    <div>{selectedUser.slotRollingRatio}</div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.recommendEnabled")}</Label>
                    <div>
                      {selectedUser.recommendEnabled
                        ? t("sidebar.users.enabled")
                        : t("sidebar.users.disabled")}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>{t("sidebar.users.partnerEnabled")}</Label>
                    <div>
                      {selectedUser.partnerPageEnabled
                        ? t("sidebar.users.enabled")
                        : t("sidebar.users.disabled")}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      <Dialog
        open={showBalanceDialog}
        onOpenChange={(open) => {
          setShowBalanceDialog(open);
          if (!open) {
            setBalanceUser(null);
            setBalanceAdjustment("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("sidebar.users.adjustBalanceModal.title")}
            </DialogTitle>
            <DialogDescription>
              {balanceUser?.username} -{" "}
              {t("sidebar.users.adjustBalanceModal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="balance">
                {t("sidebar.users.adjustBalanceModal.amount")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="balance"
                  type="number"
                  value={balanceAdjustment}
                  onChange={(e) => setBalanceAdjustment(e.target.value)}
                  placeholder={t("sidebar.users.adjustBalanceModal.amount")}
                  disabled={adjustingBalance}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setBalanceAdjustment((prev) => String(-Number(prev)))
                  }
                  disabled={!balanceAdjustment || adjustingBalance}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("sidebar.users.adjustBalanceModal.minus")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBalanceDialog(false)}
              disabled={adjustingBalance}
            >
              {t("sidebar.users.adjustBalanceModal.cancel")}
            </Button>
            <Button
              onClick={handleAdjustBalance}
              disabled={!balanceAdjustment || adjustingBalance}
            >
              {adjustingBalance
                ? t("sidebar.users.adjustBalanceModal.adjusting")
                : t("sidebar.users.adjustBalanceModal.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showPointDialog}
        onOpenChange={(open) => {
          setShowPointDialog(open);
          if (!open) {
            setPointUser(null);
            setPointAdjustment("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {t("sidebar.users.adjustPointModal.title")}
            </DialogTitle>
            <DialogDescription>
              {pointUser?.username} -{" "}
              {t("sidebar.users.adjustPointModal.description")}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="point">
                {t("sidebar.users.adjustPointModal.amount")}
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="point"
                  type="number"
                  value={pointAdjustment}
                  onChange={(e) => setPointAdjustment(e.target.value)}
                  placeholder={t("sidebar.users.adjustPointModal.amount")}
                  disabled={adjustingPoint}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setPointAdjustment((prev) => String(-Number(prev)))
                  }
                  disabled={!pointAdjustment || adjustingPoint}
                >
                  <Minus className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                {t("sidebar.users.adjustPointModal.minus")}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowPointDialog(false)}
              disabled={adjustingPoint}
            >
              {t("sidebar.users.adjustPointModal.cancel")}
            </Button>
            <Button
              onClick={handleAdjustPoint}
              disabled={!pointAdjustment || adjustingPoint}
            >
              {adjustingPoint
                ? t("sidebar.users.adjustPointModal.adjusting")
                : t("sidebar.users.adjustPointModal.submit")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AddUserDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSuccess={onRefresh}
      />
    </div>
  );
};
