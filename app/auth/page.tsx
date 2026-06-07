"use client";

import Image from "next/image";
import {
  Eye,
  EyeOff,
  Globe2,
  GraduationCap,
  Loader2,
  Lock,
  Shield,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { type FormEvent, type ReactNode, useState } from "react";

import { login } from "@/service/auth/login";
import { decodeJwtPayload } from "@/storage/jwt_decoder";
import { removeAuthUser, setAuthUser } from "@/utils/auth_user_util";
import { removeToken, setToken } from "@/utils/cookies_util";

export default function LogInPage() {
  return (
    <main className="h-screen overflow-hidden bg-[#3f3f3f] text-white">
      <section className="relative h-screen overflow-hidden bg-[radial-gradient(circle_at_25%_20%,rgba(255,255,255,0.22),transparent_28%),linear-gradient(135deg,#12352b_0%,#6d8377_52%,#006b3d_100%)] px-8 py-6">
        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-emerald-950/35" />

        <div className="relative z-10 grid h-full items-center gap-8 lg:grid-cols-2">
          <div className="text-center">
            <div className="text-left">
              <StatusPill />
            </div>

            <div className="mx-auto mt-6 w-full max-w-[420px]">
              <Image
                src="/images/login-globe.png"
                alt="Login globe"
                width={512}
                height={506}
                priority
                className="h-auto w-full"
              />
            </div>

            <h2 className="mt-6 text-2xl font-bold tracking-tight">
              Admin Command Center
            </h2>

            <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-white/70">
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
  type = "text",
  value,
  onChange,
  rightIcon,
}: {
  icon: ReactNode;
  placeholder: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  rightIcon?: ReactNode;
}) {
  return (
    <div className="flex h-12 items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 text-sm text-zinc-400 shadow-sm">
      <span className="text-zinc-400">{icon}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-zinc-900 outline-none placeholder:text-zinc-400"
        placeholder={placeholder}
      />
      {rightIcon ? <span className="text-zinc-500">{rightIcon}</span> : null}
    </div>
  );
}

function getErrorMessage(error: unknown) {
  const fallback = "Login failed. Please try again.";

  if (typeof error !== "object" || error === null) return fallback;

  const errorResponse = error as {
    response?: {
      status?: number;
      data?: {
        message?: string | string[];
      };
    };
    message?: string;
  };

  if (errorResponse.response?.status === 401) {
    return "Email/phone or password is wrong.";
  }

  const message = errorResponse.response?.data?.message;

  if (Array.isArray(message)) return message.join(", ");
  if (message) return message;

  return errorResponse.message || fallback;
}

function LoginCard() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!identifier.trim() || !password.trim()) {
      setErrorMessage("Email/phone and password are required.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const res = await login({
        identifier: identifier.trim(),
        password,
      });

      const token = res?.accessToken;
      if (!token) throw new Error("No token returned");

      const payload = decodeJwtPayload(token);
      if (!payload) throw new Error("Invalid token returned");

      const role = String(res.user?.role || payload.role || "").toLowerCase();
      if (role !== "admin") {
        removeToken();
        removeAuthUser();
        throw new Error("Only admin accounts can access this dashboard.");
      }

      setToken(token);
      setAuthUser(res.user);
      window.location.replace("/admin/dashboard");
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[390px] rounded-[2rem] bg-white/95 px-8 py-7 shadow-2xl">
      <div className="mx-auto flex size-14 items-center justify-center rounded-3xl bg-lime-700">
        <GraduationCap className="size-8 text-lime-200" />
      </div>

      <div className="mt-5 text-center">
        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-zinc-400">
          Access granted only to authorized personnel
        </p>
        <h1 className="mt-2 text-2xl font-bold tracking-tight text-deep-green">
          Secure Login
        </h1>
      </div>

      <form onSubmit={onSubmit} className="mt-7 space-y-4">
        <LoginInput
          icon={<UserRound size={18} />}
          placeholder="Admin Email / Phone"
          value={identifier}
          onChange={setIdentifier}
        />

        <LoginInput
          icon={<Lock size={18} />}
          placeholder="Password"
          type={showPassword ? "text" : "password"}
          value={password}
          onChange={setPassword}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="flex items-center"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          }
        />

        {errorMessage ? (
          <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-lime-700 text-sm font-medium text-white shadow-lg shadow-lime-900/30 transition hover:bg-lime-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? <Loader2 className="size-4 animate-spin" /> : null}
          {loading ? "Authenticating..." : "Authenticate & Enter Onboard"}
        </button>
      </form>

      <div className="mt-7 border-t border-zinc-200 pt-5">
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
