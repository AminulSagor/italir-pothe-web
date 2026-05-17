export type CertificationTab = "issue-certificate" | "request-retake";

export interface CertificationStudent {
  name: string;
  level: string;
  passedScore: number;
  retakeScore: number;
  certificateId: string;
  issueDate: string;
}

export interface FeedbackSummary {
  keyStrength: string;
  criticalGap: string;
}

export interface CertificationBottomStat {
  id: number;
  label: string;
  value: string;
  iconType: "time" | "reliability";
}
