export interface Message {
  id: number;
  title: string;
  content: string;
  isSentToAll: boolean;
  sentAt: string;
  readAt: string | null;
  username: string;
  nickname: string;
}

export interface MessageListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total: number;
    perPage: number;
    messages: Message[];
  };
}
