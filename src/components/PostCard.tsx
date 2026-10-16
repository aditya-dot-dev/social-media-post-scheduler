import React from 'react';
import { Clock, Check, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import type { Platform, Post, PostStatus } from '../types/post';
import { formatPostTime } from '../utils/date';

export interface PostCardProps {
  post: Post;
  onRetry?: (postId: string) => void;
  isRetrying?: boolean;
}

const platformConfig: Record<
  Platform,
  { name: string; bg: string; icon: React.ReactNode }
> = {
  facebook: {
    name: 'Facebook',
    bg: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400 border-blue-200/60 dark:border-blue-900/50',
    icon: (
      <svg className="w-3.5 h-3.5 fill-[#1877F2]" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  instagram: {
    name: 'Instagram',
    bg: 'bg-pink-50 text-pink-600 dark:bg-pink-950/60 dark:text-pink-400 border-pink-200/60 dark:border-pink-900/50',
    icon: (
      <svg className="w-3.5 h-3.5 fill-[#E4405F]" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  x: {
    name: 'X',
    bg: 'bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100 border-gray-300/60 dark:border-gray-700/60',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  tiktok: {
    name: 'TikTok',
    bg: 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 border-neutral-300/60 dark:border-neutral-700/60',
    icon: (
      <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-.88-.07A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.47 6.27 6.27 0 0 0 1.83-4.47V8.04a8.27 8.27 0 0 0 4.75 1.48V6.08a4.85 4.85 0 0 1-.85-.14v.75z" />
      </svg>
    ),
  },
};

const renderStatusBadge = (status: PostStatus) => {
  switch (status) {
    case 'scheduled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/80 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-800/70">
          <Clock className="w-3.5 h-3.5" />
          <span>Scheduled</span>
        </span>
      );
    case 'published':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-800/70">
          <Check className="w-3.5 h-3.5" />
          <span>Published</span>
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80 dark:bg-rose-950/60 dark:text-rose-300 dark:border-rose-800/70">
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Failed</span>
        </span>
      );
  }
};

export const PostCard: React.FC<PostCardProps> = ({
  post,
  onRetry,
  isRetrying = false,
}) => {
  return (
    <article className="group relative bg-white dark:bg-[#181920] border border-gray-200/80 dark:border-gray-800 rounded-xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between text-left">
      <div>
        {/* Card Header: Platforms on left, Time + Status on right */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-gray-100 dark:border-gray-800/80">
          {/* Platforms Row */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {post.platforms.map((platform) => {
              const config = platformConfig[platform];
              if (!config) return null;
              return (
                <span
                  key={platform}
                  className={`inline-flex items-center justify-center p-1.5 rounded-lg border transition-transform group-hover:scale-105 ${config.bg}`}
                  title={config.name}
                  aria-label={config.name}
                >
                  {config.icon}
                </span>
              );
            })}
          </div>

          {/* Time & Status Badge */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400">
              <Clock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
              <span>{formatPostTime(post.scheduledAt)}</span>
            </span>
            {renderStatusBadge(post.status)}
          </div>
        </div>

        {/* Card Body: Content and optional media preview */}
        <div className="pt-3.5 flex flex-col sm:flex-row gap-4 items-start justify-between">
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-line leading-relaxed break-words font-normal">
              {post.content}
            </p>
          </div>

          {post.mediaUrl && (
            <div className="relative w-full sm:w-28 sm:h-28 h-44 rounded-lg overflow-hidden shrink-0 border border-gray-200/70 dark:border-gray-800/90 bg-gray-100 dark:bg-gray-800/50 shadow-xs">
              <img
                src={post.mediaUrl}
                alt="Post media preview"
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                loading="lazy"
              />
            </div>
          )}
        </div>
      </div>

      {/* Failed Post Alert & Retry Section */}
      {post.status === 'failed' && (
        <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-950/80">
          <div className="p-3 rounded-lg bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5 min-w-0">
              <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
              <div className="text-xs text-rose-800 dark:text-rose-200 font-medium break-words leading-relaxed">
                {post.errorMessage || 'Publishing failed. Please verify account permissions and retry.'}
              </div>
            </div>

            <button
              type="button"
              onClick={() => onRetry?.(post.id)}
              disabled={isRetrying}
              className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-1 disabled:opacity-60 disabled:cursor-not-allowed transition-all shrink-0 cursor-pointer shadow-xs"
              aria-label="Retry publishing post"
            >
              {isRetrying ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Retrying...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </article>
  );
};
