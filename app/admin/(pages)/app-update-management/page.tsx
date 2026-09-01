"use client";

import {
  Apple,
  BadgeAlert,
  CheckCircle2,
  Loader2,
  RefreshCw,
  Save,
  Smartphone,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  getAppUpdateConfigurations,
  updateAppUpdateConfiguration,
} from "@/service/app-update/app-update.service";
import type {
  AppUpdateConfiguration,
  AppUpdatePlatform,
} from "@/types/app-update/app-update.type";

type Drafts = Record<AppUpdatePlatform, AppUpdateConfiguration>;
type FormErrors = Partial<Record<keyof AppUpdateConfiguration, string>>;

const semanticVersionPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

const createDefaultConfiguration = (
  platform: AppUpdatePlatform,
): AppUpdateConfiguration => ({
  platform,
  latestVersion: "1.0.0",
  minimumSupportedVersion: "1.0.0",
  updateType: "OPTIONAL",
  title: "Update available",
  message:
    platform === "android"
      ? "A newer version of Italir Pothe is available on Google Play."
      : "A newer version of Italir Pothe is available on the App Store.",
  storeUrl:
    platform === "android"
      ? "https://play.google.com/store/apps/details?id=com.shafacode.italir_pothe"
      : "https://apps.apple.com/app/italir-pothe",
  enabled: false,
});

const buildDrafts = (configurations: AppUpdateConfiguration[]): Drafts => ({
  android:
    configurations.find((item) => item.platform === "android") ??
    createDefaultConfiguration("android"),
  ios:
    configurations.find((item) => item.platform === "ios") ??
    createDefaultConfiguration("ios"),
});

const compareVersions = (left: string, right: string): number => {
  const parse = (value: string) =>
    value
      .split("+", 1)[0]
      .split("-", 1)[0]
      .split(".")
      .map(Number);

  const leftParts = parse(left);
  const rightParts = parse(right);

  for (let index = 0; index < 3; index += 1) {
    const difference = leftParts[index] - rightParts[index];
    if (difference !== 0) return difference;
  }

  return 0;
};

const validateStoreUrl = (
  platform: AppUpdatePlatform,
  value: string,
): boolean => {
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return false;

    if (platform === "android") {
      return (
        url.hostname === "play.google.com" &&
        url.pathname.startsWith("/store/apps/details")
      );
    }

    return url.hostname === "apps.apple.com" && url.pathname.includes("/app/");
  } catch {
    return false;
  }
};

const validateConfiguration = (
  configuration: AppUpdateConfiguration,
): FormErrors => {
  const errors: FormErrors = {};

  if (!semanticVersionPattern.test(configuration.latestVersion.trim())) {
    errors.latestVersion = "Enter a semantic version such as 1.10.0.";
  }

  if (!semanticVersionPattern.test(configuration.minimumSupportedVersion.trim())) {
    errors.minimumSupportedVersion =
      "Enter a semantic version such as 1.9.0.";
  }

  if (
    !errors.latestVersion &&
    !errors.minimumSupportedVersion &&
    compareVersions(
      configuration.minimumSupportedVersion,
      configuration.latestVersion,
    ) > 0
  ) {
    errors.minimumSupportedVersion =
      "Minimum supported version cannot exceed the latest version.";
  }

  if (!configuration.title.trim()) {
    errors.title = "Update title is required.";
  }

  if (!configuration.message.trim()) {
    errors.message = "Update message is required.";
  }

  if (!validateStoreUrl(configuration.platform, configuration.storeUrl.trim())) {
    errors.storeUrl =
      configuration.platform === "android"
        ? "Use the official play.google.com app listing URL."
        : "Use the official apps.apple.com app listing URL.";
  }

  return errors;
};

