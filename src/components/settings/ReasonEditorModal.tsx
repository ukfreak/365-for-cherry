import React, { useState } from 'react';
import { X, Search, Edit3, Check, RotateCcw } from 'lucide-react';
import { Reason } from '../../types';
import { DEFAULT_REASONS } from '../../data/defaultReasons';

interface ReasonEditorModalProps {
  reasons: Reason[];
  onUpdateReason: (reason: Reason) => void;
  onResetAllReasons: () => void;
  onClose: () => void;
}

export const ReasonEditorModal: React.FC<ReasonEditorModalProps> = ({
  reasons,
  onUpdateReason,
  onResetAllReasons,
  onClose,
}) => {
  const [search, setSearch] = useState('');
  const [editingDay, setEditingDay] = useState<number | null>(null);
  const [editText, setEditText] = useState('');

  const filtered = reasons.filter((r) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return String(r.day).includes(q) || r.text.toLowerCase().includes(q);
    }
    return true;
  });

  const handleStartEdit = (reason: Reason) => {
    setEditingDay(reason.day);
    setEditText(reason.text);
  };

  const handleSaveEdit = (day: number) => {
    const existing = reasons.find((r) => r.day === day);
    if (existing) {
      onUpdateReason({
        ...existing,
        text: editText.trim(),
      });
    }
    setEditingDay(null);
  };

  const handleResetSingle = (day: number) => {
    const defaultR = DEFAULT_REASONS.find((r) => r.day === day);
    if (defaultR) {
      onUpdateReason(defaultR);
      if (editingDay === day) {
        setEditText(defaultR.text);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl p-5 sm:p-7 shadow-2xl border border-romantic-pastel flex flex-col max-h-[92vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-romantic-pastel/60 shrink-0">
          <div>
            <h3 className="font-serif text-xl font-bold text-romantic-brown">
              Personalize 365 Reasons
            </h3>
            <p className="text-xs text-romantic-brown/70">
              Customize any reason to match your specific inside jokes, memories, and habits!
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="py-3 shrink-0 border-b border-romantic-pastel/40">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-romantic-brown/40" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by day number or reason keyword..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-romantic-softBg border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40"
            />
          </div>
        </div>

        {/* Reasons List */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {filtered.map((reason) => {
            const isEditing = editingDay === reason.day;

            return (
              <div
                key={reason.day}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isEditing
                    ? 'bg-romantic-cream/80 border-romantic-rose ring-2 ring-romantic-blush/40'
                    : 'bg-romantic-softBg/60 border-romantic-pastel/70 hover:bg-white'
                }`}
              >
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-romantic-deepRose">
                        Editing Day #{reason.day}
                      </span>
                    </div>

                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={3}
                      className="w-full text-xs p-3 rounded-xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-white"
                    />

                    <div className="flex items-center justify-between">
                      <button
                        onClick={() => handleResetSingle(reason.day)}
                        className="text-[11px] text-romantic-brown/60 hover:text-romantic-rose flex items-center space-x-1"
                      >
                        <RotateCcw className="w-3 h-3" />
                        <span>Reset to default</span>
                      </button>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingDay(null)}
                          className="px-3 py-1 text-xs rounded-full text-romantic-brown hover:bg-romantic-pastel/50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(reason.day)}
                          className="px-4 py-1 text-xs font-semibold rounded-full bg-romantic-rose text-white hover:bg-romantic-deepRose flex items-center space-x-1"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-romantic-pastel text-romantic-deepRose">
                          Day #{reason.day}
                        </span>
                      </div>
                      <p className="font-serif text-xs text-romantic-brown/90 leading-relaxed italic">
                        "{reason.text}"
                      </p>
                    </div>

                    <button
                      onClick={() => handleStartEdit(reason)}
                      className="p-1.5 rounded-full text-romantic-brown/60 hover:text-romantic-rose hover:bg-romantic-pastel/50 transition-colors shrink-0"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-romantic-pastel/60 flex items-center justify-between shrink-0">
          <button
            onClick={() => {
              if (confirm('Are you sure you want to reset all 365 reasons to their defaults?')) {
                onResetAllReasons();
              }
            }}
            className="text-xs text-romantic-brown/60 hover:text-rose-600 transition-colors"
          >
            Reset All to Default
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-romantic-rose text-white text-xs font-semibold hover:bg-romantic-deepRose shadow-sm"
          >
            Done Customizing
          </button>
        </div>
      </div>
    </div>
  );
};
