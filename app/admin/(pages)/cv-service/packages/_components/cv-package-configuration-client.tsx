"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";
import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  archiveStorePackage,
  createStorePackage,
  getCvEconomyConfiguration,
  getStorePackageById,
  getStorePackages,
  reorderStorePackages,
  restoreStorePackage,
  updateCvEconomyConfiguration,
  updateStorePackage,
} from "@/service/package-store/package-store.service";
import type {
  CreateStorePackagePayload,
  CvEconomyConfiguration,
  StorePackage,
  UpdateStorePackagePayload,
} from "@/types/package-store/package-store.type";

import CreateSalesPackageDialog from "./create-sales-package-dialog";
import CVCreditRefillPackages from "./cv-credit-refill-packages";
import CVPackageHeader from "./cv-package-header";
import FreeTierConfiguration from "./free-tier-configuration";
import SavePackageSettingsBar from "./save-package-settings-bar";

interface CvPackageConfigurationClientProps {
  search: string;
}

interface PendingPackageAction {
  type: "archive" | "restore";
  storePackage: StorePackage;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

const emptyEconomy: CvEconomyConfiguration = {
  freeCreditsPerSignup: 3,
  allowEditingWithoutCredit: true,
};

export default function CvPackageConfigurationClient({
  search,
}: CvPackageConfigurationClientProps) {
  const [savedEconomy, setSavedEconomy] =
    useState<CvEconomyConfiguration>(emptyEconomy);
  const [economy, setEconomy] = useState<CvEconomyConfiguration>(emptyEconomy);
  const [packages, setPackages] = useState<StorePackage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingEconomy, setIsSavingEconomy] = useState(false);
  const [isSubmittingPackage, setIsSubmittingPackage] = useState(false);
  const [isPackageDialogOpen, setIsPackageDialogOpen] = useState(false);
  const [isPackageDialogDirty, setIsPackageDialogDirty] = useState(false);
  const [editingPackage, setEditingPackage] = useState<StorePackage | null>(
    null,
  );
  const [pendingPackageAction, setPendingPackageAction] =
    useState<PendingPackageAction | null>(null);
  const [isRunningPackageAction, setIsRunningPackageAction] = useState(false);
  const [draggedPackageId, setDraggedPackageId] = useState<string | null>(null);

  const isEconomyDirty = useMemo(
    () =>
      economy.freeCreditsPerSignup !== savedEconomy.freeCreditsPerSignup ||
      economy.allowEditingWithoutCredit !==
        savedEconomy.allowEditingWithoutCredit,
    [economy, savedEconomy],
  );

  const unsaved = useUnsavedChangesWarning(
    isEconomyDirty || isPackageDialogDirty,
  );

  const loadPackages = useCallback(async () => {
    const response = await getStorePackages({
      packageType: "cv_credit",
      search,
      page: 1,
      limit: 100,
    });

    setPackages(response.items);
  }, [search]);

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        const [economyResponse, packagesResponse] = await Promise.all([
          getCvEconomyConfiguration(),
          getStorePackages({
            packageType: "cv_credit",
            search,
            page: 1,
            limit: 100,
          }),
        ]);

        if (!mounted) return;

