import AddNextQuestionCard from "./add-next-question-card";
import MiniQuizQuestionItem from "./mini-quiz-question-item";

export interface MiniQuizSidebarQuestion {
  localId: string;
  title: string;
  subtitle: string;
}

interface ModuleQuestionsSidebarProps {
  questions: MiniQuizSidebarQuestion[];
  activeQuestionKey: string;
  onQuestionSelect: (localId: string) => void;
  onAddQuestion: () => void;
}

const ModuleQuestionsSidebar = ({
  questions,
  activeQuestionKey,
  onQuestionSelect,
  onAddQuestion,
}: ModuleQuestionsSidebarProps) => {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#006B3F]">
            Module Questions
          </h2>

          <div className="mt-2 inline-flex rounded-full bg-[#E6F8E7] px-3 py-1 text-xs font-semibold text-[#0A7C3E]">
            {questions.length} Total
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {questions.map((question, index) => (
          <MiniQuizQuestionItem
            key={question.localId}
            questionNumber={index + 1}
            title={question.title}
            subtitle={question.subtitle}
            active={question.localId === activeQuestionKey}
            onClick={() => onQuestionSelect(question.localId)}
          />
        ))}

        <AddNextQuestionCard onClick={onAddQuestion} />
      </div>
    </div>
  );
};

export default ModuleQuestionsSidebar;
