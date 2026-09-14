import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import Loading from "./loading";

export const PrivateRoute = () => {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    // You can show a loading spinner here if you want
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};
