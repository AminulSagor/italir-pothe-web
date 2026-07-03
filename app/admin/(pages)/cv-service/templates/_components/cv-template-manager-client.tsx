"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  FileImage,
  Loader2,
  Search,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import {
  deleteCvTemplate,
  getCvTemplates,
} from "@/service/cv-template/cv_template";
import type {
  CvPagination,
  CvTemplateItem,
} from "@/types/cv-template/cv_template_type";

import CVTemplateCard from "./cv-template-card";
import CVTemplateHeader from "./cv-template-header";
import CVTemplatePagination from "./cv-template-pagination";
import DeleteCVTemplateDialog from "./delete-cv-template-dialog";
import UploadCVTemplateDialog from "./upload-cv-template-dialog";

const PAGE_SIZE = 6;

const emptyPagination: CvPagination = {
  page: 1,
  limit: PAGE_SIZE,
  totalPages: 0,
  totalItems: 0,
};

const getErrorMessage = (error: unknown) =>
  error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";

export default function CVTemplateManagerClient() {
  const [templates, setTemplates] = useState<
    CvTemplateItem[]
  >([]);

  const [pagination, setPagination] =
    useState<CvPagination>(emptyPagination);

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] =
    useState("");

  const [reloadKey, setReloadKey] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [uploadDialogOpen, setUploadDialogOpen] =
    useState(false);

  const [templateToDelete, setTemplateToDelete] =
    useState<CvTemplateItem | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setPage(1);
      setDebouncedSearch(search.trim());
    }, 400);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [search]);

  useEffect(() => {
    let cancelled = false;

    const loadTemplates = async () => {
      setIsLoading(true);
      setLoadError("");

      try {
        const response = await getCvTemplates(
          page,
          PAGE_SIZE,
          debouncedSearch,
        );

        if (cancelled) {
          return;
        }

        const totalPages =
          response.pagination.totalPages;

        if (totalPages > 0 && page > totalPages) {
          setPage(totalPages);
          return;
        }

        setTemplates(response.templates);
        setPagination(response.pagination);
      } catch (error) {
        if (cancelled) {
          return;
        }

        setTemplates([]);
        setPagination({
          ...emptyPagination,
          page,
        });

        setLoadError(getErrorMessage(error));
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    void loadTemplates();

    return () => {
      cancelled = true;
    };
  }, [page, debouncedSearch, reloadKey]);

  const clearSearch = () => {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
  };

  const handleTemplateCreated = () => {
    setSearch("");
    setDebouncedSearch("");
    setPage(1);
    setReloadKey((current) => current + 1);
  };

  const handleConfirmDelete = async () => {
    if (!templateToDelete) {
      return;
    }

    const toastId = toast.loading(
      "Deleting CV template...",
    );

    try {
      setIsDeleting(true);

      await deleteCvTemplate(templateToDelete.id);

      toast.success("CV template deleted.", {
        id: toastId,
      });

      const shouldMoveToPreviousPage =
        templates.length === 1 && page > 1;

      setTemplateToDelete(null);

      if (shouldMoveToPreviousPage) {
        setPage((current) => current - 1);
      } else {
        setReloadKey((current) => current + 1);
      }
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="space-y-8">
        <CVTemplateHeader
          onUpload={() => setUploadDialogOpen(true)}
        />

        <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-[480px]">
            <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-black/35" />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search templates by name..."
              className="h-12 w-full rounded-full bg-[#EEF3EB] pl-11 pr-12 text-sm outline-none placeholder:text-black/30"
            />

            {search && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 flex size-6 -translate-y-1/2 items-center justify-center rounded-full text-black/40 transition hover:bg-black/5"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            {isLoading && (
              <Loader2 className="size-4 animate-spin text-[#006B3F]" />
            )}

            <p className="text-sm text-black/50">
              {pagination.totalItems}{" "}
              {pagination.totalItems === 1
                ? "template"
                : "templates"}
            </p>
          </div>
        </div>

        {loadError ? (
          <div className="rounded-3xl bg-white px-6 py-14 text-center">
            <p className="font-semibold text-[#D92D20]">
              Templates could not be loaded
            </p>

            <p className="mx-auto mt-2 max-w-[440px] text-sm text-black/50">
              {loadError}
            </p>

            <Button
              variant="outline"
              className="mt-6"
              onClick={() =>
                setReloadKey((current) => current + 1)
              }
            >
              Try Again
            </Button>
          </div>
        ) : isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: PAGE_SIZE }).map(
              (_, index) => (
                <div
                  key={index}
                  className="animate-pulse rounded-3xl bg-white p-5"
                >
                  <div className="h-[390px] rounded-2xl bg-[#EEF3EB]" />

                  <div className="mt-5 h-5 w-2/3 rounded-full bg-[#EEF3EB]" />

                  <div className="mt-3 h-3 w-1/3 rounded-full bg-[#EEF3EB]" />
                </div>
              ),
            )}
          </div>
        ) : templates.length === 0 ? (
          <div className="rounded-3xl bg-white px-6 py-16 text-center">
            <span className="mx-auto flex size-20 items-center justify-center rounded-3xl bg-[#E6F6F0] text-[#007A4D]">
              <FileImage className="size-9" />
            </span>

            <h2 className="mt-6 text-xl font-bold text-[#202420]">
              {debouncedSearch
                ? "No matching templates"
                : "No CV templates uploaded"}
            </h2>

            <p className="mx-auto mt-2 max-w-[420px] text-sm leading-6 text-black/50">
              {debouncedSearch
                ? `No templates were found for "${debouncedSearch}".`
                : "Upload your first CV template image to make it available in the application."}
            </p>

            {debouncedSearch ? (
              <Button
                variant="outline"
                className="mt-6"
                onClick={clearSearch}
              >
                Clear Search
              </Button>
            ) : (
              <Button
                className="mt-6"
                onClick={() =>
                  setUploadDialogOpen(true)
                }
              >
                Upload First Template
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {templates.map((template) => (
                <CVTemplateCard
                  key={template.id}
                  template={template}
                  isDeleting={
                    isDeleting &&
                    templateToDelete?.id === template.id
                  }
                  onDelete={setTemplateToDelete}
                />
              ))}
            </div>

            <CVTemplatePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              total={pagination.totalItems}
              limit={pagination.limit}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <UploadCVTemplateDialog
        open={uploadDialogOpen}
        onClose={() => setUploadDialogOpen(false)}
        onCreated={handleTemplateCreated}
      />

      <DeleteCVTemplateDialog
        open={Boolean(templateToDelete)}
        templateName={templateToDelete?.name ?? ""}
        isDeleting={isDeleting}
        onCancel={() => {
          if (!isDeleting) {
            setTemplateToDelete(null);
          }
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}