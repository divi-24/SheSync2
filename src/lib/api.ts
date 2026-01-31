export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000';

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  body: T;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    // Determine if we're sending FormData
    const isFormData = options.body instanceof FormData;

    // Set default headers, but don't override Content-Type for FormData
    const defaultHeaders: Record<string, string> = isFormData
      ? {}
      : { 'Content-Type': 'application/json' };

    const res = await fetch(`${API_BASE}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    let json: T;
    try {
      json = await res.json();
    } catch {
      // Handle empty responses or non-JSON responses
      json = {} as T;
    }

    return {
      ok: res.ok,
      status: res.status,
      body: json
    };
  } catch (error) {
    console.error('API fetch error:', error);

    return {
      ok: false,
      status: 0,
      body: {
        message: error instanceof Error ? error.message : 'Network error'
      } as T,
    };
  }
}