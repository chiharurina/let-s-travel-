import { Link, NavLink, Outlet, useNavigate } from "../lib/router";
import { useMemo } from "react";
import { useAuth } from "../auth/AuthContext";

const navItems = [
  { to: "/trips", label: "Trips" },
  { to: "/profile", label: "Profile" },
];

function resolveDisplayName(user) {
  if (!user) {
    return "Traveler";
  }

  return user.name || user.fullName || user.email || "Traveler";
}

export default function AppShell() {
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const userDetails = useMemo(() => {
    if (!user) {
      return null;
    }

    return {
      name: resolveDisplayName(user),
      email: user.email || user.username || null,
    };
  }, [user]);

  async function handleSignOut() {
    await logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Link to="/" className="text-xl font-semibold tracking-tight">
            Let&apos;s Travel
          </Link>
          {isAuthenticated && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              <nav className="flex items-center gap-6 text-sm font-medium">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `transition-colors hover:text-slate-900 ${
                        isActive ? "text-slate-900" : "text-slate-500"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
              <div className="flex items-center gap-4">
                {userDetails && (
                  <div className="text-right text-sm">
                    <p className="font-semibold text-slate-900">{userDetails.name}</p>
                    {userDetails.email && (
                      <p className="text-xs text-slate-500">{userDetails.email}</p>
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="mx-auto flex max-w-5xl flex-1 flex-col px-6 py-12">
        <Outlet />
      </main>
    </div>
  );
}
