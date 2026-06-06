"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Expand,
  Mic,
  MicOff,
  MonitorUp,
  ScreenShareOff,
  Video,
  VideoOff,
} from "lucide-react";
import type {
  IAgoraRTCClient,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  ILocalVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

import { getHostToken, getScreenShareToken } from "@/service/webinar/webinar";
import type { WebinarUserItem } from "@/types/webinar/webinar_type";

interface LiveWebinarPlayerProps {
  webinarId: string;
  webinarTitle: string;
  viewerCount: number;
  participants: WebinarUserItem[];
}

interface RemoteParticipantTileProps {
  user: IAgoraRTCRemoteUser;
  displayName: string;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Unable to start live stream.";
};

export default function LiveWebinarPlayer({
  webinarId,
  webinarTitle,
  viewerCount,
  participants,
}: LiveWebinarPlayerProps) {
  const playerContainerRef = useRef<HTMLDivElement | null>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const screenVideoRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const screenClientRef = useRef<IAgoraRTCClient | null>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const cameraTrackRef = useRef<ICameraVideoTrack | null>(null);
  const screenTrackRef = useRef<ILocalVideoTrack | null>(null);

  const [isJoining, setIsJoining] = useState(true);
  const [streamError, setStreamError] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isScreenShareLoading, setIsScreenShareLoading] = useState(false);
  const [screenShareUid, setScreenShareUid] = useState<number | null>(null);
  const [remoteUsers, setRemoteUsers] = useState<IAgoraRTCRemoteUser[]>([]);

  const participantNameByUid = useMemo(() => {
    const map = new Map<number, string>();

    participants.forEach((participant) => {
      if (!participant.agoraUid) return;
      map.set(
        participant.agoraUid,
        participant.fullName?.trim() || `User ${participant.userId.slice(0, 8)}`,
      );
    });

    return map;
  }, [participants]);

  const stopScreenShare = useCallback(async () => {
    const screenTrack = screenTrackRef.current;
    const screenClient = screenClientRef.current;

    try {
      if (screenTrack && screenClient) {
        await screenClient.unpublish(screenTrack);
      }
    } catch {
      // stopping screen share should stay safe even if Agora already unpublished
    }

    try {
      screenTrack?.close();
    } catch {
      // ignore local track cleanup error
    }

    try {
      await screenClient?.leave();
    } catch {
      // ignore screen client leave error
    }

    screenTrackRef.current = null;
    screenClientRef.current = null;
    setScreenShareUid(null);
    setIsScreenSharing(false);
  }, []);

  const cleanupAgora = useCallback(async () => {
    try {
      await stopScreenShare();

      if (micTrackRef.current) {
        micTrackRef.current.close();
        micTrackRef.current = null;
      }

      if (cameraTrackRef.current) {
        cameraTrackRef.current.close();
        cameraTrackRef.current = null;
      }

      if (clientRef.current) {
        clientRef.current.removeAllListeners();
        await clientRef.current.leave();
        clientRef.current = null;
      }

      setRemoteUsers([]);
    } catch {
      // cleanup should not block page unload
    }
  }, [stopScreenShare]);

  useEffect(() => {
    let isMounted = true;

    const syncRemoteUsers = () => {
      if (!isMounted || !clientRef.current) return;
      setRemoteUsers([...clientRef.current.remoteUsers]);
    };

    const startAgoraStream = async () => {
      try {
        setIsJoining(true);
        setStreamError("");

        const [{ default: AgoraRTC }, token] = await Promise.all([
          import("agora-rtc-sdk-ng"),
          getHostToken(webinarId),
        ]);

        if (!isMounted) return;

        const client = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
        clientRef.current = client;

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);

          if (mediaType === "audio") {
            user.audioTrack?.play();
          }

          syncRemoteUsers();
        });

        client.on("user-unpublished", (user, mediaType) => {
          if (mediaType === "audio") {
            user.audioTrack?.stop();
          }

          syncRemoteUsers();
        });

        client.on("user-left", (user) => {
          user.audioTrack?.stop();
          setRemoteUsers((previousUsers) =>
            previousUsers.filter((item) => item.uid !== user.uid),
          );
        });

        await client.setClientRole("host");
        await client.join(
          token.appId,
          token.channelName,
          token.rtcToken,
          token.uid,
        );

        const [micTrack, cameraTrack] =
          await AgoraRTC.createMicrophoneAndCameraTracks();

        if (!isMounted) {
          micTrack.close();
          cameraTrack.close();
          await client.leave();
          return;
        }

        micTrackRef.current = micTrack;
        cameraTrackRef.current = cameraTrack;

        await micTrack.setEnabled(isMicOn);
        await cameraTrack.setEnabled(isCameraOn);

        if (localVideoRef.current) {
          cameraTrack.play(localVideoRef.current, { fit: "contain" });
        }

        await client.publish([micTrack, cameraTrack]);
        syncRemoteUsers();
      } catch (error) {
        if (isMounted) {
          setStreamError(getErrorMessage(error));
        }
      } finally {
        if (isMounted) {
          setIsJoining(false);
        }
      }
    };

    startAgoraStream();

    return () => {
      isMounted = false;
      cleanupAgora();
    };
  }, [cleanupAgora, webinarId]);

  useEffect(() => {
    if (!isScreenSharing || !screenVideoRef.current || !screenTrackRef.current) {
      return;
    }

    screenTrackRef.current.play(screenVideoRef.current, { fit: "contain" });

    return () => {
      screenTrackRef.current?.stop();
    };
  }, [isScreenSharing]);

  const toggleMic = async () => {
    const nextValue = !isMicOn;
    setIsMicOn(nextValue);
    await micTrackRef.current?.setEnabled(nextValue);
  };

  const toggleCamera = async () => {
    const nextValue = !isCameraOn;
    setIsCameraOn(nextValue);
    await cameraTrackRef.current?.setEnabled(nextValue);
  };

  const startScreenShare = async () => {
    if (isScreenShareLoading || isScreenSharing) return;

    try {
      setIsScreenShareLoading(true);
      setStreamError("");

      const [{ default: AgoraRTC }, token] = await Promise.all([
        import("agora-rtc-sdk-ng"),
        getScreenShareToken(webinarId),
      ]);

      const screenClient = AgoraRTC.createClient({ mode: "live", codec: "vp8" });
      await screenClient.setClientRole("host");
      await screenClient.join(
        token.appId,
        token.channelName,
        token.rtcToken,
        token.uid,
      );

      const rawScreenTrack = await AgoraRTC.createScreenVideoTrack(
        { encoderConfig: "1080p_1" },
        "disable",
      );
      const screenTrack = (Array.isArray(rawScreenTrack)
        ? rawScreenTrack[0]
        : rawScreenTrack) as ILocalVideoTrack;

      screenTrack.on("track-ended", () => {
        stopScreenShare();
      });

      await screenClient.publish(screenTrack);

      screenClientRef.current = screenClient;
      screenTrackRef.current = screenTrack;
      setScreenShareUid(Number(token.uid));
      setIsScreenSharing(true);
    } catch (error) {
      setStreamError(getErrorMessage(error));
      await stopScreenShare();
    } finally {
      setIsScreenShareLoading(false);
    }
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await stopScreenShare();
      return;
    }

    await startScreenShare();
  };

  const remoteVideoUsers = remoteUsers.filter((user) => {
    if (!user.videoTrack) return false;
    return screenShareUid === null || Number(user.uid) !== screenShareUid;
  });
  const totalTiles = 1 + remoteVideoUsers.length + (isScreenSharing ? 1 : 0);

  const toggleFullscreen = async () => {
    const target = playerContainerRef.current;
    if (!target) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await target.requestFullscreen();
  };

  return (
    <div className="rounded-[32px] bg-white p-5 shadow-sm">
      <div
        ref={playerContainerRef}
        className="relative overflow-hidden rounded-[28px] bg-[#1C2928] p-3 fullscreen:rounded-none fullscreen:p-5"
      >
        <div
          className={`grid min-h-[380px] gap-3 ${
            totalTiles > 1 ? "lg:grid-cols-2" : "grid-cols-1"
          }`}
        >
          <div className="relative min-h-[360px] overflow-hidden rounded-[22px] bg-[#1C2928]">
            <div ref={localVideoRef} className="absolute inset-0 h-full w-full [&_video]:!object-contain" />

            {(!isCameraOn || isJoining || streamError) && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C2928] px-8 text-center text-white/80">
                <VideoOff className="mb-4 size-10 text-white/60" />
                <p className="text-sm font-semibold">
                  {streamError ||
                    (isJoining ? "Starting live stream..." : "Camera is turned off")}
                </p>
                <p className="mt-2 max-w-md text-xs text-white/50">
                  {streamError
                    ? "Check Agora credentials, browser permissions, backend token API, and screen sharing permissions."
                    : webinarTitle}
                </p>
              </div>
            )}

            <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold text-white">
              Teacher / Host
            </div>
          </div>

          {isScreenSharing && (
            <div className="relative min-h-[360px] overflow-hidden rounded-[22px] bg-[#263533]">
              <div ref={screenVideoRef} className="absolute inset-0 h-full w-full [&_video]:!object-contain" />
              <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold text-white">
                Host Screen Share
              </div>
            </div>
          )}

          {remoteVideoUsers.map((user) => {
            const numericUid = Number(user.uid);
            const displayName = participantNameByUid.get(numericUid) ||
              `Participant ${String(user.uid).slice(0, 8)}`;

            return (
              <RemoteParticipantTile
                key={String(user.uid)}
                user={user}
                displayName={displayName}
              />
            );
          })}
        </div>

        <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
          <span className="mr-2 text-green-400">●</span>
          {viewerCount} Viewers
        </div>

        <button
          type="button"
          onClick={toggleFullscreen}
          className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/55 text-white"
        >
          <Expand className="size-5" />
        </button>
      </div>

      <div className="mt-5 flex justify-center gap-4">
        <button
          type="button"
          onClick={toggleMic}
          className={`flex size-14 items-center justify-center rounded-full ${
            isMicOn ? "bg-[#007A4D] text-white" : "bg-red-500 text-white"
          }`}
        >
          {isMicOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
        </button>

        <button
          type="button"
          onClick={toggleCamera}
          className={`flex size-14 items-center justify-center rounded-full ${
            isCameraOn ? "bg-[#007A4D] text-white" : "bg-red-500 text-white"
          }`}
        >
          {isCameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
        </button>

        <button
          type="button"
          onClick={toggleScreenShare}
          disabled={isScreenShareLoading}
          className={`flex size-14 items-center justify-center rounded-full disabled:cursor-not-allowed disabled:opacity-60 ${
            isScreenSharing ? "bg-[#007A4D] text-white" : "bg-[#EDF2EA] text-[#202420]"
          }`}
          title="Share screen"
        >
          {isScreenSharing ? (
            <ScreenShareOff className="size-5" />
          ) : (
            <MonitorUp className="size-5" />
          )}
        </button>
      </div>
    </div>
  );
}

function RemoteParticipantTile({ user, displayName }: RemoteParticipantTileProps) {
  const remoteVideoRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const target = remoteVideoRef.current;
    const videoTrack = user.videoTrack;
    if (!target || !videoTrack) return;

    window.requestAnimationFrame(() => {
      videoTrack.play(target, { fit: "contain" });
    });

    return () => {
      videoTrack.stop();
    };
  }, [user.uid, user.videoTrack]);

  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-[22px] bg-[#263533]">
      <div ref={remoteVideoRef} className="absolute inset-0 h-full w-full [&_video]:!object-contain" />
      {!user.videoTrack && (
        <div className="absolute inset-0 flex items-center justify-center px-5 text-center text-sm font-semibold text-white/70">
          Waiting for participant video...
        </div>
      )}
      <div className="absolute bottom-4 left-4 rounded-full bg-black/65 px-4 py-2 text-xs font-semibold text-white">
        {displayName}
      </div>
    </div>
  );
}
