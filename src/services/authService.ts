import type User from "@/types/user";

type RegisterResponse = { token: string; user: User };
type LoginResponse = { token: string; user: User };
type MeResponse = { user: User };

async function handleResponse<T>(res: Response): Promise<T> {
  const contentType = res.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const body = isJson ? await res.json().catch(() => ({})) : {};

  if (!res.ok) {
    const message = (body && (body.message as string)) || `HTTP ${res.status}`;
    throw new Error(message);
  }
  return body as T;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
): Promise<RegisterResponse> {
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<RegisterResponse>(res);
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${process.env.API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(res);
}

export async function me(authToken: string): Promise<MeResponse> {
  const res = await fetch(`${process.env.API_URL}/auth/register`, {
    method: "GET",
    headers: { Authorization: "Bearer " + authToken },
  });
  return handleResponse<MeResponse>(res);
}
