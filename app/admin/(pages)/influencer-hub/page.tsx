import type {
  InfluencerCouponProductDomain,
  InfluencerPartnerSortBy,
  InfluencerPartnerStatus,
  InfluencerSortOrder,
} from "@/types/influencer-hub/influencer-hub.type";

import InfluencerHubClient from "./_components/influencer-hub-client";

interface InfluencerHubPageProps {
  searchParams: Promise<{
    page?: string | string[];
    limit?: string | string[];
    search?: string | string[];
    status?: string | string[];
    couponCode?: string | string[];
    productDomain?: string | string[];
    sortBy?: string | string[];
    sortOrder?: string | string[];
  }>;
}

const one = (value?: string | string[]) => {
  return Array.isArray(value) ? value[0] || "" : value || "";
};

const positiveInteger = (value?: string | string[], fallback = 1) => {
  const parsed = Number(one(value));

  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};

const statuses: InfluencerPartnerStatus[] = ["active", "inactive", "suspended"];

const productDomains: InfluencerCouponProductDomain[] = [
  "course",
  "store_package",
];

const sortByValues: InfluencerPartnerSortBy[] = [
  "createdAt",
  "fullName",
  "usersLinked",
  "totalSales",
  "commission",
];

export default async function InfluencerHubPage({
  searchParams,
}: InfluencerHubPageProps) {
  const params = await searchParams;

  const status = one(params.status) as InfluencerPartnerStatus;

  const productDomain = one(
    params.productDomain,
  ) as InfluencerCouponProductDomain;

  const sortBy = one(params.sortBy) as InfluencerPartnerSortBy;

  const sortOrder = one(params.sortOrder) as InfluencerSortOrder;

  return (
    <InfluencerHubClient
      page={positiveInteger(params.page)}
      limit={positiveInteger(params.limit, 10)}
      search={one(params.search)}
      status={statuses.includes(status) ? status : ""}
      couponCode={one(params.couponCode)}
      productDomain={
        productDomains.includes(productDomain) ? productDomain : ""
      }
      sortBy={sortByValues.includes(sortBy) ? sortBy : "createdAt"}
      sortOrder={sortOrder === "ASC" ? "ASC" : "DESC"}
    />
  );
}
