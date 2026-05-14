import CVTemplateGrid from "./_components/cv-template-grid";
import CVTemplateHeader from "./_components/cv-template-header";

export default function CVTemplateManagerPage() {
  return (
    <div className="space-y-10">
      <CVTemplateHeader />
      <CVTemplateGrid />
    </div>
  );
}
