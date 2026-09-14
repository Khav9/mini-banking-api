export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  code: number;
  data: {
    role: string;
    accessToken: string;
  };
}

export interface AuthState {
  isAuthenticated: boolean;
  accessToken: string | null;
  role: string | null;
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
}

export interface AuthContextType extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}
