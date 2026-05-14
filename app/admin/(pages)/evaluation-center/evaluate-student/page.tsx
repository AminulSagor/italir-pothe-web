import {
  audioSubmission,
  evaluationStats,
  evaluationStudentSummary,
  manualScores,
  writingTask,
} from "@/mock/evaluation-center/evaluate-student/evaluate-student.mock";

import AudioPlayerCard from "./_components/audio-player-card";
import BreadcrumbHeader from "./_components/breadcrumb-header";
import EvaluationStatCard from "./_components/evaluation-stat-card";
import ManualScoresCard from "./_components/manual-scores-card";
import StudentSummaryCard from "./_components/student-summary-card";
import WritingTaskCard from "./_components/writing-task-card";

export default function EvaluateStudentPage() {
  return (
    <div className="space-y-7">
      <BreadcrumbHeader />

      <h1 className="text-3xl font-bold text-[#006B3F]">Evaluation Board</h1>

      <StudentSummaryCard student={evaluationStudentSummary} />

      <div className="grid gap-6 lg:grid-cols-3">
        {evaluationStats.map((stat) => (
          <EvaluationStatCard key={stat.id} stat={stat} />
        ))}
      </div>

      <div className="grid items-start gap-6 xl:grid-cols-[1fr_300px]">
        <div className="space-y-6">
          <WritingTaskCard task={writingTask} />
          <AudioPlayerCard audio={audioSubmission} />
        </div>

        <ManualScoresCard scores={manualScores} />
      </div>
    </div>
  );
}
