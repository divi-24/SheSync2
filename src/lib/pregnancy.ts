import { apiFetch } from './api';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface Pregnancy {
  _id?: string;
  cycle?: string;
  gestationalAge: string;
  dueDate: string;
  currentTrimester: number;
  firstTrimester: string;
  secondTrimester: string;
  thirdTrimester: string;
  milestones?: { week: number; milestone: string; date: string }[];
  daysUntilDue: number;
  babySize?: string;
  babyWeight?: string;
  weeklyTips?: string[];
  conceptionDate?: string;
  active?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function createPregnancy(data: Partial<Pregnancy>): Promise<Pregnancy> {
  const { ok, body } = await apiFetch('/api/pregnancy', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to create pregnancy');
  return body as Pregnancy;
}

export async function getActivePregnancy(): Promise<Pregnancy> {
  const { ok, body } = await apiFetch('/api/pregnancy/active');
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'No active pregnancy found');
  return body as Pregnancy;
}

export async function updatePregnancy(id: string, data: Partial<Pregnancy>): Promise<Pregnancy> {
  const { ok, body } = await apiFetch(`/api/pregnancy/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to update pregnancy');
  return body as Pregnancy;
}

export async function archivePregnancy(id: string): Promise<Pregnancy> {
  const { ok, body } = await apiFetch(`/api/pregnancy/${id}/archive`, {
    method: 'PATCH',
  });
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to archive pregnancy');
  return body as Pregnancy;
}

export async function getPregnancyHistory(): Promise<Pregnancy[]> {
  const { ok, body } = await apiFetch('/api/pregnancy');
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to fetch pregnancy history');
  return body as Pregnancy[];
}
