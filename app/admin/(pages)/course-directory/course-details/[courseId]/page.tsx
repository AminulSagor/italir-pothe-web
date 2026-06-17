import CourseDetailsContent from "./_components/course-details-content";

interface CourseDetailsPageProps {
  params: {
    courseId: string;
  };
}

const CourseDetailsPage = ({ params }: CourseDetailsPageProps) => {
  return <CourseDetailsContent courseId={params.courseId} />;
};

export default CourseDetailsPage;
