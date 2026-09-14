import { createBrowserRouter, Outlet, Navigate } from "react-router-dom";
import DashboardPage from "./modules/dashboard/pages/dashboard-page";
import LoginPage from "./modules/auth/pages/login-page";
import { PrivateRoute } from "./components/private-route";
import RootLayout from "./components/layouts/root-layout";
import { AuthProvider } from "./context/auth-context";
import SettingPage from "./modules/settings/pages/SettingPage";
import { PublicRoute } from "./components/public-route";
import MessagesPage from "./modules/messages/pages/messages-page";
import DepositPage from "./modules/transactions/pages/deposit-page";
import TransactionPage from "./modules/transactions/pages/transaction-page";
import WithdrawPage from "./modules/transactions/pages/withdraw-page";
import ProvidersPage from "./modules/providers/pages/providers-page";
import UpstreamPage from "./modules/upstream/pages/upstream-page";
import BoardPage from "./modules/board/pages/board-page";
import PointExchangeHistoryPage from "./modules/transactions/pages/point-exchange-history-page";
import PopupPage from "./modules/popup/pages/popup-page";
import UserTreePage from "./modules/users/pages/user-tree-page";
import UserPage from "./modules/users/pages/user-page";
import InquiriesPage from "./modules/inquiries/pages/inquiries-page";
import DailyMontlyPage from "./modules/statistics/pages/daily-montly-page";
import DepositWithdrawPage from "./modules/statistics/pages/deposit-withdraw-page";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <PrivateRoute />
      </AuthProvider>
    ),
    children: [
      {
        element: <RootLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: "dashboard",
            element: <DashboardPage />,
          },
          {
            path: "statistics",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <Navigate to="/statistics/daily-monthly" replace />,
              },
              {
                path: "daily-monthly",
                element: <DailyMontlyPage />,
              },
              {
                path: "deposit-withdraw",
                element: <DepositWithdrawPage />,
              },
            ],
          },
          {
            path: "popup",
            element: <PopupPage />,
          },
          {
            path: "boards",
            element: <BoardPage />,
          },
          {
            path: "upstreams",
            element: <UpstreamPage />,
          },
          {
            path: "messages",
            element: <MessagesPage />,
          },
          {
            path: "providers",
            element: <ProvidersPage />,
          },
          {
            path: "transactions",
            element: <Outlet />,
            children: [
              {
                index: true,
                element: <TransactionPage />,
              },
              {
                path: "deposit",
                element: <DepositPage />,
              },
              {
                path: "withdraw",
                element: <WithdrawPage />,
              },
              {
                path: "point-exchange-history",
                element: <PointExchangeHistoryPage />,
              },
            ],
          },
          {
            path: "inquiries",
            element: <InquiriesPage />,
          },
          {
            path: "settings",
            element: <SettingPage />,
          },
          {
            path: "users",
            element: <Outlet />,
            children: [
              { index: true, element: <UserPage /> },
              { path: "tree-view", element: <UserTreePage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: "login",
    element: (
      <AuthProvider>
        <PublicRoute />
      </AuthProvider>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "*",
    element: <div>Not Found</div>,
  },
]);
