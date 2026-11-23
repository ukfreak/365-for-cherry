import React, { useState, useRef } from 'react';
import { Mic, Play, Pause, Trash2, Calendar, Clock, Volume2, Sparkles, Heart } from 'lucide-react';
import { VoiceNote } from '../../types';
import { RecordModal } from './RecordModal';

interface VoiceNotesDiaryProps {
  voiceNotes: VoiceNote[];
  onSaveVoiceNote: (note: VoiceNote) => void;
  onDeleteVoiceNote: (id: string) => void;
  senderName: string;
}

export const VoiceNotesDiary: React.FC<VoiceNotesDiaryProps> = ({
  voiceNotes,
  onSaveVoiceNote,
  onDeleteVoiceNote,
  senderName,
}) => {
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [activeNoteId, setActiveNoteId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTogglePlay = (note: VoiceNote) => {
    if (activeNoteId === note.id) {
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      // Switch to new note
      setActiveNoteId(note.id);
      setCurrentTime(0);
      setDuration(note.duration);
      if (audioRef.current) {
        audioRef.current.src = note.audioUrl || URL.createObjectURL(note.audioBlob);
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      if (audioRef.current.duration && !isNaN(audioRef.current.duration)) {
        setDuration(audioRef.current.duration);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const confirmDelete = () => {
    if (deletingId) {
      if (activeNoteId === deletingId) {
        audioRef.current?.pause();
        setActiveNoteId(null);
        setIsPlaying(false);
      }
      onDeleteVoiceNote(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Invisible Global Audio Element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        className="hidden"
      />

      {/* Header & Record Action */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-romantic-brown tracking-tight">
            A Little Something for You
          </h2>
          <p className="text-xs text-romantic-brown/70 mt-0.5">
            Voice messages recorded with love. Press play whenever you want to hear my voice.
          </p>
        </div>

        <button
          onClick={() => setIsRecordModalOpen(true)}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-romantic-rose hover:bg-romantic-deepRose text-white text-xs font-semibold shadow-sm transition-transform active:scale-95 shrink-0"
        >
          <Mic className="w-4 h-4" />
          <span>Record Note</span>
        </button>
      </div>

      {/* Voice Notes List */}
      {voiceNotes.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/70 rounded-3xl border border-romantic-pastel shadow-romantic">
          <div className="w-16 h-16 rounded-full bg-romantic-pastel/60 text-romantic-rose flex items-center justify-center mx-auto mb-3">
            <Mic className="w-8 h-8 text-romantic-rose" />
          </div>
          <h3 className="font-serif text-lg font-bold text-romantic-brown">
            No voice notes recorded yet
          </h3>
          <p className="text-xs text-romantic-brown/70 max-w-xs mx-auto mt-1 mb-5">
            Record sweet voice messages, favorite memories, or bedtime wishes for him to replay anytime!
          </p>
          <button
            onClick={() => setIsRecordModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-romantic-rose text-white text-xs font-semibold hover:bg-romantic-deepRose shadow-sm inline-flex items-center space-x-1.5"
          >
            <Mic className="w-4 h-4" />
            <span>Record First Voice Message ✨</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3.5 pt-1">
          {voiceNotes.map((note) => {
            const isThisPlaying = activeNoteId === note.id && isPlaying;
            const isThisActive = activeNoteId === note.id;
            const displayTime = isThisActive ? currentTime : 0;
            const totalDuration = isThisActive && duration > 0 ? duration : note.duration;

            return (
              <div
                key={note.id}
                className={`relative bg-white/95 rounded-3xl p-5 border transition-all duration-300 shadow-romantic hover:shadow-romantic-lg ${
                  isThisActive ? 'border-romantic-rose/50 bg-white ring-2 ring-romantic-blush/30' : 'border-romantic-pastel/70'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    {/* Play/Pause Button */}
                    <button
                      onClick={() => handleTogglePlay(note)}
                      aria-label={isThisPlaying ? 'Pause audio' : 'Play audio'}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                        isThisPlaying
                          ? 'bg-romantic-rose text-white shadow-md scale-105'
                          : 'bg-romantic-pastel/70 text-romantic-deepRose hover:bg-romantic-blush hover:scale-105'
                      }`}
                    >
                      {isThisPlaying ? (
                        <Pause className="w-5 h-5 fill-current" />
                      ) : (
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      )}
                    </button>

                    <div>
                      <h3 className="font-serif font-bold text-base text-romantic-brown">
                        {note.title}
                      </h3>
                      <div className="flex items-center space-x-2 text-[11px] text-romantic-brown/60 mt-0.5">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-romantic-rose" />
                          {new Intl.DateTimeFormat('en-US', {
                            month: 'short',
                            day: 'numeric',
                          }).format(new Date(note.createdAt))}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3 text-romantic-brown/50" />
                          {formatSeconds(note.duration)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Delete button */}
                  <button
                    onClick={() => setDeletingId(note.id)}
                    title="Delete voice note"
                    className="w-8 h-8 rounded-full text-romantic-brown/40 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Optional Sweet Description */}
                {note.description && (
                  <p className="font-sans text-xs text-romantic-brown/75 italic bg-romantic-cream/60 p-2.5 rounded-xl border border-romantic-pastel/60 mb-3">
                    "{note.description}"
                  </p>
                )}

                {/* Player Progress Bar & Waveform */}
                <div className="space-y-1 pt-1">
                  <div className="relative flex items-center">
                    <input
                      type="range"
                      min={0}
                      max={totalDuration || 1}
                      step={0.1}
                      value={displayTime}
                      onChange={handleSeek}
                      disabled={!isThisActive}
                      className="w-full h-1.5 bg-romantic-pastel/60 rounded-lg appearance-none cursor-pointer accent-romantic-rose"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-romantic-brown/60">
                    <span>{formatSeconds(displayTime)}</span>
                    <span className="flex items-center gap-1 text-romantic-rose font-sans font-medium">
                      {isThisPlaying && (
                        <span className="w-1.5 h-1.5 rounded-full bg-romantic-rose animate-ping mr-1" />
                      )}
                      From {senderName}
                    </span>
                    <span>{formatSeconds(totalDuration)}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Record Modal */}
      {isRecordModalOpen && (
        <RecordModal
          onSave={onSaveVoiceNote}
          onClose={() => setIsRecordModalOpen(false)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-romantic-pastel animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-romantic-brown">
              Delete this voice note?
            </h3>
            <p className="text-xs text-romantic-brown/70 mt-1 mb-5">
              This audio recording will be permanently deleted from your diary.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium rounded-full text-romantic-brown hover:bg-romantic-pastel/50"
              >
                Keep Recording
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-rose-600 text-white hover:bg-rose-700 shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
