import { MapPin, Pencil } from "lucide-react";

import type {
  RewardFulfillment,
  RewardShippingAddress,
} from "@/types/leaderboard/leaderboard.type";

interface ShippingCardProps {
  shippingAddress: RewardShippingAddress | null;

  fulfillment: RewardFulfillment | null;

  canEdit: boolean;
  onEdit: () => void;
}

const formatDate = (value: string | null) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
};

export default function ShippingCard({
  shippingAddress,
  fulfillment,
  canEdit,
  onEdit,
}: ShippingCardProps) {
  return (
    <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
      <div className="mb-7 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapPin className="size-6 text-secondary" />

          <h2 className="text-lg font-bold text-black/90">
            {shippingAddress ? "Shipping Information" : "Shipping Address"}
          </h2>
        </div>

        {canEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="flex items-center gap-2 text-sm font-bold uppercase text-secondary"
          >
            <Pencil className="size-4" />
            Edit Address
          </button>
        )}
      </div>

      {shippingAddress ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          <div className="space-y-2 text-lg text-black/70">
            <p className="text-lg font-semibold text-black/90">
              {shippingAddress.fullName}
            </p>

            <p>{shippingAddress.addressLine}</p>

            <p>{shippingAddress.countryCode}</p>

            <p>{shippingAddress.whatsappNumber}</p>

            {shippingAddress.isLocked && (
              <p className="mt-5 text-xs font-semibold uppercase text-black/25">
                Locked for history
              </p>
            )}

            {fulfillment?.addressReceivedAt && (
              <p className="mt-3 text-xs text-black/40">
                Address received {formatDate(fulfillment.addressReceivedAt)}
              </p>
            )}
          </div>

          <div className="flex h-[180px] items-center justify-center overflow-hidden rounded-[2rem] bg-[#E8E8E8] text-center">
            {shippingAddress.latitude && shippingAddress.longitude ? (
              <div>
                <div className="text-3xl">📍</div>

                <p className="mt-3 text-xs text-black/45">
                  {shippingAddress.latitude}, {shippingAddress.longitude}
                </p>
              </div>
            ) : (
              <div>
                <div className="text-3xl">📍</div>

                <p className="mt-3 text-xs text-black/45">
                  Location coordinates not provided
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#BCCBBE] bg-[#F8FAF6] text-center">
          <div className="flex size-20 items-center justify-center rounded-full border-4 border-[#BCCBBE] text-2xl text-[#BCCBBE]">
            ...
          </div>

          <h3 className="mt-5 text-2xl font-semibold text-black/70">
            Pending Address
          </h3>

          <p className="mt-3 max-w-[280px] text-lg leading-8 text-black/45">
            Waiting for student to provide shipping details via the app.
          </p>

          {fulfillment?.addressRequestedAt && (
            <p className="mt-4 text-xs text-black/35">
              Request sent {formatDate(fulfillment.addressRequestedAt)}
            </p>
          )}
        </div>
      )}
    </section>
  );
}
