"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface NavbarSearchConfig {
  pathname: string;
  queryKey: string;
  placeholder: string;
  exact?: boolean;
}

const navbarSearchConfigs: NavbarSearchConfig[] = [
  {
    pathname: "/admin/skill-builder-manager",

    queryKey: "search",

    placeholder: "Search career tracks...",

    exact: true,
  },
  {
    pathname: "/admin/survival-italian",

    queryKey: "search",

    placeholder: "Search survival situations...",

    exact: true,
  },
  {
    pathname: "/admin/course-directory/course-details",

    queryKey: "search",

    placeholder: "Search student directory...",
  },
  {
    pathname: "/admin/cv-service/packages",

    queryKey: "search",

    placeholder: "Search CV credit packages...",

    exact: true,
  },
  {
    pathname: "/admin/package-store",

    queryKey: "search",

    placeholder: "Search packages or orders...",

    exact: true,
  },
  {
    pathname: "/admin/user-directory",

    queryKey: "search",

    placeholder: "Search users by name, email, or phone...",

    exact: true,
  },
  {
    pathname: "/admin/revenue-and-analytics",

    queryKey: "search",

    placeholder: "Search revenue transactions...",

    exact: true,
  },
  {
    pathname: "/admin/revenue-and-analytics/course-performance",

    queryKey: "search",

    placeholder: "Search course performance...",

    exact: true,
  },
  {
    pathname: "/admin/revenue-and-analytics/package-performance",

    queryKey: "search",

    placeholder: "Search package performance...",

    exact: true,
  },
];

const getActiveSearchConfig = (pathname: string) => {
  return navbarSearchConfigs.find((config) => {
    if (config.exact) {
      return pathname === config.pathname;
    }

    return (
      pathname === config.pathname || pathname.startsWith(`${config.pathname}/`)
    );
  });
};

const getCurrentQueryValue = (queryKey?: string) => {
  if (!queryKey || typeof window === "undefined") {
    return "";
  }

  const params = new URLSearchParams(window.location.search);

  return params.get(queryKey) || "";
};

const NavbarSearch = () => {
  const router = useRouter();
  const pathname = usePathname();

  const activeConfig = useMemo(
    () => getActiveSearchConfig(pathname),
    [pathname],
  );

  const queryKey = activeConfig?.queryKey;

  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    const syncSearchValue = () => {
      setSearchValue(getCurrentQueryValue(queryKey));
    };

    syncSearchValue();

    window.addEventListener("popstate", syncSearchValue);

    return () => {
      window.removeEventListener("popstate", syncSearchValue);
    };
  }, [pathname, queryKey]);

  useEffect(() => {
    if (!queryKey) return;

    const timeoutId = window.setTimeout(() => {
      const trimmedValue = searchValue.trim();

      const currentQueryValue = getCurrentQueryValue(queryKey);

      if (trimmedValue === currentQueryValue) {
        return;
      }

      const params = new URLSearchParams(window.location.search);

      if (trimmedValue) {
        params.set(queryKey, trimmedValue);
      } else {
        params.delete(queryKey);
      }

      params.delete("page");

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [pathname, queryKey, router, searchValue]);

  if (!activeConfig) return null;

  return (
    <div className="hidden w-full max-w-md items-center gap-2 rounded-xl border border-black/10 bg-gray-50 px-3 py-2 md:flex">
      <Search className="size-4 text-gray-500" />

      <input
        type="search"
        value={searchValue}
        placeholder={activeConfig.placeholder}
        onChange={(event) => setSearchValue(event.target.value)}
        className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
      />
    </div>
  );
};

export default NavbarSearch;
