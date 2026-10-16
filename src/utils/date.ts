import { format, isToday, isTomorrow, parseISO, startOfDay } from 'date-fns';
import type { Post } from '../types/post';

/**
 * Converts a UTC ISO string to local user time formatted like '02:30 PM'.
 *
 * @param utcString - ISO UTC timestamp string
 * @returns Formatted local time string (e.g., '02:30 PM')
 */
export const formatPostTime = (utcString: string): string => {
  return format(parseISO(utcString), 'hh:mm a');
};

/**
 * Returns a display title for the date group:
 * - 'Today' if the date falls on today in local time
 * - 'Tomorrow' if the date falls on tomorrow in local time
 * - Otherwise formatted as 'MMM d, yyyy' (e.g. 'Oct 20, 2026')
 *
 * @param utcString - ISO UTC timestamp string
 * @returns Group title string
 */
export const getDateGroupTitle = (utcString: string): string => {
  const date = parseISO(utcString);
  if (isToday(date)) {
    return 'Today';
  }
  if (isTomorrow(date)) {
    return 'Tomorrow';
  }
  return format(date, 'MMM d, yyyy');
};

/**
 * Helper to rank dates into chronological order tiers:
 * Tier 0: Today
 * Tier 1: Tomorrow
 * Tier 2: Future dates beyond tomorrow
 * Tier 3: Past dates
 */
const getDayCategoryScore = (date: Date): number => {
  if (isToday(date)) return 0;
  if (isTomorrow(date)) return 1;
  const todayStart = startOfDay(new Date());
  const dateStart = startOfDay(date);
  return dateStart > todayStart ? 2 : 3;
};

/**
 * Sorts posts chronologically by scheduledAt and groups them by day title,
 * preserving priority order: Today first, then Tomorrow, then chronological future/past dates.
 *
 * @param posts - Array of posts to group
 * @returns Record mapping day title to array of posts for that day
 */
export const groupPostsByDay = (posts: Post[]): Record<string, Post[]> => {
  const sortedPosts = [...posts].sort((a, b) => {
    const dateA = parseISO(a.scheduledAt);
    const dateB = parseISO(b.scheduledAt);

    const scoreA = getDayCategoryScore(dateA);
    const scoreB = getDayCategoryScore(dateB);

    if (scoreA !== scoreB) {
      return scoreA - scoreB;
    }

    return dateA.getTime() - dateB.getTime();
  });

  const grouped: Record<string, Post[]> = {};

  for (const post of sortedPosts) {
    const title = getDateGroupTitle(post.scheduledAt);
    if (!grouped[title]) {
      grouped[title] = [];
    }
    grouped[title].push(post);
  }

  return grouped;
};
