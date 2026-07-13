import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MessageSquareText,
  Video,
} from "lucide-react";

export function WebinarSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 rounded-[2.25rem] bg-gradient-to-br from-[#006B3F] to-[#064E3B] px-6 py-10 text-white shadow-[0_24px_70px_rgba(0,82,49,0.20)] sm:px-10 sm:py-12 lg:grid-cols-[1fr_0.8fr] lg:px-14">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#9BE7BA]">
              Live learning
            </p>

            <h2 className="mt-3 max-w-3xl text-3xl font-black tracking-[-0.045em] text-white sm:text-4xl lg:text-5xl">
              Webinars that make learning more interactive
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-[#D4E9DD] sm:text-lg">
              Join interactive sessions for language practice, career
              preparation and live questions with the learning community.
            </p>

            <Link
              href="/webinars"
              className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-full border border-white bg-white px-6 font-black !text-[#064E3B] shadow-sm transition hover:bg-[#E4F7EB] hover:!text-[#064E3B] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#064E3B]"
            >
              Explore Webinars
              <ArrowRight aria-hidden="true" size={18} />
            </Link>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {[
              { icon: Video, label: "Live guided sessions" },
              { icon: MessageSquareText, label: "Interactive questions" },
              { icon: CalendarDays, label: "Upcoming schedule announcements" },
            ].map(({ icon: Icon, label }) => (
              <div
                className="flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"
                key={label}
              >
                <span className="grid size-11 place-items-center rounded-2xl bg-white text-[#006B3F]">
                  <Icon aria-hidden="true" size={21} />
                </span>
                <span className="font-bold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
