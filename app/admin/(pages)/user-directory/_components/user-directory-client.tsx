"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  createDirectChat,
  getAdminUserDashboard,
  getAdminUsers,
  quickRestrictAdminUser,
  updateAdminUserRestriction,
} from "@/service/user-directory/user-directory.service";
import type {
  AdminUserAccessFilter,
  AdminUserAccountStatusFilter,
  AdminUserDashboardResponse,
  AdminUserDirectoryItem,
  AdminUserDirectoryResponse,
  AdminUserDirectorySortBy,
  AdminUserSortOrder,
} from "@/types/user-directory/user-directory.type";

import QuickRestrictDialog from "./quick-restrict-dialog";
import RestrictionConfirmDialog from "./restriction-confirm-dialog";
import UserDirectoryHeader from "./user-directory-header";
import UserDirectoryTable from "./user-directory-table";
import UserGrowthCard from "./user-growth-card";
import UserStatsGrid from "./user-stats-grid";

interface UserDirectoryClientProps {
  page: number;
  search: string;

  accessTier: AdminUserAccessFilter;

  accountStatus: AdminUserAccountStatusFilter;

  sortBy: AdminUserDirectorySortBy;

  sortOrder: AdminUserSortOrder;
}

const PAGE_LIMIT = 20;

const emptyDirectory: AdminUserDirectoryResponse = {
  items: [],

  meta: {
    page: 1,
    limit: PAGE_LIMIT,
    total: 0,
    totalPages: 0,
    hasPreviousPage: false,
    hasNextPage: false,
  },

  appliedFilters: {
    search: null,
    accessTier: "all",
    accountStatus: "all",
    sortBy: "joinedAt",
    sortOrder: "DESC",
  },
};

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

