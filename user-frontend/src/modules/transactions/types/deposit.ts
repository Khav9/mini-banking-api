export type DepositStatus = "PENDING" | "WAITING" | "ACCEPTED" | "REJECTED";

export interface Deposit {
  id: number;
  userId: number;
  username: string;
  nickname: string;
  type: "DEPOSIT";
  status: DepositStatus;
  requestedAt: string;
  approvedAt?: string;
  beforeAmount: string;
}

export interface DepositListResponse {
  success: boolean;
  message: string;
  data: {
    count: number;
    perPage: number;
    transactions: Deposit[];
  };
  code: number;
}
