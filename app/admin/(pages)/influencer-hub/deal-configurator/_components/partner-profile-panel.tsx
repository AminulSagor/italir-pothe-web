import Image from "next/image";
import { BadgeCheck, Banknote, Mail, Plus, Trash2, Video } from "lucide-react";

export default function PartnerProfilePanel() {
    return (
        <aside className="border-b border-black/10 p-8 lg:border-b-0 lg:border-r">
            <div className="flex items-center gap-4">
                <Image
                    src="/images/login-globe.png"
                    alt="Partner"
                    width={64}
                    height={64}
                    className="size-14 rounded-full object-cover"
                />

                <div>
                    <h2 className="text-lg font-bold text-deep-green">Marco Valeri</h2>
                    <p className="text-sm text-black/55">Global Partner Manager</p>
                </div>
            </div>

            <div className="mt-8 space-y-5">
                <FieldGroup title="Email Address">
                    <InfoPill icon={<Mail className="size-4" />} label="marco.v@influencerhub.it" />
                </FieldGroup>

                <FieldGroup title="Social Handles">
                    <InfoPill
                        icon={<span className="text-lg font-bold">@</span>}
                        label="@marco_travels"
                        actionIcon={<Trash2 className="size-4 text-black/25" />}
                    />
                    <InfoPill
                        icon={<Video className="size-4" />}
                        label="@marco_vlogs"
                        actionIcon={<Trash2 className="size-4 text-black/25" />}
                    />

                    <button className="flex h-8 items-center gap-2 rounded-full border border-secondary/25 px-4 text-xs font-semibold text-secondary">
                        <Plus className="size-3.5" />
                        ADD HANDLE
                    </button>
                </FieldGroup>

                <FieldGroup title="Payment Method">
                    <InfoPill icon={<Banknote className="size-4" />} label="Direct Bank Transfer (EUR)" />
                </FieldGroup>

                <FieldGroup title="Administrative Notes">
                    <div className="flex h-16 items-center rounded-[1.5rem] bg-[#EEF3EC] px-5 text-sm text-black/20">
                        Enter internal notes regarding this partner...
                    </div>
                </FieldGroup>
            </div>

            <div className="mt-10 rounded-[1.5rem] border border-secondary/10 bg-emerald-50/40 p-5">
                <div className="flex items-center gap-3">
                    <BadgeCheck className="size-5 text-secondary" />
                    <p className="text-sm font-bold uppercase text-deep-green">Partner Status</p>
                </div>

                <p className="mt-2 text-sm leading-6 text-black/55">
                    Verified account with 98% retention rate over the last 12 months.
                </p>
            </div>
        </aside>
    );
}

function FieldGroup({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-black/45">
                {title}
            </p>
            <div className="space-y-2">{children}</div>
        </div>
    );
}

function InfoPill({
    icon,
    label,
    actionIcon,
}: {
    icon: React.ReactNode;
    label: string;
    actionIcon?: React.ReactNode;
}) {
    return (
        <div className="flex h-10 items-center justify-between rounded-full bg-[#EEF3EC] px-5 text-sm text-black/70">
            <span className="flex items-center gap-3">
                <span className="text-secondary">{icon}</span>
                {label}
            </span>

            {actionIcon}
        </div>
    );
}