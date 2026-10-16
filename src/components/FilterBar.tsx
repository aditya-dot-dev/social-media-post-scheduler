import React from 'react';
import { Search, X, RotateCcw, Clock, Check, AlertTriangle } from 'lucide-react';
import type { Platform, PostStatus } from '../types/post';

export interface FilterBarProps {
  search: string;
  platform: Platform | 'all';
  status: PostStatus | 'all';
  onSearchChange: (val: string) => void;
  onPlatformChange: (val: Platform | 'all') => void;
  onStatusChange: (val: PostStatus | 'all') => void;
  onReset: () => void;
  totalResults: number;
}

const PLATFORM_OPTIONS: {
  id: Platform | 'all';
  label: string;
  icon?: React.ReactNode;
}[] = [
  { id: 'all', label: 'All' },
  {
    id: 'x',
    label: 'X',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    id: 'instagram',
    label: 'Instagram',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: 'tiktok',
    label: 'TikTok',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.07A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.47 6.27 6.27 0 0 0 1.83-4.47V8.04a8.27 8.27 0 0 0 4.75 1.48V6.08a4.85 4.85 0 0 1-.85-.14v.75z" />
      </svg>
    ),
  },
  {
    id: 'facebook',
    label: 'Facebook',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
];

const STATUS_OPTIONS: {
  id: PostStatus | 'all';
  label: string;
  icon?: React.ReactNode;
}[] = [
  { id: 'all', label: 'All' },
  {
    id: 'scheduled',
    label: 'Scheduled',
    icon: <Clock className="w-3.5 h-3.5 text-indigo-500 shrink-0" />,
  },
  {
    id: 'published',
    label: 'Published',
    icon: <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />,
  },
  {
    id: 'failed',
    label: 'Failed',
    icon: <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />,
  },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  search,
  platform,
  status,
  onSearchChange,
  onPlatformChange,
  onStatusChange,
  onReset,
  totalResults,
}) => {
  const isFiltered = Boolean(search.trim() || platform !== 'all' || status !== 'all');

  return (
    <div className="bg-white dark:bg-[#181920] border border-gray-200/80 dark:border-gray-800 rounded-xl p-4 sm:p-5 shadow-xs mb-6 space-y-4">
      {/* Top Row: Search Input + Result Count Badge & Reset Button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input with Magnifying Glass and Clear Button */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 dark:text-gray-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search posts by content, hashtags..."
            className="w-full pl-9 pr-9 py-2 text-sm rounded-lg bg-gray-50 dark:bg-[#1f2028] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-colors"
            aria-label="Search posts"
          />
          {search && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors cursor-pointer"
              aria-label="Clear search query"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Count & Optional Clear Filters */}
        <div className="flex items-center justify-between sm:justify-end gap-2.5 shrink-0">
          <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200/70 dark:border-purple-800/60">
            Showing {totalResults} {totalResults === 1 ? 'post' : 'posts'}
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors cursor-pointer border border-rose-200/60 dark:border-rose-900/40"
              aria-label="Reset all search and filters"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear Filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Selectors Row: Platform and Status */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pt-3.5 border-t border-gray-100 dark:border-gray-800/80">
        {/* Platform Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
            Platform:
          </span>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by platform">
            {PLATFORM_OPTIONS.map((opt) => {
              const isActive = platform === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onPlatformChange(opt.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/80 border border-transparent'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Status Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider shrink-0">
            Status:
          </span>
          <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter by status">
            {STATUS_OPTIONS.map((opt) => {
              const isActive = status === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => onStatusChange(opt.id)}
                  aria-pressed={isActive}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'bg-gray-100 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700/80 border border-transparent'
                  }`}
                >
                  {opt.icon}
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
