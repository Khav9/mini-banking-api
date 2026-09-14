import { axiosInstance } from "@/api/authApi";
import {
  PointExchangeHistoryListResponse,
  PointExchangeHistoryFilters,
} from "../types/point-exchange";

export const pointExchangeApi = {
  getHistory: async (
    filters: PointExchangeHistoryFilters
  ): Promise<PointExchangeHistoryListResponse> => {
    const params = new URLSearchParams();
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.startDate) params.append("startDate", filters.startDate);
    if (filters.endDate) params.append("endDate", filters.endDate);
    if (filters.username) params.append("username", filters.username);
    if (filters.nickname) params.append("nickname", filters.nickname);

    const response = await axiosInstance.get<PointExchangeHistoryListResponse>(
      `/point-exchange/history/all?${params.toString()}`
    );
    return response.data;
  },
};
