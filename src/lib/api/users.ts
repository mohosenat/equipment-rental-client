import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  image: string | null;
  phone: string;
  address: string;
  role: string;
  emailVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Get JWT token from Better Auth
const getAuthHeaders = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please log in again.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
  };
};

// Get My Profile
export const getMyProfile = async (): Promise<UserProfile> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/users/me`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load profile.");
  }

  return result.data;
};

// Update My Profile
export const updateMyProfile = async (
  profileData: Partial<
    Pick<UserProfile, "name" | "image" | "phone" | "address">
  >,
): Promise<UserProfile> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/users/me`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(profileData),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update profile.");
  }

  return result.data;
};
