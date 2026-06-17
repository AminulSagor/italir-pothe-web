import { Suspense } from "react";

import CreateCourseForm from "./_components/create-course-form";

const CreateCoursePage = () => {
  return (
    <Suspense fallback={null}>
      <CreateCourseForm />
    </Suspense>
  );
};

export default CreateCoursePage;
