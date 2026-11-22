"use client";

import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ImagePlus,
  Loader2,
  MapPin,
  PackagePlus,
  Upload,
  UserRound,
  X,
} from "lucide-react";

import { getMyProfile, type UserProfile } from "@/lib/api/users";
import { createEquipment } from "@/lib/api/equipment";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const categories = [
  "construction",
  "photography",
  "vehicles",
  "agriculture",
  "electronics",
  "event equipment",
];

const conditions = ["new", "like-new", "good", "fair"];

const fieldClass =
  "h-11 rounded-xl border-border/60 bg-muted/30 px-3.5 text-sm shadow-none transition-all placeholder:text-muted-foreground/50 focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500/20 disabled:opacity-60";

const selectClass =
  "h-11 w-full rounded-xl border border-border/60 bg-muted/30 px-3.5 text-sm outline-none transition-all focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20";

const labelClass =
  "text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground";

interface EquipmentForm {
  name: string;
  description: string;
  category: string;
  location: string;
  price: string;
  rentalType: string;
  quantity: string;
  condition: string;
  brand: string;
  model: string;
  image: string;
  terms: string;
}

const initialForm: EquipmentForm = {
  name: "",
  description: "",
  category: "",
  location: "",
  price: "",
  rentalType: "daily",
  quantity: "1",
  condition: "",
  brand: "",
  model: "",
  image: "",
  terms: "",
};

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: ReactNode;
}) {
  return (
    <div className="min-w-0 space-y-2">
      <Label htmlFor={htmlFor} className={labelClass}>
        {label}
      </Label>
      {children}
    </div>
  );
}

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function AddEquipmentPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<EquipmentForm>(initialForm);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [imageName, setImageName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const loadOwner = async () => {
      try {
        const profile = await getMyProfile();
        setOwner(profile);
      } catch (err) {
        console.error("Failed to load owner profile:", err);
      } finally {
        setLoadingProfile(false);
      }
    };

    loadOwner();
  }, []);

  const updateField = (field: keyof EquipmentForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError("");
    setSuccess("");
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Image size must be less than 10 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setForm((prev) => ({
        ...prev,
        image: reader.result as string,
      }));
      setImageName(file.name);
      setError("");
    };

    reader.onerror = () => {
      setError("Failed to read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setForm((prev) => ({ ...prev, image: "" }));
    setImageName("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.image.trim()) {
      setError("Please upload an equipment image or provide an image URL.");
      return;
    }

    if (!owner) {
      setError("Owner information could not be loaded. Please log in again.");
      return;
    }

    setSubmitting(true);

    try {
      await createEquipment({
        name: form.name.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        price: Number(form.price),
        rentalType: form.rentalType as "daily" | "weekly" | "monthly",
        quantity: Number(form.quantity),
        condition: form.condition as "new" | "like-new" | "good" | "fair",
        brand: form.brand.trim(),
        model: form.model.trim(),
        image: form.image.trim(),
        terms: form.terms.trim(),
      });

      setSuccess(
        "Equipment submitted successfully! Waiting for admin approval.",
      );
      setForm(initialForm);
      setImageName("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to publish equipment.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-4xl space-y-5 px-3 py-6 sm:px-5 sm:py-8">
      {/* Page heading */}
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="h-10 w-10 shrink-0 rounded-xl border-border/60"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>

        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-yellow-600 dark:text-yellow-400">
            OWNER DASHBOARD
          </p>
          <h1 className="mt-1 text-xl font-black tracking-tight sm:text-2xl">
            Add Equipment
          </h1>
        </div>
      </div>

      {/* Single form card */}
      <form
        onSubmit={handleSubmit}
        className="overflow-hidden rounded-[24px] border border-border/60 bg-card shadow-[0_15px_50px_-30px_rgba(0,0,0,0.35)]"
      >
        {/* Compact dark form header */}
        <div className="relative overflow-hidden bg-[#171717] px-5 py-5 text-white sm:px-7">
          <div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full border-[25px] border-white/[0.035]" />
          <div className="pointer-events-none absolute -bottom-16 right-1/3 h-32 w-32 rounded-full bg-yellow-400/[0.08] blur-2xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-yellow-400 text-black shadow-lg shadow-yellow-400/10">
                <PackagePlus className="h-5 w-5" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-bold tracking-tight sm:text-lg">
                  Equipment Details
                </h2>
                <p className="mt-1 text-[11px] text-white/50">
                  Add information about your rental equipment
                </p>
              </div>
            </div>

            <Badge className="shrink-0 border border-yellow-400/20 bg-yellow-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-yellow-300 hover:bg-yellow-400/10">
              New Listing
            </Badge>
          </div>

          <div className="absolute bottom-0 left-0 h-[3px] w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-transparent" />
        </div>

        <div className="space-y-5 p-4 sm:p-7">
          {/* Name + Category */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label="Equipment Name *" htmlFor="name">
              <Input
                id="name"
                className={fieldClass}
                placeholder="e.g. Canon DSLR Camera"
                value={form.name}
                onChange={(e) => updateField("name", e.target.value)}
                minLength={3}
                maxLength={100}
                required
              />
            </Field>

            <Field label="Category *" htmlFor="category">
              <select
                id="category"
                className={selectClass}
                value={form.category}
                onChange={(e) => updateField("category", e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Description */}
          <Field label="Description *" htmlFor="description">
            <Textarea
              id="description"
              placeholder="Describe your equipment, its features and uses..."
              className="min-h-24 resize-y rounded-xl border-border/60 bg-muted/30 px-3.5 py-3 text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500/20"
              value={form.description}
              onChange={(e) => updateField("description", e.target.value)}
              minLength={20}
              maxLength={2000}
              required
            />
            <p className="text-right text-[10px] text-muted-foreground">
              {form.description.length}/2000
            </p>
          </Field>

          {/* Price + Rental type + Quantity */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Rental Price (৳) *" htmlFor="price">
              <Input
                id="price"
                type="number"
                min="1"
                step="0.01"
                className={fieldClass}
                placeholder="e.g. 500"
                value={form.price}
                onChange={(e) => updateField("price", e.target.value)}
                required
              />
            </Field>

            <Field label="Rental Type *" htmlFor="rentalType">
              <select
                id="rentalType"
                className={selectClass}
                value={form.rentalType}
                onChange={(e) => updateField("rentalType", e.target.value)}
                required
              >
                {["daily", "weekly", "monthly"].map((type) => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Available Quantity *" htmlFor="quantity">
              <Input
                id="quantity"
                type="number"
                min="1"
                step="1"
                className={fieldClass}
                placeholder="e.g. 2"
                value={form.quantity}
                onChange={(e) => updateField("quantity", e.target.value)}
                required
              />
            </Field>
          </div>

          {/* Brand + Model + Condition */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Field label="Brand" htmlFor="brand">
              <Input
                id="brand"
                className={fieldClass}
                placeholder="e.g. Canon"
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
              />
            </Field>

            <Field label="Model" htmlFor="model">
              <Input
                id="model"
                className={fieldClass}
                placeholder="e.g. EOS 90D"
                value={form.model}
                onChange={(e) => updateField("model", e.target.value)}
              />
            </Field>

            <Field label="Equipment Condition *" htmlFor="condition">
              <select
                id="condition"
                className={selectClass}
                value={form.condition}
                onChange={(e) => updateField("condition", e.target.value)}
                required
              >
                <option value="">Select condition</option>
                {conditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition.replace(/\b\w/g, (char) => char.toUpperCase())}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {/* Location */}
          <Field label="Location *" htmlFor="location">
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-yellow-600/80" />
              <Input
                id="location"
                className={`${fieldClass} pl-10`}
                placeholder="Enter equipment location"
                value={form.location}
                onChange={(e) => updateField("location", e.target.value)}
                minLength={3}
                required
              />
            </div>
          </Field>

          {/* Image upload */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <Label className={labelClass}>Equipment Image *</Label>
              <span className="text-[10px] text-muted-foreground">
                JPG · PNG · WEBP
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[170px_1fr]">
              {/* Preview */}
              <div className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-yellow-600/30 bg-yellow-500/[0.045] dark:bg-yellow-500/[0.06]">
                {form.image ? (
                  <>
                    <img
                      src={form.image}
                      alt="Equipment preview"
                      className="h-36 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute right-2 top-2 rounded-full bg-black/75 p-1.5 text-white transition hover:bg-red-600"
                      aria-label="Remove image"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="flex flex-col items-center gap-2 p-4 text-center">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-yellow-400/15 text-yellow-600 dark:text-yellow-400">
                      <ImagePlus className="h-5 w-5" />
                    </div>
                    <p className="text-xs font-bold">Image Preview</p>
                    <p className="text-[10px] text-muted-foreground">
                      Preview your image here
                    </p>
                  </div>
                )}
              </div>

              {/* Upload controls */}
              <div className="flex min-w-0 flex-col justify-center gap-3 rounded-xl border border-border/50 bg-muted/20 p-3.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="h-9 rounded-lg border-yellow-600/30 bg-yellow-500/5 px-3 text-xs font-bold hover:border-yellow-500 hover:bg-yellow-500/10"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="mr-2 h-3.5 w-3.5 text-yellow-600" />
                    Upload Image
                  </Button>

                  <span className="text-[10px] text-muted-foreground">
                    Maximum size 10 MB
                  </span>
                </div>

                {imageName && (
                  <p className="truncate text-xs font-medium text-green-600">
                    {imageName}
                  </p>
                )}

                <div className="space-y-1.5">
                  <Label
                    htmlFor="imageUrl"
                    className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground"
                  >
                    Or paste image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    className="h-10 rounded-lg border-border/60 bg-background text-xs shadow-none focus-visible:border-yellow-500 focus-visible:ring-yellow-500/20"
                    placeholder="https://example.com/image.jpg"
                    value={
                      form.image.startsWith("data:image/") ? "" : form.image
                    }
                    onChange={(e) => {
                      setImageName("");
                      updateField("image", e.target.value);
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Rental terms */}
          <Field label="Rental Terms and Conditions *" htmlFor="terms">
            <Textarea
              id="terms"
              placeholder="Mention rental rules, security deposit, return policy..."
              className="min-h-20 resize-y rounded-xl border-border/60 bg-muted/30 px-3.5 py-3 text-sm shadow-none placeholder:text-muted-foreground/50 focus-visible:border-yellow-500 focus-visible:ring-2 focus-visible:ring-yellow-500/20"
              value={form.terms}
              onChange={(e) => updateField("terms", e.target.value)}
              minLength={5}
              maxLength={1000}
              required
            />
            <p className="text-right text-[10px] text-muted-foreground">
              {form.terms.length}/1000
            </p>
          </Field>

          {/* Compact owner information */}
          <div className="rounded-2xl border border-yellow-600/20 bg-gradient-to-r from-yellow-500/[0.08] via-yellow-500/[0.035] to-transparent p-3.5 sm:p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-yellow-500/20">
                <AvatarImage
                  src={owner?.image || undefined}
                  alt={owner?.name || "Owner"}
                />
                <AvatarFallback className="bg-yellow-400 font-bold text-black">
                  {owner ? (
                    getInitials(owner.name || "Owner")
                  ) : (
                    <UserRound className="h-4 w-4" />
                  )}
                </AvatarFallback>
              </Avatar>

              <div className="min-w-0 flex-1">
                <h3 className="text-xs font-bold">Owner Information</h3>
                {loadingProfile ? (
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Loading your profile...
                  </p>
                ) : owner ? (
                  <p className="mt-1 truncate text-[11px] text-muted-foreground">
                    {owner.name} <span className="px-1">·</span> {owner.email}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-red-500">
                    Owner information unavailable.
                  </p>
                )}
              </div>

              <Badge
                variant="outline"
                className="shrink-0 border-yellow-600/25 bg-yellow-500/10 text-[9px] font-bold text-yellow-700 dark:text-yellow-400"
              >
                <CheckCircle2 className="mr-1 h-3 w-3" />
                Owner
              </Badge>
            </div>
          </div>

          {/* Status + actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-muted-foreground">
                Status
              </span>
              <Badge className="border border-yellow-600/20 bg-yellow-500/10 px-2.5 py-1 text-[10px] font-bold text-yellow-700 hover:bg-yellow-500/10 dark:text-yellow-400">
                <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-yellow-500" />
                Pending
              </Badge>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="h-9 rounded-xl border-border/70 px-4 text-xs font-semibold"
                onClick={() => router.push("/dashboard/owner/my-equipment")}
                disabled={submitting}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                size="sm"
                className="h-9 rounded-xl bg-yellow-400 px-4 text-xs font-bold text-black shadow-sm shadow-yellow-500/15 transition-all hover:-translate-y-0.5 hover:bg-yellow-500 hover:shadow-md"
                disabled={submitting || loadingProfile || !owner}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                    Publish Equipment
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Feedback */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-3.5 py-3 text-xs font-medium text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-xl border border-green-500/20 bg-green-500/5 px-3.5 py-3 text-xs font-medium text-green-700 dark:text-green-400">
              {success}
            </div>
          )}
        </div>
      </form>

      <p className="text-center text-[10px] text-muted-foreground">
        Your equipment will be reviewed by RENTRO admin before being published.
      </p>
    </div>
  );
}
