import { FileText, Globe, Info, Trash2, Upload } from "lucide-react";

interface RightSidePanelProps {
    hasPdf: boolean;
}

export default function RightSidePanel({ hasPdf }: RightSidePanelProps) {
    return (
        <div className="space-y-6">
            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <FileText className="size-5" />
                    </span>

                    <h2 className="text-xl font-bold text-black/85">
                        Attach PDF Checklist
                    </h2>
                </div>

                {hasPdf ? <PdfPreview /> : <PdfUpload />}
            </section>

            <section className="rounded-[2rem] border border-green-100 bg-[#F7FBF5] p-6">
                <div className="flex items-center gap-4">
                    <span className="flex size-11 items-center justify-center rounded-full bg-green-100 text-secondary">
                        <Globe className="size-5" />
                    </span>

                    <h2 className="text-xl font-bold text-black/85">
                        External Redirect URL
                    </h2>
                </div>

                <div className="mt-6 rounded-2xl border border-black/10 bg-white p-4">
                    <div className="flex gap-3">
                        <Globe className="mt-1 size-5 shrink-0 text-secondary" />

                        <p className="break-all text-black/55">
                            https://portaleimmigrazione.dlci.interno.it/
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wide text-black/45">
                        Button Text Override (Optional)
                    </p>

                    <div className="rounded-2xl border border-black/10 bg-white px-5 py-4 text-black/55">
                        Apply on Official Portal
                    </div>
                </div>
            </section>

            <section className="rounded-[2rem] bg-white p-6 shadow-sm">
                <button className="flex h-14 w-full items-center justify-center gap-3 rounded-full bg-secondary text-lg font-semibold text-white shadow-lg shadow-green-900/15">
                    <Upload className="size-5" />
                    Save & Publish Page
                </button>

                <button className="mt-6 flex items-center gap-3 font-semibold text-red-500">
                    <Trash2 className="size-5" />
                    Delete Page Content
                </button>

                <div className="mt-8 flex items-center gap-4 rounded-full bg-[#EEF3EC] px-5 py-4">
                    <span className="flex size-9 items-center justify-center rounded-full bg-green-100 text-secondary">
                        <Info className="size-4" />
                    </span>

                    <p className="text-sm text-black/65">
                        Last edited by Admin today at 2:45 PM
                    </p>
                </div>
            </section>
        </div>
    );
}

function PdfUpload() {
    return (
        <div className="mt-6 flex min-h-[260px] flex-col items-center justify-center rounded-[2rem] border-2 border-dashed border-black/20 px-6 text-center">
            <Upload className="size-12 text-red-600" />

            <p className="mt-5 text-lg font-bold text-black/85">
                Drag & drop official checklist PDF here
            </p>

            <p className="mt-2 text-sm font-semibold uppercase text-black/40">
                OR CLICK TO BROWSE
            </p>
        </div>
    );
}

function PdfPreview() {
    return (
        <div className="mt-6 flex min-h-[155px] items-center justify-center rounded-[2rem] border border-black/10 bg-[#F7FAF5] px-6">
            <div className="flex items-center gap-4">
                <span className="flex size-14 items-center justify-center rounded-full bg-red-100 text-red-600">
                    <FileText className="size-7" />
                </span>

                <div>
                    <p className="max-w-[120px] break-words text-base font-bold leading-5 text-black/85">
                        permesso_checklist_official.pdf
                    </p>
                    <p className="mt-1 text-sm text-black/45">1.4 MB</p>
                </div>

                <button className="text-red-600">
                    <Trash2 className="size-5" />
                </button>
            </div>
        </div>
    );
}