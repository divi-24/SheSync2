import { apiFetch } from "./api";

/**
 * Type definition for a menstrual cycle record
 */
export interface CycleData {
  _id: string;
  startDate: string;
  cycleLength: number;
  lutealPhaseLength: number;
  menstrualDuration: number;
  ovulationDate: string;
  fertileStart: string;
  fertileEnd: string;
  nextPeriod: string;
  menstrualEnd: string;
  symptoms?: Record<string, boolean>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Type definition for API error responses
 */
interface ApiErrorResponse {
  message?: string;
}

/**
 * Create a new cycle
 */
export async function createCycle(
  data: Partial<CycleData>
): Promise<CycleData> {
  const { ok, body } = await apiFetch("/api/cycles", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!ok) {
    throw new Error((body as ApiErrorResponse)?.message || "Failed to create cycle");
  }

  return body as CycleData;
}

/**
 * Get all cycles for the current user
 */
export async function getCycles(): Promise<CycleData[]> {
  const { ok, body } = await apiFetch("/api/cycles");

  if (!ok) {
    throw new Error((body as ApiErrorResponse)?.message || "Failed to fetch cycles");
  }

  return body as CycleData[];
}

/**
 * Get a specific cycle by ID
 */
export async function getCycleById(id: string): Promise<CycleData> {
  const { ok, body } = await apiFetch(`/api/cycles/${id}`);

  if (!ok) {
    throw new Error((body as ApiErrorResponse)?.message || "Failed to fetch cycle");
  }

  return body as CycleData;
}

/**
 * Update an existing cycle
 */
export async function updateCycle(
  id: string,
  updates: Partial<CycleData>
): Promise<CycleData> {
  const { ok, body } = await apiFetch(`/api/cycles/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
  });

  if (!ok) {
    throw new Error((body as ApiErrorResponse)?.message || "Failed to update cycle");
  }

  return body as CycleData;
}

/**
 * Delete a cycle by ID
 */
export async function deleteCycle(id: string): Promise<{ message: string }> {
  const { ok, body } = await apiFetch(`/api/cycles/${id}`, {
    method: "DELETE",
  });

  if (!ok) {
    throw new Error((body as ApiErrorResponse)?.message || "Failed to delete cycle");
  }

  return body as { message: string };
}
