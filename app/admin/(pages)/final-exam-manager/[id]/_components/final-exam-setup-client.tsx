"use client";

import { useEffect, useMemo, useState } from "react";
import { Headphones, ListChecks, Mic, PenLine } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  getFinalExamById,
  publishFinalExam,
  updateFinalExam,
  upsertSpeakingTask,
  upsertWritingTask,
} from "@/service/final-exam/final-exam.service";
import type {
  FinalExam,
  FinalExamQuestion,
  FinalExamSection,
} from "@/types/final-exam/final-exam.type";

import ExamBasicFields from "./exam-basic-fields";
import ExamPartCard, { ExamPartView } from "./exam-part-card";
import ExamProgressCard from "./exam-progress-card";
import ExamSetupHeader from "./exam-setup-header";
import ExamSpeakingLab from "./exam-speaking-lab";
import ExamWritingTask from "./exam-writing-task";
import GlobalExamRules from "./global-exam-rules";
import PublishFinalExam from "./publish-final-exam";
import UnsavedFinalExamWarningDialog from "./unsaved-final-exam-warning-dialog";

interface FinalExamSetupClientProps {
  finalExamId: string;
}

interface FinalExamSetupForm {
  title: string;
  description: string;
  courseId: string;
  courseTitle: string;
  overallPassingPercent: number;
  totalDurationMinutes: number;
  unlockCompletionPercent: number;
  plagiarismMonitorEnabled: boolean;
  copyPasteMonitorEnabled: boolean;
  resultNotice: string;
  resultNoticeBn: string;

  writingTitle: string;
  writingTitleBn: string;
  writingInstruction: string;
  writingMinWords: number;
  writingMaxWords: number;
  writingAccentBarEnabled: boolean;

