import { FileText, Settings } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Link from "next/link";

export default function CVServiceHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#006B3F]">
        CV Service Dashboard
      </h1>
      <p className="mt-1 text-sm text-black/55">
        Overview of your CV Generation metrics and business performance.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <Link href="/admin/cv-service/templates">
          <Button variant="outline" rounded="full" size="sm">
            <FileText className="size-4" />
            Manage CV Templates
          </Button>
        </Link>

        <Button rounded="full" size="sm">
          <Settings className="size-4" />
          Configure Packages
        </Button>
      </div>
    </div>
  );
}
