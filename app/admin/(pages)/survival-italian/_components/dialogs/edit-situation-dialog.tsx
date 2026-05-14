"use client";

import { useState } from "react";
import { X } from "lucide-react";

import Dialog from "@/components/UI/dialogs/dialog";

import SituationForm from "../forms/situation-form";
import VisualIdentityPanel from "../forms/visual-identity-panel";

import PublishSuccessDialog from "./publish-success-dialog";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function EditSituationDialog({ open, onClose }: Props) {
  const [successOpen, setSuccessOpen] = useState(false);

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        size="2xl"
        className="overflow-hidden p-0"
      >
        <div className="grid md:grid-cols-[280px_1fr]">
          <VisualIdentityPanel selectedColor="#DCEBF6" />

          <div className="relative">
            <button
              type="button"
              onClick={onClose}
              className="absolute right-6 top-6 flex size-10 items-center justify-center rounded-full bg-[#EEF2EE]"
            >
              <X className="size-5 text-[#4D574F]" />
            </button>

            <SituationForm onPublish={() => setSuccessOpen(true)} />
          </div>
        </div>
      </Dialog>

      <PublishSuccessDialog
        open={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
    </>
  );
}
