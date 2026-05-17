import { IMAGE } from "@/constant/image.path";
import {
  AudioSubmission,
  EvaluationStat,
  EvaluationStudentSummary,
  ManualScore,
  WritingTask,
} from "./evaluate-student.types";

export const evaluationStudentSummary: EvaluationStudentSummary = {
  name: "Arif Hasan",
  level: "Level A1",
  totalExamTime: "42m",
  totalExamLimit: "60m",
  appActivity: "120h",
  status: "Active Submission",
};

export const evaluationStats: EvaluationStat[] = [
  {
    id: 1,
    title: "Course Progress",
    value: "78%",
    image: IMAGE.customer,
    iconType: "progress",
  },
  {
    id: 2,
    title: "Avg. Response Time",
    value: "1.4s",
    helper: "+12% vs last",
    iconType: "time",
  },
  {
    id: 3,
    title: "Last Submission",
    value: "Oct 24, 2023",
    iconType: "submission",
  },
];

export const writingTask: WritingTask = {
  title: "Writing Task",
  prompt: "Describe your favorite Italian city in 150 words.",
  answer: [
    "Ciao! Mi chiamo Arif. La mia città preferita è Firenze. Firenze è molto bella e antica. C'è il Duomo e molti musei. Mi piace camminare vicino al fiume Arno durante il tramonto.",
    "Il cibo a Firenze è delizioso, specialmente la bistecca alla fiorentina. La gente è simpatica e parla un italiano molto chiaro. Vorrei tornare a Firenze l'anno prossimo con la mia famiglia per vedere di nuovo il David di Michelangelo.",
    "Firenze è il cuore del Rinascimento e ogni angolo racconta una storia incredibile. È una città che non si dimentica facilmente.",
  ],
};

export const audioSubmission: AudioSubmission = {
  fileName: "Speaking Task Submission.mp3",
  currentTime: "01:42",
  duration: "02:30",
  progress: 68,
};

export const manualScores: ManualScore[] = [
  {
    id: 1,
    label: "Vocabulary Usage (0–100)",
    value: 89,
  },
  {
    id: 2,
    label: "Grammar Accuracy (0–100)",
    value: 70,
  },
  {
    id: 3,
    label: "Fluency & Pronunciation (0–100)",
    value: 90,
  },
];
