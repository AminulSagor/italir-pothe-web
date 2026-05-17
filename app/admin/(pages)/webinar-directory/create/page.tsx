import AudienceSettingsCard from "./_components/audience-settings-card";
import PublishCard from "./_components/publish-card";
import WebinarContentForm from "./_components/webinar-content-form";

const Page = () => {
  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
      <WebinarContentForm />

      <div className="space-y-6">
        <AudienceSettingsCard />
        <PublishCard />
      </div>
    </div>
  );
};

export default Page;
