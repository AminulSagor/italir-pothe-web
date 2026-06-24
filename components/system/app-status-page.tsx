"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  LayoutDashboard,
  LockKeyhole,
  RefreshCcw,
  SearchX,
  ServerCrash,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import { IMAGE } from "@/constant/image.path";

export type AppStatusVariant = "unauthorized" | "not-found" | "server-error";

interface StatusAction {
  label: string;
  href?: string;
  kind?: "link" | "back";
}

interface AppStatusPageProps {
  variant: AppStatusVariant;
  primaryAction: StatusAction;
  secondaryAction?: StatusAction;
  onPrimaryAction?: () => void;
  reference?: string;
}

interface StatusConfiguration {
  statusCode: string;
  label: string;
  title: string;
  description: string;
  hint: string;
  icon: LucideIcon;
  iconBackground: string;
  iconColor: string;
  codeColor: string;
  accentBackground: string;
}

const statusConfigurations: Record<AppStatusVariant, StatusConfiguration> = {
  unauthorized: {
    statusCode: "401",
    label: "Authorization Required",
    title: "You are not authorized",
    description:
      "Your session may have expired, or your account does not have permission to access this area.",
    hint: "Sign in with an authorized administrator account to continue.",
    icon: LockKeyhole,
    iconBackground: "bg-[#FFF0D6]",
    iconColor: "text-[#D97706]",
    codeColor: "text-[#D97706]",
    accentBackground: "bg-[#FFF8EA]",
  },

  "not-found": {
    statusCode: "404",
    label: "Page Not Found",
    title: "We could not find that page",
    description:
      "The page may have been moved, deleted, or the address may be incorrect.",
    hint: "Check the address or return to the administration dashboard.",
    icon: SearchX,
    iconBackground: "bg-[#E6F4EC]",
    iconColor: "text-[#006B3F]",
    codeColor: "text-[#006B3F]",
    accentBackground: "bg-[#F0F8F3]",
  },

  "server-error": {
    statusCode: "500",
    label: "Internal Server Error",
    title: "Something went wrong",
    description:
      "The application encountered an unexpected problem while processing your request.",
    hint: "Try the request again. If the problem continues, share the reference code with the technical team.",
    icon: ServerCrash,
    iconBackground: "bg-[#FCE8E8]",
    iconColor: "text-[#D92D20]",
    codeColor: "text-[#D92D20]",
    accentBackground: "bg-[#FFF4F3]",
  },
};

