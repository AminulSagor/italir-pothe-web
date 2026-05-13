"use client";

import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import { useState } from "react";

export default function CafCourseAllocation() {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <section className="rounded-[2rem] bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-deep-green">
                        CAF Course Allocation
                    </h2>

                    <p className="mt-1 text-sm text-black/55">
                        Select which of your existing courses should appear in the CAF
                        Educational Hub.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsExpanded((prev) => !prev)}
                    className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-black/60"
                >
                    {isExpanded ? (
                        <ChevronUp className="size-4" />
                    ) : (
                        <ChevronDown className="size-4" />
                    )}
                </button>
            </div>

            {isExpanded && (
                <>
                    <div className="mt-6 flex h-12 max-w-[700px] items-center gap-3 rounded-full bg-[#EEF3EC] px-5 text-black/40">
                        <Search className="size-4" />
                        <span className="text-sm">
                            Search existing courses to add... (e.g., Tax Basics, A1)
                        </span>
                    </div>

                    <div className="mt-4 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                        <span className="inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-deep-green">
                            Introduction to Italian Taxes
                            <X className="size-4" />
                        </span>

                        <button className="h-11 rounded-full bg-secondary px-6 text-sm font-semibold text-white shadow-sm">
                            Update CAF Courses
                        </button>
                    </div>
                </>
            )}
        </section>
    );
}