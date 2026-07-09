"use client";

import { ArrowLeft, Loader2, Plus, Rocket, Save, Trash2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import { getCourses } from "@/service/course-directory/course.service";
import {
  createInfluencerPartner,
  getInfluencerPartnerById,
  updateInfluencerPartner,
} from "@/service/influencer-hub/influencer-hub.service";
import { getStorePackages } from "@/service/package-store/package-store.service";
import type { Course } from "@/types/course-directory/course.type";
import type {
  InfluencerBillingProvider,
  InfluencerCouponProductDomain,
  InfluencerCouponStatus,
  InfluencerPartnerDetailResponse,
  InfluencerPartnerPayload,
  InfluencerPartnerStatus,
  InfluencerPaymentMethod,
  InfluencerSocialPlatform,
} from "@/types/influencer-hub/influencer-hub.type";
import type { StorePackage } from "@/types/package-store/package-store.type";

type InfluencerPartnerFormProps =
  | {
      mode: "create";
    }
  | {
      mode: "edit";
      partnerId: string;
    };

interface SocialHandleForm {
  platform: InfluencerSocialPlatform;
  handle: string;
  url: string;
}

interface ProviderMappingForm {
  productDomain: InfluencerCouponProductDomain;
  courseId: string;
  storePackageId: string;
  provider: InfluencerBillingProvider;
  regularProviderProductId: string;
  discountedProviderProductId: string;
  providerBasePlanId: string;
  providerOfferId: string;
  isActive: boolean;
}

interface InfluencerFormState {
  fullName: string;
  email: string;
  title: string;
  avatarUrl: string;
  status: InfluencerPartnerStatus;
  paymentMethod: InfluencerPaymentMethod;
  paymentDisplayLabel: string;
  paymentIban: string;
  paymentAccountName: string;
  paymentPaypalEmail: string;
  paymentWiseEmail: string;
  currency: string;
  administrativeNotes: string;

  couponCode: string;
  userDiscountPercentage: number;
  influencerSharePercentage: number;
  lifetimeAssociationEnabled: boolean;
  couponStatus: InfluencerCouponStatus;
  startsAt: string;
  expiresAt: string;
  dealNotes: string;
}

const initialForm: InfluencerFormState = {
  fullName: "",
  email: "",
  title: "",
  avatarUrl: "",
  status: "active",
  paymentMethod: "bank_transfer",
  paymentDisplayLabel: "Direct Bank Transfer (EUR)",
  paymentIban: "",
  paymentAccountName: "",
  paymentPaypalEmail: "",
  paymentWiseEmail: "",
  currency: "EUR",
  administrativeNotes: "",

  couponCode: "",
  userDiscountPercentage: 20,
  influencerSharePercentage: 20,
  lifetimeAssociationEnabled: true,
  couponStatus: "active",
  startsAt: "",
  expiresAt: "",
  dealNotes: "",
};

const initialSocialHandles: SocialHandleForm[] = [
  {
    platform: "youtube",
    handle: "",
    url: "",
  },
];

const initialProviderMappings: ProviderMappingForm[] = [
  {
    productDomain: "store_package",
    courseId: "",
    storePackageId: "",
    provider: "google_play",
    regularProviderProductId: "",
    discountedProviderProductId: "",
    providerBasePlanId: "",
    providerOfferId: "",
    isActive: true,
  },
];

const getErrorMessage = (error: unknown) => {
  return error instanceof Error ? error.message : "Something went wrong.";
};

const readString = (value: unknown) => {
  return typeof value === "string" ? value : "";
};

const toIsoDateOrNull = (value: string) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

const toLocalDateTimeInput = (value?: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offsetDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60 * 1000,
  );

  return offsetDate.toISOString().slice(0, 16);
};

const getCouponTrailingDiscount = (couponCode: string) => {
  const match = couponCode.trim().match(/(\d{1,3})$/);

  return match ? Number(match[1]) : null;
};

const buildCouponProviderProductId = (regularProductId: string) => {
  const normalized = regularProductId.trim();

  if (!normalized) return "";

  if (normalized.toLowerCase().startsWith("coupon_")) {
    return normalized;
  }

  return `coupon_${normalized}`;
};

const getSnapshot = (
  form: InfluencerFormState,
  socialHandles: SocialHandleForm[],
  providerMappings: ProviderMappingForm[],
) => {
  return JSON.stringify({
    form,
    socialHandles,
    providerMappings,
  });
};