export default function UserDirectoryClient({
  page,
  search,
  accessTier,
  accountStatus,
  sortBy,
  sortOrder,
}: UserDirectoryClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [dashboard, setDashboard] = useState<AdminUserDashboardResponse | null>(
    null,
  );

  const [directory, setDirectory] =
    useState<AdminUserDirectoryResponse>(emptyDirectory);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [quickRestrictOpen, setQuickRestrictOpen] = useState(false);

  const [quickIdentifier, setQuickIdentifier] = useState("");

  const [restrictionUser, setRestrictionUser] =
    useState<AdminUserDirectoryItem | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const query = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: search || undefined,
      accessTier,
      accountStatus,
      sortBy,
      sortOrder,
    }),
    [accessTier, accountStatus, page, search, sortBy, sortOrder],
  );

  const reloadData = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const [dashboardResponse, directoryResponse] = await Promise.all([
        getAdminUserDashboard(),
        getAdminUsers(query),
      ]);

      setDashboard(dashboardResponse);

      setDirectory(directoryResponse);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      try {
        const response = await getAdminUserDashboard();

        if (mounted) {
          setDashboard(response);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
        }
      }
    };

    void loadDashboard();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;

    const loadDirectory = async () => {
      try {
        const response = await getAdminUsers(query);

        if (!mounted) return;

        setDirectory(response);
        setLoadError("");
      } catch (error) {
        if (!mounted) return;

        const message = getErrorMessage(error);

        setLoadError(message);
        toast.error(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadDirectory();

    return () => {
      mounted = false;
    };
  }, [query]);

  const updateQuery = useCallback(
    (patch: Record<string, string | number | undefined>) => {
      setIsLoading(true);

      const params = new URLSearchParams(window.location.search);

      Object.entries(patch).forEach(([key, value]) => {
        if (value === undefined || value === "" || value === "all") {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      const queryString = params.toString();

      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    },
    [pathname, router],
  );

  const quickRestrictDirty = Boolean(quickIdentifier.trim());

  const unsavedChanges = useUnsavedChangesWarning(quickRestrictDirty);

  const closeQuickRestrict = () => {
    unsavedChanges.requestAction(() => {
      setQuickRestrictOpen(false);
      setQuickIdentifier("");
    });
  };

  const handleQuickRestrict = async () => {
    const identifier = quickIdentifier.trim();

    if (!identifier) {
      toast.error("Enter a user UUID, email address, or phone number.");

      return;
    }

    const toastId = toast.loading("Restricting user account...");

    try {
      setIsSubmitting(true);

      const response = await quickRestrictAdminUser({
        identifier,
      });

      setQuickIdentifier("");
      setQuickRestrictOpen(false);

      await reloadData();

      toast.success(response.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRestrictionConfirm = async () => {
    if (!restrictionUser) return;

    const shouldRestrict = !restrictionUser.isRestricted;

    const toastId = toast.loading(
      shouldRestrict
        ? "Restricting user account..."
        : "Restoring user account...",
    );

    try {
      setIsSubmitting(true);

      const response = await updateAdminUserRestriction(restrictionUser.id, {
        isBanned: shouldRestrict,
      });

      setRestrictionUser(null);

      await reloadData();

      toast.success(response.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessageUser = async (user: AdminUserDirectoryItem) => {
    const toastId = toast.loading("Opening direct conversation...");

    try {
      const response = await createDirectChat(user.id);

      toast.success(
        response.message ||
          `Direct conversation with ${user.fullName} is ready.`,
        {
          id: toastId,
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  if (isLoading && !dashboard && directory.items.length === 0) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>
    );
  }

  if (loadError && !dashboard && directory.items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[480px] w-full max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h1 className="mt-5 text-2xl font-bold text-black/85">
          User directory unavailable
        </h1>

        <p className="mt-3 max-w-lg text-black/55">{loadError}</p>

        <button
          type="button"
          onClick={() => void reloadData()}
          className="mt-7 rounded-full bg-secondary px-8 py-3 font-semibold text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1180px] space-y-8">
        <UserDirectoryHeader
          key={`header-${search}`}
          search={search}
          onSearchChange={(value) =>
            updateQuery({
              search: value.trim(),
              page: 1,
            })
          }
          onQuickRestrict={() => setQuickRestrictOpen(true)}
        />

        <UserStatsGrid dashboard={dashboard} />

        <UserGrowthCard />

        <UserDirectoryTable
          key={`table-${search}-${accessTier}-${accountStatus}-${sortBy}-${sortOrder}`}
          directory={directory}
          isLoading={isLoading}
          search={search}
          accessTier={accessTier}
          accountStatus={accountStatus}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSearchChange={(value) =>
            updateQuery({
              search: value.trim(),
              page: 1,
            })
          }
          onAccessTierChange={(value) =>
            updateQuery({
              accessTier: value,
              page: 1,
            })
          }
          onAccountStatusChange={(value) =>
            updateQuery({
              accountStatus: value,
              page: 1,
            })
          }
          onSortByChange={(value) =>
            updateQuery({
              sortBy: value,
              page: 1,
            })
          }
          onSortOrderChange={(value) =>
            updateQuery({
              sortOrder: value,
              page: 1,
            })
          }
          onPageChange={(nextPage) =>
            updateQuery({
              page: nextPage,
            })
          }
          onViewUser={(userId) =>
            router.push(`/admin/user-directory/${userId}`)
          }
          onMessageUser={(user) => void handleMessageUser(user)}
          onToggleRestriction={setRestrictionUser}
        />
      </div>

      <QuickRestrictDialog
        open={quickRestrictOpen}
        identifier={quickIdentifier}
        isSubmitting={isSubmitting}
        onIdentifierChange={setQuickIdentifier}
        onClose={closeQuickRestrict}
        onConfirm={handleQuickRestrict}
      />

      <RestrictionConfirmDialog
        open={Boolean(restrictionUser)}
        user={restrictionUser}
        isSubmitting={isSubmitting}
        onClose={() => setRestrictionUser(null)}
        onConfirm={handleRestrictionConfirm}
      />

      <UnsavedChangesWarningDialog
        open={unsavedChanges.warningOpen}
        onCancel={unsavedChanges.cancelNavigation}
        onConfirm={unsavedChanges.confirmNavigation}
      />
    </>
  );
}
