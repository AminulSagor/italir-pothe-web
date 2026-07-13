export interface PublicNavigationItem {
  label: string;
  href: string;
}

export interface PublicFeature {
  title: string;
  description: string;
  icon:
    | "book-open"
    | "messages"
    | "briefcase"
    | "file-text"
    | "badge-check"
    | "trophy";
}

export interface PublicCourse {
  title: string;
  description: string;
  level: string;
  highlights: string[];
  icon: "languages" | "message-circle" | "briefcase-business" | "mic-2";
}

export interface WebinarCategory {
  title: string;
  description: string;
  icon: "presentation" | "messages-square" | "circle-help";
}
