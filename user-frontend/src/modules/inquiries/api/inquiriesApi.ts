// messages api

import { axiosInstance } from "@/api/authApi";
import { TicketListResponse } from "../types/ticket";

export const inquiriesApi = {
  getTickets: async (
    page: number,
    username?: string,
    nickname?: string
  ): Promise<TicketListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(username && { username }),
      ...(nickname && { nickname }),
    });

    const response = await axiosInstance.get<TicketListResponse>(
      `/ticket/list-all?${params}`
    );
    return response.data;
  },

  replyTicket: async (ticketId: number, content: string) => {
    const response = await axiosInstance.post(`/ticket/${ticketId}/reply`, {
      content,
    });
    return response.data;
  },
};
