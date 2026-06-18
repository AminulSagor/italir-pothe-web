import type {
  FinalExamQuestion,
  FinalExamQuestionPayload,
  FinalExamQuestionStatus,
} from "@/types/final-exam/final-exam.type";
import type {
  QuizQuestionAcceptedAnswer,
  QuizQuestionOption,
  QuizQuestionPair,
  QuizQuestionSequenceItem,
  QuizQuestionType,
} from "@/types/course-directory/quiz.type";
import type { QuizFlowQuestionItem } from "@/app/admin/(pages)/course-directory/syllabus-builder/lesson-edit/quiz-builder/_components/quiz-flow-sidebar";

export interface QuestionForm {
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
  status: FinalExamQuestionStatus;
  options: QuizQuestionOption[];
  pairs: QuizQuestionPair[];
  sequenceItems: QuizQuestionSequenceItem[];
  acceptedAnswers: QuizQuestionAcceptedAnswer[];
}

export const questionTypes: {
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

export const optionQuestionTypes: QuizQuestionType[] = [
  "listening_mcq",
  "word_translation",
  "fill_in_the_blanks",
  "identify_image",
];

export const audioQuestionTypes: QuizQuestionType[] = [
  "listening_mcq",
  "listen_and_assemble",
];

export const sequenceQuestionTypes: QuizQuestionType[] = [
  "sentence_translation",
  "listen_and_assemble",
];

const LISTENING_MCQ_TITLE = "Listening MCQ";
const LISTENING_MCQ_PROMPT_TEXT = "Listen carefully to the dialogue";
const LISTENING_MCQ_TRANSLATION_TEXT = "সংলাপটি মনোযোগ দিয়ে শুনুন";

const SENTENCE_TRANSLATION_TITLE = "Translate this sentence";
const TRUE_FALSE_TITLE = "Find out true or false";
const FILL_BLANKS_TITLE = "Complete the sentence";
const FILL_BLANKS_HELPER_TEXT = "Select the correct option to fill the blank.";
const LISTEN_ASSEMBLE_TITLE = "Listen and assemble the sentence";
const LISTEN_ASSEMBLE_HELPER_TEXT =
  "Listen to the audio and assemble the sentence.";
const MATCH_PAIR_TITLE = "Match the pairs";
const MATCH_PAIR_HELPER_TEXT =
  "Connect the Italian words to their English meanings.";
const WRITING_WORD_TITLE = "Translate this word";
const WRITING_WORD_HELPER_TEXT = "Type your answer in Italian.";
const IDENTIFY_IMAGE_TITLE = "Identify the object";
const IDENTIFY_IMAGE_HELPER_TEXT = "Select the correct Italian word.";

const createLocalId = () =>
  `exam-question-${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const getQuestionLabel = (questionType: QuizQuestionType) =>
  questionTypes.find((item) => item.value === questionType)?.label ||
  "Question";

export const getQuestionMeta = (questionType: QuizQuestionType) =>
  questionTypes.find((item) => item.value === questionType) || questionTypes[0];

export const createSnapshot = (form: QuestionForm) =>
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

const getPresetTitle = (questionType: QuizQuestionType) => {
  if (questionType === "listening_mcq") return LISTENING_MCQ_TITLE;
  if (questionType === "sentence_translation")
    return SENTENCE_TRANSLATION_TITLE;
  if (questionType === "true_false") return TRUE_FALSE_TITLE;
  if (questionType === "fill_in_the_blanks") return FILL_BLANKS_TITLE;
  if (questionType === "listen_and_assemble") return LISTEN_ASSEMBLE_TITLE;
  if (questionType === "match_the_pair") return MATCH_PAIR_TITLE;
  if (questionType === "writing_word_translation") return WRITING_WORD_TITLE;
  if (questionType === "identify_image") return IDENTIFY_IMAGE_TITLE;

  return getQuestionLabel(questionType);
};

const getPresetHelperText = (questionType: QuizQuestionType) => {
  if (questionType === "listening_mcq") return "";
  if (questionType === "true_false") return "";
  if (questionType === "fill_in_the_blanks") return FILL_BLANKS_HELPER_TEXT;
  if (questionType === "listen_and_assemble")
    return LISTEN_ASSEMBLE_HELPER_TEXT;
  if (questionType === "match_the_pair") return MATCH_PAIR_HELPER_TEXT;
  if (questionType === "writing_word_translation")
    return WRITING_WORD_HELPER_TEXT;
  if (questionType === "identify_image") return IDENTIFY_IMAGE_HELPER_TEXT;

  return "";
};

export const createEmptyQuestionForm = (
  sortOrder: number,
  questionType: QuizQuestionType = "listening_mcq",
): QuestionForm => ({
  localId: createLocalId(),
  questionType,
  title: getPresetTitle(questionType),
  promptText: questionType === "listening_mcq" ? LISTENING_MCQ_PROMPT_TEXT : "",
  helperText: getPresetHelperText(questionType),
  translationText:
    questionType === "listening_mcq" ? LISTENING_MCQ_TRANSLATION_TEXT : "",
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

const normalizeOptions = (options: QuizQuestionOption[] = []) =>
  options
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((option, index) => ({
      ...option,
      optionText: option.optionText || "",
      isCorrect: Boolean(option.isCorrect),
      sortOrder: option.sortOrder || index + 1,
    }));

const normalizePairs = (pairs: QuizQuestionPair[] = []) =>
  pairs
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

const normalizeSequenceItems = (items: QuizQuestionSequenceItem[] = []) =>
  items
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((item, index) => ({
      ...item,
      wordText:
        item.wordText ||
        (item as QuizQuestionSequenceItem & { itemText?: string }).itemText ||
        "",
      isRequired: Boolean(item.isRequired),
      sortOrder: item.sortOrder || index + 1,
    }));

const normalizeAcceptedAnswers = (answers: QuizQuestionAcceptedAnswer[] = []) =>
  answers
    .slice()
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
    .map((answer, index) => ({
      ...answer,
      answerText: answer.answerText || "",
      isPrimary: Boolean(answer.isPrimary),
      sortOrder: answer.sortOrder || index + 1,
    }));

export const createFormFromQuestion = (
  question: FinalExamQuestion,
): QuestionForm => {
  const questionType = question.questionType as QuizQuestionType;
  const isListeningMcq = questionType === "listening_mcq";

  return {
    id: question.id,
    localId: question.id,
    questionType,
    title: question.title || getPresetTitle(questionType),
    promptText: isListeningMcq
      ? LISTENING_MCQ_PROMPT_TEXT
      : question.promptText || "",
    helperText: isListeningMcq ? "" : question.helperText || "",
    translationText: isListeningMcq
      ? LISTENING_MCQ_TRANSLATION_TEXT
      : question.translationText || "",
    mediaFileId:
      question.mediaFileId ||
      question.audioFileId ||
      question.imageFileId ||
      "",
    generatedAudioText: question.generatedAudioText || "",
    correctBoolean: Boolean(question.correctBoolean),
    points: question.points || 1,
    sortOrder: question.sortOrder || 1,
    status: question.status || "draft",
    options: optionQuestionTypes.includes(questionType)
      ? normalizeOptions(question.options).length
        ? normalizeOptions(question.options)
        : createDefaultOptions()
      : [],
    pairs:
      questionType === "match_the_pair"
        ? normalizePairs(question.pairs).length
          ? normalizePairs(question.pairs)
          : createDefaultPairs()
        : [],
    sequenceItems: sequenceQuestionTypes.includes(questionType)
      ? normalizeSequenceItems(question.sequenceItems).length
        ? normalizeSequenceItems(question.sequenceItems)
        : createDefaultSequenceItems()
      : [],
    acceptedAnswers:
      questionType === "writing_word_translation"
        ? normalizeAcceptedAnswers(question.acceptedAnswers).length
          ? normalizeAcceptedAnswers(question.acceptedAnswers)
          : createDefaultAcceptedAnswers()
        : [],
  };
};

export const createFlowItem = (
  question: QuestionForm,
): QuizFlowQuestionItem => ({
  id: question.id,
  localId: question.localId,
  title: question.title || getQuestionLabel(question.questionType),
  type: getQuestionMeta(question.questionType).type,
  questionType: question.questionType,
});

export const cleanOptions = (options: QuizQuestionOption[]) =>
  options
    .filter((option) => option.optionText.trim())
    .map((option, index) => ({
      optionText: option.optionText.trim(),
      isCorrect: option.isCorrect,
      sortOrder: index + 1,
    }));

export const cleanPairs = (pairs: QuizQuestionPair[]) =>
  pairs
    .filter((pair) => pair.leftText.trim() || pair.rightText.trim())
    .map((pair, index) => ({
      leftText: pair.leftText.trim(),
      rightText: pair.rightText.trim(),
      leftLabel: pair.leftLabel || "Italian",
      rightLabel: pair.rightLabel || "English",
      sortOrder: index + 1,
    }));

export const cleanSequenceItems = (items: QuizQuestionSequenceItem[]) =>
  items
    .filter((item) => item.wordText.trim())
    .map((item, index) => ({
      wordText: item.wordText.trim(),
      isRequired: item.isRequired,
      sortOrder: index + 1,
    }));

export const cleanAcceptedAnswers = (answers: QuizQuestionAcceptedAnswer[]) =>
  answers
    .filter((answer) => answer.answerText.trim())
    .map((answer, index) => ({
      answerText: answer.answerText.trim(),
      isPrimary: answer.isPrimary,
      sortOrder: index + 1,
    }));

export const createPayloadFromForm = (
  form: QuestionForm,
): FinalExamQuestionPayload => {
  const payload: FinalExamQuestionPayload = {
    questionType: form.questionType,
    title: getPresetTitle(form.questionType),
    promptText: form.promptText.trim() || null,
    helperText: form.helperText.trim() || null,
    translationText: form.translationText.trim() || null,
    mediaFileId: form.mediaFileId || null,
    generatedAudioText: form.generatedAudioText.trim() || null,
    correctBoolean:
      form.questionType === "true_false" ? form.correctBoolean : null,
    points: Number(form.points) || 1,
    sortOrder: Number(form.sortOrder) || 1,
    status: form.status,
  };

  if (form.questionType === "listening_mcq") {
    payload.promptText = LISTENING_MCQ_PROMPT_TEXT;
    payload.translationText = LISTENING_MCQ_TRANSLATION_TEXT;
    payload.helperText = null;
  }

  if (form.questionType === "true_false") {
    payload.title = TRUE_FALSE_TITLE;
    payload.helperText = null;
  }

  if (form.questionType === "fill_in_the_blanks") {
    payload.title = FILL_BLANKS_TITLE;
    payload.helperText = FILL_BLANKS_HELPER_TEXT;
  }

  if (form.questionType === "listen_and_assemble") {
    payload.title = LISTEN_ASSEMBLE_TITLE;
    payload.helperText = LISTEN_ASSEMBLE_HELPER_TEXT;
    payload.translationText = null;
  }

  if (form.questionType === "match_the_pair") {
    payload.title = MATCH_PAIR_TITLE;
    payload.promptText = null;
    payload.translationText = null;
    payload.helperText = MATCH_PAIR_HELPER_TEXT;
  }

  if (form.questionType === "writing_word_translation") {
    payload.title = WRITING_WORD_TITLE;
    payload.promptText = null;
    payload.helperText = WRITING_WORD_HELPER_TEXT;
  }

  if (form.questionType === "identify_image") {
    payload.title = IDENTIFY_IMAGE_TITLE;
    payload.promptText = null;
    payload.translationText = null;
    payload.helperText = IDENTIFY_IMAGE_HELPER_TEXT;
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

  return payload;
};
