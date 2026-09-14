export interface Ticket {
  id: number;
  writerUsername: string;
  writerNickname: string;
  content: string;
  writeAt: string;
  reply: string | null;
  replyAt?: string;
  readAt?: string;
}

export interface TicketListResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    perPage: number;
    tickets: Ticket[];
  };
  code: number;
}
