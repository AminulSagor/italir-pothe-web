"use client";

import { useState } from "react";

import ModuleQuestionsSidebar from "./module-questions-sidebar";
import ListeningMiniQuizBuilderHeader from "./listening-mini-quiz-builder-header";
import QuestionEditorCard from "./question-editor-card";

import {
  AudioSourceType,
  ListeningMiniQuizData,
} from "@/mock/final-exam-manager/listening-mini-quiz.types";

interface Props {
  data: ListeningMiniQuizData;
}

const ListeningMiniQuizBuilderClient = ({ data }: Props) => {
  const [audioSource, setAudioSource] =
    useState<AudioSourceType>("manual_upload");

  return (
    <div className="space-y-7">
      <ListeningMiniQuizBuilderHeader />

      <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:items-start">
        <ModuleQuestionsSidebar data={data} />

        <QuestionEditorCard
          data={data}
          audioSource={audioSource}
          onAudioSourceChange={setAudioSource}
        />
      </div>
    </div>
  );
};

export default ListeningMiniQuizBuilderClient;
