import { ArrowLeft, UserCog } from "lucide-react";
import Link from "next/link";
import Button from "@/components/UI/buttons/button";

const CourseDetailsHeader = () => {
  return (
    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <p className="mb-3 text-xs font-bold uppercase tracking-wide text-[#006B3F]">
          Directory › Course
        </p>

        <div className="flex items-start gap-3">
          <Link
            href="/admin/course-directory"
            className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E9FBEF] text-[#006B3F]"
          >
            <ArrowLeft className="size-5" />
          </Link>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight text-[#202420]">
            Student Enrollment:{" "}
            <span className="text-[#006B3F]">
              Master Italian for Professional Environments
            </span>
          </h1>
        </div>
      </div>

      <Button size="lg" className="gap-3 px-8 shadow-lg shadow-[#006B3F]/25">
        <UserCog className="size-5" />
        Manage Course
      </Button>
    </div>
  );
};

export default CourseDetailsHeader;
