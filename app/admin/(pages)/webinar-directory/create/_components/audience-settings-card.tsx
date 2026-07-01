"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { Course } from "@/types/course-directory/course.type";

type AudienceSettingsCardProps = {
  courseIds: string[];
  courses: Course[];
  isLoading: boolean;
  error: string;
  onCourseIdsChange: (courseIds: string[]) => void;
};

const AudienceSettingsCard = ({
  courseIds,
  courses,
  isLoading,
  error,
  onCourseIdsChange,
}: AudienceSettingsCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAllUsersSelected = courseIds.length === 0;

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!dropdownRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  const toggleCourse = (courseId: string) => {
    if (courseIds.includes(courseId)) {
      onCourseIdsChange(courseIds.filter((id) => id !== courseId));
      return;
    }

    onCourseIdsChange([...courseIds, courseId]);
  };

  const selectionLabel = isAllUsersSelected
    ? "All Users"
    : `${courseIds.length} course${courseIds.length === 1 ? "" : "s"} selected`;

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <h3 className="mb-5 text-lg font-semibold text-[#202420]">
        Audience Settings
      </h3>

      <div className="space-y-3">
        <label className="text-sm font-medium text-[#202420]">
          Target Audience
        </label>

        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-[#E4EBE5] bg-[#F8FBF7] px-4 text-left text-sm font-medium text-[#202420] outline-none transition hover:border-[#B9CDBF] focus:border-[#006B3F]"
            aria-expanded={isOpen}
          >
            <span className="truncate">{selectionLabel}</span>
            <ChevronDown
              className={`size-5 shrink-0 text-[#006B3F] transition-transform ${
                isOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {isOpen && (
            <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-y-auto rounded-2xl border border-[#E4EBE5] bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={() => onCourseIdsChange([])}
                className={`w-full rounded-xl px-4 py-3 text-left text-sm font-medium transition ${
                  isAllUsersSelected
                    ? "bg-[#006B3F] text-white"
                    : "text-[#33413A] hover:bg-[#EFF5F0]"
                }`}
              >
                All Users
              </button>

              {isLoading && (
                <p className="px-4 py-3 text-sm text-[#66736B]">
                  Loading courses...
                </p>
              )}

              {!isLoading && error && (
                <p className="px-4 py-3 text-sm text-red-600">{error}</p>
              )}

              {!isLoading && !error && courses.length === 0 && (
                <p className="px-4 py-3 text-sm text-[#66736B]">
                  No published courses are available.
                </p>
              )}

              {!isLoading &&
                courses.map((course) => {
                  const isSelected = courseIds.includes(course.id);

                  return (
                    <button
                      key={course.id}
                      type="button"
                      onClick={() => toggleCourse(course.id)}
                      className={`mt-1 w-full rounded-xl px-4 py-3 text-left transition ${
                        isSelected
                          ? "bg-[#006B3F] text-white"
                          : "text-[#33413A] hover:bg-[#EFF5F0]"
                      }`}
                    >
                      <span className="block text-sm font-semibold">
                        {course.title}
                      </span>
                      {course.subtitle && (
                        <span
                          className={`mt-1 block text-xs ${
                            isSelected ? "text-white/75" : "text-[#7A877F]"
                          }`}
                        >
                          {course.subtitle}
                        </span>
                      )}
                    </button>
                  );
                })}
            </div>
          )}
        </div>

        <p className="text-xs leading-5 text-[#66736B]">
          All Users opens the webinar to everyone. Selecting courses limits
          access to users enrolled in at least one selected course.
        </p>
      </div>
    </Card>
  );
};

export default AudienceSettingsCard;
