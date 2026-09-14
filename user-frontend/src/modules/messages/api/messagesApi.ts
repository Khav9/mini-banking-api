// Messages api

import { axiosInstance } from "@/api/authApi";
import { MessageListResponse } from "../types/message";

export interface GetMessagesParams {
  page: number;
  username?: string;
  nickname?: string;
}

export interface WriteMessageData {
  sendToAll: boolean;
  receiver?: string;
  title: string;
  content: string;
}

export const messagesApi = {
  getMessages: async (
    params: GetMessagesParams
  ): Promise<MessageListResponse> => {
    const queryParams = new URLSearchParams({
      page: params.page.toString(),
      ...(params.username && { username: params.username }),
      ...(params.nickname && { nickname: params.nickname }),
    });

    const { data } = await axiosInstance.get<MessageListResponse>(
      `/message/all/list?${queryParams}`
    );
    return data;
  },

  writeMessage: async (messageData: WriteMessageData) => {
    const { data } = await axiosInstance.post("/message", messageData);
    return data;
  },
};
