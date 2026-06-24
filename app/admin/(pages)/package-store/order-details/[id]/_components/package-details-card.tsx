import {
  Box,
  CalendarDays,
  FileText,
  MessageSquareText,
  Mic,
  Snowflake,
} from "lucide-react";

import Card from "@/components/UI/cards/card";
import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

interface PackageDetailsCardProps {
  order: StoreAdminOrder;
}

export default function PackageDetailsCard({ order }: PackageDetailsCardProps) {
  const entitlements = order.package.entitlements;
  const features = [];

  if (entitlements.voiceMinutes > 0) {
    features.push({
      id: "voice",
      icon: <Mic className="size-5" />,
      value: `${entitlements.voiceMinutes} Voice Minutes`,
      bg: "bg-[#FFF0D6]",
      color: "text-[#FF7A00]",
    });
  }

  if (entitlements.textTokens > 0) {
    features.push({
      id: "tokens",
      icon: <MessageSquareText className="size-5" />,
      value: `${entitlements.textTokens} Text Tokens`,
      bg: "bg-[#F0DDF0]",
      color: "text-[#8B5CF6]",
    });
  }

  if (entitlements.cvCredits > 0) {
    features.push({
      id: "credits",
      icon: <FileText className="size-5" />,
      value: `${entitlements.cvCredits} CV Credits`,
      bg: "bg-[#DDF3E8]",
      color: "text-[#006B3F]",
    });
  }

  if (entitlements.streakFreezes > 0) {
    features.push({
      id: "freezes",
      icon: <Snowflake className="size-5" />,
      value: `${entitlements.streakFreezes} Streak Freezes`,
      bg: "bg-[#DFF3FF]",
      color: "text-[#3B82F6]",
    });
  }

  if (entitlements.protectionDurationDays) {
    features.push({
      id: "protection",
      icon: <CalendarDays className="size-5" />,
      value: `${entitlements.protectionDurationDays} Days Protection`,
      bg: "bg-[#DFF3FF]",
      color: "text-[#3B82F6]",
    });
  }

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="mb-8 flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#DDEBFF] text-[#3B82F6]">
            <Box className="size-5" />
          </div>

          <h2 className="text-lg font-semibold text-[#202420]">
            Package Details
          </h2>
        </div>

        <p className="text-lg font-bold text-[#006B3F]">
          {order.pricing.formattedPaymentAmount}
        </p>
      </div>

      <div className="rounded-3xl bg-[#EEF3EC] p-8">
        <h3 className="text-2xl font-bold text-[#006B3F]">
          {order.package.name}
        </h3>

        <p className="mt-2 max-w-xl text-sm leading-6 text-[#4F5B52]">
          {order.package.description || "No package description provided."}
        </p>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-2">
        {features.map((feature) => (
          <FeatureCard key={feature.id} {...feature} />
        ))}
      </div>
    </Card>
  );
}

function FeatureCard({
  icon,
  value,
  bg,
  color,
}: {
  icon: React.ReactNode;
  value: string;
  bg: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-3xl border border-[#E7EEE8] p-6">
      <div
        className={`flex size-12 items-center justify-center rounded-full ${bg} ${color}`}
      >
        {icon}
      </div>

      <div>
        <p className="text-xs font-bold text-[#8A948C]">INCLUDED</p>
        <p className="text-lg font-bold leading-5 text-[#202420]">{value}</p>
      </div>
    </div>
  );
}
