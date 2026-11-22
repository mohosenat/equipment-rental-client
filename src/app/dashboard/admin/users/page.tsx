"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Users,
  RefreshCw,
  Eye,
  ShieldCheck,
  UserRound,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import {
  getAdminUsers,
  updateAdminUserRole,
  type AdminUser,
  type AdminPagination,
} from "@/lib/api/admin";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Role = "customer" | "owner" | "admin";

const initialPagination: AdminPagination = {
  total: 0,
  page: 1,
  limit: 10,
  totalPages: 0,
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState(initialPagination);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [updatingId, setUpdatingId] = useState("");
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const isAdmin = useCallback(async () => {
    const { data } = await authClient.getSession();

    const user = data?.user as { role?: string } | null | undefined;

    return user?.role === "admin";
  }, []);
  const loadUsers = useCallback(
    async (refresh = false) => {
      try {
        console.log("REFRESH/FETCH STARTED");

        refresh ? setRefreshing(true) : setLoading(true);
        setError("");

        const result = await getAdminUsers({
          page,
          limit: 10,
          search: appliedSearch,
        });

        console.log("API RESULT:", result);

        setUsers(result.data || []);
        setPagination(result.pagination);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load users.");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, appliedSearch],
  );

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setError("");

      setSearch("");
      setAppliedSearch("");
      setPage(1);

      const result = await getAdminUsers({
        page: 1,
        limit: 10,
        search: "",
      });

      setUsers(result.data || []);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to refresh users.");
    } finally {
      setRefreshing(false);
    }
  };
  useEffect(() => {
    let active = true;

    const checkAccess = async () => {
      const allowed = await isAdmin();

      if (!active) return;

      if (allowed) {
        loadUsers();
      } else {
        window.location.href = "/dashboard";
      }
    };

    checkAccess();

    return () => {
      active = false;
    };
  }, [isAdmin, loadUsers]);

  const stats = useMemo(
    () => ({
      total: pagination.total,
      customers: users.filter((user) => user.role === "customer").length,
      owners: users.filter((user) => user.role === "owner").length,
      admins: users.filter((user) => user.role === "admin").length,
    }),
    [users, pagination.total],
  );

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  };

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setAppliedSearch(search.trim());
  };

  const handleRoleChange = async (user: AdminUser, role: Role) => {
    const userId = user.id || user._id;

    if (!userId || user.role === role) return;

    try {
      setUpdatingId(userId);
      setError("");

      await updateAdminUserRole(userId, role);

      setUsers((previous) =>
        previous.map((item) =>
          (item.id || item._id) === userId ? { ...item, role } : item,
        ),
      );

      if (selectedUser && (selectedUser.id || selectedUser._id) === userId) {
        setSelectedUser({ ...selectedUser, role });
      }

      showToast("User role updated successfully.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Role update failed.");
    } finally {
      setUpdatingId("");
    }
  };

  const roleStyle = (role: string) => {
    if (role === "admin")
      return "bg-purple-500/10 text-purple-600 border-purple-500/20";
    if (role === "owner")
      return "bg-yellow-500/10 text-yellow-700 border-yellow-500/20";
    return "bg-blue-500/10 text-blue-600 border-blue-500/20";
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-BD", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Not available";

  return (
    <div className="space-y-7 pb-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#171717] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
              <Users size={15} /> Admin Dashboard
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">All Users</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              Manage registered customers, equipment owners, and administrator
              accounts.
            </p>
          </div>
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            variant="outline"
            className="border-white/20 bg-white/5 text-white hover:bg-white/10"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-transparent" />
      </div>

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          { label: "Total Users", value: stats.total, icon: Users },
          { label: "Customers", value: stats.customers, icon: UserRound },
          { label: "Equipment Owners", value: stats.owners, icon: ShieldCheck },
          { label: "Administrators", value: stats.admins, icon: ShieldCheck },
        ].map((stat) => (
          <Card
            key={stat.label}
            className="rounded-2xl border-border shadow-sm"
          >
            <CardContent className="flex items-center justify-between gap-3 p-5">
              <div>
                <p className="text-xs font-medium text-muted-foreground sm:text-sm">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold">
                  {loading ? "—" : stat.value}
                </p>
              </div>
              <div className="flex size-11 items-center justify-center rounded-xl bg-muted text-yellow-600">
                <stat.icon size={21} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {toast && (
        <div className="fixed right-5 top-5 z-[100] flex items-center gap-2 rounded-xl border border-green-500/20 bg-background px-4 py-3 text-sm font-medium text-green-600 shadow-xl">
          <ShieldCheck size={17} /> {toast}
        </div>
      )}

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold">User Directory</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Search accounts and manage user roles.
              </p>
            </div>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name or email..."
                  className="h-10 rounded-xl pl-9"
                />
              </div>
              <Button
                type="submit"
                className="bg-yellow-400 text-black hover:bg-yellow-300"
              >
                Search
              </Button>
            </form>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center gap-3 py-20">
              <Loader2 className="animate-spin text-yellow-500" size={30} />
              <p className="text-sm text-muted-foreground">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="py-20 text-center">
              <Users size={32} className="mx-auto mb-3 text-muted-foreground" />
              <p className="font-semibold">No users found</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Try another search.
              </p>
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4">User</th>
                    <th className="px-5 py-4">Email</th>
                    <th className="px-5 py-4">Role</th>
                    <th className="px-5 py-4">Joined</th>
                    <th className="px-6 py-4 text-right">Manage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((user) => {
                    const id = user.id || user._id || user.email;
                    return (
                      <tr key={id} className="transition hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted font-semibold">
                              {user.image ? (
                                <img
                                  src={user.image}
                                  alt={user.name}
                                  className="size-full object-cover"
                                />
                              ) : (
                                user.name?.charAt(0)?.toUpperCase() || "U"
                              )}
                            </div>
                            <span className="font-semibold">
                              {user.name || "Unnamed User"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {user.email}
                        </td>
                        <td className="px-5 py-4">
                          <Badge
                            variant="outline"
                            className={`capitalize ${roleStyle(user.role)}`}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={user.role}
                              disabled={updatingId === (user.id || user._id)}
                              onChange={(event) =>
                                handleRoleChange(
                                  user,
                                  event.target.value as Role,
                                )
                              }
                              className="h-9 rounded-lg border border-input bg-background px-2 text-xs capitalize"
                            >
                              <option value="customer">Customer</option>
                              <option value="owner">Owner</option>
                              <option value="admin">Admin</option>
                            </select>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="size-9 rounded-lg hover:bg-yellow-400/10 hover:text-yellow-600"
                              onClick={() => {
                                setSelectedUser(user);
                                setDetailsOpen(true);
                              }}
                              title="View details"
                            >
                              <Eye size={17} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-6 py-4">
            <p className="text-xs text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages || 1} ·{" "}
              {pagination.total} users
            </p>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => p - 1)}
              >
                <ChevronLeft size={16} /> Previous
              </Button>
              <Button
                size="sm"
                variant="outline"
                disabled={page >= pagination.totalPages || loading}
                onClick={() => setPage((p) => p + 1)}
              >
                Next <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
            <DialogDescription>
              Account information and registration details.
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4">
                <div className="flex size-14 items-center justify-center overflow-hidden rounded-xl bg-muted text-lg font-bold">
                  {selectedUser.image ? (
                    <img
                      src={selectedUser.image}
                      alt={selectedUser.name}
                      className="size-full object-cover"
                    />
                  ) : (
                    selectedUser.name?.charAt(0)?.toUpperCase()
                  )}
                </div>
                <div>
                  <p className="font-semibold">{selectedUser.name}</p>
                  <Badge
                    variant="outline"
                    className={`mt-1 capitalize ${roleStyle(selectedUser.role)}`}
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Mail size={17} className="text-muted-foreground" />
                {selectedUser.email}
              </div>
              <div className="flex items-center gap-3 text-sm">
                <CalendarDays size={17} className="text-muted-foreground" />
                Joined {formatDate(selectedUser.createdAt)}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
