import { axiosInstance } from "@/api/authApi";

export interface Bank {
  id: number;
  name: string;
  code: string;
  enabled: boolean;
}

export interface BankListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    banks: string[];
  };
}

export interface PhoneCarrierListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    phoneCarriers: string[];
  };
}

export const settingsApi = {
  getBankList: async (): Promise<BankListResponse> => {
    const { data } = await axiosInstance.get<BankListResponse>("/config/bank");
    return data;
  },

  getPhoneCarrierList: async (): Promise<PhoneCarrierListResponse> => {
    const { data } = await axiosInstance.get<PhoneCarrierListResponse>(
      "/config/phone-carrier"
    );
    return data;
  },
};
