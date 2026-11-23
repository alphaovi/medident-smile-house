import { Navigate, useLocation } from "react-router";
import { useAuth } from "../../../Contexts/AuthContext";
import { getStoredUser } from "../../../services/auth/api";

const PUBLIC_AUTH_PATHS = [
  "/login",
  "/create-login-account",
  "/forget",
  "/verify-account",
];

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const currentUser = user || getStoredUser();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-md text-sky-600"></span>
      </div>
    );
  }

  const isPublicAuthPath = PUBLIC_AUTH_PATHS.includes(location.pathname);

  if (!currentUser && !isPublicAuthPath) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;