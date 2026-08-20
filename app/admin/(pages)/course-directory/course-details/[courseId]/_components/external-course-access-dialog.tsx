"use client";

import { FormEvent, useEffect, useState } from "react";
import { Check, Loader2, Search, UserPlus, X } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import {
  createCourseManualAccessOption,
  getCourseManualAccessOptions,
  grantExternalCourseAccess,
  updateCourseManualAccessOption,
} from "@/service/course-directory/course-commerce.service";
import { getAdminUsers } from "@/service/user-directory/user-directory.service";
import type {
  AdminExternalPaymentMethod,
  CourseAccessType,
  CourseManualAccessOption,
  GrantExternalCourseAccessPayload,
} from "@/types/course-directory/course-commerce.type";
import type { AdminUserDirectoryItem } from "@/types/user-directory/user-directory.type";

interface ExternalCourseAccessDialogProps {
  open: boolean;
  courseId: string;
  courseTitle: string;
  onClose: () => void;
  onGranted: (enrollmentId: string) => Promise<void> | void;
}

const inputClassName =
  "h-11 w-full rounded-xl border border-[#DDE5DE] bg-white px-3 text-sm text-[#202420] outline-none transition focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/10";

const today = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset();

  return new Date(date.getTime() - offset * 60_000).toISOString().slice(0, 10);
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to grant course access.";

