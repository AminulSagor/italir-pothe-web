"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import AddCareerTrackCard from "./add-career-track-card";
import CareerTrackCard from "./career-track-card";

import { getCareerTracks } from "@/service/skill-builder/skill-builder.service";
import type {
  CareerTrackListResponse,
  SkillBuilderCareerTrack,
} from "@/types/skill-builder/skill-builder.type";

interface CareerTrackGridProps {
  refreshKey?: number;
  isCreating?: boolean;
  onCreateTrack: () => void;
  onMutated?: () => void;
}

const CAREER_TRACKS_PER_PAGE = 10;

const initialListResponse: CareerTrackListResponse = {
  items: [],
  page: 1,
  limit: CAREER_TRACKS_PER_PAGE,
  totalItems: 0,
  totalPages: 1,
};

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export default function CareerTrackGrid({
  refreshKey = 0,
  isCreating = false,
  onCreateTrack,
}: CareerTrackGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const careerTrackSearch = searchParams.get("search") || "";

  const [listResponse, setListResponse] =
    useState<CareerTrackListResponse>(initialListResponse);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCareerTracks = async () => {
    try {
      setIsLoading(true);
      setError("");

      const response = await getCareerTracks({
        page: 1,
        limit: CAREER_TRACKS_PER_PAGE,
        search: careerTrackSearch,
      });

      setListResponse(response);
    } catch (loadError) {
      setError(getErrorMessage(loadError));
      setListResponse(initialListResponse);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCareerTracks();
  }, [careerTrackSearch, refreshKey]);

  const handleEditTrack = (track: SkillBuilderCareerTrack) => {
    router.push(
      `/admin/skill-builder-manager/career-track-studio?careerTrackId=${track.id}`,
    );
  };

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div
            key={index}
            className="min-h-[470px] animate-pulse rounded-3xl bg-[#EEF2EE]"
          />
        ))}

        <AddCareerTrackCard isCreating={isCreating} onAdd={onCreateTrack} />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {error ? (
        <div className="rounded-3xl border border-[#F7C6C7] bg-[#FFF8F8] px-6 py-4 text-sm text-[#D92D20]">
          {error}
        </div>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {listResponse.items.map((track) => (
          <CareerTrackCard
            key={track.id}
            track={track}
            onEdit={() => handleEditTrack(track)}
          />
        ))}

        <AddCareerTrackCard isCreating={isCreating} onAdd={onCreateTrack} />
      </div>

      {!error && listResponse.items.length === 0 ? (
        <div className="rounded-3xl border border-[#E5ECE6] bg-white px-6 py-8 text-center text-sm text-[#5F675F]">
          No career tracks found.
        </div>
      ) : null}
    </div>
  );
}
