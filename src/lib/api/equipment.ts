import { authClient } from "@/lib/auth-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface Equipment {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly";
  quantity: number;
  condition: "new" | "like-new" | "good" | "fair";
  brand?: string;
  model?: string;
  image: string;
  terms: string;
  status: "pending" | "approved" | "rejected";
  ownerId: string;
  ownerEmail: string;
  createdAt: string;
  updatedAt: string;
}

export interface EquipmentInput {
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  rentalType: "hourly" | "daily" | "weekly" | "monthly";
  quantity: number;
  condition: "new" | "like-new" | "good" | "fair";
  brand?: string;
  model?: string;
  image: string;
  terms: string;
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

// Create equipment
export const createEquipment = async (
  equipmentData: EquipmentInput,
): Promise<Equipment> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/equipment`, {
    method: "POST",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipmentData),
  });

  const result = await handleResponse(response);

  return result.data;
};

// Get all equipment added by logged-in owner
export const getMyEquipment = async (): Promise<Equipment[]> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/equipment/my`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
};

// Get single equipment details
export const getEquipmentById = async (id: string): Promise<Equipment> => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: "GET",
    headers,
    cache: "no-store",
  });

  const result = await handleResponse(response);

  return result.data;
};

// Update equipment
export const updateEquipment = async (
  id: string,
  equipmentData: Partial<EquipmentInput>,
) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: "PATCH",
    headers: {
      ...headers,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(equipmentData),
  });

  return await handleResponse(response);
};

// Delete equipment
export const deleteEquipment = async (id: string) => {
  const headers = await getAuthHeaders();

  const response = await fetch(`${API_URL}/equipment/${id}`, {
    method: "DELETE",
    headers,
  });

  return await handleResponse(response);
};
