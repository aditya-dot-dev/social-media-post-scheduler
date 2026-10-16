import React, { useMemo } from 'react';
import { Calendar, CalendarX2 } from 'lucide-react';
import type { Post } from '../types/post';
import { groupPostsByDay } from '../utils/date';
import { PostCard } from './PostCard';

export interface PostQueueProps {
  posts: Post[];
  isLoading?: boolean;
  onRetry: (postId: string) => void;
  retryingPostIds: string[];
}

export const PostQueue: React.FC<PostQueueProps> = ({
  posts,
  isLoading = false,
  onRetry,
  retryingPostIds,
}) => {
  const groupedPosts = useMemo(() => groupPostsByDay(posts), [posts]);
  const hasPosts = posts.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-6" aria-busy="true" aria-label="Loading posts queue">
        <div className="space-y-4">
          {/* Skeleton Header */}
          <div className="flex items-center gap-3">
            <div className="h-5 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" />
            <div className="h-4 w-12 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" />
            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 animate-pulse" />
          </div>

          {/* Skeleton Cards */}
          <div className="grid grid-cols-1 gap-4">
            {[1, 2, 3, 4].map((index) => (
              <div
                key={index}
                className="bg-white dark:bg-[#181920] border border-gray-200/80 dark:border-gray-800 rounded-xl p-4 sm:p-5 shadow-xs animate-pulse"
              >
                {/* Header line */}
                <div className="flex items-center justify-between pb-3.5 border-b border-gray-100 dark:border-gray-800/80">
                  <div className="flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800" />
                    <div className="w-7 h-7 rounded-lg bg-gray-200 dark:bg-gray-800" />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-4 rounded bg-gray-200 dark:bg-gray-800" />
                    <div className="w-20 h-6 rounded-full bg-gray-200 dark:bg-gray-800" />
                  </div>
                </div>

                {/* Body line */}
                <div className="pt-3.5 flex flex-col sm:flex-row gap-4 items-start justify-between">
                  <div className="flex-1 space-y-2.5 w-full">
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-11/12" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                  </div>
                  <div className="w-full sm:w-28 sm:h-28 h-36 rounded-lg bg-gray-200 dark:bg-gray-800 shrink-0" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!hasPosts) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-[#181920]/40">
        <div className="w-14 h-14 rounded-2xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 shadow-xs border border-purple-100 dark:border-purple-900/50">
          <CalendarX2 className="w-7 h-7" />
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
          No posts found
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
          There are currently no scheduled, published, or failed posts matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8" aria-label="Scheduled posts queue">
      {Object.entries(groupedPosts).map(([groupTitle, dayPosts]) => (
        <section key={groupTitle} className="space-y-3.5">
          {/* Section Date Header */}
          <div className="flex items-center gap-2.5">
            <h2 className="text-sm sm:text-base font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2 shrink-0">
              <Calendar className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
              <span>{groupTitle}</span>
            </h2>

            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300 border border-gray-200/80 dark:border-gray-700/60 shrink-0">
              {dayPosts.length} {dayPosts.length === 1 ? 'post' : 'posts'}
            </span>

            <div className="h-px bg-gray-200 dark:bg-gray-800 flex-1 ml-1" />
          </div>

          {/* Posts List */}
          <div className="grid grid-cols-1 gap-3.5 sm:gap-4">
            {dayPosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onRetry={onRetry}
                isRetrying={retryingPostIds.includes(post.id)}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
