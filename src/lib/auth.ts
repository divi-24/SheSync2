import { apiFetch } from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  parentOf?: string | null;
  partnerOf?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  user?: User;
  token?: string;
  message?: string;
}

export async function getProfile(): Promise<User> {
  const { ok, body } = await apiFetch('/api/auth/profile', {
    method: 'GET',
    // Remove redundant credentials and headers - they're set in apiFetch
  });
  console.log('getProfile response:', (body as AuthResponse).user);
  
  if (!ok) {
    throw new Error((body as AuthResponse)?.message || 'Not authenticated');
  }
  
  const user = (body as AuthResponse).user;
  if (!user) {
    throw new Error('User not found in response');
  }
  return user;
}


// Utility function to check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  try {
    await getProfile();
    return true;
  } catch {
    return false;
  }
}
  export async function login(email: string, password: string): Promise<AuthResponse> {
    // Input validation
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    if (!password?.trim()) {
      throw new Error('Password is required');
    }
  
    const { ok, body } = await apiFetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ 
        email: email.trim().toLowerCase(), 
        password 
      }),
      // Remove redundant credentials and headers
    });
    
    if (!ok) {
      throw new Error((body as AuthResponse)?.message || 'Login failed');
    }
    
    return body as AuthResponse;
  }
  
  export async function signup(payload: { 
    name: string; 
    email: string; 
    role: string; 
    password: string; 
  }): Promise<AuthResponse> {
    // Input validation
    const { name, email, role, password } = payload;
    
    if (!name?.trim()) {
      throw new Error('Name is required');
    }
    if (!email?.trim()) {
      throw new Error('Email is required');
    }
    if (!role?.trim()) {
      throw new Error('Role is required');
    }
    if (!password?.trim()) {
      throw new Error('Password is required');
    }
  
    const { ok, body } = await apiFetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: role.trim(),
        password,
        inviterEmail: (payload as any).inviterEmail ? (payload as any).inviterEmail.trim().toLowerCase() : undefined
      }),
      // Remove redundant credentials and headers
    });
    
    if (!ok) {
      throw new Error((body as AuthResponse)?.message || 'Signup failed');
    }
    
    return body as AuthResponse;
  }
  
  export async function logout(): Promise<boolean> {
    try {
      const { ok } = await apiFetch('/api/auth/logout', {
        method: 'POST',
        // Remove redundant credentials and headers
      });
      
      return ok;
    } catch (error) {
      console.warn('Logout failed:', error);
      return false;
    }
  }