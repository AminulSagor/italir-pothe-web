import Image from "next/image";
import { Clapperboard, Link, Play, PlayCircle, Trash2 } from "lucide-react";

interface HeroVideoCardProps {
    hasVideo: boolean;
}

export default function HeroVideoCard({ hasVideo }: HeroVideoCardProps) {
    return (
        <section className="rounded-[2rem] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-emerald-50 text-secondary">
                        <PlayCircle className="size-5" />
                    </span>

                    <h2 className="text-xl font-bold text-black/85">Hero Video Guide</h2>
                </div>

                {hasVideo && (
                    <button className="flex h-10 items-center gap-2 rounded-full bg-red-100 px-5 text-sm font-bold text-red-600">
                        <Trash2 className="size-4" />
                        Delete Video
                    </button>
                )}
            </div>

            {hasVideo ? <VideoPreview /> : <VideoUpload />}
        </section>
    );
}

function VideoUpload() {
    return (
        <>
            <div className="mt-6 flex h-12 items-center gap-3 bg-[#EEF3EC] px-5 text-black/45">
                <Link className="size-5" />
                <span>Paste YouTube/Vimeo URL...</span>
            </div>

            <div className="mt-6 flex min-h-[190px] flex-col items-center justify-center rounded-[1.5rem] border-2 border-dashed border-black/20 text-center">
                <span className="flex size-11 items-center justify-center rounded-full bg-[#EEF3EC] text-black/70">
                    <Clapperboard className="size-5" />
                </span>

                <h3 className="mt-4 text-lg font-bold text-black/95">
                    Upload Course Video
                </h3>

                <p className="mt-2 max-w-[420px] text-sm leading-6 text-black/65">
                    Drag & drop course video here or click to browse. Supported formats:
                    MP4, MOV. Max size 500MB.
                </p>
            </div>
        </>
    );
}

function VideoPreview() {
    return (
        <div className="relative mt-7 overflow-hidden rounded-[1.5rem]">
            <Image
                src="/images/login-globe.png"
                alt="Course video preview"
                width={760}
                height={360}
                className="h-[270px] w-full object-cover"
            />

            <div className="absolute inset-0 bg-black/10" />

            <button className="absolute left-1/2 top-1/2 flex size-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white shadow-xl backdrop-blur">
                <Play className="ml-1 size-10 fill-white" />
            </button>

            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between rounded-[1.5rem] bg-black/35 px-5 py-4 text-white backdrop-blur-md">
                <div>
                    <p className="text-xs uppercase text-white/70">Filename</p>
                    <p className="mt-1 text-lg font-medium">intro_to_advanced_italy_</p>
                </div>

                <div className="flex gap-8 text-right">
                    <div>
                        <p className="text-xs text-white/70">Duration</p>
                        <p className="text-lg">02:45</p>
                    </div>

                    <div>
                        <p className="text-xs text-white/70">Size</p>
                        <p className="text-lg">48.2MB</p>
                    </div>
                </div>
            </div>
        </div>
    );
}