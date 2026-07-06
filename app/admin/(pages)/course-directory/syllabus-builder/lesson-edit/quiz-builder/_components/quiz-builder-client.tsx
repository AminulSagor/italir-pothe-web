"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import { getCourseById } from "@/service/course-directory/course.service";
import { getLessonDetails } from "@/service/course-directory/lesson.service";
import {
  createQuiz,
  createQuizQuestion,
  deleteQuizQuestion,
  getQuizQuestionDetails,
  getQuizzesByLesson,
  publishQuiz,
  updateQuiz,
  updateQuizQuestion,
  uploadQuizAudio,
  uploadQuizImage,
} from "@/service/course-directory/quiz.service";
import { createSignedReadUrl } from "@/service/files/file_upload";
import type { CourseLessonDetails } from "@/types/course-directory/lesson.type";
import type {
  Quiz,
  QuizQuestion,
  QuizQuestionAcceptedAnswer,
  QuizQuestionOption,
  QuizQuestionPair,
  QuizQuestionPayload,
  QuizQuestionSequenceItem,
  QuizQuestionType,
} from "@/types/course-directory/quiz.type";

import UnsavedLessonWarningDialog from "../../_components/unsaved-lesson-warning-dialog";
import AudioMediaCard from "./question-types/audio-media-card";
import IdentifyImageMcqQuestionConfig from "./question-types/identify-image-mcq-question-config";
import InstructionalContentCard from "./question-types/instructional-content-card";
import ListenAssembleQuestionConfig from "./question-types/listen-assemble-question-config";
import MatchPairQuestionConfig from "./question-types/match-pair-question-config";
import SentenceTranslationQuestionConfig from "./question-types/sentence-translation-question-config";
import TrueFalseQuestionConfig from "./question-types/true-false-question-config";
import QuestionConfigurationHeader from "./question-configuration-header";
import QuizActionPanel from "./quiz-action-panel";
import QuizBuilderHeader from "./quiz-builder-header";
import QuizFlowSidebar, { QuizFlowQuestionItem } from "./quiz-flow-sidebar";
import FillBlanksQuestionConfig from "./question-types/fill-blanks-question-config";
import WordTranslationQuestionConfig from "./question-types/word-translation-question-config";
import ListeningQuestionConfig from "./question-types/listening-question-config";
import WritingWordTranslationQuestionConfig from "./question-types/writing-word-translation-question-config";

type QuestionStatus = "draft" | "active" | "published" | "archived";

interface QuestionForm {
  id?: string;
  localId: string;
  questionType: QuizQuestionType;
  title: string;
  promptText: string;
  helperText: string;
  translationText: string;
  mediaFileId: string;
  generatedAudioText: string;
  correctBoolean: boolean;
  points: number;
  sortOrder: number;
  status: QuestionStatus;
  options: QuizQuestionOption[];
  pairs: QuizQuestionPair[];
  sequenceItems: QuizQuestionSequenceItem[];
  acceptedAnswers: QuizQuestionAcceptedAnswer[];
}

const LISTENING_MCQ_PROMPT_TEXT = "Listen carefully to the dialogue";
const LISTENING_MCQ_TRANSLATION_TEXT = "";
const SENTENCE_TRANSLATION_TITLE = "Translate this sentence";

const FIXED_QUESTION_PRESETS: Partial<
  Record<
    QuizQuestionType,
    {
      title: string;
      helperText: string;
    }
  >
> = {
  true_false: {
    title: "Find out true or false",
    helperText: "",
  },
  fill_in_the_blanks: {
    title: "Complete the sentence",
    helperText: "Select the correct option to fill the blank.",
  },
  listen_and_assemble: {
    title: "Listen and assemble the sentence",
    helperText: "Listen to the audio and assemble the sentence.",
  },
  match_the_pair: {
    title: "Match the pairs",
    helperText: "Connect the Italian words to their English meanings.",
  },
  writing_word_translation: {
    title: "Translate this word",
    helperText: "Type your answer in Italian.",
  },
  identify_image: {
    title: "Identify the object",
    helperText: "Select the correct Italian word.",
  },
};

const getInitialTitle = (
  questionType: QuizQuestionType,
  fallbackTitle = "",
) => {
  if (questionType === "sentence_translation")
    return SENTENCE_TRANSLATION_TITLE;

  return (
    FIXED_QUESTION_PRESETS[questionType]?.title ||
    fallbackTitle ||
    getQuestionLabel(questionType)
  );
};

const getInitialHelperText = (
  questionType: QuizQuestionType,
  fallbackHelperText = "",
) => {
  if (questionType === "listening_mcq") return "";

  return FIXED_QUESTION_PRESETS[questionType]?.helperText || fallbackHelperText;
};

