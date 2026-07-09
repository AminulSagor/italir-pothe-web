"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Loader2,
  Pencil,
  Plus,
  Power,
  PowerOff,
  Store,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import {
  deactivateCourseProviderProduct,
  deleteCourseProviderProduct,
  getCourseProviderProducts,
  updateCourseProviderProduct,
} from "@/service/course-directory/course-commerce.service";
import type { CourseProviderProduct } from "@/types/course-directory/course-commerce.type";

import CourseStoreProductDialog from "./course-store-product-dialog";

interface CourseStoreProductsCardProps {
  courseId?: string | null;
  courseTitle: string;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to update the course store product.";
};

const formatProvider = (provider: CourseProviderProduct["provider"]) => {
  return provider === "google_play" ? "Google Play" : "App Store";
};

export default function CourseStoreProductsCard({
  courseId,
  courseTitle,
}: CourseStoreProductsCardProps) {
  const [items, setItems] = useState<CourseProviderProduct[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const [runningActionId, setRunningActionId] = useState<string | null>(null);

  const [editorOpen, setEditorOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] =
    useState<CourseProviderProduct | null>(null);

  const loadProducts = useCallback(async () => {
    if (!courseId) {
      setItems([]);
      return;
    }

    try {
      setIsLoading(true);

      const response = await getCourseProviderProducts(courseId);

      setItems(response.items);
    } catch (error) {
      toast.error(getErrorMessage(error));

      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  const openCreateDialog = () => {
    setSelectedProduct(null);
    setEditorOpen(true);
  };

  const openEditDialog = (product: CourseProviderProduct) => {
    setSelectedProduct(product);
    setEditorOpen(true);
  };

  const closeDialog = () => {
    setEditorOpen(false);
    setSelectedProduct(null);
  };

  const handleDelete = async (product: CourseProviderProduct) => {
    if (!courseId) {
      return;
    }

    const confirmed = window.confirm(
      `Delete course store product mapping "${product.productId}" permanently?\n\nIf this mapping is already used by an order, backend will reject this action. Use deactivate for historical/used mappings.`,
    );

    if (!confirmed) {
      return;
    }

    const toastId = toast.loading("Deleting course store product mapping...");

    try {
      setRunningActionId(product.id);

      await deleteCourseProviderProduct(courseId, product.id);

      await loadProducts();

      toast.success("Course store product mapping deleted.", {
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
    product: CourseProviderProduct,
    nextActive: boolean,
  ) => {
    if (!courseId) {
      return;
    }

    const toastId = toast.loading(
      nextActive
        ? "Activating course store product..."
        : "Deactivating course store product...",
    );

    try {
      setRunningActionId(product.id);

      if (nextActive) {
        await updateCourseProviderProduct(courseId, product.id, {
          isActive: true,
        });
      } else {
        await deactivateCourseProviderProduct(courseId, product.id);
      }

      await loadProducts();

      toast.success(
        nextActive
          ? "Course store product activated."
          : "Course store product deactivated.",
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
      <Card padding="lg" rounded="3xl" shadow="sm">
        <div className="flex flex-col gap-5 items-center justify-center">
          <div className="flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#FFF0D6] text-[#B66800]">
              <Store className="size-5" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-[#202420]">
                Store Products
              </h2>

              <p className="mt-1 max-w-xl text-sm leading-6 text-[#66736A]">
                Connect this course to its regular and coupon_ Google Play / App
                Store non-consumable products.
              </p>
            </div>
          </div>

          {courseId && (
            <Button size="sm" onClick={openCreateDialog} className="gap-2">
              <Plus className="size-4" />
              Add Store Product
            </Button>
          )}
        </div>

        {!courseId ? (
          <div className="mt-7 rounded-[1.5rem] bg-[#F3F6F2] px-6 py-8 text-center">
            <p className="text-sm font-semibold text-[#4F5B52]">
              Save the course first
            </p>

            <p className="mt-2 text-xs leading-5 text-[#8A948D]">
              Google Play and App Store products can be configured after the
              course has a saved course ID.
            </p>
          </div>
        ) : isLoading ? (
          <div className="mt-7 flex min-h-32 items-center justify-center">
            <Loader2 className="size-6 animate-spin text-[#006B3F]" />
          </div>
        ) : items.length === 0 ? (
          <div className="mt-7 rounded-[1.5rem] bg-[#F3F6F2] px-6 py-8 text-center">
            <p className="text-sm font-semibold text-[#4F5B52]">
              No store products configured
            </p>

            <p className="mt-2 text-xs leading-5 text-[#8A948D]">
              Create the matching products in Google Play Console and App Store
              Connect, then add their product IDs here.
            </p>
          </div>
        ) : (
          <div className="mt-7 space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="rounded-[1.5rem] border border-[#E1E8E2] px-5 py-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.provider === "google_play"
                            ? "bg-[#E7F1FF] text-[#3568C0]"
                            : "bg-[#F2E8FF] text-[#7540A8]"
                        }`}
                      >
                        {formatProvider(item.provider)}
                      </span>

                      <span className="rounded-full bg-[#FFF3D6] px-3 py-1 text-xs font-bold text-[#A86500]">
                        Non Consumable
                      </span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          item.isActive
                            ? "bg-[#DDF3E8] text-[#006B3F]"
                            : "bg-[#EEF2EE] text-[#66736A]"
                        }`}
                      >
                        {item.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-3 break-all text-sm font-bold text-[#202420]">
                      {item.productId}
                    </p>

                    <p className="mt-1 text-xs text-[#8A948D]">
                      Product type: {item.productType}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2">
                    <button
                      type="button"
                      disabled={runningActionId === item.id}
                      onClick={() => openEditDialog(item)}
                      className="flex size-9 items-center justify-center rounded-full bg-[#DDEEEE] text-[#006B3F] disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label={`Edit ${item.productId}`}
                      title="Edit Store Product"
                    >
                      <Pencil className="size-4" />
                    </button>

                    <button
                      type="button"
                      disabled={runningActionId === item.id}
                      onClick={() =>
                        void handleActiveChange(item, !item.isActive)
                      }
                      className={`flex size-9 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-50 ${
                        item.isActive
                          ? "bg-[#FCEBEC] text-[#B42318]"
                          : "bg-[#DDF3E8] text-[#006B3F]"
                      }`}
                      aria-label={
                        item.isActive
                          ? `Deactivate ${item.productId}`
                          : `Activate ${item.productId}`
                      }
                      title={item.isActive ? "Deactivate" : "Activate"}
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
                      disabled={runningActionId === item.id}
                      onClick={() => void handleDelete(item)}
                      className="flex size-9 items-center justify-center rounded-full bg-[#FCEBEC] text-[#B42318] disabled:cursor-not-allowed disabled:opacity-50"
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
      </Card>

      {courseId && (
        <CourseStoreProductDialog
          open={editorOpen}
          courseId={courseId}
          courseTitle={courseTitle || "Untitled Course"}
          product={selectedProduct}
          onClose={closeDialog}
          onSaved={loadProducts}
        />
      )}
    </>
  );
}
