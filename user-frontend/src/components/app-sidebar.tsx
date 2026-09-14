import * as React from "react";
import { Link } from "react-router-dom";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Logo from "@/assets/images/logo.svg";
import DashboardIcon from "@/assets/icons/dashboard.svg";
import StatisticsIcon from "@/assets/icons/statistics.svg";
import TransactionIcon from "@/assets/icons/transaction.svg";
import InquiriesIcon from "@/assets/icons/inquiries.svg";
import SettingsIcon from "@/assets/icons/settings.svg";
import MessagesIcon from "@/assets/icons/message.svg";
import UpstreamsIcon from "@/assets/icons/upstream.png";
import BoardsIcon from "@/assets/icons/board.png";
import PopupIcon from "@/assets/icons/popup.png";
import ProvidersIcon from "@/assets/icons/provider.png";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "sidebar.dashboard",
      url: "/dashboard",
      icon: DashboardIcon,
      isActive: false,
    },
    {
      title: "sidebar.statistics.title",
      url: "/statistics",
      icon: StatisticsIcon,
      isActive: false,
      items: [
        { title: "sidebar.statistics.daily", url: "/statistics/daily-monthly" },
        { title: "sidebar.statistics.byMember", url: "/statistics/member" },
        { title: "sidebar.statistics.depositWithdraw", url: "/statistics/deposit-withdraw",},
      ],
    },
    {
      title: "sidebar.users.title",
      url: "/users",
      icon: UpstreamsIcon,
      items: [
        {
          title: "sidebar.users.list",
          url: "/users",
        },
        {
          title: "sidebar.users.treeView",
          url: "/users/tree-view",
        },
      ],
    },
    {
      title: "sidebar.transactions.title",
      url: "/transactions",
      icon: TransactionIcon,
      items: [
        {
          title: "sidebar.transactions.depositList",
          url: "/transactions/deposit",
        },
        {
          title: "sidebar.transactions.withdrawalList",
          url: "/transactions/withdraw",
        },
        {
          title: "sidebar.transactions.lossPointExchange",
          url: "#",
        },
        {
          title: "sidebar.transactions.pointExchangeHistory",
          url: "/transactions/point-exchange-history",
        },
      ],
    },
    {
      title: "sidebar.inquiries.title",
      url: "/inquiries",
      icon: InquiriesIcon,
    },
    {
      title: "sidebar.boards.title",
      url: "/boards",
      icon: BoardsIcon,
    },
    {
      title: "sidebar.messages.title",
      url: "/messages",
      icon: MessagesIcon,
    },
    {
      title: "sidebar.settings.title",
      url: "/settings",
      icon: SettingsIcon,
      items: [
        {
          title: "sidebar.upstreams.title",
          url: "/upstreams",
          icon: UpstreamsIcon,
        },
        {
          title: "sidebar.providers.title",
          url: "/providers",
          icon: ProvidersIcon,
        },
        {
          title: "sidebar.popup.title",
          url: "/popup",
          icon: PopupIcon,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <img src={Logo} alt="Logo" className="w-10 h-10" />
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Mini Banking</span>
                  <span className="truncate text-xs">Admin</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
