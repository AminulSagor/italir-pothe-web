import { Suspense } from "react";

import ManageVocabularyContent from "./_components/manage-vocabulary-content";

export default function ManageVocabularyPage() {
  return (
    <Suspense fallback={null}>
      <ManageVocabularyContent />
    </Suspense>
  );
}
