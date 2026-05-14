export interface EvaluationStat {
  id: number;
  title: string;
  value: string;
  subtitle: string;
  icon: string;
  iconBg: string;
}

export interface EvaluationStudent {
  id: number;
  name: string;
  email: string;
  avatar: string;
  avatarBg: string;
  level: string;
  submissionDate: string;
  timeInQueue: string;
  status: "Retake Requested" | "Evaluated" | "Awaiting Review";
  actionLabel: string;
  actionDisabled?: boolean;
}
