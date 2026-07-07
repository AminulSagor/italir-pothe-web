"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import {
  createCoreQuizQuestion,
  deleteCoreQuizQuestion,
  getCoreQuizQuestionById,
  getCoreQuizQuestions,
  getFinalExamById,
  publishCoreQuiz,
  updateCoreQuizQuestion,
} from "@/service/final-exam/final-exam.service";
import { createSignedReadUrl } from "@/service/files/file_upload";
import {
  uploadQuizAudio,
  uploadQuizImage,
} from "@/service/course-directory/quiz.service";
import type {
  QuizQuestionAcceptedAnswer,
  QuizQuestionOption,
  QuizQuestionPair,
  QuizQuestionSequenceItem,
  QuizQuestionType,
} from "@/types/course-directory/quiz.type";

import AnswerOptionsCard from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/answer-options-card";
import AudioMediaCard from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/audio-media-card";
import FillBlanksQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/fill-blanks-question-config";
import IdentifyImageMcqQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/identify-image-mcq-question-config";
import IdentifyImageQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/identify-image-question-config";
import InstructionalContentCard from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/instructional-content-card";
import ListenAssembleQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/listen-assemble-question-config";
import ListeningQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/listening-question-config";
import MatchPairQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/match-pair-question-config";
import QuestionConfigurationHeader from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-configuration-header";
import QuizActionPanel from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/quiz-action-panel";
import FinalExamQuizBuilderHeader from "../../_components/final-exam-quiz-builder-header";
import QuizFlowSidebar from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/quiz-flow-sidebar";
import SentenceTranslationQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/sentence-translation-question-config";
import TrueFalseQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/true-false-question-config";
import WordTranslationQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/word-translation-question-config";

import UnsavedFinalExamWarningDialog from "../../_components/unsaved-final-exam-warning-dialog";
import {
  audioQuestionTypes,
  cleanAcceptedAnswers,
  cleanOptions,
  cleanPairs,
  cleanSequenceItems,
  createEmptyQuestionForm,
  createFlowItem,
  createFormFromQuestion,
  createPayloadFromForm,
  createSnapshot,
  getQuestionLabel,
  optionQuestionTypes,
  questionTypes,
  QuestionForm,
  sequenceQuestionTypes,
} from "../_utils/final-exam-quiz-builder.utils";
import WritingWordTranslationQuestionConfig from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/question-types/writing-word-translation-question-config";

