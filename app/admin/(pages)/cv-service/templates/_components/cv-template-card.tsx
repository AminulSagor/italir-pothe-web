'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, ShieldCheck, Star, Trash2 } from 'lucide-react';

import Card from '@/components/UI/cards/card';
import { service_URL } from '@/config/env';
import type { CvTemplateItem, CvTemplateStatus } from '@/types/cv-template/cv_template_type';

import CvTemplateVisualThumbnail from './cv-template-visual-thumbnail';

interface CVTemplateCardProps {
  template: CvTemplateItem;
  onDelete: (templateId: string) => void;
  onStatusChange: (templateId: string, status: CvTemplateStatus) => void;
  isUpdatingStatus?: boolean;
}

const styleLabel: Record<string, string> = {
  modern_column: 'MODERN COLUMN',
  classic: 'CLASSIC',
};

const normalizePreviewImageUrl = (value: string) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return '';
  if (/^(https?:|data:|blob:)/i.test(trimmedValue)) return trimmedValue;
  if (trimmedValue.startsWith('//')) return `https:${trimmedValue}`;

  const baseUrl = service_URL.replace(/\/$/, '');
  return `${baseUrl}/${trimmedValue.replace(/^\/+/, '')}`;
};

const getPreviewImageUrl = (template: CvTemplateItem) => {
  const templateWithAliases = template as CvTemplateItem & {
    thumbnailUrl?: string | null;
    thumbnailImageUrl?: string | null;
    imageUrl?: string | null;
  };

  const rawUrl =
    template.previewImageUrl ||
    templateWithAliases.thumbnailUrl ||
    templateWithAliases.thumbnailImageUrl ||
    templateWithAliases.imageUrl ||
    '';

  return normalizePreviewImageUrl(rawUrl);
};

export default function CVTemplateCard({
  template,
  onDelete,
  onStatusChange,
  isUpdatingStatus = false,
}: CVTemplateCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const isPremium = template.isPremium;
  const isActive = template.status === 'active';
  const nextStatus: CvTemplateStatus = isActive ? 'draft' : 'active';
  const previewImageUrl = getPreviewImageUrl(template);
  const shouldShowPreviewImage = previewImageUrl.length > 0 && !imageFailed;

  return (
    <Card padding="md" rounded="3xl" shadow="sm" className="bg-white">
      <div className="relative h-[360px] min-h-[360px] max-h-[360px] overflow-hidden rounded-2xl border border-black/5 bg-[#F6F7F4]">
        {shouldShowPreviewImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={previewImageUrl}
            alt={template.title}
            className="absolute inset-0 h-full w-full object-contain p-3"
            referrerPolicy="no-referrer"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <CvTemplateVisualThumbnail template={template} />
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
            <Link href={`/admin/cv-service/templates/builder?id=${template.id}`} aria-label="Edit template">
              <Pencil className="size-4" />
            </Link>
            <button type="button" onClick={() => onDelete(template.id)} aria-label="Delete template">
              <Trash2 className="size-4" />
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-bold uppercase ${isActive ? 'text-[#008542]' : 'text-black/45'}`}>
              {isActive ? 'active' : 'draft'}
            </span>
            <button
              type="button"
              disabled={isUpdatingStatus}
              onClick={() => onStatusChange(template.id, nextStatus)}
              className={`relative h-6 w-11 rounded-full transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isActive ? 'bg-[#56EF59]' : 'bg-[#E1E5DF]'
              }`}
              aria-label={`Set template as ${nextStatus}`}
            >
              <span className={`absolute top-1 size-4 rounded-full bg-white transition ${isActive ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
