import ConnectedModulesCard from "./_components/connected-modules-card";
import MasterIntroductionVideoCard from "./_components/master-introduction-video-card";
import MasterVideoHeader from "./_components/master-video-header";
import TheoryBookResourceCard from "./_components/theory-book-resource-card";

export default function CareerTrackStudioPage() {
  return (
    <div className="space-y-7">
      <MasterVideoHeader />

      <div className="grid grid-cols-1 gap-7 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-7">
          <MasterIntroductionVideoCard />
          <TheoryBookResourceCard />
        </div>

        <ConnectedModulesCard />
      </div>
    </div>
  );
}
