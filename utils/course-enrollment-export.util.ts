import type { CourseEnrollment } from "@/types/course-directory/course-commerce.type";

const escapeCsvValue = (value: string | number | null) => {
  let normalizedValue = value === null ? "" : String(value);

  if (/^[=+\-@]/.test(normalizedValue)) {
    normalizedValue = `'${normalizedValue}`;
  }

  return `"${normalizedValue.replace(/"/g, '""')}"`;
};

const formatDate = (value: string | null) => {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toISOString();
};

const createCsvContent = (enrollments: CourseEnrollment[]) => {
  const headers = [
    "Student Name",
    "Student ID",
    "Phone",
    "Email",
    "Amount Paid",
    "Currency",
    "Enrollment Status",
    "Payment Provider",
    "Enrolled At",
    "Order ID",
  ];

  const rows = enrollments.map((enrollment) => [
    enrollment.student.name,
    enrollment.student.studentCode || enrollment.student.id,
    enrollment.student.phone,
    enrollment.student.email,
    enrollment.amountPaid,
    enrollment.currency,
    enrollment.status,
    enrollment.paymentProvider,
    formatDate(enrollment.enrolledAt),
    enrollment.orderId,
  ]);

  return [
    headers.map(escapeCsvValue).join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");
};

export const createSafeExportFilename = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
};

export const downloadCourseEnrollmentsCsv = (
  enrollments: CourseEnrollment[],
  filename: string,
) => {
  if (typeof window === "undefined") return;

  const csvContent = createCsvContent(enrollments);
  const blob = new Blob([`\uFEFF${csvContent}`], {
    type: "text/csv;charset=utf-8",
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
