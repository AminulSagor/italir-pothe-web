import DealLogicPanel from "./_components/deal-logic-panel";
import PartnerProfilePanel from "./_components/partner-profile-panel";

export default function DealConfiguratorPage() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <section className="grid w-full max-w-[980px] overflow-hidden rounded-[2rem] bg-white shadow-sm lg:grid-cols-[380px_1fr]">
                <PartnerProfilePanel />
                <DealLogicPanel />
            </section>
        </div>
    );
}