const getInitialPromptText = (
  questionType: QuizQuestionType,
  fallbackPromptText = "",
) => {
  if (questionType === "listening_mcq") return LISTENING_MCQ_PROMPT_TEXT;

  if (
    questionType === "match_the_pair" ||
    questionType === "writing_word_translation" ||
    questionType === "identify_image"
  ) {
    return "";
  }

  return fallbackPromptText;
};

const getInitialTranslationText = (
  questionType: QuizQuestionType,
  fallbackTranslationText = "",
  fallbackPromptText = "",
) => {
  if (questionType === "listening_mcq") return LISTENING_MCQ_TRANSLATION_TEXT;

  if (questionType === "writing_word_translation") {
    return fallbackPromptText || fallbackTranslationText;
  }

  if (
    questionType === "fill_in_the_blanks" ||
    questionType === "listen_and_assemble" ||
    questionType === "match_the_pair" ||
    questionType === "identify_image"
  ) {
    return "";
  }

  return fallbackTranslationText;
};

const questionTypes: {
  label: string;
  value: QuizQuestionType;
  type: string;
}[] = [
  { label: "Listening MCQ", value: "listening_mcq", type: "Audio Response" },
  { label: "Word Translation", value: "word_translation", type: "Word Pick" },
  {
    label: "Sentence Translation",
    value: "sentence_translation",
    type: "Visual Puzzle",
  },
  { label: "True False", value: "true_false", type: "Fact Check" },
  {
    label: "Fill in The Blanks",
    value: "fill_in_the_blanks",
    type: "Missing Word",
  },
  {
    label: "Listen & Assemble",
    value: "listen_and_assemble",
    type: "Audio Puzzle",
  },
  { label: "Match the Pair", value: "match_the_pair", type: "Link Words" },
  {
    label: "Writing Word Translation",
    value: "writing_word_translation",
    type: "Free Typing",
  },
  { label: "Identify Image", value: "identify_image", type: "Visual Pick" },
];

const optionQuestionTypes: QuizQuestionType[] = [
  "listening_mcq",
  "word_translation",
  "fill_in_the_blanks",
  "identify_image",
];

const sequenceQuestionTypes: QuizQuestionType[] = [
  "sentence_translation",
  "listen_and_assemble",
];

