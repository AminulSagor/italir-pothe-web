interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  const alignmentClass =
    align === "center"
      ? "mx-auto max-w-3xl text-center"
      : "max-w-3xl text-left";

  return (
    <div className={alignmentClass}>
      {eyebrow && (
        <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#0A7C58]">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-3 text-3xl font-black tracking-[-0.045em] text-[#17211D] sm:text-4xl lg:text-5xl">
        {title}
      </h2>
      {description && (
        <p className="mt-5 text-base leading-8 text-[#5F6C65] sm:text-lg">
          {description}
        </p>
      )}
    </div>
  );
}
