"use client";

import Card from "@/components/UI/cards/card";

const audienceOptions = [
  {
    label: "All Users",
    value: "all-users",
    courseIds: [] as string[],
  },
  {
    label: "Beginner (A1-A2)",
    value: "beginner",
    courseIds: ["beginner"],
  },
  {
    label: "Intermediate (B1+)",
    value: "intermediate",
    courseIds: ["intermediate"],
  },
];

type AudienceSettingsCardProps = {
  courseIds: string[];
  onCourseIdsChange: (courseIds: string[]) => void;
};

const AudienceSettingsCard = ({
  courseIds,
  onCourseIdsChange,
}: AudienceSettingsCardProps) => {
  const selectedAudience =
    audienceOptions.find(
      (item) => item.courseIds.join(",") === courseIds.join(","),
    )?.value || "all-users";

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
          {audienceOptions.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => onCourseIdsChange(item.courseIds)}
              className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
                selectedAudience === item.value
                  ? "bg-white text-[#006B3F] shadow-sm"
                  : "text-[#66736B]"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default AudienceSettingsCard;