const createLocalId = () =>
  `question-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const getQuestionLabel = (questionType: QuizQuestionType) =>
  questionTypes.find((item) => item.value === questionType)?.label ||
  "Question";

const getQuestionMeta = (questionType: QuizQuestionType) =>
  questionTypes.find((item) => item.value === questionType) || questionTypes[0];

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

const normalizeCorrectBoolean = (value: unknown, fallback = true) => {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue === "true") {
      return true;
    }

    if (normalizedValue === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    return value === 1;
  }

  return fallback;
};

const createSnapshot = (form: QuestionForm) =>
  JSON.stringify({
    ...form,
    localId: undefined,
  });

const createDefaultOptions = (): QuizQuestionOption[] => [
  { optionText: "", isCorrect: true, sortOrder: 1 },
  { optionText: "", isCorrect: false, sortOrder: 2 },
  { optionText: "", isCorrect: false, sortOrder: 3 },
];

const createDefaultPairs = (): QuizQuestionPair[] => [
  {
    leftText: "",
    rightText: "",
    leftLabel: "Italian",
    rightLabel: "English",
    sortOrder: 1,
  },
];

const createDefaultSequenceItems = (): QuizQuestionSequenceItem[] => [
  { wordText: "", isRequired: true, sortOrder: 1 },
];

const createDefaultAcceptedAnswers = (): QuizQuestionAcceptedAnswer[] => [
  { answerText: "", isPrimary: true, sortOrder: 1 },
];

const createEmptyQuestionForm = (
  sortOrder: number,
  questionType: QuizQuestionType = "listening_mcq",
): QuestionForm => ({
  localId: createLocalId(),
  questionType,
  title: getInitialTitle(questionType),
  promptText: getInitialPromptText(questionType),
  helperText: getInitialHelperText(questionType),
  translationText: getInitialTranslationText(questionType),
  mediaFileId: "",
  generatedAudioText: "",
  correctBoolean: true,
  points: 1,
  sortOrder,
  status: "draft",
  options: optionQuestionTypes.includes(questionType)
    ? createDefaultOptions()
    : [],
  pairs: questionType === "match_the_pair" ? createDefaultPairs() : [],
  sequenceItems: sequenceQuestionTypes.includes(questionType)
    ? createDefaultSequenceItems()
    : [],
  acceptedAnswers:
    questionType === "writing_word_translation"
      ? createDefaultAcceptedAnswers()
      : [],
});

const createFormFromQuestion = (question: QuizQuestion): QuestionForm => {
  const sortedOptions = (question.options || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((option, index) => ({
      ...option,
      optionText: option.optionText || "",
      isCorrect: Boolean(option.isCorrect),
      sortOrder: option.sortOrder || index + 1,
    }));

  const sortedPairs = (question.pairs || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((pair, index) => ({
      ...pair,
      leftText: pair.leftText || "",
      rightText: pair.rightText || "",
      leftLabel: pair.leftLabel || "Italian",
      rightLabel: pair.rightLabel || "English",
      sortOrder: pair.sortOrder || index + 1,
    }));

  const sortedSequenceItems = (question.sequenceItems || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((item, index) => ({
      ...item,
      wordText: item.wordText || "",
      isRequired: Boolean(item.isRequired),
      sortOrder: item.sortOrder || index + 1,
    }));

  const sortedAcceptedAnswers = (question.acceptedAnswers || [])
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((answer, index) => ({
      ...answer,
      answerText: answer.answerText || "",
      isPrimary: Boolean(answer.isPrimary),
      sortOrder: answer.sortOrder || index + 1,
    }));

  return {
    id: question.id,
    localId: question.id,
    questionType: question.questionType,
    title: getInitialTitle(question.questionType, question.title || ""),
    promptText: getInitialPromptText(
      question.questionType,
      question.promptText || "",
    ),
    helperText: getInitialHelperText(
      question.questionType,
      question.helperText || "",
    ),
    translationText: getInitialTranslationText(
      question.questionType,
      question.translationText || "",
      question.promptText || "",
    ),
    mediaFileId: question.mediaFileId || "",
    generatedAudioText: question.generatedAudioText || "",
    correctBoolean: normalizeCorrectBoolean(question.correctBoolean, true),
    points: question.points || 1,
    sortOrder: question.sortOrder || 1,
    status: question.status || "draft",
    options: optionQuestionTypes.includes(question.questionType)
      ? sortedOptions.length
        ? sortedOptions
        : createDefaultOptions()
      : [],
    pairs:
      question.questionType === "match_the_pair"
        ? sortedPairs.length
          ? sortedPairs
          : createDefaultPairs()
        : [],
    sequenceItems: sequenceQuestionTypes.includes(question.questionType)
      ? sortedSequenceItems.length
        ? sortedSequenceItems
        : createDefaultSequenceItems()
      : [],
    acceptedAnswers:
      question.questionType === "writing_word_translation"
        ? sortedAcceptedAnswers.length
          ? sortedAcceptedAnswers
          : createDefaultAcceptedAnswers()
        : [],
  };
};

const createFlowItem = (question: QuestionForm): QuizFlowQuestionItem => ({
  id: question.id,
  localId: question.localId,
  title: question.title || getQuestionLabel(question.questionType),
  type: getQuestionMeta(question.questionType).type,
  questionType: question.questionType,
});

const cleanOptions = (options: QuizQuestionOption[]) =>
  options
    .filter((option) => option.optionText.trim())
    .map((option, index) => ({
      optionText: option.optionText.trim(),
      isCorrect: option.isCorrect,
      sortOrder: index + 1,
    }));

const cleanPairs = (pairs: QuizQuestionPair[]) =>
  pairs
    .filter((pair) => pair.leftText.trim() || pair.rightText.trim())
    .map((pair, index) => ({
      leftText: pair.leftText.trim(),
      rightText: pair.rightText.trim(),
      leftLabel: pair.leftLabel || "Italian",
      rightLabel: pair.rightLabel || "English",
      sortOrder: index + 1,
    }));

const cleanSequenceItems = (items: QuizQuestionSequenceItem[]) =>
  items
    .filter((item) => item.wordText.trim())
    .map((item, index) => ({
      wordText: item.wordText.trim(),
      isRequired: item.isRequired,
      sortOrder: index + 1,
    }));

const cleanAcceptedAnswers = (answers: QuizQuestionAcceptedAnswer[]) => {
  const cleanAnswers = answers.filter((answer) => answer.answerText.trim());
  const hasPrimaryAnswer = cleanAnswers.some((answer) => answer.isPrimary);

  return cleanAnswers.map((answer, index) => ({
    answerText: answer.answerText.trim(),
    isPrimary: answer.isPrimary || (!hasPrimaryAnswer && index === 0),
    sortOrder: index + 1,
  }));
};

const createPayloadFromForm = (form: QuestionForm): QuizQuestionPayload => {
  const payload: QuizQuestionPayload = {
    questionType: form.questionType,
    title: getInitialTitle(form.questionType, form.title).trim(),
    promptText: form.promptText.trim() || null,
    helperText:
      getInitialHelperText(form.questionType, form.helperText).trim() || null,
    translationText: form.translationText.trim() || null,
    mediaFileId: form.mediaFileId || null,
    generatedAudioText: form.generatedAudioText.trim() || null,
    points: Number(form.points) || 1,
    sortOrder: Number(form.sortOrder) || 1,
    status: form.status,
  };

  if (form.questionType === "listening_mcq") {
    payload.promptText = LISTENING_MCQ_PROMPT_TEXT;
    payload.helperText = null;
    payload.translationText = LISTENING_MCQ_TRANSLATION_TEXT;
  }

  if (form.questionType === "true_false") {
    payload.title = FIXED_QUESTION_PRESETS.true_false?.title || payload.title;
    payload.helperText = null;
  }

  if (form.questionType === "fill_in_the_blanks") {
    payload.title =
      FIXED_QUESTION_PRESETS.fill_in_the_blanks?.title || payload.title;
    payload.helperText =
      FIXED_QUESTION_PRESETS.fill_in_the_blanks?.helperText || null;
    payload.translationText = null;
  }

  if (form.questionType === "listen_and_assemble") {
    payload.title =
      FIXED_QUESTION_PRESETS.listen_and_assemble?.title || payload.title;
    payload.helperText =
      FIXED_QUESTION_PRESETS.listen_and_assemble?.helperText || null;
    payload.translationText = null;
  }

  if (form.questionType === "match_the_pair") {
    payload.title =
      FIXED_QUESTION_PRESETS.match_the_pair?.title || payload.title;
    payload.promptText = null;
    payload.helperText =
      FIXED_QUESTION_PRESETS.match_the_pair?.helperText || null;
    payload.translationText = null;
  }

  if (form.questionType === "writing_word_translation") {
    payload.title =
      FIXED_QUESTION_PRESETS.writing_word_translation?.title || payload.title;
    payload.promptText = null;
    payload.helperText =
      FIXED_QUESTION_PRESETS.writing_word_translation?.helperText || null;
  }

  if (form.questionType === "identify_image") {
    payload.title =
      FIXED_QUESTION_PRESETS.identify_image?.title || payload.title;
    payload.promptText = null;
    payload.helperText =
      FIXED_QUESTION_PRESETS.identify_image?.helperText || null;
    payload.translationText = null;
  }

  if (optionQuestionTypes.includes(form.questionType)) {
    payload.options = cleanOptions(form.options);
  }

  if (sequenceQuestionTypes.includes(form.questionType)) {
    payload.sequenceItems = cleanSequenceItems(form.sequenceItems);
  }

  if (form.questionType === "match_the_pair") {
    payload.pairs = cleanPairs(form.pairs);
  }

  if (form.questionType === "writing_word_translation") {
    payload.acceptedAnswers = cleanAcceptedAnswers(form.acceptedAnswers);
  }

  if (form.questionType === "true_false") {
    payload.correctBoolean = form.correctBoolean;
  }

  return payload;
};

export default function QuizBuilderClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("courseId") || "";
  const chapterId = searchParams.get("chapterId") || "";
  const lessonId = searchParams.get("lessonId") || "";
  const quizIdFromUrl = searchParams.get("quizId") || "";

  const [courseTitle, setCourseTitle] = useState("");
  const [lesson, setLesson] = useState<CourseLessonDetails | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
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

  const [isLoading, setIsLoading] = useState(true);
  const [isSavingQuestion, setIsSavingQuestion] = useState(false);
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const [mediaUrl, setMediaUrl] = useState("");
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
    if (!lessonId) {
      toast.error("Lesson ID is missing.");
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    const loadQuizBuilder = async () => {
      try {
        setIsLoading(true);

        const [lessonResponse, quizzesResponse, courseResponse] =
          await Promise.all([
            getLessonDetails(lessonId),
            getQuizzesByLesson(lessonId),
            courseId ? getCourseById(courseId) : Promise.resolve(null),
          ]);

        if (!isMounted) return;

        const existingQuiz =
          quizzesResponse.find((item) => item.id === quizIdFromUrl) ||
          quizzesResponse[0] ||
          null;

        const readyQuiz =
          existingQuiz ||
          (await createQuiz(lessonId, {
            title: lessonResponse.title || "Lesson Quiz",
            description: "Basic quiz for greetings lesson.",
            sortOrder: 1,
            status: "draft",
          }));

        const questionSummaries = readyQuiz.questions?.length
          ? readyQuiz.questions
              .slice()
              .sort((a, b) => a.sortOrder - b.sortOrder)
          : [];

        let loadedQuestions = questionSummaries.length
          ? questionSummaries.map(createFormFromQuestion)
          : [createEmptyQuestionForm(1)];

        if (loadedQuestions[0]?.id) {
          const firstQuestionDetails = await getQuizQuestionDetails(
            loadedQuestions[0].id,
          );

          loadedQuestions = [
            createFormFromQuestion(firstQuestionDetails),
            ...loadedQuestions.slice(1),
          ];
        }

        setLesson(lessonResponse);
        setCourseTitle(courseResponse?.title || "");
        setQuiz(readyQuiz);
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

    loadQuizBuilder();

    return () => {
      isMounted = false;
    };
  }, [courseId, lessonId, quizIdFromUrl]);

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
        if (!isMounted) return;

        setMediaUrl("");
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
      action();
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
              await getQuizQuestionDetails(selectedQuestion.id),
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

    const promptRequiredTypes: QuizQuestionType[] = [
      "listening_mcq",
      "word_translation",
      "sentence_translation",
      "true_false",
      "fill_in_the_blanks",
      "listen_and_assemble",
    ];

    if (
      promptRequiredTypes.includes(form.questionType) &&
      !form.promptText.trim()
    ) {
      toast.error("Question text is required.");
      return false;
    }

    if (
      form.questionType === "writing_word_translation" &&
      !form.translationText.trim()
    ) {
      toast.error("English helper text is required.");
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
    if (!quiz) {
      toast.error("Quiz ID is missing.");
      return;
    }

    if (!validateQuestion()) return;

    const toastId = toast.loading("Saving question...");

    try {
      setIsSavingQuestion(true);

      const payload: QuizQuestionPayload = createPayloadFromForm(form);

      const savedQuestion = form.id
        ? await updateQuizQuestion(form.id, payload)
        : await createQuizQuestion(quiz.id, payload);

      const detailedQuestion = createFormFromQuestion(
        await getQuizQuestionDetails(savedQuestion.id),
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
        await deleteQuizQuestion(form.id);
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

  const handlePublishQuiz = async () => {
    if (!quiz) {
      toast.error("Quiz ID is missing.");
      return;
    }

    if (hasUnsavedChanges) {
      toast.error("Save the current question before publishing the quiz.");
      return;
    }

    const toastId = toast.loading("Publishing quiz...");

    try {
      setIsPublishing(true);

      await updateQuiz(quiz.id, {
        title: quiz.title || lesson?.title || "Lesson Quiz",
        description: quiz.description || "Basic quiz for greetings lesson.",
        sortOrder: quiz.sortOrder || 1,
        status: quiz.status || "draft",
      });

      const publishedQuiz = await publishQuiz(quiz.id);

      setQuiz(publishedQuiz);
      toast.success("Quiz published successfully.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleBack = () => {
    guardedAction(() => {
      router.push(
        `/admin/course-directory/syllabus-builder/lesson-edit?courseId=${courseId}&chapterId=${chapterId}&lessonId=${lessonId}`,
      );
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center text-sm text-[#66736B]">
        Loading quiz builder...
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

    return (
      <InstructionalContentCard
        title={form.title}
        promptText={form.promptText}
        helperText={form.helperText}
        translationText={form.translationText}
        points={form.points}
        sortOrder={form.sortOrder}
        status={form.status}
        onTitleChange={(value) => updateForm("title", value)}
        onPromptTextChange={(value) => updateForm("promptText", value)}
        onHelperTextChange={(value) => updateForm("helperText", value)}
        onTranslationTextChange={(value) =>
          updateForm("translationText", value)
        }
        onPointsChange={(value) => updateForm("points", value)}
        onSortOrderChange={(value) => updateForm("sortOrder", value)}
        onStatusChange={(value) => updateForm("status", value)}
      />
    );
  };

  return (
    <>
      <div className="space-y-7">
        <QuizBuilderHeader
          courseTitle={courseTitle}
          chapterTitle={lesson?.chapter?.title}
          lessonTitle={lesson?.title}
          quizTitle={quiz?.title || lesson?.title}
          isPublishing={isPublishing}
          onBack={handleBack}
          onPublish={handlePublishQuiz}
        />

        <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
          <QuizFlowSidebar
            questions={flowQuestions}
            activeQuestionKey={activeQuestionKey}
            lessonTitle={lesson?.title}
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

      <UnsavedLessonWarningDialog
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
