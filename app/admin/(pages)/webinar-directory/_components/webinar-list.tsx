"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  deleteWebinar,
  getMyDraftWebinars,
  getMyLiveWebinars,
  getMyUpcomingWebinars,
} from "@/service/webinar/webinar";
import type {
  WebinarDirectoryTab,
  WebinarItem,
  WebinarPagination,
} from "@/types/webinar/webinar_type";
import DeleteWebinarDialog from "./delete-webinar-dialog";
import WebinarCard from "./webinar-card";

const WEBINARS_PER_PAGE = 10;

const defaultPagination: WebinarPagination = {
  page: 1,
  limit: WEBINARS_PER_PAGE,
  totalPages: 1,
  totalItems: 0,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const getPaginationRange = (currentPage: number, totalPages: number) => {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (currentPage <= 3) return [1, 2, 3, 4, totalPages];
  if (currentPage >= totalPages - 2) {
    return [1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, currentPage - 1, currentPage, currentPage + 1, totalPages];
};

const WebinarList = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams.get("tab");
  const activeTab =
    rawTab === "past-recordings"
      ? "draft"
      : ((rawTab as WebinarDirectoryTab) ?? "upcoming-scheduled");

  const pageParam = Number(searchParams.get("page") || 1);
  const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [webinars, setWebinars] = useState<WebinarItem[]>([]);
  const [pagination, setPagination] =
    useState<WebinarPagination>(defaultPagination);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");
  const [selectedWebinar, setSelectedWebinar] = useState<WebinarItem | null>(
    null,
  );

  const emptyMessage = useMemo(() => {
    if (activeTab === "draft") return "No draft webinars found.";
    if (activeTab === "live-now") return "No live webinars found.";
    return "No upcoming scheduled webinars found.";
  }, [activeTab]);

  const pageNumbers = useMemo(
    () => getPaginationRange(pagination.page, pagination.totalPages),
    [pagination.page, pagination.totalPages],
  );

  const showingFrom =
    pagination.totalItems === 0
      ? 0
      : (pagination.page - 1) * pagination.limit + 1;
  const showingTo = Math.min(
    pagination.page * pagination.limit,
    pagination.totalItems,
  );

  const updatePage = (nextPage: number) => {
    const safePage = Math.min(Math.max(nextPage, 1), pagination.totalPages || 1);
    router.push(`?tab=${activeTab}&page=${safePage}`);
  };

  const loadWebinars = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response =
        activeTab === "draft"
          ? await getMyDraftWebinars(page, WEBINARS_PER_PAGE)
          : activeTab === "live-now"
            ? await getMyLiveWebinars(page, WEBINARS_PER_PAGE)
            : await getMyUpcomingWebinars(page, WEBINARS_PER_PAGE);

      setWebinars(response.webinars);
      setPagination(response.pagination);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setWebinars([]);
      setPagination(defaultPagination);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWebinars();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page]);

  const handleEdit = (webinar: WebinarItem) => {
    router.push(`/admin/webinar-directory/create?id=${webinar.id}`);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedWebinar) return;

    try {
      setIsDeleting(true);
      setError("");
      await deleteWebinar(selectedWebinar.id);
      setSelectedWebinar(null);
      await loadWebinars();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="rounded-3xl bg-white p-8 text-sm text-[#66736B] shadow-sm">
        Loading webinars...
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {webinars.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center text-sm text-[#66736B] shadow-sm">
          {emptyMessage}
        </div>
      ) : (
        webinars.map((webinar) => (
          <WebinarCard
            key={webinar.id}
            webinar={webinar}
            onEdit={handleEdit}
            onDelete={setSelectedWebinar}
          />
        ))
      )}

      {pagination.totalItems > 0 && (
        <div className="flex flex-col gap-5 rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5 lg:flex-row lg:items-center lg:justify-between">
          <p className="text-base text-black/45">
            Showing {showingFrom}-{showingTo} of {pagination.totalItems} webinars
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/45 transition disabled:cursor-not-allowed disabled:opacity-40"
              disabled={pagination.page <= 1}
              onClick={() => updatePage(pagination.page - 1)}
            >
              ‹
            </button>

            {pageNumbers.map((pageNumber, index) => {
              const previousPage = pageNumbers[index - 1];
              const shouldShowDots = previousPage && pageNumber - previousPage > 1;

              return (
                <div key={pageNumber} className="flex items-center gap-3">
                  {shouldShowDots && <span className="text-black/45">...</span>}

                  <button
                    className={
                      pageNumber === pagination.page
                        ? "flex size-11 items-center justify-center rounded-full bg-secondary text-white"
                        : "text-lg text-black/70"
                    }
                    onClick={() => updatePage(pageNumber)}
                  >
                    {pageNumber}
                  </button>
                </div>
              );
            })}

            <button
              className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/45 transition disabled:cursor-not-allowed disabled:opacity-40"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => updatePage(pagination.page + 1)}
            >
              ›
            </button>
          </div>
        </div>
      )}

      <DeleteWebinarDialog
        open={Boolean(selectedWebinar)}
        webinarTitle={selectedWebinar?.title}
        isDeleting={isDeleting}
        onClose={() => setSelectedWebinar(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};

export default WebinarList;
