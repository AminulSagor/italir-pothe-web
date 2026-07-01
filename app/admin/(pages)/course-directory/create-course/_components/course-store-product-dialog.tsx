"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, Store, X } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  createCourseProviderProduct,
  updateCourseProviderProduct,
} from "@/service/course-directory/course-commerce.service";
import type {
  CoursePaymentProvider,
  CourseProviderProduct,
} from "@/types/course-directory/course-commerce.type";

interface CourseStoreProductDialogProps {
  open: boolean;
  courseId: string;
  courseTitle: string;

  product: CourseProviderProduct | null;

  onClose: () => void;
  onSaved: () => Promise<void> | void;
}

interface CourseProductDraft {
  provider: CoursePaymentProvider;

  productId: string;
  isActive: boolean;
}

const productIdPattern = /^[A-Za-z0-9._-]+$/;

const createDraft = (
  product: CourseProviderProduct | null,
): CourseProductDraft => ({
  provider: product?.provider || "google_play",

  productId: product?.productId || "",

  isActive: product?.isActive ?? true,
});

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to save the course store product.";
};

export default function CourseStoreProductDialog({
  open,
  courseId,
  courseTitle,
  product,
  onClose,
  onSaved,
}: CourseStoreProductDialogProps) {
  const [draft, setDraft] = useState<CourseProductDraft>(createDraft(product));

  const [savedDraft, setSavedDraft] = useState<CourseProductDraft>(
    createDraft(product),
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    const nextDraft = createDraft(product);

    setDraft(nextDraft);
    setSavedDraft(nextDraft);
  }, [open, product]);

  const isDirty = useMemo(
    () => open && JSON.stringify(draft) !== JSON.stringify(savedDraft),
    [draft, open, savedDraft],
  );

  const unsavedChanges = useUnsavedChangesWarning(isDirty);

  const requestClose = () => {
    unsavedChanges.requestAction(onClose);
  };

  const validate = () => {
    const productId = draft.productId.trim();

    if (!productId) {
      toast.error("Product ID is required.");

      return false;
    }

    if (!productIdPattern.test(productId)) {
      toast.error(
        "Product ID may contain only letters, numbers, dots, underscores and hyphens.",
      );

      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    const toastId = toast.loading(
      product
        ? "Updating course store product..."
        : "Creating course store product...",
    );

    try {
      setIsSubmitting(true);

      if (product) {
        await updateCourseProviderProduct(courseId, product.id, {
          productId: draft.productId.trim(),

          productType: "non_consumable",

          basePlanId: null,
          offerId: null,

          isActive: draft.isActive,
        });
      } else {
        await createCourseProviderProduct(courseId, {
          provider: draft.provider,

          productId: draft.productId.trim(),

          productType: "non_consumable",

          basePlanId: null,
          offerId: null,

          isActive: draft.isActive,
        });
      }

      setSavedDraft(draft);

      await onSaved();

      onClose();

      toast.success(
        product
          ? "Course store product updated."
          : "Course store product created.",
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

  return (
    <>
      <Dialog open={open} onClose={requestClose} size="md" className="p-0">
        <div className="border-b border-[#E8EEE8] px-7 py-6">
          <button
            type="button"
            disabled={isSubmitting}
            onClick={requestClose}
            aria-label="Close course store product form"
            className="absolute right-6 top-6 flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-full bg-[#FFF0D6] text-[#B66800]">
              <Store className="size-5" />
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#006B3F]">
                {product ? "Edit Store Product" : "Add Store Product"}
              </h2>

              <p className="max-w-[370px] truncate text-sm text-[#66736A]">
                {courseTitle}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-5 px-7 py-6">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
              Provider
            </span>

            <select
              value={draft.provider}
              disabled={Boolean(product) || isSubmitting}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,

                  provider: event.target.value as CoursePaymentProvider,
                }))
              }
              className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-60"
            >
              <option value="google_play">Google Play</option>

              <option value="app_store">App Store</option>
            </select>

            {product && (
              <p className="mt-2 text-xs text-[#8A948D]">
                Provider cannot be changed after a mapping is created.
              </p>
            )}
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
              Product ID
            </span>

            <input
              type="text"
              value={draft.productId}
              maxLength={255}
              disabled={isSubmitting}
              placeholder={
                draft.provider === "google_play"
                  ? "Example: italian_a1_course"
                  : "Example: com.italirpothe.course.a1"
              }
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,

                  productId: event.target.value,
                }))
              }
              className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
              Product Type
            </span>

            <input
              type="text"
              value="Non Consumable"
              disabled
              className="h-12 w-full rounded-full bg-[#E4EAE4] px-5 text-sm text-[#66736A] outline-none"
            />

            <p className="mt-2 text-xs leading-5 text-[#8A948D]">
              A course purchase grants permanent course access, so the product
              type is fixed as non-consumable.
            </p>
          </label>

          <label className="flex items-center justify-between rounded-full bg-[#EEF3EC] px-5 py-4">
            <div>
              <p className="text-sm font-semibold text-[#202420]">
                Active Mapping
              </p>

              <p className="mt-1 text-xs text-[#8A948D]">
                Only active mappings should be offered to users.
              </p>
            </div>

            <input
              type="checkbox"
              checked={draft.isActive}
              disabled={isSubmitting}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,

                  isActive: event.target.checked,
                }))
              }
              className="size-5 accent-[#006B3F]"
            />
          </label>

          <div className="rounded-[1.25rem] border border-[#DDE5DE] bg-[#F8FBF8] px-5 py-4">
            <p className="text-xs font-bold uppercase text-[#66736A]">
              Store Configuration
            </p>

            <div className="mt-3 space-y-2 text-sm text-[#4F5B52]">
              <div className="flex items-center justify-between gap-4">
                <span>Base Plan ID</span>
                <strong>Not applicable</strong>
              </div>

              <div className="flex items-center justify-between gap-4">
                <span>Offer ID</span>
                <strong>Not applicable</strong>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 bg-[#F7FAF7] px-7 py-6 sm:flex-row sm:justify-end">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={requestClose}
          >
            Cancel
          </Button>

          <Button disabled={isSubmitting} onClick={() => void handleSubmit()}>
            {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}

            {product ? "Save Changes" : "Create Mapping"}
          </Button>
        </div>
      </Dialog>

      <UnsavedChangesWarningDialog
        open={unsavedChanges.warningOpen}
        onCancel={unsavedChanges.cancelNavigation}
        onConfirm={unsavedChanges.confirmNavigation}
      />
    </>
  );
}
