import { Ban, Eye, MessageSquare, Search } from "lucide-react";
import { directoryUsers } from "../../../../../mock/user-directory/user-directory.mock";

export default function UserDirectoryTable() {
    return (
        <section className="rounded-[2.5rem] bg-white shadow-xl shadow-black/5">
            <div className="space-y-7 p-8">
                <div className="flex flex-wrap gap-3">
                    <button className="rounded-full bg-secondary px-7 py-3 text-sm font-semibold text-white">
                        All Users
                    </button>

                    <button className="rounded-full bg-[#EEF3EC] px-7 py-3 text-sm font-semibold text-black/55">
                        Free
                    </button>

                    <button className="rounded-full bg-[#EEF3EC] px-7 py-3 text-sm font-semibold text-black/55">
                        Premium/Pro
                    </button>
                </div>

                <div className="flex h-16 items-center gap-4 rounded-full bg-[#EEF3EC] px-6 text-black/35">
                    <Search className="size-5" />
                    <span>Search user by phone number, email or name</span>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full min-w-[980px]">
                    <thead>
                        <tr className="border-y border-black/5 text-left text-sm font-semibold uppercase text-black/35">
                            <th className="px-8 py-5">User</th>
                            <th className="px-5 py-5">Join Date</th>
                            <th className="px-5 py-5">Status</th>
                            <th className="px-5 py-5">XP Total</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {directoryUsers.map((user) => (
                            <tr
                                key={user.email}
                                className="border-b border-black/5"
                            >
                                <td className="px-8 py-7">
                                    <div className="flex items-center gap-4">
                                        <div className="flex size-14 items-center justify-center rounded-full bg-[#E6F2F0] text-lg font-bold text-secondary">
                                            {user.initials}
                                        </div>

                                        <div>
                                            <h3 className="text-lg font-semibold text-black/90">
                                                {user.name}
                                            </h3>

                                            <p className="text-sm text-black/45">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-5 py-7 text-base text-black/65">
                                    {user.joinDate}
                                </td>

                                <td className="px-5 py-7">
                                    <span className="rounded-full bg-[#E4F4E5] px-5 py-2 text-sm font-semibold text-secondary">
                                        • {user.status}
                                    </span>
                                </td>

                                <td className="px-5 py-7 text-lg font-semibold text-black/85">
                                    {user.xpTotal}
                                </td>

                                <td className="px-8 py-7">
                                    <div className="flex justify-end gap-4 text-black/65">
                                        <Eye className="size-5 cursor-pointer" />
                                        <MessageSquare className="size-5 cursor-pointer" />
                                        <Ban className="size-5 cursor-pointer" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="flex flex-col gap-5 p-8 lg:flex-row lg:items-center lg:justify-between">
                <p className="text-base text-black/45">
                    Showing 1-20 of 15,420 users
                </p>

                <div className="flex items-center gap-3">
                    <button className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/45">
                        ‹
                    </button>

                    <button className="flex size-11 items-center justify-center rounded-full bg-secondary text-white">
                        1
                    </button>

                    <button className="text-lg text-black/70">2</button>
                    <button className="text-lg text-black/70">3</button>

                    <span className="text-black/45">...</span>

                    <button className="text-lg text-black/70">771</button>

                    <button className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/45">
                        ›
                    </button>
                </div>
            </div>
        </section>
    );
}