import { BookOpenCheck, ShieldCheck } from "lucide-react";

export default function Loading() {
  return (
    <main
      role="status"
      aria-live="polite"
      aria-label="Loading Italir Pothe"
      className="relative flex min-h-screen overflow-hidden bg-[#F3F7F2] px-4 py-8 text-[#202420]"
    >
      <div className="pointer-events-none absolute -left-40 -top-40 size-[460px] rounded-full bg-[#CDE8D8]/55 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-48 -right-40 size-[540px] rounded-full bg-[#E0F2E6]/70 blur-3xl" />

      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col">
        <header className="flex items-center justify-between">
          <div className="inline-flex items-center gap-3">
            <span className="grid grid-cols-3 overflow-hidden rounded-lg shadow-sm">
              <span className="h-8 w-3 bg-[#009246]" />
              <span className="h-8 w-3 bg-white" />
              <span className="h-8 w-3 bg-[#CE2B37]" />
            </span>

            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.18em] text-[#006B3F]">
                Italir Pothe
              </span>

              <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-black/40">
                Administration
              </span>
            </span>
          </div>

          <div className="hidden items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-xs font-medium text-black/45 shadow-sm sm:flex">
            <ShieldCheck className="size-4 text-[#006B3F]" />
            Secure Workspace
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-16">
          <div className="w-full max-w-[620px] rounded-[36px] border border-white/80 bg-white/90 px-7 py-12 text-center shadow-[0_30px_90px_rgba(23,74,45,0.12)] backdrop-blur-xl sm:px-12 sm:py-14">
            <div className="relative mx-auto flex size-32 items-center justify-center">
              <div className="absolute inset-0 animate-spin rounded-full border-[5px] border-[#DCEADF] border-t-[#006B3F]" />

              <div className="absolute inset-4 animate-[spin_2s_linear_infinite_reverse] rounded-full border border-dashed border-[#006B3F]/35" />

              <div className="flex size-20 items-center justify-center rounded-[24px] bg-[#E7F4EC] text-[#006B3F] shadow-inner">
                <BookOpenCheck className="size-9" />
              </div>
            </div>

            <h1 className="mt-8 text-2xl font-bold tracking-[-0.02em] text-[#16251B] sm:text-3xl">
              Preparing your workspace
            </h1>

            <p className="mx-auto mt-3 max-w-[420px] text-sm leading-6 text-[#69736C] sm:text-base">
              Loading the latest administration data and getting everything
              ready.
            </p>

            <div className="mx-auto mt-8 flex w-fit items-center gap-2">
              <span className="size-2 animate-bounce rounded-full bg-[#006B3F] [animation-delay:-0.3s]" />

              <span className="size-2 animate-bounce rounded-full bg-[#006B3F] [animation-delay:-0.15s]" />

              <span className="size-2 animate-bounce rounded-full bg-[#006B3F]" />
            </div>

            <div className="mt-10 space-y-3">
              <div className="h-3 animate-pulse rounded-full bg-[#E9F0EA]" />

              <div className="mx-auto h-3 w-[82%] animate-pulse rounded-full bg-[#E9F0EA]" />

              <div className="mx-auto h-3 w-[64%] animate-pulse rounded-full bg-[#E9F0EA]" />
            </div>

            <div className="mx-auto mt-9 grid w-fit grid-cols-3 overflow-hidden rounded-full shadow-sm">
              <span className="h-2 w-12 bg-[#009246]" />
              <span className="h-2 w-12 bg-[#F4F4F4]" />
              <span className="h-2 w-12 bg-[#CE2B37]" />
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-black/35">
          Please wait. This should only take a moment.
        </p>
      </div>
    </main>
  );
}
