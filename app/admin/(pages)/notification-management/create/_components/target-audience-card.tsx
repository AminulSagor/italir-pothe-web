"use client";

import {
  Check,
  Loader2,
  Search,
  UserRound,
  UsersRound,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { searchNotificationUsers } from "@/service/notification/notification.service";
import type { NotificationUser } from "@/types/notification/notification.type";

import type { AudienceType } from "./notification-composer";

interface TargetAudienceCardProps {
  audienceType: AudienceType;
  selectedUser: NotificationUser | null;
  onAudienceChange: (type: AudienceType) => void;
  onUserSelect: (user: NotificationUser | null) => void;
}

export default function TargetAudienceCard({
  audienceType,
  selectedUser,
  onAudienceChange,
  onUserSelect,
}: TargetAudienceCardProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<NotificationUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (
      !showDropdown ||
      searchQuery.trim().length < 2
    ) {
      setResults([]);
      return;
    }

    let active = true;

    const timeoutId = window.setTimeout(async () => {
      setIsSearching(true);

      try {
        const response = await searchNotificationUsers(
          searchQuery,
          1,
          10,
        );

        if (!active) {
          return;
        }

        setResults(
          response.items.filter(
            (user) => user.role === "user",
          ),
        );
      } catch (error) {
        if (active) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Users could not be loaded.",
          );
        }
      } finally {
        if (active) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      active = false;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery, showDropdown]);

  const selectAllUsers = () => {
    onAudienceChange("all_users");
    onUserSelect(null);
    setShowDropdown(false);
    setSearchQuery("");
    setResults([]);
  };

  const selectUser = (user: NotificationUser) => {
    onAudienceChange("specific_user");
    onUserSelect(user);
    setShowDropdown(false);
    setSearchQuery("");
    setResults([]);
  };

  return (
    <section className="relative rounded-[2rem] bg-white px-6 py-5 shadow-sm">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="flex size-8 items-center justify-center rounded-full bg-sky-100 text-secondary">
            <UsersRound className="size-4" />
          </span>

          <h2 className="text-lg font-semibold text-black/85">
            Target Audience
          </h2>
        </div>

        <button
          type="button"
          onClick={() => setShowDropdown((current) => !current)}
          className="rounded-full border border-green-300 bg-green-50 px-6 py-2 text-sm font-bold text-secondary"
        >
          {selectedUser ? "Change User" : "+ Add User"}
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {audienceType === "all_users" ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF3EC] px-4 py-2 text-sm text-black/60">
            <UsersRound className="size-4" />
            All Users
          </span>
        ) : selectedUser ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-[#EEF3EC] px-4 py-2 text-sm text-black/60">
            <UserRound className="size-4" />
            {selectedUser.fullName}

            <button
              type="button"
              onClick={selectAllUsers}
              className="font-bold text-black/45"
            >
              ×
            </button>
          </span>
        ) : null}
      </div>

      {showDropdown && (
        <div className="absolute right-8 top-[72px] z-20 w-[360px] rounded-[2rem] bg-white/95 p-6 shadow-2xl backdrop-blur">
          <button
            type="button"
            onClick={selectAllUsers}
            className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-[#EEF3EC]"
          >
            <div className="flex items-center gap-3">
              <UsersRound className="size-5 text-secondary" />

              <div>
                <p className="font-semibold text-black/75">
                  All Users
                </p>
                <p className="text-xs text-black/45">
                  Send to every registered user.
                </p>
              </div>
            </div>

            {audienceType === "all_users" && (
              <Check className="size-5 text-secondary" />
            )}
          </button>

          <div className="mt-4 flex h-12 items-center gap-3 rounded-full bg-[#EEF3EC] px-5 text-black/45">
            <Search className="size-4" />

            <input
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Search users by name..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-black/40"
            />

            {isSearching && (
              <Loader2 className="size-4 animate-spin text-secondary" />
            )}
          </div>

          <div className="mt-4 max-h-64 space-y-1 overflow-y-auto">
            {searchQuery.trim().length >= 2 &&
              !isSearching &&
              results.length === 0 && (
                <p className="py-6 text-center text-sm text-black/45">
                  No users found.
                </p>
              )}

            {results.map((user) => (
              <button
                key={user.id}
                type="button"
                onClick={() => selectUser(user)}
                className="flex w-full items-center justify-between rounded-2xl px-3 py-3 text-left transition hover:bg-[#EEF3EC]"
              >
                <div>
                  <p className="text-sm font-semibold text-black/75">
                    {user.fullName}
                  </p>

                  <p className="mt-1 text-xs text-black/45">
                    {user.email ||
                      user.phone ||
                      "No contact information"}
                  </p>
                </div>

                <span
                  className={`size-2 rounded-full ${
                    user.isOnline
                      ? "bg-green-500"
                      : "bg-black/15"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}