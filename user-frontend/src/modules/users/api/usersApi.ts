import { axiosInstance } from "@/api/authApi";

export interface UserTreeResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    list: {
      id: number;
      username: string;
      nickname: string;
      status: string;
      balance: number;
      point: number;
      joinDate: string;
      parentUsername?: string;
    }[];
  };
}

export interface GetUserTreeParams {
  startDate?: string;
  endDate?: string;
  parentUsername?: string;
}

export interface UserListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    page: number;
    size: number;
    total: number;
    list: {
      id: number;
      parentUsername?: string;
      username: string;
      nickname: string;
      status: "APPROVED" | "PENDING" | "BLOCKED";
      balance: number;
      point: number;
      joinDate: string;
      lastLoginDate?: string;
    }[];
  };
}

export interface GetUserListParams {
  page: number;
  startDate?: string;
  endDate?: string;
  status?: "APPROVED" | "PENDING" | "BLOCKED";
  query?: string;
}

export interface UserDetailResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    id: number;
    username: string;
    nickname: string;
    status: "PENDING" | "APPROVED" | "BLOCKED";
    recommendEnabled: boolean;
    recommendCode: string;
    partnerPageEnabled: boolean;
    level: number;
    balance: number;
    point: number;
    phone: string;
    phoneCarrier: string;
    gender: string;
    bank: string;
    accountNumber: string;
    accountOwner: string;
    birth: string;
    joinDate: string;
    lastLogin: string;
    parentUsername: string;
    casinoRollingRatio: number;
    slotRollingRatio: number;
  };
}

export interface AdjustBalanceResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface AdjustPointResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}

export interface EditUserRequest {
  nickname: string;
  status: "PENDING" | "APPROVED" | "BLOCKED";
  recommendEnabled: boolean;
  recommendCode: string;
  partnerPageEnabled: boolean;
  level: number;
  phone: string;
  phoneCarrier: string;
  gender: string;
  bank: string;
  accountNumber: string;
  accountOwner: string;
  birth: string;
  casinoRollingRatio: number;
  slotRollingRatio: number;
  password?: string;
}

export interface AddUserRequest {
  username: string;
  password: string;
  nickname: string;
  phone: string;
  phoneCarrier: string;
  gender: "MALE" | "FEMALE";
  bank: string;
  accountNumber: string;
  accountOwner: string;
  birth: string;
  recommendCode: string;
}

export const usersApi = {
  getUserTree: async (params: GetUserTreeParams) => {
    const { data } = await axiosInstance.get<UserTreeResponse>("/user/tree", {
      params,
    });
    return data;
  },

  getUserList: async (params: GetUserListParams) => {
    const { data } = await axiosInstance.get<UserListResponse>("/user", {
      params,
    });
    return data;
  },

  getUserDetail: async (username: string): Promise<UserDetailResponse> => {
    const { data } = await axiosInstance.get<UserDetailResponse>(
      `/user/${username}`
    );
    return data;
  },

  updateUserStatus: async (
    username: string,
    status: "APPROVED" | "PENDING" | "BLOCKED"
  ) => {
    const { data } = await axiosInstance.put(`/user/${username}`, {
      status,
    });
    return data;
  },

  adjustBalance: async (
    username: string,
    balanceAdjustment: number
  ): Promise<AdjustBalanceResponse> => {
    const { data } = await axiosInstance.post(`/user/${username}/balance`, {
      balanceAdjustment,
    });
    return data;
  },

  adjustPoint: async (
    username: string,
    pointAdjustment: number
  ): Promise<AdjustPointResponse> => {
    const { data } = await axiosInstance.post(`/user/${username}/point`, {
      pointAdjustment,
    });
    return data;
  },

  editUser: async (
    username: string,
    data: EditUserRequest
  ): Promise<UserDetailResponse> => {
    const response = await axiosInstance.put<UserDetailResponse>(
      `/user/${username}`,
      data
    );
    return response.data;
  },

  addUser: async (data: AddUserRequest) => {
    const response = await axiosInstance.post("/user", data);
    return response.data;
  },
};
