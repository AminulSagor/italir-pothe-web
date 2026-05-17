import AddSentenceButton from "./_components/add-sentence-button";
import MagicAddWorkspaceCard from "./_components/magic-add-workspace-card";
import ModuleNameCard from "./_components/module-name-card";
import ModuleSentenceBankHeader from "./_components/module-sentence-bank-header";
import SentenceBankSection from "./_components/sentence-bank-section";

export default function ModuleSentenceBankBuilderPage() {
  return (
    <div className="space-y-7">
      <ModuleSentenceBankHeader />

      <ModuleNameCard />

      <AddSentenceButton />

      <MagicAddWorkspaceCard />

      <SentenceBankSection />
    </div>
  );
}
