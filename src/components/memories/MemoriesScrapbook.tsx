import React, { useState } from 'react';
import { Plus, Calendar, Tag, Trash2, Edit2, Maximize2, X, Heart } from 'lucide-react';
import { Memory } from '../../types';
import { MemoryModal } from './MemoryModal';

interface MemoriesScrapbookProps {
  memories: Memory[];
  onSaveMemory: (memory: Memory) => void;
  onDeleteMemory: (id: string) => void;
}

export const MemoriesScrapbook: React.FC<MemoriesScrapbookProps> = ({
  memories,
  onSaveMemory,
  onDeleteMemory,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
  const [lightboxMemory, setLightboxMemory] = useState<Memory | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleOpenEdit = (m: Memory, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingMemory(m);
    setIsModalOpen(true);
  };

  const handleOpenDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDeletingId(id);
  };

  const confirmDelete = () => {
    if (deletingId) {
      onDeleteMemory(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Add Button */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <h2 className="font-serif text-2xl font-bold text-romantic-brown tracking-tight">
            Our Little Memories
          </h2>
          <p className="text-xs text-romantic-brown/70 mt-0.5">
            A romantic scrapbook of the moments we hold close to our hearts.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingMemory(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-full bg-romantic-rose hover:bg-romantic-deepRose text-white text-xs font-semibold shadow-sm transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Add Memory</span>
        </button>
      </div>

      {/* Scrapbook Grid */}
      {memories.length === 0 ? (
        <div className="text-center py-16 px-6 bg-white/70 rounded-3xl border border-romantic-pastel shadow-romantic">
          <div className="w-16 h-16 rounded-full bg-romantic-pastel/60 text-romantic-rose flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8 fill-romantic-rose/40" />
          </div>
          <h3 className="font-serif text-lg font-bold text-romantic-brown">
            No memories added yet
          </h3>
          <p className="text-xs text-romantic-brown/70 max-w-xs mx-auto mt-1 mb-5">
            Start adding your favorite photographs and stories to build your personalized scrapbook!
          </p>
          <button
            onClick={() => {
              setEditingMemory(null);
              setIsModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-full bg-romantic-rose text-white text-xs font-semibold hover:bg-romantic-deepRose shadow-sm"
          >
            Add Your First Memory ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {memories.map((memory, index) => {
            // Subtle alternating rotation for scrapbook realism (-1.5deg to 1.5deg)
            const rotationClass =
              index % 3 === 0
                ? 'sm:-rotate-1'
                : index % 3 === 1
                ? 'sm:rotate-1'
                : 'sm:rotate-0';

            return (
              <div
                key={memory.id}
                onClick={() => setLightboxMemory(memory)}
                className={`relative group bg-white rounded-2xl p-3.5 pb-5 shadow-polaroid hover:shadow-romantic-lg border border-romantic-blush/30 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer ${rotationClass}`}
              >
                {/* Washi Tape Effect at top */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-romantic-blush/50 backdrop-blur-xs border-y border-romantic-rose/20 shadow-xs z-10 rotate-1 pointer-events-none" />

                {/* Photo container */}
                <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-romantic-softBg mb-3.5 shadow-inner">
                  <img
                    src={memory.imageDataUrl}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Hover action overlay */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleOpenEdit(memory, e)}
                      title="Edit memory"
                      className="w-7 h-7 rounded-full bg-white/90 text-romantic-brown hover:bg-white flex items-center justify-center shadow-xs"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={(e) => handleOpenDelete(memory.id, e)}
                      title="Delete memory"
                      className="w-7 h-7 rounded-full bg-white/90 text-rose-600 hover:bg-white flex items-center justify-center shadow-xs"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <span className="absolute bottom-2 right-2 w-6 h-6 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </span>
                </div>

                {/* Polaroid Bottom Notes */}
                <div className="px-1 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-romantic-brown line-clamp-1">
                      {memory.title}
                    </h3>
                    {memory.tag && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-romantic-pastel/60 text-romantic-deepRose font-medium flex items-center gap-1">
                        <Tag className="w-2.5 h-2.5" />
                        {memory.tag}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 text-[11px] text-romantic-brown/60">
                    <Calendar className="w-3 h-3 text-romantic-rose" />
                    <span>
                      {new Intl.DateTimeFormat('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      }).format(new Date(memory.date))}
                    </span>
                  </div>

                  {memory.caption && (
                    <p className="font-sans text-xs text-romantic-brown/80 line-clamp-2 italic pt-1 leading-relaxed">
                      "{memory.caption}"
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <MemoryModal
          memoryToEdit={editingMemory}
          onSave={onSaveMemory}
          onClose={() => {
            setIsModalOpen(false);
            setEditingMemory(null);
          }}
        />
      )}

      {/* Fullscreen Lightbox Modal */}
      {lightboxMemory && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setLightboxMemory(null)}
        >
          <div
            className="relative max-w-2xl w-full bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 animate-scale-up"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setLightboxMemory(null)}
              className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-black/60 text-white hover:bg-black/80 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="max-h-[60vh] bg-black flex items-center justify-center overflow-hidden">
              <img
                src={lightboxMemory.imageDataUrl}
                alt={lightboxMemory.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="p-6 bg-romantic-cream/90">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-serif text-xl font-bold text-romantic-brown">
                  {lightboxMemory.title}
                </h3>
                <span className="text-xs text-romantic-brown/60">
                  {new Intl.DateTimeFormat('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  }).format(new Date(lightboxMemory.date))}
                </span>
              </div>
              {lightboxMemory.caption && (
                <p className="font-serif text-sm sm:text-base text-romantic-brown/85 italic leading-relaxed">
                  "{lightboxMemory.caption}"
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deletingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl border border-romantic-pastel animate-scale-up">
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-romantic-brown">
              Delete this memory?
            </h3>
            <p className="text-xs text-romantic-brown/70 mt-1 mb-5">
              This photo and story will be removed from your scrapbook.
            </p>
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setDeletingId(null)}
                className="px-4 py-2 text-xs font-medium rounded-full text-romantic-brown hover:bg-romantic-pastel/50"
              >
                Keep Memory
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
