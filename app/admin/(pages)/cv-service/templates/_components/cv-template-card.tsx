import Image from "next/image";
import { Eye, Pencil, ShieldCheck, Star, Trash2 } from "lucide-react";

import Card from "@/components/UI/cards/card";

interface CVTemplateCardProps {
  template: {
    id: number;
    title: string;
    category: string;
    plan: string;
    image: string;
    status: string;
  };
}

export default function CVTemplateCard({ template }: CVTemplateCardProps) {
  const isPremium = template.plan === "Premium";
  const isActive = template.status === "Active";

  return (
    <Card padding="md" rounded="3xl" shadow="sm" className="bg-white">
      <div className="relative overflow-hidden rounded-2xl bg-[#0E3E34]">
        <Image
          src={template.image}
          alt={template.title}
          width={420}
          height={280}
          className="h-[180px] w-full object-cover"
        />

        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isPremium ? "bg-[#006B3F] text-white" : "bg-white text-[#006B3F]"
          }`}
        >
          {isPremium ? (
            <Star className="size-3 fill-white" />
          ) : (
            <ShieldCheck className="size-3 fill-[#006B3F]" />
          )}
          {template.plan}
        </span>
      </div>

      <div className="mt-5">
        <span className="rounded-full bg-[#E6F6F0] px-3 py-1 text-xs font-semibold uppercase text-[#007A4D]">
          {template.category}
        </span>

        <h2 className="mt-3 text-base font-bold text-[#202420]">
          {template.title}
        </h2>
      </div>

      <div className="mt-7 border-t border-black/5 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[#202420]">
            <button type="button">
              <Pencil className="size-4" />
            </button>
            <button type="button">
              <Eye className="size-4" />
            </button>
            <button type="button">
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold uppercase ${
                isActive ? "text-[#008542]" : "text-black/45"
              }`}
            >
              {template.status}
            </span>

            <button
              type="button"
              className={`relative h-6 w-11 rounded-full transition ${
                isActive ? "bg-[#56EF59]" : "bg-[#E1E5DF]"
              }`}
            >
              <span
                className={`absolute top-1 size-4 rounded-full bg-white transition ${
                  isActive ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
