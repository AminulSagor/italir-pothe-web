import { ExternalLink, ImageIcon, Info } from "lucide-react";

import type { ModerationVisualEvidence } from "@/types/reports-moderation/reports-moderation.type";

interface VisualEvidenceCardProps {
  evidence: ModerationVisualEvidence[];
}

export default function VisualEvidenceCard({
  evidence,
}: VisualEvidenceCardProps) {
  const visibleEvidence = evidence.filter((item) => Boolean(item.url));

  return (
    <section className="rounded-[2rem] bg-white p-7 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-full bg-sky-50 text-secondary">
            <ImageIcon className="size-5" />
          </span>

          <div>
            <h2 className="text-lg font-bold text-black/90">Visual Evidence</h2>
            <p className="text-sm text-black/40">
              {visibleEvidence.length.toLocaleString()} user-submitted file
              {visibleEvidence.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>

      {visibleEvidence.length === 0 ? (
        <div className="mt-7 flex min-h-[190px] items-center justify-center rounded-[2rem] border-2 border-dashed border-black/10 bg-[#F7FAF5] p-8 text-center">
          <p className="max-w-[420px] text-black/45">
            The reporter did not attach visual evidence, or the evidence file is no longer available.
          </p>
        </div>
      ) : (
        <div className="mt-7 grid gap-5 md:grid-cols-2">
          {visibleEvidence.map((item, index) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[1.75rem] border border-black/5 bg-[#F7FAF5]"
            >
              <a
                href={item.url || undefined}
                target="_blank"
                rel="noreferrer"
                className="group block"
              >
                {/* Signed evidence URLs are dynamic and cannot be configured as static Next image hosts. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.url || ""}
                  alt={`Report evidence ${index + 1}`}
                  className="h-64 w-full object-contain transition group-hover:scale-[1.01]"
                />
                <div className="flex items-center justify-between gap-3 border-t border-black/5 bg-white px-5 py-4">
                  <div>
                    <p className="text-sm font-bold text-black/75">
                      Evidence {index + 1}
                    </p>
                    {item.description && (
                      <p className="mt-1 text-xs text-black/45">
                        {item.description}
                      </p>
                    )}
                  </div>
                  <ExternalLink className="size-4 shrink-0 text-secondary" />
                </div>
              </a>
            </article>
          ))}
        </div>
      )}

      <p className="mt-5 flex items-start gap-2 text-sm text-black/45">
        <Info className="mt-0.5 size-4 shrink-0" />
        Only media submitted by the reporter is shown. Private chat history is not included in this moderation response.
      </p>
    </section>
  );
}
