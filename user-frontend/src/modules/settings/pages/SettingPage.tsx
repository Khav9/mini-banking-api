import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsIcon } from "lucide-react";
import { authApi } from "@/api/authApi";
import { toast } from "sonner";
import { BankList } from "../components/BankList";
import { PhoneCarrierList } from "../components/PhoneCarrierList";

const SettingPage = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await authApi.changePassword(oldPassword, newPassword);
      if (res.success) {
        toast.success("Password changed successfully!");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(res.message || "Failed to change password");
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Failed to change password");
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header className="space-y-4">
        <div className="flex items-center gap-2 text-2xl font-semibold">
          <SettingsIcon className="w-6 h-6" />
          <h1>Settings</h1>
        </div>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="bank">Bank</TabsTrigger>
            <TabsTrigger value="phone-carrier">Phone Carrier</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="general">
            <div>General</div>
          </TabsContent>
          <TabsContent value="security">
            <form
              className="space-y-4 my-2 max-w-md"
              onSubmit={handleChangePassword}
            >
              <div className="space-y-2">
                <Label>Old Password</Label>
                <Input
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>New Password</Label>
                <Input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Confirm Password</Label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Change Password"}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="bank">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Bank List</h2>
              </div>
              <BankList />
            </div>
          </TabsContent>
          <TabsContent value="phone-carrier">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Phone Carrier List</h2>
              </div>
              <PhoneCarrierList />
            </div>
          </TabsContent>
          <TabsContent value="preferences">
            <div>Preferences</div>
          </TabsContent>
          <TabsContent value="api">
            <div>API</div>
          </TabsContent>
          <TabsContent value="sessions">
            <div>Sessions</div>
          </TabsContent>
        </Tabs>
      </header>
    </div>
  );
};

export default SettingPage;
