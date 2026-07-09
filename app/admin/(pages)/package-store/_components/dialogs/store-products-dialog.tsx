"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Store,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  createStoreProviderProduct,
  deactivateStoreProviderProduct,
  deleteStoreProviderProduct,
  getStoreProviderProducts,
  updateStoreProviderProduct,
} from "@/service/package-store/package-store.service";
import type {
  StorePackage,
  StorePaymentProvider,
  StoreProviderProduct,
  StoreProviderProductType,
} from "@/types/package-store/package-store.type";

interface StoreProductsDialogProps {
  open: boolean;
  storePackage: StorePackage | null;
  onClose: () => void;
  onChanged: () => Promise<void> | void;
}

interface ProductDraft {
  provider: StorePaymentProvider;
  productId: string;
  productType: StoreProviderProductType;
  basePlanId: string;
  offerId: string;
  isActive: boolean;
}

const productIdPattern = /^[A-Za-z0-9._-]+$/;

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

const formatValue = (value: string) =>
  value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());

const getExpectedProductType = (
  storePackage: StorePackage,
): StoreProviderProductType =>
  storePackage.billingModel === "monthly" ? "subscription" : "consumable";

const createEmptyDraft = (storePackage: StorePackage): ProductDraft => ({
  provider: "google_play",
  productId: "",
  productType: getExpectedProductType(storePackage),
  basePlanId: "",
  offerId: "",
  isActive: true,
});

const createEditDraft = (item: StoreProviderProduct): ProductDraft => ({
  provider: item.provider,
  productId: item.productId,
  productType: item.productType,
  basePlanId: item.basePlanId || "",
  offerId: item.offerId || "",
  isActive: item.isActive,
});

