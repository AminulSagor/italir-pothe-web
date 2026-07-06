"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import Button from "@/components/UI/buttons/button";
import type {
  CommerceSortOrder,
  CourseEnrollmentSortBy,
} from "@/types/course-directory/course-commerce.type";

interface EnrollmentFilterMenuProps {
  status: string;
  paymentProvider: string;
  sortBy: CourseEnrollmentSortBy;
  sortOrder: CommerceSortOrder;
  statusOptions: string[];
  onApply: (values: {
    status: string;
    paymentProvider: string;
    sortBy: CourseEnrollmentSortBy;
    sortOrder: CommerceSortOrder;
  }) => void;
}

const formatOptionLabel = (value: string) => {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const fixedPaymentProviderOptions = ["google_play", "app_store"];

const EnrollmentFilterMenu = ({
  status,
  paymentProvider,
  sortBy,
  sortOrder,
  statusOptions,
  onApply,
}: EnrollmentFilterMenuProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const [open, setOpen] = useState(false);
  const [draftStatus, setDraftStatus] = useState(status);

  const [draftPaymentProvider, setDraftPaymentProvider] =
    useState(paymentProvider);

  const [draftSortBy, setDraftSortBy] =
    useState<CourseEnrollmentSortBy>(sortBy);

  const [draftSortOrder, setDraftSortOrder] =
    useState<CommerceSortOrder>(sortOrder);

  useEffect(() => {
    setDraftStatus(status);
    setDraftPaymentProvider(paymentProvider);
    setDraftSortBy(sortBy);
    setDraftSortOrder(sortOrder);
  }, [paymentProvider, sortBy, sortOrder, status]);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        containerRef.current &&
        event.target instanceof Node &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleReset = () => {
    setDraftStatus("");
    setDraftPaymentProvider("");
    setDraftSortBy("enrolledAt");
    setDraftSortOrder("DESC");

    onApply({
      status: "",
      paymentProvider: "",
      sortBy: "enrolledAt",
      sortOrder: "DESC",
    });

    setOpen(false);
  };

  const handleApply = () => {
    onApply({
      status: draftStatus,
      paymentProvider: draftPaymentProvider,
      sortBy: draftSortBy,
      sortOrder: draftSortOrder,
    });

    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="sm"
        className="gap-2 bg-[#E9EEE9]"
        onClick={() => setOpen((value) => !value)}
      >
        <SlidersHorizontal className="size-4" />
        Filter
      </Button>

      {open && (
        <div className="absolute right-0 top-11 z-30 w-72 rounded-2xl border border-black/10 bg-white p-5 shadow-xl">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-semibold text-[#202420]">Filter Enrollments</h3>

            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close filters"
            >
              <X className="size-4 text-black/50" />
            </button>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-black/60">
                Status
              </span>

              <select
                value={draftStatus}
                onChange={(event) => setDraftStatus(event.target.value)}
                className="h-10 w-full rounded-xl border border-black/10 bg-[#F7FAF6] px-3 text-sm outline-none"
              >
                <option value="">All Statuses</option>

                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatOptionLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-black/60">
                Payment Provider
              </span>

              <select
                value={draftPaymentProvider}
                onChange={(event) =>
                  setDraftPaymentProvider(event.target.value)
                }
                className="h-10 w-full rounded-xl border border-black/10 bg-[#F7FAF6] px-3 text-sm outline-none"
              >
                <option value="">All Providers</option>

                {fixedPaymentProviderOptions.map((option) => (
                  <option key={option} value={option}>
                    {formatOptionLabel(option)}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-black/60">
                Sort By
              </span>

              <select
                value={draftSortBy}
                onChange={(event) =>
                  setDraftSortBy(event.target.value as CourseEnrollmentSortBy)
                }
                className="h-10 w-full rounded-xl border border-black/10 bg-[#F7FAF6] px-3 text-sm outline-none"
              >
                <option value="enrolledAt">Enrollment Date</option>

                <option value="amountPaid">Amount Paid</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold text-black/60">
                Sort Order
              </span>

              <select
                value={draftSortOrder}
                onChange={(event) =>
                  setDraftSortOrder(event.target.value as CommerceSortOrder)
                }
                className="h-10 w-full rounded-xl border border-black/10 bg-[#F7FAF6] px-3 text-sm outline-none"
              >
                <option value="DESC">Descending</option>

                <option value="ASC">Ascending</option>
              </select>
            </label>
          </div>

          <div className="mt-5 flex gap-3">
            <Button variant="outline" size="sm" fullWidth onClick={handleReset}>
              Reset
            </Button>

            <Button size="sm" fullWidth onClick={handleApply}>
              Apply
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnrollmentFilterMenu;
