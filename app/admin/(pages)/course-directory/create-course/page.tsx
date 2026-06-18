import CreateCourseForm from "./_components/create-course-form";

interface CreateCoursePageProps {
  searchParams: Promise<{
    courseId?: string;
  }>;
}

const CreateCoursePage = async ({ searchParams }: CreateCoursePageProps) => {
  const resolvedSearchParams = await searchParams;

  return <CreateCourseForm courseId={resolvedSearchParams.courseId || ""} />;
};

export default CreateCoursePage;
