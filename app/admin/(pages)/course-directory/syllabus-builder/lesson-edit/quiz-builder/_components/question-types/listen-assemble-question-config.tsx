import AudioMediaCard from "./audio-media-card";
import SentenceTranslationQuestionConfig from "./sentence-translation-question-config";

export default function ListenAssembleQuestionConfig() {
  return (
    <div className="space-y-6">
      <AudioMediaCard />
      <SentenceTranslationQuestionConfig />
    </div>
  );
}