export default function StoreProductsDialog({
  open,
  storePackage,
  onClose,
  onChanged,
}: StoreProductsDialogProps) {
  const [items, setItems] = useState<StoreProviderProduct[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [runningActionId, setRunningActionId] = useState<string | null>(null);

  const [editingItem, setEditingItem] = useState<StoreProviderProduct | null>(
    null,
  );

  const [formOpen, setFormOpen] = useState(false);

  const [draft, setDraft] = useState<ProductDraft | null>(null);

  const [savedDraft, setSavedDraft] = useState<ProductDraft | null>(null);

  const isDirty = useMemo(() => {
    if (!formOpen || !draft || !savedDraft) {
      return false;
    }

    return JSON.stringify(draft) !== JSON.stringify(savedDraft);
  }, [draft, formOpen, savedDraft]);

  const unsaved = useUnsavedChangesWarning(isDirty);

  useEffect(() => {
    if (!open || !storePackage) {
      return;
    }

    let mounted = true;

    const loadItems = async () => {
      try {
        setIsLoading(true);

        const response = await getStoreProviderProducts(storePackage.id);

        if (mounted) {
          setItems(response.items);
        }
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));

          setItems([]);
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void loadItems();

    return () => {
      mounted = false;
    };
  }, [open, storePackage]);

  if (!storePackage) {
    return null;
  }

  const expectedProductType = getExpectedProductType(storePackage);

  const loadItems = async () => {
    const response = await getStoreProviderProducts(storePackage.id);

    setItems(response.items);
  };

  const resetEditor = () => {
    setEditingItem(null);
    setFormOpen(false);
    setDraft(null);
    setSavedDraft(null);
  };

  const requestClose = () => {
    unsaved.requestAction(() => {
      resetEditor();
      onClose();
    });
  };

  const requestCancelEditor = () => {
    unsaved.requestAction(resetEditor);
  };

  const openCreateForm = () => {
    const nextDraft = createEmptyDraft(storePackage);

    setEditingItem(null);
    setDraft(nextDraft);
    setSavedDraft(nextDraft);
    setFormOpen(true);
  };

  const openEditForm = (item: StoreProviderProduct) => {
    const nextDraft = createEditDraft(item);

    setEditingItem(item);
    setDraft(nextDraft);
    setSavedDraft(nextDraft);
    setFormOpen(true);
  };

  const updateDraft = <Key extends keyof ProductDraft>(
    key: Key,
    value: ProductDraft[Key],
  ) => {
    setDraft((current) => {
      if (!current) {
        return current;
      }

      const nextDraft = {
        ...current,
        [key]: value,
      };

      if (key === "provider" && value === "app_store") {
        nextDraft.basePlanId = "";
      }

      return nextDraft;
    });
  };

  const validateDraft = () => {
    if (!draft) {
      return false;
    }

    if (draft.productType !== expectedProductType) {
      toast.error(
        `This package must use ${formatValue(expectedProductType)} store products.`,
      );

      return false;
    }

    if (!draft.productId.trim()) {
      toast.error("Product ID is required.");

      return false;
    }

    if (!productIdPattern.test(draft.productId.trim())) {
      toast.error(
        "Product ID may contain only letters, numbers, dots, underscores and hyphens.",
      );

      return false;
    }

    if (
      expectedProductType === "subscription" &&
      draft.provider === "google_play" &&
      !draft.basePlanId.trim()
    ) {
      toast.error("Google Play subscriptions require a Base Plan ID.");

      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!draft || !validateDraft()) {
      return;
    }

    const toastId = toast.loading(
      editingItem ? "Updating store product..." : "Creating store product...",
    );

    try {
      setIsSubmitting(true);

      const payload = {
        productId: draft.productId.trim(),

        productType: expectedProductType,

        basePlanId:
          expectedProductType === "subscription" &&
          draft.provider === "google_play"
            ? draft.basePlanId.trim() || null
            : null,

        offerId: draft.offerId.trim() || null,

        isActive: draft.isActive,
      };

      if (editingItem) {
        await updateStoreProviderProduct(
          storePackage.id,
          editingItem.id,
          payload,
        );
      } else {
        await createStoreProviderProduct(storePackage.id, {
          provider: draft.provider,

          productId: payload.productId,

          productType: expectedProductType,

          basePlanId: payload.basePlanId || undefined,

          offerId: payload.offerId || undefined,

          isActive: payload.isActive,
        });
      }

      await loadItems();
      await onChanged();

      resetEditor();

      toast.success(
        editingItem ? "Store product updated." : "Store product created.",
        {
          id: toastId,
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (item: StoreProviderProduct) => {
    const confirmed = window.confirm(
      `Delete provider product mapping "${item.productId}" permanently?\n\nIf this mapping is already used by an order, backend will reject this action. Use deactivate for historical/used mappings.`,
    );

    if (!confirmed) {
      return;
    }

    const toastId = toast.loading("Deleting store product mapping...");

    try {
      setRunningActionId(item.id);

      await deleteStoreProviderProduct(storePackage.id, item.id);

      await loadItems();
      await onChanged();

      toast.success("Store product mapping deleted.", {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setRunningActionId(null);
    }
  };

  const handleActiveChange = async (
    item: StoreProviderProduct,
    isActive: boolean,
  ) => {
    const toastId = toast.loading(
      isActive
        ? "Activating store product..."
        : "Deactivating store product...",
    );

    try {
      setRunningActionId(item.id);

      if (isActive) {
        await updateStoreProviderProduct(storePackage.id, item.id, {
          isActive: true,
        });
      } else {
        await deactivateStoreProviderProduct(storePackage.id, item.id);
      }

      await loadItems();
      await onChanged();

      toast.success(
        isActive ? "Store product activated." : "Store product deactivated.",
        {
          id: toastId,
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setRunningActionId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={requestClose} size="xl" className="p-0">
        <div className="border-b border-[#EEF2EE] px-7 py-6">
          <button
            type="button"
            onClick={requestClose}
            disabled={isSubmitting}
            className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF2EE] disabled:opacity-50"
            aria-label="Close store products"
          >
            <X className="size-4 text-[#4D574F]" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-full bg-[#DDF3E8] text-[#006B3F]">
              <Store className="size-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#006B3F]">
                Store Products
              </h2>

              <p className="text-sm text-[#4F5B52]">{storePackage.name}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6 px-7 py-6">
          {!formOpen && (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-[#202420]">
                  Google Play and App Store mappings
                </p>

                <p className="mt-1 text-xs leading-5 text-[#6F776F]">
                  {storePackage.billingModel === "monthly"
                    ? "This monthly package must use subscription products."
                    : "This one-time package must use consumable products."}
                </p>
              </div>

              <Button onClick={openCreateForm} className="gap-2">
                <Plus className="size-4" />
                Add Store Product
              </Button>
            </div>
          )}

          {formOpen && draft ? (
            <div className="rounded-[1.75rem] border border-[#DDE5DE] bg-[#F8FBF8] p-6">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-[#202420]">
                    {editingItem ? "Edit Store Product" : "Add Store Product"}
                  </h3>

                  <p className="text-xs text-[#6F776F]">
                    Provider cannot be changed after the mapping is created.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={requestCancelEditor}
                  disabled={isSubmitting}
                  className="flex size-9 items-center justify-center rounded-full bg-[#EEF2EE] disabled:opacity-50"
                  aria-label="Cancel store product editing"
                >
                  <X className="size-4" />
                </button>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField
                  label="Provider"
                  value={draft.provider}
                  disabled={Boolean(editingItem) || isSubmitting}
                  onChange={(value) =>
                    updateDraft("provider", value as StorePaymentProvider)
                  }
                  options={[
                    {
                      label: "Google Play",
                      value: "google_play",
                    },
                    {
                      label: "App Store",
                      value: "app_store",
                    },
                  ]}
                />

                <label>
                  <span className="mb-2 block text-xs font-medium text-[#5F675F]">
                    PRODUCT TYPE
                  </span>

                  <input
                    value={formatValue(expectedProductType)}
                    disabled
                    className="h-12 w-full rounded-full bg-[#E7ECE7] px-5 text-sm text-[#6F776F] outline-none"
                  />
                </label>

                <label className="sm:col-span-2">
                  <span className="mb-2 block text-xs font-medium text-[#5F675F]">
                    PRODUCT ID
                  </span>

                  <input
                    value={draft.productId}
                    maxLength={255}
                    disabled={isSubmitting}
                    placeholder="Example: ai_bundle_100_v1"
                    onChange={(event) =>
                      updateDraft("productId", event.target.value)
                    }
                    className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none"
                  />
                </label>

                {expectedProductType === "subscription" &&
                  draft.provider === "google_play" && (
                    <label>
                      <span className="mb-2 block text-xs font-medium text-[#5F675F]">
                        BASE PLAN ID
                      </span>

                      <input
                        value={draft.basePlanId}
                        maxLength={255}
                        disabled={isSubmitting}
                        placeholder="Required for Google Play"
                        onChange={(event) =>
                          updateDraft("basePlanId", event.target.value)
                        }
                        className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none"
                      />
                    </label>
                  )}

                <label
                  className={
                    expectedProductType === "subscription" &&
                    draft.provider === "google_play"
                      ? ""
                      : "sm:col-span-2"
                  }
                >
                  <span className="mb-2 block text-xs font-medium text-[#5F675F]">
                    OFFER ID (OPTIONAL)
                  </span>

                  <input
                    value={draft.offerId}
                    maxLength={255}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      updateDraft("offerId", event.target.value)
                    }
                    className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none"
                  />
                </label>

                <label className="flex items-center justify-between rounded-full bg-[#EEF2EC] px-5 py-4 sm:col-span-2">
                  <span className="text-sm font-semibold text-[#202420]">
                    Active Mapping
                  </span>

                  <input
                    type="checkbox"
                    checked={draft.isActive}
                    disabled={isSubmitting}
                    onChange={(event) =>
                      updateDraft("isActive", event.target.checked)
                    }
                    className="size-5 accent-[#006B3F]"
                  />
                </label>
              </div>
              <div className="mt-6 rounded-[1.25rem] border border-[#FFE2A8] bg-[#FFF8E8] px-5 py-4">
                <p className="text-xs font-bold uppercase text-[#8A5A00]">
                  Billing Mapping Warnings
                </p>

                <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-[#6F4A00]">
                  <li>
                    Google Play product ID must exactly match Play Console.
                  </li>
                  <li>
                    App Store product ID must exactly match App Store Connect.
                  </li>
                  <li>
                    AI bundle, CV credit and finite streak freezer packages must
                    be consumable.
                  </li>
                  <li>
                    Unlimited monthly streak protection must be subscription.
                  </li>
                  <li>
                    Do not reuse old product IDs for a different package
                    meaning.
                  </li>
                </ul>

                <p className="mt-3 text-xs leading-5 text-[#6F4A00]">
                  Google Play and App Store control the real localized customer
                  price. The backend package price is for internal display,
                  quote, reporting and fallback logic.
                </p>
              </div>
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  disabled={isSubmitting}
                  onClick={requestCancelEditor}
                >
                  Cancel
                </Button>

                <Button disabled={isSubmitting} onClick={handleSubmit}>
                  {isSubmitting && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}

                  {editingItem ? "Save Changes" : "Create Mapping"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {isLoading && (
                <div className="flex min-h-40 items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-[#006B3F]" />
                </div>
              )}

              {!isLoading && items.length === 0 && (
                <div className="rounded-[1.5rem] bg-[#F4F7F4] px-6 py-10 text-center text-sm text-[#6F776F]">
                  No Google Play or App Store product mappings have been added.
                </div>
              )}

              {!isLoading &&
                items.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.5rem] border border-[#E2E9E3] p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-[#E7F1FF] px-3 py-1 text-xs font-bold text-[#3568C0]">
                            {item.provider === "google_play"
                              ? "Google Play"
                              : "App Store"}
                          </span>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.isActive
                                ? "bg-[#DDF3E8] text-[#006B3F]"
                                : "bg-[#EEF2EE] text-[#6F776F]"
                            }`}
                          >
                            {item.isActive ? "Active" : "Inactive"}
                          </span>

                          <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#A86500]">
                            {formatValue(item.productType)}
                          </span>
                        </div>

                        <p className="mt-3 break-all text-sm font-bold text-[#202420]">
                          {item.productId}
                        </p>

                        <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[#6F776F]">
                          <span>Base plan: {item.basePlanId || "—"}</span>

                          <span>Offer: {item.offerId || "—"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => openEditForm(item)}
                          disabled={runningActionId === item.id}
                          className="flex size-9 items-center justify-center rounded-full bg-[#DDEEEE] text-[#006B3F] disabled:opacity-50"
                          aria-label={`Edit ${item.productId}`}
                        >
                          <Pencil className="size-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            void handleActiveChange(item, !item.isActive)
                          }
                          disabled={runningActionId === item.id}
                          className={`flex size-9 items-center justify-center rounded-full disabled:opacity-50 ${
                            item.isActive
                              ? "bg-[#FFDCDD] text-[#D92D20]"
                              : "bg-[#DDF3E8] text-[#006B3F]"
                          }`}
                          aria-label={
                            item.isActive
                              ? `Deactivate ${item.productId}`
                              : `Activate ${item.productId}`
                          }
                        >
                          {runningActionId === item.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : item.isActive ? (
                            <PowerOff className="size-4" />
                          ) : (
                            <Power className="size-4" />
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          disabled={runningActionId === item.id}
                          className="flex size-9 items-center justify-center rounded-full bg-[#FCEBEC] text-[#B42318] disabled:opacity-50"
                          aria-label={`Delete ${item.productId}`}
                          title="Delete permanently"
                        >
                          {runningActionId === item.id ? (
                            <Loader2 className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        <div className="flex justify-end bg-[#F6F8F4] px-7 py-6">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={requestClose}
          >
            Close
          </Button>
        </div>
      </Dialog>

      <UnsavedChangesWarningDialog
        open={unsaved.warningOpen}
        onCancel={unsaved.cancelNavigation}
        onConfirm={unsaved.confirmNavigation}
      />
    </>
  );
}

function SelectField({
  label,
  value,
  options,
  disabled,
  onChange,
}: {
  label: string;
  value: string;

  options: Array<{
    label: string;
    value: string;
  }>;

  disabled?: boolean;

  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-medium text-[#5F675F]">
        {label.toUpperCase()}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF2EC] px-5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
