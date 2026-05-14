import PackageStoreContent from "./_components/package-store-content";
import PackageStoreHeader from "./_components/package-store-header";
import PackageStoreStats from "./_components/package-store-stats";
import PackageStoreTabs from "./_components/package-store-tabs";

interface Props {
  searchParams: Promise<{
    tab?: string;
  }>;
}

export default async function PackageStorePage({ searchParams }: Props) {
  const params = await searchParams;

  return (
    <section className="space-y-7">
      <PackageStoreHeader />
      <PackageStoreStats />
      <PackageStoreTabs activeTab={params.tab} />
      <PackageStoreContent activeTab={params.tab} />
    </section>
  );
}
