"use client";

import { useParams } from "next/navigation";

import ResumeTemplateEditorClient from "../_components/editor/resume-template-editor-client";

export default function EditResumeTemplatePage() {
  const params = useParams<{ id: string }>();

  return <ResumeTemplateEditorClient templateId={params.id} />;
}
