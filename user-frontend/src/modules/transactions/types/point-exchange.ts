export interface PointExchangeHistory {
  id: string;
  username: string;
  nickname: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAW";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  updatedAt: string;
}

export interface PointExchangeHistoryListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    total: number;
    perPage: number;
    history: PointExchangeHistory[];
  };
}

export interface PointExchangeHistoryFilters {
  page?: number;
  startDate?: string;
  endDate?: string;
  username?: string;
  nickname?: string;
}
