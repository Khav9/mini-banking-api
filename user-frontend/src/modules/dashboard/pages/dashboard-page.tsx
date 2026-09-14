import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpRight,
  Users,
  DollarSign,
  Activity,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Users",
    value: "2,345",
    change: "+12.3%",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Total Revenue",
    value: "$45,231",
    change: "+20.1%",
    icon: DollarSign,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
  },
  {
    title: "Active Users",
    value: "1,234",
    change: "+5.2%",
    icon: Activity,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Total Bets",
    value: "12,345",
    change: "+8.4%",
    icon: TrendingUp,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
];

const recentActivities = [
  {
    id: 1,
    user: "john_doe",
    action: "placed a bet",
    amount: "$500",
    time: "2 minutes ago",
  },
  {
    id: 2,
    user: "jane_smith",
    action: "withdrew",
    amount: "$1,000",
    time: "5 minutes ago",
  },
  {
    id: 3,
    user: "mike_wilson",
    action: "deposited",
    amount: "$2,000",
    time: "10 minutes ago",
  },
  {
    id: 4,
    user: "sarah_jones",
    action: "placed a bet",
    amount: "$300",
    time: "15 minutes ago",
  },
];

const DashboardPage = () => {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`rounded-full p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
                {stat.change} from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {activity.user}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {activity.action}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{activity.amount}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Pending Deposits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Withdrawals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Games</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
