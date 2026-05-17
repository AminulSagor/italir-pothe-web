import { Save } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";

export default function SavePackageSettingsBar() {
  return (
    <Card padding="md" rounded="2xl" shadow="sm" className="bg-white">
      <div className="flex justify-end">
        <Button rounded="full" size="sm" className="min-w-[260px]">
          <Save className="size-4" />
          Save Package Settings
        </Button>
      </div>
    </Card>
  );
}
