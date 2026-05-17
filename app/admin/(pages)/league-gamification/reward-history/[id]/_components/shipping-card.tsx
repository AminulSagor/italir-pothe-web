import { MapPin, Pencil } from "lucide-react";

type RewardStatus = "notified" | "received" | "rewarded";

interface ShippingCardProps {
    status: RewardStatus;
}

export default function ShippingCard({ status }: ShippingCardProps) {
    const isReceived = status === "received";
    const isRewarded = status === "rewarded";

    return (
        <section className="rounded-[2.5rem] bg-white p-7 shadow-xl shadow-black/5">
            <div className="mb-7 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <MapPin className="size-6 text-secondary" />
                    <h2 className="text-lg font-bold text-black/90">
                        {isReceived ? "Shipping Information" : "Shipping Address"}
                    </h2>
                </div>

                {isReceived && (
                    <button className="flex items-center gap-2 text-sm font-bold uppercase text-secondary">
                        <Pencil className="size-4" />
                        Edit Address
                    </button>
                )}
            </div>

            {isReceived ? (
                <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
                    <AddressInfo />
                    <MapPreview />
                </div>
            ) : isRewarded ? (
                <div>
                    <AddressInfo />

                    <p className="mt-7 text-xs font-semibold uppercase text-black/20">
                        Locked for history
                    </p>
                </div>
            ) : (
                <div className="flex min-h-[270px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-[#BCCBBE] bg-[#F8FAF6] text-center">
                    <div className="flex size-20 items-center justify-center rounded-full border-4 border-[#BCCBBE] text-2xl text-[#BCCBBE]">
                        ...
                    </div>

                    <h3 className="mt-5 text-2xl font-semibold text-black/70">
                        Pending Address
                    </h3>

                    <p className="mt-3 max-w-[280px] text-lg leading-8 text-black/45">
                        Waiting for student to provide shipping details via the app.
                    </p>
                </div>
            )}
        </section>
    );
}

function AddressInfo() {
    return (
        <div className="space-y-2 text-lg text-black/70">
            <p className="text-lg font-semibold text-black/90">Alex Johnson</p>
            <p>123 Via Roma</p>
            <p>Milan, MI 20121</p>
            <p>Italy</p>
        </div>
    );
}

function MapPreview() {
    return (
        <div className="h-[180px] overflow-hidden rounded-[2rem] bg-[#E8E8E8]">
            <div className="flex h-full items-center justify-center text-3xl">
                📍
            </div>
        </div>
    );
}