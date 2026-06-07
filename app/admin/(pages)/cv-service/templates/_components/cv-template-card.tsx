import Image from 'next/image';
import Link from 'next/link';
import { Eye, Pencil, ShieldCheck, Star, Trash2 } from 'lucide-react';

import Card from '@/components/UI/cards/card';
import type { CvTemplateItem } from '@/types/cv-template/cv_template_type';

interface CVTemplateCardProps {
  template: CvTemplateItem;
  onDelete: (templateId: string) => void;
}

const styleLabel: Record<string, string> = {
  ats: 'ATS FORMAT',
  modern_column: 'MODERN COLUMN',
  classic: 'CLASSIC',
  creative: 'CREATIVE',
};

export default function CVTemplateCard({ template, onDelete }: CVTemplateCardProps) {
  const isPremium = template.isPremium;
  const isActive = template.status === 'active';

  return (
    <Card padding="md" rounded="3xl" shadow="sm" className="bg-white">
      <div className="relative h-[180px] overflow-hidden rounded-2xl bg-[#0E3E34]">
        {template.previewImageUrl ? (
          <Image
            src={template.previewImageUrl}
            alt={template.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full flex-col justify-end bg-[#102A24] p-5 text-white">
            <p className="text-xl font-black">{template.title}</p>
            <p className="mt-2 text-xs text-white/70">{template.pageSize.toUpperCase()} • {template.fontFamily}</p>
          </div>
        )}

        <span
          className={`absolute right-3 top-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isPremium ? 'bg-[#006B3F] text-white' : 'bg-white text-[#006B3F]'
          }`}
        >
          {isPremium ? <Star className="size-3 fill-white" /> : <ShieldCheck className="size-3 fill-[#006B3F]" />}
          {isPremium ? 'Premium' : 'Free'}
        </span>
      </div>

      <div className="mt-5">
        <span className="rounded-full bg-[#E6F6F0] px-3 py-1 text-xs font-semibold uppercase text-[#007A4D]">
          {styleLabel[template.styleType] ?? template.styleType}
        </span>

        <h2 className="mt-3 text-base font-bold text-[#202420]">{template.title}</h2>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/55">
          {template.description || 'No description added.'}
        </p>
      </div>

      <div className="mt-7 border-t border-black/5 pt-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-[#202420]">
            <Link href={`/admin/cv-service/templates/builder?id=${template.id}`}>
              <Pencil className="size-4" />
            </Link>
            <Link href={`/admin/cv-service/templates/builder?id=${template.id}`}>
              <Eye className="size-4" />
            </Link>
            <button type="button" onClick={() => onDelete(template.id)}>
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase ${isActive ? 'text-[#008542]' : 'text-black/45'}`}>
              {template.status}
            </span>
            <span className={`relative h-6 w-11 rounded-full transition ${isActive ? 'bg-[#56EF59]' : 'bg-[#E1E5DF]'}`}>
              <span className={`absolute top-1 size-4 rounded-full bg-white transition ${isActive ? 'left-6' : 'left-1'}`} />
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
