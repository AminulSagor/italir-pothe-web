export type FinalExamTabValue = "all" | "linked" | "drafts";

interface FinalExamTab {
  id: FinalExamTabValue;
  label: string;
}

interface FinalExamTabsProps {
  activeTab: FinalExamTabValue;
  onTabChange: (value: FinalExamTabValue) => void;
}

const finalExamTabs: FinalExamTab[] = [
  {
    id: "all",
    label: "All Exams",
  },
  {
    id: "linked",
    label: "Linked to Course",
  },
  {
    id: "drafts",
    label: "Drafts",
  },
];

const FinalExamTabs = ({ activeTab, onTabChange }: FinalExamTabsProps) => {
  return (
    <div className="border-b border-[#DCE5DD]">
      <div className="flex items-center gap-8 overflow-x-auto">
        {finalExamTabs.map((tab) => {
          const isActive = tab.id === activeTab;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative whitespace-nowrap pb-4 text-sm font-medium transition ${
                isActive
                  ? "text-[#006B3F]"
                  : "text-[#6F7673] hover:text-[#202420]"
              }`}
            >
              {tab.label}

              {isActive && (
                <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#006B3F]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FinalExamTabs;
