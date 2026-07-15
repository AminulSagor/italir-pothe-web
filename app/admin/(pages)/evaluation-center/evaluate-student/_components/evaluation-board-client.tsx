"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2, TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import UnsavedChangesWarningDialog from "@/components/UI/dialogs/unsaved-changes-warning-dialog";
import { useUnsavedChangesWarning } from "@/hooks/use-unsaved-changes-warning";
import {
  getEvaluationDetails,
  getFileSignedReadUrl,
  giveFinalExamVerdict,
} from "@/service/evaluation-center/evaluation-center.service";
import type {
  FinalExamEvaluationAnswer,
  FinalExamEvaluationDetails,
  GiveFinalVerdictPayload,
} from "@/types/evaluation-center/evaluation-center.type";

import AudioPlayerCard from "./audio-player-card";
import BreadcrumbHeader from "./breadcrumb-header";
import type {
  EvaluationFormErrors,
  EvaluationFormState,
} from "./evaluation-form.type";
import EvaluationStatCard from "./evaluation-stat-card";
import ManualScoresCard from "./manual-scores-card";
import StudentSummaryCard from "./student-summary-card";
import WritingTaskCard from "./writing-task-card";

interface EvaluationBoardClientProps {
  attemptId: string;
}

const getErrorMessage = (error: unknown) => {
  return error instanceof Error
    ? error.message
    : "Unable to load the final exam evaluation.";
};

const parseNumericValue = (value: string) => {
  if (!value.trim()) {
    return undefined;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : undefined;
};

const formatDuration = (totalSeconds: number) => {
  const safeSeconds = Math.max(0, Math.floor(totalSeconds));

  const hours = Math.floor(safeSeconds / 3600);

  const minutes = Math.floor((safeSeconds % 3600) / 60);

  const seconds = safeSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }

  return `${seconds}s`;
};

const extractLevel = (details: FinalExamEvaluationDetails) => {
  return (
    `${details.course?.title || ""} ${details.examTemplate?.title || ""}`
      .toUpperCase()
      .match(/\b(A1|A2|B1|B2|C1|C2)\b/)?.[1] || "—"
  );
};

const findAnswer = (
  answers: FinalExamEvaluationAnswer[],
  sectionType: "writing_task" | "speaking_lab",
) => {
  return (
    answers.find(
      (answer) =>
        answer.section?.sectionType === sectionType ||
        (sectionType === "writing_task" &&
          answer.question?.questionFormat === "writing_task") ||
        (sectionType === "speaking_lab" &&
          answer.question?.questionFormat === "speaking_task"),
    ) || null
  );
};

const createInitialForm = (
  details: FinalExamEvaluationDetails,
): EvaluationFormState => {
  return {
    vocabularyUsageScore: String(details.review?.vocabularyUsageScore ?? 0),

    grammarAccuracyScore: String(details.review?.grammarAccuracyScore ?? 0),

    fluencyPronunciationScore: String(
      details.review?.fluencyPronunciationScore ?? 0,
    ),

    writingScore: details.review?.writingScore ?? "",

    speakingScore: details.review?.speakingScore ?? "",

    teacherComment: details.review?.teacherComment ?? "",

    teacherCommentBn: details.review?.teacherCommentBn ?? "",

    keyStrength: details.review?.keyStrength ?? "",

    criticalGap: details.review?.criticalGap ?? "",

    verdict: details.review?.verdict ?? "",

    evaluationDurationMinutes: String(
      details.review?.metric?.evaluationDurationMinutes ?? 0,
    ),

    scoreReliabilityPercent: String(
      details.review?.metric?.scoreReliabilityPercent ?? 98,
    ),
  };
};

const validateScore = (
  value: string,
  min: number,
  max: number,
  label: string,
) => {
  const parsed = Number(value);

  if (
    !value.trim() ||
    !Number.isFinite(parsed) ||
    parsed < min ||
    parsed > max
  ) {
    return `${label} must be between ${min} and ${max}.`;
  }

  return undefined;
};

