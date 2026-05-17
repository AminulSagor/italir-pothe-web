import { sentenceBankItems } from "@/mock/skill-builder-manager/module-sentence-bank-builder/module-sentence-bank-builder.mock";

import SentenceBankItem from "./sentence-bank-item";
import SentenceBankPagination from "./sentence-bank-pagination";
import SentenceBankToolbar from "./sentence-bank-toolbar";
import SentenceStatsCards from "./sentence-stats-cards";

export default function SentenceBankSection() {
  return (
    <section className="space-y-7">
      <SentenceBankToolbar />

      <div className="space-y-5">
        {sentenceBankItems.map((item) => (
          <SentenceBankItem key={item.id} item={item} />
        ))}
      </div>

      <SentenceBankPagination />

      <SentenceStatsCards />
    </section>
  );
}
