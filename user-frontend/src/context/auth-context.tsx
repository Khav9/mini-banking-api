import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { authApi } from "../api/authApi";
import { AuthContextType, AuthState } from "../modules/auth/types";
import { useAuthToken } from "../hooks/use-auth-token";
import { toast } from "sonner";

const initialState: AuthState = {
  isAuthenticated: true, // make this to true when can visit dashboard without login
  accessToken: null,
  role: null,
  isLoading: false,
  error: null,
  isInitialized: false,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();
  const { setToken, getToken, removeToken } = useAuthToken();

  // Initialize auth state from storage on mount
  useEffect(() => {
    const token = getToken();
    if (token) {
      setState({
        isAuthenticated: true,
        accessToken: token,
        role: "ADMIN", // Since we only allow ADMIN, we can set this directly
        isLoading: false,
        error: null,
        isInitialized: true,
      });
    } else {
      setState((prev) => ({
        ...prev,
        isInitialized: true,
      }));
    }
  }, [getToken]);

  const login = async (username: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await authApi.login({ username, password });

      if (response.success && response.data.accessToken) {
        // Check if user is an admin
        if (response.data.role !== "ADMIN") {
          throw new Error("Access denied. Admin privileges required.");
        }

        setToken(response.data.accessToken);
        setState({
          isAuthenticated: true,
          accessToken: response.data.accessToken,
          role: response.data.role,
          isLoading: false,
          error: null,
          isInitialized: true,
        });
        navigate("/dashboard");
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      let errorMessage = "Failed to login";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setState({
        isAuthenticated: false,
        accessToken: null,
        role: null,
        isLoading: false,
        error: errorMessage,
        isInitialized: true,
      });

      // Show error toast
      toast.error(errorMessage);
    }
  };

  const logout = () => {
    removeToken();
    setState(initialState);
    navigate("/login");
  };

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
