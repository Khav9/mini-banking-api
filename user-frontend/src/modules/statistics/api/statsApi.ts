import { axiosInstance } from "@/api/authApi";

export interface DailyMonthlyStats {
  date: string;
  newUsers: number;
  activeUsers: number;
  totalBetAmount: number;
  totalWinAmount: number;
  totalDepositAmount: number;
  totalWithdrawAmount: number;
  rollingAmount: number;
  profitAmount: number;
}

export interface DailyMonthlyStatsResponse {
  page: number;
  size: number;
  total: number;
  list: DailyMonthlyStats[];
}

export interface GetDailyMonthlyStatsParams {
  page: number;
  startDate?: string;
  endDate?: string;
  period?: "daily" | "monthly";
}

export interface MemberStats {
  username: string;
  nickname: string;
  totalBetAmount: number;
  totalWinAmount: number;
  betCount: number;
  winCount: number;
  rollingAmount: number;
  profitLossAmount: number;
  depositAmount: number;
  withdrawAmount: number;
}

export interface MemberStatsResponse {
  page: number;
  size: number;
  total: number;
  list: MemberStats[];
}

export interface GetMemberStatsParams {
  page: number;
  startDate?: string;
  endDate?: string;
  query?: string;
}

export interface ProfitLossRank {
  rank: number;
  username: string;
  nickname: string;
  gameType: string;
  totalBetAmount: number;
  totalWinAmount: number;
  profitLossAmount: number;
  rollingAmount: number;
  betCount: number;
}

export interface ProfitLossRankResponse {
  page: number;
  size: number;
  total: number;
  list: ProfitLossRank[];
}

export interface GetProfitLossRankParams {
  page: number;
  startDate?: string;
  endDate?: string;
  gameType?: "casino" | "slot" | "minigame" | "all";
  rankType?: "profit" | "loss";
}

export interface GameStats {
  gameName: string;
  category: string;
  totalBetAmount: number;
  totalWinAmount: number;
  betCount: number;
  playerCount: number;
  rollingAmount: number;
  profitAmount: number;
}

export interface GameStatsResponse {
  page: number;
  size: number;
  total: number;
  list: GameStats[];
}

export interface GetGameStatsParams {
  page: number;
  startDate?: string;
  endDate?: string;
  category?: "casino" | "slot" | "minigame";
}

export interface PartnerStats {
  partnerUsername: string;
  partnerNickname: string;
  totalMembers: number;
  activeMembers: number;
  totalBetAmount: number;
  totalWinAmount: number;
  rollingAmount: number;
  commissionAmount: number;
  profitAmount: number;
}

export interface PartnerStatsResponse {
  page: number;
  size: number;
  total: number;
  list: PartnerStats[];
}

export interface GetPartnerStatsParams {
  page: number;
  startDate?: string;
  endDate?: string;
  partnerUsername?: string;
}

export interface DepositWithdrawStats {
  transactionId: number;
  username: string;
  type: string; // "deposit" | "withdraw"
  amount: number;
  status: string; // "approved" | "pending" | "rejected"
  requestedDate: string;
  processedDate: string;
  bankName: string;
  accountNumber: string;
}

export interface DepositWithdrawStatsResponse {
  page: number;
  size: number;
  total: number;
  totalDepositAmount: number;
  totalWithdrawAmount: number;
  list: DepositWithdrawStats[];
}

export interface GetDepositWithdrawStatsParams {
  page: number;
  startDate?: string;
  endDate?: string;
  type?: "deposit" | "withdraw" | "all";
  status?: "approved" | "pending" | "waiting" | "rejected" | "all";
  username?: string;
}

export interface UserBetProfitLossStats {
  username: string;
  nickname: string;
  gameType: string;
  totalBetAmount: number;
  totalWinAmount: number;
  betCount: number;
  winCount: number;
  rollingAmount: number;
  profitLossAmount: number;
  winRatePercentage: number;
}

export interface UserBetProfitLossStatsResponse {
  page: number;
  size: number;
  total: number;
  list: UserBetProfitLossStats[];
}

export interface GetUserBetProfitLossStatsParams {
  page: number;
  startDate?: string;
  endDate?: string;
  username?: string;
  gameType?: "casino" | "slot" | "minigame" | "all";
}

export const statsApi = {
  getDailyMonthlyStats: async (params: GetDailyMonthlyStatsParams) => {
    const response = await axiosInstance.get<DailyMonthlyStatsResponse>(
      "/stats/daily-monthly",
      { params }
    );
    return response.data;
  },
  getMemberStats: async (params: GetMemberStatsParams) => {
    const response = await axiosInstance.get<MemberStatsResponse>(
      "/stats/member",
      { params }
    );
    return response.data;
  },
  getProfitLossRank: async (params: GetProfitLossRankParams) => {
    const response = await axiosInstance.get<ProfitLossRankResponse>(
      "/stats/profit-loss-rank",
      { params }
    );
    return response.data;
  },
  getGameStats: async (params: GetGameStatsParams) => {
    const response = await axiosInstance.get<GameStatsResponse>("/stats/game", {
      params,
    });
    return response.data;
  },
  getPartnerStats: async (params: GetPartnerStatsParams) => {
    const response = await axiosInstance.get<PartnerStatsResponse>(
      "/stats/partner",
      { params }
    );
    return response.data;
  },
  getDepositWithdrawStats: async (params: GetDepositWithdrawStatsParams) => {
    const response = await axiosInstance.get<DepositWithdrawStatsResponse>(
      "/stats/deposit-withdraw",
      { params }
    );
    return response.data;
  },
  getUserBetProfitLossStats: async (
    params: GetUserBetProfitLossStatsParams
  ) => {
    const response = await axiosInstance.get<UserBetProfitLossStatsResponse>(
      "/stats/user-bet-profit-loss",
      { params }
    );
    return response.data;
  },
  changeTransactionStatus: async (transactionId: number, status: string) => {
    const response = await axiosInstance.put(
      `/money/transactions/${transactionId}/status`,
      { status }
    );
    return response.data;
  },
};
