import { useState, useEffect, useCallback, useRef } from 'react';
import type { Platform, PostStatus } from '../types/post';

export type PlatformFilter = Platform | 'all';
export type StatusFilter = PostStatus | 'all';

export interface UsePostFiltersReturn {
  search: string;
  platform: PlatformFilter;
  status: StatusFilter;
  setSearch: (value: string | ((prev: string) => string)) => void;
  setPlatform: (value: PlatformFilter | ((prev: PlatformFilter) => PlatformFilter)) => void;
  setStatus: (value: StatusFilter | ((prev: StatusFilter) => StatusFilter)) => void;
  resetFilters: () => void;
}

const VALID_PLATFORMS: Platform[] = ['facebook', 'instagram', 'x', 'tiktok'];
const VALID_STATUSES: PostStatus[] = ['scheduled', 'published', 'failed'];

const isPlatform = (val: string | null): val is Platform => {
  return val !== null && VALID_PLATFORMS.includes(val as Platform);
};

const isPostStatus = (val: string | null): val is PostStatus => {
  return val !== null && VALID_STATUSES.includes(val as PostStatus);
};

const getInitialFilters = (): {
  search: string;
  platform: PlatformFilter;
  status: StatusFilter;
} => {
  if (typeof window === 'undefined') {
    return {
      search: '',
      platform: 'all',
      status: 'all',
    };
  }

  const params = new URLSearchParams(window.location.search);
  const qParam = params.get('q') ?? '';
  const platformParam = params.get('platform');
  const statusParam = params.get('status');

  return {
    search: qParam,
    platform: isPlatform(platformParam) ? platformParam : 'all',
    status: isPostStatus(statusParam) ? statusParam : 'all',
  };
};

const updateUrlParams = (
  newSearch: string,
  newPlatform: PlatformFilter,
  newStatus: StatusFilter
): void => {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);

  if (newSearch && newSearch.trim() !== '') {
    url.searchParams.set('q', newSearch.trim());
  } else {
    url.searchParams.delete('q');
  }

  if (newPlatform !== 'all') {
    url.searchParams.set('platform', newPlatform);
  } else {
    url.searchParams.delete('platform');
  }

  if (newStatus !== 'all') {
    url.searchParams.set('status', newStatus);
  } else {
    url.searchParams.delete('status');
  }

  const newUrl = url.pathname + (url.search ? url.search : '') + url.hash;
  window.history.replaceState(null, '', newUrl);
};

/**
 * Custom hook to manage search and filter states synced with URL query parameters.
 * Uses window.history.replaceState without requiring an external routing library.
 */
export const usePostFilters = (): UsePostFiltersReturn => {
  const [initial] = useState(getInitialFilters);

  const [search, setSearchState] = useState<string>(initial.search);
  const [platform, setPlatformState] = useState<PlatformFilter>(initial.platform);
  const [status, setStatusState] = useState<StatusFilter>(initial.status);

  const stateRef = useRef({ search, platform, status });

  useEffect(() => {
    stateRef.current = { search, platform, status };
  }, [search, platform, status]);

  // Listen to browser back/forward navigation
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const qParam = params.get('q') ?? '';
      const platformParam = params.get('platform');
      const statusParam = params.get('status');

      setSearchState(qParam);
      setPlatformState(isPlatform(platformParam) ? platformParam : 'all');
      setStatusState(isPostStatus(statusParam) ? statusParam : 'all');
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  const setSearch = useCallback((value: string | ((prev: string) => string)) => {
    setSearchState((prev) => {
      const next = typeof value === 'function' ? value(prev) : value;
      updateUrlParams(next, stateRef.current.platform, stateRef.current.status);
      return next;
    });
  }, []);

  const setPlatform = useCallback(
    (value: PlatformFilter | ((prev: PlatformFilter) => PlatformFilter)) => {
      setPlatformState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        updateUrlParams(stateRef.current.search, next, stateRef.current.status);
        return next;
      });
    },
    []
  );

  const setStatus = useCallback(
    (value: StatusFilter | ((prev: StatusFilter) => StatusFilter)) => {
      setStatusState((prev) => {
        const next = typeof value === 'function' ? value(prev) : value;
        updateUrlParams(stateRef.current.search, stateRef.current.platform, next);
        return next;
      });
    },
    []
  );

  const resetFilters = useCallback(() => {
    setSearchState('');
    setPlatformState('all');
    setStatusState('all');
    updateUrlParams('', 'all', 'all');
  }, []);

  return {
    search,
    platform,
    status,
    setSearch,
    setPlatform,
    setStatus,
    resetFilters,
  };
};
