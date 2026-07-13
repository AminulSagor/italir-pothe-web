import type { ReactNode } from "react";

interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
}

export function PageHero({
  eyebrow,
  title,
  description,
  actions,
}: PageHeroProps) {
  return (
    <section className="relative overflow-hidden border-b border-[#DDE8E1] bg-[#F4FAF5]">
      <div className="absolute -right-24 -top-24 size-80 rounded-full bg-[#D9F2E2] blur-3xl" />
      <div className="absolute -bottom-36 left-1/4 size-80 rounded-full bg-[#E9F9D7] blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
        <div className="max-w-4xl">
          <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#0A7C58]">
            {eyebrow}
          </p>
          <h1 className="mt-4 max-w-4xl text-4xl font-black tracking-[-0.055em] text-[#17211D] sm:text-5xl lg:text-7xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#5F6C65] sm:text-xl">
            {description}
          </p>
          {actions && (
            <div className="mt-8 flex flex-wrap gap-3">{actions}</div>
          )}
        </div>
      </div>
    </section>
  );
}
