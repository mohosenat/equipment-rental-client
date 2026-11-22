"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getMyProfile,
  updateMyProfile,
  type UserProfile,
} from "@/lib/api/users";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  UserRound,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  CalendarDays,
  Camera,
  Save,
  Loader2,
  RefreshCw,
} from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getMyProfile();

      setProfile(data);
      setName(data.name || "");
      setImage(data.image || "");
      setPhone(data.phone || "");
      setAddress(data.address || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load profile.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);

      await updateMyProfile({
        name: name.trim(),
        image: image.trim(),
        phone: phone.trim(),
        address: address.trim(),
      });

      await loadProfile();

      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to update profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (value: string) => {
    return value
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
          <p className="text-sm text-muted-foreground">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!profile && error) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Card>
          <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="text-sm text-destructive">{error}</p>
            <Button onClick={loadProfile}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) return null;

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-10">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-[#202020] px-6 py-9 text-white sm:px-10 sm:py-12">
        <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-yellow-400/10 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-1 w-full bg-yellow-400" />

        <div className="relative z-10 flex flex-col gap-5">
          <Badge className="w-fit border-yellow-400/30 bg-yellow-400/10 text-yellow-400">
            {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}{" "}
            Dashboard
          </Badge>

          <div>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              My Profile
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/65 sm:text-base">
              Manage your personal information and keep your RENTRO account
              details up to date.
            </p>
          </div>
        </div>
      </section>

      {/* Profile overview */}
      <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
        <Card className="h-fit overflow-hidden">
          <CardHeader className="border-b">
            <CardTitle>Profile Overview</CardTitle>
            <CardDescription>Your RENTRO account information</CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col items-center px-6 py-8 text-center">
            <div className="relative">
              <Avatar className="h-28 w-28 border-4 border-yellow-400/30">
                <AvatarImage
                  src={profile.image || image || undefined}
                  alt={profile.name}
                />
                <AvatarFallback className="bg-yellow-400 text-xl font-bold text-black">
                  {getInitials(profile.name || "Owner")}
                </AvatarFallback>
              </Avatar>

              <div className="absolute -bottom-1 -right-1 flex h-9 w-9 items-center justify-center rounded-full border-4 border-background bg-yellow-400 text-black">
                <Camera className="h-4 w-4" />
              </div>
            </div>

            <h2 className="mt-5 text-xl font-bold">{profile.name}</h2>

            <p className="mt-1 break-all text-sm text-muted-foreground">
              {profile.email}
            </p>

            <Badge className="mt-4 bg-yellow-400 text-black hover:bg-yellow-400">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" />
              {profile.role}
            </Badge>

            <div className="mt-8 w-full space-y-4 text-left">
              <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <Mail className="mt-0.5 h-4 w-4 text-yellow-500" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Email Address</p>
                  <p className="mt-1 break-all text-sm font-medium">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <Phone className="mt-0.5 h-4 w-4 text-yellow-500" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Phone Number</p>
                  <p className="mt-1 break-all text-sm font-medium">
                    {profile.phone || "Not added yet"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                <MapPin className="mt-0.5 h-4 w-4 text-yellow-500" />
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">Address</p>
                  <p className="mt-1 break-words text-sm font-medium">
                    {profile.address || "Not added yet"}
                  </p>
                </div>
              </div>

              {profile.createdAt && (
                <div className="flex items-start gap-3 rounded-xl bg-muted/50 p-4">
                  <CalendarDays className="mt-0.5 h-4 w-4 text-yellow-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Member Since
                    </p>
                    <p className="mt-1 text-sm font-medium">
                      {new Date(profile.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit profile */}
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Edit Profile</CardTitle>
            <CardDescription>
              Update your personal information below.
            </CardDescription>
          </CardHeader>

          <CardContent className="pt-6">
            <form onSubmit={handleUpdate} className="space-y-6">
              {/* Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  required
                  maxLength={100}
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={profile.email}
                  disabled
                  className="cursor-not-allowed bg-muted"
                />
                <p className="text-xs text-muted-foreground">
                  Your email address cannot be changed here.
                </p>
              </div>

              {/* Image */}
              <div className="space-y-2">
                <Label htmlFor="image">Profile Image URL</Label>
                <Input
                  id="image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="https://example.com/profile.jpg"
                />

                {image.trim() && (
                  <div className="flex items-center gap-4 rounded-xl border p-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={image} alt="Profile preview" />
                      <AvatarFallback>
                        {getInitials(name || "Owner")}
                      </AvatarFallback>
                    </Avatar>

                    <div className="min-w-0">
                      <p className="text-sm font-medium">Image Preview</p>
                      <p className="break-all text-xs text-muted-foreground">
                        Your profile image preview
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1XXXXXXXXX"
                  maxLength={20}
                />
              </div>

              {/* Address */}
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter your location or address"
                  maxLength={250}
                />
              </div>

              {/* Messages */}
              {error && (
                <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {error}
                </div>
              )}

              {success && (
                <div className="rounded-xl border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-600">
                  {success}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col gap-3 border-t pt-6 sm:flex-row sm:justify-end">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setName(profile.name || "");
                    setImage(profile.image || "");
                    setPhone(profile.phone || "");
                    setAddress(profile.address || "");
                    setError("");
                    setSuccess("");
                  }}
                >
                  Reset Changes
                </Button>

                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-yellow-400 text-black hover:bg-yellow-500"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
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
