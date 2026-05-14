import { cvTemplates } from "@/mock/cv-service/cv-service.mock";

import CVTemplateCard from "./cv-template-card";

export default function CVTemplateGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {cvTemplates.map((template) => (
        <CVTemplateCard key={template.id} template={template} />
      ))}
    </div>
  );
}
