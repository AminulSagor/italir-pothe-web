"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import EndWebinarDialog from "./_components/end-webinar-dialog";
import SpeakerRequestsPanel, {
  type PanelTab,
} from "@/app/admin/(pages)/webinar-directory/handle/_components/speaker-requests-panel";
import LiveAudienceChat from "@/app/admin/(pages)/webinar-directory/handle/_components/live-audience-chat";
import LiveWebinarPlayer from "@/app/admin/(pages)/webinar-directory/handle/_components/live-webinar-player";
import BackButton from "@/components/UI/buttons/back-button";
import {
  approveSpeakerRequest,
  endWebinar,
  getAdminWebinarById,
  getSpeakerRequests,
  getWebinarChatMessages,
  getWebinarParticipants,
  rejectSpeakerRequest,
  sendWebinarChatMessage,
} from "@/service/webinar/webinar";
import { createWebinarSocket } from "@/service/webinar/webinar_socket";
import type {
  WebinarChatMessageItem,
  WebinarItem,
  WebinarSocketPayload,
  WebinarUserItem,
} from "@/types/webinar/webinar_type";

const PARTICIPANTS_LIMIT = 50;
const REQUESTS_LIMIT = 50;
const CHAT_MESSAGES_LIMIT = 50;
const fallbackText = "Not available";

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Something went wrong. Please try again.";
};

function WebinarHandlePageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const webinarId = searchParams.get("id");

  const [isEndDialogOpen, setIsEndDialogOpen] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isPanelLoading, setIsPanelLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [error, setError] = useState("");
  const [webinar, setWebinar] = useState<WebinarItem | null>(null);
  const [participants, setParticipants] = useState<WebinarUserItem[]>([]);
  const [speakerRequests, setSpeakerRequests] = useState<WebinarUserItem[]>([]);
  const [chatMessages, setChatMessages] = useState<WebinarChatMessageItem[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(true);
  const [isChatSending, setIsChatSending] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<PanelTab>("participants");
  const [now, setNow] = useState(() => Date.now());

  const participantCount = participants.length;

  const liveDuration = useMemo(() => {
    if (!webinar?.liveStartedAt) return "00:00:00";

    const startedAt = new Date(webinar.liveStartedAt).getTime();
    if (Number.isNaN(startedAt)) return "00:00:00";

    const totalSeconds = Math.max(0, Math.floor((now - startedAt) / 1000));
    const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, "0");
    const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, "0");
    const seconds = String(totalSeconds % 60).padStart(2, "0");

    return `${hours}:${minutes}:${seconds}`;
  }, [now, webinar?.liveStartedAt]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const loadParticipants = useCallback(async () => {
    if (!webinarId) return;

    const response = await getWebinarParticipants(
      webinarId,
      1,
      PARTICIPANTS_LIMIT,
    );
    setParticipants(response.participants);
  }, [webinarId]);

  const loadSpeakerRequests = useCallback(async () => {
    if (!webinarId) return;

    const response = await getSpeakerRequests(webinarId, 1, REQUESTS_LIMIT);
    setSpeakerRequests(response.speakerRequests);
  }, [webinarId]);

  const upsertChatMessage = useCallback((message: WebinarChatMessageItem) => {
    setChatMessages((currentMessages) => {
      const existingIndex = currentMessages.findIndex(
        (item) => item.id === message.id,
      );

      if (existingIndex >= 0) {
        return currentMessages.map((item, index) =>
          index === existingIndex ? message : item,
        );
      }

      return [...currentMessages, message].slice(-CHAT_MESSAGES_LIMIT);
    });
  }, []);

  const loadChatMessages = useCallback(async () => {
    if (!webinarId) return;

    try {
      setIsChatLoading(true);
      const response = await getWebinarChatMessages(
        webinarId,
        1,
        CHAT_MESSAGES_LIMIT,
      );
      setChatMessages(response.chatMessages);
    } finally {
      setIsChatLoading(false);
    }
  }, [webinarId]);

  const loadPanelData = useCallback(async () => {
    try {
      setIsPanelLoading(true);
      await Promise.all([loadParticipants(), loadSpeakerRequests(), loadChatMessages()]);
    } finally {
      setIsPanelLoading(false);
    }
  }, [loadChatMessages, loadParticipants, loadSpeakerRequests]);

  useEffect(() => {
    if (!webinarId) {
      setError("Webinar id is missing.");
      setIsLoading(false);
      setIsPanelLoading(false);
      return;
    }

    const loadWebinar = async () => {
      try {
        setIsLoading(true);
        setError("");
        const selectedWebinar = await getAdminWebinarById(webinarId);
        setWebinar(selectedWebinar);
        await loadPanelData();
      } catch (loadError) {
        setError(getErrorMessage(loadError));
      } finally {
        setIsLoading(false);
      }
    };

    loadWebinar();
  }, [loadPanelData, webinarId]);

  useEffect(() => {
    if (!webinarId) return;

    const socket = createWebinarSocket();

    socket.on("connect", () => {
      socket.emit("join_webinar_room", { webinarId });
    });

    const handleRefreshLists = () => {
      loadPanelData();
    };

    const handleSpeakerRequestCreated = () => {
      setActivePanelTab("requests");
      loadPanelData();
    };

    const handleChatMessageCreated = (payload: WebinarSocketPayload) => {
      if (payload.chatMessage) {
        upsertChatMessage(payload.chatMessage);
      } else {
        loadChatMessages();
      }
    };

    const handleWebinarEnded = (payload: WebinarSocketPayload) => {
      if (payload.webinar) {
        setWebinar(payload.webinar);
      }
      router.push("/admin/webinar-directory?tab=live-now");
    };

    socket.on("participants_list_updated", handleRefreshLists);
    socket.on("speaker_request_created", handleSpeakerRequestCreated);
    socket.on("speaker_requests_list_updated", handleRefreshLists);
    socket.on("speaker_request_approved", handleRefreshLists);
    socket.on("speaker_request_rejected", handleRefreshLists);
    socket.on("webinar_chat_message_created", handleChatMessageCreated);
    socket.on("webinar_chat_messages_updated", handleChatMessageCreated);
    socket.on("webinar_ended", handleWebinarEnded);

    socket.connect();

    return () => {
      socket.emit("leave_webinar_room", { webinarId });
      socket.disconnect();
    };
  }, [loadChatMessages, loadPanelData, router, upsertChatMessage, webinarId]);

  const handleApprove = async (userId: string) => {
    if (!webinarId) return;

    try {
      setIsActionLoading(true);
      setError("");
      await approveSpeakerRequest(webinarId, userId);
      await loadPanelData();
    } catch (approveError) {
      setError(getErrorMessage(approveError));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReject = async (userId: string) => {
    if (!webinarId) return;

    try {
      setIsActionLoading(true);
      setError("");
      await rejectSpeakerRequest(webinarId, userId);
      await loadPanelData();
    } catch (rejectError) {
      setError(getErrorMessage(rejectError));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleSendChatMessage = async (message: string) => {
    if (!webinarId) return;

    try {
      setIsChatSending(true);
      setError("");
      const response = await sendWebinarChatMessage(webinarId, message);
      upsertChatMessage(response.chatMessage);
    } catch (chatError) {
      setError(getErrorMessage(chatError));
    } finally {
      setIsChatSending(false);
    }
  };

  const handleEndWebinar = async () => {
    if (!webinarId) return;

    try {
      setIsEnding(true);
      setError("");
      await endWebinar(webinarId);
      setIsEndDialogOpen(false);
      router.push("/admin/webinar-directory?tab=live-now");
    } catch (endError) {
      setError(getErrorMessage(endError));
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F8F2] px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-8 flex items-center gap-4">
          <BackButton />
          <p className="text-sm font-semibold text-[#007A4D]">Webinar Handle</p>
        </div>

        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-7">
            <span className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600">
              ● LIVE
            </span>
            <h1 className="text-2xl font-bold text-[#007A4D]">
              {webinar?.title || fallbackText}
            </h1>
            <span className="hidden h-6 w-px bg-[#DAE4D8] lg:block" />
            <p className="font-mono text-sm font-semibold tracking-widest text-[#007A4D]">
              {liveDuration}
            </p>
          </div>

          <button
            onClick={() => setIsEndDialogOpen(true)}
            disabled={!webinarId || isEnding}
            className="rounded-full bg-[#C91F1F] px-8 py-4 text-xs font-bold uppercase text-white shadow-lg disabled:cursor-not-allowed disabled:opacity-60"
          >
            ⛔ End Webinar
          </button>
        </div>

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="rounded-3xl bg-white p-8 text-sm text-[#66736B] shadow-sm">
            Loading live webinar...
          </div>
        ) : (
          <section className="grid gap-7 lg:grid-cols-[1fr_350px]">
            <div className="space-y-7">
              {webinarId ? (
                <LiveWebinarPlayer
                  webinarId={webinarId}
                  webinarTitle={webinar?.title || fallbackText}
                  viewerCount={participantCount}
                  participants={participants}
                />
              ) : null}
              <LiveAudienceChat
                messages={chatMessages}
                isLoading={isChatLoading}
                isSending={isChatSending}
                onSendMessage={handleSendChatMessage}
              />
            </div>

            <SpeakerRequestsPanel
              activeTab={activePanelTab}
              speakerRequests={speakerRequests}
              participants={participants}
              isLoading={isPanelLoading}
              isActionLoading={isActionLoading}
              onTabChange={setActivePanelTab}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          </section>
        )}
      </div>

      <EndWebinarDialog
        open={isEndDialogOpen}
        isEnding={isEnding}
        participantCount={participantCount}
        onClose={() => setIsEndDialogOpen(false)}
        onConfirm={handleEndWebinar}
      />
    </main>
  );
}
function WebinarHandlePageFallback() {
  return (
    <main className="min-h-screen bg-[#F5F8F2] px-6 py-8">
      <div className="mx-auto max-w-[1180px]">
        <div className="rounded-3xl bg-white p-8 text-sm text-[#66736B] shadow-sm">
          Loading live webinar...
        </div>
      </div>
    </main>
  );
}

export default function WebinarHandlePage() {
  return (
    <Suspense fallback={<WebinarHandlePageFallback />}>
      <WebinarHandlePageContent />
    </Suspense>
  );
}
