"use client";

import { ClipboardCheck, Loader2 } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

import type {
  EvaluationFormErrors,
  EvaluationFormState,
} from "./evaluation-form.type";

interface ManualScoresCardProps {
  autoScoreOutOfTen: number;
  hasWritingTask: boolean;
  hasSpeakingTask: boolean;

  form: EvaluationFormState;
  errors: EvaluationFormErrors;

  isSubmitting: boolean;

  onChange: <Key extends keyof EvaluationFormState>(
    key: Key,
    value: EvaluationFormState[Key],
  ) => void;

  onSubmit: () => void;
}

export default function ManualScoresCard({
  autoScoreOutOfTen,
  hasWritingTask,
  hasSpeakingTask,
  form,
  errors,
  isSubmitting,
  onChange,
  onSubmit,
}: ManualScoresCardProps) {
  const manualScores = [
    {
      key: "vocabularyUsageScore" as const,

      label: "Vocabulary Usage",

      value: form.vocabularyUsageScore,

      error: errors.vocabularyUsageScore,
    },
    {
      key: "grammarAccuracyScore" as const,

      label: "Grammar Accuracy",

      value: form.grammarAccuracyScore,

      error: errors.grammarAccuracyScore,
    },
    {
      key: "fluencyPronunciationScore" as const,

      label: "Fluency & Pronunciation",

      value: form.fluencyPronunciationScore,

      error: errors.fluencyPronunciationScore,
    },
  ];

  const manualValues = [
    hasWritingTask ? Number(form.writingScore || 0) * 10 : null,

    hasSpeakingTask ? Number(form.speakingScore || 0) * 10 : null,
  ].filter(
    (value): value is number => value !== null && Number.isFinite(value),
  );

  const finalAverage = manualValues.length
    ? manualValues.reduce((total, value) => total + value, 0) /
      manualValues.length
    : 0;

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-7 flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#FCEBEC]">
          <ClipboardCheck className="size-5 text-[#B42318]" />
        </div>

        <h2 className="text-xl font-bold text-[#202420]">Manual Scores</h2>
      </div>

      <div className="mb-8 rounded-full bg-[#F1F4EF] px-5 py-4">
        <p className="text-xs font-bold uppercase tracking-wide text-[#8A948D]">
          Core Quiz & Listening
        </p>

        <div className="flex items-center justify-between">
          <span className="text-sm text-[#202420]">Auto-Graded</span>

          <strong className="text-3xl text-[#007A35]">
            {autoScoreOutOfTen}

            <span className="text-sm font-medium text-[#8A948D]"> /10</span>
          </strong>
        </div>
      </div>

      <div className="space-y-6">
        {manualScores.map((score) => (
          <label key={score.key} className="block">
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm font-bold text-[#3F4842]">{score.label}</p>

              <input
                type="number"
                min={0}
                max={100}
                step={1}
                value={score.value}
                disabled={isSubmitting}
                onChange={(event) => onChange(score.key, event.target.value)}
                className="size-14 rounded-full border border-[#C9D4CC] bg-[#F8FBF8] text-center text-base font-bold text-[#006B3F] outline-none"
              />
            </div>

            {score.error && (
              <p className="mt-2 text-xs text-[#D92D20]">{score.error}</p>
            )}
          </label>
        ))}
      </div>

      {(hasWritingTask || hasSpeakingTask) && (
        <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          {hasWritingTask && (
            <ScoreOutOfTenField
              label="Writing Score"
              value={form.writingScore}
              error={errors.writingScore}
              disabled={isSubmitting}
              onChange={(value) => onChange("writingScore", value)}
            />
          )}

          {hasSpeakingTask && (
            <ScoreOutOfTenField
              label="Speaking Score"
              value={form.speakingScore}
              error={errors.speakingScore}
              disabled={isSubmitting}
              onChange={(value) => onChange("speakingScore", value)}
            />
          )}
        </div>
      )}

      <div className="my-8 h-px bg-[#E6ECE7]" />

      <div className="space-y-5">
        <TextAreaField
          label="Teacher Comment"
          required
          value={form.teacherComment}
          error={errors.teacherComment}
          disabled={isSubmitting}
          onChange={(value) => onChange("teacherComment", value)}
        />

        <TextAreaField
          label="Teacher Comment (Bangla)"
          value={form.teacherCommentBn}
          disabled={isSubmitting}
          onChange={(value) => onChange("teacherCommentBn", value)}
        />

        <TextAreaField
          label="Key Strength"
          value={form.keyStrength}
          disabled={isSubmitting}
          onChange={(value) => onChange("keyStrength", value)}
        />

        <TextAreaField
          label="Critical Gap"
          value={form.criticalGap}
          disabled={isSubmitting}
          onChange={(value) => onChange("criticalGap", value)}
        />

        <label className="block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
            Final Verdict
            <span className="ml-1 text-[#D92D20]">*</span>
          </span>

          <select
            value={form.verdict}
            disabled={isSubmitting}
            onChange={(event) =>
              onChange(
                "verdict",
                event.target.value as EvaluationFormState["verdict"],
              )
            }
            className="h-12 w-full rounded-full bg-[#F1F4EF] px-5 text-sm outline-none"
          >
            <option value="">Select verdict</option>

            <option value="passed">Passed</option>

            <option value="retake_required">Retake Required</option>

            <option value="failed">Failed</option>
          </select>

          {errors.verdict && (
            <p className="mt-2 text-xs text-[#D92D20]">{errors.verdict}</p>
          )}
        </label>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <NumberField
            label="Evaluation Duration (Minutes)"
            value={form.evaluationDurationMinutes}
            min={0}
            disabled={isSubmitting}
            onChange={(value) => onChange("evaluationDurationMinutes", value)}
          />

          <NumberField
            label="Score Reliability (%)"
            value={form.scoreReliabilityPercent}
            min={0}
            max={100}
            disabled={isSubmitting}
            onChange={(value) => onChange("scoreReliabilityPercent", value)}
          />
        </div>
      </div>

      <div className="my-8 h-px bg-[#E6ECE7]" />

      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-xs font-bold uppercase text-[#006B3F]">
          Final Average Score
        </p>

        <span className="rounded-full bg-[#DDF3E8] px-3 py-1 text-xs font-bold text-[#006B3F]">
          Calculated
        </span>
      </div>

      <div className="mb-7 rounded-2xl bg-[#006B3F] p-6 text-white">
        <p className="text-base">Manual Performance</p>

        <p className="mt-1 text-3xl font-bold">
          {Number(finalAverage.toFixed(2))}

          <span className="text-base font-medium"> /100</span>
        </p>
      </div>

      <Button
        fullWidth
        size="lg"
        disabled={isSubmitting}
        onClick={onSubmit}
        className="bg-[#59F94D] !text-[#006B3F] hover:!bg-[#48E93E]"
      >
        {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
        Give Final Verdict
      </Button>
    </Card>
  );
}

function ScoreOutOfTenField({
  label,
  value,
  error,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  disabled: boolean;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}
      </span>

      <div className="flex h-12 items-center rounded-full bg-[#F1F4EF] px-5">
        <input
          type="number"
          min={0}
          max={10}
          step={0.1}
          value={value}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className="min-w-0 flex-1 bg-transparent text-sm outline-none"
        />

        <span className="text-xs font-semibold text-[#8A948D]">/10</span>
      </div>

      {error && <p className="mt-2 text-xs text-[#D92D20]">{error}</p>}
    </label>
  );
}

function TextAreaField({
  label,
  value,
  error,
  required = false,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  error?: string;
  required?: boolean;
  disabled: boolean;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}

        {required && <span className="ml-1 text-[#D92D20]">*</span>}
      </span>

      <textarea
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-24 w-full resize-none rounded-[1.5rem] bg-[#F1F4EF] p-4 text-sm outline-none"
      />

      {error && <p className="mt-2 text-xs text-[#D92D20]">{error}</p>}
    </label>
  );
}

function NumberField({
  label,
  value,
  min,
  max,
  disabled,
  onChange,
}: {
  label: string;
  value: string;
  min: number;
  max?: number;
  disabled: boolean;

  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-bold uppercase text-[#66736A]">
        {label}
      </span>

      <input
        type="number"
        min={min}
        max={max}
        step={1}
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full bg-[#F1F4EF] px-5 text-sm outline-none"
      />
    </label>
  );
}
