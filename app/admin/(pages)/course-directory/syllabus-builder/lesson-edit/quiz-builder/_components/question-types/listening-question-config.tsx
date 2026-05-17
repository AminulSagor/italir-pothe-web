import { QuizAnswerOptionMock } from "@/mock/quiz-builder/quiz-builder.types";

import AnswerOptionsCard from "./answer-options-card";
import AudioMediaCard from "./audio-media-card";
import InstructionalContentCard from "./instructional-content-card";

interface ListeningQuestionConfigProps {
  options: QuizAnswerOptionMock[];
}

export default function ListeningQuestionConfig({
  options,
}: ListeningQuestionConfigProps) {
  return (
    <>
      <InstructionalContentCard mainTitle="What did the speaker order?" />
      <AudioMediaCard />
      <AnswerOptionsCard options={options} />
    </>
  );
}
