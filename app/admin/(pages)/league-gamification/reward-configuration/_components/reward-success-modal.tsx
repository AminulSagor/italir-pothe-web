import { Check } from "lucide-react";

import type { CreateLeaderboardRewardResponse } from "@/types/leaderboard/leaderboard.type";

interface RewardSuccessModalProps {
  isOpen: boolean;

  response: CreateLeaderboardRewardResponse | null;

  recipientName: string;

  onBackToLeaderboard: () => void;
  onViewDetails: () => void;
}

export default function RewardSuccessModal({
  isOpen,
  response,
  recipientName,
  onBackToLeaderboard,
  onViewDetails,
}: RewardSuccessModalProps) {
  if (!isOpen || !response) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/20 p-4 backdrop-blur-sm">
      <div className="w-full max-w-[520px] rounded-[4rem] bg-white px-10 py-14 text-center shadow-2xl">
        <div className="mx-auto flex size-28 items-center justify-center rounded-[2rem] bg-[#DFF3F0]">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#5AF256] text-white">
            <Check className="size-8 stroke-[4]" />
          </div>
        </div>

        <h2 className="mt-10 text-2xl font-bold leading-tight text-deep-green">
          {response.notificationMessage
            ? "Gift Notification Sent"
            : "Reward Created"}
        </h2>

        <p className="mx-auto mt-6 max-w-[390px] text-xl leading-8 text-black/60">
          {response.reward.title} was successfully issued to {recipientName}.
          The reward status is now {response.reward.status.replace(/_/g, " ")}.
        </p>

        {response.notificationMessage && (
          <p className="mx-auto mt-4 max-w-[390px] text-sm leading-6 text-black/45">
            {response.notificationMessage}
          </p>
        )}

        <button
          type="button"
          onClick={onBackToLeaderboard}
          className="mt-12 flex h-16 w-full items-center justify-center rounded-full bg-secondary text-xl font-bold text-white shadow-lg shadow-green-900/20"
        >
          Back to Leaderboard
        </button>

        <button
          type="button"
          onClick={onViewDetails}
          className="mt-7 text-lg text-black/60"
        >
          View Transaction Details
        </button>
      </div>
    </div>
  );
}
