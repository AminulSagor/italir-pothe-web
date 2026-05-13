import CourseDirectoryFilters from "./_components/course-directory-filters";
import CourseDirectoryHeader from "./_components/course-directory-header";
import CourseDirectoryStats from "./_components/course-directory-stats";
import CourseDirectoryTable from "./_components/course-directory-table";

const CourseDirectoryPage = () => {
  return (
    <section className="space-y-7">
      <CourseDirectoryHeader />
      <CourseDirectoryStats />
      <CourseDirectoryFilters />
      <CourseDirectoryTable />
    </section>
  );
};

export default CourseDirectoryPage;
