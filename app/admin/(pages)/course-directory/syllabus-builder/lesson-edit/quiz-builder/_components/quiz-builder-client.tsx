"use client";

import { useState } from "react";

import { QuizBuilderMock } from "@/mock/quiz-builder/quiz-builder.types";

import AnswerOptionsCard from "./question-types/answer-options-card";
import AudioMediaCard from "./question-types/audio-media-card";
import InstructionalContentCard from "./question-types/instructional-content-card";
import QuestionConfigurationHeader from "./question-configuration-header";
import QuizActionPanel from "./quiz-action-panel";
import QuizBuilderHeader from "./quiz-builder-header";
import QuizFlowSidebar from "./quiz-flow-sidebar";
import SentenceTranslationQuestionConfig from "./question-types/sentence-translation-question-config";
import WordTranslationQuestionConfig from "./question-types/word-translation-question-config";
import FillBlanksQuestionConfig from "./question-types/fill-blanks-question-config";
import ListenAssembleQuestionConfig from "./question-types/listen-assemble-question-config";
import TrueFalseQuestionConfig from "./question-types/true-false-question-config";
import MatchPairQuestionConfig from "./question-types/match-pair-question-config";
import IdentifyImageQuestionConfig from "./question-types/identify-image-question-config";
import IdentifyImageMcqQuestionConfig from "./question-types/identify-image-mcq-question-config";

interface QuizBuilderClientProps {
  data: QuizBuilderMock;
}

export default function QuizBuilderClient({ data }: QuizBuilderClientProps) {
  const [activeQuestionId, setActiveQuestionId] = useState(1);

  const activeQuestion =
    data.flowQuestions.find((question) => question.id === activeQuestionId) ??
    data.flowQuestions[0];

  const isListening = activeQuestion.questionType === "listening";
  const isWordTranslation = activeQuestion.questionType === "word_translation";
  const isSentenceTranslation =
    activeQuestion.questionType === "sentence_translation";
  const isTrueFalse = activeQuestion.questionType === "true_false";
  const isFillBlanks = activeQuestion.questionType === "fill_blanks";
  const isListenAssemble = activeQuestion.questionType === "listen_assemble";
  const isMatchPair = activeQuestion.questionType === "match_pair";
  const isWritingWord = activeQuestion.questionType === "writing_word";
  const isIdentifyImage = activeQuestion.questionType === "identify_image";

  return (
    <div className="space-y-7">
      <QuizBuilderHeader />

      <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)] xl:items-start">
        <QuizFlowSidebar
          questions={data.flowQuestions}
          activeQuestionId={activeQuestionId}
          onQuestionSelect={setActiveQuestionId}
        />

        <div className="space-y-6">
          <QuestionConfigurationHeader
            title={`${activeQuestion.title} Configuration`}
            format={activeQuestion.title}
          />

          {isListening && (
            <>
              <InstructionalContentCard mainTitle="What did the speaker order?" />
              <AudioMediaCard />
              <AnswerOptionsCard options={data.answerOptions} />
            </>
          )}

          {isWordTranslation && <WordTranslationQuestionConfig />}

          {isSentenceTranslation && <SentenceTranslationQuestionConfig />}

          {isTrueFalse && <TrueFalseQuestionConfig />}
          {isFillBlanks && <FillBlanksQuestionConfig />}
          {isListenAssemble && <ListenAssembleQuestionConfig />}
          {isMatchPair && <MatchPairQuestionConfig />}
          {isWritingWord && <IdentifyImageQuestionConfig />}
          {isIdentifyImage && <IdentifyImageMcqQuestionConfig />}

          <QuizActionPanel />
        </div>
      </div>
    </div>
  );
}
