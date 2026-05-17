"use client";

import { useState } from "react";
import { WalletCards } from "lucide-react";
import Card from "@/components/UI/cards/card";
import { createCoursePricing } from "@/mock/create-course/create-course-pricing.mock";
import ConfirmPriceChangeDialog from "./confirm-price-change-dialog";

const PricingAccessCard = () => {
  const [isFree, setIsFree] = useState(false);
  const [price, setPrice] = useState(createCoursePricing.price);
  const [pendingPrice, setPendingPrice] = useState(createCoursePricing.price);
  const [isPriceDialogOpen, setIsPriceDialogOpen] = useState(false);

  const handlePriceBlur = () => {
    if (isFree || !pendingPrice || pendingPrice === price) return;
    setIsPriceDialogOpen(true);
  };

  const handleConfirmPrice = () => {
    setPrice(pendingPrice);
    setIsPriceDialogOpen(false);
  };

  const handleCancelPrice = () => {
    setPendingPrice(price);
    setIsPriceDialogOpen(false);
  };

  const handleToggleFree = () => {
    setIsFree((prev) => !prev);
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
          onClick={handleToggleFree}
          className="mb-5 flex w-full items-center justify-between rounded-full bg-[#EEF3EC] px-5 py-3"
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
              Price (EUR)
            </label>

            <input
              value={isFree ? "0.00" : pendingPrice}
              disabled={isFree}
              onChange={(event) => setPendingPrice(event.target.value)}
              onBlur={handlePriceBlur}
              className="w-full rounded-full bg-[#EEF3EC] px-5 py-3 text-sm text-[#202420] outline-none disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          <div>
            <label className="mb-2 block text-xs font-bold text-[#202420]">
              Coupon Code
            </label>

            <div className="flex items-center justify-between rounded-full bg-[#EEF3EC] px-5 py-3">
              <span className="text-sm font-bold text-[#202420]">
                {createCoursePricing.couponCode}
              </span>

              <button
                type="button"
                className="rounded-full bg-[#DDFBE6] px-3 py-1 text-xs font-bold text-[#00864F]"
              >
                APPLY
              </button>
            </div>
          </div>
        </div>
      </Card>

      <ConfirmPriceChangeDialog
        open={isPriceDialogOpen}
        onClose={handleCancelPrice}
        onConfirm={handleConfirmPrice}
        previousPrice={price}
        newPrice={pendingPrice}
      />
    </>
  );
};

export default PricingAccessCard;
