import { useAuth } from "../auth/AuthContext";

function formatDate(value) {
  if (!value) {
    return null;
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(new Date(value));
  } catch (error) {
    console.error("Unable to format date", error);
    return null;
  }
}

export default function ProfilePage() {
  const { user, status } = useAuth();

  if (status === "loading" || status === "idle") {
    return (
      <section className="flex flex-1 items-center justify-center text-sm text-slate-500">
        Loading your profile...
      </section>
    );
  }

  if (!user) {
    return (
      <section className="space-y-4">
        <header>
          <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500">
            We couldn&apos;t load your account details. Try refreshing the page to
            fetch the latest information.
          </p>
        </header>
      </section>
    );
  }

  const createdAt = formatDate(user.createdAt || user.created_at);

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Profile</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Manage your account details and see who&apos;s signed in.
        </p>
      </header>
      <dl className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-8 sm:grid-cols-2">
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Display name
          </dt>
          <dd className="mt-1 text-sm text-slate-700">
            {user.name || user.fullName || user.email || "Traveler"}
          </dd>
        </div>
        <div>
          <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Email
          </dt>
          <dd className="mt-1 text-sm text-slate-700">{user.email || "—"}</dd>
        </div>
        {user.username && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Username
            </dt>
            <dd className="mt-1 text-sm text-slate-700">{user.username}</dd>
          </div>
        )}
        {createdAt && (
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Member since
            </dt>
            <dd className="mt-1 text-sm text-slate-700">{createdAt}</dd>
          </div>
        )}
      </dl>
    </section>
  );
}
