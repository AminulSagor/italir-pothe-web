"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Loader2, PlusCircle, Power, Trash2, X } from "lucide-react";
import toast from "react-hot-toast";
import { usePathname, useRouter } from "next/navigation";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";
import Dialog from "@/components/UI/dialogs/dialog";
import {
  archiveStorePackage,
  createStorePackage,
  getStorePackages,
  setStorePackageAvailability,
} from "@/service/package-store/package-store.service";
import type {
  CreateStorePackagePayload,
  StoreBillingModel,
  StorePackage,
  StorePackageStatus,
  StorePaymentProvider,
} from "@/types/package-store/package-store.type";

import StorePagination from "./store-pagination";

interface Props {
  search: string;
  page: number;
  status: string;
  provider: string;
}
interface Form {
  billingModel: Extract<StoreBillingModel, "monthly" | "yearly">;
  appleProductId: string;
  googleProductId: string;
  googleBasePlanId: string;
}

const PLANS = {
  monthly: { name: "Ad-Free Monthly", price: "1.99", duration: "1 month" },
  yearly: { name: "Ad-Free Yearly", price: "15.00", duration: "1 year" },
} as const;
const EMPTY_FORM: Form = {
  billingModel: "monthly",
  appleProductId: "",
  googleProductId: "",
  googleBasePlanId: "",
};
const inputClass =
  "mt-2 h-11 w-full rounded-xl border border-[#D8E0DA] bg-white px-4 text-sm outline-none focus:border-[#006B3F]";
const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

