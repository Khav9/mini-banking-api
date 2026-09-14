export interface Provider {
  id: number;
  upstreamId: number;
  upstreamName: string;
  names: {
    en: string;
  };
  type: "casino" | "slot";
  enabled: boolean;
}

export interface ProviderListResponse {
  success: boolean;
  message: string;
  data: {
    providers: Provider[];
  };
  code: number;
}
