import React, { useState } from 'react';
import { X, Heart, Share2, Check, Bookmark } from 'lucide-react';
import { Reason } from '../../types';

interface ReasonModalProps {
  reason: Reason | null;
  onClose: () => void;
  onToggleFavorite: (day: number) => void;
  onSaveNote: (day: number, note: string) => void;
  senderName: string;
}

export const ReasonModal: React.FC<ReasonModalProps> = ({
  reason,
  onClose,
  onToggleFavorite,
  onSaveNote,
  senderName,
}) => {
  if (!reason) return null;

  const [noteText, setNoteText] = useState(reason.customNote || '');
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(`Day ${reason.day}: "${reason.text}" — With all my love, ${senderName}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveNote(reason.day, noteText);
    setIsEditingNote(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-romantic-pastel animate-scale-up overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Badge */}
        <div className="flex items-center space-x-2 mb-4">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-romantic-pastel/70 text-romantic-deepRose border border-romantic-blush/40">
            Day #{reason.day}
          </span>
        </div>

        {/* Reason Content */}
        <div className="my-6">
          <div className="font-serif text-3xl text-romantic-blush leading-none select-none">“</div>
          <p className="font-serif text-xl sm:text-2xl text-romantic-brown font-medium leading-relaxed italic px-2 my-2">
            {reason.text}
          </p>
          <div className="font-serif text-3xl text-romantic-blush leading-none text-right select-none">”</div>
        </div>

        {/* Note Section */}
        <div className="mb-6">
          {isEditingNote ? (
            <form onSubmit={handleSaveNoteSubmit} className="space-y-2">
              <label className="text-xs font-semibold text-romantic-brown">Personal Note / Memory:</label>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Write a sweet memory or note related to this reason..."
                rows={3}
                className="w-full text-xs p-3 rounded-2xl border border-romantic-pastel focus:outline-hidden focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
              />
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingNote(false)}
                  className="px-3 py-1.5 text-xs rounded-full text-romantic-brown hover:bg-romantic-pastel/50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs rounded-full bg-romantic-rose text-white font-medium hover:bg-romantic-deepRose"
                >
                  Save Note
                </button>
              </div>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              {noteText ? (
                <div className="bg-romantic-pastel/30 p-3 rounded-2xl text-xs text-romantic-brown/90 border border-romantic-blush/30 w-full mr-2">
                  <span className="font-semibold text-romantic-rose block">Your Note:</span>
                  {noteText}
                </div>
              ) : null}
              <button
                onClick={() => setIsEditingNote(true)}
                className="text-xs text-romantic-rose hover:text-romantic-deepRose font-medium flex items-center space-x-1 whitespace-nowrap ml-auto"
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>{noteText ? 'Edit Note' : 'Add Note'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Actions Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-romantic-pastel/60">
          <button
            onClick={() => onToggleFavorite(reason.day)}
            className={`flex items-center space-x-1.5 text-xs font-medium px-4 py-2 rounded-full border transition-colors ${
              reason.isFavorite
                ? 'bg-romantic-rose text-white border-romantic-rose'
                : 'bg-romantic-softBg text-romantic-brown border-romantic-pastel hover:bg-romantic-pastel/50'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${reason.isFavorite ? 'fill-white' : ''}`} />
            <span>{reason.isFavorite ? 'Favorited' : 'Favorite'}</span>
          </button>

          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 text-xs font-medium px-4 py-2 rounded-full border border-romantic-pastel bg-romantic-softBg hover:bg-romantic-pastel/50 text-romantic-brown"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
