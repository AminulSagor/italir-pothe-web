"use client";

import { useCallback, useEffect, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  createDirectChat,
  getAdminUserDetails,
  updateAdminUserRestriction,
} from "@/service/user-directory/user-directory.service";
import type { AdminUserDetailsResponse } from "@/types/user-directory/user-directory.type";

import RestrictionConfirmDialog from "../../_components/restriction-confirm-dialog";
import ActivityAnalyticsCard from "./activity-analytics-card";
import EnrolledCoursesCard from "./enrolled-courses-card";
import ExamResultsCard from "./exam-results-card";
import UserDetailsHeader from "./user-details-header";
import UserProfileCard from "./user-profile-card";

interface UserDetailsClientProps {
  userId: string;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Something went wrong. Please try again.";
};

export default function UserDetailsClient({ userId }: UserDetailsClientProps) {
  const router = useRouter();

  const [details, setDetails] = useState<AdminUserDetailsResponse | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [loadError, setLoadError] = useState("");

  const [restrictionOpen, setRestrictionOpen] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadDetails = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError("");

      const response = await getAdminUserDetails(userId);

      setDetails(response);
    } catch (error) {
      const message = getErrorMessage(error);

      setLoadError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    let mounted = true;

    const fetchDetails = async () => {
      try {
        const response = await getAdminUserDetails(userId);

        if (!mounted) return;

        setDetails(response);
        setLoadError("");
      } catch (error) {
        if (!mounted) return;

        const message = getErrorMessage(error);

        setLoadError(message);
        toast.error(message);
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchDetails();

    return () => {
      mounted = false;
    };
  }, [userId]);

  const handleRestrictionConfirm = async () => {
    if (!details) return;

    const shouldRestrict = !details.user.isRestricted;

    const toastId = toast.loading(
      shouldRestrict
        ? "Restricting user account..."
        : "Restoring user account...",
    );

    try {
      setIsSubmitting(true);

      const response = await updateAdminUserRestriction(userId, {
        isBanned: shouldRestrict,
      });

      setRestrictionOpen(false);

      await loadDetails();

      toast.success(response.message, {
        id: toastId,
      });
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMessage = async () => {
    if (!details) return;

    const toastId = toast.loading("Opening direct conversation...");

    try {
      const response = await createDirectChat(details.user.id);

      toast.success(
        response.message ||
          `Direct conversation with ${details.user.fullName} is ready.`,
        {
          id: toastId,
        },
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    }
  };

  if (isLoading && !details) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-secondary" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="mx-auto flex min-h-[480px] w-full max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h1 className="mt-5 text-2xl font-bold text-black/85">
          User details unavailable
        </h1>

        <p className="mt-3 max-w-lg text-black/55">{loadError}</p>

        <button
          type="button"
          onClick={() => router.push("/admin/user-directory")}
          className="mt-7 rounded-full bg-secondary px-8 py-3 font-semibold text-white"
        >
          Back to User Directory
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto w-full max-w-[1120px] space-y-8">
        <UserDetailsHeader
          onBack={() => router.push("/admin/user-directory")}
        />

        <UserProfileCard
          user={details.user}
          onGiftReward={() =>
            router.push(
              `/admin/league-gamification/reward-configuration?userId=${encodeURIComponent(
                details.user.id,
              )}`,
            )
          }
          onMessage={() => void handleMessage()}
          onToggleRestriction={() => setRestrictionOpen(true)}
        />

        <div className="grid gap-7 xl:grid-cols-2">
          <ExamResultsCard
            userId={details.user.id}
            initialResponse={details.examResults}
          />

          <EnrolledCoursesCard
            userId={details.user.id}
            initialResponse={details.enrolledCourses}
          />
        </div>

        <ActivityAnalyticsCard
          userId={details.user.id}
          initialAnalytics={details.activityAnalytics}
        />
      </div>

      <RestrictionConfirmDialog
        open={restrictionOpen}
        user={{
          fullName: details.user.fullName,

          isRestricted: details.user.isRestricted,
        }}
        isSubmitting={isSubmitting}
        onClose={() => setRestrictionOpen(false)}
        onConfirm={handleRestrictionConfirm}
      />
    </>
  );
}
