import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export function useBreadcrumb() {
  const location = useLocation();
  const { t } = useTranslation();

  const getBreadcrumbs = () => {
    const paths = location.pathname.split("/").filter(Boolean);

    return paths.map((path, index) => {
      const url = `/${paths.slice(0, index + 1).join("/")}`;
      const isLast = index === paths.length - 1;

      // Special cases for nested routes
      if (path === "transactions") {
        return {
          label: t("sidebar.transactions.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "users") {
        return {
          label: t("sidebar.users.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "tree-view") {
        return {
          label: t("sidebar.users.treeView"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "daily-monthly") {
        return {
          label: t("sidebar.statistics.daily-monthly"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "member") {
        return {
          label: t("sidebar.statistics.member"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "profit-loss-rank") {
        return {
          label: t("sidebar.statistics.profit-loss-rank"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "game") {
        return {
          label: t("sidebar.statistics.game"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "partner") {
        return {
          label: t("sidebar.statistics.partner"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "deposit-withdraw") {
        return {
          label: t("sidebar.statistics.deposit-withdraw"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "user-bet-profit-loss") {
        return {
          label: t("sidebar.statistics.user-bet-profit-loss"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "statistics") {
        return {
          label: t("sidebar.statistics.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "popup") {
        return {
          label: t("sidebar.popup.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "boards") {
        return {
          label: t("sidebar.boards.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "partners") {
        return {
          label: t("sidebar.partners.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "upstreams") {
        return {
          label: t("sidebar.upstreams.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "games") {
        return {
          label: t("sidebar.games.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "point-exchange-history") {
        return {
          label: t("sidebar.partners.settingsByPartner"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "messages") {
        return {
          label: t("sidebar.messages.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "providers") {
        return {
          label: t("sidebar.providers.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }
      if (path === "inquiries") {
        return {
          label: t("sidebar.inquiries.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }

      if (path === "settings") {
        return {
          label: t("sidebar.settings.title"),
          url: isLast ? undefined : url,
          isLast,
        };
      }
      // Map path to translation key
      const translationKey = `sidebar.${path}`;
      const label = t(translationKey);

      return {
        label,
        url: isLast ? undefined : url,
        isLast,
      };
    });
  };

  return {
    breadcrumbs: getBreadcrumbs(),
  };
}
