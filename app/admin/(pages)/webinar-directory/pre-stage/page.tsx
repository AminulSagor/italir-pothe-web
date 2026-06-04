"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import PreStageStudio from "./_components/pre-stage-studio";
import WebinarDetailsCard from "./_components/webinar-details-card";
import {
  getAdminWebinarById,
  startWebinar,
} from "@/service/webinar/webinar";
import type { WebinarItem } from "@/types/webinar/webinar_type";

const fallbackText = "Not available";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export default function WebinarPreStagePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webinarId = searchParams.get("id");

  const [webinar, setWebinar] = useState<WebinarItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!webinarId) {
      setError("Webinar id is missing.");
      setIsLoading(false);
      return;
    }

    const loadWebinar = async () => {
      try {
        setIsLoading(true);
        setError("");
        setWebinar(await getAdminWebinarById(webinarId));
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    loadWebinar();
  }, [webinarId]);

  const handleStartWebinar = async () => {
    if (!webinarId) return;

    try {
      setIsStarting(true);
      setError("");
      await startWebinar(webinarId);
      router.push(`/admin/webinar-directory/handle?id=${webinarId}`);
    } catch (startError) {
      setError(getErrorMessage(startError));
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F8F2] px-6 py-5">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-7 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex size-10 items-center justify-center rounded-full bg-white text-[#007A4D] shadow-sm"
            >
              <ArrowLeft className="size-5" />
            </button>
            <p className="text-sm font-semibold text-[#007A4D]">
              Webinar Pre Stage
            </p>
          </div>

          <button
            type="button"
            disabled={!webinarId || isStarting || isLoading}
            onClick={handleStartWebinar}
            className="rounded-full bg-[#007A4D] px-9 py-4 text-xs font-bold uppercase tracking-wide text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isStarting ? "Starting..." : "Start Webinar"}
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#007A4D]">
            Webinar Staging: {webinar?.title || fallbackText}
          </h1>
          <p className="mt-1 max-w-xl text-sm text-[#4E5A52]">
            Verify your audio, video, and connection stability before going live
            to your students and followers.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-[#66736B] shadow-sm">
            Loading webinar details...
          </div>
        ) : (
          <>
            <PreStageStudio />
            <WebinarDetailsCard webinar={webinar} />
          </>
        )}
      </div>
    </main>
  );
}
