import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import Loading from "./loading";

export const PublicRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return <Loading />;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return <Outlet />;
};
