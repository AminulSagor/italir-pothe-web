"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import CareerTrackGrid from "./career-track-grid";
import SkillBuilderHeader from "./skill-builder-header";

const CAREER_TRACK_STUDIO_PATH =
  "/admin/skill-builder-manager/career-track-studio";

export default function SkillBuilderManagerContent() {
  const router = useRouter();

  const [refreshKey, setRefreshKey] = useState(0);
  const [isOpeningCreate, setIsOpeningCreate] = useState(false);

  const handleCreateTrack = () => {
    setIsOpeningCreate(true);
    router.push(`${CAREER_TRACK_STUDIO_PATH}?mode=create`);
  };

  return (
    <section className="space-y-10">
      <SkillBuilderHeader
        isCreating={isOpeningCreate}
        onCreateTrack={handleCreateTrack}
      />

      <CareerTrackGrid
        refreshKey={refreshKey}
        isCreating={isOpeningCreate}
        onCreateTrack={handleCreateTrack}
        onMutated={() => setRefreshKey((currentValue) => currentValue + 1)}
      />
    </section>
  );
}
