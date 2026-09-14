import { axiosInstance } from "@/api/authApi";
import {
  UpstreamListResponse,
  UpdateUpstreamRequest,
  UpdateUpstreamResponse,
} from "../types/upstream";

export const upstreamApi = {
  getUpstreams: async (): Promise<UpstreamListResponse> => {
    const response = await axiosInstance.get<UpstreamListResponse>("/upstream");
    return response.data;
  },

  updateUpstream: async (
    upstreamId: number,
    data: UpdateUpstreamRequest
  ): Promise<UpdateUpstreamResponse> => {
    const response = await axiosInstance.put<UpdateUpstreamResponse>(
      `/upstream/${upstreamId}`,
      data
    );
    return response.data;
  },

  syncUpstream: async (upstreamId: number): Promise<UpdateUpstreamResponse> => {
    const response = await axiosInstance.post<UpdateUpstreamResponse>(
      `/upstream/${upstreamId}/sync`
    );
    return response.data;
  },
};
