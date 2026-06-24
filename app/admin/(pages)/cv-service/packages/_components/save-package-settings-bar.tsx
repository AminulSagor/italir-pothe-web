import { Loader2, Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

interface SavePackageSettingsBarProps {
  disabled: boolean;
  isSaving: boolean;
  onSave: () => void;
}

export default function SavePackageSettingsBar({
  disabled,
  isSaving,
  onSave,
}: SavePackageSettingsBarProps) {
  return (
    <Card padding="md" rounded="2xl" shadow="sm" className="bg-white">
      <div className="flex justify-end">
        <Button
          rounded="full"
          size="sm"
          className="min-w-[260px]"
          disabled={disabled || isSaving}
          onClick={onSave}
        >
          {isSaving ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Save className="size-4" />
          )}
          {isSaving ? "Saving Settings..." : "Save Package Settings"}
        </Button>
      </div>
    </Card>
  );
}
