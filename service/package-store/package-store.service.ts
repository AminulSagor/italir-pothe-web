import { serviceClient } from "@/service/base/service_client";
import type {
  AdminStoreOrderQuery,
  CreateStorePackagePayload,
  CreateStoreProviderProductPayload,
  CvEconomyConfiguration,
  DeleteStoreProviderProductResponse,
  PackageStoreDashboard,
  PackageStoreMessageResponse,
  ProviderRefundOperation,
  RefundStoreOrderPayload,
  ReorderStorePackagesPayload,
  StoreAdminOrder,
  StoreAdminOrderListResponse,
  StorePackage,
  StorePackageListResponse,
  StorePackageQuery,
  StoreProviderProduct,
  StoreProviderProductListResponse,
  UpdateCvEconomyConfigurationPayload,
  UpdateStorePackagePayload,
  UpdateStoreProviderProductPayload,
} from "@/types/package-store/package-store.type";
import { assertValidUuid } from "@/utils/uuid";

const PACKAGE_STORE_BASE_PATH = "/admin/package-store";

const buildQueryString = (
  values: Record<string, string | number | undefined>,
) => {
  const params = new URLSearchParams();

  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === "") {
      return;
    }

    params.set(key, String(value));
  });

  const queryString = params.toString();

  return queryString ? `?${queryString}` : "";
};

export const getPackageStoreDashboard = async () => {
  return serviceClient.get<PackageStoreDashboard>(
    `${PACKAGE_STORE_BASE_PATH}/dashboard`,
  );
};

export const getCvEconomyConfiguration = async () => {
  return serviceClient.get<CvEconomyConfiguration>(
    `${PACKAGE_STORE_BASE_PATH}/cv-economy`,
  );
};

export const updateCvEconomyConfiguration = async (
  payload: UpdateCvEconomyConfigurationPayload,
) => {
  return serviceClient.put<CvEconomyConfiguration>(
    `${PACKAGE_STORE_BASE_PATH}/cv-economy`,
    payload,
  );
};

export const createStorePackage = async (
  payload: CreateStorePackagePayload,
) => {
  return serviceClient.post<StorePackage>(
    `${PACKAGE_STORE_BASE_PATH}/packages`,
    payload,
  );
};

export const getStorePackages = async (query: StorePackageQuery = {}) => {
  const queryString = buildQueryString({
    packageType: query.packageType,

    status: query.status,
    provider: query.provider,

    search: query.search?.trim(),

    page: query.page,
    limit: query.limit,
  });

  return serviceClient.get<StorePackageListResponse>(
    `${PACKAGE_STORE_BASE_PATH}/packages${queryString}`,
  );
};

export const getStorePackageById = async (packageId: string) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  return serviceClient.get<StorePackage>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}`,
  );
};

export const updateStorePackage = async (
  packageId: string,
  payload: UpdateStorePackagePayload,
) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  return serviceClient.patch<StorePackage>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}`,
    payload,
  );
};

export const archiveStorePackage = async (packageId: string) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  return serviceClient.delete<PackageStoreMessageResponse>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}`,
  );
};

export const restoreStorePackage = async (packageId: string) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  return serviceClient.patch<PackageStoreMessageResponse>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}/restore`,
  );
};

export const reorderStorePackages = async (
  payload: ReorderStorePackagesPayload,
) => {
  return serviceClient.patch<PackageStoreMessageResponse>(
    `${PACKAGE_STORE_BASE_PATH}/packages/reorder`,
    payload,
  );
};

export const createStoreProviderProduct = async (
  packageId: string,
  payload: CreateStoreProviderProductPayload,
) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  return serviceClient.post<StoreProviderProduct>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}/provider-products`,
    payload,
  );
};

export const getStoreProviderProducts = async (packageId: string) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  return serviceClient.get<StoreProviderProductListResponse>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}/provider-products`,
  );
};

export const updateStoreProviderProduct = async (
  packageId: string,
  providerProductId: string,
  payload: UpdateStoreProviderProductPayload,
) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  const safeProviderProductId = assertValidUuid(
    providerProductId,
    "Provider product ID",
  );

  return serviceClient.patch<StoreProviderProduct>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}/provider-products/${safeProviderProductId}`,
    payload,
  );
};

export const deactivateStoreProviderProduct = async (
  packageId: string,
  providerProductId: string,
) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  const safeProviderProductId = assertValidUuid(
    providerProductId,
    "Provider product ID",
  );

  return serviceClient.patch<StoreProviderProduct>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}/provider-products/${safeProviderProductId}`,
    {
      isActive: false,
    },
  );
};

export const deleteStoreProviderProduct = async (
  packageId: string,
  providerProductId: string,
) => {
  const safePackageId = assertValidUuid(packageId, "Package ID");

  const safeProviderProductId = assertValidUuid(
    providerProductId,
    "Provider product ID",
  );

  return serviceClient.delete<DeleteStoreProviderProductResponse>(
    `${PACKAGE_STORE_BASE_PATH}/packages/${safePackageId}/provider-products/${safeProviderProductId}`,
  );
};

export const getAdminStoreOrders = async (query: AdminStoreOrderQuery = {}) => {
  const queryString = buildQueryString({
    page: query.page,
    limit: query.limit,

    search: query.search?.trim(),

    packageType: query.packageType,

    status: query.status,

    paymentProvider: query.paymentProvider,

    dateFrom: query.dateFrom,
    dateTo: query.dateTo,

    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<StoreAdminOrderListResponse>(
    `${PACKAGE_STORE_BASE_PATH}/orders${queryString}`,
  );
};

export const exportAdminStoreOrdersCsv = async (
  query: Omit<AdminStoreOrderQuery, "page" | "limit"> = {},
) => {
  const queryString = buildQueryString({
    search: query.search?.trim(),

    packageType: query.packageType,

    status: query.status,

    paymentProvider: query.paymentProvider,

    dateFrom: query.dateFrom,
    dateTo: query.dateTo,

    sortBy: query.sortBy,
    sortOrder: query.sortOrder,
  });

  return serviceClient.get<string>(
    `${PACKAGE_STORE_BASE_PATH}/orders/export${queryString}`,
  );
};

export const getAdminStoreOrderById = async (orderId: string) => {
  const safeOrderId = assertValidUuid(orderId, "Order ID");

  return serviceClient.get<StoreAdminOrder>(
    `${PACKAGE_STORE_BASE_PATH}/orders/${safeOrderId}`,
  );
};

export const getAdminStoreOrderInvoice = async (orderId: string) => {
  const safeOrderId = assertValidUuid(orderId, "Order ID");

  return serviceClient.get<string>(
    `${PACKAGE_STORE_BASE_PATH}/orders/${safeOrderId}/invoice`,
  );
};

export const refundAdminStoreOrder = async (
  orderId: string,
  payload: RefundStoreOrderPayload = {},
) => {
  const safeOrderId = assertValidUuid(orderId, "Order ID");

  return serviceClient.post<{
    message: string;
    refundOperation?: ProviderRefundOperation;
    order?: StoreAdminOrder;
  }>(`${PACKAGE_STORE_BASE_PATH}/orders/${safeOrderId}/refund`, payload);
};

export const demoRefundAdminStoreOrder = async (
  orderId: string,
  payload: RefundStoreOrderPayload = {},
) => {
  const safeOrderId = assertValidUuid(orderId, "Order ID");

  return serviceClient.post<StoreAdminOrder>(
    `${PACKAGE_STORE_BASE_PATH}/orders/${safeOrderId}/demo-refund`,
    payload,
  );
};
