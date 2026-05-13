import CafCourseAllocation from "./_components/caf-course-allocation";
import LiveAppPreview from "./_components/live-app-preview";
import ServicesDataTable from "./_components/services-data-table";

export default function CafServicePage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold text-deep-green">
                CAF Service Management
            </h1>

            <CafCourseAllocation />
            <LiveAppPreview />
            <ServicesDataTable />
        </div>
    );
}