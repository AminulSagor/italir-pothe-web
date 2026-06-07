"use client";

import Card from "@/components/UI/cards/card";

type AudienceSettingsCardProps = {
  courseIds: string[];
  onCourseIdsChange: (courseIds: string[]) => void;
};

const AudienceSettingsCard = ({
  courseIds: _courseIds,
  onCourseIdsChange,
}: AudienceSettingsCardProps) => {
  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <h3 className="mb-5 text-lg font-semibold text-[#202420]">
        Audience Settings
      </h3>

      <div className="space-y-3">
        <label className="text-sm font-medium text-[#202420]">
          Target Audience
        </label>

        <div className="rounded-3xl bg-[#F6F8F5] p-2">
          <button
            type="button"
            onClick={() => onCourseIdsChange([])}
            className="w-full rounded-2xl bg-white px-4 py-3 text-left text-sm font-medium text-[#006B3F] shadow-sm transition"
          >
            All Users
          </button>
        </div>
      </div>
    </Card>
  );
};

export default AudienceSettingsCard;
