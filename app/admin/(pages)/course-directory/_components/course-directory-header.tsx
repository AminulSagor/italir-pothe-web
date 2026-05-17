import { Plus } from "lucide-react";
import Button from "@/components/UI/buttons/button";
import Link from "next/link";

const CourseDirectoryHeader = () => {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold text-[#202420]">
          Course Directory Hub
        </h1>
        <p className="mt-1 text-sm text-black/60">
          Manage and monitor all Italiar Pothe educational content.
        </p>
      </div>
      <Link href={"/admin/course-directory/create-course"}>
        <Button size="md" className="gap-2 shadow-lg shadow-[#006B3F]/20">
          <Plus className="size-4" />
          Add New Course
        </Button>
      </Link>
    </div>
  );
};

export default CourseDirectoryHeader;
