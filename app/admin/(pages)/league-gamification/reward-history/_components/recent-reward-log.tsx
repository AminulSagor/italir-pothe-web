import Image from "next/image";
import {
    Eye,
    Filter,
    Gift,
    Headphones,
    MoreVertical,
    ScanSearch,
    Shirt,
    Tablet,
    Ticket,
} from "lucide-react";

const rewardLogs = [
    {
        name: "Alex Johnson",
        username: "Diamond League",
        image: "/images/reporter-avatar.png",
        prize: "Apple iPad Pro",
        icon: Tablet,
        date: "Oct 24, 2023",
        address: "123 Via Roma, Milan, MI 20121",
        status: "Rewarded",
        color: "bg-[#DDF7D7] text-[#56A54A]",
    },
    {
        name: "Sarah Chen",
        username: "Platinum League",
        image: "/images/sarah-jenkins.png",
        prize: "Limited Hoodie",
        icon: Shirt,
        date: "Oct 23, 2023",
        address: "45 Corso Vittorio, Turin, TO 10121",
        status: "Address Received",
        color: "bg-[#DEE8FF] text-[#5E7EF5]",
    },
    {
        name: "Marco De Luca",
        username: "Gold League",
        image: "/images/alex-rivera.png",
        prize: "Honorary Certificate",
        icon: Ticket,
        date: "Oct 22, 2023",
        address: "Waiting for confirmation...",
        status: "Notified",
        color: "bg-[#FFE7B5] text-[#DB9C1F]",
    },
    {
        name: "Lorenzo Rossi",
        username: "Diamond League",
        image: "/images/alex-rivera.png",
        prize: "Noise-Cancelling Gear",
        icon: Headphones,
        date: "Oct 21, 2023",
        address: "Via dei Mille 12, Naples, NA 80121",
        status: "Rewarded",
        color: "bg-[#DDF7D7] text-[#56A54A]",
    },
];

export default function RecentRewardLog() {
    return (
        <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
            <div className="flex items-center justify-between border-b border-black/5 px-8 py-7">
                <h2 className="text-2xl font-bold text-black/90">
                    Recent Reward Log
                </h2>

                <div className="flex gap-3">
                    <button className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]">
                        <Filter className="size-5 text-black/70" />
                    </button>

                    <button className="flex size-12 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]">
                        <MoreVertical className="size-5 text-black/70" />
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">
                    <thead className="bg-[#EEF3EC]">
                        <tr className="text-left text-xs font-bold uppercase text-black/45">
                            <th className="px-6 py-6">Recipient</th>
                            <th className="px-6 py-6">Prize Type</th>
                            <th className="px-6 py-6">Dispatch Date</th>
                            <th className="px-6 py-6">Shipping Address</th>
                            <th className="px-6 py-6">Status</th>
                            <th className="px-6 py-6 text-center">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rewardLogs.map((item, index) => {
                            const Icon = item.icon;

                            return (
                                <tr
                                    key={index}
                                    className="border-b border-black/8 last:border-none"
                                >
                                    <td className="px-6 py-7">
                                        <div className="flex items-center gap-4">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                width={50}
                                                height={50}
                                                className="size-12 rounded-full object-cover"
                                            />

                                            <div>
                                                <p className="text-lg font-semibold text-black/85">
                                                    {item.name}
                                                </p>

                                                <p className="text-lg text-secondary">
                                                    {item.username}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-7">
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-10 items-center justify-center rounded-full bg-[#F2E8FF] text-[#8E4DE6]">
                                                <Icon className="size-5" />
                                            </div>

                                            <p className="max-w-[150px] text-xl text-black/80">
                                                {item.prize}
                                            </p>
                                        </div>
                                    </td>

                                    <td className="px-6 py-7 text-xl text-black/75">
                                        {item.date}
                                    </td>

                                    <td className="px-6 py-7 text-lg text-black/55">
                                        {item.address}
                                    </td>

                                    <td className="px-6 py-7">
                                        <span
                                            className={`rounded-full px-4 py-2 text-sm font-bold uppercase ${item.color}`}
                                        >
                                            {item.status}
                                        </span>
                                    </td>

                                    <td className="px-6 py-7">
                                        <div className="flex items-center justify-center gap-3">
                                            <button className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]">
                                                <Eye className="size-5 text-black/70" />
                                            </button>

                                            <button className="flex size-11 cursor-pointer items-center justify-center rounded-full bg-[#EEF3EC]">
                                                <Gift className="size-5 text-black/70" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="flex items-center justify-between bg-[#EAF5DD] px-8 py-6">
                <p className="text-black/50">
                    Showing 1 to 4 of 124 entries
                </p>

                <div className="flex items-center gap-5">
                    <button>{"‹"}</button>
                    <button className="flex size-10 items-center justify-center rounded-full bg-secondary text-white">
                        1
                    </button>
                    <button>2</button>
                    <button>3</button>
                    <button>...</button>
                    <button>{"›"}</button>
                </div>
            </div>
        </section>
    );
}