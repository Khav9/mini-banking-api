import { axiosInstance } from "@/api/authApi";
import { ProviderListResponse } from "../types/provider";

export interface UpdateProviderData {
  names?: {
    [key: string]: string;
  };
  enabled?: boolean;
}

export const providersApi = {
  getProviders: async (): Promise<ProviderListResponse> => {
    const response = await axiosInstance.get<ProviderListResponse>("/provider");
    return response.data;
  },

  updateProvider: async (providerId: number, data: UpdateProviderData) => {
    const response = await axiosInstance.put(`/provider/${providerId}`, data);
    return response.data;
  },
};
