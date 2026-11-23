import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, Calendar, Tag } from 'lucide-react';
import { Memory } from '../../types';

interface MemoryModalProps {
  memoryToEdit?: Memory | null;
  onSave: (memory: Memory) => void;
  onClose: () => void;
}

export const MemoryModal: React.FC<MemoryModalProps> = ({
  memoryToEdit,
  onSave,
  onClose,
}) => {
  const [title, setTitle] = useState(memoryToEdit?.title || '');
  const [date, setDate] = useState(
    memoryToEdit?.date || new Date().toISOString().split('T')[0]
  );
  const [caption, setCaption] = useState(memoryToEdit?.caption || '');
  const [tag, setTag] = useState(memoryToEdit?.tag || 'Special Moment');
  const [imageDataUrl, setImageDataUrl] = useState(memoryToEdit?.imageDataUrl || '');
  const [error, setError] = useState('');

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file.');
      return;
    }

    // Limit to reasonable size (~10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image is too large. Please select an image under 10MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageDataUrl(event.target.result as string);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Please enter a memory title.');
      return;
    }
    if (!imageDataUrl) {
      setError('Please upload a photo for this memory.');
      return;
    }

    const memory: Memory = {
      id: memoryToEdit?.id || 'mem-' + Date.now(),
      title: title.trim(),
      date,
      caption: caption.trim(),
      imageDataUrl,
      tag: tag.trim() || undefined,
      createdAt: memoryToEdit?.createdAt || Date.now(),
    };

    onSave(memory);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fade-in">
      <div
        className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-romantic-pastel max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-romantic-softBg hover:bg-romantic-pastel/60 text-romantic-brown flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-serif text-xl font-bold text-romantic-brown mb-1">
          {memoryToEdit ? 'Edit Memory' : 'Add Our Little Memory'}
        </h3>
        <p className="text-xs text-romantic-brown/70 mb-5">
          Save a cherished photograph and story to our private scrapbook.
        </p>

        {error && (
          <div className="mb-4 p-2.5 rounded-xl bg-rose-50 text-rose-700 text-xs border border-rose-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Photo Upload Area */}
          <div>
            <label className="block text-xs font-semibold text-romantic-brown mb-1.5">
              Photograph
            </label>
            {imageDataUrl ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-romantic-blush shadow-inner group">
                <img
                  src={imageDataUrl}
                  alt="Memory preview"
                  className="w-full h-56 object-cover"
                />
                <label className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer text-white text-xs font-semibold">
                  <span>Change Photograph</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="border-2 border-dashed border-romantic-blush/60 hover:border-romantic-rose rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-romantic-softBg/50 hover:bg-romantic-pastel/20 transition-colors">
                <div className="w-12 h-12 rounded-full bg-romantic-pastel/60 flex items-center justify-center text-romantic-rose mb-2">
                  <Upload className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-romantic-brown">
                  Click to upload a romantic photo
                </span>
                <span className="text-[10px] text-romantic-brown/60 mt-0.5">
                  PNG, JPG, or WEBP up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-romantic-brown mb-1">
              Memory Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Our Starlit Walk in the Park"
              required
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
            />
          </div>

          {/* Date and Tag */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-romantic-brown mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-romantic-rose" />
                <span>Date</span>
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-romantic-brown mb-1 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-romantic-rose" />
                <span>Theme / Tag</span>
              </label>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g. First Date, Travel, Cozy"
                className="w-full text-xs px-3 py-2 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
              />
            </div>
          </div>

          {/* Caption / Story */}
          <div>
            <label className="block text-xs font-semibold text-romantic-brown mb-1">
              The Story / Personal Caption
            </label>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="What made this moment so special to you? How were you feeling?..."
              rows={3}
              className="w-full text-xs p-3 rounded-2xl border border-romantic-pastel focus:ring-2 focus:ring-romantic-rose/40 bg-romantic-softBg"
            />
          </div>

          {/* Buttons */}
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
              className="px-5 py-2 text-xs font-semibold rounded-full bg-romantic-rose text-white hover:bg-romantic-deepRose transition-colors shadow-sm"
            >
              {memoryToEdit ? 'Save Changes' : 'Add to Scrapbook ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
