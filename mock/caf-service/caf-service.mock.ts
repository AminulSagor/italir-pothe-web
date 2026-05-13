import { BriefcaseBusiness, FileText, Landmark, Scale } from "lucide-react";
import { CafServiceCard, CafServiceRow } from "./caf-service.mock.types";

export const cafPreviewServices: CafServiceCard[] = [
    {
        id: 1,
        title: "Permesso",
        subtitle: "In Progress",
        tone: "purple",
        icon: FileText,
    },
    {
        id: 2,
        title: "Tessera Sanitaria",
        subtitle: "Active",
        tone: "green",
        icon: BriefcaseBusiness,
    },
    {
        id: 3,
        title: "Ministry Justice",
        subtitle: "Review",
        tone: "orange",
        icon: Scale,
    },
    {
        id: 4,
        title: "Bangladesh Passport",
        subtitle: "Official",
        tone: "blue",
        icon: Landmark,
    },
];

export const cafServiceRows: CafServiceRow[] = [
    {
        ...cafPreviewServices[0],
        linkedPage: "Page Built",
    },
    {
        ...cafPreviewServices[3],
        linkedPage: "Page Built",
    },
    {
        ...cafPreviewServices[2],
        linkedPage: "Page Empty",
    },
];