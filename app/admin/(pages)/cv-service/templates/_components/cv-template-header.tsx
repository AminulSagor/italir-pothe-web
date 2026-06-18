import { Plus } from 'lucide-react';
import Link from 'next/link';

import Button from '@/components/UI/buttons/button';
import BackButton from '@/components/UI/buttons/back-button';

export default function CVTemplateHeader() {
  return (
    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
      <div className="flex items-start gap-3">
        <BackButton />

        <div>
          <h1 className="text-3xl font-bold text-[#006B3F]">
            CV Template Manager
          </h1>
          <p className="mt-1 text-sm text-black/60">
            Create reusable CV templates with controlled layout, fonts, page size,
            colors, and required user input sections.
          </p>
        </div>
      </div>

      <Link href="/admin/cv-service/templates/builder">
        <Button rounded="full" size="lg" className="min-w-[220px] shadow-lg">
          <Plus className="size-5" />
          Schedule New Template
        </Button>
      </Link>
    </div>
  );
}
