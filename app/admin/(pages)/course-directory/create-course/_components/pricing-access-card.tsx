"use client";

import { useEffect, useState } from "react";
import { WalletCards } from "lucide-react";

import Card from "@/components/UI/cards/card";

import ConfirmPriceChangeDialog from "./confirm-price-change-dialog";

interface PricingAccessCardProps {
  isFree: boolean;
  price: string;
  couponCode: string;
  disabled?: boolean;
  courseTitle?: string;
  onIsFreeChange: (value: boolean) => void;
  onPriceChange: (value: string) => void;
  onCouponCodeChange: (value: string) => void;
}

const normalizePrice = (value: string) => {
  const numericValue = Number(value);

  if (Number.isNaN(numericValue)) return "0.00";

  return numericValue.toFixed(2);
};

const PricingAccessCard = ({
  isFree,
  price,
  couponCode,
  disabled = false,
  courseTitle,
  onIsFreeChange,
  onPriceChange,
  onCouponCodeChange,
}: PricingAccessCardProps) => {
  const [previousPrice, setPreviousPrice] = useState(normalizePrice(price));
  const [pendingPrice, setPendingPrice] = useState(normalizePrice(price));
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);

  useEffect(() => {
    const syncedPrice = normalizePrice(price);

    setPreviousPrice(syncedPrice);
    setPendingPrice(syncedPrice);
  }, [price]);

  const handlePriceBlur = () => {
    const normalizedPendingPrice = normalizePrice(pendingPrice);

    setPendingPrice(normalizedPendingPrice);

    if (isFree || normalizedPendingPrice === previousPrice || disabled) {
      return;
    }

    setIsPriceDialogOpen(true);
  };

  const handleConfirmPrice = () => {
    const normalizedPendingPrice = normalizePrice(pendingPrice);

    setPreviousPrice(normalizedPendingPrice);
    setPendingPrice(normalizedPendingPrice);
    onPriceChange(normalizedPendingPrice);
    setIsPriceDialogOpen(false);
  };

  const handleCancelPrice = () => {
    setPendingPrice(previousPrice);
    setIsPriceDialogOpen(false);
  };

  const handleToggleFree = () => {
    if (disabled) return;

    const nextValue = !isFree;

    onIsFreeChange(nextValue);

    if (nextValue) {
      setPendingPrice("0.00");
      setPreviousPrice("0.00");
      onPriceChange("0.00");
      return;
    }

    if (Number(previousPrice) === 0) {
      setPendingPrice("0.00");
      onPriceChange("0.00");
    }
  };

  return (
    <>
      <Card padding="lg" rounded="3xl" shadow="sm">
        <div className="mb-6 flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-full bg-[#E6F6F0]">
            <WalletCards className="size-5 text-[#006B3F]" />
          </div>

          <h2 className="text-lg font-bold text-[#202420]">Pricing & Access</h2>
        </div>

        <button
          type="button"
          disabled={disabled}
          onClick={handleToggleFree}
          className="mb-5 flex w-full items-center justify-between rounded-full bg-[#EEF3EC] px-5 py-3 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="text-sm font-semibold text-[#202420]">
            Set as Free
          </span>

          <span
            className={`flex h-7 w-12 items-center rounded-full p-1 transition ${
              isFree ? "bg-[#006B3F]" : "bg-[#DDE4DA]"
            }`}
          >
            <span
              className={`size-5 rounded-full bg-white shadow-sm transition ${
                isFree ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </span>
        </button>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-bold text-[#202420]">
              REFERENCE PRICE (EUR)
            </label>

            <input
              value={isFree ? "0.00" : pendingPrice}
              disabled={disabled || isFree}
              onChange={(event) => setPendingPrice(event.target.value)}
              onBlur={handlePriceBlur}
              className="w-full rounded-full bg-[#EEF3EC] px-5 py-3 text-sm text-[#202420] outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
            <p className="mt-2 text-xs leading-5 text-[#8A948D]">
              This is the internal reference price. Android and iOS users will
              see the localized price configured in Google Play Console or App
              Store Connect.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-[#202420]">
              Coupon Code
            </label>

            <input
              value={couponCode}
              disabled={disabled || isFree}
              placeholder="WELCOME20"
              onChange={(event) => onCouponCodeChange(event.target.value)}
              className="w-full rounded-full bg-[#EEF3EC] px-5 py-3 text-sm font-bold text-[#202420] outline-none placeholder:text-black/35 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>
        </div>
      </Card>

      <ConfirmPriceChangeDialog
        open={isPriceDialogOpen}
        onClose={handleCancelPrice}
        onConfirm={handleConfirmPrice}
        previousPrice={previousPrice}
        newPrice={pendingPrice}
      />
    </>
  );
};

export default PricingAccessCard;
