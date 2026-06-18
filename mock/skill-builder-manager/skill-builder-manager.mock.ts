import { CareerTrack } from "./skill-builder-manager.types";

export const careerTracksMock: CareerTrack[] = [
  {
    id: 1,
    title: "Restaurant Job",
    description:
      "Hospitality and service vocabulary tailored for fine dining and casual eateries in Italy.",
    modules: 4,
    sentences: 85,
    updatedAgo: "2d ago",
    iconBg: "bg-[#F8ECD7]",
    icon: "🍽️",
  },
  {
    id: 2,
    title: "Kitchen Job",
    description:
      "Technical kitchen terminology, safety protocols, and brigade communication essentials.",
    modules: 6,
    sentences: 120,
    updatedAgo: "5d ago",
    iconBg: "bg-[#DDEEEE]",
    icon: "🍜",
  },
  {
    id: 3,
    title: "Supermarket",
    description:
      "Inventory management, customer interaction, and checkout register operational phrases.",
    modules: 3,
    sentences: 62,
    updatedAgo: "1w ago",
    iconBg: "bg-[#E4EEF7]",
    icon: "🏪",
  },
  {
    id: 4,
    title: "Logistics Center",
    description:
      "Focus on shipping manifests, warehouse navigation, and safety signage comprehension.",
    modules: 5,
    sentences: 94,
    updatedAgo: "3d ago",
    iconBg: "bg-[#EADDF0]",
    icon: "🚚",
  },
];