const getPrimaryDeal = (response: InfluencerPartnerDetailResponse) => {
  return response.partner.deals?.[0] || null;
};

const createFormStateFromResponse = (
  response: InfluencerPartnerDetailResponse,
): InfluencerFormState => {
  const partner = response.partner;
  const deal = getPrimaryDeal(response);
  const paymentDetails = partner.paymentDetails || {};

  return {
    fullName: partner.fullName || "",
    email: partner.email || "",
    title: partner.title || "",
    avatarUrl: partner.avatarUrl || "",
    status: partner.status || "active",
    paymentMethod: partner.paymentMethod || "bank_transfer",
    paymentDisplayLabel:
      partner.paymentDisplayLabel || "Direct Bank Transfer (EUR)",
    paymentIban: readString(paymentDetails.iban),
    paymentAccountName: readString(paymentDetails.accountName),
    paymentPaypalEmail: readString(paymentDetails.paypalEmail),
    paymentWiseEmail: readString(paymentDetails.wiseEmail),
    currency: partner.currency || "EUR",
    administrativeNotes: partner.administrativeNotes || "",

    couponCode: deal?.couponCode || partner.primaryCouponCode || "",
    userDiscountPercentage:
      deal?.userDiscountPercentage ?? partner.userDiscountPercentage ?? 20,
    influencerSharePercentage:
      deal?.influencerSharePercentage ??
      partner.influencerSharePercentage ??
      20,
    lifetimeAssociationEnabled: deal?.lifetimeAssociationEnabled ?? true,
    couponStatus: deal?.status || partner.couponStatus || "active",
    startsAt: toLocalDateTimeInput(deal?.startsAt || partner.couponStartsAt),
    expiresAt: toLocalDateTimeInput(deal?.expiresAt || partner.couponExpiresAt),
    dealNotes: deal?.notes || "",
  };
};

const createSocialHandlesFromResponse = (
  response: InfluencerPartnerDetailResponse,
): SocialHandleForm[] => {
  const handles = response.partner.socialHandles || [];

  if (handles.length === 0) {
    return initialSocialHandles;
  }

  return handles.map((item) => ({
    platform: item.platform || "other",
    handle: item.handle || "",
    url: item.url || "",
  }));
};

const createProviderMappingsFromResponse = (
  response: InfluencerPartnerDetailResponse,
): ProviderMappingForm[] => {
  const deal = getPrimaryDeal(response);
  const mappings = deal?.providerMappings || [];

  if (mappings.length === 0) {
    return initialProviderMappings;
  }

  return mappings.map((mapping) => ({
    productDomain: mapping.productDomain || "store_package",
    courseId: mapping.courseId || "",
    storePackageId: mapping.storePackageId || "",
    provider: mapping.provider || "google_play",
    regularProviderProductId: mapping.regularProviderProductId || "",
    discountedProviderProductId: mapping.discountedProviderProductId || "",
    providerBasePlanId: mapping.providerBasePlanId || "",
    providerOfferId: mapping.providerOfferId || "",
    isActive: mapping.isActive ?? true,
  }));
};

