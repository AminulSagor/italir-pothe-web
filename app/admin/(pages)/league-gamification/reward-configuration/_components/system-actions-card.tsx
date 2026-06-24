import { BellRing, PartyPopper, ShieldCheck, Truck } from "lucide-react";

import type { RewardConfigurationFormState } from "./reward-configuration.types";

interface SystemActionsCardProps {
  form: RewardConfigurationFormState;
  showShippingAddress: boolean;
  disabled?: boolean;

  onChange: <Key extends keyof RewardConfigurationFormState>(
    key: Key,
    value: RewardConfigurationFormState[Key],
  ) => void;
}

export default function SystemActionsCard({
  form,
  showShippingAddress,
  disabled = false,
  onChange,
}: SystemActionsCardProps) {
  return (
    <aside className="h-fit rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-full bg-[#75FF33] text-secondary">
          <ShieldCheck className="size-5" />
        </div>

        <h2 className="text-lg font-semibold text-black/90">System Actions</h2>
      </div>

      <div className="mt-8 space-y-6">
        <ToggleRow
          icon={<BellRing className="size-5" />}
          title="Send Push Notification"
          checked={form.sendPushNotification}
          disabled={disabled}
          onChange={(value) => onChange("sendPushNotification", value)}
        />

        <ToggleRow
          icon={<PartyPopper className="size-5" />}
          title="Play confetti animation"
          checked={form.playConfettiAnimation}
          disabled={disabled}
          onChange={(value) => onChange("playConfettiAnimation", value)}
        />

        {showShippingAddress && (
          <ToggleRow
            icon={<Truck className="size-5" />}
            title="Request Shipping Address"
            checked={form.requestShippingAddress}
            disabled={disabled}
            onChange={(value) => onChange("requestShippingAddress", value)}
          />
        )}
      </div>
    </aside>
  );
}

function ToggleRow({
  icon,
  title,
  checked,
  disabled,
  onChange,
}: {
  icon: React.ReactNode;
  title: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-4 text-secondary">
        {icon}

        <p className="text-base font-medium text-black/75">{title}</p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`relative h-8 w-14 rounded-full transition disabled:cursor-not-allowed disabled:opacity-50 ${
          checked ? "bg-[#5AF256]" : "bg-[#CBD4CC]"
        }`}
      >
        <span
          className={`absolute top-1 size-6 rounded-full bg-white transition ${
            checked ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