export default function AppUpdateManagementPage() {
  const [selectedPlatform, setSelectedPlatform] =
    useState<AppUpdatePlatform>("android");
  const [drafts, setDrafts] = useState<Drafts | null>(null);
  const [savedDrafts, setSavedDrafts] = useState<Drafts | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const loadConfigurations = useCallback(async () => {
    setIsLoading(true);
    try {
      const configurations = await getAppUpdateConfigurations();
      const nextDrafts = buildDrafts(configurations);
      setDrafts(nextDrafts);
      setSavedDrafts(nextDrafts);
      setErrors({});
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Update configuration could not be loaded.",
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // The initial API synchronization intentionally owns this loading state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadConfigurations();
  }, [loadConfigurations]);

  const configuration = drafts?.[selectedPlatform] ?? null;
  const hasChanges = useMemo(() => {
    if (!drafts || !savedDrafts) return false;
    return (
      JSON.stringify(drafts[selectedPlatform]) !==
      JSON.stringify(savedDrafts[selectedPlatform])
    );
  }, [drafts, savedDrafts, selectedPlatform]);

  const updateField = <Key extends keyof AppUpdateConfiguration>(
    key: Key,
    value: AppUpdateConfiguration[Key],
  ) => {
    setDrafts((current) => {
      if (!current) return current;
      return {
        ...current,
        [selectedPlatform]: {
          ...current[selectedPlatform],
          [key]: value,
        },
      };
    });
    setErrors((current) => ({ ...current, [key]: undefined }));
  };

  const updateEnabled = (enabled: boolean) => {
    setDrafts((current) => {
      if (!current) return current;
      return {
        ...current,
        [selectedPlatform]: {
          ...current[selectedPlatform],
          enabled,
          // Kept only for compatibility with already-published app builds.
          updateType: enabled ? "OPTIONAL" : "DISABLED",
        },
      };
    });
  };

  const handleSave = async () => {
    if (!configuration) return;

    const nextErrors = validateConfiguration(configuration);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      toast.error("Please correct the highlighted fields.");
      return;
    }

    setIsSaving(true);
    try {
      const saved = await updateAppUpdateConfiguration(selectedPlatform, {
        latestVersion: configuration.latestVersion.trim(),
        minimumSupportedVersion: configuration.minimumSupportedVersion.trim(),
        updateType: configuration.updateType,
        title: configuration.title.trim(),
        message: configuration.message.trim(),
        storeUrl: configuration.storeUrl.trim(),
        enabled: configuration.enabled,
      });

      setDrafts((current) =>
        current ? { ...current, [selectedPlatform]: saved } : current,
      );
      setSavedDrafts((current) =>
        current ? { ...current, [selectedPlatform]: saved } : current,
      );
      toast.success(
        `${selectedPlatform === "android" ? "Android" : "iOS"} update configuration saved.`,
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Update configuration could not be saved.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[420px] items-center justify-center">
        <Loader2 className="animate-spin text-[#087448]" size={32} />
      </div>
    );
  }

  if (!configuration) {
    return (
      <div className="rounded-3xl border border-red-100 bg-white p-10 text-center">
        <BadgeAlert className="mx-auto text-red-500" size={36} />
        <h1 className="mt-4 text-2xl font-black">Configuration unavailable</h1>
        <button
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#087448] px-5 py-3 font-bold text-white"
          onClick={() => void loadConfigurations()}
          type="button"
        >
          <RefreshCw size={17} /> Retry
        </button>
      </div>
    );
  }

  const fieldClass =
    "mt-2 h-12 w-full rounded-2xl border border-[#DCE7E0] bg-[#F9FCFA] px-4 outline-none transition focus:border-[#087448] focus:ring-2 focus:ring-[#087448]/10";
  const errorClass = "mt-1 text-xs font-semibold text-red-600";

  return (
    <div className="mx-auto max-w-6xl space-y-7">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.16em] text-[#087448]">
            Mobile releases
          </p>
          <h1 className="mt-2 text-3xl font-black tracking-[-0.04em] text-[#17211D] sm:text-4xl">
            App Update Management
          </h1>
          <p className="mt-3 max-w-2xl leading-7 text-[#637168]">
            Set the newest and oldest supported versions for Android and iOS.
            The app automatically chooses the correct update experience.
          </p>
        </div>

        <button
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#087448] px-6 font-bold text-white transition hover:bg-[#06623C] disabled:cursor-not-allowed disabled:opacity-50"
          disabled={!hasChanges || isSaving}
          onClick={() => void handleSave()}
          type="button"
        >
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save {selectedPlatform === "android" ? "Android" : "iOS"}
        </button>
      </header>

      <div className="grid gap-4 sm:grid-cols-2">
        {(["android", "ios"] as const).map((platform) => {
          const item = drafts?.[platform];
          const selected = platform === selectedPlatform;
          const Icon = platform === "android" ? Smartphone : Apple;

          return (
            <button
              className={`rounded-3xl border p-5 text-left transition ${
                selected
                  ? "border-[#087448] bg-[#EAF8EE] shadow-sm"
                  : "border-[#DCE7E0] bg-white hover:border-[#A8C8B4]"
              }`}
              key={platform}
              onClick={() => {
                setSelectedPlatform(platform);
                setErrors({});
              }}
              type="button"
            >
              <div className="flex items-center justify-between gap-4">
                <span className="flex items-center gap-3">
                  <span className="grid size-11 place-items-center rounded-2xl bg-white text-[#087448] shadow-sm">
                    <Icon size={22} />
                  </span>
                  <span>
                    <span className="block text-lg font-black capitalize text-[#17211D]">
                      {platform}
                    </span>
                    <span className="text-sm text-[#66736B]">
                      Latest {item?.latestVersion ?? "—"}
                    </span>
                  </span>
                </span>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-extrabold ${
                    item?.enabled
                      ? "bg-[#DDF5E5] text-[#087448]"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {item?.enabled ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <section className="rounded-[2rem] border border-[#DCE7E0] bg-white p-6 shadow-sm sm:p-8">
        <div className="flex flex-col gap-4 border-b border-[#E6EEE9] pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-black capitalize text-[#17211D]">
              {selectedPlatform} configuration
            </h2>
            <p className="mt-1 text-sm text-[#66736B]">
              Changes apply only after saving this platform.
            </p>
          </div>

          <button
            aria-checked={configuration.enabled}
            className="flex items-center gap-3 font-bold text-[#26332C]"
            onClick={() => updateEnabled(!configuration.enabled)}
            role="switch"
            type="button"
          >
            Enabled
            <span
              className={`relative h-7 w-12 rounded-full transition ${
                configuration.enabled ? "bg-[#087448]" : "bg-gray-300"
              }`}
            >
              <span
                className={`absolute top-1 size-5 rounded-full bg-white shadow transition ${
                  configuration.enabled ? "left-6" : "left-1"
                }`}
              />
            </span>
          </button>
        </div>

        <div className="mt-7 grid gap-6 md:grid-cols-2">
          <label className="font-bold text-[#27342D]">
            Latest version
            <input
              className={fieldClass}
              onChange={(event) => updateField("latestVersion", event.target.value)}
              placeholder="1.10.0"
              value={configuration.latestVersion}
            />
            {errors.latestVersion && <p className={errorClass}>{errors.latestVersion}</p>}
          </label>

          <label className="font-bold text-[#27342D]">
            Minimum supported version
            <input
              className={fieldClass}
              onChange={(event) =>
                updateField("minimumSupportedVersion", event.target.value)
              }
              placeholder="1.9.0"
              value={configuration.minimumSupportedVersion}
            />
            {errors.minimumSupportedVersion && (
              <p className={errorClass}>{errors.minimumSupportedVersion}</p>
            )}
          </label>

          <label className="font-bold text-[#27342D]">
            Update title
            <input
              className={fieldClass}
              maxLength={160}
              onChange={(event) => updateField("title", event.target.value)}
              value={configuration.title}
            />
            {errors.title && <p className={errorClass}>{errors.title}</p>}
          </label>

          <label className="font-bold text-[#27342D] md:col-span-2">
            Update message
            <textarea
              className="mt-2 min-h-32 w-full resize-y rounded-2xl border border-[#DCE7E0] bg-[#F9FCFA] p-4 outline-none transition focus:border-[#087448] focus:ring-2 focus:ring-[#087448]/10"
              maxLength={1200}
              onChange={(event) => updateField("message", event.target.value)}
              value={configuration.message}
            />
            {errors.message && <p className={errorClass}>{errors.message}</p>}
          </label>

          <label className="font-bold text-[#27342D] md:col-span-2">
            Official store URL
            <input
              className={fieldClass}
              maxLength={1000}
              onChange={(event) => updateField("storeUrl", event.target.value)}
              value={configuration.storeUrl}
            />
            {errors.storeUrl && <p className={errorClass}>{errors.storeUrl}</p>}
          </label>
        </div>

        <div className="mt-7 flex items-start gap-3 rounded-2xl bg-[#F1F8F3] p-4 text-sm leading-6 text-[#4D5E54]">
          <CheckCircle2 className="mt-0.5 shrink-0 text-[#087448]" size={19} />
          <p>
            Versions below the <strong>minimum supported version</strong> must
            update. Versions between minimum and latest receive an optional
            update. Users on the latest version see nothing. Switching this
            configuration off disables all update prompts.
          </p>
        </div>
      </section>
    </div>
  );
}
