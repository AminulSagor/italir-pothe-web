"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import TechnicalChecklist, {
  type TechnicalChecklistItem,
} from "./technical-checklist-card";
import WebinarPreviewCard from "./webinar-preview-card";

type DeviceOption = {
  deviceId: string;
  label: string;
};

type MediaDevicesState = {
  microphones: DeviceOption[];
  cameras: DeviceOption[];
  speakers: DeviceOption[];
};

type SinkSelectableVideoElement = HTMLVideoElement & {
  setSinkId?: (sinkId: string) => Promise<void>;
};

const emptyDevices: MediaDevicesState = {
  microphones: [],
  cameras: [],
  speakers: [],
};

const mapDevice = (device: MediaDeviceInfo, fallbackLabel: string) => ({
  deviceId: device.deviceId,
  label: device.label || fallbackLabel,
});

const stopStream = (stream: MediaStream | null) => {
  stream?.getTracks().forEach((track) => track.stop());
};

const hasLiveTrack = (stream: MediaStream | null, kind: "audio" | "video") => {
  const tracks = kind === "audio" ? stream?.getAudioTracks() : stream?.getVideoTracks();
  return Boolean(tracks?.some((track) => track.readyState === "live"));
};

export default function PreStageStudio() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const cameraStreamRef = useRef<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);

  const [previewStream, setPreviewStream] = useState<MediaStream | null>(null);
  const [devices, setDevices] = useState<MediaDevicesState>(emptyDevices);
  const [selectedMicId, setSelectedMicId] = useState("");
  const [selectedCameraId, setSelectedCameraId] = useState("");
  const [selectedSpeakerId, setSelectedSpeakerId] = useState("");
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoadingPreview, setIsLoadingPreview] = useState(true);
  const [permissionError, setPermissionError] = useState("");
  const [isOnline, setIsOnline] = useState(true);

  const refreshDevices = useCallback(async () => {
    if (!navigator.mediaDevices?.enumerateDevices) return;

    const allDevices = await navigator.mediaDevices.enumerateDevices();
    const microphones = allDevices
      .filter((device) => device.kind === "audioinput")
      .map((device, index) => mapDevice(device, `Microphone ${index + 1}`));
    const cameras = allDevices
      .filter((device) => device.kind === "videoinput")
      .map((device, index) => mapDevice(device, `Camera ${index + 1}`));
    const speakers = allDevices
      .filter((device) => device.kind === "audiooutput")
      .map((device, index) => mapDevice(device, `Speaker ${index + 1}`));

    setDevices({ microphones, cameras, speakers });
    setSelectedMicId((current) =>
      current || microphones[0]?.deviceId || "",
    );
    setSelectedCameraId((current) => current || cameras[0]?.deviceId || "");
    setSelectedSpeakerId((current) => current || speakers[0]?.deviceId || "");
  }, []);

  const startLocalPreview = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setPermissionError("Camera and microphone access is not supported in this browser.");
      setIsLoadingPreview(false);
      return;
    }

    try {
      setIsLoadingPreview(true);
      setPermissionError("");

      const audioConstraint: MediaTrackConstraints | boolean = selectedMicId
        ? { deviceId: { exact: selectedMicId } }
        : true;
      const videoConstraint: MediaTrackConstraints | boolean = selectedCameraId
        ? { deviceId: { exact: selectedCameraId } }
        : true;

      let stream: MediaStream;

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          audio: audioConstraint,
          video: videoConstraint,
        });
      } catch {
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: videoConstraint,
          });
        } catch {
          stream = await navigator.mediaDevices.getUserMedia({
            audio: audioConstraint,
            video: false,
          });
        }
      }

      stopStream(cameraStreamRef.current);
      cameraStreamRef.current = stream;
      stream.getAudioTracks().forEach((track) => {
        track.enabled = isMicOn;
      });
      stream.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOn;
      });

      if (!screenStreamRef.current) {
        setPreviewStream(stream);
      }

      await refreshDevices();
    } catch (error) {
      setPermissionError(
        error instanceof Error
          ? error.message
          : "Unable to access camera or microphone.",
      );
      setPreviewStream(null);
    } finally {
      setIsLoadingPreview(false);
    }
  }, [isCameraOn, isMicOn, refreshDevices, selectedCameraId, selectedMicId]);

  const stopScreenShare = useCallback(() => {
    stopStream(screenStreamRef.current);
    screenStreamRef.current = null;
    setIsScreenSharing(false);
    setPreviewStream(cameraStreamRef.current);
  }, []);

  const toggleScreenShare = useCallback(async () => {
    if (isScreenSharing) {
      stopScreenShare();
      return;
    }

    if (!navigator.mediaDevices?.getDisplayMedia) {
      setPermissionError("Screen sharing is not supported in this browser.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: false,
      });
      const [screenTrack] = stream.getVideoTracks();

      screenStreamRef.current = stream;
      setIsScreenSharing(true);
      setPreviewStream(stream);

      if (screenTrack) {
        screenTrack.onended = () => stopScreenShare();
      }
    } catch (error) {
      setPermissionError(
        error instanceof Error ? error.message : "Unable to start screen sharing.",
      );
    }
  }, [isScreenSharing, stopScreenShare]);

  const applySpeakerDevice = useCallback(async (speakerId: string) => {
    const videoElement = videoRef.current as SinkSelectableVideoElement | null;

    if (!videoElement?.setSinkId || !speakerId) return;

    try {
      await videoElement.setSinkId(speakerId);
    } catch (error) {
      setPermissionError(
        error instanceof Error
          ? error.message
          : "Unable to switch speaker output for this browser.",
      );
    }
  }, []);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    startLocalPreview();
  }, [startLocalPreview]);

  useEffect(() => {
    const stream = cameraStreamRef.current;
    stream?.getAudioTracks().forEach((track) => {
      track.enabled = isMicOn;
    });
    stream?.getVideoTracks().forEach((track) => {
      track.enabled = isCameraOn;
    });
  }, [isCameraOn, isMicOn]);

  useEffect(() => {
    const videoElement = videoRef.current;

    if (videoElement) {
      videoElement.srcObject = previewStream;
    }
  }, [previewStream]);

  useEffect(() => {
    applySpeakerDevice(selectedSpeakerId);
  }, [applySpeakerDevice, selectedSpeakerId]);

  useEffect(() => {
    navigator.mediaDevices?.addEventListener?.("devicechange", refreshDevices);

    return () => {
      navigator.mediaDevices?.removeEventListener?.("devicechange", refreshDevices);
      stopStream(cameraStreamRef.current);
      stopStream(screenStreamRef.current);
    };
  }, [refreshDevices]);

  const handleCameraChange = (deviceId: string) => {
    setSelectedCameraId(deviceId);
  };

  const handleMicChange = (deviceId: string) => {
    setSelectedMicId(deviceId);
  };

  const handleSpeakerChange = (deviceId: string) => {
    setSelectedSpeakerId(deviceId);
  };

  const checklistItems = useMemo<TechnicalChecklistItem[]>(() => {
    const cameraStream = cameraStreamRef.current;
    const hasMic = hasLiveTrack(cameraStream, "audio");
    const hasCamera = hasLiveTrack(cameraStream, "video");

    return [
      {
        title: "Internet Connection",
        status: isOnline ? "Stable" : "Offline",
        state: isOnline ? "success" : "error",
      },
      {
        title: "Microphone Input",
        status: hasMic ? (isMicOn ? "Connected" : "Muted") : "Missing",
        state: hasMic ? (isMicOn ? "success" : "warning") : "error",
      },
      {
        title: "Camera Feed",
        status: isScreenSharing
          ? "Screen Sharing"
          : hasCamera
            ? isCameraOn
              ? "Ready"
              : "Off"
            : "Missing",
        state: isScreenSharing || (hasCamera && isCameraOn) ? "success" : "warning",
      },
    ];
  }, [isCameraOn, isMicOn, isOnline, isScreenSharing, previewStream]);

  return (
    <section className="mb-7 grid gap-7 lg:grid-cols-[1fr_340px]">
      <WebinarPreviewCard
        videoRef={videoRef}
        devices={devices}
        selectedMicId={selectedMicId}
        selectedCameraId={selectedCameraId}
        selectedSpeakerId={selectedSpeakerId}
        isMicOn={isMicOn}
        isCameraOn={isCameraOn}
        isScreenSharing={isScreenSharing}
        isSettingsOpen={isSettingsOpen}
        isLoadingPreview={isLoadingPreview}
        permissionError={permissionError}
        onToggleMic={() => setIsMicOn((value) => !value)}
        onToggleCamera={() => setIsCameraOn((value) => !value)}
        onToggleScreenShare={toggleScreenShare}
        onToggleSettings={() => setIsSettingsOpen((value) => !value)}
        onCloseSettings={() => setIsSettingsOpen(false)}
        onMicChange={handleMicChange}
        onCameraChange={handleCameraChange}
        onSpeakerChange={handleSpeakerChange}
      />

      <TechnicalChecklist items={checklistItems} onRefresh={startLocalPreview} />
    </section>
  );
}
