// services/authService.ts
import { apiClient } from "./apiClient";
import type { LoginPayload, SignupPayload, AuthResponse } from "../types/auth";
import { normalizeUser } from "../utils/normalizeUser";

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/login", payload);
    return { ...response.data, user: normalizeUser(response.data.user) };
  },

  async signup(payload: SignupPayload): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>("/auth/signup", payload);
    return { ...response.data, user: normalizeUser(response.data.user) };
  },
};