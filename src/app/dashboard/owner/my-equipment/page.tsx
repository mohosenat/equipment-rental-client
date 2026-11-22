"use client";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  Plus,
  Package,
  Eye,
  Pencil,
  Trash2,
  RefreshCw,
  MapPin,
  CalendarDays,
  Loader2,
  X,
  Boxes,
} from "lucide-react";

import {
  Equipment,
  getMyEquipment,
  updateEquipment,
  deleteEquipment,
} from "@/lib/api/equipment";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DialogMode = "view" | "edit" | null;

export default function MyEquipmentPage() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(
    null,
  );

  const [dialogMode, setDialogMode] = useState<DialogMode>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    location: "",
    price: "",
    quantity: "",
  });

  const loadEquipment = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const data = await getMyEquipment();
      setEquipment(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load your equipment.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadEquipment();
  }, [loadEquipment]);

  const filteredEquipment = useMemo(() => {
    return equipment.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase()) ||
        item.location.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [equipment, search, statusFilter]);

  const stats = useMemo(() => {
    return {
      total: equipment.length,
      pending: equipment.filter((item) => item.status === "pending").length,
      approved: equipment.filter((item) => item.status === "approved").length,
      rejected: equipment.filter((item) => item.status === "rejected").length,
    };
  }, [equipment]);

  const getStatusStyle = (status: Equipment["status"]) => {
    switch (status) {
      case "approved":
        return "border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400";

      case "rejected":
        return "border-red-500/20 bg-red-500/10 text-red-600 dark:text-red-400";

      default:
        return "border-yellow-500/20 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400";
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-BD", {
      style: "currency",
      currency: "BDT",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openDetails = (item: Equipment) => {
    setSelectedEquipment(item);
    setDialogMode("view");
  };

  const openEdit = (item: Equipment) => {
    setSelectedEquipment(item);

    setEditForm({
      name: item.name,
      description: item.description,
      location: item.location,
      price: String(item.price),
      quantity: String(item.quantity),
    });

    setDialogMode("edit");
  };

  const closeDialog = () => {
    setDialogMode(null);
    setSelectedEquipment(null);
  };

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedEquipment) return;

    if (
      !editForm.name.trim() ||
      !editForm.description.trim() ||
      !editForm.location.trim() ||
      Number(editForm.price) <= 0 ||
      Number(editForm.quantity) < 1
    ) {
      setError("Please provide valid equipment information.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      await updateEquipment(selectedEquipment._id, {
        name: editForm.name.trim(),
        description: editForm.description.trim(),
        location: editForm.location.trim(),
        price: Number(editForm.price),
        quantity: Number(editForm.quantity),
      });

      closeDialog();
      await loadEquipment();

      setSuccess("Equipment updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update equipment.",
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: Equipment) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${item.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    try {
      setDeletingId(item._id);
      setError("");
      setSuccess("");

      await deleteEquipment(item._id);

      setEquipment((previous) =>
        previous.filter((equipment) => equipment._id !== item._id),
      );

      setSuccess("Equipment deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete equipment.",
      );
    } finally {
      setDeletingId("");
    }
  };

  return (
    <div className="space-y-7 pb-10">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-[#171717] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-yellow-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
              <Package size={15} />
              Owner Dashboard
            </div>

            <h1 className="text-2xl font-bold sm:text-3xl">My Equipment</h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              Manage your listed equipment, track approval status, and keep your
              rental inventory up to date.
            </p>
          </div>

          <Link
            href="/dashboard/owner/add-equipment"
            className="flex w-full items-center justify-center gap-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300 sm:w-auto"
          >
            <Plus size={18} />
            Add Equipment
          </Link>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[
          {
            label: "Total Equipment",
            value: stats.total,
            icon: Package,
            color: "text-foreground",
          },
          {
            label: "Pending Review",
            value: stats.pending,
            icon: CalendarDays,
            color: "text-yellow-600 dark:text-yellow-400",
          },
          {
            label: "Approved",
            value: stats.approved,
            icon: Boxes,
            color: "text-green-600 dark:text-green-400",
          },
          {
            label: "Rejected",
            value: stats.rejected,
            icon: X,
            color: "text-red-600 dark:text-red-400",
          },
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

                <p className={`mt-2 text-2xl font-bold ${stat.color}`}>
                  {loading ? "—" : stat.value}
                </p>
              </div>

              <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                <stat.icon size={21} className={stat.color} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Messages */}
      {error && (
        <div className="flex items-start justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600 dark:text-red-400">
          <p>{error}</p>
          <button onClick={() => setError("")} aria-label="Dismiss error">
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600 dark:text-green-400">
          <p>{success}</p>
          <button onClick={() => setSuccess("")} aria-label="Dismiss message">
            <X size={17} />
          </button>
        </div>
      )}

      {/* Equipment Table */}
      <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
        <div className="border-b border-border p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div>
              <h2 className="text-lg font-bold text-foreground">
                Equipment Inventory
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Manage all your listed equipment in one place.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1 sm:w-64">
                <Search
                  size={17}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />

                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search equipment..."
                  className="h-10 rounded-xl pl-9"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-xl border border-input bg-background px-3 text-sm text-foreground outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>

              <Button
                variant="outline"
                size="icon"
                onClick={() => loadEquipment(true)}
                disabled={refreshing}
                className="shrink-0 rounded-xl"
                title="Refresh equipment"
              >
                <RefreshCw
                  size={17}
                  className={refreshing ? "animate-spin" : ""}
                />
              </Button>
            </div>
          </div>
        </div>

        <CardContent className="p-0">
          {loading ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20">
              <Loader2 className="animate-spin text-yellow-500" size={30} />
              <p className="text-sm text-muted-foreground">
                Loading your equipment...
              </p>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="flex flex-col items-center justify-center px-5 py-20 text-center">
              <div className="mb-4 flex size-16 items-center justify-center rounded-2xl bg-muted">
                <Package size={29} className="text-muted-foreground" />
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {equipment.length === 0
                  ? "No equipment listed yet"
                  : "No matching equipment found"}
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
                {equipment.length === 0
                  ? "Start building your rental inventory by adding your first equipment."
                  : "Try changing your search term or status filter."}
              </p>

              {equipment.length === 0 && (
                <Link
                  href="/dashboard/owner/add-equipment"
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-md bg-yellow-400 px-4 py-2 text-sm font-semibold text-black transition hover:bg-yellow-300"
                >
                  <Plus size={17} />
                  Add Your First Equipment
                </Link>
              )}
            </div>
          ) : (
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Equipment</th>
                    <th className="px-5 py-4 font-semibold">Category</th>
                    <th className="px-5 py-4 font-semibold">Rental Price</th>
                    <th className="px-5 py-4 font-semibold">Quantity</th>
                    <th className="px-5 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {filteredEquipment.map((item) => (
                    <tr key={item._id} className="transition hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="size-14 shrink-0 overflow-hidden rounded-xl border border-border bg-muted">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="size-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[200px] truncate font-semibold text-foreground">
                              {item.name}
                            </p>

                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin size={12} />
                              <span className="max-w-[180px] truncate">
                                {item.location}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4 capitalize text-muted-foreground">
                        {item.category}
                      </td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-foreground">
                          {formatPrice(item.price)}
                        </p>
                        <p className="mt-1 text-xs capitalize text-muted-foreground">
                          Per {item.rentalType.replace("ly", "")}
                        </p>
                      </td>

                      <td className="px-5 py-4 font-medium text-foreground">
                        {item.quantity}
                      </td>

                      <td className="px-5 py-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 capitalize ${getStatusStyle(item.status)}`}
                        >
                          {item.status}
                        </Badge>
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openDetails(item)}
                            title="View details"
                            className="size-9 rounded-lg text-muted-foreground hover:bg-yellow-400/10 hover:text-yellow-600"
                          >
                            <Eye size={17} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openEdit(item)}
                            title="Update equipment"
                            className="size-9 rounded-lg text-muted-foreground hover:bg-yellow-400/10 hover:text-yellow-600"
                          >
                            <Pencil size={17} />
                          </Button>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item)}
                            disabled={deletingId === item._id}
                            title="Delete equipment"
                            className="size-9 rounded-lg text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
                          >
                            {deletingId === item._id ? (
                              <Loader2 size={17} className="animate-spin" />
                            ) : (
                              <Trash2 size={17} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredEquipment.length > 0 && (
            <div className="border-t border-border px-6 py-4 text-xs text-muted-foreground">
              Showing {filteredEquipment.length} of {equipment.length} equipment
              listings
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details / Update Dialog */}
      <Dialog
        open={dialogMode !== null}
        onOpenChange={(open) => {
          if (!open) closeDialog();
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-xl">
          {selectedEquipment && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl font-bold">
                  {dialogMode === "view"
                    ? "Equipment Details"
                    : "Update Equipment"}
                </DialogTitle>

                <DialogDescription>
                  {dialogMode === "view"
                    ? "Review your equipment information and listing status."
                    : "Update your equipment information below."}
                </DialogDescription>
              </DialogHeader>

              {dialogMode === "view" ? (
                <div className="space-y-5">
                  <div className="aspect-video overflow-hidden rounded-xl bg-muted">
                    <img
                      src={selectedEquipment.image}
                      alt={selectedEquipment.name}
                      className="size-full object-cover"
                    />
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-lg font-bold text-foreground">
                      {selectedEquipment.name}
                    </h3>

                    <Badge
                      variant="outline"
                      className={`capitalize ${getStatusStyle(selectedEquipment.status)}`}
                    >
                      {selectedEquipment.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      ["Category", selectedEquipment.category],
                      ["Condition", selectedEquipment.condition],
                      ["Rental Price", formatPrice(selectedEquipment.price)],
                      ["Rental Type", selectedEquipment.rentalType],
                      [
                        "Available Quantity",
                        String(selectedEquipment.quantity),
                      ],
                      ["Location", selectedEquipment.location],
                      ["Brand", selectedEquipment.brand || "Not specified"],
                      ["Model", selectedEquipment.model || "Not specified"],
                    ].map(([label, value]) => (
                      <div key={label} className="rounded-xl bg-muted/50 p-3">
                        <p className="text-xs text-muted-foreground">{label}</p>
                        <p className="mt-1 break-words text-sm font-semibold capitalize text-foreground">
                          {value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold">Description</p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {selectedEquipment.description}
                    </p>
                  </div>

                  <div>
                    <p className="mb-2 text-sm font-semibold">
                      Rental Terms & Conditions
                    </p>
                    <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">
                      {selectedEquipment.terms}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                    <span>
                      Added: {formatDate(selectedEquipment.createdAt)}
                    </span>
                    <span>
                      Updated: {formatDate(selectedEquipment.updatedAt)}
                    </span>
                  </div>

                  <Button
                    onClick={() => openEdit(selectedEquipment)}
                    className="w-full bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
                  >
                    <Pencil size={17} />
                    Update Equipment
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleUpdate} className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Equipment Name</Label>
                    <Input
                      id="edit-name"
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      required
                      minLength={3}
                      maxLength={100}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Textarea
                      id="edit-description"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      required
                      minLength={20}
                      rows={4}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="edit-location">Location</Label>
                    <Input
                      id="edit-location"
                      value={editForm.location}
                      onChange={(e) =>
                        setEditForm({ ...editForm, location: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-price">Rental Price (৳)</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        min="1"
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="edit-quantity">Available Quantity</Label>
                      <Input
                        id="edit-quantity"
                        type="number"
                        min="1"
                        step="1"
                        value={editForm.quantity}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            quantity: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={closeDialog}
                      disabled={saving}
                    >
                      Cancel
                    </Button>

                    <Button
                      type="submit"
                      disabled={saving}
                      className="bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
                    >
                      {saving ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
