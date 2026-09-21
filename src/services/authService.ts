import { apiClient } from "./apiClient";
import type { LoginPayload, AuthResponse } from "../types/auth";
import type { SignupDTO } from "../features/auth/components/SignupForm"; // adjust path to match your structure
import { normalizeUser } from "../utils/normalizeUser";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return { ...response.data, user: normalizeUser(response.data.user) };
  },

  async signup(payload: SignupDTO): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
    return { ...response.data, user: normalizeUser(response.data.user) };
  },
};