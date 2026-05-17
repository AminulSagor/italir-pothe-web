const points = [
    { month: "Jan", x: 0, y: 170 },
    { month: "Feb", x: 180, y: 130 },
    { month: "Mar", x: 360, y: 100 },
    { month: "Apr", x: 540, y: 55 },
    { month: "May", x: 720, y: 58 },
    { month: "Jun", x: 900, y: 25 },
];

export default function UserGrowthCard() {
    return (
        <section className="rounded-[2.5rem] bg-white p-8 shadow-xl shadow-black/5">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-black/90">
                        User Growth Over Time
                    </h2>

                    <p className="mt-2 text-base text-black/45">
                        Visualizing platform expansion and retention metrics
                    </p>
                </div>

                <div className="flex rounded-full bg-[#EEF3EC] p-1">
                    <button className="rounded-full px-8 py-3 text-sm font-semibold text-black/65">
                        Day
                    </button>
                    <button className="rounded-full px-8 py-3 text-sm font-semibold text-black/65">
                        Week
                    </button>
                    <button className="rounded-full bg-secondary px-8 py-3 text-sm font-semibold text-white">
                        Month
                    </button>
                </div>
            </div>

            <div className="mt-10 overflow-hidden rounded-[2rem] bg-white">
                <svg viewBox="0 0 980 280" className="h-[320px] w-full">
                    {[55, 110, 165, 220].map((y) => (
                        <line
                            key={y}
                            x1="0"
                            x2="960"
                            y1={y}
                            y2={y}
                            stroke="#E5EAE3"
                            strokeWidth="1"
                        />
                    ))}

                    <path
                        d="M0 200 C90 180, 130 150, 180 160 C260 165, 285 105, 360 120 C455 135, 475 70, 540 80 C630 90, 625 20, 720 62 C790 95, 820 70, 900 45 C935 35, 955 30, 960 30"
                        fill="none"
                        stroke="#007A4D"
                        strokeWidth="4"
                        strokeLinecap="round"
                    />

                    <path
                        d="M0 200 C90 180, 130 150, 180 160 C260 165, 285 105, 360 120 C455 135, 475 70, 540 80 C630 90, 625 20, 720 62 C790 95, 820 70, 900 45 C935 35, 955 30, 960 30 L960 220 L0 220 Z"
                        fill="url(#growthGradient)"
                    />

                    <defs>
                        <linearGradient id="growthGradient" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stopColor="#007A4D" stopOpacity="0.18" />
                            <stop offset="100%" stopColor="#007A4D" stopOpacity="0" />
                        </linearGradient>
                    </defs>

                    {points.map((point) => (
                        <circle
                            key={point.month}
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill="#007A4D"
                        />
                    ))}

                    {points.map((point) => (
                        <text
                            key={point.month}
                            x={point.x}
                            y="260"
                            textAnchor="middle"
                            className="fill-black/35 text-sm font-semibold"
                        >
                            {point.month}
                        </text>
                    ))}
                </svg>
            </div>
        </section>
    );
}