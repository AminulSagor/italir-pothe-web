"use client";

import type { RefObject } from "react";
import {
  Mic,
  MicOff,
  Settings,
  Upload,
  Video,
  VideoOff,
  X,
} from "lucide-react";

type DeviceOption = {
  deviceId: string;
  label: string;
};

type MediaDevicesState = {
  microphones: DeviceOption[];
  cameras: DeviceOption[];
  speakers: DeviceOption[];
};

interface WebinarPreviewCardProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  devices: MediaDevicesState;
  selectedMicId: string;
  selectedCameraId: string;
  selectedSpeakerId: string;
  isMicOn: boolean;
  isCameraOn: boolean;
  isScreenSharing: boolean;
  isSettingsOpen: boolean;
  isLoadingPreview: boolean;
  permissionError: string;
  onToggleMic: () => void;
  onToggleCamera: () => void;
  onToggleScreenShare: () => void;
  onToggleSettings: () => void;
  onCloseSettings: () => void;
  onMicChange: (deviceId: string) => void;
  onCameraChange: (deviceId: string) => void;
  onSpeakerChange: (deviceId: string) => void;
}

const selectClassName =
  "mt-2 w-full rounded-2xl border border-[#D8E5DA] bg-white px-4 py-3 text-xs font-semibold text-[#202420] outline-none";

export default function WebinarPreviewCard({
  videoRef,
  devices,
  selectedMicId,
  selectedCameraId,
  selectedSpeakerId,
  isMicOn,
  isCameraOn,
  isScreenSharing,
  isSettingsOpen,
  isLoadingPreview,
  permissionError,
  onToggleMic,
  onToggleCamera,
  onToggleScreenShare,
  onToggleSettings,
  onCloseSettings,
  onMicChange,
  onCameraChange,
  onSpeakerChange,
}: WebinarPreviewCardProps) {
  const shouldShowCameraOverlay =
    (!isCameraOn && !isScreenSharing) || Boolean(permissionError);

  return (
    <div className="relative h-[405px] overflow-hidden rounded-[34px] bg-[#1B2B2D] p-5 shadow-sm">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`absolute inset-0 h-full w-full object-cover transition-opacity ${
          isCameraOn || isScreenSharing ? "opacity-100" : "opacity-0"
        }`}
      />

      {shouldShowCameraOverlay ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#1B2B2D] px-8 text-center text-white/80">
          <VideoOff className="mb-4 size-10 text-white/60" />
          <p className="text-sm font-semibold">
            {permissionError || "Camera is turned off"}
          </p>
          <p className="mt-2 max-w-md text-xs text-white/50">
            Allow camera and microphone permission from your browser, then run the
            technical checklist again.
          </p>
        </div>
      ) : null}

      <div className="absolute left-8 top-7 rounded-full bg-black/70 px-4 py-2 text-[11px] font-bold uppercase tracking-wide text-white">
        <span className="mr-2 inline-block size-2 rounded-full bg-red-500" />
        Off-Air Preview
      </div>

      {!shouldShowCameraOverlay ? (
        <p className="absolute inset-x-0 top-1/2 text-center text-sm text-white/80">
          {isLoadingPreview
            ? "Starting camera feed..."
            : isScreenSharing
              ? "Screen Share Preview Active"
              : "Camera Feed Active"}
        </p>
      ) : null}

      <div className="absolute inset-x-0 bottom-8 flex justify-center gap-4">
        <button
          type="button"
          onClick={onToggleMic}
          className={`flex size-14 items-center justify-center rounded-full shadow-md transition ${
            isMicOn ? "bg-white text-[#007A4D]" : "bg-red-500 text-white"
          }`}
          title={isMicOn ? "Mute microphone" : "Unmute microphone"}
        >
          {isMicOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
        </button>

        <button
          type="button"
          onClick={onToggleCamera}
          className={`flex size-14 items-center justify-center rounded-full shadow-md transition ${
            isCameraOn ? "bg-white text-[#007A4D]" : "bg-red-500 text-white"
          }`}
          title={isCameraOn ? "Turn camera off" : "Turn camera on"}
        >
          {isCameraOn ? (
            <Video className="size-5" />
          ) : (
            <VideoOff className="size-5" />
          )}
        </button>

        <button
          type="button"
          onClick={onToggleScreenShare}
          className={`flex size-14 items-center justify-center rounded-full shadow-md transition ${
            isScreenSharing ? "bg-[#007A4D] text-white" : "bg-white text-[#007A4D]"
          }`}
          title={isScreenSharing ? "Stop screen sharing" : "Share screen"}
        >
          <Upload className="size-5" />
        </button>

        <button
          type="button"
          onClick={onToggleSettings}
          className="flex size-14 items-center justify-center rounded-full bg-white text-[#007A4D] shadow-md transition hover:bg-[#F4FAF7]"
          title="Device settings"
        >
          <Settings className="size-5" />
        </button>
      </div>

      {isSettingsOpen && (
        <div className="absolute bottom-24 right-6 z-10 w-[320px] rounded-[28px] bg-white p-5 shadow-2xl shadow-black/20">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#202420]">Device Settings</h3>
            <button
              type="button"
              onClick={onCloseSettings}
              className="flex size-8 items-center justify-center rounded-full bg-[#EEF3EC] text-[#4E5A52]"
            >
              <X className="size-4" />
            </button>
          </div>

          <DeviceSelect
            label="Microphone"
            value={selectedMicId}
            options={devices.microphones}
            emptyLabel="No microphone found"
            onChange={onMicChange}
          />

          <DeviceSelect
            label="Camera"
            value={selectedCameraId}
            options={devices.cameras}
            emptyLabel="No camera found"
            onChange={onCameraChange}
          />

          <DeviceSelect
            label="Speaker"
            value={selectedSpeakerId}
            options={devices.speakers}
            emptyLabel="Default browser speaker"
            onChange={onSpeakerChange}
          />

          <p className="mt-4 text-[11px] leading-5 text-[#66736B]">
            Speaker switching uses browser device output support. Chrome-based
            browsers support it best.
          </p>
        </div>
      )}
    </div>
  );
}

function DeviceSelect({
  label,
  value,
  options,
  emptyLabel,
  onChange,
}: {
  label: string;
  value: string;
  options: DeviceOption[];
  emptyLabel: string;
  onChange: (deviceId: string) => void;
}) {
  return (
    <label className="mb-4 block text-xs font-bold uppercase tracking-wide text-[#4E5A52]">
      {label}
      <select
        value={value}
        className={selectClassName}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.length === 0 ? (
          <option value="">{emptyLabel}</option>
        ) : (
          options.map((device) => (
            <option key={device.deviceId} value={device.deviceId}>
              {device.label}
            </option>
          ))
        )}
      </select>
    </label>
  );
}
