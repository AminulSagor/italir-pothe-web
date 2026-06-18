"use client";

import { useState } from "react";

import EditSituationDialog from "./dialogs/edit-situation-dialog";
import SurvivalItalianHeader from "./survival-italian-header";
import SurvivalSituationsTable from "./survival-situations-table";
import SurvivalStatsGrid from "./survival-stats-grid";

export default function SurvivalItalianContent() {
  const [createOpen, setCreateOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const refreshDashboard = () => setRefreshKey((currentKey) => currentKey + 1);

  return (
    <section className="space-y-8">
      <SurvivalItalianHeader onAdd={() => setCreateOpen(true)} />

      <SurvivalStatsGrid refreshKey={refreshKey} />

      <SurvivalSituationsTable
        refreshKey={refreshKey}
        onMutated={refreshDashboard}
      />

      <EditSituationDialog
        open={createOpen}
        situation={null}
        onClose={() => setCreateOpen(false)}
        onSaved={refreshDashboard}
      />
    </section>
  );
}
