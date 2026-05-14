import FinalExamGrid from "./_components/final-exam-grid";
import FinalExamHeader from "./_components/final-exam-header";
import FinalExamTabs from "./_components/final-exam-tabs";

const FinalExamManagerPage = () => {
  return (
    <div className="space-y-8">
      <FinalExamHeader />

      <FinalExamTabs />

      <FinalExamGrid />
    </div>
  );
};

export default FinalExamManagerPage;
