import {
  Award,
  BookOpen,
  ChevronDown,
  FileDown,
  Gift,
  ImageIcon,
  Link2,
} from "lucide-react";

import type {
  LeaderboardRewardType,
  RewardAssetTypeConfiguration,
} from "@/types/leaderboard/leaderboard.type";

import type {
  RewardConfigurationErrors,
  RewardConfigurationFormState,
} from "./reward-configuration.types";

interface PrizeDetailsCardProps {
  assetTypes: RewardAssetTypeConfiguration[];
  selectedAssetType?: RewardAssetTypeConfiguration;

  form: RewardConfigurationFormState;
  errors: RewardConfigurationErrors;

  disabled?: boolean;

  onRewardTypeChange: (rewardType: LeaderboardRewardType) => void;

  onChange: <Key extends keyof RewardConfigurationFormState>(
    key: Key,
    value: RewardConfigurationFormState[Key],
  ) => void;
}

const formatRewardType = (rewardType: string) => {
  return rewardType
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

export default function PrizeDetailsCard({
  assetTypes,
  selectedAssetType,
  form,
  errors,
  disabled = false,
  onRewardTypeChange,
  onChange,
}: PrizeDetailsCardProps) {
  const isPhysical =
    form.rewardType === "physical_prize" || form.rewardType === "physical_gift";

  const isAiPackage = form.rewardType === "ai_package";

  const isSingleAmount = ["streak_freeze", "cv_credits", "xp"].includes(
    form.rewardType,
  );

  const isCourseAccess = form.rewardType === "course_access";

  const isDownloadable = form.rewardType === "downloadable_file";

  const isCertificate = form.rewardType === "certificate";

  const isBadge = form.rewardType === "badge";

  return (
    <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-secondary text-white">
          <Gift className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-black/90">Prize Details</h2>
      </div>

      <div className="mt-8">
        <FieldLabel required>Asset Type</FieldLabel>

        <div className="relative">
          <select
            value={form.rewardType}
            disabled={disabled}
            onChange={(event) =>
              onRewardTypeChange(event.target.value as LeaderboardRewardType)
            }
            className="h-14 w-full appearance-none rounded-full bg-[#EEF3EC] px-6 pr-14 text-base text-black/75 outline-none disabled:cursor-not-allowed disabled:opacity-60"
          >
            {assetTypes.map((assetType) => (
              <option key={assetType.rewardType} value={assetType.rewardType}>
                {assetType.label || formatRewardType(assetType.rewardType)}
              </option>
            ))}
          </select>

          <ChevronDown className="pointer-events-none absolute right-6 top-1/2 size-5 -translate-y-1/2 text-black/45" />
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <TextField
          label="Reward Title"
          required
          value={form.title}
          maxLength={180}
          placeholder="Enter reward title"
          disabled={disabled}
          error={errors.title}
          onChange={(value) => onChange("title", value)}
        />

        <TextField
          label="Subtitle"
          value={form.subtitle}
          maxLength={300}
          placeholder="Optional short subtitle"
          disabled={disabled}
          error={errors.subtitle}
          onChange={(value) => onChange("subtitle", value)}
        />
      </div>

      {(isAiPackage || isSingleAmount) && (
        <div className="mt-6">
          <FieldLabel required>Reward Value / Quantity</FieldLabel>

          <div className={isAiPackage ? "grid gap-4 sm:grid-cols-2" : ""}>
            <AmountField
              value={form.primaryAmount}
              unit={
                selectedAssetType?.primaryUnit ||
                (form.rewardType === "xp"
                  ? "XP"
                  : form.rewardType === "cv_credits"
                    ? "Credits"
                    : form.rewardType === "streak_freeze"
                      ? "Units"
                      : "Tokens")
              }
              disabled={disabled}
              error={errors.primaryAmount}
              onChange={(value) => onChange("primaryAmount", value)}
            />

            {isAiPackage && (
              <AmountField
                value={form.secondaryAmount}
                unit={selectedAssetType?.secondaryUnit || "Minutes"}
                disabled={disabled}
                error={errors.secondaryAmount}
                onChange={(value) => onChange("secondaryAmount", value)}
              />
            )}
          </div>
        </div>
      )}

      {isCourseAccess && (
        <div className="mt-6">
          <ResourceField
            icon={<BookOpen className="size-5" />}
            label="Course Resource ID"
            required
            value={form.relatedResourceId}
            placeholder="Enter the course UUID"
            disabled={disabled}
            error={errors.relatedResourceId}
            onChange={(value) => onChange("relatedResourceId", value)}
          />
        </div>
      )}

      {isDownloadable && (
        <div className="mt-6">
          <ResourceField
            icon={<FileDown className="size-5" />}
            label="Downloadable File URL"
            required
            value={form.fileUrl}
            placeholder="https://example.com/reward-file.pdf"
            disabled={disabled}
            error={errors.fileUrl}
            onChange={(value) => onChange("fileUrl", value)}
          />
        </div>
      )}

      {isCertificate && (
        <div className="mt-6 space-y-5 rounded-[2rem] bg-[#F7FAF6] p-5">
          <p className="text-sm leading-6 text-black/55">
            Provide either an existing certificate resource UUID or a direct
            certificate file URL.
          </p>

          <ResourceField
            icon={<Award className="size-5" />}
            label="Certificate Resource ID"
            value={form.relatedResourceId}
            placeholder="Enter the certificate UUID"
            disabled={disabled}
            error={errors.relatedResourceId}
            onChange={(value) => onChange("relatedResourceId", value)}
          />

          <ResourceField
            icon={<FileDown className="size-5" />}
            label="Certificate File URL"
            value={form.fileUrl}
            placeholder="https://example.com/certificate.pdf"
            disabled={disabled}
            error={errors.fileUrl}
            onChange={(value) => onChange("fileUrl", value)}
          />

          {errors.certificateResource && (
            <ErrorText message={errors.certificateResource} />
          )}
        </div>
      )}

      {(isPhysical || isBadge) && (
        <div className="mt-7">
          <FieldLabel required={isPhysical}>
            {isPhysical ? "Prize Photo URL" : "Badge Image URL"}
          </FieldLabel>

          <div className="rounded-[2rem] border-2 border-dashed border-[#B8C9BA] bg-[#F8FAF6] p-6">
            <div className="flex flex-col items-center text-center">
              <ImageIcon className="size-7 text-black/45" />

              <p className="mt-3 text-sm text-black/55">
                Use the public image URL returned by your file-upload system.
              </p>
            </div>

            <div className="mt-5 flex h-14 items-center gap-3 rounded-full bg-white px-5">
              <Link2 className="size-4 shrink-0 text-secondary" />

              <input
                type="text"
                value={form.imageUrl}
                disabled={disabled}
                maxLength={1200}
                placeholder="https://example.com/reward-image.jpg"
                onChange={(event) => onChange("imageUrl", event.target.value)}
                className="w-full bg-transparent text-sm outline-none placeholder:text-black/30 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          {errors.imageUrl && <ErrorText message={errors.imageUrl} />}
        </div>
      )}

      <div className="mt-6">
        <FieldLabel
          required={selectedAssetType?.requiredFields.includes(
            "congratulatoryNote",
          )}
        >
          Congratulatory Note
        </FieldLabel>

        <textarea
          value={form.congratulatoryNote}
          disabled={disabled}
          maxLength={1500}
          placeholder="Write a personalized short message for the student..."
          onChange={(event) =>
            onChange("congratulatoryNote", event.target.value)
          }
          className="min-h-[130px] w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-6 text-base leading-7 outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {errors.congratulatoryNote && (
          <ErrorText message={errors.congratulatoryNote} />
        )}
      </div>

      <div className="mt-6">
        <FieldLabel>Reason Earned</FieldLabel>

        <textarea
          value={form.earnedReason}
          disabled={disabled}
          maxLength={1500}
          placeholder="Explain why this learner earned the reward..."
          onChange={(event) => onChange("earnedReason", event.target.value)}
          className="min-h-[110px] w-full resize-none rounded-[2rem] bg-[#EEF3EC] p-6 text-base leading-7 outline-none placeholder:text-black/40 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {errors.earnedReason && <ErrorText message={errors.earnedReason} />}
      </div>
    </section>
  );
}

