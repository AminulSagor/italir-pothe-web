import type {
  AdminUserAccessFilter,
  AdminUserAccountStatusFilter,
  AdminUserDirectorySortBy,
  AdminUserSortOrder,
} from "@/types/user-directory/user-directory.type";

import UserDirectoryClient from "./_components/user-directory-client";

interface UserDirectoryPageProps {
  searchParams: Promise<{
    page?: string | string[];
    search?: string | string[];
    accessTier?: string | string[];
    accountStatus?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const getSingleValue = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const getPositiveInteger = (value?: string | string[]) => {
  const parsed = Number(getSingleValue(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

const parseAccessTier = (value?: string | string[]): AdminUserAccessFilter => {
  const accessTier = getSingleValue(value);

  if (accessTier === "free" || accessTier === "premium_pro") {
    return accessTier;
  }

  return "all";
};

const parseAccountStatus = (
  value?: string | string[],
): AdminUserAccountStatusFilter => {
  const status = getSingleValue(value);

  if (status === "active" || status === "restricted") {
    return status;
  }

  return "all";
};

const parseSortBy = (value?: string | string[]): AdminUserDirectorySortBy => {
  const sortBy = getSingleValue(value);

  if (
    sortBy === "name" ||
    sortBy === "accessTier" ||
    sortBy === "totalXp" ||
    sortBy === "lastActivityAt"
  ) {
    return sortBy;
  }

  return "joinedAt";
};

const parseSortOrder = (value?: string | string[]): AdminUserSortOrder => {
  return getSingleValue(value) === "ASC" ? "ASC" : "DESC";
};

export default async function UserDirectoryPage({
  searchParams,
}: UserDirectoryPageProps) {
  const params = await searchParams;

  return (
    <UserDirectoryClient
      page={getPositiveInteger(params.page)}
      search={getSingleValue(params.search)}
      accessTier={parseAccessTier(params.accessTier)}
      accountStatus={parseAccountStatus(params.accountStatus)}
      sortBy={parseSortBy(params.sortBy)}
      sortOrder={parseSortOrder(params.sortOrder)}
    />
  );
}
