"use client";

import { Plus } from "lucide-react";

import Button from "@/components/UI/buttons/button";

interface SurvivalItalianHeaderProps {
  onAdd?: () => void;
}

export default function SurvivalItalianHeader({
  onAdd,
}: SurvivalItalianHeaderProps) {
  return (
    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
      <div>
        <h1 className="text-3xl font-bold text-[#202420] md:text-4xl">
          Survival Italian Manager
        </h1>

        <p className="mt-2 text-sm text-[#5F675F] md:text-base">
          Curate essential survival scenarios and Bengali translations for
          students.
        </p>
      </div>

      <Button size="lg" className="gap-2 shadow-md" onClick={onAdd}>
        <Plus className="size-5" />
        Add New Situation
      </Button>
    </div>
  );
}
