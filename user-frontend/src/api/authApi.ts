import axios from "axios";
import { LoginRequest, LoginResponse } from "@/modules/auth/types";

export const API_BASE_URL = "https://luna-api.thea.bet"; // Use your real API base URL

export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor for auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Remove token and redirect to login
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; // Use window.location to force reload and clear state
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        "/auth/login",
        credentials
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(error.response.data?.message || "Login failed");
      }
      throw new Error("Network error occurred");
    }
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      const response = await axiosInstance.post("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        throw new Error(
          error.response.data?.message || "Change password failed"
        );
      }
      throw new Error("Network error occurred");
    }
  },
};
