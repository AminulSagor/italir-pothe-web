import { manageVocabularyMockData } from "@/mock/manage-vocabulary/manage-vocabulary.mock";

import VocabularyFormCard from "./_components/vocabulary-form-card";
import VocabularyHeader from "./_components/vocabulary-header";
import VocabularyTableCard from "./_components/vocabulary-table-card";
import VocabularyToolbar from "./_components/vocabulary-toolbar";

export default function ManageVocabularyPage() {
  return (
    <div className="space-y-6">
      <VocabularyHeader />
      <VocabularyToolbar />
      <VocabularyFormCard />
      <VocabularyTableCard words={manageVocabularyMockData} />
    </div>
  );
}
