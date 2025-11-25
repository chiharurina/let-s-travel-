import { Navigate, Outlet, useLocation } from "../lib/router";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ redirectTo = "/login" }) {
  const location = useLocation();
  const { isAuthenticated, status } = useAuth();

  if (status === "idle" || status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center py-24 text-sm text-slate-500">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
