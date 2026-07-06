"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  createListeningQuestion,
  deleteListeningQuestion,
  getFinalExamById,
  getListeningQuestionById,
  getListeningQuestions,
  publishListeningLab,
  updateListeningQuestion,
} from "@/service/final-exam/final-exam.service";
import { createSignedReadUrl } from "@/service/files/file_upload";
import { uploadQuizAudio } from "@/service/course-directory/quiz.service";
import type {
  FinalExamQuestion,
  FinalExamListeningQuestionPayload,
  FinalExamQuestionStatus,
} from "@/types/final-exam/final-exam.type";
import type { QuizQuestionOption } from "@/types/course-directory/quiz.type";

import UnsavedFinalExamWarningDialog from "../../_components/unsaved-final-exam-warning-dialog";

import ListeningMiniQuizBuilderHeader from "./listening-mini-quiz-builder-header";
import ModuleQuestionsSidebar, {
  MiniQuizSidebarQuestion,
} from "./module-questions-sidebar";
import QuestionEditorCard from "./question-editor-card";
import type { AudioSourceType } from "./audio-source-tabs";

interface ListeningMiniQuizBuilderClientProps {
  finalExamId: string;
}

interface ListeningQuestionForm {
  id?: string;
  localId: string;
  title: string;
  promptText: string;
  helperText: string;
  mediaFileId: string;
  generatedAudioText: string;
  audioSourceType: AudioSourceType;
  points: number;
  sortOrder: number;
  status: FinalExamQuestionStatus;
  options: QuizQuestionOption[];
}

