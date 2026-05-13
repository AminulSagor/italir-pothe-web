import CoursePerformanceStats from "@/app/admin/(pages)/revenue-and-analytics/course-performance/_components/course-performance-stats";
import MasterSalesTable from "@/app/admin/(pages)/revenue-and-analytics/course-performance/_components/master-sales-table";

const CoursePerformancePage = () => {
  return (
    <section className="space-y-7">
      <h1 className="text-3xl font-bold text-[#006B3F]">
        Course Performance Overview
      </h1>

      <CoursePerformanceStats />
      <MasterSalesTable />
    </section>
  );
};

export default CoursePerformancePage;
