import { CloudUpload } from "lucide-react";

const ManualAudioUpload = () => {
  return (
    <div className="rounded-3xl border-2 border-dashed border-[#D8DFD6] px-6 py-10 text-center">
      <CloudUpload className="mx-auto size-6 text-[#006B3F]" />

      <p className="mt-3 text-sm text-[#6F7673]">Drag audio or browse</p>
    </div>
  );
};

export default ManualAudioUpload;
