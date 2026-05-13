import DealLogicForm from "./_components/deal-logic-form";
import PartnerProfileForm from "./_components/partner-profile-form";

export default function EditInfluencerPartnerPage() {
    return (
        <div className="flex min-h-[calc(100vh-8rem)] items-center justify-center">
            <section className="w-full max-w-[980px] overflow-hidden rounded-[2rem] bg-white shadow-sm">
                <div className="grid gap-8 p-8 lg:grid-cols-2">
                    <PartnerProfileForm />
                    <DealLogicForm />
                </div>

                <div className="flex items-center justify-end gap-8 bg-[#EEF3EC] px-8 py-5">
                    <button className="text-sm font-medium text-black/65">Cancel</button>

                    <button className="h-11 rounded-full bg-secondary px-12 text-sm font-semibold text-white shadow-lg shadow-secondary/20">
                        Save Changes
                    </button>
                </div>
            </section>
        </div>
    );
}