interface FinalExamQuizBuilderClientProps {
  finalExamId: string;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

export default function FinalExamQuizBuilderClient({
  finalExamId,
}: FinalExamQuizBuilderClientProps) {
  const router = useRouter();

  const [courseTitle, setCourseTitle] = useState("");
  const [examTitle, setExamTitle] = useState("");
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [activeQuestionKey, setActiveQuestionKey] = useState("");
  const [form, setForm] = useState<QuestionForm>(() =>
    createEmptyQuestionForm(1),
  );
  const [savedForm, setSavedForm] = useState<QuestionForm>(() =>
    createEmptyQuestionForm(1),
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    createSnapshot(createEmptyQuestionForm(1)),
  );
  const [mediaUrl, setMediaUrl] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [isWarningOpen, setIsWarningOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    (() => void | Promise<void>) | null
  >(null);

  const currentSnapshot = useMemo(() => createSnapshot(form), [form]);
  const hasUnsavedChanges = currentSnapshot !== savedSnapshot;

  const flowQuestions = useMemo(
    () => questions.map(createFlowItem),
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

    const loadBuilder = async () => {
      try {
        setIsLoading(true);

        const [examResponse, questionResponse] = await Promise.all([
          getFinalExamById(finalExamId),
          getCoreQuizQuestions(finalExamId),
        ]);

        if (!isMounted) return;

        const sortedQuestions = questionResponse
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder);

        let loadedQuestions = sortedQuestions.length
          ? sortedQuestions.map(createFormFromQuestion)
          : [createEmptyQuestionForm(1)];

        if (loadedQuestions[0]?.id) {
          const firstQuestionDetails = await getCoreQuizQuestionById(
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

    loadBuilder();

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

  const updateForm = <K extends keyof QuestionForm>(
    key: K,
    value: QuestionForm[K],
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

  const handleQuestionTypeChange = (questionType: QuizQuestionType) => {
    if (questionType === form.questionType) return;

    const nextForm = {
      ...createEmptyQuestionForm(form.sortOrder, questionType),
      id: form.id,
      localId: form.localId,
      points: form.points,
      status: form.status,
    };

    setForm(nextForm);

    setQuestions((currentQuestions) =>
      currentQuestions.map((question) =>
        question.localId === form.localId ? nextForm : question,
      ),
    );
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
              await getCoreQuizQuestionById(finalExamId, selectedQuestion.id),
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

      const shouldUploadImage =
        form.questionType === "identify_image" ||
        form.questionType === "writing_word_translation";

      const fileId = shouldUploadImage
        ? await uploadQuizImage(file)
        : await uploadQuizAudio(file);

      updateForm("mediaFileId", fileId);
      toast.success(
        shouldUploadImage
          ? "Image uploaded successfully."
          : "Audio uploaded successfully.",
      );
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const validateQuestion = () => {
    if (!form.title.trim()) {
      toast.error("Question title is required.");
      return false;
    }

    const promptOptionalTypes: QuizQuestionType[] = [
      "match_the_pair",
      "writing_word_translation",
      "identify_image",
    ];

    if (
      !promptOptionalTypes.includes(form.questionType) &&
      !form.promptText.trim()
    ) {
      toast.error("Prompt text is required.");
      return false;
    }

    if (
      optionQuestionTypes.includes(form.questionType) &&
      (!cleanOptions(form.options).length ||
        !cleanOptions(form.options).some((option) => option.isCorrect))
    ) {
      toast.error("Add options and select one correct answer.");
      return false;
    }

    if (
      sequenceQuestionTypes.includes(form.questionType) &&
      !cleanSequenceItems(form.sequenceItems).length
    ) {
      toast.error("Add sequence words.");
      return false;
    }

    if (
      form.questionType === "match_the_pair" &&
      !cleanPairs(form.pairs).length
    ) {
      toast.error("Add at least one matching pair.");
      return false;
    }

    if (
      form.questionType === "writing_word_translation" &&
      !cleanAcceptedAnswers(form.acceptedAnswers).length
    ) {
      toast.error("Add at least one accepted answer.");
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
        ? await updateCoreQuizQuestion(finalExamId, form.id, payload)
        : await createCoreQuizQuestion(finalExamId, payload);

      const detailedQuestion = createFormFromQuestion(
        await getCoreQuizQuestionById(finalExamId, savedQuestion.id),
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
        await deleteCoreQuizQuestion(finalExamId, form.id);
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

  const handlePublishCoreQuiz = async () => {
    if (hasUnsavedChanges) {
      toast.error("Save the current question before publishing the quiz.");
      return;
    }

    const toastId = toast.loading("Publishing core quiz...");

    try {
      setIsPublishing(true);

      await publishCoreQuiz(finalExamId);

      toast.success("Core quiz published successfully.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    guardedAction(() => {
      router.push(`/admin/final-exam-manager/${finalExamId}`);
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-[#66736B]">
        Loading final exam quiz builder...
      </div>
    );
  }

  const renderQuestionConfiguration = () => {
    if (form.questionType === "listening_mcq") {
      return (
        <ListeningQuestionConfig
          title={form.title}
          points={form.points}
          sortOrder={form.sortOrder}
          status={form.status}
          mediaFileId={form.mediaFileId}
          mediaUrl={mediaUrl}
          generatedAudioText={form.generatedAudioText}
          options={form.options}
          isUploading={isUploadingMedia}
          onTitleChange={(value) => updateForm("title", value)}
          onPointsChange={(value) => updateForm("points", value)}
          onSortOrderChange={(value) => updateForm("sortOrder", value)}
          onStatusChange={(value) => updateForm("status", value)}
          onGeneratedAudioTextChange={(value) =>
            updateForm("generatedAudioText", value)
          }
          onFileSelect={handleMediaUpload}
          onRemoveMedia={() => updateForm("mediaFileId", "")}
          onOptionsChange={(options) => updateForm("options", options)}
        />
      );
    }

    if (form.questionType === "sentence_translation") {
      return (
        <SentenceTranslationQuestionConfig
          promptText={form.promptText}
          translationText={form.translationText}
          sequenceItems={form.sequenceItems}
          points={form.points}
          sortOrder={form.sortOrder}
          status={form.status}
          onPromptTextChange={(value) => updateForm("promptText", value)}
          onTranslationTextChange={(value) =>
            updateForm("translationText", value)
          }
          onSequenceItemsChange={(items) => updateForm("sequenceItems", items)}
          onPointsChange={(value) => updateForm("points", value)}
          onSortOrderChange={(value) => updateForm("sortOrder", value)}
          onStatusChange={(value) => updateForm("status", value)}
        />
      );
    }

    if (form.questionType === "word_translation") {
      return (
        <WordTranslationQuestionConfig
          title={form.title}
          promptText={form.promptText}
          options={form.options}
          onTitleChange={(value) => updateForm("title", value)}
          onPromptTextChange={(value) => updateForm("promptText", value)}
          onOptionsChange={(options) => updateForm("options", options)}
        />
      );
    }

    if (form.questionType === "true_false") {
      return (
        <TrueFalseQuestionConfig
          promptText={form.promptText}
          translationText={form.translationText}
          points={form.points}
          sortOrder={form.sortOrder}
          status={form.status}
          correctBoolean={form.correctBoolean}
          onPromptTextChange={(value) => updateForm("promptText", value)}
          onTranslationTextChange={(value) =>
            updateForm("translationText", value)
          }
          onPointsChange={(value) => updateForm("points", value)}
          onSortOrderChange={(value) => updateForm("sortOrder", value)}
          onStatusChange={(value) => updateForm("status", value)}
          onCorrectBooleanChange={(value) =>
            updateForm("correctBoolean", value)
          }
        />
      );
    }

    if (form.questionType === "fill_in_the_blanks") {
      return (
        <FillBlanksQuestionConfig
          sentence={form.promptText}
          options={form.options}
          onSentenceChange={(value) => updateForm("promptText", value)}
          onOptionsChange={(options) => updateForm("options", options)}
        />
      );
    }

    if (form.questionType === "listen_and_assemble") {
      return (
        <>
          <AudioMediaCard
            mediaFileId={form.mediaFileId}
            mediaUrl={mediaUrl}
            generatedAudioText={form.generatedAudioText}
            isUploading={isUploadingMedia}
            onGeneratedAudioTextChange={(value) =>
              updateForm("generatedAudioText", value)
            }
            onFileSelect={handleMediaUpload}
            onRemoveMedia={() => updateForm("mediaFileId", "")}
          />

          <ListenAssembleQuestionConfig
            promptText={form.promptText}
            sequenceItems={form.sequenceItems}
            onPromptTextChange={(value) => updateForm("promptText", value)}
            onSequenceItemsChange={(items) =>
              updateForm("sequenceItems", items)
            }
          />
        </>
      );
    }

    if (form.questionType === "match_the_pair") {
      return (
        <MatchPairQuestionConfig
          pairs={form.pairs}
          onPairsChange={(pairs) => updateForm("pairs", pairs)}
        />
      );
    }

    if (form.questionType === "writing_word_translation") {
      return (
        <WritingWordTranslationQuestionConfig
          mediaFileId={form.mediaFileId}
          mediaUrl={mediaUrl}
          translationText={form.translationText}
          acceptedAnswers={form.acceptedAnswers}
          isUploading={isUploadingMedia}
          onFileSelect={handleMediaUpload}
          onRemoveMedia={() => updateForm("mediaFileId", "")}
          onTranslationTextChange={(value) =>
            updateForm("translationText", value)
          }
          onAcceptedAnswersChange={(answers) =>
            updateForm("acceptedAnswers", answers)
          }
        />
      );
    }

    if (form.questionType === "identify_image") {
      return (
        <IdentifyImageMcqQuestionConfig
          mediaFileId={form.mediaFileId}
          mediaUrl={mediaUrl}
          options={form.options}
          isUploading={isUploadingMedia}
          onFileSelect={handleMediaUpload}
          onRemoveMedia={() => updateForm("mediaFileId", "")}
          onOptionsChange={(options) => updateForm("options", options)}
        />
      );
    }

    return null;
  };

  return (
    <>
      <div className="space-y-7">
        <FinalExamQuizBuilderHeader
          courseTitle={courseTitle}
          examTitle={examTitle}
          builderTitle={`Quiz Builder: ${examTitle}`}
          description="Manage questions and interactive content for the final exam core quiz."
          isPublishing={isPublishing}
          onBack={handleBack}
          onPublish={handlePublishCoreQuiz}
        />

        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <QuizFlowSidebar
            questions={flowQuestions}
            activeQuestionKey={activeQuestionKey}
            lessonTitle={examTitle}
            onQuestionSelect={handleSelectQuestion}
            onAddQuestion={handleAddQuestion}
          />

          <div className="space-y-6">
            <QuestionConfigurationHeader
              title={`${getQuestionLabel(form.questionType)} Configuration`}
              format={getQuestionLabel(form.questionType)}
              questionTypes={questionTypes}
              selectedQuestionType={form.questionType}
              onQuestionTypeChange={handleQuestionTypeChange}
            />

            {renderQuestionConfiguration()}

            <QuizActionPanel
              isSaving={isSavingQuestion}
              isDeleting={isDeletingQuestion}
              onSaveQuestion={handleSaveQuestion}
              onDiscardQuestion={handleDiscardQuestion}
            />
          </div>
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
}
