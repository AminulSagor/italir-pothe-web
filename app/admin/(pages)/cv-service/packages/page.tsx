"use client";

import { useState } from "react";

import CVPackageHeader from "./_components/cv-package-header";
import FreeTierConfiguration from "./_components/free-tier-configuration";
import CVCreditRefillPackages from "./_components/cv-credit-refill-packages";
import CreateSalesPackageDialog from "./_components/create-sales-package-dialog";
import SavePackageSettingsBar from "./_components/save-package-settings-bar";

export default function CVPackageConfigurationPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <>
      <div className="space-y-7">
        <CVPackageHeader />

        <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
          <FreeTierConfiguration />

          <CVCreditRefillPackages
            onCreatePackage={() => setIsCreateDialogOpen(true)}
          />
        </div>

        <SavePackageSettingsBar />
      </div>

      <CreateSalesPackageDialog
        open={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </>
  );
}