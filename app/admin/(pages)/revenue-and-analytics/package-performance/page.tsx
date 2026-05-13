import PackagePerformanceStats from "./_components/package-performance-stats";
import PackagePerformanceTable from "./_components/package-performance-table";

const PackagePerformancePage = () => {
  return (
    <section className="space-y-7">
      <h1 className="text-3xl font-bold text-[#006B3F]">
        Package Performance Overview
      </h1>

      <PackagePerformanceStats />
      <PackagePerformanceTable />
    </section>
  );
};

export default PackagePerformancePage;
