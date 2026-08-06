"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";
import {
  deleteCareerTrack,
  getCareerTracks,
} from "@/service/skill-builder/skill-builder.service";
import type {
  CareerTrackListResponse,
  SkillBuilderCareerTrack,
} from "@/types/skill-builder/skill-builder.type";

import AddCareerTrackCard from "./add-career-track-card";
import CareerTrackCard from "./career-track-card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CareerTrackGridProps {
  refreshKey?: number;
  isCreating?: boolean;
  onCreateTrack: () => void;
  onMutated?: () => void;
}

const CAREER_TRACKS_PER_PAGE = 10;

const initialListResponse: CareerTrackListResponse = {
  items: [],
  page: 1,
  limit: CAREER_TRACKS_PER_PAGE,
  totalItems: 0,
  totalPages: 1,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

export default function CareerTrackGrid({
  refreshKey = 0,
  isCreating = false,
  onCreateTrack,
  onMutated,
}: CareerTrackGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const careerTrackSearch = searchParams.get("search") || "";
  const [currentPage, setCurrentPage] = useState(1);

  const previousSearchRef = useRef(careerTrackSearch);

  const [listResponse, setListResponse] =
    useState<CareerTrackListResponse>(initialListResponse);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [trackPendingDelete, setTrackPendingDelete] =
    useState<SkillBuilderCareerTrack | null>(null);

  const [isDeletingTrack, setIsDeletingTrack] = useState(false);

  const loadCareerTracks = useCallback(
    async (requestedPage: number) => {
      try {
        setIsLoading(true);
        setError("");

        const response = await getCareerTracks({
          page: requestedPage,
          limit: CAREER_TRACKS_PER_PAGE,
          search: careerTrackSearch,
        });

        const availablePages = Math.max(response.totalPages, 1);

        /*
         * When the last item on the last page is
         * deleted, return to the previous page.
         */
        if (requestedPage > availablePages) {
          setCurrentPage(availablePages);
          return;
        }

        setListResponse({
          ...response,
          totalPages: availablePages,
        });
      } catch (loadError) {
        setError(getErrorMessage(loadError));
        setListResponse(initialListResponse);
      } finally {
        setIsLoading(false);
      }
    },
    [careerTrackSearch],
  );

  useEffect(() => {
    const searchChanged = previousSearchRef.current !== careerTrackSearch;

    if (searchChanged) {
      previousSearchRef.current = careerTrackSearch;

      /*
       * Every new search starts from page one.
       */
      if (currentPage !== 1) {
        setCurrentPage(1);
        return;
      }
    }

    void loadCareerTracks(currentPage);
  }, [careerTrackSearch, currentPage, refreshKey, loadCareerTracks]);

  const handleEditTrack = (track: SkillBuilderCareerTrack) => {
    router.push(
      `/admin/skill-builder-manager/career-track-studio?careerTrackId=${track.id}`,
    );
  };

  const handleDeleteRequest = (track: SkillBuilderCareerTrack) => {
    setTrackPendingDelete(track);
  };

  const handleCancelDelete = () => {
    if (isDeletingTrack) {
      return;
    }

    setTrackPendingDelete(null);
  };

  const handleConfirmDeleteTrack = async () => {
    if (!trackPendingDelete) {
      return;
    }

    try {
      setIsDeletingTrack(true);

      await deleteCareerTrack(trackPendingDelete.id);

      toast.success("Career track deleted.");
      setTrackPendingDelete(null);

      if (onMutated) {
        onMutated();
      } else {
        await loadCareerTracks(currentPage);
      }
    } catch (deleteError) {
      toast.error(getErrorMessage(deleteError));
    } finally {
      setIsDeletingTrack(false);
    }
  };

  const startItem =
    listResponse.totalItems === 0
      ? 0
      : (listResponse.page - 1) * listResponse.limit + 1;

  const endItem = Math.min(
    listResponse.page * listResponse.limit,
    listResponse.totalItems,
  );

  const canGoPrevious = currentPage > 1;

  const canGoNext = currentPage < listResponse.totalPages;

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[470px] animate-pulse rounded-3xl bg-[#EEF2EE]"
          />
        ))}

        <AddCareerTrackCard isCreating={isCreating} onAdd={onCreateTrack} />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-5">
        {error ? (
          <div className="rounded-3xl border border-[#F7C6C7] bg-[#FFF8F8] px-6 py-4 text-sm text-[#D92D20]">
            {error}
          </div>
        ) : null}

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {listResponse.items.map((track) => (
            <CareerTrackCard
              key={track.id}
              track={track}
              onEdit={() => handleEditTrack(track)}
              onDelete={() => handleDeleteRequest(track)}
            />
          ))}

          <AddCareerTrackCard isCreating={isCreating} onAdd={onCreateTrack} />
        </div>

        {!error && listResponse.items.length === 0 ? (
          <div className="rounded-3xl border border-[#E5ECE6] bg-white px-6 py-8 text-center text-sm text-[#5F675F]">
            No career tracks found.
          </div>
        ) : null}

        {!error && listResponse.totalPages > 1 ? (
          <div className="flex flex-col gap-4 rounded-3xl bg-white px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[#66736B]">
              Showing{" "}
              <span className="font-semibold text-[#006B3F]">
                {startItem}-{endItem}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-[#006B3F]">
                {listResponse.totalItems}
              </span>{" "}
              career tracks
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!canGoPrevious}
                onClick={() => setCurrentPage((page) => page - 1)}
                className="flex size-10 items-center justify-center rounded-full border border-[#DCE5DA] transition hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Previous career tracks page"
              >
                <ChevronLeft className="size-5" />
              </button>

              <span className="min-w-24 text-center text-sm font-medium text-[#66736B]">
                Page {currentPage} of {listResponse.totalPages}
              </span>

              <button
                type="button"
                disabled={!canGoNext}
                onClick={() => setCurrentPage((page) => page + 1)}
                className="flex size-10 items-center justify-center rounded-full border border-[#DCE5DA] transition hover:bg-[#F4F7F4] disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Next career tracks page"
              >
                <ChevronRight className="size-5" />
              </button>
            </div>
          </div>
        ) : null}
      </div>

      <ConfirmActionDialog
        open={Boolean(trackPendingDelete)}
        title="Delete Career Track"
        description={
          trackPendingDelete
            ? `Are you sure you want to delete "${trackPendingDelete.title}"? Its modules, sentences, and learner progress may also be removed.`
            : ""
        }
        confirmLabel="Delete Track"
        danger
        isSubmitting={isDeletingTrack}
        onCancel={handleCancelDelete}
        onConfirm={handleConfirmDeleteTrack}
      />
    </>
  );
}
