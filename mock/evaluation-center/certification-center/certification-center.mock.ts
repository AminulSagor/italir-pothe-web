import {
  CertificationBottomStat,
  CertificationStudent,
  FeedbackSummary,
} from "./certification-center.types";

export const certificationStudent: CertificationStudent = {
  name: "Arif Hasan",
  level: "Level A1",
  passedScore: 92,
  retakeScore: 68,
  certificateId: "ITA-2024-00921",
  issueDate: "October 24, 2024",
};

export const feedbackSummary: FeedbackSummary = {
  keyStrength: "Strong reading comprehension and basic sentence structure.",
  criticalGap:
    "Difficulty with irregular verb conjugations in the present tense.",
};

export const certificationBottomStats: CertificationBottomStat[] = [
  {
    id: 1,
    label: "Evaluation Time",
    value: "14 Minutes",
    iconType: "time",
  },
  {
    id: 2,
    label: "Score Reliability",
    value: "High (98%)",
    iconType: "reliability",
  },
];
