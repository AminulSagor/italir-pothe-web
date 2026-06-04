"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Expand, Mic, MicOff, MoreVertical, Video, VideoOff } from "lucide-react";
import type {
  IAgoraRTCClient,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from "agora-rtc-sdk-ng";

import { getHostToken } from "@/service/webinar/webinar";

interface LiveWebinarPlayerProps {
  webinarId: string;
  webinarTitle: string;
  viewerCount: number;
}

const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message;
  return "Unable to start live stream.";
};

export default function LiveWebinarPlayer({
  webinarId,
  webinarTitle,
  viewerCount,
}: LiveWebinarPlayerProps) {
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const clientRef = useRef<IAgoraRTCClient | null>(null);
  const micTrackRef = useRef<IMicrophoneAudioTrack | null>(null);
  const cameraTrackRef = useRef<ICameraVideoTrack | null>(null);

  const [isJoining, setIsJoining] = useState(true);
  const [streamError, setStreamError] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);

  const cleanupAgora = useCallback(async () => {
    try {
      if (micTrackRef.current) {
        micTrackRef.current.close();
        micTrackRef.current = null;
      }

      if (cameraTrackRef.current) {
        cameraTrackRef.current.close();
        cameraTrackRef.current = null;
      }

      if (clientRef.current) {
        await clientRef.current.leave();
        clientRef.current = null;
      }
    } catch {
      // cleanup should not block page unload
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

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
          cameraTrack.play(localVideoRef.current);
        }

        await client.publish([micTrack, cameraTrack]);
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

  return (
    <div className="rounded-[32px] bg-white p-5 shadow-sm">
      <div className="relative h-[380px] overflow-hidden rounded-[28px] bg-[#1C2928]">
        <div ref={localVideoRef} className="absolute inset-0 h-full w-full" />

        {(!isCameraOn || isJoining || streamError) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1C2928] px-8 text-center text-white/80">
            <VideoOff className="mb-4 size-10 text-white/60" />
            <p className="text-sm font-semibold">
              {streamError || (isJoining ? "Starting live stream..." : "Camera is turned off")}
            </p>
            <p className="mt-2 max-w-md text-xs text-white/50">
              {streamError
                ? "Check Agora credentials, browser permissions, and backend token API."
                : webinarTitle}
            </p>
          </div>
        )}

        <div className="absolute left-5 top-5 rounded-full bg-black/70 px-4 py-2 text-sm text-white">
          <span className="mr-2 text-green-400">●</span>
          {viewerCount} Viewers
        </div>

        <button className="absolute bottom-4 right-4 flex size-10 items-center justify-center rounded-full bg-black/55 text-white">
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
          className="flex size-14 items-center justify-center rounded-full bg-[#EDF2EA] text-[#202420]"
          title="Screen share support can be added after host camera publishing is verified."
        >
          <MoreVertical className="size-5" />
        </button>
      </div>
    </div>
  );
}
