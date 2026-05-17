import { SurvivalSituation, SurvivalStat } from "./survival-italian.types";

export const survivalStatsMock: SurvivalStat[] = [
  {
    id: 1,
    title: "TOTAL SITUATIONS",
    value: "24",
    icon: "📄",
    iconBg: "bg-[#DDF3E8]",
  },
  {
    id: 2,
    title: "PDFS ATTACHED",
    value: "18/24",
    icon: "🖼️",
    iconBg: "bg-[#F8ECD7]",
  },
  {
    id: 3,
    title: "MISSING BENGALI",
    value: "2",
    icon: "🌐",
    iconBg: "bg-[#DDEEEE]",
  },
  {
    id: 4,
    title: "COMPLETION",
    value: "75%",
    icon: "📈",
    iconBg: "bg-[#F0DDF0]",
  },
];

export const survivalSituationsMock: SurvivalSituation[] = [
  {
    id: 1,
    icon: "🕐",
    iconBg: "bg-[#F8ECD7]",
    situationName: "First 24 Hours",
    bengaliSubtitle: "প্রথম ২৪ ঘণ্টা",
    pdfStatus: "attached",
    pdfName: "day1_guide.pdf",
  },
  {
    id: 2,
    icon: "🚌",
    iconBg: "bg-[#DDEEEE]",
    situationName: "Taking a Bus",
    bengaliSubtitle: "বাসে চড়া",
    pdfStatus: "attached",
    pdfName: "bus_guide.pdf",
  },
  {
    id: 3,
    icon: "🛒",
    iconBg: "bg-[#DDF3E8]",
    situationName: "Grocery Store",
    bengaliSubtitle: "মুদি দোকান",
    pdfStatus: "missing",
  },
  {
    id: 4,
    icon: "💊",
    iconBg: "bg-[#F0DDF0]",
    situationName: "At the Pharmacy",
    bengaliSubtitle: "Needs translation",
    pdfStatus: "attached",
    pdfName: "pharmacy.pdf",
  },
];