export default function AppStatusPage({
  variant,
  primaryAction,
  secondaryAction,
  onPrimaryAction,
  reference,
}: AppStatusPageProps) {
  const router = useRouter();
  const configuration = statusConfigurations[variant];

  const fullName = "Admin";

  const StatusIcon = configuration.icon;

  const renderAction = (action: StatusAction, isPrimary: boolean) => {
    const className = isPrimary
      ? "inline-flex h-13 min-w-[190px] items-center justify-center gap-2 rounded-full bg-[#006B3F] px-7 text-sm font-semibold text-white shadow-lg shadow-[#006B3F]/15 transition hover:bg-[#005A35] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006B3F]/20"
      : "inline-flex h-13 min-w-[160px] items-center justify-center gap-2 rounded-full border border-[#CAD6CD] bg-white px-7 text-sm font-semibold text-[#3E4941] transition hover:border-[#006B3F]/40 hover:bg-[#F5F8F4] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#006B3F]/10";

    if (isPrimary && onPrimaryAction) {
      return (
        <button type="button" onClick={onPrimaryAction} className={className}>
          <RefreshCcw className="size-4" />
          {action.label}
        </button>
      );
    }

    if (action.kind === "back") {
      return (
        <button
          type="button"
          onClick={() => router.back()}
          className={className}
        >
          <ArrowLeft className="size-4" />
          {action.label}
        </button>
      );
    }

    if (!action.href) {
      return null;
    }

    return (
      <Link href={action.href} className={className}>
        {isPrimary ? (
          <>
            {variant === "unauthorized" ? (
              <ShieldCheck className="size-4" />
            ) : (
              <LayoutDashboard className="size-4" />
            )}

            {action.label}

            <ArrowRight className="size-4" />
          </>
        ) : (
          <>
            <Home className="size-4" />
            {action.label}
          </>
        )}
      </Link>
    );
  };

  return (
    <main
      role="alert"
      aria-live="assertive"
      className="relative flex min-h-screen overflow-hidden bg-[#F3F7F2] px-4 py-8 text-[#202420] sm:px-8"
    >
      <div className="pointer-events-none absolute -left-32 -top-36 size-[420px] rounded-full bg-[#CDE8D8]/50 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-44 -right-36 size-[520px] rounded-full bg-[#E0F2E6]/70 blur-3xl" />

      <div className="pointer-events-none absolute left-[12%] top-[18%] size-24 rounded-full border border-[#006B3F]/10" />

      <div className="pointer-events-none absolute bottom-[16%] right-[12%] size-16 rounded-full border border-[#006B3F]/10" />

      <div className="relative mx-auto flex w-full max-w-[1180px] flex-col">
        <header className="flex items-center justify-between">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="flex items-center gap-2 px-6 py-6">
              <Image src={IMAGE.logo} width={32} height={100} alt="logo" />
            </div>

            <span>
              <span className="block text-sm font-bold uppercase tracking-[0.18em] text-[#006B3F]">
                Italir Pothe
              </span>

              <span className="block text-[10px] font-medium uppercase tracking-[0.14em] text-black/40">
                Administration
              </span>
            </span>
          </Link>

          <div className="hidden items-center gap-2 rounded-full border border-white bg-white/70 px-4 py-2 text-xs font-medium text-black/45 shadow-sm backdrop-blur-sm sm:flex">
            <span className="size-2 rounded-full bg-[#55D66B]" />
            Secure Admin Portal
          </div>
        </header>

        <section className="flex flex-1 items-center justify-center py-12 sm:py-20">
          <div className="grid w-full overflow-hidden rounded-[36px] border border-white/80 bg-white/90 shadow-[0_30px_90px_rgba(23,74,45,0.12)] backdrop-blur-xl lg:grid-cols-[1.1fr_0.9fr]">
            <div className="flex flex-col justify-center px-7 py-12 sm:px-12 lg:px-16 lg:py-16">
              <div className="flex items-center gap-3">
                <div
                  className={`flex size-12 items-center justify-center rounded-2xl ${configuration.iconBackground} ${configuration.iconColor}`}
                >
                  <StatusIcon className="size-6" />
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-black/40">
                    {configuration.label}
                  </p>

                  <p
                    className={`text-sm font-semibold ${configuration.codeColor}`}
                  >
                    Error {configuration.statusCode}
                  </p>
                </div>
              </div>

              <h1 className="mt-8 max-w-[580px] text-3xl font-bold leading-tight tracking-[-0.03em] text-[#16251B] sm:text-5xl">
                {configuration.title}
              </h1>

              <p className="mt-5 max-w-[580px] text-base leading-7 text-[#667168] sm:text-lg">
                {configuration.description}
              </p>

              <div
                className={`mt-7 flex max-w-[590px] gap-3 rounded-2xl px-5 py-4 ${configuration.accentBackground}`}
              >
                <div className="mt-1 size-2 shrink-0 rounded-full bg-[#006B3F]" />

                <p className="text-sm leading-6 text-[#566159]">
                  {configuration.hint}
                </p>
              </div>

              {reference && (
                <div className="mt-5 max-w-[590px] rounded-2xl border border-[#E1E8E2] bg-[#FAFCFA] px-5 py-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/35">
                    Error Reference
                  </p>

                  <code className="mt-1 block break-all font-mono text-xs text-black/55">
                    {reference}
                  </code>
                </div>
              )}

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                {renderAction(primaryAction, true)}

                {secondaryAction && renderAction(secondaryAction, false)}
              </div>
            </div>

            <div
              className={`relative hidden min-h-[560px] items-center justify-center overflow-hidden ${configuration.accentBackground} lg:flex`}
            >
              <div className="absolute left-10 top-10 size-24 rounded-full border border-[#006B3F]/10" />

              <div className="absolute bottom-16 right-12 size-36 rounded-full border border-[#006B3F]/10" />

              <div className="absolute right-16 top-16 overflow-hidden rounded-xl shadow-sm">
                <Image src={IMAGE.logo} width={48} height={100} alt="logo" />
              </div>

              <div className="relative flex size-[330px] items-center justify-center rounded-full border border-white bg-white/55 shadow-[inset_0_0_80px_rgba(255,255,255,0.8)]">
                <div className="absolute inset-8 rounded-full border border-[#006B3F]/10" />

                <div className="absolute inset-16 rounded-full border border-dashed border-[#006B3F]/20" />

                <div className="relative text-center">
                  <div
                    className={`mx-auto flex size-24 items-center justify-center rounded-[28px] bg-white shadow-xl ${configuration.iconColor}`}
                  >
                    <StatusIcon className="size-12" />
                  </div>

                  <p
                    className={`mt-7 text-7xl font-black tracking-[-0.08em] ${configuration.codeColor}`}
                  >
                    {configuration.statusCode}
                  </p>

                  <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-black/35">
                    Italir Pothe
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-xs text-black/35">
          © {new Date().getFullYear()} Italir Pothe. Secure administration
          system.
        </footer>
      </div>
    </main>
  );
}
