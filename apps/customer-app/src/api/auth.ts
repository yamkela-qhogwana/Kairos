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

export async function registerUser(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
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
