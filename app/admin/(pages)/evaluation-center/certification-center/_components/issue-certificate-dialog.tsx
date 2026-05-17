import { MessageSquare } from "lucide-react";

import Button from "@/components/UI/buttons/button";
import Dialog from "@/components/UI/dialogs/dialog";
import { CertificationStudent } from "@/mock/evaluation-center/certification-center/certification-center.types";

interface IssueCertificateDialogProps {
  open: boolean;
  onClose: () => void;
  student: CertificationStudent;
}

export default function IssueCertificateDialog({
  open,
  onClose,
}: IssueCertificateDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="md"
      
    >
      <div className="flex flex-col items-center text-center">
        <div className="mb-8 flex size-20 items-center justify-center rounded-full bg-[#E3F2FF]">
          <MessageSquare className="size-9 fill-[#006B3F] text-[#006B3F]" />
        </div>

        <h2 className="text-2xl font-bold text-[#202420]">
          Issue Official Certificate?
        </h2>

        <p className="mt-7 max-w-[460px] text-base leading-7 text-[#4D5750]">
          {`Final review for "Advanced Italian Cuisine" course. Issuing will
          generate a verifiable digital diploma for the student's profile.`}
        </p>

        <div className="mt-11 flex items-center justify-center gap-6">
          <Button
            size="lg"
            className="h-11 min-w-[165px] bg-[#59F94D] !text-[#006B3F] hover:!bg-[#48E93E]"
            onClick={onClose}
          >
            Issue & Notify
          </Button>

          <Button
            size="lg"
            variant="ghost"
            className="h-11 min-w-[165px] bg-[#DDE3DD] text-[#66736A] hover:bg-[#D3DAD3]"
            onClick={onClose}
          >
            Review Again
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
