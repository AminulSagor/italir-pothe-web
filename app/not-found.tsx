import AppStatusPage from "@/components/system/app-status-page";

export default function NotFoundPage() {
  return (
    <AppStatusPage
      variant="not-found"
      primaryAction={{
        label: "Go to Dashboard",
        href: "/admin/dashboard",
      }}
      secondaryAction={{
        label: "Go Back",
        kind: "back",
      }}
    />
  );
}
