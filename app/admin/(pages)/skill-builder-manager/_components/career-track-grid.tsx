"use client";

import { useState } from "react";

import CareerTrackCard from "./career-track-card";
import AddCareerTrackCard from "./add-career-track-card";

import { careerTracksMock } from "@/mock/skill-builder-manager/skill-builder-manager.mock";
import { CareerTrack } from "@/mock/skill-builder-manager/skill-builder-manager.types";

export default function CareerTrackGrid() {
  const [tracks, setTracks] = useState<CareerTrack[]>(careerTracksMock);

  const handleAddTrack = () => {
    const newTrack: CareerTrack = {
      id: Date.now(),
      title: "New Career Track",
      description:
        "Custom language learning path for professional workplace communication.",
      modules: 0,
      sentences: 0,
      updatedAgo: "Just now",
      iconBg: "bg-[#E7EFE7]",
      icon: "✨",
    };

    setTracks((prev) => [...prev, newTrack]);
  };

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {tracks.map((track) => (
        <CareerTrackCard key={track.id} track={track} />
      ))}

      <AddCareerTrackCard onAdd={handleAddTrack} />
    </div>
  );
}
