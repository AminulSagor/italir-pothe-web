"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  createFinalExam,
  delinkFinalExamFromCourse,
  getFinalExams,
  hardDeleteFinalExam,
  linkFinalExamWithCourse,
} from "@/service/final-exam/final-exam.service";
import type {
  FinalExamListItem,
  FinalExamStatus,
} from "@/types/final-exam/final-exam.type";
import { isValidUuid } from "@/utils/uuid";

import FinalExamGrid from "./_components/final-exam-grid";
import FinalExamHeader from "./_components/final-exam-header";
import FinalExamTabs, {
  FinalExamTabValue,
} from "./_components/final-exam-tabs";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const createDefaultFinalExamPayload = () => ({
  title: "New Final Exam",
  description: "Configure this final exam setup.",
  overallPassingPercent: 70,
  totalDurationMinutes: 60,
  unlockCompletionPercent: 80,
  plagiarismMonitorEnabled: true,
  copyPasteMonitorEnabled: true,
  resultNotice: "Your results will be processed within 24–48 hours.",
  resultNoticeBn: "আপনার ফলাফল ২৪–৪৮ ঘণ্টার মধ্যে প্রসেস করা হবে।",
});

const FinalExamManagerPage = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<FinalExamTabValue>("all");
  const [exams, setExams] = useState<FinalExamListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [isLinkingId, setIsLinkingId] = useState<string | null>(null);

  const queryParams = useMemo(() => {
    const status: FinalExamStatus | undefined =
      activeTab === "drafts" ? "draft" : undefined;

    return {
      page: 1,
      limit: 50,
      linkedOnly: activeTab === "linked" ? true : undefined,
      status,
    };
  }, [activeTab]);

  const loadFinalExams = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await getFinalExams(queryParams);

      setExams(response.items || []);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setExams([]);
    } finally {
      setIsLoading(false);
    }
  }, [queryParams]);

  useEffect(() => {
    void loadFinalExams();
  }, [loadFinalExams]);

  const handleCreateExam = async () => {
    const toastId = toast.loading("Creating final exam...");

    try {
      setIsCreating(true);

      const createdExam = await createFinalExam(
        createDefaultFinalExamPayload(),
      );

      if (!isValidUuid(createdExam.id)) {
        toast.error("Final exam created but returned an invalid ID.", {
          id: toastId,
        });
        return;
      }

      toast.success("Final exam created successfully.", {
        id: toastId,
      });

      router.push(`/admin/final-exam-manager/${createdExam.id}`);
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleLinkCourse = async (examId: string) => {
    if (!isValidUuid(examId)) {
      toast.error("Final exam ID is missing. Please refresh and try again.");
      return;
    }

    const courseId = window.prompt("Enter course ID to link with this exam:");

    if (!courseId) return;

    if (!isValidUuid(courseId)) {
      toast.error("Invalid course ID.");
      return;
    }

    const toastId = toast.loading("Linking final exam with course...");

    try {
      setIsLinkingId(examId);

      await linkFinalExamWithCourse(examId, {
        courseId,
      });

      toast.success("Final exam linked with course successfully.", {
        id: toastId,
      });

      await loadFinalExams();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsLinkingId(null);
    }
  };

  const handleDelinkCourse = async (examId: string) => {
    if (!isValidUuid(examId)) {
      toast.error("Final exam ID is missing. Please refresh and try again.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delink this final exam from its course?",
    );

    if (!confirmed) return;

    const toastId = toast.loading("Delinking final exam from course...");

    try {
      setIsLinkingId(examId);

      await delinkFinalExamFromCourse(examId);

      toast.success("Final exam delinked from course successfully.", {
        id: toastId,
      });

      await loadFinalExams();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsLinkingId(null);
    }
  };

  const handleDeleteExam = async (examId: string) => {
    if (!isValidUuid(examId)) {
      toast.error("Final exam ID is missing. Please refresh and try again.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this final exam?",
    );

    if (!confirmed) return;

    const toastId = toast.loading("Deleting final exam...");

    try {
      setIsDeletingId(examId);

      await hardDeleteFinalExam(examId);

      toast.success("Final exam deleted successfully.", {
        id: toastId,
      });

      await loadFinalExams();
    } catch (error) {
      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <FinalExamHeader
        isCreating={isCreating}
        onCreateExam={handleCreateExam}
      />

      <FinalExamTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <FinalExamGrid
        exams={exams}
        isLoading={isLoading}
        isCreating={isCreating}
        isDeletingId={isDeletingId}
        isLinkingId={isLinkingId}
        onCreateExam={handleCreateExam}
        onDeleteExam={handleDeleteExam}
        onLinkCourse={handleLinkCourse}
        onDelinkCourse={handleDelinkCourse}
      />
    </div>
  );
};

export default FinalExamManagerPage;