export default function ExternalCourseAccessDialog({
  open,
  courseId,
  courseTitle,
  onClose,
  onGranted,
}: ExternalCourseAccessDialogProps) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<AdminUserDirectoryItem[]>([]);
  const [selectedUser, setSelectedUser] =
    useState<AdminUserDirectoryItem | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentCurrency, setPaymentCurrency] = useState<"EUR" | "BDT">("EUR");
  const [amountEur, setAmountEur] = useState("");
  const [paymentMethod, setPaymentMethod] =
    useState<AdminExternalPaymentMethod>("bank_transfer");
  const [externalReference, setExternalReference] = useState("");
  const [paidAt, setPaidAt] = useState(today);
  const [notes, setNotes] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [accessOptions, setAccessOptions] = useState<CourseManualAccessOption[]>([]);
  const [accessType, setAccessType] = useState<CourseAccessType>("lifetime");
  const [durationDays, setDurationDays] = useState("30");
  const [isLoadingAccessOptions, setIsLoadingAccessOptions] = useState(false);

  useEffect(() => {
    if (!open) return;
    let active = true;
    setIsLoadingAccessOptions(true);
    void getCourseManualAccessOptions(courseId)
      .then((response) => {
        if (!active) return;
        setAccessOptions(response.items);
      })
      .catch((error) => {
        if (active) toast.error(getErrorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoadingAccessOptions(false);
      });
    return () => {
      active = false;
    };
  }, [courseId, open]);

  useEffect(() => {
    if (!open) return;

    const query = search.trim();
    if (selectedUser || query.length < 2) return;

    let active = true;
    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await getAdminUsers({
          page: 1,
          limit: 8,
          search: query,
        });

        if (active) setUsers(response.items);
      } catch (error) {
        if (active) {
          setUsers([]);
          toast.error(getErrorMessage(error));
        }
      } finally {
        if (active) setIsSearching(false);
      }
    }, 350);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [open, search, selectedUser]);

  const reset = () => {
    setSearch("");
    setUsers([]);
    setSelectedUser(null);
    setPaymentAmount("");
    setPaymentCurrency("EUR");
    setAmountEur("");
    setPaymentMethod("bank_transfer");
    setExternalReference("");
    setPaidAt(today());
    setNotes("");
    setConfirmed(false);
    setAccessOptions([]);
    setAccessType("lifetime");
    setDurationDays("30");
  };

  const resolveAccessOption = async () => {
    const normalizedDuration =
      accessType === "time_limited" ? Number(durationDays) : null;
    const matchesSelection = (option: CourseManualAccessOption) =>
      option.accessType === accessType &&
      option.durationDays === normalizedDuration;

    const existing = accessOptions.find(matchesSelection);
    if (existing?.isActive) return existing;

    if (existing) {
      const activated = await updateCourseManualAccessOption(
        courseId,
        existing.id,
        { isActive: true },
      );
      setAccessOptions((current) =>
        current.map((option) =>
          option.id === activated.id ? activated : option,
        ),
      );
      return activated;
    }

    try {
      const created = await createCourseManualAccessOption(courseId, {
        accessType,
        durationDays: normalizedDuration,
        isActive: true,
      });
      setAccessOptions((current) => [...current, created]);
      return created;
    } catch (error) {
      // A concurrent admin may have created the same option. Re-read once.
      const refreshed = await getCourseManualAccessOptions(courseId);
      setAccessOptions(refreshed.items);
      const concurrentOption = refreshed.items.find(
        (option) => matchesSelection(option) && option.isActive,
      );
      if (concurrentOption) return concurrentOption;
      throw error;
    }
  };

  const requestClose = () => {
    if (isSubmitting) return;
    reset();
    onClose();
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!selectedUser) {
      toast.error("Select a user first.");
      return;
    }

    if (
      accessType === "time_limited" &&
      (!Number.isInteger(Number(durationDays)) ||
        Number(durationDays) < 1 ||
        Number(durationDays) > 3650)
    ) {
      toast.error("Duration must be a whole number between 1 and 3650 days.");
      return;
    }

    if (
      Number(paymentAmount) <= 0 ||
      Number(amountEur) <= 0 ||
      !externalReference.trim() ||
      !confirmed
    ) {
      toast.error("Complete the payment details and confirm the grant.");
      return;
    }

    const toastId = toast.loading("Granting course access...");
    setIsSubmitting(true);

    try {
      const accessOption = await resolveAccessOption();
      const payload: GrantExternalCourseAccessPayload = {
        userId: selectedUser.id,
        paymentAmount,
        paymentCurrency,
        amountEur,
        paymentMethod,
        externalReference: externalReference.trim(),
        paidAt: new Date(`${paidAt}T00:00:00`).toISOString(),
        notes: notes.trim() || undefined,
        manualAccessOptionId: accessOption.id,
      };
      const response = await grantExternalCourseAccess(courseId, payload);
      toast.success(response.message, { id: toastId });
      await onGranted(response.enrollmentId);
      reset();
      onClose();
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={requestClose} size="xl" className="!p-0">
      <div className="flex items-start justify-between border-b border-black/10 px-6 py-5">
        <div>
          <div className="flex items-center gap-2 text-[#006B3F]">
            <UserPlus className="size-5" />
            <p className="text-xs font-bold uppercase tracking-wide">
              External Course Access
            </p>
          </div>
          <h2 className="mt-2 text-xl font-bold text-[#202420]">
            {courseTitle}
          </h2>
        </div>

        <button
          type="button"
          disabled={isSubmitting}
          onClick={requestClose}
          aria-label="Close external access form"
          className="flex size-9 items-center justify-center rounded-full text-black/55 hover:bg-[#F4F7F4]"
        >
          <X className="size-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 px-6 py-5">
        <div className="rounded-2xl border border-[#F0D9A7] bg-[#FFF8E8] px-4 py-3 text-sm leading-5 text-[#7B5500]">
          Record only a payment received outside the mobile apps. This does not
          create, verify, refund, or change any Google Play or App Store order.
        </div>

        <Field label="Course access">
          <div className="grid grid-cols-2 gap-3">
            <AccessTypeButton
              selected={accessType === "lifetime"}
              title="Lifetime"
              description="Access does not expire"
              onClick={() => setAccessType("lifetime")}
            />
            <AccessTypeButton
              selected={accessType === "time_limited"}
              title="Time-limited"
              description="Access expires after a set duration"
              onClick={() => setAccessType("time_limited")}
            />
          </div>
        </Field>

        {accessType === "time_limited" && (
          <Field label="Access duration (days)">
            <input
              required
              type="number"
              min="1"
              max="3650"
              step="1"
              value={durationDays}
              disabled={isLoadingAccessOptions}
              onChange={(event) => setDurationDays(event.target.value)}
              className={inputClassName}
            />
          </Field>
        )}

        <div>
          <label className="text-sm font-semibold text-[#202420]">
            Search user
          </label>
          {selectedUser ? (
            <div className="mt-2 flex items-center justify-between rounded-2xl border border-[#B8DFC8] bg-[#F1FBF5] p-3">
              <div>
                <p className="font-semibold text-[#202420]">
                  {selectedUser.fullName}
                </p>
                <p className="text-xs text-black/55">
                  {selectedUser.email || selectedUser.phone || selectedUser.id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setSelectedUser(null);
                  setSearch("");
                }}
                className="text-xs font-bold text-[#006B3F]"
              >
                Change
              </button>
            </div>
          ) : (
            <div className="relative mt-2">
              <Search className="pointer-events-none absolute left-3 top-3 size-5 text-black/40" />
              <input
                value={search}
                onChange={(event) => {
                  const value = event.target.value;
                  setSearch(value);
                  if (value.trim().length < 2) {
                    setUsers([]);
                    setIsSearching(false);
                  }
                }}
                placeholder="Name, email, phone, or user ID"
                className={`${inputClassName} pl-10 pr-10`}
                autoComplete="off"
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-3 size-5 animate-spin text-[#006B3F]" />
              )}

              {search.trim().length >= 2 && !isSearching && (
                <div className="absolute z-20 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-[#DDE5DE] bg-white p-2 shadow-xl">
                  {users.length > 0 ? (
                    users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => {
                          setSelectedUser(user);
                          setSearch(user.fullName);
                          setUsers([]);
                        }}
                        className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left hover:bg-[#F1FBF5]"
                      >
                        <span>
                          <span className="block text-sm font-semibold text-[#202420]">
                            {user.fullName}
                          </span>
                          <span className="block text-xs text-black/50">
                            {user.email || user.phone || user.id}
                          </span>
                        </span>
                        <Check className="size-4 text-[#006B3F]" />
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-sm text-black/55">
                      No matching users found.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Amount received">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={paymentAmount}
              onChange={(event) => {
                setPaymentAmount(event.target.value);
                if (paymentCurrency === "EUR") {
                  setAmountEur(event.target.value);
                }
              }}
              className={inputClassName}
            />
          </Field>

          <Field label="Payment currency">
            <select
              value={paymentCurrency}
              onChange={(event) => {
                const currency = event.target.value as "EUR" | "BDT";
                setPaymentCurrency(currency);
                setAmountEur(currency === "EUR" ? paymentAmount : "");
              }}
              className={inputClassName}
            >
              <option value="EUR">Euro (EUR)</option>
              <option value="BDT">Bangladeshi Taka (BDT)</option>
            </select>
          </Field>

          <Field label="EUR equivalent">
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={amountEur}
              disabled={paymentCurrency === "EUR"}
              onChange={(event) => setAmountEur(event.target.value)}
              className={inputClassName}
            />
          </Field>

          <Field label="Payment method">
            <select
              value={paymentMethod}
              onChange={(event) =>
                setPaymentMethod(
                  event.target.value as AdminExternalPaymentMethod,
                )
              }
              className={inputClassName}
            >
              <option value="bank_transfer">Bank transfer</option>
              <option value="mobile_banking">Mobile banking</option>
              <option value="cash">Cash</option>
              <option value="card">Card (external)</option>
              <option value="other">Other</option>
            </select>
          </Field>

          <Field label="Payment reference">
            <input
              required
              maxLength={255}
              value={externalReference}
              onChange={(event) => setExternalReference(event.target.value)}
              placeholder="Receipt or bank transaction ID"
              className={inputClassName}
            />
          </Field>

          <Field label="Payment date">
            <input
              required
              type="date"
              max={today()}
              value={paidAt}
              onChange={(event) => setPaidAt(event.target.value)}
              className={inputClassName}
            />
          </Field>
        </div>

        <Field label="Internal notes (optional)">
          <textarea
            maxLength={1000}
            rows={3}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="w-full resize-y rounded-xl border border-[#DDE5DE] bg-white px-3 py-3 text-sm outline-none focus:border-[#006B3F] focus:ring-2 focus:ring-[#006B3F]/10"
          />
        </Field>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-[#F7FAF6] p-4 text-sm text-[#3F463F]">
          <input
            type="checkbox"
            checked={confirmed}
            onChange={(event) => setConfirmed(event.target.checked)}
            className="mt-0.5 size-4 accent-[#006B3F]"
          />
          <span>
            I confirm the payment was received externally and the details above
            are correct.
          </span>
        </label>

        <div className="flex justify-end gap-3 border-t border-black/10 pt-5">
          <Button
            variant="outline"
            disabled={isSubmitting}
            onClick={requestClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={
              isSubmitting ||
              !confirmed ||
              isLoadingAccessOptions
            }
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <UserPlus className="mr-2 size-4" />
            )}
            {isSubmitting ? "Granting..." : "Grant Access"}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function AccessTypeButton({
  selected,
  title,
  description,
  onClick,
}: {
  selected: boolean;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition ${
        selected
          ? "border-[#006B3F] bg-[#F1FBF5] ring-2 ring-[#006B3F]/10"
          : "border-[#DDE5DE] bg-white hover:border-[#9CB9A8]"
      }`}
    >
      <span className="block text-sm font-bold text-[#202420]">{title}</span>
      <span className="mt-1 block text-xs font-normal text-black/55">
        {description}
      </span>
    </button>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="space-y-2 text-sm font-semibold text-[#202420]">
      <span className="block">{label}</span>
      {children}
    </label>
  );
}
