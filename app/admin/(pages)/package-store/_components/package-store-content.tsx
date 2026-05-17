import AiBundlesTable from "./ai-bundles-table";
import OrderHistoryTable from "./order-history-table";
import StreakFreezesTable from "./streak-freezes-table";

export default function PackageStoreContent({
  activeTab,
}: {
  activeTab?: string;
}) {
  if (activeTab === "streak-freezes") {
    return <StreakFreezesTable />;
  }

  if (activeTab === "order-history") {
    return <OrderHistoryTable />;
  }

  return <AiBundlesTable />;
}
