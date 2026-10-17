import React, { useState, useEffect } from 'react';
import { X, Calendar, Image as ImageIcon, AlertCircle, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import {
  addDays,
  addWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
} from 'date-fns';
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

export const PostComposerModal: React.FC<PostComposerModalProps> = ({
  isOpen,
  onClose,
  onSchedulePost,
}) => {
  const [content, setContent] = useState<string>('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>(['x']);
  const [mediaUrl, setMediaUrl] = useState<string>('');

  // 100% in-DOM Date & Time State
  const [today] = useState<Date>(() => startOfDay(new Date()));
  const [selectedDate, setSelectedDate] = useState<Date>(() => addDays(today, 1));
  const [viewMonth, setViewMonth] = useState<Date>(() => addDays(today, 1));
  const [selectedHour, setSelectedHour] = useState<string>('10');
  const [selectedMinute, setSelectedMinute] = useState<string>('00');
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

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

  // Compute combined date
  let hourNum = parseInt(selectedHour, 10);
  if (selectedPeriod === 'PM' && hourNum < 12) hourNum += 12;
  if (selectedPeriod === 'AM' && hourNum === 12) hourNum = 0;
  const combinedDate = new Date(
    selectedDate.getFullYear(),
    selectedDate.getMonth(),
    selectedDate.getDate(),
    hourNum,
    parseInt(selectedMinute, 10),
    0
  );

  // Month grid calculations for viewing month
  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);
  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Validation logic
  const hasPlatform = selectedPlatforms.length > 0;
  const isContentNonEmpty = content.trim().length > 0;
  // eslint-disable-next-line react-hooks/purity
  const isFutureDate = Boolean(!isNaN(combinedDate.getTime()) && combinedDate.getTime() > Date.now());
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
    const tomorrow = addDays(today, 1);
    setSelectedDate(tomorrow);
    setViewMonth(tomorrow);
    setSelectedHour('10');
    setSelectedMinute('00');
    setSelectedPeriod('AM');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;

    let hourNum = parseInt(selectedHour, 10);
    if (selectedPeriod === 'PM' && hourNum < 12) hourNum += 12;
    if (selectedPeriod === 'AM' && hourNum === 12) hourNum = 0;
    const combinedDate = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      selectedDate.getDate(),
      hourNum,
      parseInt(selectedMinute, 10),
      0
    );
    const utcString = combinedDate.toISOString();

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="composer-modal-title"
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-100 bg-white shrink-0">
          <div>
            <h2
              id="composer-modal-title"
              className="text-lg font-bold text-slate-900 leading-tight"
            >
              Schedule New Post
            </h2>
            <p className="text-xs text-slate-500">
              Compose copy, select destinations, and set publish time
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form
          id="post-composer-form"
          onSubmit={handleSubmit}
          className="flex-1 max-h-[75vh] overflow-y-auto p-4 sm:p-6 space-y-4 bg-white"
        >
          {/* Platform Selector Checkboxes / Buttons */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
              Select Platforms <span className="text-rose-500">*</span>
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
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {info.icon}
                    <span>{info.label}</span>
                  </button>
                );
              })}
            </div>
            {!hasPlatform && (
              <p className="text-xs text-rose-500 mt-1.5 flex items-center gap-1">
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
                className="block text-xs font-semibold text-slate-700 uppercase tracking-wider"
              >
                Post Content <span className="text-rose-500">*</span>
              </label>
            </div>
            <textarea
              id="post-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What would you like to broadcast to your audience?"
              className="w-full box-border px-3.5 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-y min-h-[100px]"
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
                          ? 'text-rose-600 bg-rose-50 border-rose-300'
                          : 'text-slate-600 bg-slate-50 border-slate-200'
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
              className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5"
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
                className="w-full box-border pl-10 pr-9 py-2.5 text-sm rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              {mediaUrl && (
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  aria-label="Clear media url"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Thumbnail preview if URL provided */}
            {mediaUrl.trim() && (
              <div className="relative mt-2 p-2 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
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
                  <p className="text-xs font-medium text-slate-700 truncate">
                    {mediaUrl}
                  </p>
                  <p className="text-[11px] text-slate-400">Media attachment preview</p>
                </div>
              </div>
            )}
          </div>

          {/* Schedule Date & Time (100% In-DOM Custom Picker) */}
          <div className="space-y-2.5">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>Schedule Date & Time (Local)</span>
                <span className="text-rose-500">*</span>
              </span>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                stored in UTC
              </span>
            </label>

            {/* Quick Date Presets Row */}
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Quick date presets">
              {[
                { label: 'Today', date: today },
                { label: 'Tomorrow', date: addDays(today, 1) },
                { label: '+2 Days', date: addDays(today, 2) },
                { label: '+1 Week', date: addWeeks(today, 1) },
              ].map((preset) => {
                const isActive = isSameDay(selectedDate, preset.date);
                return (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => {
                      setSelectedDate(preset.date);
                      setViewMonth(preset.date);
                    }}
                    className={`px-3 py-1 text-xs rounded-full font-medium transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Compact Mini Month Calendar Grid */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
              {/* Month Navigation Header */}
              <div className="flex items-center justify-between px-1">
                <button
                  type="button"
                  onClick={() => setViewMonth((prev) => subMonths(prev, 1))}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-bold text-slate-800 select-none">
                  {format(viewMonth, 'MMMM yyyy')}
                </span>
                <button
                  type="button"
                  onClick={() => setViewMonth((prev) => addMonths(prev, 1))}
                  className="p-1 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/70 transition-colors cursor-pointer"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Day-of-week Headers */}
              <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} className="py-0.5">
                    {d}
                  </div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1 text-center">
                {calendarDays.map((day) => {
                  const isSelected = isSameDay(day, selectedDate);
                  const isCurrentMonth = isSameMonth(day, monthStart);
                  const isPast = isBefore(day, today);

                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      disabled={isPast}
                      onClick={() => setSelectedDate(day)}
                      className={`w-7 h-7 sm:w-8 sm:h-8 text-xs rounded-lg flex items-center justify-center transition-all mx-auto cursor-pointer ${
                        isPast
                          ? 'opacity-25 cursor-not-allowed text-slate-400'
                          : isSelected
                          ? 'bg-indigo-600 text-white font-semibold rounded-lg shadow-xs'
                          : isCurrentMonth
                          ? 'text-slate-700 hover:bg-slate-200/70'
                          : 'text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {format(day, 'd')}
                    </button>
                  );
                })}
              </div>

              {/* Interactive Time Selector (Tailwind Button Groups) */}
              <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                {/* Hours selection */}
                <div>
                  <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                    Hour (1–12)
                  </span>
                  <div className="grid grid-cols-6 sm:grid-cols-12 gap-1" role="group" aria-label="Select hour">
                    {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((h) => {
                      const isSelected = selectedHour === h;
                      return (
                        <button
                          key={h}
                          type="button"
                          onClick={() => setSelectedHour(h)}
                          className={`py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer border text-center ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {parseInt(h, 10)}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Minutes & AM/PM Row */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
                  {/* Minute Selection */}
                  <div className="flex-1">
                    <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Minute
                    </span>
                    <div className="grid grid-cols-4 gap-1" role="group" aria-label="Select minute">
                      {['00', '15', '30', '45'].map((m) => {
                        const isSelected = selectedMinute === m;
                        return (
                          <button
                            key={m}
                            type="button"
                            onClick={() => setSelectedMinute(m)}
                            className={`py-1 text-xs rounded-lg font-medium transition-colors cursor-pointer border text-center ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs font-semibold'
                                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            :{m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* AM/PM Toggle */}
                  <div className="sm:w-auto">
                    <span className="block text-[11px] font-semibold text-slate-600 uppercase tracking-wider mb-1.5">
                      Period
                    </span>
                    <div className="grid grid-cols-2 gap-1 bg-slate-200/60 p-1 rounded-xl border border-slate-200">
                      {(['AM', 'PM'] as const).map((p) => {
                        const isSelected = selectedPeriod === p;
                        return (
                          <button
                            key={p}
                            type="button"
                            onClick={() => setSelectedPeriod(p)}
                            className={`px-4 py-1 text-xs rounded-lg font-semibold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {p}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Date-Time Badge */}
              <div className="flex items-center justify-between text-xs px-3 py-2 bg-indigo-50/80 border border-indigo-100 rounded-xl text-indigo-950">
                <span className="font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                  <span>
                    Selected: {format(combinedDate, 'EEE, MMM d, yyyy · h:mm a')}
                  </span>
                </span>
                <span className="text-[11px] text-indigo-600 font-semibold uppercase">
                  Local
                </span>
              </div>
            </div>

            {!isFutureDate && (
              <p className="text-xs text-rose-500 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Scheduled date-time must be strictly in the future</span>
              </p>
            )}
          </div>

          {/* Hidden submit trigger so hitting Enter in inputs submits form */}
          <button type="submit" className="hidden" disabled={!isValid} aria-hidden="true" tabIndex={-1} />
        </form>

        {/* Modal Footer (Action Buttons) */}
        <div className="shrink-0 border-t border-slate-100 bg-slate-50/50 p-4 sm:px-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="post-composer-form"
            disabled={!isValid}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-all shadow-sm cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Schedule Post</span>
          </button>
        </div>
      </div>
    </div>
  );
};
