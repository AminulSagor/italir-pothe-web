import { finalExamTabs } from "@/mock/final-exam-manager/final-exam-manager.mock";

const FinalExamTabs = () => {
  return (
    <div className="border-b border-[#DCE5DD]">
      <div className="flex items-center gap-8 overflow-x-auto">
        {finalExamTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`relative pb-4 text-sm font-medium whitespace-nowrap transition ${
              tab.active
                ? "text-[#006B3F]"
                : "text-[#6F7673] hover:text-[#202420]"
            }`}
          >
            {tab.label}

            {tab.active && (
              <div className="absolute bottom-0 left-0 h-[3px] w-full rounded-full bg-[#006B3F]" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FinalExamTabs;
