import ListeningMiniQuizBuilderClient from "./_components/listening-mini-quiz-builder-client";

import { listeningMiniQuizMock } from "@/mock/final-exam-manager/listening-mini-quiz.mock";

const MiniQuizManagerPage = () => {
  return <ListeningMiniQuizBuilderClient data={listeningMiniQuizMock} />;
};

export default MiniQuizManagerPage;
