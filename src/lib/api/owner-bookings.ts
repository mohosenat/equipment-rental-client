import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface OwnerRentalBooking {
  _id: string;
  equipmentId: string;
  equipmentName: string;
  equipmentImage?: string;
  renterId: string;
  renterEmail: string;
  renterName?: string;
  ownerId: string;
  ownerEmail: string;
  startDate: string;
  endDate: string;
  quantity: number;
  contactNumber?: string;
  deliveryAddress?: string;
  notes?: string;
  rentalDuration: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly";
  pricePerUnit: number;
  totalAmount: number;
  paymentStatus: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Get JWT authorization headers
const getAuthHeaders = async () => {
  const { data, error } = await authClient.token();

  if (error || !data?.token) {
    throw new Error("Authentication required. Please log in again.");
  }

  return {
    Authorization: `Bearer ${data.token}`,
  };
};

// Handle API response
const handleResponse = async (response: Response) => {
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong.");
  }

  return result;
};

// Get all rental bookings for logged-in owner
export const getMyRentalBookings = async (): Promise<OwnerRentalBooking[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/owner/bookings`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
};

// Get single owner booking details
export const getOwnerBookingById = async (
  id: string,
): Promise<OwnerRentalBooking> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/owner/bookings/${id}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
};

// Update booking status
export const updateOwnerBookingStatus = async (id: string, status: string) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/owner/bookings/${id}/status`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ status }),
  });

  return await handleResponse(response);
};
