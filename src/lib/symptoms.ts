import { apiFetch } from './api';

interface ApiErrorResponse {
  message?: string;
  error?: string;
}

export interface Symptom {
  _id?: string;
  user?: string;
  date: string;
  cramps?: boolean;
  headaches?: boolean;
  moodSwings?: boolean;
  bloating?: boolean;
  breastTenderness?: boolean;
  severity?: Record<string, number>;
  notes?: string;
}

export async function upsertSymptom(data: Symptom): Promise<Symptom> {
  const { ok, body } = await apiFetch('/api/symptoms', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to save symptom');
  return body as Symptom;
}

export async function getSymptoms(): Promise<Symptom[]> {
  const { ok, body } = await apiFetch('/api/symptoms');
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to fetch symptoms');
  return body as Symptom[];
}

export async function getSymptomByDate(date: string): Promise<Symptom> {
  const { ok, body } = await apiFetch(`/api/symptoms/${date}`);
  if (!ok) throw new Error((body as ApiErrorResponse)?.message || 'Failed to fetch symptom');
  return body as Symptom;
}
