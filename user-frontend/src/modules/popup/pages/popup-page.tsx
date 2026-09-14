import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { popupApi } from "../api/popupApi";
import { useTranslation } from "react-i18next";
import { CreatePopupDialog } from "../components/CreatePopupDialog";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

const PopupPage = () => {
  const { t } = useTranslation();

  const { data: popups, isLoading } = useQuery({
    queryKey: ["popups"],
    queryFn: () => popupApi.getAllPopups(),
  });

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("sidebar.popup.title")}</CardTitle>
          <CreatePopupDialog />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div>{t("common.loading")}</div>
          ) : (
            <div className="grid gap-4">
              {popups?.data.popups && popups.data.popups.length > 0 ? (
                popups.data.popups.map((popup) => (
                  <Card key={popup.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant={popup.visible ? "default" : "secondary"}
                            >
                              {popup.visible
                                ? t("popup.visible")
                                : t("popup.hidden")}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {format(new Date(popup.created), "PPpp")}
                            </span>
                          </div>
                          {popup.imageUrl && (
                            <img
                              src={popup.imageUrl}
                              alt="Popup"
                              className="mt-2 max-w-xs rounded-lg"
                            />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center text-gray-500">
                  {t("sidebar.popup.noPopups")}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PopupPage;
