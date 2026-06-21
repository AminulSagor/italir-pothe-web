"use client";

import { useEffect, useMemo, useState } from "react";
import { BookOpen, Check, Link2, Loader2, Search, X } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import type { FinalExamLinkableCourse } from "@/types/final-exam/final-exam.type";

interface LinkFinalExamCourseDialogProps {
  open: boolean;
  examTitle: string;
  courses: FinalExamLinkableCourse[];
  isLoading: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: (courseId: string) => void;
}

const LinkFinalExamCourseDialog = ({
  open,
  examTitle,
  courses,
  isLoading,
  isSubmitting,
  onClose,
  onConfirm,
}: LinkFinalExamCourseDialogProps) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");

  useEffect(() => {
    if (!open) {
      setSearchValue("");
      setSelectedCourseId("");
    }
  }, [open]);

  useEffect(() => {
    if (
      selectedCourseId &&
      !courses.some((course) => course.id === selectedCourseId)
    ) {
      setSelectedCourseId("");
    }
  }, [courses, selectedCourseId]);

  const filteredCourses = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    if (!normalizedSearch) {
      return courses;
    }

    return courses.filter((course) => {
      return (
        course.title.toLowerCase().includes(normalizedSearch) ||
        course.subtitle?.toLowerCase().includes(normalizedSearch) ||
        course.levelTitle?.toLowerCase().includes(normalizedSearch)
      );
    });
  }, [courses, searchValue]);

  const handleClose = () => {
    if (isSubmitting) return;

    onClose();
  };

  const handleConfirm = () => {
    if (!selectedCourseId || isSubmitting) return;

    onConfirm(selectedCourseId);
  };

  return (
    <Dialog open={open} onClose={handleClose} size="lg" className="!p-0">
      <div className="border-b border-[#E3E9E3] px-7 py-6">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[#006B3F]">
              <Link2 className="size-5" />

              <span className="text-xs font-bold uppercase tracking-wide">
                Link Course
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#202420]">
              Select an Available Course
            </h2>

            <p className="mt-2 text-sm text-[#68736C]">
              Choose a course to link with{" "}
              <span className="font-semibold text-[#202420]">{examTitle}</span>.
            </p>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleClose}
            className="flex size-10 items-center justify-center rounded-full text-[#68736C] transition hover:bg-[#F1F5EF] hover:text-[#202420] disabled:opacity-50"
            aria-label="Close link course dialog"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      <div className="px-7 py-6">
        <div className="flex h-12 items-center gap-3 rounded-2xl bg-[#F1F5EF] px-4">
          <Search className="size-5 text-[#7B847D]" />

          <input
            type="search"
            value={searchValue}
            disabled={isLoading || isSubmitting}
            placeholder="Search available courses..."
            onChange={(event) => setSearchValue(event.target.value)}
            className="h-full w-full bg-transparent text-sm text-[#202420] outline-none placeholder:text-[#98A29E]"
          />
        </div>

        <div className="mt-5 max-h-[380px] space-y-3 overflow-y-auto pr-1">
          {isLoading && (
            <div className="flex min-h-[220px] items-center justify-center">
              <div className="text-center">
                <Loader2 className="mx-auto size-7 animate-spin text-[#006B3F]" />

                <p className="mt-3 text-sm text-[#68736C]">
                  Loading available courses...
                </p>
              </div>
            </div>
          )}

          {!isLoading && filteredCourses.length === 0 && (
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#CBD6CC] bg-[#F8FAF7] px-6 text-center">
              <BookOpen className="size-8 text-[#91A097]" />

              <h3 className="mt-4 font-semibold text-[#202420]">
                No linkable courses available
              </h3>

              <p className="mt-2 max-w-sm text-sm leading-6 text-[#68736C]">
                Every existing course is already linked to another final exam,
                or no course matches your search.
              </p>
            </div>
          )}

          {!isLoading &&
            filteredCourses.map((course) => {
              const isSelected = selectedCourseId === course.id;

              return (
                <button
                  key={course.id}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => setSelectedCourseId(course.id)}
                  className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[#006B3F] bg-[#EDF7F0]"
                      : "border-[#DFE6DF] bg-white hover:border-[#AFC3B4] hover:bg-[#FAFCF9]"
                  }`}
                >
                  <div
                    className={`flex size-12 shrink-0 items-center justify-center rounded-2xl ${
                      isSelected
                        ? "bg-[#006B3F] text-white"
                        : "bg-[#EEF3EC] text-[#006B3F]"
                    }`}
                  >
                    <BookOpen className="size-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-semibold text-[#202420]">
                      {course.title}
                    </h4>

                    <p className="mt-1 truncate text-xs text-[#748078]">
                      {course.subtitle ||
                        course.levelTitle ||
                        "Course available for final exam"}
                    </p>

                    {course.status && (
                      <span className="mt-2 inline-flex rounded-full bg-[#EEF3EC] px-2.5 py-1 text-[10px] font-semibold uppercase text-[#557060]">
                        {course.status}
                      </span>
                    )}
                  </div>

                  <div
                    className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                      isSelected
                        ? "border-[#006B3F] bg-[#006B3F] text-white"
                        : "border-[#B9C5BC] bg-white text-transparent"
                    }`}
                  >
                    <Check className="size-4" />
                  </div>
                </button>
              );
            })}
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-[#E3E9E3] px-7 py-5">
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={handleClose}
        >
          Cancel
        </Button>

        <Button
          type="button"
          disabled={isLoading || isSubmitting || !selectedCourseId}
          onClick={handleConfirm}
          className="gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Link2 className="size-4" />
          )}

          {isSubmitting ? "Linking Course..." : "Link Course"}
        </Button>
      </div>
    </Dialog>
  );
};

export default LinkFinalExamCourseDialog;
