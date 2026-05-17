"use client";

import { useState } from "react";
import { EllipsisVertical, Filter } from "lucide-react";

import Card from "@/components/UI/cards/card";
import SurvivalTableRow from "./survival-table-row";
import EditSituationDialog from "./dialogs/edit-situation-dialog";
import DeleteSituationDialog from "./dialogs/delete-situation-dialog";

import { survivalSituationsMock } from "@/mock/survival-italian/survival-italian.mock";
import { SurvivalSituation } from "@/mock/survival-italian/survival-italian.types";

export default function SurvivalSituationsTable() {
  const [selectedSituation, setSelectedSituation] =
    useState<SurvivalSituation | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEditOpen = (situation: SurvivalSituation) => {
    setSelectedSituation(situation);
    setEditOpen(true);
  };

  const handleDeleteOpen = (situation: SurvivalSituation) => {
    setSelectedSituation(situation);
    setDeleteOpen(true);
  };

  return (
    <>
      <Card
        padding="none"
        rounded="3xl"
        shadow="sm"
        className="overflow-hidden"
      >
        <div className="flex items-center justify-between border-b border-[#EEF2EE] px-6 py-5">
          <div className="flex items-center gap-2">
            <span className="text-[#006B3F]">▣</span>

            <h2 className="text-base font-semibold text-[#202420]">
              Active Survival Situations
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button type="button">
              <Filter className="size-5 text-[#5F675F]" />
            </button>

            <button type="button">
              <EllipsisVertical className="size-5 text-[#5F675F]" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="border-b border-[#EEF2EE] bg-[#FAFCFA]">
              <tr>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  ICON
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  SITUATION NAME
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  BENGALI SUBTITLE
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  PDF STATUS
                </th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-[#5F675F]">
                  ACTIONS
                </th>
              </tr>
            </thead>

            <tbody>
              {survivalSituationsMock.map((situation) => (
                <SurvivalTableRow
                  key={situation.id}
                  situation={situation}
                  onEdit={() => handleEditOpen(situation)}
                  onDelete={() => handleDeleteOpen(situation)}
                />
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-4 border-t border-[#EEF2EE] px-6 py-5 md:flex-row md:items-center md:justify-between">
          <p className="text-sm text-[#5F675F]">Showing 4 of 24 situations</p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full border border-[#DDE5DD]"
            >
              ←
            </button>

            <p className="text-sm text-[#202420]">Page 1 of 6</p>

            <button
              type="button"
              className="flex size-9 items-center justify-center rounded-full border border-[#DDE5DD]"
            >
              →
            </button>
          </div>
        </div>
      </Card>

      <EditSituationDialog open={editOpen} onClose={() => setEditOpen(false)} />

      <DeleteSituationDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
      />
    </>
  );
}
