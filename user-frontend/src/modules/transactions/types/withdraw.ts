export type WithdrawStatus = "PENDING" | "WAITING" | "ACCEPTED" | "REJECTED";

export interface Withdraw {
  id: number;
  userId: number;
  username: string;
  nickname: string;
  type: "WITHDRAW";
  status: WithdrawStatus;
  requestedAt: string;
  approvedAt?: string;
  beforeAmount: string;
}

export interface WithdrawListResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    perPage: number;
    transactions: Withdraw[];
  };
  code: number;
}