        setSavedEconomy(economyResponse);
        setEconomy(economyResponse);
        setPackages(packagesResponse.items);
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      mounted = false;
    };
  }, [search]);

  const closePackageDialog = () => {
    const close = () => {
      setIsPackageDialogOpen(false);
      setIsPackageDialogDirty(false);
      setEditingPackage(null);
    };

    unsaved.requestAction(close);
  };

  const handleSaveEconomy = async () => {
    const toastId = toast.loading("Saving CV package settings...");

    try {
      setIsSavingEconomy(true);

      const response = await updateCvEconomyConfiguration({
        freeCreditsPerSignup: economy.freeCreditsPerSignup,
        allowEditingWithoutCredit: economy.allowEditingWithoutCredit,
      });

      setSavedEconomy(response);
      setEconomy(response);

      toast.success("CV package settings saved.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSavingEconomy(false);
    }
  };

  const handleCreatePackage = async (payload: CreateStorePackagePayload) => {
    const toastId = toast.loading("Creating CV credit package...");

    try {
      setIsSubmittingPackage(true);
      await createStorePackage(payload);
      await loadPackages();

      setIsPackageDialogOpen(false);
      setIsPackageDialogDirty(false);
      setEditingPackage(null);

      toast.success("CV credit package created.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  const handleUpdatePackage = async (
    packageId: string,
    payload: UpdateStorePackagePayload,
  ) => {
    const toastId = toast.loading("Updating CV credit package...");

    try {
      setIsSubmittingPackage(true);
      await updateStorePackage(packageId, payload);
      await loadPackages();

      setIsPackageDialogOpen(false);
      setIsPackageDialogDirty(false);
      setEditingPackage(null);

      toast.success("CV credit package updated.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmittingPackage(false);
    }
  };

  const handleEditPackage = async (packageId: string) => {
    try {
      const response = await getStorePackageById(packageId);
      setEditingPackage(response);
      setIsPackageDialogOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    }
  };

  const handleConfirmPackageAction = async () => {
    if (!pendingPackageAction) return;

    const toastId = toast.loading(
      pendingPackageAction.type === "archive"
        ? "Archiving package..."
        : "Restoring package...",
    );

    try {
      setIsRunningPackageAction(true);

      if (pendingPackageAction.type === "archive") {
        await archiveStorePackage(pendingPackageAction.storePackage.id);
      } else {
        await restoreStorePackage(pendingPackageAction.storePackage.id);
      }

      await loadPackages();

      toast.success(
        pendingPackageAction.type === "archive"
          ? "Package archived."
          : "Package restored.",
        { id: toastId },
      );

      setPendingPackageAction(null);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsRunningPackageAction(false);
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

    if (sourceIndex < 0 || targetIndex < 0) {
      setDraggedPackageId(null);
      return;
    }

    const nextPackages = [...packages];
    const [movedPackage] = nextPackages.splice(sourceIndex, 1);
    nextPackages.splice(targetIndex, 0, movedPackage);

    setPackages(nextPackages);
    setDraggedPackageId(null);

    try {
      await reorderStorePackages({
        items: nextPackages.map((item, index) => ({
          packageId: item.id,
          sortOrder: index,
        })),
      });

      toast.success("Package order updated.");
    } catch (error) {
      toast.error(getErrorMessage(error));
      await loadPackages();
    }
  };

  return (
    <>
      <div className="space-y-7">
        <CVPackageHeader
          onBack={() => unsaved.requestNavigation("/admin/cv-service")}
        />

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <FreeTierConfiguration
            freeCreditsPerSignup={economy.freeCreditsPerSignup}
            allowEditingWithoutCredit={economy.allowEditingWithoutCredit}
            disabled={isLoading || isSavingEconomy}
            onFreeCreditsChange={(value) =>
              setEconomy((current) => ({
                ...current,
                freeCreditsPerSignup: value,
              }))
            }
            onAllowEditingChange={(value) =>
              setEconomy((current) => ({
                ...current,
                allowEditingWithoutCredit: value,
              }))
            }
          />

          <CVCreditRefillPackages
            packages={packages}
            isLoading={isLoading}
            draggedPackageId={draggedPackageId}
            onCreatePackage={() => {
              setEditingPackage(null);
              setIsPackageDialogOpen(true);
            }}
            onEditPackage={handleEditPackage}
            onArchivePackage={(storePackage) =>
              setPendingPackageAction({
                type: "archive",
                storePackage,
              })
            }
            onRestorePackage={(storePackage) =>
              setPendingPackageAction({
                type: "restore",
                storePackage,
              })
            }
            onDragStart={setDraggedPackageId}
            onDragEnd={() => setDraggedPackageId(null)}
            onDrop={handleDrop}
          />
        </div>

        <SavePackageSettingsBar
          disabled={!isEconomyDirty || isLoading}
          isSaving={isSavingEconomy}
          onSave={handleSaveEconomy}
        />
      </div>

      <CreateSalesPackageDialog
        key={`${editingPackage?.id || "new"}-${isPackageDialogOpen ? "open" : "closed"}`}
        open={isPackageDialogOpen}
        initialPackage={editingPackage}
        isSubmitting={isSubmittingPackage}
        onClose={closePackageDialog}
        onDirtyChange={setIsPackageDialogDirty}
        onCreate={handleCreatePackage}
        onUpdate={handleUpdatePackage}
      />

      <ConfirmActionDialog
        open={Boolean(pendingPackageAction)}
        title={
          pendingPackageAction?.type === "archive"
            ? "Archive Package"
            : "Restore Package"
        }
        description={
          pendingPackageAction?.type === "archive"
            ? `Archive ${pendingPackageAction.storePackage.name}? It will no longer be available for purchase.`
            : `Restore ${pendingPackageAction?.storePackage.name}? It will become available again.`
        }
        confirmLabel={
          pendingPackageAction?.type === "archive" ? "Archive" : "Restore"
        }
        danger={pendingPackageAction?.type === "archive"}
        isSubmitting={isRunningPackageAction}
        onCancel={() => setPendingPackageAction(null)}
        onConfirm={handleConfirmPackageAction}
      />

      <UnsavedChangesWarningDialog
        open={unsaved.warningOpen}
        onCancel={unsaved.cancelNavigation}
        onConfirm={unsaved.confirmNavigation}
      />
    </>
  );
}
