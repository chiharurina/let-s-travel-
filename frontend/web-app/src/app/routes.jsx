import { Navigate, createBrowserRouter } from "../lib/router";
import AppShell from "../layout/AppShell";
import ProtectedRoute from "../auth/ProtectedRoute";
import LoginPage from "../pages/Login";
import TripsPage from "../pages/Trips";
import ProfilePage from "../pages/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <Navigate to="/trips" replace />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: "trips",
            element: <TripsPage />,
          },
          {
            path: "profile",
            element: <ProfilePage />,
          },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/trips" replace />,
      },
    ],
  },
]);

export default router;
