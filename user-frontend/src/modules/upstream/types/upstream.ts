export interface Upstream {
  id: number;
  name: string;
  apiKey: string;
  apiSecret: string | null;
  allowedIp: string[];
  enabled: boolean;
}

export interface UpstreamListResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    upstreams: Upstream[];
  };
}

export interface UpdateUpstreamRequest {
  apiKey: string;
  apiSecret: string;
  allowedIp: string[];
  enabled: boolean;
}

export interface UpdateUpstreamResponse {
  success: boolean;
  message: string;
  code: number;
  data: Record<string, never>;
}
