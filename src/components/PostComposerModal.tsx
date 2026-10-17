import React, { useState, useEffect } from 'react';
import { X, Calendar, Image as ImageIcon, AlertCircle } from 'lucide-react';
import type { Platform, Post } from '../types/post';

export interface PostComposerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedulePost: (newPost: Omit<Post, 'id' | 'status'>) => void;
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  x: 280,
  instagram: 2200,
  tiktok: 2200,
  facebook: 5000,
};

const PLATFORM_INFO: Record<
  Platform,
  { label: string; icon: React.ReactNode }
> = {
  x: {
    label: 'X',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  instagram: {
    label: 'Instagram',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  tiktok: {
    label: 'TikTok',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.07A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.47 6.27 6.27 0 0 0 1.83-4.47V8.04a8.27 8.27 0 0 0 4.75 1.48V6.08a4.85 4.85 0 0 1-.85-.14v.75z" />
      </svg>
    ),
  },
  facebook: {
    label: 'Facebook',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
};

const ALL_PLATFORMS: Platform[] = ['x', 'instagram', 'tiktok', 'facebook'];

/**
 * Returns local YYYY-MM-DDTHH:mm string offset by specified hours.
 */
const getLocalDateTimeString = (offsetHours: number = 0): string => {
  const date = new Date(Date.now() + offsetHours * 60 * 60 * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  isOpen,
  onClose,
  onSchedulePost,
}) => {
  const [content, setContent] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['x']);
  const [mediaUrl, setMediaUrl] = useState<string>('');
  const [minDateTime] = useState<string>(() => getLocalDateTimeString(0));
  const [scheduledDateTime, setScheduledDateTime] = useState<string>(() =>
    getLocalDateTimeString(1)
  );

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Validation logic
  const hasPlatform = selectedPlatforms.length > 0;
  const isContentNonEmpty = content.trim().length > 0;
  const isFutureDate = Boolean(
    scheduledDateTime && scheduledDateTime >= minDateTime
  );
  const isWithinLimits = selectedPlatforms.every(
    (p) => content.length <= PLATFORM_LIMITS[p]
  );

  const isValid = hasPlatform && isContentNonEmpty && isFutureDate && isWithinLimits;

  const togglePlatform = (p: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const handleClose = () => {
    setContent('');
    setSelectedPlatforms(['x']);
    setMediaUrl('');
    setScheduledDateTime(getLocalDateTimeString(1));
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    const utcString = new Date(scheduledDateTime).toISOString();
    onSchedulePost({
      content: content.trim(),
      platforms: selectedPlatforms,
      mediaUrl: mediaUrl.trim() || undefined,
      scheduledAt: utcString,
    });

    handleClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="composer-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 pb-3 sm:pb-4 border-b border-slate-800 shrink-0 bg-slate-900">
          <div>
            <h2
              id="composer-modal-title"
              className="text-base sm:text-lg font-bold text-slate-100 leading-tight"
            >
              Schedule New Post
            </h2>
            <p className="text-xs text-slate-400">
              Compose copy, select destinations, and set publish time
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          id="post-composer-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4"
        >
          {/* Platform Selector Checkboxes / Buttons */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Select Platforms <span className="text-rose-400">*</span>
            </label>
            <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Select platforms">
              {ALL_PLATFORMS.map((platform) => {
                const isSelected = selectedPlatforms.includes(platform);
                const info = PLATFORM_INFO[platform];

                return (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    aria-pressed={isSelected}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80'
                    }`}
                  >
                    {info.icon}
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
            {!hasPlatform && (
              <p className="text-xs text-rose-400 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Please select at least one platform</span>
              </p>
            )}
          </div>

          {/* Post Content Area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="post-content"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
              >
                Post Content <span className="text-rose-400">*</span>
              </label>
            </div>
            <textarea
              id="post-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to broadcast to your audience?"
              className="w-full box-border px-3.5 py-2.5 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y min-h-[100px]"
              required
            />

            {/* Live Character Badges for each selected platform */}
            {selectedPlatforms.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {selectedPlatforms.map((p) => {
                  const limit = PLATFORM_LIMITS[p];
                  const remaining = limit - content.length;
                  const isOver = remaining < 0;

                  return (
                    <span
                      key={p}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                        isOver
                          ? 'text-rose-400 bg-rose-950/60 border-rose-800'
                          : 'text-slate-300 bg-slate-800/80 border-slate-700'
                      }`}
                    >
                      <span>{PLATFORM_INFO[p].icon}</span>
                      <span className="capitalize">{p}:</span>
                      <span className="font-semibold">
                        {content.length}/{limit} ({remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`})
                      </span>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Media URL Attachment */}
          <div>
            <label
              htmlFor="media-url"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
            >
              Media Image URL (Optional)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <ImageIcon className="w-4 h-4" />
              </div>
              <input
                id="media-url"
                type="url"
                value={mediaUrl}
                onChange={(e) => setMediaUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full box-border pl-10 pr-9 py-2 text-sm rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {mediaUrl && (
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
                  aria-label="Clear media url"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Thumbnail preview if URL provided */}
            {mediaUrl.trim() && (
              <div className="relative mt-2 p-2 rounded-xl border border-slate-700 bg-slate-800/50 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-700 shrink-0 border border-slate-600">
                  <img
                    src={mediaUrl}
                    alt="Media preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-slate-300 truncate">
                    {mediaUrl}
                  </p>
                  <p className="text-[11px] text-slate-400">Media attachment preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Date & Time (Local) */}
          <div className="space-y-1.5">
            <label
              htmlFor="scheduled-datetime"
              className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5"
            >
              <span>Schedule Date & Time (Local)</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              id="scheduled-datetime"
              type="datetime-local"
              // eslint-disable-next-line react-hooks/purity
              min={new Date(Date.now() + 60000).toISOString().slice(0, 16)}
              value={scheduledDateTime}
              onChange={(e) => setScheduledDateTime(e.target.value)}
              required
              className="w-full box-border px-3.5 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all scheme-dark cursor-pointer"
            />
            <p className="text-[11px] text-slate-400">Will be stored in UTC and broadcast in future.</p>
            {!isFutureDate && scheduledDateTime && (
              <p className="text-xs text-rose-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Scheduled date-time must be strictly in the future</span>
              </p>
            )}
          </div>

          {/* Hidden submit trigger so hitting Enter in inputs submits form */}
          <button type="submit" className="hidden" disabled={!isValid} aria-hidden="true" tabIndex={-1} />
        </form>

        {/* Modal Footer (Action Buttons) */}
        <div className="p-4 sm:px-6 sm:py-4 border-t border-slate-800 bg-slate-900 flex items-center justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={handleClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="post-composer-form"
            disabled={!isValid}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};
