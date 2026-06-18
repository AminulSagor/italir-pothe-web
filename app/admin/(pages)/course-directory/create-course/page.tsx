import { Suspense } from "react";

import CreateCourseForm from "./_components/create-course-form";

const CreateCourseLoading = () => {
  return (
    <div className="flex min-h-[420px] items-center justify-center text-sm text-[#66736B]">
      Loading course setup...
    </div>
  );
};

const CreateCoursePage = () => {
  return (
    <Suspense fallback={<CreateCourseLoading />}>
      <CreateCourseForm />
    </Suspense>
  );
};

export default CreateCoursePage;
