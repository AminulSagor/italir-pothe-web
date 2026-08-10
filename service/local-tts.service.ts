import { serviceClient } from "@/service/base/service_client";

interface GenerateQuizAudioResponse {
  mediaFileId: string;
}

export const generateQuizAudio = (text: string) =>
  serviceClient.post<GenerateQuizAudioResponse>("/admin/tts/quiz-audio", {
    text,
  });
