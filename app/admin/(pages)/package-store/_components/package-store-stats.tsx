import Card from "@/components/UI/cards/card";
import { packageStoreStats } from "@/mock/package-store/package-store.mock";

export default function PackageStoreStats() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {packageStoreStats.map((stat) => (
        <Card key={stat.id} padding="lg" rounded="3xl" shadow="sm">
          <div className="flex items-start gap-4">
            <div
              className={`flex size-12 items-center justify-center rounded-2xl text-base ${stat.iconBg}`}
            >
              {stat.icon}
            </div>

            <div>
              <p className="text-xs font-semibold text-[#4F5B52]">
                {stat.title}
              </p>

              <h3 className="text-xl font-bold text-[#202420]">{stat.value}</h3>

              <p className="mt-4 text-sm font-medium text-[#007A35]">
                {stat.subtitle}
              </p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
