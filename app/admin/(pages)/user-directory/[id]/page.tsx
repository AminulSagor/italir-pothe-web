import ActivityAnalyticsCard from "./_components/activity-analytics-card";
import EnrolledCoursesCard from "./_components/enrolled-courses-card";
import ExamResultsCard from "./_components/exam-results-card";
import UserDetailsHeader from "./_components/user-details-header";
import UserProfileCard from "./_components/user-profile-card";

export default function UserDetailsPage() {
    return (
        <div className="mx-auto w-full max-w-[1120px] space-y-8">
            <UserDetailsHeader />

            <UserProfileCard />

            <div className="grid gap-7 xl:grid-cols-2">
                <ExamResultsCard />
                <EnrolledCoursesCard />
            </div>

            <ActivityAnalyticsCard />
        </div>
    );
}