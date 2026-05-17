import { Camera, ChevronUp, CirclePlus, PlayCircle, Video } from "lucide-react";

export default function PartnerProfileForm() {
    return (
        <div>
            <h1 className="text-lg font-bold text-deep-green">Partner Profile</h1>
            <p className="mt-1 text-sm text-black/55">
                Manage basic information and identity
            </p>

            <div className="mt-5 space-y-5">
                <Field label="Full Name">
                    <InputPill value="Alessia Romano" />
                </Field>

                <Field label="Email Address">
                    <InputPill value="alessia.r@influencerhub.io" />
                </Field>

                <div className="rounded-[1.7rem] bg-[#EEF3EC] p-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-deep-green">
                            Social Handles
                        </h2>
                        <ChevronUp className="size-4 text-secondary" />
                    </div>

                    <div className="mt-4 space-y-3">
                        <SocialInput icon={<Camera className="size-4" />} value="@alessia_travels" />
                        <SocialInput icon={<Video className="size-4" />} value="alessia_romano_official" />
                        <SocialInput icon={<PlayCircle className="size-4" />} value="AlessiaVlogs" />
                    </div>

                    <button className="mt-4 flex items-center gap-2 text-sm font-bold text-secondary">
                        <CirclePlus className="size-4" />
                        + Add Handle
                    </button>
                </div>

                <div className="flex items-center justify-between rounded-full bg-[#EEF3EC] px-5 py-3">
                    <span className="font-bold text-deep-green">Partner Status</span>

                    <span className="flex items-center gap-3 text-sm font-semibold text-green-700">
                        <span className="relative h-6 w-11 rounded-full bg-green-700">
                            <span className="absolute right-1 top-1 size-4 rounded-full bg-white" />
                        </span>
                        Active
                    </span>
                </div>
            </div>
        </div>
    );
}

function Field({
    label,
    children,
}: {
    label: string;
    children: React.ReactNode;
}) {
    return (
        <label className="block">
            <span className="mb-2 block text-xs font-bold text-black/60">
                {label}
            </span>
            {children}
        </label>
    );
}

function InputPill({ value }: { value: string }) {
    return (
        <div className="flex h-11 items-center rounded-full bg-[#EEF3EC] px-5 text-sm text-black/75">
            {value}
        </div>
    );
}

function SocialInput({
    icon,
    value,
}: {
    icon: React.ReactNode;
    value: string;
}) {
    return (
        <div className="flex h-11 items-center gap-4 rounded-full border border-black/10 bg-white px-5 text-sm text-black/75">
            <span className="text-black/55">{icon}</span>
            {value}
        </div>
    );
}