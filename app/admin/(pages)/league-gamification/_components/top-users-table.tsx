import Image from "next/image";
import { ChevronLeft, ChevronRight, Gift, Search, SlidersHorizontal } from "lucide-react";
import { topUsers } from "../../../../../mock/league-gamification/league-gamification.mock";

export default function TopUsersTable() {
    return (
        <section className="overflow-hidden rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
            <div className="flex flex-col gap-5 border-b border-black/5 p-6 xl:flex-row xl:items-center xl:justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-full bg-[#DDF3D9] text-secondary">
                        <Gift className="size-5" />
                    </div>

                    <h2 className="text-lg font-semibold text-black/85">
                        Global Top 10 Users
                    </h2>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row">
                    <div className="flex h-14 items-center gap-3 rounded-full bg-[#EEF3EC] px-5 lg:w-[320px]">
                        <Search className="size-5 text-black/40" />
                        <input
                            placeholder="Search by name or username..."
                            className="w-full bg-transparent outline-none placeholder:text-black/35"
                        />
                    </div>

                    <button className="h-14 rounded-full bg-[#EEF3EC] px-6 text-sm font-medium text-black/70 hover:cursor-pointer">
                        Export CSV
                    </button>

                    <button className="flex h-14 items-center justify-center gap-2 rounded-full bg-[#EEF3EC] px-6 text-sm font-medium text-black/70 hover:cursor-pointer">
                        <SlidersHorizontal className="size-4" />
                        Filter by League
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[900px]">
                    <thead>
                        <tr className="border-b border-black/5 text-left text-sm font-semibold text-black/45">
                            <th className="px-8 py-5">Rank</th>
                            <th>User</th>
                            <th>Current League</th>
                            <th>Total XP</th>
                            <th className="pr-8 text-right">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {topUsers.map((user) => (
                            <tr key={user.rank} className="border-b border-black/5">
                                <td className="px-8 py-6">
                                    <div
                                        className={`flex size-10 items-center justify-center rounded-full font-semibold ${user.rank === 1
                                            ? "bg-[#75FF33] text-secondary"
                                            : "bg-[#EEF1EB] text-black/60"
                                            }`}
                                    >
                                        {user.rank}
                                    </div>
                                </td>

                                <td>
                                    <div className="flex items-center gap-4">
                                        <Image
                                            src={user.avatar}
                                            alt={user.name}
                                            width={52}
                                            height={52}
                                            className="size-12 rounded-full object-cover"
                                        />

                                        <div>
                                            <p className="font-semibold text-black/85">
                                                {user.name}
                                            </p>
                                            <p className="text-sm text-black/45">
                                                {user.username}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span
                                        className={`inline-flex rounded-full px-5 py-2 text-sm font-semibold ${user.league === "Gold"
                                            ? "bg-[#FFF2BF] text-[#C89700]"
                                            : "bg-[#EEF1F5] text-[#7E8795]"
                                            }`}
                                    >
                                        {user.league}
                                    </span>
                                </td>

                                <td className="text-xl font-bold text-black/85">
                                    {user.totalXp}
                                </td>

                                <td className="pr-8 text-right">
                                    <button className="inline-flex h-12 items-center gap-2 rounded-full bg-secondary px-6 text-sm font-semibold text-white hover:cursor-pointer">
                                        <Gift className="size-4" />
                                        Gift Reward
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-4 bg-[#F7FAF5] p-6 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-sm text-black/45">
                    Showing 5 of 10,249 total active members
                </p>

                <div className="flex items-center gap-3">
                    <button className="flex size-10 items-center justify-center rounded-full bg-white text-black/45 shadow-sm">
                        <ChevronLeft className="size-4" />
                    </button>

                    <button className="flex size-10 items-center justify-center rounded-full bg-secondary font-medium text-white">
                        1
                    </button>

                    <button className="flex size-10 items-center justify-center rounded-full bg-[#EEF3EC] font-medium text-black/60">
                        2
                    </button>

                    <button className="flex size-10 items-center justify-center rounded-full bg-white text-black/45 shadow-sm">
                        <ChevronRight className="size-4" />
                    </button>
                </div>
            </div>
        </section>
    );
}