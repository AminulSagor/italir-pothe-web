"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  GripVertical,
  Pencil,
  PlusCircle,
  RotateCcw,
  Store,
  Trash2,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  archiveStorePackage,
  createStorePackage,
  getStorePackageById,
  getStorePackages,
  reorderStorePackages,
  restoreStorePackage,
  updateStorePackage,
} from "@/service/package-store/package-store.service";
import type {
  CreateStorePackagePayload,
  StorePackage,
  StorePackageStatus,
  StorePackageType,
  StorePaymentProvider,
  UpdateStorePackagePayload,
} from "@/types/package-store/package-store.type";

import CreatePackageDialog from "./dialogs/create-package-dialog";
import PackageCreatedDialog from "./dialogs/package-created-dialog";
import PackageRemovedDialog from "./dialogs/package-removed-dialog";
import StorePagination from "./store-pagination";
import StoreProductsDialog from "./dialogs/store-products-dialog";

interface StorePackagesTableProps {
  packageType: StorePackageType;
  title: string;
  description?: string;
  search: string;
  page: number;
  status: string;
  provider: string;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const formatBadge = (badge: string | null) => {
  if (!badge || badge === "none") return null;

  return badge
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getColumnLabels = (packageType: StorePackageType) => {
  if (packageType === "ai_bundle") {
    return [
      "PACKAGE NAME",
      "VOICE MINS",
      "TEXT TOKENS",
      "PRICE",
      "HIGHLIGHT BADGE",
      "ACTIONS",
    ];
  }

  if (packageType === "cv_credit") {
    return [
      "PACKAGE NAME",
      "CV CREDITS",
      "BILLING",
      "PRICE",
      "HIGHLIGHT BADGE",
      "ACTIONS",
    ];
  }

  return [
    "PACKAGE NAME",
    "PROTECTION",
    "BILLING",
    "PRICE",
    "HIGHLIGHT BADGE",
    "ACTIONS",
  ];
};

export default function StorePackagesTable({
  packageType,
  title,
  description,
  search,
  page,
  status,
  provider,
}: StorePackagesTableProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [packages, setPackages] = useState<StorePackage[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [createdOpen, setCreatedOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<StorePackage | null>(
    null,
  );
  const [dialogDirty, setDialogDirty] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingAction, setPendingAction] = useState<{
    mode: "archive" | "restore";
    storePackage: StorePackage;
  } | null>(null);
  const [isRunningAction, setIsRunningAction] = useState(false);
  const [draggedPackageId, setDraggedPackageId] = useState<string | null>(null);
  const [storeProductsPackage, setStoreProductsPackage] =
    useState<StorePackage | null>(null);

  const unsaved = useUnsavedChangesWarning(dialogDirty);

  const normalizedStatus: StorePackageStatus | undefined =
    status === "published" || status === "archived" ? status : undefined;

  const normalizedProvider: StorePaymentProvider | undefined =
    provider === "google_play" || provider === "app_store"
      ? provider
      : undefined;

  const loadPackages = useCallback(async () => {
    try {
      const response = await getStorePackages({
        packageType,
        search,
        status: normalizedStatus,
        provider: normalizedProvider,
        page,
        limit: 10,
      });

      setPackages(response.items);
      setMeta(response.meta);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setPackages([]);
    } finally {
      setIsLoading(false);
    }
  }, [normalizedProvider, normalizedStatus, packageType, page, search]);

  useEffect(() => {
    let mounted = true;

    const fetchPackages = async () => {
      try {
        const response = await getStorePackages({
          packageType,
          search,
          status: normalizedStatus,
          provider: normalizedProvider,
          page,
          limit: 10,
        });

        if (mounted) {
          setPackages(response.items);
          setMeta(response.meta);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
          setPackages([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchPackages();

    return () => {
      mounted = false;
    };
  }, [normalizedProvider, normalizedStatus, packageType, page, search]);

  const updateQuery = (values: Record<string, string | number | undefined>) => {
    const params = new URLSearchParams(window.location.search);

    Object.entries(values).forEach(([key, value]) => {
      if (value === undefined || value === "") {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    const queryString = params.toString();

    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  const requestCloseEditor = () => {
    unsaved.requestAction(() => {
      setCreateOpen(false);
      setEditingPackage(null);
      setDialogDirty(false);
    });
  };

  const handleEdit = async (packageId: string) => {
    try {
      const response = await getStorePackageById(packageId);
      setEditingPackage(response);
      setCreateOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleCreate = async (payload: CreateStorePackagePayload) => {
    const toastId = toast.loading("Creating package...");

    try {
      setIsSubmitting(true);
      await createStorePackage(payload);
      await loadPackages();

      setCreateOpen(false);
      setDialogDirty(false);
      setCreatedOpen(true);

      toast.success("Package created.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (
    packageId: string,
    payload: UpdateStorePackagePayload,
  ) => {
    const toastId = toast.loading("Updating package...");

    try {
      setIsSubmitting(true);
      await updateStorePackage(packageId, payload);
      await loadPackages();

      setCreateOpen(false);
      setEditingPackage(null);
      setDialogDirty(false);

      toast.success("Package updated.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    const toastId = toast.loading(
      pendingAction.mode === "archive"
        ? "Archiving package..."
        : "Restoring package...",
    );

    try {
      setIsRunningAction(true);

      if (pendingAction.mode === "archive") {
        await archiveStorePackage(pendingAction.storePackage.id);
      } else {
        await restoreStorePackage(pendingAction.storePackage.id);
      }

      await loadPackages();
      setPendingAction(null);

      toast.success(
        pendingAction.mode === "archive"
          ? "Package archived."
          : "Package restored.",
        { id: toastId },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsRunningAction(false);
    }
  };

  const handleDrop = async (targetPackageId: string) => {
    if (!draggedPackageId || draggedPackageId === targetPackageId) {
      setDraggedPackageId(null);
      return;
    }

    const sourceIndex = packages.findIndex(
      (item) => item.id === draggedPackageId,
    );
    const targetIndex = packages.findIndex(
      (item) => item.id === targetPackageId,
    );

    if (sourceIndex < 0 || targetIndex < 0) return;

    const nextPackages = [...packages];
    const [movedPackage] = nextPackages.splice(sourceIndex, 1);
    nextPackages.splice(targetIndex, 0, movedPackage);

    setPackages(nextPackages);
    setDraggedPackageId(null);

    try {
      const pageOffset = (meta.page - 1) * meta.limit;

      await reorderStorePackages({
        items: nextPackages.map((item, index) => ({
          packageId: item.id,
          sortOrder: pageOffset + index,
        })),
      });

      toast.success("Package order updated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
      await loadPackages();
    }
  };

  const headers = useMemo(() => getColumnLabels(packageType), [packageType]);

  return (
    <>
      <Card padding="lg" rounded="3xl" shadow="sm">
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#202420]">{title}</h2>
            {description && (
              <p className="text-sm text-[#4F5B52]">{description}</p>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <select
              value={provider}
              onChange={(event) =>
                updateQuery({
                  provider: event.target.value,
                  page: 1,
                })
              }
              className="h-10 rounded-full border border-[#C9D4CC] bg-white px-4 text-sm text-[#4F5B52] outline-none"
            >
              <option value="">All Providers</option>

              <option value="google_play">Google Play</option>

              <option value="app_store">App Store</option>
            </select>
            <select
              value={status}
              onChange={(event) =>
                updateQuery({
                  status: event.target.value,
                  page: 1,
                })
              }
              className="h-10 rounded-full border border-[#C9D4CC] bg-white px-4 text-sm text-[#4F5B52] outline-none"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>

            <Button
              onClick={() => {
                setEditingPackage(null);
                setCreateOpen(true);
              }}
              className="gap-2 bg-[#58F85F] !text-[#006B3F] hover:!bg-[#58F85F]"
            >
              <PlusCircle className="size-4" />
              Add Package
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead>
              <tr className="border-b border-[#E7EEE8]">
                {headers.map((head) => (
                  <th
                    key={head}
                    className="px-4 py-4 text-left text-xs font-bold text-[#4F5B52]"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {isLoading && (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-4 py-12 text-center text-sm text-[#4F5B52]"
                  >
                    Loading packages...
                  </td>
                </tr>
              )}

              {!isLoading && packages.length === 0 && (
                <tr>
                  <td
                    colSpan={headers.length}
                    className="px-4 py-12 text-center text-sm text-[#4F5B52]"
                  >
                    No packages found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                packages.map((item) => {
                  const badge = formatBadge(item.marketingBadge);
                  const archived = item.status === "archived";

                  return (
                    <tr
                      key={item.id}
                      draggable
                      onDragStart={() => setDraggedPackageId(item.id)}
                      onDragEnd={() => setDraggedPackageId(null)}
                      onDragOver={(event) => event.preventDefault()}
                      onDrop={() => handleDrop(item.id)}
                      className={`border-b border-[#EEF2EE] ${
                        draggedPackageId === item.id ? "opacity-50" : ""
                      } ${archived ? "opacity-70" : ""}`}
                    >
                      <td className="px-4 py-6">
                        <p
                          className={`text-sm font-bold ${
                            packageType === "ai_bundle"
                              ? "text-[#006B3F]"
                              : "text-[#202420]"
                          }`}
                        >
                          {packageType === "streak_freeze" ? "❄️ " : ""}
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-sm text-[#4F5B52]">
                            {item.description}
                          </p>
                        )}
                        {archived && (
                          <p className="mt-1 text-xs font-semibold text-[#D92D20]">
                            Archived
                          </p>
                        )}
                      </td>

                      {packageType === "ai_bundle" && (
                        <>
                          <td className="px-4 py-6 text-sm">
                            {item.aiVoiceMinutes}
                          </td>
                          <td className="px-4 py-6 text-sm">
                            {item.aiTextTokens}
                          </td>
                        </>
                      )}

                      {packageType === "cv_credit" && (
                        <>
                          <td className="px-4 py-6 text-sm font-bold">
                            {item.cvCredits}
                          </td>
                          <td className="px-4 py-6 text-sm text-[#4F5B52]">
                            {item.billingModel === "monthly"
                              ? "Monthly"
                              : "One Time"}
                          </td>
                        </>
                      )}

                      {packageType === "streak_freeze" && (
                        <>
                          <td className="px-4 py-6 text-sm font-bold">
                            {item.streakProtectionMode === "monthly_unlimited"
                              ? `${item.protectionDurationDays || 30} days unlimited`
                              : `${item.streakFreezeCount} freezes`}
                          </td>
                          <td className="px-4 py-6 text-sm text-[#4F5B52]">
                            {item.billingModel === "monthly"
                              ? "Monthly"
                              : "One Time"}
                          </td>
                        </>
                      )}

                      <td className="px-4 py-6 text-sm font-bold text-[#006B3F]">
                        €{item.priceEur}
                      </td>

                      <td className="px-4 py-6">
                        {badge ? (
                          <span className="rounded-full border border-[#F6D878] bg-[#FFF3C6] px-3 py-1 text-[10px] text-[#D89600]">
                            {badge}
                          </span>
                        ) : (
                          <span className="text-sm text-[#A0AAA2]">—</span>
                        )}
                      </td>

                      <td className="px-4 py-6">
                        <div className="flex gap-3">
                          <button
                            type="button"
                            onClick={() => setStoreProductsPackage(item)}
                            className="flex size-9 items-center justify-center rounded-full bg-[#FFF0D6] text-[#B66800]"
                            aria-label={`Manage store products for ${item.name}`}
                            title="Store Products"
                          >
                            <Store className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleEdit(item.id)}
                            className="flex size-9 items-center justify-center rounded-full bg-[#DDEEEE] text-[#006B3F]"
                            aria-label={`Edit ${item.name}`}
                          >
                            <Pencil className="size-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              setPendingAction({
                                mode: archived ? "restore" : "archive",
                                storePackage: item,
                              })
                            }
                            className={`flex size-9 items-center justify-center rounded-full ${
                              archived
                                ? "bg-[#DDF3E8] text-[#006B3F]"
                                : "bg-[#FFDCDD] text-[#D92D20]"
                            }`}
                            aria-label={
                              archived
                                ? `Restore ${item.name}`
                                : `Archive ${item.name}`
                            }
                          >
                            {archived ? (
                              <RotateCcw className="size-4" />
                            ) : (
                              <Trash2 className="size-4" />
                            )}
                          </button>

                          <button
                            type="button"
                            className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#4F5B52]"
                            aria-label={`Reorder ${item.name}`}
                          >
                            <GripVertical className="size-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <StorePagination
          page={meta.page}
          totalPages={meta.totalPages}
          total={meta.total}
          limit={meta.limit}
          onPageChange={(nextPage) => updateQuery({ page: nextPage })}
        />
      </Card>

      <CreatePackageDialog
        key={`${editingPackage?.id || "new"}-${createOpen ? "open" : "closed"}`}
        open={createOpen}
        defaultType={packageType}
        initialPackage={editingPackage}
        isSubmitting={isSubmitting}
        onClose={requestCloseEditor}
        onDirtyChange={setDialogDirty}
        onCreate={handleCreate}
        onUpdate={handleUpdate}
      />

      <PackageCreatedDialog
        open={createdOpen}
        onClose={() => setCreatedOpen(false)}
        onCreateAnother={() => {
          setCreatedOpen(false);
          setEditingPackage(null);
          setCreateOpen(true);
        }}
      />

      <PackageRemovedDialog
        open={Boolean(pendingAction)}
        packageName={pendingAction?.storePackage.name || "this package"}
        mode={pendingAction?.mode || "archive"}
        isSubmitting={isRunningAction}
        onClose={() => setPendingAction(null)}
        onConfirm={handleConfirmAction}
      />

      <StoreProductsDialog
        open={Boolean(storeProductsPackage)}
        storePackage={storeProductsPackage}
        onClose={() => setStoreProductsPackage(null)}
        onChanged={loadPackages}
      />

      <UnsavedChangesWarningDialog
        open={unsaved.warningOpen}
        onCancel={unsaved.cancelNavigation}
        onConfirm={unsaved.confirmNavigation}
      />
    </>
  );
}
