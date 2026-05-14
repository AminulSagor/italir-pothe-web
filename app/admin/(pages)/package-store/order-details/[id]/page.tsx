import CustomerInfoCard from "./_components/customer-info-card";
import OrderDetailsHeader from "./_components/order-details-header";
import OrderSummaryCard from "./_components/order-summary-card";
import PackageDetailsCard from "./_components/package-details-card";
import PaymentSummaryCard from "./_components/payment-summary-card";
import TimelineActivityCard from "./_components/timeline-activity-card";

export default function OrderDetailsPage() {
  return (
    <section className="space-y-6">
      <OrderDetailsHeader />
      <OrderSummaryCard />

      <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
        <CustomerInfoCard />
        <PackageDetailsCard />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
        <PaymentSummaryCard />
        <TimelineActivityCard />
      </div>
    </section>
  );
}
