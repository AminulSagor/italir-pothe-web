import CampaignDetailsCard from "./_components/campaign-details-card";
import ComposerHeader from "./_components/composer-header";
import DevicePreviewCard from "./_components/device-preview-card";
import ScheduleCard from "./_components/schedule-card";
import TargetAudienceCard from "./_components/target-audience-card";

interface PageProps {
    searchParams: Promise<{ mode?: string }>;
}

export default async function CreateNotificationPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const mode = params.mode === "send-now" ? "send-now" : "schedule";

    return (
        <div className="space-y-6">
            <ComposerHeader />

            <ScheduleCard mode={mode} />

            <TargetAudienceCard showDropdown={mode === "send-now"} />

            <div className="grid gap-6 xl:grid-cols-[1fr_300px]">
                <CampaignDetailsCard />
                <DevicePreviewCard />
            </div>
        </div>
    );
}