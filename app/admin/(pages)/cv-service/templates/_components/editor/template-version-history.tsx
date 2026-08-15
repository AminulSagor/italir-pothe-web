import type { ResumeTemplateVersion } from "@/types/resume-studio/resume-template.types";

interface TemplateVersionHistoryProps {
  versions: ResumeTemplateVersion[];
  activeVersionId?: string | null;
}

const statusClasses: Record<ResumeTemplateVersion["status"], string> = {
  draft: "bg-[#FFF6D8] text-[#866400]",
  published: "bg-[#E3F8E6] text-[#167347]",
  archived: "bg-[#EEF0EE] text-[#59615B]",
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unknown";

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function TemplateVersionHistory({
  versions,
  activeVersionId,
}: TemplateVersionHistoryProps) {
  if (!versions.length) return null;

  return (
    <section className="rounded-3xl bg-white p-6 shadow-sm">
      <h2 className="text-lg font-bold text-[#202420]">Version History</h2>
      <p className="mt-1 text-sm text-black/50">
        Published versions are immutable; editing after publish creates or updates a
        new draft version.
      </p>

      <div className="mt-5 overflow-x-auto rounded-2xl border border-[#E5EAE5]">
        <table className="w-full min-w-[680px] text-left text-sm">
          <thead className="bg-[#F7F9F6] text-xs uppercase text-black/40">
            <tr>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checksum</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {versions.map((version) => (
              <tr
                key={version.id}
                className={`border-t border-[#EEF1EE] ${
                  version.id === activeVersionId ? "bg-[#F3FAF5]" : ""
                }`}
              >
                <td className="px-4 py-3 font-semibold">v{version.versionNumber}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusClasses[version.status]}`}
                  >
                    {version.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-black/45">
                  {version.checksum.slice(0, 12)}…
                </td>
                <td className="px-4 py-3 text-xs text-black/50">
                  {formatDate(version.createdAt)}
                </td>
                <td className="px-4 py-3 text-xs text-black/50">
                  {version.publishedAt ? formatDate(version.publishedAt) : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
