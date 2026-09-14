import { axiosInstance } from "@/api/authApi";

export interface Popup {
  id: number;
  imageUrl: string;
  visible: boolean;
  created: string;
  updated: string;
  deleted: string | null;
}

export interface PopupListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    popups: Popup[];
  };
}

export interface CreatePopupRequest {
  visible: boolean;
  image?: File;
}

export interface CreatePopupResponse {
  success: boolean;
  message: string;
  code: number;
  data: Popup;
}

export const popupApi = {
  getAllPopups: async () => {
    const response = await axiosInstance.get<PopupListResponse>("/popup/admin");
    return response.data;
  },

  createPopup: async (
    data: CreatePopupRequest
  ): Promise<CreatePopupResponse> => {
    const formData = new FormData();
    formData.append("visible", JSON.stringify(data.visible));
    if (data.image) {
      formData.append("image", data.image);
    }

    const response = await axiosInstance.post<CreatePopupResponse>(
      "/popup",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },
};
