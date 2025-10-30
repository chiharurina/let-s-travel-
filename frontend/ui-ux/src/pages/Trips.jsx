import { useEffect, useState } from "react";
import { get, ApiError } from "../services/api";
import { useAuth } from "../auth/AuthContext";

function normalizeTrips(response) {
  if (!response) {
    return [];
  }

  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response.trips)) {
    return response.trips;
  }

  return [];
}

function formatDate(value) {
  if (!value) {
    return "";
  }

  try {
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
  } catch (error) {
    console.error("Unable to format trip date", error);
    return value;
  }
}

export default function TripsPage() {
  const { isAuthenticated } = useAuth();
  const [trips, setTrips] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    let ignore = false;

    async function loadTrips() {
      setStatus("loading");
      setError("");

      try {
        const response = await get("/api/trips");
        if (ignore) {
          return;
        }
        setTrips(normalizeTrips(response));
        setStatus("success");
      } catch (err) {
        if (ignore) {
          return;
        }
        const message =
          err instanceof ApiError
            ? err.message
            : "We couldn't load trips right now. Please try again later.";
        setError(message);
        setStatus("error");
      }
    }

    loadTrips();

    return () => {
      ignore = true;
    };
  }, [isAuthenticated]);

  const isLoading = status === "loading";
  const hasTrips = trips.length > 0;

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-slate-900">Your trips</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-500">
          Access every itinerary you&apos;ve planned with Let&apos;s Travel.
        </p>
      </header>
      {isLoading && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          Loading trips...
        </div>
      )}
      {!isLoading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-600">
          {error}
        </div>
      )}
      {!isLoading && !error && !hasTrips && (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
          You haven&apos;t planned any adventures yet. Start by adding a new trip!
        </div>
      )}
      {!isLoading && !error && hasTrips && (
        <div className="grid gap-4 sm:grid-cols-2">
          {trips.map((trip) => (
            <article
              key={trip.id || `${trip.destination}-${trip.start_date}`}
              className="flex flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-lg font-semibold text-slate-900">
                {trip.destination || "Unspecified destination"}
              </h2>
              <p className="text-sm text-slate-500">
                {formatDate(trip.start_date || trip.startDate)} —
                {" "}
                {formatDate(trip.end_date || trip.endDate)}
              </p>
              {trip.description && (
                <p className="text-sm text-slate-600">{trip.description}</p>
              )}
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
