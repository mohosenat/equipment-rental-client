"use client";

import { useCallback, useEffect, useState } from "react";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  Camera,
  RefreshCw,
  Save,
  Loader2,
  ShieldCheck,
  CalendarDays,
  X,
  CheckCircle2,
} from "lucide-react";

import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "@/lib/api/users";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    image: "",
    phone: "",
    address: "",
  });

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();

      setProfile(data);
      setForm({
        name: data.name || "",
        image: data.image || "",
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.name.trim()) {
      setError("Please enter your name.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const updated = await updateMyProfile({
        name: form.name.trim(),
        image: form.image.trim(),
        phone: form.phone.trim(),
        address: form.address.trim(),
      });

      setProfile(updated);
      setForm({
        name: updated.name || "",
        image: updated.image || "",
        phone: updated.phone || "",
        address: updated.address || "",
      });

      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (date?: string) =>
    date
      ? new Date(date).toLocaleDateString("en-BD", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "Not available";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin text-yellow-500" size={32} />
        <p className="text-sm text-muted-foreground">Loading your profile...</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-4 py-12 text-center">
        <UserRound className="mx-auto text-muted-foreground" size={35} />
        <p className="font-semibold">Could not load your profile.</p>
        <p className="text-sm text-red-500">{error}</p>
        <Button onClick={loadProfile} variant="outline">
          <RefreshCw size={16} className="mr-2" /> Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-7 pb-10">
      <div className="relative overflow-hidden rounded-2xl bg-[#171717] p-6 text-white shadow-lg sm:p-8">
        <div className="absolute -right-12 -top-20 size-64 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="relative z-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-yellow-400">
              <UserRound size={15} /> Admin Dashboard
            </div>
            <h1 className="text-2xl font-bold sm:text-3xl">My Profile</h1>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/60">
              Manage your administrator account and personal information.
            </p>
          </div>
          <Badge className="w-fit border border-yellow-400/30 bg-yellow-400/10 px-3 py-2 text-yellow-400 hover:bg-yellow-400/10">
            <ShieldCheck size={15} className="mr-2" /> Administrator
          </Badge>
        </div>
        <div className="absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r from-yellow-300 via-yellow-500 to-transparent" />
      </div>

      {error && (
        <div className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          <span>{error}</span>
          <button onClick={() => setError("")}>
            <X size={16} />
          </button>
        </div>
      )}

      {success && (
        <div className="flex items-center justify-between rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-600">
          <span className="flex items-center gap-2">
            <CheckCircle2 size={16} /> {success}
          </span>
          <button onClick={() => setSuccess("")}>
            <X size={16} />
          </button>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <Card className="h-fit overflow-hidden rounded-2xl border-border shadow-sm">
          <div className="h-24 bg-[#171717]" />
          <CardContent className="relative px-5 pb-6">
            <div className="-mt-12 flex size-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-background bg-muted text-3xl font-bold">
              {form.image ? (
                <img
                  src={form.image}
                  alt={form.name}
                  className="size-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                form.name.charAt(0).toUpperCase() || "A"
              )}
            </div>

            <h2 className="mt-4 text-xl font-bold">
              {profile.name || "Administrator"}
            </h2>
            <p className="mt-1 break-all text-sm text-muted-foreground">
              {profile.email}
            </p>

            <Badge className="mt-3 border border-yellow-500/20 bg-yellow-500/10 text-yellow-700 hover:bg-yellow-500/10 dark:text-yellow-400">
              <ShieldCheck size={13} className="mr-1" /> Admin Account
            </Badge>

            <div className="mt-6 space-y-4 border-t border-border pt-5">
              <div className="flex items-start gap-3 text-sm">
                <Mail
                  size={17}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="mt-1 break-all font-medium">{profile.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Phone</p>
                  <p className="mt-1 font-medium">
                    {profile.phone || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="mt-1 font-medium">
                    {profile.address || "Not added"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-sm">
                <CalendarDays
                  size={17}
                  className="mt-0.5 shrink-0 text-muted-foreground"
                />
                <div>
                  <p className="text-xs text-muted-foreground">Joined</p>
                  <p className="mt-1 font-medium">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden rounded-2xl border-border shadow-sm">
          <div className="border-b border-border p-5 sm:p-6">
            <h2 className="text-lg font-bold">Personal Information</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Update your profile details below.
            </p>
          </div>

          <CardContent className="p-5 sm:p-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={form.name}
                  onChange={(event) =>
                    setForm({ ...form, name: event.target.value })
                  }
                  placeholder="Your full name"
                  required
                  minLength={2}
                  maxLength={80}
                  className="h-11 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-email">Email Address</Label>
                <Input
                  id="profile-email"
                  value={profile.email}
                  readOnly
                  className="h-11 rounded-xl bg-muted/50"
                />
                <p className="text-xs text-muted-foreground">
                  Email address cannot be changed from this page.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-image">Profile Image URL</Label>
                <div className="relative">
                  <Camera
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="profile-image"
                    type="url"
                    value={form.image}
                    onChange={(event) =>
                      setForm({ ...form, image: event.target.value })
                    }
                    placeholder="https://example.com/profile.jpg"
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste a publicly accessible image URL.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-phone">Phone Number</Label>
                <div className="relative">
                  <Phone
                    size={17}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  />
                  <Input
                    id="profile-phone"
                    value={form.phone}
                    onChange={(event) =>
                      setForm({ ...form, phone: event.target.value })
                    }
                    placeholder="Enter phone number"
                    className="h-11 rounded-xl pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-address">Address</Label>
                <Textarea
                  id="profile-address"
                  value={form.address}
                  onChange={(event) =>
                    setForm({ ...form, address: event.target.value })
                  }
                  placeholder="Enter your address"
                  rows={4}
                  className="resize-none rounded-xl"
                />
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="outline"
                  disabled={saving}
                  onClick={() =>
                    setForm({
                      name: profile.name || "",
                      image: profile.image || "",
                      phone: profile.phone || "",
                      address: profile.address || "",
                    })
                  }
                >
                  Reset Changes
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-yellow-400 font-semibold text-black hover:bg-yellow-300"
                >
                  {saving ? (
                    <>
                      <Loader2 size={17} className="mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save size={17} className="mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
