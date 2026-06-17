"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

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
];

const getActiveSearchConfig = (pathname: string) => {
  return navbarSearchConfigs.find((config) => {
    if (config.exact) return pathname === config.pathname;

    return (
      pathname === config.pathname || pathname.startsWith(`${config.pathname}/`)
    );
  });
};

const NavbarSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  const activeConfig = useMemo(
    () => getActiveSearchConfig(pathname),
    [pathname],
  );

  const queryKey = activeConfig?.queryKey;
  const currentQueryValue = queryKey ? searchParams.get(queryKey) || "" : "";

  const [searchValue, setSearchValue] = useState(currentQueryValue);

  useEffect(() => {
    setSearchValue(currentQueryValue);
  }, [currentQueryValue, pathname]);

  useEffect(() => {
    if (!queryKey) return;

    const timeoutId = window.setTimeout(() => {
      const trimmedValue = searchValue.trim();

      if (trimmedValue === currentQueryValue) return;

      const params = new URLSearchParams(searchParamsString);

      if (trimmedValue) {
        params.set(queryKey, trimmedValue);
      } else {
        params.delete(queryKey);
      }

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [
    currentQueryValue,
    pathname,
    queryKey,
    router,
    searchParamsString,
    searchValue,
  ]);

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
