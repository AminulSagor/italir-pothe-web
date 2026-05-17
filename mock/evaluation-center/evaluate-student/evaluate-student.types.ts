export interface EvaluationStudentSummary {
  name: string;
  level: string;
  totalExamTime: string;
  totalExamLimit: string;
  appActivity: string;
  status: string;
}

export interface EvaluationStat {
  id: number;
  title: string;
  value: string;
  helper?: string;
  image?: string;
  iconType?: "progress" | "time" | "submission";
}

export interface ManualScore {
  id: number;
  label: string;
  value: number;
}

export interface WritingTask {
  title: string;
  prompt: string;
  answer: string[];
}

export interface AudioSubmission {
  fileName: string;
  currentTime: string;
  duration: string;
  progress: number;
}
