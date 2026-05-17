import Image from "next/image";
import { Bell, Search, ShieldBan } from "lucide-react";

export default function UserDirectoryHeader() {
    return (
        <header className="space-y-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex h-14 w-full items-center gap-4 rounded-full bg-[#EEF3EC] px-6 text-black/40 lg:max-w-[650px]">
                    <Search className="size-5" />
                    <span>Search by name, email, or phone...</span>
                </div>

                <div className="flex items-center gap-5">
                    <Bell className="size-6 text-black/75" />

                    <ShieldBan className="size-6 text-black/75" />

                    <button className="rounded-full bg-secondary px-8 py-4 text-sm font-bold text-white">
                        Quick Ban
                    </button>

                    <Image
                        src="/images/sarah-jenkins.png"
                        alt="Admin"
                        width={52}
                        height={52}
                        className="size-13 rounded-full object-cover"
                    />
                </div>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-deep-green">
                User Directory
            </h1>
        </header>
    );
}