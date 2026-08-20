"use client";

import { useCallback, useEffect, useState } from "react";
import { Clock3, Loader2, Plus, Power, PowerOff, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import Button from "@/components/UI/buttons/button";
import Card from "@/components/UI/cards/card";
import {
  createCourseManualAccessOption,
  deleteCourseManualAccessOption,
  getCourseManualAccessOptions,
  updateCourseManualAccessOption,
} from "@/service/course-directory/course-commerce.service";
import type {
  CourseAccessType,
  CourseManualAccessOption,
} from "@/types/course-directory/course-commerce.type";

interface Props {
  courseId?: string | null;
}

const getErrorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Unable to update manual access options.";

export default function CourseManualAccessOptionsCard({ courseId }: Props) {
  const [items, setItems] = useState<CourseManualAccessOption[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [runningId, setRunningId] = useState<string | null>(null);
  const [accessType, setAccessType] = useState<CourseAccessType>("lifetime");
  const [durationDays, setDurationDays] = useState("");

  const load = useCallback(async () => {
    if (!courseId) {
      setItems([]);
      return;
    }
    try {
      setIsLoading(true);
      const response = await getCourseManualAccessOptions(courseId);
      setItems(response.items);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    void load();
  }, [load]);

  const addOption = async () => {
    if (!courseId) return;
    const days = Number(durationDays);
    if (
      accessType === "time_limited" &&
      (!Number.isInteger(days) || days < 1 || days > 3650)
    ) {
      toast.error("Duration must be a whole number between 1 and 3650 days.");
      return;
    }

    const toastId = toast.loading("Adding manual access option...");
    try {
      setRunningId("new");
      await createCourseManualAccessOption(courseId, {
        accessType,
        durationDays: accessType === "time_limited" ? days : null,
        isActive: true,
      });
      setDurationDays("");
      await load();
      toast.success("Manual access option added.", { id: toastId });
    } catch (error) {
      toast.error(getErrorMessage(error), { id: toastId });
    } finally {
      setRunningId(null);
    }
  };

  const toggle = async (item: CourseManualAccessOption) => {
    if (!courseId) return;
    try {
      setRunningId(item.id);
      await updateCourseManualAccessOption(courseId, item.id, {
        isActive: !item.isActive,
      });
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRunningId(null);
    }
  };

  const remove = async (item: CourseManualAccessOption) => {
    if (!courseId || !window.confirm("Delete this manual access option?")) return;
    try {
      setRunningId(item.id);
      await deleteCourseManualAccessOption(courseId, item.id);
      await load();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setRunningId(null);
    }
  };

  return (
    <Card padding="lg" rounded="3xl" shadow="sm">
      <div className="flex items-start gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-[#E7F1FF] text-[#3568C0]">
          <Clock3 className="size-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#202420]">Manual Access Options</h2>
          <p className="mt-1 text-sm leading-6 text-[#66736A]">
            Options available when an admin records an external payment.
          </p>
        </div>
      </div>

      {!courseId ? (
        <p className="mt-6 rounded-2xl bg-[#F3F6F2] p-5 text-center text-sm text-[#66736A]">
          Save the course first.
        </p>
      ) : (
        <>
          <div className="mt-6 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <select
              value={accessType}
              onChange={(event) => setAccessType(event.target.value as CourseAccessType)}
              className="h-11 rounded-xl border border-[#DDE5DE] bg-white px-3 text-sm"
            >
              <option value="lifetime">Lifetime</option>
              <option value="time_limited">Time limited</option>
            </select>
            <input
              type="number"
              min={1}
              max={3650}
              value={durationDays}
              disabled={accessType === "lifetime"}
              placeholder="Duration in days"
              onChange={(event) => setDurationDays(event.target.value)}
              className="h-11 rounded-xl border border-[#DDE5DE] bg-white px-3 text-sm disabled:bg-[#EEF2EE]"
            />
            <Button size="sm" disabled={runningId === "new"} onClick={() => void addOption()}>
              {runningId === "new" ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Plus className="mr-2 size-4" />}
              Add
            </Button>
          </div>

          <div className="mt-5 space-y-2">
            {isLoading ? (
              <Loader2 className="mx-auto size-5 animate-spin text-[#006B3F]" />
            ) : items.length === 0 ? (
              <p className="text-center text-sm text-[#8A948D]">No manual access options configured.</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-[#E1E8E2] px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-[#202420]">
                      {item.accessType === "lifetime" ? "Lifetime" : `${item.durationDays} days`}
                    </p>
                    <p className="text-xs text-[#8A948D]">{item.isActive ? "Active" : "Inactive"}</p>
                  </div>
                  <div className="flex gap-2">
                    <button type="button" disabled={runningId === item.id} onClick={() => void toggle(item)} className="flex size-9 items-center justify-center rounded-full bg-[#EEF3EC] text-[#006B3F]" aria-label={item.isActive ? "Deactivate option" : "Activate option"}>
                      {runningId === item.id ? <Loader2 className="size-4 animate-spin" /> : item.isActive ? <PowerOff className="size-4" /> : <Power className="size-4" />}
                    </button>
                    <button type="button" disabled={runningId === item.id} onClick={() => void remove(item)} className="flex size-9 items-center justify-center rounded-full bg-[#FCEBEC] text-[#B42318]" aria-label="Delete option">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </Card>
  );
}
