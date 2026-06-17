'use client';

import { useEffect, useState } from 'react';

import { deleteCvTemplate, getCvTemplates, updateCvTemplateStatus } from '@/service/cv-template/cv_template';
import type { CvTemplateItem, CvTemplateStatus } from '@/types/cv-template/cv_template_type';

import CVTemplateCard from './cv-template-card';

export default function CVTemplateGrid() {
  const [templates, setTemplates] = useState<CvTemplateItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await getCvTemplates(1, 50);
      setTemplates(response.templates);
    } catch (apiError) {
      setError(
        apiError instanceof Error ? apiError.message : 'Templates could not be loaded.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTemplates();
  }, []);


  const handleStatusChange = async (templateId: string, status: CvTemplateStatus) => {
    setUpdatingStatusId(templateId);
    setError(null);

    try {
      const response = await updateCvTemplateStatus(templateId, status);
      setTemplates((current) =>
        current.map((item) =>
          item.id === templateId ? response.template : item,
        ),
      );
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Status update failed.');
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const handleDelete = async (templateId: string) => {
    const confirmed = window.confirm('Delete this CV template?');
    if (!confirmed) return;

    try {
      await deleteCvTemplate(templateId);
      setTemplates((current) => current.filter((item) => item.id !== templateId));
    } catch (apiError) {
      setError(apiError instanceof Error ? apiError.message : 'Delete failed.');
    }
  };

  if (isLoading) {
    return <div className="rounded-3xl bg-white p-8 text-sm text-black/55">Loading CV templates...</div>;
  }

  if (error) {
    return <div className="rounded-3xl bg-red-50 p-8 text-sm font-semibold text-red-600">{error}</div>;
  }

  if (templates.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center">
        <h2 className="text-lg font-bold text-[#202420]">No CV templates yet</h2>
        <p className="mt-2 text-sm text-black/55">
          Use Schedule New Template to create your first ATS or modern column template.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {templates.map((template) => (
        <CVTemplateCard
          key={template.id}
          template={template}
          onDelete={handleDelete}
          onStatusChange={handleStatusChange}
          isUpdatingStatus={updatingStatusId === template.id}
        />
      ))}
    </div>
  );
}
