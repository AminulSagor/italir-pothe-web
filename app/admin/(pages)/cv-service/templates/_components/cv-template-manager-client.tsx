"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import ConfirmActionDialog from "@/components/UI/dialogs/confirm-action-dialog";
import {
  archiveResumeTemplate,
  getResumeTemplates,
} from "@/service/resume-studio/resume-template.service";
import type {
  ResumeTemplate,
  ResumeTemplateStatus,
} from "@/types/resume-studio/resume-template.types";

import CVTemplateCard from "./cv-template-card";
import CVTemplateHeader from "./cv-template-header";
import CVTemplatePagination from "./cv-template-pagination";
import ResumeTemplateFilters from "./resume-template-filters";

const PAGE_SIZE = 9;

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";

export default function CVTemplateManagerClient() {
  const router = useRouter();
  const [templates, setTemplates] = useState<ResumeTemplate[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<ResumeTemplateStatus | "">("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [debouncedCategory, setDebouncedCategory] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [templateToArchive, setTemplateToArchive] =
    useState<ResumeTemplate | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / PAGE_SIZE)),
    [total],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
      setDebouncedCategory(category.trim());
      setPage(1);
    }, 350);

    return () => window.clearTimeout(timeout);
  }, [category, search]);

  useEffect(() => {
    let cancelled = false;

    const loadTemplates = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getResumeTemplates({
          page,
          limit: PAGE_SIZE,
          search: debouncedSearch,
          category: debouncedCategory,
          status,
        });

        if (cancelled) return;

        const computedPages = Math.max(
          1,
          Math.ceil(response.total / response.limit),
        );

        if (page > computedPages) {
          setPage(computedPages);
          return;
        }

        setTemplates(response.items);
        setTotal(response.total);
      } catch (error) {
        if (cancelled) return;
        setTemplates([]);
        setTotal(0);
        setLoadError(getErrorMessage(error));
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [debouncedCategory, debouncedSearch, page, reloadKey, status]);

  const handlePreview = (template: ResumeTemplate) => {
    if (!template.previewPdfUrl) {
      toast.error("This template does not have a published PDF preview yet.");
      return;
    }

    window.open(template.previewPdfUrl, "_blank", "noopener,noreferrer");
  };

  const handleArchive = async () => {
    if (!templateToArchive) return;

    const toastId = toast.loading("Archiving CV template...");

    try {
      setIsArchiving(true);
      await archiveResumeTemplate(templateToArchive.id);
      toast.success("CV template archived.", { id: toastId });
      setTemplateToArchive(null);
      setReloadKey((current) => current + 1);
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsArchiving(false);
    }
  };

  return (
    <>
      <div className="space-y-7">
        <CVTemplateHeader
          onCreate={() => router.push("/admin/cv-service/templates/new")}
        />

        <ResumeTemplateFilters
          search={search}
          category={category}
          status={status}
          total={total}
          isLoading={isLoading}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onStatusChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          onClear={() => {
            setSearch("");
            setCategory("");
            setStatus("");
            setPage(1);
          }}
        />

        {loadError ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center shadow-sm">
            <p className="font-semibold text-[#D92D20]">
              Templates could not be loaded
            </p>
            <p className="mx-auto mt-2 max-w-[500px] text-sm text-black/50">
              {loadError}
            </p>
            <Button
              variant="outline"
              className="mt-6"
              onClick={() => setReloadKey((current) => current + 1)}
            >
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="h-[430px] animate-pulse rounded-3xl bg-white p-5 shadow-sm"
              >
                <div className="h-[185px] rounded-2xl bg-[#EEF3EB]" />
                <div className="mt-5 h-5 w-2/3 rounded bg-[#EEF3EB]" />
                <div className="mt-3 h-4 w-full rounded bg-[#F2F5F1]" />
                <div className="mt-2 h-4 w-4/5 rounded bg-[#F2F5F1]" />
              </div>
            ))}
          </div>
        ) : templates.length ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => (
                <CVTemplateCard
                  key={template.id}
                  template={template}
                  onEdit={(item) =>
                    router.push(`/admin/cv-service/templates/${item.id}`)
                  }
                  onPreview={handlePreview}
                  onArchive={setTemplateToArchive}
                />
              ))}
            </div>

            <CVTemplatePagination
              page={page}
              totalPages={totalPages}
              total={total}
              limit={PAGE_SIZE}
              onPageChange={setPage}
            />
          </>
        ) : (
          <div className="rounded-3xl bg-white px-6 py-16 text-center shadow-sm">
            <Loader2 className="mx-auto size-8 text-[#B8C4BA]" />
            <h2 className="mt-4 text-lg font-bold text-[#202420]">
              No CV templates found
            </h2>
            <p className="mx-auto mt-2 max-w-[460px] text-sm text-black/50">
              Create a backend-rendered HTML/CSS template or clear the current
              filters.
            </p>
          </div>
        )}
      </div>

      <ConfirmActionDialog
        open={Boolean(templateToArchive)}
        title="Archive CV Template"
        description={`Archive “${templateToArchive?.name ?? "this template"}”? It will no longer be available to Flutter until a new version is published.`}
        confirmLabel="Archive Template"
        danger
        isSubmitting={isArchiving}
        onCancel={() => !isArchiving && setTemplateToArchive(null)}
        onConfirm={handleArchive}
      />
    </>
  );
}
