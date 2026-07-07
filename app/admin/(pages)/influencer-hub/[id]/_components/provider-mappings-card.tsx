import { Boxes, CheckCircle2, XCircle } from "lucide-react";

import type {
  InfluencerDeal,
  InfluencerProviderMapping,
} from "@/types/influencer-hub/influencer-hub.type";

interface ProviderMappingsCardProps {
  deal: InfluencerDeal | null;
}

const formatLabel = (value?: string | null) => {
  if (!value) return "—";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
};

const getTargetId = (mapping: InfluencerProviderMapping) => {
  if (mapping.productDomain === "course") {
    return mapping.courseId || "—";
  }

  return mapping.storePackageId || "—";
};

export default function ProviderMappingsCard({
  deal,
}: ProviderMappingsCardProps) {
  const mappings = deal?.providerMappings || [];

  return (
    <section className="rounded-[2rem] bg-white p-6 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="flex size-11 items-center justify-center rounded-full bg-[#DDF3E8] text-secondary">
          <Boxes className="size-5" />
        </div>

        <div>
          <h2 className="text-xl font-bold text-deep-green">
            Coupon Provider Mappings
          </h2>

          <p className="text-sm leading-6 text-black/50">
            Coupon selects the matching discounted Google Play/App Store
            product. The admin must keep regular and discounted product IDs
            aligned with store console setup.
          </p>
        </div>
      </div>

      <div className="mt-5 rounded-3xl border border-[#FFE2A8] bg-[#FFF8E8] p-5 text-sm leading-6 text-[#7A4E00]">
        The coupon only selects the matching discounted Google Play/App Store
        product. Final charge is controlled by the store and may include local
        VAT, tax, currency conversion, or regional pricing.
      </div>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[980px]">
          <thead>
            <tr className="bg-[#F7FAF5] text-left text-xs font-bold uppercase text-black/45">
              <th className="px-5 py-4">Domain</th>

              <th className="px-5 py-4">Target ID</th>

              <th className="px-5 py-4">Provider</th>

              <th className="px-5 py-4">Regular Product ID</th>

              <th className="px-5 py-4">Discounted Product ID</th>

              <th className="px-5 py-4">Base Plan / Offer</th>

              <th className="px-5 py-4">Status</th>
            </tr>
          </thead>

          <tbody>
            {mappings.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-12 text-center text-sm text-black/45"
                >
                  No provider mappings configured.
                </td>
              </tr>
            )}

            {mappings.map((mapping, index) => (
              <tr
                key={mapping.id || `${mapping.provider}-${index}`}
                className="border-t border-black/5"
              >
                <td className="px-5 py-4 text-sm font-semibold text-black/75">
                  {formatLabel(mapping.productDomain)}
                </td>

                <td className="px-5 py-4 max-w-[170px] break-all text-xs text-black/45">
                  {getTargetId(mapping)}
                </td>

                <td className="px-5 py-4 text-sm font-semibold text-black/75">
                  {formatLabel(mapping.provider)}
                </td>

                <td className="px-5 py-4 max-w-[210px] break-all text-xs text-black/55">
                  {mapping.regularProviderProductId || "—"}
                </td>

                <td className="px-5 py-4 max-w-[210px] break-all text-xs font-semibold text-secondary">
                  {mapping.discountedProviderProductId || "—"}
                </td>

                <td className="px-5 py-4 text-xs text-black/50">
                  <p>Base: {mapping.providerBasePlanId || "—"}</p>

                  <p className="mt-1">
                    Offer: {mapping.providerOfferId || "—"}
                  </p>
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-bold ${
                      mapping.isActive
                        ? "bg-[#DDF3E8] text-[#007A35]"
                        : "bg-[#EEF3EC] text-[#4F5B52]"
                    }`}
                  >
                    {mapping.isActive ? (
                      <CheckCircle2 className="size-3.5" />
                    ) : (
                      <XCircle className="size-3.5" />
                    )}

                    {mapping.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