export default function AdFreeTable({ search, page, status, provider }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [packages, setPackages] = useState<StorePackage[]>([]);
  const [meta, setMeta] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState<{
    mode: "delete" | "availability";
    item: StorePackage;
  } | null>(null);

  const normalizedStatus: StorePackageStatus | undefined =
    status === "published" || status === "archived" ? status : undefined;
  const normalizedProvider: StorePaymentProvider | undefined =
    provider === "google_play" || provider === "app_store"
      ? provider
      : undefined;
  const load = useCallback(async () => {
    try {
      const response = await getStorePackages({
        packageType: "ad_free",
        search,
        status: normalizedStatus,
        provider: normalizedProvider,
        page,
        limit: 10,
      });
      setPackages(response.items);
      setMeta(response.meta);
    } catch (loadError) {
      toast.error(errorMessage(loadError));
      setPackages([]);
    } finally {
      setLoading(false);
    }
  }, [normalizedProvider, normalizedStatus, page, search]);
  useEffect(() => {
    void load();
  }, [load]);

  const existing = useMemo(
    () => new Set(packages.map((item) => item.billingModel)),
    [packages],
  );
  const changePage = (nextPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", String(nextPage));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
  const openCreate = () => {
    setForm({
      ...EMPTY_FORM,
      billingModel: existing.has("monthly") ? "yearly" : "monthly",
    });
    setError("");
    setCreateOpen(true);
  };
  const create = async () => {
    if (
      !form.appleProductId.trim() ||
      !form.googleProductId.trim() ||
      !form.googleBasePlanId.trim()
    ) {
      setError(
        "Apple product ID, Google product ID, and Google base plan ID are required.",
      );
      return;
    }
    const plan = PLANS[form.billingModel];
    const payload: CreateStorePackagePayload = {
      packageType: "ad_free",
      name: plan.name,
      priceEur: plan.price,
      billingModel: form.billingModel,
      couponsEnabled: false,
      marketingBadge: "none",
      providerProducts: [
        {
          provider: "app_store",
          productId: form.appleProductId.trim(),
          productType: "subscription",
          isActive: true,
        },
        {
          provider: "google_play",
          productId: form.googleProductId.trim(),
          productType: "subscription",
          basePlanId: form.googleBasePlanId.trim(),
          isActive: true,
        },
      ],
    };
    const toastId = toast.loading("Creating Ad-Free package...");
    try {
      setSubmitting(true);
      await createStorePackage(payload);
      await load();
      setCreateOpen(false);
      toast.success("Ad-Free package created.", { id: toastId });
    } catch (createError) {
      toast.error(errorMessage(createError), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };
  const runAction = async () => {
    if (!pending) return;
    const enabling = pending.item.status !== "published";
    const toastId = toast.loading(
      pending.mode === "delete"
        ? "Deleting package..."
        : `${enabling ? "Enabling" : "Disabling"} package...`,
    );
    try {
      setSubmitting(true);
      if (pending.mode === "delete") await archiveStorePackage(pending.item.id);
      else await setStorePackageAvailability(pending.item.id, enabling);
      await load();
      setPending(null);
      toast.success(
        pending.mode === "delete"
          ? "Package deleted. Existing subscriptions remain valid."
          : `Package ${enabling ? "enabled" : "disabled"}.`,
        { id: toastId },
      );
    } catch (actionError) {
      toast.error(errorMessage(actionError), { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Card className="overflow-hidden p-0">
        <div className="flex items-center justify-between border-b border-[#E7ECE8] px-6 py-5">
          <div>
            <h2 className="text-lg font-bold text-[#202420]">
              Ad-Free Subscriptions
            </h2>
            <p className="mt-1 text-sm text-[#697069]">
              Only monthly and yearly auto-renewing plans. Store pricing remains
              authoritative.
            </p>
          </div>
          <Button
            onClick={openCreate}
            disabled={existing.has("monthly") && existing.has("yearly")}
          >
            <PlusCircle className="mr-2 size-4" />
            Create plan
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-[#F7F9F7] text-xs font-semibold text-[#697069]">
              <tr>
                <th className="px-6 py-4">PACKAGE</th>
                <th className="px-6 py-4">DURATION</th>
                <th className="px-6 py-4">REFERENCE PRICE</th>
                <th className="px-6 py-4">APPLE PRODUCT ID</th>
                <th className="px-6 py-4">GOOGLE PRODUCT / BASE PLAN</th>
                <th className="px-6 py-4">STATUS</th>
                <th className="px-6 py-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E7ECE8]">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-[#697069]"
                  >
                    Loading packages...
                  </td>
                </tr>
              ) : packages.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-[#697069]"
                  >
                    No Ad-Free packages found.
                  </td>
                </tr>
              ) : (
                packages.map((item) => {
                  const products =
                    item.providerProducts ??
                    (item.storeProduct ? [item.storeProduct] : []);
                  const apple = products.find(
                    (product) => product.provider === "app_store",
                  );
                  const google = products.find(
                    (product) => product.provider === "google_play",
                  );
                  const plan = PLANS[item.billingModel as "monthly" | "yearly"];
                  return (
                    <tr key={item.id} className="text-[#303730]">
                      <td className="px-6 py-4 font-semibold">{item.name}</td>
                      <td className="px-6 py-4">
                        {plan?.duration ?? item.billingModel}
                      </td>
                      <td className="px-6 py-4">
                        USD {Number(item.priceEur).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {apple?.productId ?? "—"}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {google
                          ? `${google.productId} / ${google.basePlanId ?? "—"}`
                          : "—"}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "published" ? "bg-[#DFF8E7] text-[#006B3F]" : "bg-[#ECEFEC] text-[#697069]"}`}
                        >
                          {item.status === "published" ? "Enabled" : "Disabled"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setPending({ mode: "availability", item })
                            }
                          >
                            <Power className="mr-1.5 size-4" />
                            {item.status === "published" ? "Disable" : "Enable"}
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-[#D92D20]"
                            onClick={() => setPending({ mode: "delete", item })}
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <StorePagination {...meta} onPageChange={changePage} />
      </Card>

      <Dialog
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        size="md"
        className="p-0"
      >
        <div className="flex items-center justify-between border-b border-[#E7ECE8] px-7 py-5">
          <div>
            <h2 className="text-xl font-bold">Create Ad-Free plan</h2>
            <p className="mt-1 text-sm text-[#697069]">
              Plans are immutable after creation.
            </p>
          </div>
          <button aria-label="Close" onClick={() => setCreateOpen(false)}>
            <X className="size-5" />
          </button>
        </div>
        <div className="space-y-5 px-7 py-6">
          <label className="block text-sm font-semibold">
            Duration
            <select
              className={inputClass}
              value={form.billingModel}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  billingModel: event.target.value as Form["billingModel"],
                }))
              }
            >
              {!existing.has("monthly") && (
                <option value="monthly">1 month — USD 1.99 reference</option>
              )}
              {!existing.has("yearly") && (
                <option value="yearly">1 year — USD 15.00 reference</option>
              )}
            </select>
          </label>
          <div className="rounded-xl bg-[#F4F7F4] p-4 text-sm">
            <strong>{PLANS[form.billingModel].name}</strong>
            <div className="mt-1 text-[#697069]">
              Reference price: USD {PLANS[form.billingModel].price}. Customers
              see their localized store price.
            </div>
          </div>
          <label className="block text-sm font-semibold">
            Apple product ID
            <input
              className={inputClass}
              value={form.appleProductId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  appleProductId: event.target.value,
                }))
              }
              placeholder="com.example.adfree.monthly"
            />
          </label>
          <label className="block text-sm font-semibold">
            Google Play product ID
            <input
              className={inputClass}
              value={form.googleProductId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  googleProductId: event.target.value,
                }))
              }
              placeholder="ad_free"
            />
          </label>
          <label className="block text-sm font-semibold">
            Google Play base plan ID
            <input
              className={inputClass}
              value={form.googleBasePlanId}
              onChange={(event) =>
                setForm((current) => ({
                  ...current,
                  googleBasePlanId: event.target.value,
                }))
              }
              placeholder="monthly"
            />
          </label>
          {error && (
            <p className="text-sm font-medium text-[#D92D20]">{error}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="outline"
              onClick={() => setCreateOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button onClick={() => void create()} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
              Create plan
            </Button>
          </div>
        </div>
      </Dialog>

      <ConfirmActionDialog
        open={pending !== null}
        title={
          pending?.mode === "delete"
            ? "Delete Ad-Free package?"
            : `${pending?.item.status === "published" ? "Disable" : "Enable"} Ad-Free package?`
        }
        description={
          pending?.mode === "delete"
            ? "The plan will leave the catalog, but current paid entitlements remain intact."
            : "This changes whether new customers can purchase this plan."
        }
        confirmLabel={
          pending?.mode === "delete"
            ? "Delete"
            : pending?.item.status === "published"
              ? "Disable"
              : "Enable"
        }
        danger={pending?.mode === "delete"}
        isSubmitting={submitting}
        onCancel={() => setPending(null)}
        onConfirm={() => void runAction()}
      />
    </>
  );
}
