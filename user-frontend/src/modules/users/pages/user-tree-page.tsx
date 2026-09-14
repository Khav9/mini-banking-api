import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usersApi } from "@/modules/users/api/usersApi";
import { ChevronDown, ChevronRight, User, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { t } from "i18next";

interface UserNode {
  id: number;
  username: string;
  nickname: string;
  status: string;
  balance: number;
  point: number;
  joinDate: string;
  lastLoginDate?: string;
  parentUsername?: string;
  children?: UserNode[];
  isLoading?: boolean;
  isLoaded?: boolean;
  expanded?: boolean;
  hasLoadedChildren?: boolean;
}

const statusColor = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500";
    case "PENDING":
      return "bg-yellow-500";
    case "REJECTED":
      return "bg-red-500";
    default:
      return "bg-gray-400";
  }
};

// Helper for badge variant
const badgeVariant = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "default";
    case "PENDING":
      return "secondary";
    case "REJECTED":
      return "destructive";
    default:
      return "outline";
  }
};

const UserTreePage = () => {
  const [tree, setTree] = React.useState<UserNode[]>([]);
  const [selectedId, setSelectedId] = React.useState<number | null>(null);
  const [loadingRoot, setLoadingRoot] = React.useState(true);

  // Fetch root nodes on mount
  React.useEffect(() => {
    setLoadingRoot(true);
    usersApi.getUserTree({ parentUsername: "" }).then((res) => {
      setTree(
        res.data.list.map((n) => ({
          ...n,
          isLoaded: false,
          expanded: false,
          hasLoadedChildren: false,
          children: [],
        }))
      );
      setLoadingRoot(false);
    });
  }, []);

  // Helper to update a node in the tree by id
  const updateNodeById = (
    nodes: UserNode[],
    id: number,
    updater: (node: UserNode) => UserNode
  ): UserNode[] => {
    return nodes.map((node) => {
      if (node.id === id) {
        return updater(node);
      } else if (node.children && node.children.length > 0) {
        return {
          ...node,
          children: updateNodeById(node.children, id, updater),
        };
      } else {
        return node;
      }
    });
  };

  // Expand/collapse and lazy load children
  const handleExpand = async (node: UserNode) => {
    if (node.isLoaded) {
      setTree((prev) =>
        updateNodeById(prev, node.id, (n) => ({ ...n, expanded: !n.expanded }))
      );
      return;
    }
    setTree((prev) =>
      updateNodeById(prev, node.id, (n) => ({
        ...n,
        isLoading: true,
        expanded: true,
      }))
    );
    const res = await usersApi.getUserTree({ parentUsername: node.username });
    setTree((prev) =>
      updateNodeById(prev, node.id, (n) => ({
        ...n,
        isLoaded: true,
        isLoading: false,
        expanded: true,
        hasLoadedChildren: true,
        children: res.data.list.map((c) => ({
          ...c,
          isLoaded: false,
          expanded: false,
          hasLoadedChildren: false,
          children: [],
        })),
      }))
    );
  };

  // Helper to find a node by id in the tree
  const findNodeById = (
    nodes: UserNode[],
    id: number | null
  ): UserNode | null => {
    if (id == null) return null;
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNodeById(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  // When a node is selected, auto-expand and fetch its children if not already loaded
  React.useEffect(() => {
    if (selectedId == null) return;
    const selected = findNodeById(tree, selectedId);
    if (!selected) return;
    if (!selected.expanded) {
      if (selected.isLoaded) {
        setTree((prev) =>
          updateNodeById(prev, selected.id, (n) => ({ ...n, expanded: true }))
        );
      } else {
        // Fetch children and expand
        (async () => {
          setTree((prev) =>
            updateNodeById(prev, selected.id, (n) => ({
              ...n,
              isLoading: true,
              expanded: true,
            }))
          );
          const res = await usersApi.getUserTree({
            parentUsername: selected.username,
          });
          setTree((prev) =>
            updateNodeById(prev, selected.id, (n) => ({
              ...n,
              isLoaded: true,
              isLoading: false,
              expanded: true,
              hasLoadedChildren: true,
              children: res.data.list.map((c) => ({
                ...c,
                isLoaded: false,
                expanded: false,
                hasLoadedChildren: false,
                children: [],
              })),
            }))
          );
        })();
      }
    }
  }, [selectedId]);

  // Recursive render for tree
  const renderTree = (nodes: UserNode[], level = 0) => (
    <ul
      className={cn("pl-0", level > 0 && "pl-4 border-l border-muted")}
      style={{ listStyle: "none" }}
    >
      {nodes.map((node) => {
        // Show arrow if:
        // - Not loaded children yet (could have children)
        // - Or, after loading, if children.length > 0
        const showArrow =
          !node.hasLoadedChildren ||
          (node.children && node.children.length > 0);
        return (
          <li key={node.id} className="mb-1">
            <div
              className={cn(
                "flex items-center gap-2 rounded px-2 py-1 cursor-pointer group transition-colors",
                selectedId === node.id
                  ? "bg-blue-100 text-blue-900 font-semibold"
                  : "hover:bg-muted"
              )}
              style={{
                minHeight: 36,
                background: selectedId === node.id ? undefined : undefined,
              }}
              onClick={() => setSelectedId(node.id)}
            >
              {node.isLoading ? (
                <Skeleton className="h-4 w-4 mr-1" />
              ) : showArrow ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 text-muted-foreground group-hover:text-blue-500"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleExpand(node);
                  }}
                  tabIndex={-1}
                >
                  {node.expanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 cursor-default"
                  tabIndex={-1}
                  disabled
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              )}
              <User className="h-4 w-4 text-blue-400" />
              <span>{node.username}</span>
              <span className="ml-1 text-xs text-muted-foreground">
                ({node.nickname})
              </span>
              <span className="ml-1">
                <Circle
                  className={cn(
                    "inline h-2 w-2 align-middle",
                    statusColor(node.status)
                  )}
                  fill="currentColor"
                />
              </span>
              {node.children && node.children.length > 0 && (
                <span className="ml-2 rounded bg-muted px-2 text-xs">
                  {node.children.length}
                </span>
              )}
            </div>
            {/* Children */}
            {node.expanded &&
              node.children &&
              node.children.length > 0 &&
              renderTree(node.children, level + 1)}
          </li>
        );
      })}
    </ul>
  );

  // Right panel: details table for selected node
  const renderDetails = () => {
    const selected = findNodeById(tree, selectedId);
    if (!selected) {
      return (
        <div className="text-muted-foreground p-8">
          {t("sidebar.userTree.selectUserToSeeDetails")}
        </div>
      );
    }
    return (
      <div className="p-4">
        <div className="mb-4">
          <span className="font-semibold text-lg">{selected.username}</span>
          <span className="ml-2 text-muted-foreground">
            ({selected.nickname})
          </span>
        </div>
        <div className="mb-2 flex flex-wrap gap-4 text-sm">
          <span>
            {t("sidebar.users.statusTitle")}: <b>{t(`sidebar.users.status.${selected.status.toLowerCase()}`)}</b>
          </span>
          <span>
            {t("sidebar.users.balance")}: <b>{selected.balance.toLocaleString()}</b>
          </span>
          <span>
            {t("sidebar.users.point")}: <b>{selected.point.toLocaleString()}</b>
          </span>
          <span>
            {t("sidebar.users.joinDate")}: {new Date(selected.joinDate).toLocaleDateString()}
          </span>
          {selected.lastLoginDate && (
            <span>
              {t("sidebar.users.lastLogin")}:{" "}
              {new Date(selected.lastLoginDate).toLocaleDateString()}
            </span>
          )}
        </div>
        <div className="rounded-lg border bg-card p-0 shadow-sm overflow-x-auto">
          <Table>
            <TableCaption>{t("sidebar.userTree.directChildren")}</TableCaption>
            <TableHeader className="sticky top-0 z-10 bg-card">
              <TableRow>
                <TableHead className="w-[160px]">{t("sidebar.users.username")}</TableHead>
                <TableHead>{t("sidebar.users.nickname")}</TableHead>
                <TableHead>{t("sidebar.users.statusTitle")}</TableHead>
                <TableHead>{t("sidebar.users.balance")}</TableHead>
                <TableHead>{t("sidebar.users.point")}</TableHead>
                <TableHead>{t("sidebar.users.joinDate")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {selected.children && selected.children.length > 0 ? (
                selected.children.map((child) => (
                  <TableRow
                    key={child.id}
                    className="hover:bg-muted cursor-pointer"
                    onClick={() => setSelectedId(child.id)}
                  >
                    <TableCell className="font-medium">
                      {child.username}
                    </TableCell>
                    <TableCell>{child.nickname}</TableCell>
                    <TableCell>
                      <Badge
                        variant={badgeVariant(child.status)}
                        className="capitalize"
                      >
                        {t(`sidebar.users.status.${child.status.toLowerCase()}`)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {child.balance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {child.point.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(child.joinDate).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center text-muted-foreground py-8"
                  >
                    No direct children.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  };

  return (
    <div className="flex gap-6 h-[80vh]">
      <Card className="w-1/3 min-w-[260px] max-w-[340px] overflow-auto border bg-muted/40">
        <CardHeader>
          <CardTitle>{t("sidebar.userTree.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingRoot ? <Skeleton className="h-8 w-full" /> : renderTree(tree)}
        </CardContent>
      </Card>
      <div className="flex-1 overflow-auto">{renderDetails()}</div>
    </div>
  );
};

export default UserTreePage;
