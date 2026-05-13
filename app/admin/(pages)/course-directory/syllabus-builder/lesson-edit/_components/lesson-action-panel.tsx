import { Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";

export default function LessonActionPanel() {
  return (
    <div className="space-y-5">
      <Button size="lg" className="w-full gap-2">
        <Save className="size-4" />
        Save Lesson Content
      </Button>

      <button className="w-full text-sm font-semibold text-red-600">
        Discard Changes
      </button>
    </div>
  );
}
