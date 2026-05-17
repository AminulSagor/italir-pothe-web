import CourseDetailsHeader from "./_components/course-details-header";
import CourseDetailsStats from "./_components/course-details-stats";
import EnrollmentListTable from "./_components/enrollment-list-table";

const CourseDetailsPage = () => {
  return (
    <section className="space-y-7">
      <CourseDetailsHeader />
      <CourseDetailsStats />
      <EnrollmentListTable />
    </section>
  );
};

export default CourseDetailsPage;