  speakingTitle: string;
  speakingTitleBn: string;
  speakingInstruction: string;
  speakingMaxDurationSeconds: number;
  speakingUnlimitedRerecords: boolean;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const getSection = (
  exam: FinalExam,
  sectionType: FinalExamSection["sectionType"],
) => exam.sections.find((section) => section.sectionType === sectionType);

const getFirstQuestion = (
  exam: FinalExam,
  sectionType: FinalExamSection["sectionType"],
): FinalExamQuestion | null => {
  const section = getSection(exam, sectionType);
  return section?.questions?.[0] || null;
};

const createFormFromExam = (exam: FinalExam): FinalExamSetupForm => {
  const writingSection = getSection(exam, "writing_task");
  const speakingSection = getSection(exam, "speaking_lab");
  const writingQuestion = getFirstQuestion(exam, "writing_task");
  const speakingQuestion = getFirstQuestion(exam, "speaking_lab");

  return {
    title: exam.title || "",
    description: exam.description || "",
    courseId: exam.courseId || "",
    courseTitle: exam.courseTitle || exam.linkedCourseTitle || "",
    overallPassingPercent: exam.overallPassingPercent || 70,
    totalDurationMinutes: exam.totalDurationMinutes || 60,
    unlockCompletionPercent: exam.unlockCompletionPercent || 80,
    plagiarismMonitorEnabled: Boolean(exam.plagiarismMonitorEnabled),
    copyPasteMonitorEnabled: Boolean(exam.copyPasteMonitorEnabled),
    resultNotice: exam.resultNotice || "",
    resultNoticeBn: exam.resultNoticeBn || "",

    writingTitle: writingQuestion?.title || "",
    writingTitleBn: writingQuestion?.translationText || "",
    writingInstruction: writingQuestion?.promptText || "",
    writingMinWords: writingSection?.rule?.minWords || 150,
    writingMaxWords: writingSection?.rule?.maxWords || 200,
    writingAccentBarEnabled:
      writingSection?.rule?.accentBarEnabled === undefined ||
      writingSection?.rule?.accentBarEnabled === null
        ? true
        : Boolean(writingSection.rule.accentBarEnabled),

    speakingTitle: speakingQuestion?.title || "",
    speakingTitleBn: speakingQuestion?.translationText || "",
    speakingInstruction: speakingQuestion?.promptText || "",
    speakingMaxDurationSeconds: speakingSection?.rule?.maxDurationSeconds || 60,
    speakingUnlimitedRerecords:
      speakingSection?.rule?.rerecordPolicy === "unlimited" ||
      speakingSection?.rule?.rerecordPolicy === null ||
      speakingSection?.rule?.rerecordPolicy === undefined,
  };
};

const createSnapshot = (form: FinalExamSetupForm) => JSON.stringify(form);

export default function FinalExamSetupClient({
  finalExamId,
}: FinalExamSetupClientProps) {
  const router = useRouter();

  const [exam, setExam] = useState<FinalExam | null>(null);
  const [form, setForm] = useState<FinalExamSetupForm | null>(null);
  const [savedSnapshot, setSavedSnapshot] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const hasUnsavedChanges = useMemo(() => {
    if (!form) return false;
    return createSnapshot(form) !== savedSnapshot;
  }, [form, savedSnapshot]);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasUnsavedChanges) return;

      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  useEffect(() => {
    let isMounted = true;

    const loadFinalExam = async () => {
      try {
        setIsLoading(true);

        const response = await getFinalExamById(finalExamId);

        if (!isMounted) return;

        const nextForm = createFormFromExam(response);

        setExam(response);
        setForm(nextForm);
        setSavedSnapshot(createSnapshot(nextForm));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadFinalExam();

    return () => {
      isMounted = false;
    };
  }, [finalExamId]);

  const updateForm = <K extends keyof FinalExamSetupForm>(
    key: K,
    value: FinalExamSetupForm[K],
  ) => {
    setForm((currentForm) =>
      currentForm
        ? {
            ...currentForm,
            [key]: value,
          }
        : currentForm,
    );
  };

  const guardedAction = (action: () => void) => {
    if (!hasUnsavedChanges) {
      action();
      return;
    }

    setPendingAction(() => action);
    setIsWarningOpen(true);
  };

  const handleConfirmDiscard = () => {
    setIsWarningOpen(false);

    if (exam) {
      const resetForm = createFormFromExam(exam);
      setForm(resetForm);
      setSavedSnapshot(createSnapshot(resetForm));
    }

    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  const handleBack = () => {
    guardedAction(() => {
      router.push("/admin/final-exam-manager");
    });
  };

  const handleNavigate = (path: string) => {
    guardedAction(() => {
      router.push(path);
    });
  };

  const handlePublish = async () => {
    if (!form) return;

    const toastId = toast.loading("Publishing final exam...");

    try {
      setIsPublishing(true);

      await updateFinalExam(finalExamId, {
        courseId: form.courseId,
        title: form.title,
        description: form.description,
        overallPassingPercent: form.overallPassingPercent,
        totalDurationMinutes: form.totalDurationMinutes,
        unlockCompletionPercent: form.unlockCompletionPercent,
        plagiarismMonitorEnabled: form.plagiarismMonitorEnabled,
        copyPasteMonitorEnabled: form.copyPasteMonitorEnabled,
        resultNotice: form.resultNotice,
        resultNoticeBn: form.resultNoticeBn,
      });

      if (form.writingTitle.trim() || form.writingInstruction.trim()) {
        await upsertWritingTask(finalExamId, {
          title: form.writingTitle.trim() || "Writing Task",
          titleBn: form.writingTitleBn.trim(),
          instruction: form.writingInstruction.trim(),
          minWords: Number(form.writingMinWords) || 150,
          maxWords: Number(form.writingMaxWords) || 200,
          italianAccentBarEnabled: form.writingAccentBarEnabled,
        });
      }

      if (form.speakingTitle.trim() || form.speakingInstruction.trim()) {
        await upsertSpeakingTask(finalExamId, {
          title: form.speakingTitle.trim() || "Speaking Task",
          titleBn: form.speakingTitleBn.trim(),
          instruction: form.speakingInstruction.trim(),
          maxDurationSeconds: Number(form.speakingMaxDurationSeconds) || 60,
          unlimitedRerecords: form.speakingUnlimitedRerecords,
        });
      }

      const publishedExam = await publishFinalExam(finalExamId);
      const nextForm = createFormFromExam(publishedExam);

      setExam(publishedExam);
      setForm(nextForm);
      setSavedSnapshot(createSnapshot(nextForm));

      toast.success("Final exam published successfully.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const examParts: ExamPartView[] = useMemo(() => {
    if (!exam) return [];

    const coreProgress = exam.setupProgress.sections.coreQuiz;
    const listeningProgress = exam.setupProgress.sections.listeningLab;
    const writingProgress = exam.setupProgress.sections.writingTask;
    const speakingProgress = exam.setupProgress.sections.speakingLab;

    return [
      {
        id: "core_quiz",
        title: "Part 1: Core Quiz",
        description: "Standard multiple-choice and fill-in-the-blanks logic.",
        icon: ListChecks,
        accentClass: "border-l-[#007A4A]",
        iconWrapperClass: "bg-[#DDF3E8]",
        iconClass: "text-[#007A4A]",
        passingPercent: exam.overallPassingPercent,
        currentQuestions: coreProgress.currentQuestions,
        requiredQuestions: coreProgress.requiredQuestions,
        actionLabel: `Manage ${coreProgress.requiredQuestions} Questions`,
        actionPath: `/admin/final-exam-manager/${finalExamId}/quiz-builder`,
        variant: "core",
      },
      {
        id: "listening_lab",
        title: "Part 2: Listening Lab",
        description: "High-fidelity audio comprehension module.",
        icon: Headphones,
        accentClass: "border-l-[#C92127]",
        iconWrapperClass: "bg-[#FFE6E3]",
        iconClass: "text-[#C92127]",
        passingPercent: exam.overallPassingPercent,
        currentQuestions: listeningProgress.currentQuestions,
        requiredQuestions: listeningProgress.requiredQuestions,
        actionLabel: "Mini-MCQ Manager",
        actionPath: `/admin/final-exam-manager/${finalExamId}/mini-quiz-manager`,
        variant: "listening",
      },
      {
        id: "writing_task",
        title: "Part 3: Writing Task",
        description: "Written production task with manual review.",
        icon: PenLine,
        accentClass: "border-l-[#007A4A]",
        iconWrapperClass: "bg-[#DDF3E8]",
        iconClass: "text-[#007A4A]",
        passingPercent: exam.overallPassingPercent,
        currentQuestions: writingProgress.currentQuestions,
        requiredQuestions: writingProgress.requiredQuestions,
        actionLabel: "",
        actionPath: "",
        variant: "writing",
      },
      {
        id: "speaking_lab",
        title: "Part 4: Speaking Lab",
        description: "Audio recording task with manual review.",
        icon: Mic,
        accentClass: "border-l-[#F59E0B]",
        iconWrapperClass: "bg-[#FFF2CC]",
        iconClass: "text-[#B54708]",
        passingPercent: exam.overallPassingPercent,
        currentQuestions: speakingProgress.currentQuestions,
        requiredQuestions: speakingProgress.requiredQuestions,
        actionLabel: "",
        actionPath: "",
        variant: "speaking",
      },
    ];
  }, [exam, finalExamId]);

  if (isLoading || !exam || !form) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-[#66736B]">
        Loading final exam setup...
      </div>
    );
  }

  return (
    <>
      <div className="mx-auto max-w-6xl space-y-7 pb-16">
        <ExamSetupHeader
          title={exam.title}
          subtitle={exam.description}
          onBack={handleBack}
        />

        <ExamProgressCard progress={exam.setupProgress.percentage} />

        <ExamBasicFields
          examName={form.title}
          linkedCourse={form.courseTitle}
          onExamNameChange={(value) => updateForm("title", value)}
        />

        <GlobalExamRules
          unlockCompletionPercent={form.unlockCompletionPercent}
          plagiarismMonitorEnabled={form.plagiarismMonitorEnabled}
          copyPasteMonitorEnabled={form.copyPasteMonitorEnabled}
          resultNotice={form.resultNotice}
          resultNoticeBn={form.resultNoticeBn}
          totalDurationMinutes={form.totalDurationMinutes}
          overallPassingPercent={form.overallPassingPercent}
          onUnlockCompletionPercentChange={(value) =>
            updateForm("unlockCompletionPercent", value)
          }
          onPlagiarismMonitorChange={(value) =>
            updateForm("plagiarismMonitorEnabled", value)
          }
          onCopyPasteMonitorChange={(value) =>
            updateForm("copyPasteMonitorEnabled", value)
          }
          onResultNoticeChange={(value) => updateForm("resultNotice", value)}
          onResultNoticeBnChange={(value) =>
            updateForm("resultNoticeBn", value)
          }
          onTotalDurationMinutesChange={(value) =>
            updateForm("totalDurationMinutes", value)
          }
          onOverallPassingPercentChange={(value) =>
            updateForm("overallPassingPercent", value)
          }
        />

        <ExamPartCard part={examParts[0]} onNavigate={handleNavigate} />

        <ExamPartCard
          part={examParts[1]}
          variant="listening"
          onNavigate={handleNavigate}
        />

        <ExamWritingTask
          part={examParts[2]}
          title={form.writingTitle}
          titleBn={form.writingTitleBn}
          instruction={form.writingInstruction}
          minWords={form.writingMinWords}
          maxWords={form.writingMaxWords}
          accentBarEnabled={form.writingAccentBarEnabled}
          onTitleChange={(value) => updateForm("writingTitle", value)}
          onTitleBnChange={(value) => updateForm("writingTitleBn", value)}
          onInstructionChange={(value) =>
            updateForm("writingInstruction", value)
          }
          onMinWordsChange={(value) => updateForm("writingMinWords", value)}
          onMaxWordsChange={(value) => updateForm("writingMaxWords", value)}
          onAccentBarChange={(value) =>
            updateForm("writingAccentBarEnabled", value)
          }
        />

        <ExamSpeakingLab
          part={examParts[3]}
          title={form.speakingTitle}
          titleBn={form.speakingTitleBn}
          instruction={form.speakingInstruction}
          maxDurationSeconds={form.speakingMaxDurationSeconds}
          unlimitedRerecords={form.speakingUnlimitedRerecords}
          onTitleChange={(value) => updateForm("speakingTitle", value)}
          onTitleBnChange={(value) => updateForm("speakingTitleBn", value)}
          onInstructionChange={(value) =>
            updateForm("speakingInstruction", value)
          }
          onMaxDurationSecondsChange={(value) =>
            updateForm("speakingMaxDurationSeconds", value)
          }
          onUnlimitedRerecordsChange={(value) =>
            updateForm("speakingUnlimitedRerecords", value)
          }
        />

        <PublishFinalExam
          isPublishing={isPublishing}
          onPublish={handlePublish}
        />
      </div>

      <UnsavedFinalExamWarningDialog
        open={isWarningOpen}
        onCancel={() => {
          setIsWarningOpen(false);
          setPendingAction(null);
        }}
        onOk={handleConfirmDiscard}
      />
    </>
  );
}
