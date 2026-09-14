import { axiosInstance } from "@/api/authApi";
import { DepositListResponse, DepositStatus } from "../types/deposit";
import { WithdrawListResponse, WithdrawStatus } from "../types/withdraw";

export const transactionsApi = {
  getDeposits: async (
    page: number,
    username?: string,
    nickname?: string
  ): Promise<DepositListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(username && { username }),
      ...(nickname && { nickname }),
    });

    const response = await axiosInstance.get<DepositListResponse>(
      `/money/deposits/all?${params}`
    );
    return response.data;
  },

  getWithdraws: async (
    page: number,
    username?: string,
    nickname?: string
  ): Promise<WithdrawListResponse> => {
    const params = new URLSearchParams({
      page: page.toString(),
      ...(username && { username }),
      ...(nickname && { nickname }),
    });

    const response = await axiosInstance.get<WithdrawListResponse>(
      `/money/withdraws/all?${params}`
    );
    return response.data;
  },

  changeTransactionStatus: async (
    transactionId: number,
    status: DepositStatus | WithdrawStatus
  ) => {
    const response = await axiosInstance.put(
      `/money/transactions/${transactionId}/status`,
      { status }
    );
    return response.data;
  },
};
