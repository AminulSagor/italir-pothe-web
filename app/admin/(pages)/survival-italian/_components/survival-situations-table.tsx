"use client";

import { useEffect, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ListChecks,
  ListFilter,
  MoreVertical,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

import Card from "@/components/UI/cards/card";
import DeleteSituationDialog from "./dialogs/delete-situation-dialog";
import EditSituationDialog from "./dialogs/edit-situation-dialog";
import SurvivalTableRow from "./survival-table-row";

import {
  deleteSurvivalSituation,
  getSurvivalResourceReadUrl,
  getSurvivalSituations,
} from "@/service/survival-italian/survival-italian.service";
import {
  getSurvivalResourceUrl,
  hasSurvivalPdf,
} from "../_utils/survival-italian-ui.util";
import type {
  SurvivalSituation,
  SurvivalSituationListResponse,
  SurvivalSituationSortOrder,
} from "@/types/survival-italian/survival-italian.type";

interface SurvivalSituationsTableProps {
  refreshKey?: number;
  onMutated?: () => void;
}

const SITUATIONS_PER_PAGE = 10;

const initialListResponse: SurvivalSituationListResponse = {
  items: [],
  page: 1,
  limit: SITUATIONS_PER_PAGE,
  totalItems: 0,
  totalPages: 1,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export default function SurvivalSituationsTable({
  refreshKey = 0,
  onMutated,
}: SurvivalSituationsTableProps) {
  const searchParams = useSearchParams();
  const survivalSituationSearch = searchParams.get("search") || "";

  const [listResponse, setListResponse] =
    useState<SurvivalSituationListResponse>(initialListResponse);
  const [selectedSituation, setSelectedSituation] =
    useState<SurvivalSituation | null>(null);
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<SurvivalSituationSortOrder>("ASC");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const currentPage = listResponse.page || page;
  const totalPages = listResponse.totalPages || 1;

  const loadSituations = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getSurvivalSituations({
        page,
        limit: SITUATIONS_PER_PAGE,
        search: survivalSituationSearch,
        status: "published",
        sortBy: "sortOrder",
        sortOrder,
      });

      setListResponse(response);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setListResponse({
        ...initialListResponse,
        page,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [survivalSituationSearch, sortOrder]);

  useEffect(() => {
    loadSituations();
  }, [page, refreshKey, survivalSituationSearch, sortOrder]);

  const handleEditOpen = (situation: SurvivalSituation) => {
    setSelectedSituation(situation);
    setEditOpen(true);
  };

  const handleDeleteOpen = (situation: SurvivalSituation) => {
    setSelectedSituation(situation);
    setDeleteOpen(true);
  };

  const handleViewPdf = async (situation: SurvivalSituation) => {
    try {
      if (!hasSurvivalPdf(situation) || !situation.resourceFileId) {
        toast.error("No PDF file is attached.");
        return;
      }

      const existingUrl = getSurvivalResourceUrl(situation);
      const fileUrl =
        existingUrl ||
        (await getSurvivalResourceReadUrl(situation.resourceFileId));

      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } catch (viewError) {
      toast.error(getErrorMessage(viewError));
    }
  };

  const handleMutationSuccess = () => {
    loadSituations();
    onMutated?.();
  };

  const handleDeleteConfirm = async () => {
    if (!selectedSituation) return;

    try {
      setIsDeleting(true);
      setError("");

      await deleteSurvivalSituation(selectedSituation.id);

      setDeleteOpen(false);
      setSelectedSituation(null);
      handleMutationSuccess();
    } catch (deleteError) {
      setError(getErrorMessage(deleteError));
    } finally {
      setIsDeleting(false);
    }
  };

  const handlePreviousPage = () => {
    setPage((currentValue) => Math.max(currentValue - 1, 1));
  };

  const handleNextPage = () => {
    setPage((currentValue) => Math.min(currentValue + 1, totalPages));
  };

  const handleSortToggle = () => {
    setSortOrder((currentValue) => (currentValue === "ASC" ? "DESC" : "ASC"));
  };

  return (
    <>
      <Card
        padding="none"
        rounded="3xl"
        shadow="sm"
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-[#EEF2EE] px-6 py-5">
          <div className="flex items-center gap-2">
            <ListChecks className="size-5 text-[#006B3F]" />

            <h2 className="text-base font-semibold text-[#202420]">
              Active Survival Situations
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              title={`Sort by sortOrder ${sortOrder}`}
              onClick={handleSortToggle}
            >
              <ListFilter className="size-5 text-[#5F675F]" />
            </button>

            <button type="button">
              <MoreVertical className="size-5 text-[#5F675F]" />
            </button>
          </div>
        </div>

        {error ? (
          <div className="border-b border-[#EEF2EE] bg-[#FFF8F8] px-6 py-3 text-sm text-[#D92D20]">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-[#EEF2EE] bg-[#FAFCFA]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  ICON
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  SITUATION NAME
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  BENGALI SUBTITLE
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  PDF STATUS
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-[#5F675F]"
                  >
                    Loading situations...
                  </td>
                </tr>
              ) : listResponse.items.length > 0 ? (
                listResponse.items.map((situation) => (
                  <SurvivalTableRow
                    key={situation.id}
                    situation={situation}
                    onEdit={() => handleEditOpen(situation)}
                    onView={() => handleViewPdf(situation)}
                    onDelete={() => handleDeleteOpen(situation)}
                  />
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-sm text-[#5F675F]"
                  >
                    No survival situations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#EEF2EE] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#5F675F]">
            Showing {listResponse.items.length} of {listResponse.totalItems}{" "}
            situations
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              disabled={currentPage <= 1 || isLoading}
              onClick={handlePreviousPage}
              className="flex size-9 items-center justify-center rounded-full border border-[#DDE5DD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronLeft className="size-4" />
            </button>

            <p className="text-sm text-[#202420]">
              Page {currentPage} of {totalPages}
            </p>

            <button
              type="button"
              disabled={currentPage >= totalPages || isLoading}
              onClick={handleNextPage}
              className="flex size-9 items-center justify-center rounded-full border border-[#DDE5DD] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      </Card>

      <EditSituationDialog
        open={editOpen}
        situation={selectedSituation}
        onClose={() => setEditOpen(false)}
        onSaved={handleMutationSuccess}
      />

      <DeleteSituationDialog
        open={deleteOpen}
        situation={selectedSituation}
        isDeleting={isDeleting}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
      />
    </>
  );
}
