"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import type { ServiceClientError } from "@/service/base/service_client";
import {
  createFinalExam,
  delinkFinalExamFromCourse,
  getAvailableFinalExamCourses,
  getFinalExams,
  hardDeleteFinalExam,
  linkFinalExamWithCourse,
} from "@/service/final-exam/final-exam.service";
import type {
  FinalExamLinkableCourse,
  FinalExamListItem,
  FinalExamStatus,
} from "@/types/final-exam/final-exam.type";
import { isValidUuid } from "@/utils/uuid";

import FinalExamGrid from "./_components/final-exam-grid";
import FinalExamHeader from "./_components/final-exam-header";
import LinkFinalExamCourseDialog from "./_components/link-final-exam-course-dialog";
import FinalExamTabs, {
  FinalExamTabValue,
} from "./_components/final-exam-tabs";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
};

const getErrorStatus = (error: unknown) => {
  const serviceError = error as ServiceClientError;

  return serviceError.response?.status;
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
  const [linkableCourses, setLinkableCourses] = useState<
    FinalExamLinkableCourse[]
  >([]);

  const [selectedLinkExam, setSelectedLinkExam] =
    useState<FinalExamListItem | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);
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

  const loadLinkableCourses = useCallback(async () => {
    try {
      setIsLoadingCourses(true);

      const availableCourses = await getAvailableFinalExamCourses();

      setLinkableCourses(availableCourses);
    } catch (error) {
      toast.error(getErrorMessage(error));
      setLinkableCourses([]);
    } finally {
      setIsLoadingCourses(false);
    }
  }, []);

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
        toast.error("Final exam was created but returned an invalid ID.", {
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

  const handleOpenLinkCourseDialog = async (examId: string) => {
    const exam = exams.find((item) => item.id === examId);

    if (!exam || !isValidUuid(exam.id)) {
      toast.error("Final exam information is unavailable.");
      return;
    }

    setSelectedLinkExam(exam);
    setLinkableCourses([]);

    await loadLinkableCourses();
  };

  const handleCloseLinkCourseDialog = () => {
    if (isLinkingId) return;

    setSelectedLinkExam(null);
    setLinkableCourses([]);
  };

  const handleConfirmLinkCourse = async (courseId: string) => {
    if (!selectedLinkExam) return;

    if (!isValidUuid(selectedLinkExam.id) || !isValidUuid(courseId)) {
      toast.error("Invalid final exam or course ID.");
      return;
    }

    const toastId = toast.loading("Linking final exam with course...");

    try {
      setIsLinkingId(selectedLinkExam.id);

      await linkFinalExamWithCourse(selectedLinkExam.id, {
        courseId,
      });

      toast.success("Final exam linked with course successfully.", {
        id: toastId,
      });

      setSelectedLinkExam(null);
      setLinkableCourses([]);

      await loadFinalExams();
    } catch (error) {
      if (getErrorStatus(error) === 409) {
        setLinkableCourses((currentCourses) =>
          currentCourses.filter((course) => course.id !== courseId),
        );

        toast.error(
          "That course is already linked to another final exam. The available course list has been refreshed.",
          {
            id: toastId,
          },
        );

        await loadLinkableCourses();
        return;
      }

      toast.error(getErrorMessage(error), {
        id: toastId,
      });
    } finally {
      setIsLinkingId(null);
    }
  };

  const handleDelinkCourse = async (examId: string) => {
    if (!isValidUuid(examId)) {
      toast.error("Final exam ID is invalid.");
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
      toast.error("Final exam ID is invalid.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this final exam?",
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
        onLinkCourse={handleOpenLinkCourseDialog}
        onDelinkCourse={handleDelinkCourse}
      />

      <LinkFinalExamCourseDialog
        open={Boolean(selectedLinkExam)}
        examTitle={selectedLinkExam?.title || ""}
        courses={linkableCourses}
        isLoading={isLoadingCourses}
        isSubmitting={isLinkingId === selectedLinkExam?.id}
        onClose={handleCloseLinkCourseDialog}
        onConfirm={handleConfirmLinkCourse}
      />
    </div>
  );
};

export default FinalExamManagerPage;
