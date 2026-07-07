"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useSearchParams } from "next/navigation";

interface SyllabusHeaderProps {
  courseTitle?: string;
}

export default function SyllabusHeader({ courseTitle }: SyllabusHeaderProps) {
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId") || "";

  const setupHref = courseId
    ? `/admin/course-directory/create-course?courseId=${courseId}`
    : "/admin/course-directory";

  return (
    <div>
      <div className="mb-4 flex items-center gap-2 text-xs text-[#66736B]">
        <Link
          href={setupHref}
          aria-label="Back to course setup"
          className="flex size-9 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-[#F4F7F4]"
        >
          <ArrowLeft className="size-4 text-[#006B3F]" />
        </Link>

        <span>Courses</span>
        <span>{">"}</span>
        <Link href={setupHref} className="transition hover:text-[#006B3F]">
          {courseTitle || "Course"}
        </Link>
        <span>{">"}</span>
        <span className="font-semibold text-[#006B3F]">Syllabus</span>
      </div>

      <h1 className="text-2xl font-bold text-[#202420] sm:text-3xl">
        Syllabus Builder
      </h1>
    </div>
  );
}
