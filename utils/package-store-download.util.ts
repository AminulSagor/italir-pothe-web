import type { StoreAdminOrder } from "@/types/package-store/package-store.type";

const escapeCsvCell = (value: string | number | null | undefined) => {
  let normalizedValue =
    value === null || value === undefined ? "" : String(value);

  if (/^[=+\-@]/.test(normalizedValue)) {
    normalizedValue = `'${normalizedValue}`;
  }

  return `"${normalizedValue.replace(/"/g, '""')}"`;
};

export const downloadTextFile = (
  content: string,
  filename: string,
  mimeType: string,
) => {
  const blob = new Blob([content], {
    type: mimeType,
  });

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.style.display = "none";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(downloadUrl);
};

export const downloadCurrentStoreOrdersCsv = (
  orders: StoreAdminOrder[],
  filename: string,
) => {
  const headers = [
    "Order ID",
    "Order Number",
    "Customer Name",
    "Customer Email",
    "Package Name",
    "Package Type",
    "Payment Provider",
    "Currency",
    "Amount Paid",
    "Amount EUR",
    "Status",
    "Created At",
    "Paid At",
    "Refunded At",
  ];

  const rows = orders.map((order) => [
    order.id,
    order.orderNumber,
    order.user?.name,
    order.user?.email,
    order.package.name,
    order.package.type,
    order.payment.provider,
    order.pricing.currency,
    order.pricing.paymentAmount,
    order.pricing.totalAmountEur,
    order.status,
    order.createdAt,
    order.payment.paidAt,
    order.payment.refundedAt,
  ]);

  const csv = [
    headers.map(escapeCsvCell).join(","),
    ...rows.map((row) => row.map(escapeCsvCell).join(",")),
  ].join("\r\n");

  downloadTextFile(`\uFEFF${csv}`, filename, "text/csv;charset=utf-8");
};
