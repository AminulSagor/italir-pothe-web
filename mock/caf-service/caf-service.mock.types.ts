import { LucideIcon } from "lucide-react";

export interface CafServiceCard {
    id: number;
    title: string;
    subtitle: string;
    tone: "purple" | "green" | "orange" | "blue";
    icon: LucideIcon;
}

export interface CafServiceRow extends CafServiceCard {
    linkedPage: "Page Built" | "Page Empty";
}