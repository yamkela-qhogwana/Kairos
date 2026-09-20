import { API_BASE_URL } from './config';

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  streetAddress: string;
  apartmentUnit?: string;
  suburb: string;
  city: string;
  postalCode: string;
  phoneNumber: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type ResetPasswordPayload = {
  email: string;
  newPassword: string;
};

export type AuthResponse = {
  token: string;
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
};

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function postAuth<T>(path: string, payload: unknown): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? 'Something went wrong. Please try again.';
    throw new ApiError(response.status, message);
  }

  return response.json();
}

export function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  return postAuth<AuthResponse>('/api/auth/register', payload);
}

export function loginUser(payload: LoginPayload): Promise<AuthResponse> {
  return postAuth<AuthResponse>('/api/auth/login', payload);
}

export function resetPassword(payload: ResetPasswordPayload): Promise<{ message: string }> {
  return postAuth<{ message: string }>('/api/auth/reset-password', payload);
}

export async function checkEmailExists(email: string): Promise<boolean> {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/check-email?email=${encodeURIComponent(email)}`,
  );
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    const message = body?.message ?? 'Something went wrong. Please try again.';
    throw new ApiError(response.status, message);
  }
  const body = await response.json();
  return body.exists;
}
