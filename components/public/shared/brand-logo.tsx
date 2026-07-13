import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  compact?: boolean;
}

export function BrandLogo({ compact = false }: BrandLogoProps) {
  return (
    <Link
      className="inline-flex items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0A7C58] focus-visible:ring-offset-4"
      href="/"
      aria-label="Italir Pothe home"
    >
      <span className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#E5F7EC] shadow-sm ring-1 ring-[#CCE6D5]">
        <Image
          alt=""
          className="object-contain p-1.5"
          fill
          sizes="40px"
          src="/images/italir-pothe-icon.png"
        />
      </span>
      {!compact && (
        <span className="leading-none">
          <span className="block text-[1.05rem] font-black tracking-[-0.03em] text-[#17211D]">
            Italir Pothe
          </span>
          <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#65726B]">
            Learn. Prepare. Grow.
          </span>
        </span>
      )}
    </Link>
  );
}