function FieldLabel({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <p className="mb-3 text-xs font-bold uppercase text-black/35">
      {children}

      {required && <span className="ml-1 text-[#D92D20]">*</span>}
    </p>
  );
}

function TextField({
  label,
  value,
  placeholder,
  maxLength,
  required = false,
  disabled = false,
  error,
  onChange,
}: {
  label: string;
  value: string;
  placeholder: string;
  maxLength: number;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <FieldLabel required={required}>{label}</FieldLabel>

      <input
        type="text"
        value={value}
        maxLength={maxLength}
        disabled={disabled}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-full bg-[#EEF3EC] px-6 text-base text-black/75 outline-none placeholder:text-black/35 disabled:cursor-not-allowed disabled:opacity-60"
      />

      {error && <ErrorText message={error} />}
    </label>
  );
}

function AmountField({
  value,
  unit,
  disabled = false,
  error,
  onChange,
}: {
  value: string;
  unit: string;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <div className="flex h-14 items-center justify-between rounded-full bg-[#EEF3EC] px-6">
        <input
          type="number"
          min={1}
          step={1}
          value={value}
          disabled={disabled}
          placeholder="0"
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-base text-black/75 outline-none placeholder:text-black/30 disabled:cursor-not-allowed"
        />

        <span className="ml-3 text-xs font-semibold uppercase text-black/35">
          {unit}
        </span>
      </div>

      {error && <ErrorText message={error} />}
    </div>
  );
}

function ResourceField({
  icon,
  label,
  value,
  placeholder,
  required = false,
  disabled = false,
  error,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  placeholder: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <FieldLabel required={required}>{label}</FieldLabel>

      <div className="flex h-14 items-center gap-3 rounded-full bg-[#EEF3EC] px-5 text-secondary">
        {icon}

        <input
          type="text"
          value={value}
          disabled={disabled}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm text-black/75 outline-none placeholder:text-black/30 disabled:cursor-not-allowed"
        />
      </div>

      {error && <ErrorText message={error} />}
    </label>
  );
}

function ErrorText({ message }: { message: string }) {
  return <p className="mt-2 text-xs font-medium text-[#D92D20]">{message}</p>;
}
