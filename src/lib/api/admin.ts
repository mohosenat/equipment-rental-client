import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Types

export interface AdminUser {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  image?: string | null;
  role: "customer" | "owner" | "admin";
  createdAt?: string;
  updatedAt?: string;
}

export interface AdminEquipment {
  _id: string;
  name: string;
  description?: string;
  category: string;
  location: string;
  price: number;
  status: "pending" | "approved" | "rejected";
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface AdminBooking {
  _id: string;
  renterName?: string;
  renterEmail?: string;
  ownerName?: string;
  ownerEmail?: string;
  equipmentName?: string;
  startDate?: string;
  endDate?: string;
  totalAmount?: number;
  paymentStatus?: string;
  status?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AdminPayment {
  _id: string;
  bookingId?: string;
  renterId?: string;
  ownerId?: string;
  amount?: number;
  paymentStatus?: string;
  stripeSessionId?: string;
  createdAt?: string;
  [key: string]: unknown;
}

export interface AdminPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminQuery {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

export interface AdminListResponse<T> {
  data: T[];
  pagination: AdminPagination;
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

// Build query parameters

const buildQuery = (params: AdminQuery = {}) => {
  const query = new URLSearchParams();

  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  return query.toString();
};

// Get All Users

export const getAdminUsers = async (
  params: AdminQuery = {},
): Promise<AdminListResponse<AdminUser>> => {
  const headers = await getAuthHeaders();
  const query = buildQuery(params);

  const response = await fetch(
    `${API_URL}/admin/users${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load users.");
  }

  return {
    data: result.data,
    pagination: result.pagination,
  };
};

// Update User Role

export const updateAdminUserRole = async (
  userId: string,
  role: AdminUser["role"],
): Promise<void> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/admin/users/${userId}/role`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update user role.");
  }
};

// Get All Equipment

export const getAdminEquipment = async (
  params: AdminQuery = {},
): Promise<AdminListResponse<AdminEquipment>> => {
  const headers = await getAuthHeaders();
  const query = buildQuery(params);

  const response = await fetch(
    `${API_URL}/admin/equipment${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load equipment.");
  }

  return {
    data: result.data,
    pagination: result.pagination,
  };
};

// Approve or Reject Equipment

export const updateAdminEquipmentStatus = async (
  equipmentId: string,
  status: "approved" | "rejected",
): Promise<void> => {
  const headers = await getAuthHeaders();

  const response = await fetch(
    `${API_URL}/admin/equipment/${equipmentId}/status`,
    {
      method: "PATCH",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update equipment status.");
  }
};

// Get All Rentals / Bookings

export const getAdminBookings = async (
  params: AdminQuery = {},
): Promise<AdminListResponse<AdminBooking>> => {
  const headers = await getAuthHeaders();
  const query = buildQuery(params);

  const response = await fetch(
    `${API_URL}/admin/bookings${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load bookings.");
  }

  return {
    data: result.data,
    pagination: result.pagination,
  };
};

// Get All Payments

export const getAdminPayments = async (
  params: AdminQuery = {},
): Promise<AdminListResponse<AdminPayment>> => {
  const headers = await getAuthHeaders();
  const query = buildQuery(params);

  const response = await fetch(
    `${API_URL}/admin/payments${query ? `?${query}` : ""}`,
    {
      method: "GET",
      headers,
      cache: "no-store",
    },
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to load payments.");
  }

  return {
    data: result.data,
    pagination: result.pagination,
  };
};
// Update Equipment for Admin

export interface AdminEquipmentUpdateData {
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly";
  quantity: number;
  condition: string;
  brand?: string;
  model?: string;
  image?: string;
  terms?: string;
}

export const updateAdminEquipment = async (
  equipmentId: string,
  data: AdminEquipmentUpdateData,
): Promise<void> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/admin/equipment/${equipmentId}`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to update equipment.");
  }
};

// Delete Equipment for Admin

export const deleteAdminEquipment = async (
  equipmentId: string,
): Promise<void> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/admin/equipment/${equipmentId}`, {
    method: "DELETE",
    headers,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Failed to delete equipment.");
  }
};
