import { ArrowRight, Boxes } from "lucide-react";
import Link from "next/link";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

interface SyllabusBuilderCardProps {
  courseId?: string;
}

const SyllabusBuilderCard = ({ courseId }: SyllabusBuilderCardProps) => {
  const href = courseId
    ? `/admin/course-directory/syllabus-builder?courseId=${courseId}`
    : "/admin/course-directory/syllabus-builder";

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex items-start gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#F7E7F8]">
          <Boxes className="size-6 text-[#B0439F]" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-[#202420]">
            Syllabus Builder
          </h2>
          <p className="text-sm text-black/55">
            Organize your lessons, modules, and learning paths
          </p>
        </div>
      </div>

      <p className="mb-6 text-sm leading-6 text-black/65">
        Map out your educational journey. Define units, attach resources, and
        set prerequisite requirements for each module in your course.
      </p>

      <Link href={href}>
        <Button size="lg" className="gap-2 px-10">
          Enter Syllabus Architect
          <ArrowRight className="size-4" />
        </Button>
      </Link>
    </Card>
  );
};

export default SyllabusBuilderCard;
