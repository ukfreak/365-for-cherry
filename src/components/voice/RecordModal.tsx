import React, { useState, useRef, useEffect } from 'react';
import { X, Mic, Square, Play, Pause, RotateCcw, Check, AlertCircle } from 'lucide-react';
import { VoiceNote } from '../../types';

interface RecordModalProps {
  onSave: (voiceNote: VoiceNote) => Promise<boolean | void> | void;
  onClose: () => void;
}

export const RecordModal: React.FC<RecordModalProps> = ({ onSave, onClose }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlayingPreview, setIsPlayingPreview] = useState(false);
  const [previewCurrentTime, setPreviewCurrentTime] = useState(0);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerIntervalRef = useRef<any>(null);
  const audioPreviewRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const startRecording = async () => {
    setError('');
    audioChunksRef.current = [];
    setAudioBlob(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setRecordingDuration(0);

    try {
      // Request microphone permission only when user clicks Record
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const mimeType = mediaRecorder.mimeType || 'audio/webm';
        const blob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(blob);
        const url = URL.createObjectURL(blob);
        setPreviewUrl(url);

        // Stop stream tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
      };

      mediaRecorder.start(200);
      setIsRecording(true);

      timerIntervalRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.error('Microphone access failed:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setError('Microphone permission was denied. Please allow microphone access in your browser settings.');
      } else {
        setError('Could not access microphone: ' + (err.message || 'Unknown error'));
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }
  };

  const handleTogglePreviewPlay = () => {
    if (!audioPreviewRef.current) return;
    if (isPlayingPreview) {
      audioPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      audioPreviewRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

   const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (saving) return;
    if (!audioBlob) {
      setError('Please record a voice note before saving.');
      return;
    }
    if (!title.trim()) {
      setError('Please enter a title for your voice message.');
      return;
    }

    const newNote: VoiceNote = {
      id: 'voice-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      audioBlob,
      duration: recordingDuration || 1,
      createdAt: Date.now(),
    };

    setSaving(true);
    const ok = await onSave(newNote);
    setSaving(false);
    if (ok !== false) onClose();
  };

    const newNote: VoiceNote = {
      id: 'voice-' + Date.now(),
      title: title.trim(),
      description: description.trim(),
      audioBlob,
      duration: recordingDuration || 1,
      createdAt: Date.now(),
    };

    onSave(newNote);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-romantic-pastel max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-bold text-romantic-brown mb-1">
          Record a Voice Message
        </h3>
        <p className="text-xs text-romantic-brown/70 mb-5">
          Leave a sweet audio note in your own voice that he can listen to anytime.
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Recorder Centerpiece */}
        <div className="my-5 p-6 bg-romantic-cream/60 rounded-3xl border border-romantic-pastel/80 flex flex-col items-center justify-center text-center">
          {/* Pulsating Visual Ring */}
          <div className="relative mb-4">
            {isRecording && (
              <>
                <div className="absolute inset-0 rounded-full bg-romantic-rose/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full bg-romantic-blush/30 animate-pulse" />
              </>
            )}

            <button
              type="button"
              onClick={isRecording ? stopRecording : startRecording}
              className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 shadow-md ${
                isRecording
                  ? 'bg-rose-600 text-white hover:bg-rose-700 scale-105'
                  : 'bg-romantic-rose text-white hover:bg-romantic-deepRose hover:scale-105'
              }`}
            >
              {isRecording ? (
                <Square className="w-8 h-8 fill-current" />
              ) : (
                <Mic className="w-9 h-9" />
              )}
            </button>
          </div>

          {/* Status Label & Timer */}
          <div className="font-mono text-xl font-bold text-romantic-brown mb-1">
            {formatSeconds(recordingDuration)}
          </div>
          <p className="text-xs font-medium text-romantic-deepRose">
            {isRecording
              ? 'Recording your voice... Tap to stop'
              : audioBlob
              ? 'Recording completed! Listen below or re-record.'
              : 'Tap microphone to start recording'}
          </p>

          {/* Sound Wave Animation when recording */}
          {isRecording && (
            <div className="flex items-center space-x-1 mt-4 h-6">
              {[40, 70, 95, 60, 85, 100, 75, 45, 90, 65, 80, 50].map((h, i) => (
                <div
                  key={i}
                  className="w-1 bg-romantic-rose rounded-full animate-pulse"
                  style={{
                    height: `${h}%`,
                    animationDuration: `${0.4 + (i % 5) * 0.15}s`,
                    animationDelay: `${i * 0.05}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Audio Preview Player */}
          {previewUrl && !isRecording && (
            <div className="w-full mt-4 pt-4 border-t border-romantic-pastel/60 flex items-center justify-between">
              <audio
                ref={audioPreviewRef}
                src={previewUrl}
                onTimeUpdate={() => {
                  if (audioPreviewRef.current) {
                    setPreviewCurrentTime(audioPreviewRef.current.currentTime);
                  }
                }}
                onEnded={() => setIsPlayingPreview(false)}
                className="hidden"
              />

              <button
                type="button"
                onClick={handleTogglePreviewPlay}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-romantic-pastel text-romantic-brown text-xs font-semibold hover:bg-romantic-blush transition-colors"
              >
                {isPlayingPreview ? (
                  <>
                    <Pause className="w-3.5 h-3.5 fill-current" />
                    <span>Pause Preview</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Play Preview</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={startRecording}
                className="flex items-center space-x-1 text-xs text-romantic-brown/70 hover:text-rose-600 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Re-record</span>
              </button>
            </div>
          )}
        </div>

        {/* Note Metadata Form */}
        <form onSubmit={handleSaveSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-romantic-brown mb-1">
              Voice Note Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Listen when you miss me, Late night thoughts..."
              required
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-romantic-brown mb-1">
              Sweet Note / Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add a little text message to accompany this audio note..."
              rows={2}
              className="w-full text-xs p-3 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-romantic-pastel/60">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-full text-romantic-brown hover:bg-romantic-pastel/40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!audioBlob}
              className={`px-5 py-2 text-xs font-semibold rounded-full text-white transition-all shadow-sm ${
                audioBlob
                  ? 'bg-romantic-rose hover:bg-romantic-deepRose cursor-pointer'
                  : 'bg-romantic-brown/30 cursor-not-allowed'
              }`}
            >
              Save Voice Note ✨
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
