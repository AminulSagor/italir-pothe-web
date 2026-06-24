import AppStatusPage from "@/components/system/app-status-page";

export default function UnauthorizedPage() {
  return (
    <AppStatusPage
      variant="unauthorized"
      primaryAction={{
        label: "Sign In Again",
        href: "/auth",
      }}
      secondaryAction={{
        label: "Return Home",
        href: "/",
      }}
    />
  );
}