const createLocalId = () =>
  `listening-question-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const createDefaultOptions = (): QuizQuestionOption[] => [
  { optionText: "", isCorrect: true, sortOrder: 1 },
  { optionText: "", isCorrect: false, sortOrder: 2 },
  { optionText: "", isCorrect: false, sortOrder: 3 },
];

const createEmptyQuestionForm = (sortOrder: number): ListeningQuestionForm => ({
  localId: createLocalId(),
  title: `Listening Question ${sortOrder}`,
  promptText: "",
  helperText: "Listen to the audio and choose the correct answer.",
  mediaFileId: "",
  generatedAudioText: "",
  audioSourceType: "manual_upload",
  points: 1,
  sortOrder,
  status: "draft",
  options: createDefaultOptions(),
});

const createFormFromQuestion = (
  question: FinalExamQuestion,
): ListeningQuestionForm => ({
  id: question.id,
  localId: question.id,
  title: question.title || `Listening Question ${question.sortOrder || 1}`,
  promptText: question.promptText || "",
  helperText:
    question.helperText || "Listen to the audio and choose the correct answer.",
  mediaFileId: question.mediaFileId || question.audioFileId || "",
  generatedAudioText: question.generatedAudioText || "",
  audioSourceType:
    question.audioSourceType === "ai_voice" ? "ai_voice" : "manual_upload",
  points: question.points || 1,
  sortOrder: question.sortOrder || 1,
  status: question.status || "draft",
  options: question.options?.length
    ? question.options
        .slice()
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((option, index) => ({
          ...option,
          optionText: option.optionText || "",
          isCorrect: Boolean(option.isCorrect),
          sortOrder: option.sortOrder || index + 1,
        }))
    : createDefaultOptions(),
});

const createSnapshot = (form: ListeningQuestionForm) =>
  JSON.stringify({
    ...form,
    localId: undefined,
  });

const cleanOptions = (options: QuizQuestionOption[]) =>
  options
    .filter((option) => option.optionText.trim())
    .map((option, index) => ({
      optionText: option.optionText.trim(),
      isCorrect: option.isCorrect,
      sortOrder: index + 1,
    }));

const createPayloadFromForm = (
  form: ListeningQuestionForm,
): FinalExamListeningQuestionPayload => ({
  questionTitle: form.title.trim() || `Listening Question ${form.sortOrder}`,

  questionPrompt: form.promptText.trim(),

  audioFileId: form.mediaFileId || null,

  generatedAudioText: form.generatedAudioText.trim() || null,

  audioSourceType: form.audioSourceType,

  points: Number(form.points) || 1,

  sortOrder: Number(form.sortOrder) || 1,

  options: cleanOptions(form.options),
});

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const ListeningMiniQuizBuilderClient = ({
  finalExamId,
}: ListeningMiniQuizBuilderClientProps) => {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState<ListeningQuestionForm[]>([]);
  const [activeQuestionKey, setActiveQuestionKey] = useState("");
  const [form, setForm] = useState<ListeningQuestionForm>(() =>
    createEmptyQuestionForm(1),
  );
  const [savedForm, setSavedForm] = useState<ListeningQuestionForm>(() =>
    createEmptyQuestionForm(1),
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    createSnapshot(createEmptyQuestionForm(1)),
  );

  const [mediaUrl, setMediaUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const hasUnsavedChanges = useMemo(
    () => createSnapshot(form) !== savedSnapshot,
    [form, savedSnapshot],
  );

  const sidebarQuestions: MiniQuizSidebarQuestion[] = useMemo(
    () =>
      questions.map((question) => ({
        localId: question.localId,
        title: question.title || `Question ${question.sortOrder}`,
        subtitle: question.promptText || "Listening comprehension question",
      })),
    [questions],
  );

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

    const loadMiniQuiz = async () => {
      try {
        setIsLoading(true);

        const [examResponse, questionResponse] = await Promise.all([
          getFinalExamById(finalExamId),
          getListeningQuestions(finalExamId),
        ]);

        if (!isMounted) return;

        const sortedQuestions = questionResponse
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder);

        let loadedQuestions = sortedQuestions.length
          ? sortedQuestions.map(createFormFromQuestion)
          : [createEmptyQuestionForm(1)];

        if (loadedQuestions[0]?.id) {
          const firstQuestionDetails = await getListeningQuestionById(
            finalExamId,
            loadedQuestions[0].id,
          );

          loadedQuestions = [
            createFormFromQuestion(firstQuestionDetails),
            ...loadedQuestions.slice(1),
          ];
        }

        setCourseTitle(examResponse.courseTitle || "");
        setExamTitle(examResponse.title || "Final Exam");
        setQuestions(loadedQuestions);
        setActiveQuestionKey(loadedQuestions[0].localId);
        setForm(loadedQuestions[0]);
        setSavedForm(loadedQuestions[0]);
        setSavedSnapshot(createSnapshot(loadedQuestions[0]));
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMiniQuiz();

    return () => {
      isMounted = false;
    };
  }, [finalExamId]);

  useEffect(() => {
    let isMounted = true;

    const loadMediaUrl = async () => {
      if (!form.mediaFileId) {
        setMediaUrl("");
        return;
      }

      try {
        const response = await createSignedReadUrl(form.mediaFileId);

        if (!isMounted) return;

        setMediaUrl(response.signedReadUrl || response.publicUrl || "");
      } catch {
        if (isMounted) {
          setMediaUrl("");
        }
      }
    };

    void loadMediaUrl();

    return () => {
      isMounted = false;
    };
  }, [form.mediaFileId]);

  const updateForm = <K extends keyof ListeningQuestionForm>(
    key: K,
    value: ListeningQuestionForm[K],
  ) => {
    setForm((currentForm) => {
      const nextForm = {
        ...currentForm,
        [key]: value,
      };

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question.localId === currentForm.localId ? nextForm : question,
        ),
      );

      return nextForm;
    });
  };

  const guardedAction = (action: () => void | Promise<void>) => {
    if (!hasUnsavedChanges) {
      void action();
      return;
    }

    setPendingAction(() => action);
    setIsWarningOpen(true);
  };

  const handleConfirmUnsavedAction = () => {
    setIsWarningOpen(false);

    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.localId === form.localId ? savedForm : question,
      ),
    );

    setForm(savedForm);

    if (pendingAction) {
      void pendingAction();
      setPendingAction(null);
    }
  };

  const handleBack = () => {
    guardedAction(() => {
      router.push(`/admin/final-exam-manager/${finalExamId}`);
    });
  };

  const handleSelectQuestion = (questionKey: string) => {
    if (questionKey === activeQuestionKey) return;

    guardedAction(async () => {
      const selectedQuestion = questions.find(
        (question) => question.localId === questionKey,
      );

      if (!selectedQuestion) return;

      try {
        const nextForm = selectedQuestion.id
          ? createFormFromQuestion(
              await getListeningQuestionById(finalExamId, selectedQuestion.id),
            )
          : selectedQuestion;

        setQuestions((currentQuestions) =>
          currentQuestions.map((question) =>
            question.localId === questionKey ? nextForm : question,
          ),
        );

        setActiveQuestionKey(nextForm.localId);
        setForm(nextForm);
        setSavedForm(nextForm);
        setSavedSnapshot(createSnapshot(nextForm));
      } catch (error) {
        toast.error(getErrorMessage(error));
      }
    });
  };

  const handleAddQuestion = () => {
    guardedAction(() => {
      const nextForm = createEmptyQuestionForm(questions.length + 1);

      setQuestions((currentQuestions) => [...currentQuestions, nextForm]);
      setActiveQuestionKey(nextForm.localId);
      setForm(nextForm);
      setSavedForm(nextForm);
      setSavedSnapshot(createSnapshot(nextForm));
    });
  };

  const handleMediaUpload = async (file: File) => {
    try {
      setIsUploadingMedia(true);

      const fileId = await uploadQuizAudio(file);

      updateForm("mediaFileId", fileId);
      updateForm("audioSourceType", "manual_upload");
      toast.success("Audio uploaded.");
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const validateQuestion = () => {
    if (!form.promptText.trim()) {
      toast.error("Question prompt is required.");
      return false;
    }

    const cleanAnswerOptions = cleanOptions(form.options);

    if (
      !cleanAnswerOptions.length ||
      !cleanAnswerOptions.some((option) => option.isCorrect)
    ) {
      toast.error("Add answer options and select one correct answer.");
      return false;
    }

    return true;
  };

  const handleSaveQuestion = async () => {
    if (!validateQuestion()) return;

    const toastId = toast.loading("Saving question...");

    try {
      setIsSavingQuestion(true);

      const payload = createPayloadFromForm(form);

      const savedQuestion = form.id
        ? await updateListeningQuestion(finalExamId, form.id, payload)
        : await createListeningQuestion(finalExamId, payload);

      const detailedQuestion = createFormFromQuestion(
        await getListeningQuestionById(finalExamId, savedQuestion.id),
      );

      setQuestions((currentQuestions) =>
        currentQuestions.map((question) =>
          question.localId === form.localId ? detailedQuestion : question,
        ),
      );

      setActiveQuestionKey(detailedQuestion.localId);
      setForm(detailedQuestion);
      setSavedForm(detailedQuestion);
      setSavedSnapshot(createSnapshot(detailedQuestion));

      toast.success("Question configuration saved.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsSavingQuestion(false);
    }
  };

  const handleDiscardQuestion = async () => {
    const toastId = toast.loading("Discarding question...");

    try {
      setIsDeletingQuestion(true);

      if (form.id) {
        await deleteListeningQuestion(finalExamId, form.id);
      }

      const remainingQuestions = questions.filter(
        (question) => question.localId !== form.localId,
      );

      const nextQuestions = remainingQuestions.length
        ? remainingQuestions
        : [createEmptyQuestionForm(1)];

      setQuestions(nextQuestions);
      setActiveQuestionKey(nextQuestions[0].localId);
      setForm(nextQuestions[0]);
      setSavedForm(nextQuestions[0]);
      setSavedSnapshot(createSnapshot(nextQuestions[0]));

      toast.success("Question discarded.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsDeletingQuestion(false);
    }
  };

  const handlePublish = async () => {
    if (hasUnsavedChanges) {
      toast.error("Save the current question before publishing.");
      return;
    }

    const toastId = toast.loading("Publishing listening lab...");

    try {
      setIsPublishing(true);

      await publishListeningLab(finalExamId);

      toast.success("Listening lab published successfully.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-[#66736B]">
        Loading listening mini quiz...
      </div>
    );
  }

  return (
    <>
      <div className="space-y-7">
        <ListeningMiniQuizBuilderHeader
          courseTitle={courseTitle}
          examTitle={examTitle}
          isPublishing={isPublishing}
          onBack={handleBack}
          onPublish={handlePublish}
        />

        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
          <ModuleQuestionsSidebar
            questions={sidebarQuestions}
            activeQuestionKey={activeQuestionKey}
            onQuestionSelect={handleSelectQuestion}
            onAddQuestion={handleAddQuestion}
          />

          <QuestionEditorCard
            title={form.title}
            promptText={form.promptText}
            generatedAudioText={form.generatedAudioText}
            mediaFileId={form.mediaFileId}
            mediaUrl={mediaUrl}
            audioSource={form.audioSourceType}
            options={form.options}
            isUploading={isUploadingMedia}
            isSaving={isSavingQuestion}
            isDeleting={isDeletingQuestion}
            onAudioSourceChange={(value) =>
              updateForm("audioSourceType", value)
            }
            onPromptTextChange={(value) => updateForm("promptText", value)}
            onGeneratedAudioTextChange={(value) =>
              updateForm("generatedAudioText", value)
            }
            onFileSelect={handleMediaUpload}
            onRemoveAudio={() => updateForm("mediaFileId", "")}
            onOptionsChange={(options) => updateForm("options", options)}
            onSaveQuestion={handleSaveQuestion}
            onDiscardQuestion={handleDiscardQuestion}
          />
        </div>
      </div>

      <UnsavedFinalExamWarningDialog
        open={isWarningOpen}
        onCancel={() => {
          setIsWarningOpen(false);
          setPendingAction(null);
        }}
        onOk={handleConfirmUnsavedAction}
      />
    </>
  );
};

export default ListeningMiniQuizBuilderClient;
