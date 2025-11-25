// @ts-nocheck
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const RouterContext = createContext(null);
const OutletContext = createContext(null);

function isBrowser() {
  return typeof window !== "undefined" && typeof document !== "undefined";
}

function normalizePathname(pathname) {
  if (!pathname) {
    return "/";
  }

  if (pathname.startsWith("/")) {
    return pathname;
  }

  return `/${pathname}`;
}

function getInitialLocation() {
  if (!isBrowser()) {
    return { pathname: "/", state: null };
  }

  return {
    pathname: normalizePathname(window.location.pathname || "/"),
    state: window.history.state ?? null,
  };
}

export function createBrowserRouter(routes) {
  return { routes };
}

function stripSlashes(path) {
  if (!path) {
    return "";
  }

  return path.replace(/^\/+|\/+$/g, "");
}

function matchRoutes(routes, pathname) {
  if (!Array.isArray(routes) || routes.length === 0) {
    return null;
  }

  const trimmed = stripSlashes(pathname);
  const segments = trimmed ? trimmed.split("/") : [];

  function matchChildren(children, index) {
    if (!children || children.length === 0) {
      return null;
    }

    for (const child of children) {
      const result = matchRoute(child, index);
      if (result) {
        return result;
      }
    }

    return null;
  }

  function matchRoute(route, index) {
    if (!route) {
      return null;
    }

    if (route.index) {
      if (index >= segments.length) {
        return { matches: [{ route }], index };
      }
      return null;
    }

    if (route.path === "*") {
      return { matches: [{ route }], index: segments.length };
    }

    if (!route.path || route.path === "") {
      const childMatch = matchChildren(route.children || [], index);
      if (childMatch) {
        return {
          matches: [{ route }, ...childMatch.matches],
          index: childMatch.index,
        };
      }
      return null;
    }

    const cleanedPath = stripSlashes(route.path);

    if (cleanedPath === "") {
      const childMatch = matchChildren(route.children || [], index);
      if (childMatch) {
        return {
          matches: [{ route }, ...childMatch.matches],
          index: childMatch.index,
        };
      }

      if (index >= segments.length) {
        return { matches: [{ route }], index };
      }

      return null;
    }

    const routeSegments = cleanedPath.split("/");
    const slice = segments.slice(index, index + routeSegments.length);

    if (slice.length !== routeSegments.length) {
      return null;
    }

    for (let i = 0; i < routeSegments.length; i += 1) {
      if (routeSegments[i] !== slice[i]) {
        return null;
      }
    }

    const nextIndex = index + routeSegments.length;

    if (route.children && route.children.length > 0) {
      const childMatch = matchChildren(route.children, nextIndex);
      if (childMatch) {
        return {
          matches: [{ route }, ...childMatch.matches],
          index: childMatch.index,
        };
      }
    }

    if (nextIndex === segments.length) {
      return { matches: [{ route }], index: nextIndex };
    }

    return null;
  }

  return matchChildren(routes, 0);
}

function renderMatches(matches) {
  if (!matches || !matches.matches || matches.matches.length === 0) {
    return null;
  }

  return matches.matches.reduceRight((outlet, match, position) => {
    const element = match.route.element ?? null;

    return (
      <OutletContext.Provider key={position} value={outlet}>
        {element}
      </OutletContext.Provider>
    );
  }, null);
}

export function RouterProvider({ router }) {
  const [location, setLocation] = useState(getInitialLocation);

  const navigate = useCallback(
    (to, options = {}) => {
      const target = normalizePathname(to);
      const state = options.state ?? null;

      if (isBrowser()) {
        if (options.replace) {
          window.history.replaceState(state, "", target);
        } else {
          window.history.pushState(state, "", target);
        }
      }

      setLocation({ pathname: target, state });
    },
    []
  );

  useEffect(() => {
    if (!isBrowser()) {
      return undefined;
    }

    function handlePopState(event) {
      setLocation({
        pathname: normalizePathname(window.location.pathname || "/"),
        state: event.state ?? null,
      });
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const routeMatches = useMemo(() => {
    return matchRoutes(router?.routes ?? [], location.pathname);
  }, [router, location.pathname]);

  const rendered = useMemo(() => renderMatches(routeMatches), [routeMatches]);

  const contextValue = useMemo(
    () => ({
      location,
      navigate,
    }),
    [location, navigate]
  );

  return (
    <RouterContext.Provider value={contextValue}>{rendered}</RouterContext.Provider>
  );
}

export function useRouter() {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error("useRouter must be used within a RouterProvider");
  }
  return context;
}

export function useNavigate() {
  return useRouter().navigate;
}

export function useLocation() {
  return useRouter().location;
}

export function Outlet() {
  const outlet = useContext(OutletContext);
  return outlet || null;
}

export function Navigate({ to, replace = false, state = null }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace, state });
  }, [navigate, to, replace, state]);

  return null;
}

export function Link({ to, state, replace = false, onClick, ...props }) {
  const navigate = useNavigate();

  function handleClick(event) {
    if (onClick) {
      onClick(event);
    }

    if (event.defaultPrevented) {
      return;
    }

    event.preventDefault();
    navigate(to, { state, replace });
  }

  return <a href={to} onClick={handleClick} {...props} />;
}

function isFunction(value) {
  return typeof value === "function";
}

function isActivePath(currentPathname, targetPathname) {
  return stripSlashes(currentPathname) === stripSlashes(targetPathname);
}

export function NavLink({ to, className, children, ...props }) {
  const location = useLocation();
  const isActive = isActivePath(location.pathname, to);

  const resolvedClassName = isFunction(className)
    ? className({ isActive })
    : className;

  const content = isFunction(children) ? children({ isActive }) : children;

  return (
    <Link to={to} className={resolvedClassName} {...props} data-active={isActive ? "" : undefined}>
      {content}
    </Link>
  );
}