export default function InfluencerPartnerForm(
  props: InfluencerPartnerFormProps,
) {
  const router = useRouter();

  const mode = props.mode;
  const partnerId = props.mode === "edit" ? props.partnerId : "";

  const [form, setForm] = useState<InfluencerFormState>(initialForm);
  const [socialHandles, setSocialHandles] =
    useState<SocialHandleForm[]>(initialSocialHandles);
  const [providerMappings, setProviderMappings] = useState<
    ProviderMappingForm[]
  >(initialProviderMappings);

  const [courses, setCourses] = useState<Course[]>([]);
  const [storePackages, setStorePackages] = useState<StorePackage[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = useState(true);
  const [isInitialLoading, setIsInitialLoading] = useState(mode === "edit");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    getSnapshot(initialForm, initialSocialHandles, initialProviderMappings),
  );

  const currentSnapshot = useMemo(
    () => getSnapshot(form, socialHandles, providerMappings),
    [form, providerMappings, socialHandles],
  );

  const isDirty = currentSnapshot !== savedSnapshot;

  const unsaved = useUnsavedChangesWarning(isDirty);

  useEffect(() => {
    let mounted = true;

    const loadInitialData = async () => {
      try {
        setIsOptionsLoading(true);
        setIsInitialLoading(mode === "edit");

        const optionRequests = [
          getCourses({
            page: 1,
            limit: 100,
            statuses: "published",
          }),
          getStorePackages({
            page: 1,
            limit: 100,
            status: "published",
          }),
        ] as const;

        if (mode === "edit") {
          const [courseResponse, packageResponse, partnerResponse] =
            await Promise.all([
              ...optionRequests,
              getInfluencerPartnerById(partnerId),
            ]);

          if (!mounted) return;

          const nextForm = createFormStateFromResponse(partnerResponse);
          const nextSocialHandles =
            createSocialHandlesFromResponse(partnerResponse);
          const nextProviderMappings =
            createProviderMappingsFromResponse(partnerResponse);

          setCourses(courseResponse.items);
          setStorePackages(packageResponse.items);
          setForm(nextForm);
          setSocialHandles(nextSocialHandles);
          setProviderMappings(nextProviderMappings);
          setSavedSnapshot(
            getSnapshot(nextForm, nextSocialHandles, nextProviderMappings),
          );

          return;
        }

        const [courseResponse, packageResponse] =
          await Promise.all(optionRequests);

        if (!mounted) return;

        setCourses(courseResponse.items);
        setStorePackages(packageResponse.items);
      } catch (error) {
        if (mounted) {
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (mounted) {
          setIsOptionsLoading(false);
          setIsInitialLoading(false);
        }
      }
    };

    void loadInitialData();

    return () => {
      mounted = false;
    };
  }, [mode, partnerId]);

  const updateForm = <Key extends keyof InfluencerFormState>(
    key: Key,
    value: InfluencerFormState[Key],
  ) => {
    setForm((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const addSocialHandle = () => {
    setSocialHandles((current) => [
      ...current,
      {
        platform: "instagram",
        handle: "",
        url: "",
      },
    ]);
  };

  const updateSocialHandle = (
    index: number,
    values: Partial<SocialHandleForm>,
  ) => {
    setSocialHandles((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              ...values,
            }
          : item,
      ),
    );
  };

  const removeSocialHandle = (index: number) => {
    setSocialHandles((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const addProviderMapping = () => {
    setProviderMappings((current) => [
      ...current,
      {
        productDomain: "store_package",
        courseId: "",
        storePackageId: "",
        provider: "google_play",
        regularProviderProductId: "",
        discountedProviderProductId: "",
        providerBasePlanId: "",
        providerOfferId: "",
        isActive: true,
      },
    ]);
  };

  const updateProviderMapping = (
    index: number,
    values: Partial<ProviderMappingForm>,
  ) => {
    setProviderMappings((current) =>
      current.map((item, itemIndex) => {
        if (itemIndex !== index) {
          return item;
        }

        const nextItem = {
          ...item,
          ...values,
        };

        if (values.regularProviderProductId !== undefined) {
          nextItem.discountedProviderProductId = buildCouponProviderProductId(
            values.regularProviderProductId,
          );
        }

        if (values.productDomain === "store_package") {
          nextItem.courseId = "";
        }

        if (values.productDomain === "course") {
          nextItem.storePackageId = "";
        }

        return nextItem;
      }),
    );
  };

  const removeProviderMapping = (index: number) => {
    setProviderMappings((current) =>
      current.filter((_, itemIndex) => itemIndex !== index),
    );
  };

  const buildPaymentDetails = () => {
    const details: Record<string, string> = {};

    if (form.paymentIban.trim()) {
      details.iban = form.paymentIban.trim();
    }

    if (form.paymentAccountName.trim()) {
      details.accountName = form.paymentAccountName.trim();
    }

    if (form.paymentPaypalEmail.trim()) {
      details.paypalEmail = form.paymentPaypalEmail.trim();
    }

    if (form.paymentWiseEmail.trim()) {
      details.wiseEmail = form.paymentWiseEmail.trim();
    }

    return Object.keys(details).length > 0 ? details : null;
  };

  const validateForm = () => {
    if (!form.fullName.trim()) {
      toast.error("Full name is required.");
      return false;
    }

    if (!form.email.trim()) {
      toast.error("Email is required.");
      return false;
    }

    if (!form.couponCode.trim()) {
      toast.error("Coupon code is required.");
      return false;
    }

    if (form.userDiscountPercentage <= 0) {
      toast.error("User discount percentage must be greater than 0.");
      return false;
    }

    if (form.userDiscountPercentage > 99) {
      toast.error("User discount percentage cannot be greater than 99.");
      return false;
    }

    if (form.influencerSharePercentage < 0) {
      toast.error("Influencer share percentage cannot be negative.");
      return false;
    }

    if (form.influencerSharePercentage > 99) {
      toast.error("Influencer share percentage cannot be greater than 99.");
      return false;
    }

    const couponDiscount = getCouponTrailingDiscount(form.couponCode);

    if (
      couponDiscount !== null &&
      couponDiscount !== Number(form.userDiscountPercentage)
    ) {
      toast.error(
        `${form.couponCode.toUpperCase()} must use ${couponDiscount}% as user discount.`,
      );

      return false;
    }

    if (!form.startsAt) {
      toast.error("Coupon start date is required.");
      return false;
    }

    if (!form.expiresAt) {
      toast.error("Coupon expiry date is required.");
      return false;
    }

    const startsAt = new Date(form.startsAt);
    const expiresAt = new Date(form.expiresAt);

    if (startsAt >= expiresAt) {
      toast.error("Coupon expiry date must be after start date.");
      return false;
    }

    if (providerMappings.length === 0) {
      toast.error("At least one provider product mapping is required.");
      return false;
    }

    for (const [index, mapping] of providerMappings.entries()) {
      const rowNumber = index + 1;

      if (
        mapping.productDomain === "store_package" &&
        !mapping.storePackageId
      ) {
        toast.error(`Select a store package in mapping row ${rowNumber}.`);
        return false;
      }

      if (mapping.productDomain === "course" && !mapping.courseId) {
        toast.error(`Select a course in mapping row ${rowNumber}.`);
        return false;
      }

      if (!mapping.regularProviderProductId.trim()) {
        toast.error(
          `Regular provider product ID is required in mapping row ${rowNumber}.`,
        );

        return false;
      }

      if (!mapping.discountedProviderProductId.trim()) {
        toast.error(
          `Discounted provider product ID is required in mapping row ${rowNumber}.`,
        );

        return false;
      }

      if (
        mapping.regularProviderProductId
          .trim()
          .toLowerCase()
          .startsWith("coupon_")
      ) {
        toast.error(
          `Regular product ID must not start with coupon_ in mapping row ${rowNumber}.`,
        );

        return false;
      }

      if (
        mapping.discountedProviderProductId.trim() ===
        mapping.regularProviderProductId.trim()
      ) {
        toast.error(
          `Regular and discounted product IDs must be different in mapping row ${rowNumber}.`,
        );

        return false;
      }

      if (
        !mapping.discountedProviderProductId
          .trim()
          .toLowerCase()
          .startsWith("coupon_")
      ) {
        toast.error(
          `Discounted product ID should start with coupon_ in mapping row ${rowNumber}.`,
        );

        return false;
      }
    }

    return true;
  };

  const buildPayload = (): InfluencerPartnerPayload => {
    const cleanedSocialHandles = socialHandles
      .filter((item) => item.handle.trim())
      .map((item, index) => ({
        platform: item.platform,
        handle: item.handle.trim(),
        url: item.url.trim() || null,
        sortOrder: index,
      }));

    const cleanedProviderMappings = providerMappings.map((mapping) => ({
      productDomain: mapping.productDomain,
      courseId: mapping.productDomain === "course" ? mapping.courseId : null,
      storePackageId:
        mapping.productDomain === "store_package"
          ? mapping.storePackageId
          : null,
      provider: mapping.provider,
      regularProviderProductId: mapping.regularProviderProductId.trim(),
      discountedProviderProductId: mapping.discountedProviderProductId.trim(),
      providerBasePlanId: mapping.providerBasePlanId.trim() || null,
      providerOfferId: mapping.providerOfferId.trim() || null,
      isActive: mapping.isActive,
    }));

    return {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      title: form.title.trim() || null,
      avatarUrl: form.avatarUrl.trim() || null,
      status: form.status,
      paymentMethod: form.paymentMethod,
      paymentDisplayLabel: form.paymentDisplayLabel.trim() || null,
      paymentDetails: buildPaymentDetails(),
      currency: form.currency.trim() || "EUR",
      administrativeNotes: form.administrativeNotes.trim() || null,
      socialHandles: cleanedSocialHandles,
      deal: {
        couponCode: form.couponCode.trim().toUpperCase(),
        ownerType: "influencer",
        userDiscountPercentage: Number(form.userDiscountPercentage),
        influencerSharePercentage: Number(form.influencerSharePercentage),
        lifetimeAssociationEnabled: form.lifetimeAssociationEnabled,
        status: form.couponStatus,
        startsAt: toIsoDateOrNull(form.startsAt),
        expiresAt: toIsoDateOrNull(form.expiresAt),
        notes: form.dealNotes.trim() || null,
        providerMappings: cleanedProviderMappings,
      },
    };
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const toastId = toast.loading(
      mode === "edit"
        ? "Updating influencer partner..."
        : "Creating influencer partner...",
    );

    try {
      setIsSubmitting(true);

      const payload = buildPayload();

      if (mode === "edit") {
        const response = await updateInfluencerPartner(partnerId, payload);

        const nextForm = createFormStateFromResponse(response);
        const nextSocialHandles = createSocialHandlesFromResponse(response);
        const nextProviderMappings =
          createProviderMappingsFromResponse(response);

        setForm(nextForm);
        setSocialHandles(nextSocialHandles);
        setProviderMappings(nextProviderMappings);
        setSavedSnapshot(
          getSnapshot(nextForm, nextSocialHandles, nextProviderMappings),
        );

        toast.success("Influencer partner updated successfully.", {
          id: toastId,
        });

        router.push(`/admin/influencer-hub/${partnerId}`);
        return;
      }

      const response = await createInfluencerPartner(payload);

      setSavedSnapshot(getSnapshot(form, socialHandles, providerMappings));

      toast.success("Influencer partner created successfully.", {
        id: toastId,
      });

      router.push(`/admin/influencer-hub/${response.partner.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    unsaved.requestNavigation(
      mode === "edit"
        ? `/admin/influencer-hub/${partnerId}`
        : "/admin/influencer-hub",
    );
  };

  if (isInitialLoading) {
    return (
      <section className="rounded-[2rem] bg-white p-10 text-sm text-black/55 shadow-sm">
        Loading influencer partner...
      </section>
    );
  }

  return (
    <>
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <button
              type="button"
              onClick={handleCancel}
              className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-black/50"
            >
              <ArrowLeft className="size-4" />
              {mode === "edit"
                ? "Back to Influencer Report"
                : "Back to Influencer Hub"}
            </button>

            <h1 className="text-2xl font-bold text-deep-green">
              {mode === "edit"
                ? "Edit Influencer Partner Profile"
                : "Onboard New Influencer"}
            </h1>

            <p className="mt-1 text-sm leading-6 text-black/55">
              {mode === "edit"
                ? "Update partner profile, payout details, coupon logic and provider product mappings."
                : "Configure partner profile, payout details, coupon logic and Google Play / App Store discounted product mappings."}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="gap-2 bg-[#75FF33] !text-deep-green hover:!bg-[#75FF33]"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Rocket className="size-4" />
              )}

              {mode === "edit" ? "Save Changes" : "Activate Partner Deal"}
            </Button>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <section className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <SectionTitle
              title="Partner Profile"
              description="Basic influencer identity and admin notes."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <InputField
                label="Full Name"
                value={form.fullName}
                required
                onChange={(value) => updateForm("fullName", value)}
              />

              <InputField
                label="Email"
                value={form.email}
                required
                type="email"
                onChange={(value) => updateForm("email", value)}
              />

              <InputField
                label="Title"
                value={form.title}
                placeholder="Italian Lifestyle Creator"
                onChange={(value) => updateForm("title", value)}
              />

              <InputField
                label="Avatar URL"
                value={form.avatarUrl}
                placeholder="https://..."
                onChange={(value) => updateForm("avatarUrl", value)}
              />

              <SelectField
                label="Partner Status"
                value={form.status}
                onChange={(value) =>
                  updateForm("status", value as InfluencerPartnerStatus)
                }
                options={[
                  ["active", "Active"],
                  ["inactive", "Inactive"],
                  ["suspended", "Suspended"],
                ]}
              />

              <InputField
                label="Currency"
                value={form.currency}
                onChange={(value) =>
                  updateForm("currency", value.toUpperCase())
                }
              />
            </div>

            <TextAreaField
              label="Administrative Notes"
              value={form.administrativeNotes}
              placeholder="Verified partner, internal notes, payout notes..."
              onChange={(value) => updateForm("administrativeNotes", value)}
            />

            <div className="border-t border-black/10 pt-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <SectionTitle
                  title="Social Handles"
                  description="Add YouTube, TikTok, Instagram or other handles."
                  compact
                />

                <Button
                  variant="outline"
                  size="sm"
                  onClick={addSocialHandle}
                  className="gap-2"
                >
                  <Plus className="size-4" />
                  Add Handle
                </Button>
              </div>

              <div className="space-y-3">
                {socialHandles.map((item, index) => (
                  <div
                    key={`${item.platform}-${index}`}
                    className="grid gap-3 rounded-3xl bg-[#EEF3EC] p-4 md:grid-cols-[160px_1fr_1fr_42px]"
                  >
                    <SelectField
                      label="Platform"
                      value={item.platform}
                      onChange={(value) =>
                        updateSocialHandle(index, {
                          platform: value as InfluencerSocialPlatform,
                        })
                      }
                      options={[
                        ["youtube", "YouTube"],
                        ["tiktok", "TikTok"],
                        ["instagram", "Instagram"],
                        ["facebook", "Facebook"],
                        ["linkedin", "LinkedIn"],
                        ["website", "Website"],
                        ["other", "Other"],
                      ]}
                    />

                    <InputField
                      label="Handle"
                      value={item.handle}
                      placeholder="@creator"
                      onChange={(value) =>
                        updateSocialHandle(index, {
                          handle: value,
                        })
                      }
                    />

                    <InputField
                      label="URL"
                      value={item.url}
                      placeholder="https://..."
                      onChange={(value) =>
                        updateSocialHandle(index, {
                          url: value,
                        })
                      }
                    />

                    <button
                      type="button"
                      onClick={() => removeSocialHandle(index)}
                      disabled={socialHandles.length === 1}
                      className="mt-6 flex size-10 items-center justify-center rounded-full bg-white text-[#D92D20] disabled:opacity-40"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="space-y-6 rounded-[2rem] bg-white p-6 shadow-sm">
            <SectionTitle
              title="Payment Details"
              description="Saved for admin payout reference only."
            />

            <div className="grid gap-4 md:grid-cols-2">
              <SelectField
                label="Payment Method"
                value={form.paymentMethod}
                onChange={(value) =>
                  updateForm("paymentMethod", value as InfluencerPaymentMethod)
                }
                options={[
                  ["bank_transfer", "Bank Transfer"],
                  ["paypal", "PayPal"],
                  ["wise", "Wise"],
                  ["manual", "Manual"],
                ]}
              />

              <InputField
                label="Payment Display Label"
                value={form.paymentDisplayLabel}
                onChange={(value) => updateForm("paymentDisplayLabel", value)}
              />

              <InputField
                label="IBAN"
                value={form.paymentIban}
                onChange={(value) => updateForm("paymentIban", value)}
              />

              <InputField
                label="Account Name"
                value={form.paymentAccountName}
                onChange={(value) => updateForm("paymentAccountName", value)}
              />

              <InputField
                label="PayPal Email"
                value={form.paymentPaypalEmail}
                onChange={(value) => updateForm("paymentPaypalEmail", value)}
              />

              <InputField
                label="Wise Email"
                value={form.paymentWiseEmail}
                onChange={(value) => updateForm("paymentWiseEmail", value)}
              />
            </div>

            <div className="border-t border-black/10 pt-6">
              <SectionTitle
                title="Coupon / Deal Logic"
                description="Coupon code, user discount and influencer share."
              />

              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <InputField
                  label="Coupon Code"
                  value={form.couponCode}
                  required
                  placeholder="RAHIM20"
                  onChange={(value) =>
                    updateForm("couponCode", value.toUpperCase())
                  }
                />

                <SelectField
                  label="Coupon Status"
                  value={form.couponStatus}
                  onChange={(value) =>
                    updateForm("couponStatus", value as InfluencerCouponStatus)
                  }
                  options={[
                    ["active", "Active"],
                    ["draft", "Draft"],
                    ["paused", "Paused"],
                    ["expired", "Expired"],
                  ]}
                />

                <InputField
                  label="User Discount %"
                  value={String(form.userDiscountPercentage)}
                  required
                  type="number"
                  onChange={(value) =>
                    updateForm("userDiscountPercentage", Number(value))
                  }
                />

                <InputField
                  label="Influencer Share %"
                  value={String(form.influencerSharePercentage)}
                  type="number"
                  onChange={(value) =>
                    updateForm("influencerSharePercentage", Number(value))
                  }
                />

                <InputField
                  label="Start Date"
                  value={form.startsAt}
                  required
                  type="datetime-local"
                  onChange={(value) => updateForm("startsAt", value)}
                />

                <InputField
                  label="Expiry Date"
                  value={form.expiresAt}
                  required
                  type="datetime-local"
                  onChange={(value) => updateForm("expiresAt", value)}
                />
              </div>

              <label className="mt-5 flex items-center justify-between gap-4 rounded-3xl bg-[#75FF33]/20 p-5">
                <div>
                  <p className="font-bold text-deep-green">
                    Lifetime Association
                  </p>

                  <p className="mt-1 text-sm leading-5 text-black/55">
                    Link future purchases from the referred user to this
                    influencer.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={form.lifetimeAssociationEnabled}
                  onChange={(event) =>
                    updateForm(
                      "lifetimeAssociationEnabled",
                      event.target.checked,
                    )
                  }
                  className="size-5 accent-[#006B3F]"
                />
              </label>

              <TextAreaField
                label="Deal Notes"
                value={form.dealNotes}
                placeholder="July campaign, campaign terms, store campaign reference..."
                onChange={(value) => updateForm("dealNotes", value)}
              />
            </div>
          </section>
        </div>

        <section className="space-y-5 rounded-[2rem] bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <SectionTitle
              title="Provider Product Mappings"
              description="Map coupon to regular and discounted Google Play/App Store product IDs."
            />

            <Button
              variant="outline"
              onClick={addProviderMapping}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add Mapping Row
            </Button>
          </div>

          <div className="rounded-3xl border border-[#FFE2A8] bg-[#FFF8E8] p-5 text-sm leading-6 text-[#7A4E00]">
            The coupon only selects the matching discounted Google Play/App
            Store product. Final charge is controlled by the store and may
            include local VAT, tax, currency conversion, or regional pricing. Do
            not calculate the final checkout amount manually in admin.
          </div>

          <div className="space-y-4">
            {providerMappings.map((mapping, index) => (
              <div
                key={`mapping-${index}`}
                className="rounded-[1.5rem] border border-black/10 bg-[#F7FAF5] p-5"
              >
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="font-bold text-deep-green">
                    Mapping Row {index + 1}
                  </p>

                  <button
                    type="button"
                    disabled={providerMappings.length === 1}
                    onClick={() => removeProviderMapping(index)}
                    className="flex size-9 items-center justify-center rounded-full bg-white text-[#D92D20] disabled:opacity-40"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>

                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <SelectField
                    label="Product Domain"
                    value={mapping.productDomain}
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        productDomain: value as InfluencerCouponProductDomain,
                      })
                    }
                    options={[
                      ["store_package", "Store Package"],
                      ["course", "Course"],
                    ]}
                  />

                  {mapping.productDomain === "store_package" ? (
                    <SelectField
                      label="Store Package"
                      value={mapping.storePackageId}
                      disabled={isOptionsLoading}
                      onChange={(value) =>
                        updateProviderMapping(index, {
                          storePackageId: value,
                        })
                      }
                      options={[
                        [
                          "",
                          isOptionsLoading ? "Loading..." : "Select Package",
                        ],
                        ...storePackages.map(
                          (item) =>
                            [item.id, `${item.name} (${item.type})`] as [
                              string,
                              string,
                            ],
                        ),
                      ]}
                    />
                  ) : (
                    <SelectField
                      label="Course"
                      value={mapping.courseId}
                      disabled={isOptionsLoading}
                      onChange={(value) =>
                        updateProviderMapping(index, {
                          courseId: value,
                        })
                      }
                      options={[
                        ["", isOptionsLoading ? "Loading..." : "Select Course"],
                        ...courses.map(
                          (item) => [item.id, item.title] as [string, string],
                        ),
                      ]}
                    />
                  )}

                  <SelectField
                    label="Provider"
                    value={mapping.provider}
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        provider: value as InfluencerBillingProvider,
                      })
                    }
                    options={[
                      ["google_play", "Google Play"],
                      ["app_store", "App Store"],
                    ]}
                  />

                  <SelectField
                    label="Active"
                    value={mapping.isActive ? "true" : "false"}
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        isActive: value === "true",
                      })
                    }
                    options={[
                      ["true", "Active"],
                      ["false", "Inactive"],
                    ]}
                  />

                  <InputField
                    label="Regular Product ID"
                    value={mapping.regularProviderProductId}
                    required
                    placeholder="ai_bundle_001"
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        regularProviderProductId: value,
                      })
                    }
                  />

                  <InputField
                    label="Discounted Product ID"
                    value={mapping.discountedProviderProductId}
                    required
                    placeholder="coupon_ai_bundle_001"
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        discountedProviderProductId: value,
                      })
                    }
                  />

                  <InputField
                    label="Base Plan / Purchase Option ID"
                    value={mapping.providerBasePlanId}
                    placeholder="Optional"
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        providerBasePlanId: value,
                      })
                    }
                  />

                  <InputField
                    label="Offer ID"
                    value={mapping.providerOfferId}
                    placeholder="Optional"
                    onChange={(value) =>
                      updateProviderMapping(index, {
                        providerOfferId: value,
                      })
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-[#FFE2A8] bg-[#FFF8E8] p-5">
            <p className="text-xs font-bold uppercase text-[#8A5A00]">
              Important Validation Warnings
            </p>

            <ul className="mt-3 list-disc space-y-1 pl-5 text-xs leading-5 text-[#6F4A00]">
              <li>Google Play product ID must exactly match Play Console.</li>
              <li>
                App Store product ID must exactly match App Store Connect.
              </li>
              <li>
                Coupon code discount must match user discount. Example: RAHIM20
                must use 20%.
              </li>
              <li>
                Regular and discounted provider product IDs must be different.
              </li>
              <li>
                Do not reuse old product IDs for a different package/course
                meaning.
              </li>
              <li>
                Coupon dates should match the Google Play/App Store discount
                campaign duration.
              </li>
            </ul>
          </div>

          <div className="flex flex-col-reverse justify-end gap-3 border-t border-black/10 pt-6 md:flex-row">
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={handleCancel}
            >
              Cancel
            </Button>

            <Button
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="gap-2 bg-secondary text-white"
            >
              {isSubmitting ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}

              {mode === "edit"
                ? "Update Influencer Partner"
                : "Save Influencer Partner"}
            </Button>
          </div>
        </section>
      </section>

      <UnsavedChangesWarningDialog
        open={unsaved.warningOpen}
        onCancel={unsaved.cancelNavigation}
        onConfirm={unsaved.confirmNavigation}
      />
    </>
  );
}

function SectionTitle({
  title,
  description,
  compact = false,
}: {
  title: string;
  description: string;
  compact?: boolean;
}) {
  return (
    <div>
      <h2
        className={
          compact
            ? "text-base font-bold text-deep-green"
            : "text-xl font-bold text-deep-green"
        }
      >
        {title}
      </h2>

      <p className="mt-1 text-sm leading-6 text-black/50">{description}</p>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/45">
        {label}
        {required ? <span className="text-[#D92D20]"> *</span> : null}
      </span>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm font-medium text-black/75 outline-none placeholder:text-black/30 disabled:cursor-not-allowed disabled:opacity-60"
      />
    </label>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
  disabled = false,
}: {
  label: string;
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/45">
        {label}
      </span>

      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#EEF3EC] px-5 text-sm font-medium text-black/75 outline-none disabled:cursor-not-allowed disabled:opacity-60"
      >
        {options.map(([optionValue, optionLabel]) => (
          <option
            key={`${label}-${optionValue}-${optionLabel}`}
            value={optionValue}
          >
            {optionLabel}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="mt-4 block">
      <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-black/45">
        {label}
      </span>

      <textarea
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-28 w-full resize-none rounded-[1.5rem] bg-[#EEF3EC] px-5 py-4 text-sm font-medium text-black/75 outline-none placeholder:text-black/30"
      />
    </label>
  );
}
