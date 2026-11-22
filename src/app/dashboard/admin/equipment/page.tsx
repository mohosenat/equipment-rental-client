"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getAdminEquipment,
  updateAdminEquipmentStatus,
  updateAdminEquipment,
  deleteAdminEquipment,
  type AdminEquipment,
  type AdminEquipmentUpdateData,
} from "@/lib/api/admin";

import {
  Search,
  RefreshCw,
  CheckCircle2,
  CheckCircle,
  XCircle,
  Eye,
  Package,
  MapPin,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type EquipmentStatus = "pending" | "approved" | "rejected";

const getImageUrl = (image: unknown): string => {
  if (typeof image === "string") return image;

  if (
    image &&
    typeof image === "object" &&
    "url" in image &&
    typeof image.url === "string"
  ) {
    return image.url;
  }

  return "";
};

const emptyForm: AdminEquipmentUpdateData = {
  name: "",
  description: "",
  category: "",
  location: "",
  price: 0,
  rentalType: "daily",
  quantity: 1,
  condition: "",
  brand: "",
  model: "",
  image: "",
  terms: "",
};

export default function AdminEquipmentPage() {
  const [equipment, setEquipment] = useState<AdminEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [selectedEquipment, setSelectedEquipment] =
    useState<AdminEquipment | null>(null);

  const [editingEquipment, setEditingEquipment] =
    useState<AdminEquipment | null>(null);

  const [deletingEquipment, setDeletingEquipment] =
    useState<AdminEquipment | null>(null);

  const [formData, setFormData] = useState<AdminEquipmentUpdateData>(emptyForm);

  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<"success" | "error">(
    "success",
  );

  const limit = 10;

  const showMessage = (text: string, type: "success" | "error" = "success") => {
    setMessage(text);
    setMessageType(type);
  };

  // Fetch Equipment
  const fetchEquipment = useCallback(
    async (showRefresh = false) => {
      try {
        if (showRefresh) setRefreshing(true);
        else setLoading(true);

        const result = await getAdminEquipment({
          page,
          limit,
          search,
          status: statusFilter,
        });

        setEquipment(result.data);
        setTotalPages(Math.max(1, result.pagination.totalPages));
        setTotalItems(result.pagination.total);
      } catch (error) {
        console.error(error);
        showMessage("Failed to load equipment.", "error");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [page, search, statusFilter],
  );

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  // Refresh and reset filters
  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      setMessage("");

      setSearch("");
      setStatusFilter("");
      setPage(1);

      const result = await getAdminEquipment({
        page: 1,
        limit,
        search: "",
        status: "",
      });

      setEquipment(result.data);
      setTotalPages(Math.max(1, result.pagination.totalPages));
      setTotalItems(result.pagination.total);
    } catch (error) {
      console.error(error);
      showMessage("Failed to refresh equipment.", "error");
    } finally {
      setRefreshing(false);
    }
  };

  // Approve or Reject
  const handleStatusUpdate = async (
    id: string,
    status: "approved" | "rejected",
  ) => {
    try {
      setActionLoading(id);
      setMessage("");

      await updateAdminEquipmentStatus(id, status);

      showMessage(`Equipment ${status} successfully.`);

      if (selectedEquipment?._id === id) {
        setSelectedEquipment(null);
      }

      await fetchEquipment(true);
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error
          ? error.message
          : "Failed to update equipment status.",
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Open Edit Dialog
  // Open Edit Dialog
  const openEditDialog = (item: AdminEquipment) => {
    setEditingEquipment(item);

    setFormData({
      name: typeof item.name === "string" ? item.name : "",
      description: typeof item.description === "string" ? item.description : "",
      category: typeof item.category === "string" ? item.category : "",
      location: typeof item.location === "string" ? item.location : "",
      price: Number(item.price) || 0,
      rentalType:
        item.rentalType === "hourly" ||
        item.rentalType === "weekly" ||
        item.rentalType === "monthly"
          ? item.rentalType
          : "daily",
      quantity: Number(item.quantity) || 1,
      condition: typeof item.condition === "string" ? item.condition : "",
      brand: typeof item.brand === "string" ? item.brand : "",
      model: typeof item.model === "string" ? item.model : "",
      image: getImageUrl(item.image),
      terms: typeof item.terms === "string" ? item.terms : "",
    });
  };
  // Update Form
  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!editingEquipment) return;

    try {
      setActionLoading(editingEquipment._id);
      setMessage("");

      await updateAdminEquipment(editingEquipment._id, {
        ...formData,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      });

      showMessage("Equipment updated successfully.");

      setEditingEquipment(null);
      setSelectedEquipment(null);

      await fetchEquipment(true);
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error ? error.message : "Failed to update equipment.",
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  // Delete Equipment
  const handleDelete = async () => {
    if (!deletingEquipment) return;

    const id = deletingEquipment._id;

    try {
      setActionLoading(id);
      setMessage("");

      await deleteAdminEquipment(id);

      showMessage("Equipment deleted successfully.");

      setDeletingEquipment(null);

      if (selectedEquipment?._id === id) {
        setSelectedEquipment(null);
      }

      // If the current page becomes empty, go to previous page.
      if (equipment.length === 1 && page > 1) {
        setPage((prev) => prev - 1);
      } else {
        await fetchEquipment(true);
      }
    } catch (error) {
      console.error(error);

      showMessage(
        error instanceof Error ? error.message : "Failed to delete equipment.",
        "error",
      );
    } finally {
      setActionLoading(null);
    }
  };

  const statusStyle = (status: EquipmentStatus) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";

      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";

      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    }
  };

  const inputClass =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-yellow-400";

  return (
    <div className="space-y-6">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl bg-[#171717] px-6 py-7 text-white shadow-lg sm:px-8">
        <div className="absolute -right-20 -top-24 h-64 w-64 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 h-48 w-48 rounded-full bg-yellow-500/5 blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2">
              <div className="rounded-xl bg-yellow-400 p-2 text-black">
                <Package size={20} />
              </div>

              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
                Administration
              </span>
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">All Equipment</h1>

            <p className="mt-2 text-sm text-white/60">
              Review, manage and monitor equipment listings.
            </p>
          </div>

          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            className="border border-white/15 bg-white/10 text-white hover:bg-white/20"
          >
            <RefreshCw
              size={16}
              className={`mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-transparent" />
      </section>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            title: "Total Listings",
            value: totalItems,
            icon: Package,
          },
          {
            title: "Current Filter",
            value: statusFilter || "All",
            icon: Filter,
          },
          {
            title: "Current Page",
            value: `${page} / ${totalPages}`,
            icon: Eye,
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-[#171717]"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    {item.title}
                  </p>

                  <p className="mt-2 text-xl font-bold capitalize text-gray-900 dark:text-white">
                    {item.value}
                  </p>
                </div>

                <div className="rounded-xl bg-yellow-100 p-3 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400">
                  <Icon size={20} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search & Filter */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-[#171717]">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />

            <Input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, category or location..."
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${
            messageType === "success"
              ? "border-green-300 bg-green-50 text-green-800 dark:border-green-900 dark:bg-green-950/30 dark:text-green-400"
              : "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/30 dark:text-red-400"
          }`}
        >
          {message}
        </div>
      )}

      {/* Equipment Table */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-white/10 dark:bg-[#171717]">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-white/10">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Equipment Listings
          </h2>

          <p className="mt-1 text-xs text-gray-500">
            Review and manage marketplace equipment.
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center">
            <Loader2 className="animate-spin text-yellow-500" size={32} />
          </div>
        ) : equipment.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-4 text-center">
            <div className="rounded-2xl bg-yellow-100 p-4 dark:bg-yellow-400/10">
              <Package
                className="text-yellow-600 dark:text-yellow-400"
                size={30}
              />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900 dark:text-white">
              No equipment found
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Try changing your search or filter.
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px] text-sm">
                <thead className="bg-gray-50 dark:bg-white/5">
                  <tr className="text-left text-xs uppercase tracking-wider text-gray-500">
                    <th className="px-5 py-4">Equipment</th>
                    <th className="px-5 py-4">Category</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Price</th>
                    <th className="px-5 py-4">Status</th>
                    <th className="px-5 py-4">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                  {equipment.map((item) => (
                    <tr
                      key={item._id}
                      className="transition hover:bg-gray-50 dark:hover:bg-white/[0.03]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {getImageUrl(item.image) ? (
                            <img
                              src={getImageUrl(item.image)}
                              alt={item.name}
                              className="h-12 w-12 rounded-xl border border-gray-200 object-cover dark:border-white/10"
                            />
                          ) : (
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-100 text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-400">
                              <Package size={20} />
                            </div>
                          )}

                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white">
                              {item.name}
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                              ID: {item._id.slice(-8)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-700 dark:bg-white/10 dark:text-gray-300">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300">
                          <MapPin size={14} className="text-yellow-500" />
                          {item.location}
                        </div>
                      </td>

                      <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white">
                        ৳{item.price}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(item.status)}`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* View */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedEquipment(item)}
                          >
                            View
                          </Button>

                          {/* Status Actions */}
                          {String(item.status).toLowerCase().trim() ===
                            "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 text-white hover:bg-green-700"
                                disabled={actionLoading === item._id}
                                onClick={() =>
                                  handleStatusUpdate(item._id, "approved")
                                }
                              >
                                <CheckCircle size={14} className="mr-1" />
                                Approve
                              </Button>

                              <Button
                                size="sm"
                                variant="destructive"
                                disabled={actionLoading === item._id}
                                onClick={() =>
                                  handleStatusUpdate(item._id, "rejected")
                                }
                              >
                                <XCircle size={14} className="mr-1" />
                                Reject
                              </Button>
                            </>
                          )}

                          {String(item.status).toLowerCase().trim() ===
                            "approved" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              disabled={actionLoading === item._id}
                              onClick={() =>
                                handleStatusUpdate(item._id, "rejected")
                              }
                            >
                              <XCircle size={14} className="mr-1" />
                              Reject
                            </Button>
                          )}

                          {String(item.status).toLowerCase().trim() ===
                            "rejected" && (
                            <Button
                              size="sm"
                              className="bg-green-600 text-white hover:bg-green-700"
                              disabled={actionLoading === item._id}
                              onClick={() =>
                                handleStatusUpdate(item._id, "approved")
                              }
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Approve
                            </Button>
                          )}
                          {/* Update */}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(item)}
                          >
                            <Pencil size={14} className="mr-1" />
                            Update
                          </Button>

                          {/* Delete */}
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => setDeletingEquipment(item)}
                          >
                            <Trash2 size={14} className="mr-1" />
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex flex-col gap-3 border-t border-gray-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-white/10">
              <p className="text-xs text-gray-500">
                Showing page {page} of {totalPages}
              </p>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <ChevronLeft size={16} className="mr-1" />
                  Previous
                </Button>

                <span className="rounded-lg bg-yellow-400 px-3 py-1.5 text-sm font-bold text-black">
                  {page}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Next
                  <ChevronRight size={16} className="ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedEquipment}
        onOpenChange={(open) => !open && setSelectedEquipment(null)}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          {selectedEquipment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl">Equipment Details</DialogTitle>

                <DialogDescription>
                  Review the complete equipment information.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                {getImageUrl(selectedEquipment.image) && (
                  <img
                    src={getImageUrl(selectedEquipment.image)}
                    alt={selectedEquipment.name}
                    className="h-56 w-full rounded-xl object-cover"
                  />
                )}

                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-lg font-bold">
                    {selectedEquipment.name}
                  </h3>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusStyle(selectedEquipment.status)}`}
                  >
                    {selectedEquipment.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {(
                    [
                      ["Category", selectedEquipment.category],
                      ["Location", selectedEquipment.location],
                      ["Price", `৳${selectedEquipment.price}`],
                      ["Status", selectedEquipment.status],
                      ["Rental Type", selectedEquipment.rentalType],
                      ["Quantity", String(selectedEquipment.quantity ?? 1)],
                      ["Condition", selectedEquipment.condition || "N/A"],
                      ["Brand", selectedEquipment.brand || "N/A"],
                      ["Model", selectedEquipment.model || "N/A"],
                    ] as [string, React.ReactNode][]
                  ).map(([label, value]) => (
                    <div
                      key={label}
                      className="rounded-xl border border-gray-200 p-4 dark:border-white/10"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        {label}
                      </p>

                      <p className="mt-2 font-semibold capitalize">{value}</p>
                    </div>
                  ))}
                </div>

                {selectedEquipment.description && (
                  <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Description
                    </p>

                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                      {selectedEquipment.description}
                    </p>
                  </div>
                )}

                {typeof selectedEquipment.description === "string" &&
                  selectedEquipment.description.length > 0 && (
                    <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Description
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {selectedEquipment.description}
                      </p>
                    </div>
                  )}

                {typeof selectedEquipment.terms === "string" &&
                  selectedEquipment.terms.length > 0 && (
                    <div className="rounded-xl border border-gray-200 p-4 dark:border-white/10">
                      <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                        Rental Terms
                      </p>

                      <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-700 dark:text-gray-300">
                        {selectedEquipment.terms}
                      </p>
                    </div>
                  )}

                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => openEditDialog(selectedEquipment)}
                  >
                    <Pencil size={15} className="mr-2" />
                    Update Equipment
                  </Button>

                  {selectedEquipment.status === "pending" && (
                    <>
                      <Button
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={actionLoading === selectedEquipment._id}
                        onClick={() =>
                          handleStatusUpdate(selectedEquipment._id, "approved")
                        }
                      >
                        <CheckCircle2 size={16} className="mr-2" />
                        Approve
                      </Button>

                      <Button
                        className="bg-red-600 text-white hover:bg-red-700"
                        disabled={actionLoading === selectedEquipment._id}
                        onClick={() =>
                          handleStatusUpdate(selectedEquipment._id, "rejected")
                        }
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </Button>
                    </>
                  )}

                  <Button
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50 dark:border-red-900 dark:text-red-400"
                    onClick={() => setDeletingEquipment(selectedEquipment)}
                  >
                    <Trash2 size={15} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Equipment Dialog */}
      <Dialog
        open={!!editingEquipment}
        onOpenChange={(open) => {
          if (!open) setEditingEquipment(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Update Equipment</DialogTitle>
            <DialogDescription>
              Edit the equipment information and save your changes.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-medium">Equipment Name *</label>
                <Input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Category *</label>
                <Input
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Location *</label>
                <Input
                  required
                  value={formData.location}
                  onChange={(e) =>
                    setFormData({ ...formData, location: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Price *</label>
                <Input
                  required
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Rental Type *</label>
                <select
                  required
                  className={inputClass}
                  value={formData.rentalType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rentalType: e.target
                        .value as AdminEquipmentUpdateData["rentalType"],
                    })
                  }
                >
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Quantity *</label>
                <Input
                  required
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Condition *</label>
                <Input
                  required
                  value={formData.condition}
                  onChange={(e) =>
                    setFormData({ ...formData, condition: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Brand</label>
                <Input
                  value={formData.brand || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, brand: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Model</label>
                <Input
                  value={formData.model || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, model: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Image URL</label>
                <Input
                  value={formData.image || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description *</label>
              <textarea
                required
                rows={4}
                className={inputClass}
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Rental Terms</label>
              <textarea
                rows={3}
                className={inputClass}
                value={formData.terms || ""}
                onChange={(e) =>
                  setFormData({ ...formData, terms: e.target.value })
                }
              />
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditingEquipment(null)}
                disabled={actionLoading === editingEquipment?._id}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={actionLoading === editingEquipment?._id}
                className="bg-yellow-400 text-black hover:bg-yellow-500"
              >
                {actionLoading === editingEquipment?._id ? (
                  <>
                    <Loader2 size={16} className="mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deletingEquipment}
        onOpenChange={(open) => {
          if (!open) setDeletingEquipment(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Equipment?</DialogTitle>

            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">
                {deletingEquipment?.name}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDeletingEquipment(null)}
              disabled={actionLoading === deletingEquipment?._id}
            >
              Cancel
            </Button>

            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              disabled={actionLoading === deletingEquipment?._id}
              onClick={handleDelete}
            >
              {actionLoading === deletingEquipment?._id ? (
                <>
                  <Loader2 size={16} className="mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 size={16} className="mr-2" />
                  Delete Equipment
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