export default function EvaluationBoardClient({
  attemptId,
}: EvaluationBoardClientProps) {
  const router = useRouter();

  const [details, setDetails] = useState<FinalExamEvaluationDetails | null>(
    null,
  );

  const [form, setForm] = useState<EvaluationFormState | null>(null);

  const [savedForm, setSavedForm] = useState<EvaluationFormState | null>(null);

  const [errors, setErrors] = useState<EvaluationFormErrors>({});

  const [isLoading, setIsLoading] = useState(true);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [loadError, setLoadError] = useState("");

  const [speakingAudioUrl, setSpeakingAudioUrl] = useState<string | null>(null);

  const [isSpeakingAudioLoading, setIsSpeakingAudioLoading] = useState(false);

  const [speakingAudioError, setSpeakingAudioError] = useState("");

  useEffect(() => {
    let mounted = true;

    const loadEvaluation = async () => {
      try {
        const response = await getEvaluationDetails(attemptId);

        const initialForm = createInitialForm(response);

        if (!mounted) return;

        setDetails(response);
        setForm(initialForm);
        setSavedForm(initialForm);

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

    void loadEvaluation();

    return () => {
      mounted = false;
    };
  }, [attemptId]);

  const isDirty = useMemo(() => {
    if (!form || !savedForm) {
      return false;
    }

    return JSON.stringify(form) !== JSON.stringify(savedForm);
  }, [form, savedForm]);

  const unsavedChanges = useUnsavedChangesWarning(isDirty);

  const derived = useMemo(() => {
    if (!details) {
      return null;
    }

    const writingAnswer = findAnswer(details.answers, "writing_task");

    const speakingAnswer = findAnswer(details.answers, "speaking_lab");

    const autoScore = details.autoGrading;

    return {
      level: extractLevel(details),
      writingAnswer,
      speakingAnswer,
      autoScore,
      answeredCount: details.answers.length,
    };
  }, [details]);

  const updateForm = <Key extends keyof EvaluationFormState>(
    key: Key,
    value: EvaluationFormState[Key],
  ) => {
    setForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [key]: value,
      };
    });

    setErrors((current) => ({
      ...current,
      [key]: undefined,
    }));
  };

  useEffect(() => {
    let mounted = true;

    const audioFileId = derived?.speakingAnswer?.audioFileId;

    if (!audioFileId) {
      setSpeakingAudioUrl(null);
      setSpeakingAudioError("");
      setIsSpeakingAudioLoading(false);

      return () => {
        mounted = false;
      };
    }

    const loadSignedAudioUrl = async () => {
      try {
        setIsSpeakingAudioLoading(true);

        setSpeakingAudioError("");
        setSpeakingAudioUrl(null);

        const signedUrl = await getFileSignedReadUrl(audioFileId);

        if (mounted) {
          setSpeakingAudioUrl(signedUrl);
        }
      } catch (error) {
        if (!mounted) return;

        setSpeakingAudioError(
          error instanceof Error
            ? error.message
            : "Unable to load the speaking recording.",
        );
      } finally {
        if (mounted) {
          setIsSpeakingAudioLoading(false);
        }
      }
    };

    void loadSignedAudioUrl();

    return () => {
      mounted = false;
    };
  }, [derived?.speakingAnswer?.audioFileId]);

  const handleSubmit = async () => {
    if (!details || !form || !derived) {
      return;
    }

    const nextErrors: EvaluationFormErrors = {
      vocabularyUsageScore: validateScore(
        form.vocabularyUsageScore,
        0,
        100,
        "Vocabulary usage score",
      ),

      grammarAccuracyScore: validateScore(
        form.grammarAccuracyScore,
        0,
        100,
        "Grammar accuracy score",
      ),

      fluencyPronunciationScore: validateScore(
        form.fluencyPronunciationScore,
        0,
        100,
        "Fluency and pronunciation score",
      ),

      writingScore: derived.writingAnswer
        ? validateScore(form.writingScore, 0, 10, "Writing score")
        : undefined,

      speakingScore: derived.speakingAnswer
        ? validateScore(form.speakingScore, 0, 10, "Speaking score")
        : undefined,

      teacherComment: form.teacherComment.trim()
        ? undefined
        : "Teacher comment is required.",

      verdict: form.verdict ? undefined : "Select a final verdict.",
    };

    const cleanedErrors = Object.fromEntries(
      Object.entries(nextErrors).filter(([, value]) => Boolean(value)),
    ) as EvaluationFormErrors;

    if (Object.keys(cleanedErrors).length > 0) {
      setErrors(cleanedErrors);

      toast.error("Complete the required evaluation fields.");

      return;
    }

    const payload: GiveFinalVerdictPayload = {
      vocabularyUsageScore: Number(form.vocabularyUsageScore),

      grammarAccuracyScore: Number(form.grammarAccuracyScore),

      fluencyPronunciationScore: Number(form.fluencyPronunciationScore),

      teacherComment: form.teacherComment.trim(),

      verdict: form.verdict || "failed",

      evaluationDurationMinutes:
        parseNumericValue(form.evaluationDurationMinutes) ?? 0,

      scoreReliabilityPercent:
        parseNumericValue(form.scoreReliabilityPercent) ?? 98,

      issueCertificate: false,
    };

    if (derived.writingAnswer) {
      payload.writingScore = Number(form.writingScore);
    }

    if (derived.speakingAnswer) {
      payload.speakingScore = Number(form.speakingScore);
    }

    if (form.teacherCommentBn.trim()) {
      payload.teacherCommentBn = form.teacherCommentBn.trim();
    }

    if (form.keyStrength.trim()) {
      payload.keyStrength = form.keyStrength.trim();
    }

    if (form.criticalGap.trim()) {
      payload.criticalGap = form.criticalGap.trim();
    }

    const toastId = toast.loading("Saving final exam evaluation...");

    try {
      setIsSubmitting(true);

      await giveFinalExamVerdict(attemptId, payload);

      setSavedForm(form);

      toast.success("Final exam evaluation saved successfully.", {
        id: toastId,
      });

      const tab =
        form.verdict === "passed" ? "issue-certificate" : "request-retake";

      router.push(
        `/admin/evaluation-center/certification-center?attemptId=${encodeURIComponent(
          attemptId,
        )}&tab=${tab}`,
      );
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[520px] items-center justify-center">
        <Loader2 className="size-9 animate-spin text-[#006B3F]" />
      </div>
    );
  }

  if (!details || !form || !derived) {
    return (
      <div className="mx-auto flex min-h-[460px] max-w-[760px] flex-col items-center justify-center rounded-[2.5rem] bg-white p-8 text-center shadow-xl shadow-black/5">
        <TriangleAlert className="size-10 text-[#D92D20]" />

        <h2 className="mt-5 text-2xl font-bold text-[#202420]">
          Evaluation details unavailable
        </h2>

        <p className="mt-3 max-w-lg text-[#66736A]">{loadError}</p>

        <button
          type="button"
          onClick={() => router.push("/admin/evaluation-center")}
          className="mt-7 rounded-full bg-[#006B3F] px-8 py-3 font-semibold text-white"
        >
          Back to Evaluation Center
        </button>
      </div>
    );
  }

  const submittedAt = details.submittedAt
    ? new Date(details.submittedAt).toLocaleString()
    : "Not submitted";

  const reviewProgress = details.review ? "100%" : "0%";

  return (
    <>
      <div className="space-y-7">
        <BreadcrumbHeader
          onBack={() =>
            unsavedChanges.requestNavigation("/admin/evaluation-center")
          }
        />

        <h1 className="text-3xl font-bold text-[#006B3F]">Evaluation Board</h1>

        <StudentSummaryCard
          student={{
            name: details.user?.fullName || "Deleted User",

            level: derived.level,

            totalExamTime: formatDuration(details.totalDurationSeconds),

            totalExamLimit: `${details.examTemplate.totalDurationMinutes}m`,

            responseCount: derived.answeredCount,

            status: details.status,
          }}
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <EvaluationStatCard
            stat={{
              id: "submission",
              title: "Submission",
              value: submittedAt,
              iconType: "submission",
            }}
          />

          <EvaluationStatCard
            stat={{
              id: "auto-score",

              title: "Auto-Graded Score",

              value: `${derived.autoScore.scoreOutOfTen}/10`,

              helper: `${derived.autoScore.scorePercent}%`,

              iconType: "score",
            }}
          />

          <EvaluationStatCard
            stat={{
              id: "progress",

              title: "Review Progress",

              value: reviewProgress,

              helper: details.review ? "Saved" : "Pending",

              iconType: "progress",

              progressPercent: details.review ? 100 : 0,
            }}
          />
        </div>

        <div className="grid items-start gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <WritingTaskCard answer={derived.writingAnswer} />

            <AudioPlayerCard
              answer={derived.speakingAnswer}
              audioUrl={speakingAudioUrl}
              isLoading={isSpeakingAudioLoading}
              loadError={speakingAudioError}
            />
          </div>

          <ManualScoresCard
            autoScoreOutOfTen={derived.autoScore.scoreOutOfTen}
            hasWritingTask={Boolean(derived.writingAnswer)}
            hasSpeakingTask={Boolean(derived.speakingAnswer)}
            form={form}
            errors={errors}
            isSubmitting={isSubmitting}
            onChange={updateForm}
            onSubmit={handleSubmit}
          />
        </div>
      </div>

      <UnsavedChangesWarningDialog
        open={unsavedChanges.warningOpen}
        onCancel={unsavedChanges.cancelNavigation}
        onConfirm={unsavedChanges.confirmNavigation}
      />
    </>
  );
}
