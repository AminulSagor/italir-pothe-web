import Image from "next/image";
import {
    Eye,
    Globe2,
    GraduationCap,
    Lock,
    Shield,
    ShieldCheck,
    UserRound,
} from "lucide-react";

function StatusPill() {
    return (
        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/10 px-5 py-3 text-xs font-medium text-white shadow-lg backdrop-blur">
            <span className="size-2 rounded-full bg-lime-300" />
            SYSTEM STATUS: OPTIMAL
        </div>
    );
}

function LoginInput({
    icon,
    placeholder,
    rightIcon,
}: {
    icon: React.ReactNode;
    placeholder: string;
    rightIcon?: React.ReactNode;
}) {
    return (
        <div className="flex h-12 items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-400 shadow-sm">
            <span className="text-zinc-400">{icon}</span>
            <input
                className="w-full bg-transparent outline-none placeholder:text-zinc-400"
                placeholder={placeholder}
            />
            {rightIcon ? <span className="text-zinc-500">{rightIcon}</span> : null}
        </div>
    );
}

function LoginCard() {
    return (
        <div className="w-full max-w-[410px] rounded-[2.5rem] bg-white/95 px-9 py-9 shadow-2xl">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl bg-lime-700">
                <GraduationCap className="size-9 text-lime-200" />
            </div>

            <div className="mt-6 text-center">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
                    Access granted only to authorized personnel
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-deep-green">
                    Secure Login
                </h1>
            </div>

            <div className="mt-8 space-y-4">
                <LoginInput
                    icon={<UserRound size={18} />}
                    placeholder="Admin Email / Employee ID"
                />

                <LoginInput
                    icon={<Lock size={18} />}
                    placeholder="Password"
                    rightIcon={<Eye size={18} />}
                />

                <LoginInput
                    icon={<Shield size={18} />}
                    placeholder="One-Time Security Code"
                />
            </div>

            <button className="mt-5 h-12 w-full rounded-full bg-lime-700 text-sm font-medium text-white shadow-lg shadow-lime-900/30 transition hover:bg-lime-800">
                Authenticate & Enter Onboard
            </button>

            <div className="mt-8 border-t border-zinc-200 pt-5">
                <div className="flex items-center justify-between gap-2 text-[9px] uppercase text-zinc-500">
                    <span className="flex items-center gap-1">
                        <Shield size={12} /> E2E Encrypted
                    </span>

                    <span className="flex items-center gap-1">
                        <Globe2 size={12} /> Authorized IP
                    </span>

                    <span className="flex items-center gap-1 text-secondary">
                        <ShieldCheck size={12} /> Health: Optimal
                    </span>
                </div>

                <p className="mt-5 text-center text-xs text-zinc-500">
                    Locked out? Contact System Admin
                </p>
            </div>
        </div>
    );
}

export default function AdminLoginScreen() {
    return (
        <main className="min-h-screen bg-[#3f3f3f] text-white">
            <section className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(135deg,#12352b_0%,#6d8377_52%,#006b3d_100%)] px-8 py-8">
                <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-emerald-950/35" />

                <div className="relative z-10 grid min-h-[calc(100vh-4rem)] items-center gap-12 lg:grid-cols-2">
                    <div className="text-center">
                        <div className="text-left">
                            <StatusPill />
                        </div>

                        <div className="mx-auto mt-10 w-full max-w-[512px]">
                            <Image
                                src="/images/login-globe.png"
                                alt="Login globe"
                                width={512}
                                height={506}
                                priority
                                className="h-auto w-full"
                            />
                        </div>

                        <h2 className="mt-10 text-4xl font-bold tracking-tight">
                            Admin Command Center
                        </h2>

                        <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-white/70">
                            Managing the future of the Italir Pothe community. Global
                            oversight with localized precision.
                        </p>
                    </div>

                    <div className="flex flex-col items-center">
                        <LoginCard />

                        <p className="mt-4 text-xs text-white/65">
                            © 2026 Italir Pothe Educational Systems. All rights reserved.
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}